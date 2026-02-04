import { Context } from '@devvit/public-api';

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface TrendResult {
    query: string;
    traffic: number;
    trafficDisplay: string;
}

export class ServiceProxy {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    private defaultTrends(count: number): TrendResult[] {
        const fallback: TrendResult[] = [
            { query: 'Minecraft', traffic: 500000, trafficDisplay: '500K+' },
            { query: 'Fortnite', traffic: 200000, trafficDisplay: '200K+' },
            { query: 'Retro Gaming', traffic: 50000, trafficDisplay: '50K+' },
            { query: 'AI Coding', traffic: 42000, trafficDisplay: '42K+' }
        ];
        return fallback.slice(0, Math.max(1, count));
    }

    private async fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs: number = 12000): Promise<Response> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            return await fetch(url, { ...init, signal: controller.signal });
        } finally {
            clearTimeout(timeout);
        }
    }

    private parseTrafficDisplay(rawTraffic: string | undefined): { traffic: number; trafficDisplay: string } {
        const trafficDisplay = rawTraffic || '10K+';
        const numeric = parseFloat(trafficDisplay.replace(/[^0-9.]/g, ''));
        if (Number.isNaN(numeric)) {
            return { traffic: 0, trafficDisplay };
        }

        const lower = trafficDisplay.toLowerCase();
        const multiplier = lower.includes('m') ? 1_000_000 : lower.includes('k') ? 1_000 : 1;
        return { traffic: Math.round(numeric * multiplier), trafficDisplay };
    }

    private findFirstUrl(value: unknown): string | undefined {
        if (typeof value === 'string' && /^https?:\/\//.test(value)) {
            return value;
        }

        if (Array.isArray(value)) {
            for (const item of value) {
                const url = this.findFirstUrl(item);
                if (url) return url;
            }
            return undefined;
        }

        if (value && typeof value === 'object') {
            const objectValue = value as Record<string, unknown>;
            const commonKeys = ['url', 'image', 'output', 'output_url', 'generated_image'];
            for (const key of commonKeys) {
                if (key in objectValue) {
                    const url = this.findFirstUrl(objectValue[key]);
                    if (url) return url;
                }
            }
            for (const nested of Object.values(objectValue)) {
                const url = this.findFirstUrl(nested);
                if (url) return url;
            }
        }

        return undefined;
    }

    private parseAiMove(raw: string): { move: string; damage: number } | undefined {
        const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonCandidate = cleaned.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonCandidate) return undefined;

        try {
            const parsed = JSON.parse(jsonCandidate) as { move?: unknown; damage?: unknown };
            const move = typeof parsed.move === 'string' ? parsed.move.trim() : '';
            const numericDamage = typeof parsed.damage === 'number'
                ? parsed.damage
                : Number.parseInt(String(parsed.damage ?? ''), 10);
            const safeDamage = Number.isFinite(numericDamage)
                ? Math.max(0, Math.min(20, Math.round(numericDamage)))
                : 5;

            if (!move) return undefined;
            return { move, damage: safeDamage };
        } catch {
            return undefined;
        }
    }

    /**
     * Helper to get secrets safely.
     * Supports multiple candidate keys for compatibility across environments.
     */
    private async getSecret(...keys: string[]): Promise<string | undefined> {
        for (const key of keys) {
            try {
                // @ts-ignore Devvit context has settings in runtime.
                const settingValue = await this.context.settings?.get(key);
                if (typeof settingValue === 'string' && settingValue.trim().length > 0) {
                    return settingValue.trim();
                }
            } catch (e) {
                console.warn(`Failed to read setting ${key}`, e);
            }

            if (typeof process !== 'undefined' && process.env?.[key]) {
                return process.env[key];
            }
        }

        return undefined;
    }

    // --- Domain Specific Methods ---

    /**
     * Fetches the current daily search trend from Google Trends via SerpApi.
     * Fallback to a hardcoded list on failure.
     */
    async fetchDailyTrends(count: number = 2): Promise<TrendResult[]> {
        const apiKey = await this.getSecret('SERPAPI_KEY');
        if (!apiKey) {
            console.warn('Missing SERPAPI_KEY');
            return this.defaultTrends(count);
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${apiKey}`;
            const response = await this.fetchWithTimeout(url, {}, 10000);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`SerpApi HTTP ${response.status}: ${errText}`);
            }

            const data: any = await response.json();
            const results: TrendResult[] = [];

            if (data.trending_searches && Array.isArray(data.trending_searches)) {
                for (const item of data.trending_searches) {
                    if (results.length >= count) break;

                    const query = item.query;
                    if (typeof query !== 'string' || query.trim().length === 0) continue;

                    const { traffic, trafficDisplay } = this.parseTrafficDisplay(item.formatted_traffic);
                    results.push({ query, traffic, trafficDisplay });
                }
            }

            // Backfill if not enough real data.
            if (results.length < count) {
                for (const fallback of this.defaultTrends(count)) {
                    if (results.length >= count) break;
                    if (!results.find((entry) => entry.query === fallback.query)) {
                        results.push(fallback);
                    }
                }
            }

            return results.slice(0, count);

        } catch (e) {
            console.error('Trend Fetch Error:', e);
            return this.defaultTrends(count);
        }
    }

    /**
     * Compatibility helper for older call-sites that expect a single trend string.
     */
    async fetchDailyTrend(): Promise<string> {
        const [topTrend] = await this.fetchDailyTrends(1);
        return topTrend?.query ?? 'Trend unavailable';
    }

    /**
     * Generates an image using Replicate (Flux) or Hugging Face Fallback.
     * Note: Devvit has a 30s timeout. Replicate 'schnell' models are fast enough (~2-5s).
     */
    async generateImage(prompt: string, jobId: string): Promise<string> {
        // 1. Try Replicate (Fastest, Best Quality)
        const replicateKey = await this.getSecret('REPLICATE_API_TOKEN', 'REPLICATE_API_KEY');
        if (replicateKey) {
            try {
                const url = 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions';
                const response = await this.fetchWithTimeout(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${replicateKey}`,
                        'Content-Type': 'application/json',
                        Prefer: 'wait'
                    },
                    body: JSON.stringify({ input: { prompt, go_fast: true, megapixels: "1" } })
                }, 15000);

                if (response.status === 402) {
                    console.warn('Replicate billing exhausted. Falling back to Hugging Face...');
                } else if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Replicate HTTP ${response.status}: ${errText}`);
                } else {
                    const data: any = await response.json();
                    const replicateUrl = this.findFirstUrl(data.output) || this.findFirstUrl(data.urls);
                    if (replicateUrl) return replicateUrl;
                }
            } catch (e) {
                console.error('Replicate Error:', e);
            }
        }

        // 2. Fallback: Hugging Face Inference API (Free Tier often available)
        const hfKey = await this.getSecret('HUGGINGFACE_TOKEN');
        if (hfKey) {
            try {
                const model = 'stabilityai/stable-diffusion-xl-base-1.0';
                const url = `https://router.huggingface.co/hf-inference/models/${model}`;

                const response = await this.fetchWithTimeout(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${hfKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inputs: prompt })
                }, 20000);

                if (response.ok) {
                    const contentType = response.headers.get('content-type') || 'image/png';

                    if (contentType.includes('application/json')) {
                        const payload = await response.json();
                        const jsonUrl = this.findFirstUrl(payload);
                        if (jsonUrl) return jsonUrl;
                        console.warn('HF JSON response did not include image URL payload.');
                    } else {
                        const imageBuffer = Buffer.from(await response.arrayBuffer());
                        const mime = contentType.split(';')[0] || 'image/png';
                        return `data:${mime};base64,${imageBuffer.toString('base64')}`;
                    }
                } else {
                    const errText = await response.text();
                    console.warn(`HF Error ${response.status}: ${errText}`);
                }
            } catch (e) {
                console.error('HF Error:', e);
            }
        }

        return `https://dummyimage.com/1024x1024/111111/ffffff.png&text=Generation+Unavailable+${jobId}`;
    }

    /**
     * Generates an AI move for the Duel game using Gemini models.
     */
    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const apiKey = await this.getSecret('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('Missing GEMINI_API_KEY');
            return { move: 'Systems Offline (No Key)', damage: 0 };
        }

        const models = [
            'gemini-2.0-flash',
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-pro'
        ];

        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const systemPrompt = [
                    'You are a combat AI in a text RPG.',
                    'History:',
                    history.join('\n'),
                    '',
                    'Reply with strict JSON only:',
                    '{"move":"counter attack text","damage":0}',
                    'Constraints: damage must be an integer from 0 to 20.'
                ].join('\n');

                const response = await this.fetchWithTimeout(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt }] }],
                        generationConfig: {
                            responseMimeType: 'application/json',
                            temperature: 0.7
                        }
                    })
                }, 12000);

                if (response.ok) {
                    const data: any = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const parsed = this.parseAiMove(text);
                        if (parsed) return parsed;
                    }
                } else {
                    const err = await response.text();
                    console.warn(`Gemini ${model} failed: ${response.status} - ${err}`);
                    if (response.status === 429) {
                        break;
                    }
                }
            } catch (e) {
                console.error(`Gemini ${model} Error:`, e);
            }
        }

        return { move: 'Static Noise', damage: 5 };
    }

    async generateCharacterPortrait(archetype: string, region: string = 'Neo-Tokyo', style: 'Corporate' | 'Valkyrie' = 'Corporate'): Promise<string> {
        let descriptor = "confident expression, professional attire, sleek neon lighting";

        if (style === 'Valkyrie') {
            descriptor = "stunningly beautiful, charisma 20, high-fashion vogue editorial, cyberpunk goddess, holographic armor accents, ethereal glow, captivating gaze, intricate details, 8k resolution";
        }

        const prompt = `Cinematic portrait of a ${archetype}, ${region} style, ${descriptor}, Unreal Engine 5 render, Cyberpunk aesthetic.`;

        // Reuse generateImage logic (which handles Replicate/HF fallback)
        // We use a random ID for the job to ensure uniqueness
        const randomId = Math.random().toString(36).substring(7);
        return this.generateImage(prompt, `char_${randomId}`);
    }
}
