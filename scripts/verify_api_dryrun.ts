
import { ServiceProxy } from '../packages/shared/src/index';

// Mock Devvit Context
const mockContext: any = {
    settings: {
        get: async (key: string) => {
            return process.env[key];
        }
    },
    userId: 'test-user-local'
};

async function main() {
    console.log("--- Starting API Verification Dry Run ---");
    console.log("Checking for API Keys in env...");

    const keys = ['SERPAPI_KEY', 'REPLICATE_API_TOKEN', 'GEMINI_API_KEY'];
    const missing = keys.filter(k => !process.env[k]);
    if (missing.length > 0) {
        console.warn(`WARNING: Missing environment variables: ${missing.join(', ')}`);
        console.warn("Some tests mock fail or use fallbacks.");
    }

    const proxy = new ServiceProxy(mockContext);

    // 1. Trends
    console.log("\n[1] Testing fetchDailyTrend (SerpApi)...");
    const trend = await proxy.fetchDailyTrend();
    console.log(`Result: ${trend}`);

    // 2. Gemini
    console.log("\n[2] Testing generateAiMove (Gemini)...");
    const move = await proxy.generateAiMove(['User casts Fireball!', 'AI took 10 damage.']);
    console.log(`Result:`, move);

    // 3. Flux
    console.log("\n[3] Testing generateImage (Fal/Replicate)...");
    const image = await proxy.generateImage("A futuristic reddit robot", "job-123");
    console.log(`Result: ${image}`);

    console.log("\n--- Verification Complete ---");
}

main().catch(console.error);
