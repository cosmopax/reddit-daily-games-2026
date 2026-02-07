export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export class ServiceProxy {
    context: any;

    constructor(context: any) {
        this.context = context;
    }

    private async getSecret(key: string): Promise<string | undefined> {
        try {
            const val = await (this.context.settings as any)?.get(key);
            if (val) return val as string;
        } catch (e) {
            console.warn(`Failed to read setting ${key}`, e);
        }
        return undefined;
    }

    /**
     * Fetches daily search trends from Google Trends via SerpApi.
     * Fallback to hardcoded list on failure.
     */
    async fetchDailyTrends(count: number = 2): Promise<{ query: string; traffic: number; trafficDisplay: string }[]> {
        const apiKey = await this.getSecret('SERPAPI_KEY');
        if (!apiKey) {
            console.warn('Missing SERPAPI_KEY, using fallback trends');
            return this.getFallbackTrends(count);
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`SerpApi HTTP ${response.status}`);
            }

            const data: any = await response.json();
            const results: { query: string; traffic: number; trafficDisplay: string }[] = [];

            if (data.trending_searches && Array.isArray(data.trending_searches)) {
                for (const item of data.trending_searches) {
                    if (results.length >= count) break;
                    const query = item.query;
                    const trafficDisplay = item.formatted_traffic || "10K+";
                    let traffic = 0;
                    if (trafficDisplay) {
                        const numStr = trafficDisplay.replace(/[^0-9.]/g, '');
                        traffic = parseInt(numStr, 10) || 0;
                        if (trafficDisplay.toLowerCase().includes('k')) traffic *= 1000;
                        if (trafficDisplay.toLowerCase().includes('m')) traffic *= 1000000;
                    }
                    results.push({ query, traffic, trafficDisplay });
                }
            }

            // Pad with fallbacks if needed
            while (results.length < count) {
                const fallbacks = this.getFallbackTrends(count);
                results.push(fallbacks[results.length % fallbacks.length]);
            }

            return results;
        } catch (e) {
            console.error('Trend Fetch Error:', e);
            return this.getFallbackTrends(count);
        }
    }

    private getFallbackTrends(count: number): { query: string; traffic: number; trafficDisplay: string }[] {
        const pool = [
            { query: 'Minecraft', traffic: 500000, trafficDisplay: '500K+' },
            { query: 'Fortnite', traffic: 200000, trafficDisplay: '200K+' },
            { query: 'Taylor Swift', traffic: 350000, trafficDisplay: '350K+' },
            { query: 'AI Chatbots', traffic: 180000, trafficDisplay: '180K+' },
            { query: 'Reddit IPO', traffic: 120000, trafficDisplay: '120K+' },
            { query: 'SpaceX Launch', traffic: 280000, trafficDisplay: '280K+' },
        ];
        // Shuffle and return
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Generates an image using Replicate (Flux.1 schnell).
     * Returns a real image URL on success, or a themed placeholder on failure.
     */
    async generateImage(prompt: string, jobId: string): Promise<string> {
        // 1. Try Replicate (returns real URLs)
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
                    console.warn("Replicate billing exhausted.");
                } else if (response.ok) {
                    const data: any = await response.json();
                    if (data.status === 'succeeded' && data.output?.[0]) {
                        return data.output[0];
                    }
                    if (data.urls?.get) return data.urls.get;
                } else {
                    console.warn(`Replicate HTTP ${response.status}`);
                }
            } catch (e) {
                console.error('Replicate Error:', e);
            }
        }

        // 2. Fallback: Hugging Face (returns blob - try to use via router)
        const hfKey = await this.getSecret('HUGGINGFACE_TOKEN');
        if (hfKey) {
            try {
                const model = "black-forest-labs/FLUX.1-schnell";
                const url = `https://router.huggingface.co/hf-inference/models/${model}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${hfKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ inputs: prompt })
                });

                if (response.ok) {
                    // HF returns binary image data - convert to data URI
                    const blob = await response.arrayBuffer();
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(blob)));
                    return `data:image/png;base64,${base64}`;
                } else {
                    console.warn(`HF Error ${response.status}`);
                }
            } catch (e) {
                console.error('HF Error:', e);
            }
        }

        // 3. Final fallback: themed placeholder
        return `https://placehold.co/512x512/1A1A1B/FF4500?text=Meme+${jobId}`;
    }

    /**
     * Generates an AI move for the Duel game using Gemini.
     */
    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            return { move: 'Systems Offline (No Key)', damage: 0 };
        }

        const models = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const systemPrompt = `You are "Cyber-Valkyrie", a fearsome AI combat opponent in a cyberpunk text RPG.
Battle history:
${history.slice(-8).join('\n')}

Reply with ONLY valid JSON (no markdown):
{"move": "Your dramatic counter-attack description (1-2 sentences)", "damage": <integer 1-20>}

Be creative, thematic, and intimidating. Vary your attacks.`;

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
                        const parsed = JSON.parse(cleanJson);
                        return { move: parsed.move || 'Unknown Attack', damage: Math.min(20, Math.max(0, parsed.damage || 5)) };
                    }
                } else {
                    console.warn(`Gemini ${model} failed: ${response.status}`);
                }
            } catch (e) {
                console.error(`Gemini ${model} Error:`, e);
            }
        }

        return { move: 'Static Noise', damage: 5 };
    }

    /**
     * Evaluates a user's attack move using Gemini and returns damage + narrative.
     */
    async evaluateUserMove(move: string, history: string[]): Promise<{ damage: number; narrative: string }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            return { damage: Math.floor(Math.random() * 15) + 3, narrative: move };
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const prompt = `You are the narrator of a cyberpunk combat RPG. The player just used this attack:
"${move}"

Battle context (last few turns):
${history.slice(-6).join('\n')}

Rate the attack's effectiveness and describe the impact. Reply with ONLY valid JSON:
{"damage": <integer 1-25>, "narrative": "Brief vivid description of the attack landing (1 sentence)"}

Creative/unique attacks should deal more damage. Generic attacks deal less. Range: 1-25.`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                const data: any = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(cleanJson);
                    return {
                        damage: Math.min(25, Math.max(1, parsed.damage || 8)),
                        narrative: parsed.narrative || move
                    };
                }
            }
        } catch (e) {
            console.error('User move eval error:', e);
        }

        // Fallback: random damage
        return { damage: Math.floor(Math.random() * 15) + 3, narrative: `You unleash: ${move}` };
    }

    /**
     * Generates a character portrait using Replicate/HF.
     */
    async generateCharacterPortrait(archetype: string, region: string = 'Neo-Tokyo', style: 'Corporate' | 'Valkyrie' = 'Corporate'): Promise<string> {
        let descriptor = "confident expression, professional attire, sleek neon lighting";
        if (style === 'Valkyrie') {
            descriptor = "cyberpunk warrior, holographic armor, ethereal glow, captivating gaze, 8k resolution";
        }
        const prompt = `Cinematic portrait of a ${archetype}, ${region} style, ${descriptor}, Unreal Engine 5 render, Cyberpunk aesthetic.`;
        const randomId = Math.random().toString(36).substring(7);
        return this.generateImage(prompt, `char_${randomId}`);
    }
}
