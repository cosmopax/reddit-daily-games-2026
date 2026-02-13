import { Context } from '@devvit/public-api';
import { RedisWrapper, Leaderboard } from 'shared';
import {
    TriviaQuestion, Category, Difficulty, CATEGORIES, DIFFICULTY_POINTS,
    pickRandomQuestions, getQuestionsByCategoryAndDifficulty,
} from './data/questions';
import {
    GameSessionState, RoundConfig, createNewSession,
    getPointsForDifficulty, getAiDifficulty, getAdaptiveAiDifficulty, simulateAiAnswer,
} from './models/GameSession';

// Re-export for backward compatibility with main.tsx
export type { GameSessionState as DuelState };

const DEFAULT_ROUNDS = 5;

export class DuelServer {
    redis: RedisWrapper;
    context: any;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    private getKey(userId: string) {
        return `trivia:v3:${userId}`;
    }

    /** Generate round configs: one category per round, with 3 questions (one per difficulty) */
    private generateRounds(
        totalRounds: number,
        categories: Category[],
        excludeIds: string[] = []
    ): RoundConfig[] {
        const rounds: RoundConfig[] = [];
        const usedIds = new Set(excludeIds);

        for (let i = 0; i < totalRounds; i++) {
            const category = categories[i % categories.length];

            const easyPool = pickRandomQuestions(1, category, 'easy', [...usedIds]);
            const normalPool = pickRandomQuestions(1, category, 'normal', [...usedIds]);
            const hardPool = pickRandomQuestions(1, category, 'hard', [...usedIds]);

            const easy = easyPool[0];
            const normal = normalPool[0];
            const hard = hardPool[0];

            if (easy) usedIds.add(easy.id);
            if (normal) usedIds.add(normal.id);
            if (hard) usedIds.add(hard.id);

            rounds.push({
                category,
                questionsByDifficulty: { easy, normal, hard },
            });
        }

        return rounds;
    }

    async getGameState(userId: string): Promise<GameSessionState> {
        const raw = await this.context.redis.get(this.getKey(userId));
        if (raw) {
            try {
                const state = JSON.parse(raw) as GameSessionState;
                // Migration: skip old v2 states
                if ((state as any).userHealth !== undefined || (state as any).userScore !== undefined) {
                    await this.context.redis.del(this.getKey(userId));
                } else if (state.phase) {
                    return state;
                }
            } catch (e) { /* corrupted, start fresh */ }
        }

        return this.createNewGame(userId);
    }

    async createNewGame(
        userId: string,
        options?: { totalRounds?: number; categories?: Category[]; timerSeconds?: number }
    ): Promise<GameSessionState> {
        // Shuffle categories for variety
        const cats = options?.categories || [...CATEGORIES].sort(() => Math.random() - 0.5);
        const totalRounds = options?.totalRounds || DEFAULT_ROUNDS;

        const session = createNewSession(userId, {
            totalRounds,
            categories: cats,
            timerSeconds: options?.timerSeconds || 15,
        });

        session.rounds = this.generateRounds(totalRounds, cats);
        session.usedQuestionIds = session.rounds.flatMap(r => [
            r.questionsByDifficulty.easy?.id,
            r.questionsByDifficulty.normal?.id,
            r.questionsByDifficulty.hard?.id,
        ].filter(Boolean) as string[]);

        await this.context.redis.set(this.getKey(userId), JSON.stringify(session));
        return session;
    }

    /** Player selects difficulty for current round */
    async selectDifficulty(userId: string, difficulty: Difficulty): Promise<GameSessionState> {
        const state = await this.getGameState(userId);
        if (state.phase !== 'difficulty_select' && state.phase !== 'category_reveal') return state;

        const round = state.rounds[state.currentRound];
        if (!round) return state;

        state.selectedDifficulty = difficulty;
        state.currentQuestion = round.questionsByDifficulty[difficulty];
        state.phase = 'answering';

        // AI picks difficulty adaptively based on score gap
        const aiDiff = getAdaptiveAiDifficulty(state.player.score, state.ai.score, state.currentRound);
        const aiQuestion = round.questionsByDifficulty[aiDiff];
        const aiAnswer = simulateAiAnswer(aiQuestion.correctIndex, aiQuestion.options.length, aiDiff);

        // Store AI's round data
        state.ai.difficultyChoices.push(aiDiff);
        state.ai.answers.push(aiAnswer);
        state.ai.correct.push(aiAnswer === aiQuestion.correctIndex);
        if (aiAnswer === aiQuestion.correctIndex) {
            state.ai.score += getPointsForDifficulty(aiDiff);
        }

        state.player.difficultyChoices.push(difficulty);

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    /** Player submits their answer */
    async submitAnswer(userId: string, answerIndex: number): Promise<GameSessionState> {
        const state = await this.getGameState(userId);
        if (state.phase !== 'answering' || !state.currentQuestion) return state;

        const q = state.currentQuestion;
        const isCorrect = answerIndex === q.correctIndex;

        state.player.answers.push(answerIndex);
        state.player.correct.push(isCorrect);
        if (isCorrect) {
            state.player.score += getPointsForDifficulty(state.selectedDifficulty!);
        }

        state.phase = 'round_result';

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    /** Advance to next round or end game */
    async nextRound(userId: string): Promise<GameSessionState> {
        const state = await this.getGameState(userId);
        if (state.phase !== 'round_result') return state;

        state.currentRound++;
        state.selectedDifficulty = null;
        state.currentQuestion = null;

        if (state.currentRound >= state.totalRounds) {
            // TIEBREAKER: If scores tied, add one sudden death round
            if (state.player.score === state.ai.score && state.totalRounds <= 6) {
                // Generate one more round
                const cats = state.categories.length > 0 ? state.categories : [...CATEGORIES];
                const tiebreakCat = cats[Math.floor(Math.random() * cats.length)];
                const extraRounds = this.generateRounds(1, [tiebreakCat], state.usedQuestionIds);
                if (extraRounds.length > 0) {
                    state.rounds.push(extraRounds[0]);
                    state.totalRounds += 1;
                    state.phase = 'category_reveal';
                    (state as any).isTiebreaker = true;
                    await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
                    return state;
                }
            }

            state.phase = 'game_over';

            // Streak tracking
            const streakKey = `user:${userId}:duel_streak`;
            const won = state.player.score > state.ai.score;
            let streak = 0;
            if (won) {
                streak = await this.context.redis.incrBy(streakKey, 1);
            } else {
                await this.context.redis.set(streakKey, '0');
            }
            // Store best streak
            const bestStreakKey = `user:${userId}:duel_best_streak`;
            const bestRaw = await this.context.redis.get(bestStreakKey);
            const best = Number(bestRaw || '0');
            if (streak > best) {
                await this.context.redis.set(bestStreakKey, String(streak));
            }
            // Store total games
            await this.context.redis.incrBy(`user:${userId}:duel_games`, 1);

            // Sync leaderboard
            try {
                const lb = new Leaderboard(this.context, 'game4_duel');
                let username = 'Trivia Player';
                try {
                    const user = await this.context.reddit.getUserById(userId);
                    if (user) username = user.username;
                } catch (e) { }
                const winsKey = `user:${userId}:trivia_wins`;
                const totalWins = won
                    ? await this.context.redis.incrBy(winsKey, 1)
                    : Number(await this.context.redis.get(winsKey) || '0');
                await lb.submitScore(userId, username, totalWins);
            } catch (e) { }
        } else {
            state.phase = 'category_reveal';
        }

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    /** Start choosing difficulty (after seeing category) */
    async proceedToDifficultySelect(userId: string): Promise<GameSessionState> {
        const state = await this.getGameState(userId);
        if (state.phase !== 'category_reveal') return state;
        state.phase = 'difficulty_select';
        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async getPlayerStats(userId: string): Promise<{ wins: number; streak: number; bestStreak: number; games: number }> {
        const [winsRaw, streakRaw, bestRaw, gamesRaw] = await Promise.all([
            this.context.redis.get(`user:${userId}:trivia_wins`),
            this.context.redis.get(`user:${userId}:duel_streak`),
            this.context.redis.get(`user:${userId}:duel_best_streak`),
            this.context.redis.get(`user:${userId}:duel_games`),
        ]);
        return {
            wins: Number(winsRaw || '0'),
            streak: Number(streakRaw || '0'),
            bestStreak: Number(bestRaw || '0'),
            games: Number(gamesRaw || '0'),
        };
    }

    async resetGame(userId: string): Promise<GameSessionState> {
        await this.context.redis.del(this.getKey(userId));
        return await this.createNewGame(userId);
    }

    /** Save final score to a post's challenge board so other players can see it */
    async savePostChallenge(postId: string, userId: string, score: number, won: boolean): Promise<void> {
        try {
            let username = 'Player';
            try {
                const u = await this.context.reddit.getUserById(userId);
                if (u) username = u.username;
            } catch (e) { }
            const entry = JSON.stringify({ username, score, won, timestamp: Date.now() });
            await this.context.redis.hSet(`challenge:${postId}`, { [userId]: entry });
        } catch (e) {
            console.error('Failed to save post challenge:', e);
        }
    }

    /** Get all players' results for a specific post */
    async getPostChallengeBoard(postId: string): Promise<{ username: string; score: number; won: boolean }[]> {
        try {
            const raw = await this.context.redis.hGetAll(`challenge:${postId}`);
            if (!raw) return [];
            return Object.values(raw)
                .map((v: any) => { try { return JSON.parse(v as string); } catch { return null; } })
                .filter(Boolean)
                .sort((a: any, b: any) => b.score - a.score);
        } catch (e) {
            return [];
        }
    }
}
