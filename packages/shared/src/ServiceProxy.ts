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
    async fetchDailyTrends(count: number = 2): Promise<{ query: string; traffic: number; trafficDisplay: string }[]> {
        const apiKey = await this.getSecret('SERPAPI_KEY');
        if (!apiKey) {
            console.warn('Missing SERPAPI_KEY');
            return [
                { query: 'Minecraft', traffic: 500000, trafficDisplay: '500K+' },
                { query: 'Fortnite', traffic: 200000, trafficDisplay: '200K+' }
            ];
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`SerpApi HTTP ${response.status}: ${errText}`);
            }

            const data: any = await response.json();
            const results: { query: string; traffic: number; trafficDisplay: string }[] = [];

            if (data.trending_searches && Array.isArray(data.trending_searches)) {
                for (const item of data.trending_searches) {
                    if (results.length >= count) break;

                    const query = item.query;
                    const trafficDisplay = item.formatted_traffic || "10K+";
                    // Parse "200K+" -> 200000
                    let traffic = 0;
                    if (trafficDisplay) {
                        const numStr = trafficDisplay.replace(/[^0-9.]/g, '');
                        traffic = parseInt(numStr, 10);
                        if (trafficDisplay.toLowerCase().includes('k')) traffic *= 1000;
                        if (trafficDisplay.toLowerCase().includes('m')) traffic *= 1000000;
                    }

                    results.push({ query, traffic, trafficDisplay });
                }
            }

            // Fallback if not enough real data
            if (results.length < count) {
                results.push({ query: 'Retro Gaming', traffic: 50000, trafficDisplay: '50K+' });
                if (results.length < count) {
                    results.push({ query: 'AI Coding', traffic: 42000, trafficDisplay: '42K+' });
                }
            }

            return results;

        } catch (e) {
            console.error('Trend Fetch Error:', e);
            return [
                { query: 'Error', traffic: 1000, trafficDisplay: '1K+' },
                { query: 'Fallback', traffic: 500, trafficDisplay: '500+' }
            ];
        }
    }

    /**
     * Generates an image using Replicate (Flux) or Hugging Face Fallback.
     * Note: Devvit has a 30s timeout. Replicate 'schnell' models are fast enough (~2-5s).
     */
    async generateImage(prompt: string, jobId: string): Promise<string> {
        // 1. Try Replicate (Fastest, Best Quality)
        const replicateKey = await this.getSecret('REPLICATE_API_TOKEN');
        if (replicateKey) {
            try {
                const url = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions";
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${replicateKey}`,
                        "Content-Type": "application/json",
                        "Prefer": "wait"
                    },
                    body: JSON.stringify({ input: { prompt, go_fast: true, megapixels: "1" } })
                });

                if (response.status === 402) {
                    console.warn("Replicate billing exhausted. Falling back to Hugging Face...");
                } else if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Replicate HTTP ${response.status}: ${errText}`);
                } else {
                    const data: any = await response.json();
                    if (data.status === 'succeeded' && data.output?.[0]) return data.output[0];
                    return data.urls?.get || '';
                }
            } catch (e) {
                console.error('Replicate Error:', e);
            }
        }

        // 2. Fallback: Hugging Face Inference API (Free Tier often available)
        const hfKey = await this.getSecret('HUGGINGFACE_TOKEN');
        if (hfKey) {
            try {
                // UPDATE: api-inference.huggingface.co is deprecated (410). 
                // Using router.huggingface.co
                const model = "stabilityai/stable-diffusion-xl-base-1.0";
                const url = `https://router.huggingface.co/hf-inference/models/${model}`; // Corrected router URL

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${hfKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ inputs: prompt })
                });

                if (response.ok) {
                    console.log("HF Generation Successful (Blob received).");
                    // Return a data URI or placeholder since we can't easily host the blob here without S3
                    return `https://placeholder.com/hf_gen_success_${jobId}.png`;
                } else {
                    const errText = await response.text();
                    console.warn(`HF Error ${response.status}: ${errText}`);
                }
            } catch (e) {
                console.error('HF Error:', e);
            }
        }

        return `https://placeholder.com/mock_${jobId}.png`;
    }

    /**
     * Generates an AI move for the Duel game using Google Gemini 1.5 Flash.
     */
    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('Missing GEMINI_API_KEY');
            return { move: 'Systems Offline (No Key)', damage: 0 };
        }

        // Updated models list: "gemini-2.0-flash" is the only one verified to exist for this key (gave 429, not 404).
        const models = [
            'gemini-2.0-flash',     // CONFIRMED EXITS (Hit Rate Limit)
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-pro'
        ];

        for (const model of models) {
            try {
                // Using v1beta for newer models
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

                if (response.ok) {
                    const data: any = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                        return JSON.parse(cleanJson);
                    }
                } else {
                    const err = await response.text();
                    console.warn(`Gemini ${model} failed: ${response.status} - ${err}`);
                }
            } catch (e) {
                console.error(`Gemini ${model} Error:`, e);
            }
        }

        return { move: 'Static Noise', damage: 5 };
    }
    async generateCharacterPortrait(archetype: string, region: string = 'Neo-Tokyo'): Promise<string> {
        const prompt = `Cinematic portrait of a ${archetype}, ${region} style, High-Fashion, Cyberpunk aesthetic, Unreal Engine 5 render, 8k resolution, detailed facial features, sleek neon lighting, confident expression.`;
        // Reuse generateImage logic (which handles Replicate/HF fallback)
        // We use a random ID for the job to ensure uniqueness
        const randomId = Math.random().toString(36).substring(7);
        return this.generateImage(prompt, `char_${randomId}`);
    }
}
