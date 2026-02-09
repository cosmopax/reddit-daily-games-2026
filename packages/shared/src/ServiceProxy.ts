export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const PROXY_TIMEOUT_MS = 8000;
const PROXY_MAX_RETRIES = 2;

export class ServiceProxy {
    context: any;

    constructor(context: any) {
        this.context = context;
    }

    private log(scope: string, message: string): void {
        console.log(`[ServiceProxy:${scope}] ${message}`);
    }

    private wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

    private isRetryableStatus(status: number): boolean {
        return status === 408 || status === 429 || status >= 500;
    }

    private classifyError(error: unknown): string {
        if (error instanceof Error) {
            if (error.name === 'AbortError') return 'timeout';
            return 'exception';
        }
        return 'unknown';
    }

    private async fetchWithRetry(scope: string, url: string, init: RequestInit): Promise<Response> {
        let lastError: unknown;
        for (let attempt = 0; attempt <= PROXY_MAX_RETRIES; attempt++) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

            try {
                this.log(scope, `attempt=${attempt + 1} timeoutMs=${PROXY_TIMEOUT_MS}`);
                const response = await fetch(url, {
                    ...init,
                    signal: controller.signal,
                });

                if (response.ok) return response;

                if (!this.isRetryableStatus(response.status) || attempt === PROXY_MAX_RETRIES) {
                    return response;
                }

                const backoffMs = 300 * (attempt + 1);
                this.log(scope, `retryable_status=${response.status} backoffMs=${backoffMs}`);
                await this.wait(backoffMs);
            } catch (error) {
                lastError = error;
                if (attempt === PROXY_MAX_RETRIES) {
                    throw error;
                }
                const backoffMs = 300 * (attempt + 1);
                this.log(scope, `retryable_error=${this.classifyError(error)} backoffMs=${backoffMs}`);
                await this.wait(backoffMs);
            } finally {
                clearTimeout(timeout);
            }
        }

        if (lastError) throw lastError;
        throw new Error('unreachable');
    }

    private parseJsonFromModelText(text: string): any {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    /**
     * Fetches daily search trends from Google Trends via SerpApi.
     * Fallback to hardcoded list on failure.
     */
    async fetchDailyTrends(count: number = 2): Promise<{ query: string; traffic: number; trafficDisplay: string }[]> {
        const dateSeed = new Date().toISOString().slice(0, 10);
        const apiKey = await this.getSecret('SERPAPI_KEY');
        if (!apiKey) {
            this.log('trends', 'missing SERPAPI_KEY, using fallback');
            return this.getFallbackTrends(count, dateSeed);
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${apiKey}`;
            const response = await this.fetchWithRetry('trends', url, { method: 'GET' });

            if (!response.ok) {
                this.log('trends', `http_status=${response.status} using fallback`);
                return this.getFallbackTrends(count, dateSeed);
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
                const fallbacks = this.getFallbackTrends(count, dateSeed);
                results.push(fallbacks[results.length % fallbacks.length]);
            }

            this.log('trends', `success count=${results.length}`);
            return results;
        } catch (e) {
            this.log('trends', `error_class=${this.classifyError(e)} using fallback`);
            return this.getFallbackTrends(count, dateSeed);
        }
    }

    private hashSeed(seed: string): number {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    private getFallbackTrends(count: number, seed: string): { query: string; traffic: number; trafficDisplay: string }[] {
        const pool = [
            { query: 'Minecraft', traffic: 500000, trafficDisplay: '500K+' },
            { query: 'Fortnite', traffic: 200000, trafficDisplay: '200K+' },
            { query: 'Taylor Swift', traffic: 350000, trafficDisplay: '350K+' },
            { query: 'AI Chatbots', traffic: 180000, trafficDisplay: '180K+' },
            { query: 'Reddit IPO', traffic: 120000, trafficDisplay: '120K+' },
            { query: 'SpaceX Launch', traffic: 280000, trafficDisplay: '280K+' },
        ];

        // Deterministic rotation by day for fair fallback variety.
        const start = this.hashSeed(seed) % pool.length;
        const out = [];
        for (let i = 0; i < Math.min(count, pool.length); i++) {
            out.push(pool[(start + i) % pool.length]);
        }
        return out;
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
                const response = await this.fetchWithRetry('image.replicate', url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${replicateKey}`,
                        "Content-Type": "application/json",
                        "Prefer": "wait"
                    },
                    body: JSON.stringify({ input: { prompt, go_fast: true, megapixels: "1" } })
                });

                if (response.status === 402) {
                    this.log('image.replicate', 'billing_exhausted=1');
                } else if (response.ok) {
                    const data: any = await response.json();
                    if (data.status === 'succeeded' && data.output?.[0]) {
                        this.log('image.replicate', 'success=1');
                        return data.output[0];
                    }
                    if (data.urls?.get) {
                        this.log('image.replicate', 'success=1 pending_url_returned=1');
                        return data.urls.get;
                    }
                } else {
                    this.log('image.replicate', `http_status=${response.status}`);
                }
            } catch (e) {
                this.log('image.replicate', `error_class=${this.classifyError(e)}`);
            }
        }

        // 2. Fallback: Hugging Face (returns blob - try to use via router)
        const hfKey = await this.getSecret('HUGGINGFACE_TOKEN');
        if (hfKey) {
            try {
                const model = "black-forest-labs/FLUX.1-schnell";
                const url = `https://router.huggingface.co/hf-inference/models/${model}`;
                const response = await this.fetchWithRetry('image.huggingface', url, {
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
                    const base64 = this.arrayBufferToBase64(blob);
                    this.log('image.huggingface', 'success=1');
                    return `data:image/png;base64,${base64}`;
                } else {
                    this.log('image.huggingface', `http_status=${response.status}`);
                }
            } catch (e) {
                this.log('image.huggingface', `error_class=${this.classifyError(e)}`);
            }
        }

        // 3. Final fallback: themed placeholder
        this.log('image', `using_placeholder=1 jobId=${jobId}`);
        return `https://placehold.co/512x512/1A1A1B/FF4500?text=Meme+${jobId}`;
    }

    /**
     * Generates an AI move for the Duel game using Gemini.
     */
    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            this.log('duel.ai', 'missing GEMINI_API_KEY');
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

                const response = await this.fetchWithRetry(`duel.ai.${model}`, url, {
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
                        const parsed = this.parseJsonFromModelText(text);
                        this.log(`duel.ai.${model}`, 'success=1');
                        return { move: parsed.move || 'Unknown Attack', damage: Math.min(20, Math.max(0, parsed.damage || 5)) };
                    }
                } else {
                    this.log(`duel.ai.${model}`, `http_status=${response.status}`);
                }
            } catch (e) {
                this.log(`duel.ai.${model}`, `error_class=${this.classifyError(e)}`);
            }
        }

        this.log('duel.ai', 'using_static_fallback=1');
        return { move: 'Static Noise', damage: 5 };
    }

    /**
     * Evaluates a user's attack move using Gemini and returns damage + narrative.
     */
    async evaluateUserMove(move: string, history: string[]): Promise<{ damage: number; narrative: string }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            this.log('duel.userMove', 'missing GEMINI_API_KEY using_random_fallback=1');
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

            const response = await this.fetchWithRetry('duel.userMove', url, {
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
                    const parsed = this.parseJsonFromModelText(text);
                    this.log('duel.userMove', 'success=1');
                    return {
                        damage: Math.min(25, Math.max(1, parsed.damage || 8)),
                        narrative: parsed.narrative || move
                    };
                }
            }
        } catch (e) {
            this.log('duel.userMove', `error_class=${this.classifyError(e)} using_random_fallback=1`);
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
