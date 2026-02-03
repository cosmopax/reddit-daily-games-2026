import { Context } from '@devvit/public-api';

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export class ServiceProxy {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    /**
     * Helper to get secrets safely. 
     * Assumes secrets are set in Devvit app settings or plain variables.
     */
    private async getSecret(key: string): Promise<string | undefined> {
        // Try getting from settings if available (standard pattern)
        // Or specific secret storage if the platform supports it.
        // For Devvit 0.11+, context.settings.get is common for app configs.
        // We'll try settings first.
        try {
            // @ts-ignore
            const val = await this.context.settings?.get(key);
            if (val) return val as string;
        } catch (e) {
            console.warn(`Failed to read setting ${key}`, e);
        }
        return undefined;
    }

    // --- Domain Specific Methods ---

    /**
     * Fetches the current daily search trend from Google Trends via SerpApi.
     * Fallback to a hardcoded list on failure.
     */
    async fetchDailyTrend(): Promise<string> {
        const apiKey = await this.getSecret('SERPAPI_KEY');
        if (!apiKey) {
            console.warn('Missing SERPAPI_KEY');
            return 'Minecraft'; // Fallback
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&frequency=daily&geo=US&api_key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`SerpApi HTTP ${response.status}`);
            }

            const data = await response.json();
            // Parse SerpApi response for the first trending query
            if (data.daily_searches?.[0]?.searches?.[0]?.query) {
                return data.daily_searches[0].searches[0].query;
            }
        } catch (e) {
            console.error('Trend Fetch Error:', e);
        }
        return 'Retro Gaming'; // Fallback
    }

    /**
     * Generates an image using Flux.1 via Replicate HTTP API.
     * Note: Devvit has a 30s timeout. Replicate 'schnell' models are fast enough (~2-5s).
     */
    async generateImage(prompt: string, jobId: string): Promise<string> {
        const apiKey = await this.getSecret('REPLICATE_API_TOKEN');
        if (!apiKey) {
            console.warn('Missing REPLICATE_API_TOKEN');
            return `https://placeholder.com/mock_${jobId}.png`;
        }

        try {
            // Use the "models" endpoint to avoid hardcoding version hashes
            // https://api.replicate.com/v1/models/{model_owner}/{model_name}/predictions
            const url = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`, // Replicate Standard is "Bearer", formerly "Token" (both often work, but Bearer is safer for new API)
                    "Content-Type": "application/json",
                    "Prefer": "wait"
                },
                body: JSON.stringify({
                    input: {
                        prompt,
                        // aspect_ratio is not supported by all flux-schnell wrappers, removing to be safe
                        // or check specific model docs. standard flux-schnell on replicate often just takes prompt.
                        go_fast: true,
                        megapixels: "1"
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Replicate HTTP ${response.status}: ${errText}`);
            }

            const data = await response.json();

            if (data.status === 'succeeded' && data.output && data.output[0]) {
                return data.output[0];
            } else {
                return data.urls?.get || '';
            }

        } catch (e) {
            console.error('Image Gen Error:', e);
        }
        return `https://placeholder.com/error_${jobId}.png`;
    }

    /**
     * Generates an AI move for the Duel game using Google Gemini 1.5 Flash.
     */
    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('Missing GEMINI_API_KEY');
            return { move: 'Systems Offline', damage: 0 };
        }

        try {
            // Switch to 1.5 Flash (Verified Stable)
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            // Construct a prompt context
            const systemPrompt = `
You are a combat AI in a text RPG. The user casts spells at you.
History:
${history.join('\n')}

Reply with valid JSON ONLY:
{ "move": "Description of your counter-attack", "damage": <integer 0-20> }
Make the move thematic and cool.
            `;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini HTT ${response.status}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (textResponse) {
                // Sanitize markdown code blocks if present
                const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                return {
                    move: parsed.move || 'Critical Glitch',
                    damage: typeof parsed.damage === 'number' ? parsed.damage : 10
                };
            }

        } catch (e) {
            console.error('Duel AI Error:', e);
        }

        return { move: 'Static Noise', damage: 5 };
    }
}
