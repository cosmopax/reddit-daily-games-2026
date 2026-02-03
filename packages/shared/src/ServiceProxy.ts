import { Context } from '@devvit/public-api';

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export class ServiceProxy {
    context: Context;
    baseUrl: string;

    constructor(context: Context, baseUrl: string = 'https://proxy.reddit-hackathon.com') {
        this.context = context;
        this.baseUrl = baseUrl;
    }

    async fetchJson<T>(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<ServiceResponse<T>> {
        try {
            const request: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Reddit-User': this.context.userId || 'anon',
                },
                body: body ? JSON.stringify(body) : undefined,
            };

            const response = await fetch(`${this.baseUrl}${endpoint}`, request);

            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }

            const data = await response.json();
            return { success: true, data };
        } catch (e: any) {
            console.error(`ServiceProxy Error [${endpoint}]:`, e);
            return { success: false, error: e.message };
        }
    }

    // --- Domain Specific Methods ---

    async fetchDailyTrend(): Promise<string> {
        const res = await this.fetchJson<{ trend: string }>('/api/trends/daily', 'GET');
        return res.data?.trend || 'Unknown Trend';
    }

    async generateImage(prompt: string, jobId: string): Promise<string> {
        const res = await this.fetchJson<{ imageUrl: string }>('/api/flux/generate', 'POST', { prompt, jobId });
        // Fallback Mock if proxy is down during Hackathon dev
        if (!res.success) return `https://placeholder.com/mock_${jobId}.png`;
        return res.data?.imageUrl || '';
    }

    async generateAiMove(history: string[]): Promise<{ move: string; damage: number }> {
        const res = await this.fetchJson<{ move: string; damage: number }>('/api/gemini/duel', 'POST', { history });
        if (!res.success || !res.data) {
            return { move: 'Glitch Attack', damage: 5 };
        }
        return res.data;
    }
}
