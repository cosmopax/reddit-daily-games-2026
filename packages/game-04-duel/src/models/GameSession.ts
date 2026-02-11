import { TriviaQuestion, Category, Difficulty, DIFFICULTY_POINTS, CATEGORIES } from '../data/questions';

export interface PlayerState {
    score: number;
    answers: (number | null)[];  // answer index per round
    difficultyChoices: Difficulty[];  // difficulty chosen per round
    correct: boolean[];  // whether each answer was correct
}

export interface RoundConfig {
    category: Category;
    questionsByDifficulty: {
        easy: TriviaQuestion;
        normal: TriviaQuestion;
        hard: TriviaQuestion;
    };
}

export interface GameSessionState {
    sessionId: string;
    userId: string;
    totalRounds: number;
    currentRound: number;

    // Round configs (pre-generated)
    rounds: RoundConfig[];

    // Current round state
    selectedDifficulty: Difficulty | null;
    currentQuestion: TriviaQuestion | null;

    // Player states
    player: PlayerState;
    ai: PlayerState;

    // Game phases
    phase: 'category_reveal' | 'difficulty_select' | 'answering' | 'round_result' | 'game_over';

    // Configuration
    categories: Category[];  // categories in play
    timerSeconds: number;

    // Tracking
    usedQuestionIds: string[];
    startedAt: number;
}

export function createNewSession(
    userId: string,
    options?: {
        totalRounds?: number;
        categories?: Category[];
        timerSeconds?: number;
    }
): Omit<GameSessionState, 'rounds'> & { rounds: RoundConfig[] } {
    const totalRounds = options?.totalRounds || 5;
    const categories = options?.categories || [...CATEGORIES];
    const timerSeconds = options?.timerSeconds || 15;
    const sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
        sessionId,
        userId,
        totalRounds,
        currentRound: 0,
        rounds: [], // Will be populated by DuelServer
        selectedDifficulty: null,
        currentQuestion: null,
        player: { score: 0, answers: [], difficultyChoices: [], correct: [] },
        ai: { score: 0, answers: [], difficultyChoices: [], correct: [] },
        phase: 'category_reveal',
        categories,
        timerSeconds,
        usedQuestionIds: [],
        startedAt: Date.now(),
    };
}

export function getPointsForDifficulty(difficulty: Difficulty): number {
    return DIFFICULTY_POINTS[difficulty];
}

export function getAiDifficulty(): Difficulty {
    // AI picks difficulty with weighted randomness: 30% easy, 45% normal, 25% hard
    const roll = Math.random();
    if (roll < 0.30) return 'easy';
    if (roll < 0.75) return 'normal';
    return 'hard';
}

/** Adaptive AI: shifts toward harder difficulties when losing, easier when winning */
export function getAdaptiveAiDifficulty(playerScore: number, aiScore: number, round: number): Difficulty {
    const gap = playerScore - aiScore;
    const roll = Math.random();

    if (gap >= 4) {
        // Player dominating → AI goes aggressive
        if (roll < 0.10) return 'easy';
        if (roll < 0.40) return 'normal';
        return 'hard'; // 60% hard
    } else if (gap >= 2) {
        // Player ahead → AI leans harder
        if (roll < 0.15) return 'easy';
        if (roll < 0.50) return 'normal';
        return 'hard'; // 50% hard
    } else if (gap <= -3) {
        // AI dominating → plays conservatively (cocky)
        if (roll < 0.45) return 'easy';
        if (roll < 0.80) return 'normal';
        return 'hard'; // 20% hard
    }

    // Close game → default weights
    return getAiDifficulty();
}

export function simulateAiAnswer(correctIndex: number, numOptions: number, difficulty: Difficulty): number {
    // AI accuracy scales with difficulty chosen:
    // easy: 80% correct, normal: 60%, hard: 40%
    const accuracy = difficulty === 'easy' ? 0.80 : difficulty === 'normal' ? 0.60 : 0.40;

    if (Math.random() < accuracy) return correctIndex;

    let wrong = Math.floor(Math.random() * numOptions);
    while (wrong === correctIndex) wrong = Math.floor(Math.random() * numOptions);
    return wrong;
}
