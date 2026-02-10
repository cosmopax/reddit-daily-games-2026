import { Context } from '@devvit/public-api';
import { RedisWrapper, ServiceProxy, Leaderboard } from 'shared';

const ROUNDS_PER_GAME = 5;

export interface TriviaQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
}

export interface DuelState {
    questions: TriviaQuestion[];
    currentRound: number;
    userScore: number;
    aiScore: number;
    userAnswer: number | null;   // index the user picked
    aiAnswer: number;            // index the AI "picked"
    showResult: boolean;         // showing answer for current round
    gameOver: boolean;
    totalRounds: number;
}

/** Hardcoded trivia pool — instant load, no API calls needed */
const TRIVIA_POOL: TriviaQuestion[] = [
    { question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctIndex: 1, category: "Science" },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correctIndex: 2, category: "Geography" },
    { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Da Vinci", "Raphael", "Rembrandt"], correctIndex: 1, category: "Art" },
    { question: "What year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], correctIndex: 1, category: "History" },
    { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correctIndex: 2, category: "Science" },
    { question: "Which country has the most time zones?", options: ["Russia", "USA", "France", "China"], correctIndex: 2, category: "Geography" },
    { question: "What is the speed of light (approx)?", options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"], correctIndex: 0, category: "Science" },
    { question: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"], correctIndex: 1, category: "Literature" },
    { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correctIndex: 2, category: "Math" },
    { question: "Which element has atomic number 1?", options: ["Helium", "Hydrogen", "Lithium", "Carbon"], correctIndex: 1, category: "Science" },
    { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2, category: "Geography" },
    { question: "How many chromosomes do humans have?", options: ["23", "44", "46", "48"], correctIndex: 2, category: "Biology" },
    { question: "What is the hardest natural substance?", options: ["Titanium", "Diamond", "Quartz", "Sapphire"], correctIndex: 1, category: "Science" },
    { question: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctIndex: 1, category: "Space" },
    { question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Core Processing Unit"], correctIndex: 1, category: "Tech" },
    { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correctIndex: 1, category: "Geography" },
    { question: "Who discovered penicillin?", options: ["Pasteur", "Fleming", "Lister", "Koch"], correctIndex: 1, category: "Science" },
    { question: "What is the boiling point of water in Fahrenheit?", options: ["100°F", "180°F", "212°F", "250°F"], correctIndex: 2, category: "Science" },
    { question: "Which programming language was created first?", options: ["C", "Python", "Fortran", "Java"], correctIndex: 2, category: "Tech" },
    { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correctIndex: 2, category: "Science" },
    { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Hawking", "Bohr"], correctIndex: 1, category: "Science" },
    { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], correctIndex: 2, category: "Geography" },
    { question: "Which organ is the largest in the human body?", options: ["Liver", "Brain", "Skin", "Lungs"], correctIndex: 2, category: "Biology" },
    { question: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], correctIndex: 2, category: "Tech" },
    { question: "What is the square root of 144?", options: ["10", "11", "12", "14"], correctIndex: 2, category: "Math" },
];

function pickRandomQuestions(count: number): TriviaQuestion[] {
    const shuffled = [...TRIVIA_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/** AI "guesses" — gets it right ~60% of the time to be competitive */
function simulateAiAnswer(correctIndex: number, numOptions: number): number {
    if (Math.random() < 0.6) return correctIndex;
    // Pick a wrong answer
    let wrong = Math.floor(Math.random() * numOptions);
    while (wrong === correctIndex) wrong = Math.floor(Math.random() * numOptions);
    return wrong;
}

export class DuelServer {
    redis: RedisWrapper;
    context: any;

    constructor(context: Context) {
        this.redis = new RedisWrapper(context.redis);
        this.context = context;
    }

    private getKey(userId: string) {
        return `trivia:v2:${userId}`;
    }

    async getGameState(userId: string): Promise<DuelState> {
        const raw = await this.context.redis.get(this.getKey(userId));
        if (raw) {
            try {
                const state = JSON.parse(raw) as DuelState;
                // Migration check: if old combat state, start fresh
                if ((state as any).userHealth !== undefined) {
                    await this.context.redis.del(this.getKey(userId));
                } else {
                    return state;
                }
            } catch (e) { /* corrupted, start fresh */ }
        }

        // New game — instant, no API calls
        const questions = pickRandomQuestions(ROUNDS_PER_GAME);
        const firstAiAnswer = simulateAiAnswer(questions[0].correctIndex, questions[0].options.length);

        const newState: DuelState = {
            questions,
            currentRound: 0,
            userScore: 0,
            aiScore: 0,
            userAnswer: null,
            aiAnswer: firstAiAnswer,
            showResult: false,
            gameOver: false,
            totalRounds: ROUNDS_PER_GAME,
        };

        await this.context.redis.set(this.getKey(userId), JSON.stringify(newState));
        return newState;
    }

    async submitAnswer(userId: string, answerIndex: number): Promise<DuelState> {
        const state = await this.getGameState(userId);
        if (state.gameOver || state.showResult) return state;

        const q = state.questions[state.currentRound];
        state.userAnswer = answerIndex;

        // Score
        if (answerIndex === q.correctIndex) state.userScore++;
        if (state.aiAnswer === q.correctIndex) state.aiScore++;

        state.showResult = true;

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async nextRound(userId: string): Promise<DuelState> {
        const state = await this.getGameState(userId);
        if (state.gameOver) return state;

        state.currentRound++;
        state.userAnswer = null;
        state.showResult = false;

        if (state.currentRound >= state.totalRounds) {
            state.gameOver = true;
            // Sync leaderboard
            try {
                const lb = new Leaderboard(this.context, 'game4_duel');
                let username = 'Trivia Player';
                try {
                    const user = await this.context.reddit.getUserById(userId);
                    if (user) username = user.username;
                } catch (e) { }
                // Score = total wins
                const winsKey = `user:${userId}:trivia_wins`;
                const totalWins = state.userScore > state.aiScore
                    ? await this.context.redis.incrBy(winsKey, 1)
                    : Number(await this.context.redis.get(winsKey) || '0');
                await lb.submitScore(userId, username, totalWins);
            } catch (e) { }
        } else {
            // Pre-compute AI answer for next round
            const nextQ = state.questions[state.currentRound];
            state.aiAnswer = simulateAiAnswer(nextQ.correctIndex, nextQ.options.length);
        }

        await this.context.redis.set(this.getKey(userId), JSON.stringify(state));
        return state;
    }

    async resetGame(userId: string): Promise<DuelState> {
        await this.context.redis.del(this.getKey(userId));
        return await this.getGameState(userId);
    }
}
