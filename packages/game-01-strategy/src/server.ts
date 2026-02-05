import { Context, JobContext } from '@devvit/public-api';
import { Leaderboard, getTodayEpisode } from 'shared';
import { ASSETS, AssetType } from './types';

const V2_KEY_PREFIX = 'strategy:v2:';
const STARTER_CASH = ASSETS.lemonade_stand.cost;

type StrategyBoost = {
    sourceEpisodeId: string;
    choiceId: 'a' | 'b';
    label: string;
    multiplier: number;
    reward: number;
    expiresAt: number;
};

export type Advisor = {
    id: string;
    name: string;
    role: string;
    perk: string;
    multiplier: number;
};

export type ContractOption = {
    id: 'a' | 'b';
    title: string;
    flavor: string;
    reward: number;
    multiplier: number;
};

type StrategyStateV2 = {
    cash: number;
    lastTick: number;
    assets: Record<AssetType, number>;
    advisors: Advisor[];
    boost?: StrategyBoost;
    contractsDone: string[]; // episode ids
};

export type StrategyView = {
    cash: number;
    lastTick: number;
    assets: Record<AssetType, number>;
    assetValue: number;
    hourlyIncome: number;
    incomeMultiplier: number;
    netWorth: number;
    tier: string;
    totalAssetsOwned: number;
    advisors: Advisor[];
    boost?: StrategyBoost;
    todaysContracts: ContractOption[];
    hasAcceptedContractToday: boolean;
};

function clampKeepLast<T>(arr: T[], keep: number): T[] {
    if (arr.length <= keep) return arr;
    return arr.slice(arr.length - keep);
}

function computeAssetValue(assets: Record<AssetType, number>): number {
    let value = 0;
    for (const [id, cfg] of Object.entries(ASSETS) as [AssetType, (typeof ASSETS)[AssetType]][]) {
        value += (assets[id] || 0) * cfg.cost;
    }
    return value;
}

function computeBaseHourlyIncome(assets: Record<AssetType, number>): number {
    let income = 0;
    for (const [id, cfg] of Object.entries(ASSETS) as [AssetType, (typeof ASSETS)[AssetType]][]) {
        income += (assets[id] || 0) * cfg.incomePerHour;
    }
    return income;
}

function tierForNetWorth(netWorth: number): string {
    if (netWorth >= 20000) return 'Neon Titan';
    if (netWorth >= 6000) return 'Street Baron';
    if (netWorth >= 1200) return 'Hustler';
    return 'Rookie';
}

function getAdvisorCatalog(): Array<{ threshold: number; advisor: Advisor }> {
    return [
        {
            threshold: 500,
            advisor: { id: 'nyx', name: 'Oracle Nyx', role: 'Seer', perk: '+5% income (pattern edge)', multiplier: 1.05 },
        },
        {
            threshold: 2500,
            advisor: { id: 'vex', name: 'CEO Vex', role: 'Rival Coach', perk: '+5% income (pressure)', multiplier: 1.05 },
        },
        {
            threshold: 9000,
            advisor: { id: 'quanta', name: 'Quanta', role: 'Quantum Analyst', perk: '+5% income (delta hedges)', multiplier: 1.05 },
        },
    ];
}

export class GameStrategyServer {
    context: Context | JobContext;

    constructor(context: Context | JobContext) {
        this.context = context;
    }

    private key(userId: string): string {
        return `${V2_KEY_PREFIX}${userId}`;
    }

    private async migrateFromV1IfPresent(userId: string): Promise<StrategyStateV2 | null> {
        // V1 was stored as a delimited packed hash field on `user:v1:<id>`; advisors were not reliably persisted.
        const v1Key = `user:v1:${userId}`;
        const packed = await this.context.redis.hGet(v1Key, 'state');
        if (!packed) return null;

        const parts = packed.split(':');
        const cash = Number(parts[0] || 0) || 0;
        const lastTick = Number(parts[1] || 0) || Date.now();

        // parts[2] was intended as advisors_json (but was numeric-packed); ignore it.
        const assetIds = Object.keys(ASSETS) as AssetType[];
        const assets: Record<AssetType, number> = {} as any;
        for (let i = 0; i < assetIds.length; i++) {
            const idx = 3 + i;
            assets[assetIds[i]] = Number(parts[idx] || 0) || 0;
        }

        const state: StrategyStateV2 = {
            cash,
            lastTick,
            assets,
            advisors: [],
            contractsDone: [],
        };
        await this.context.redis.set(this.key(userId), JSON.stringify(state));
        return state;
    }

    private async loadState(userId: string): Promise<{ state: StrategyStateV2; dirty: boolean }> {
        const raw = await this.context.redis.get(this.key(userId));
        if (raw) {
            try {
                return { state: JSON.parse(raw) as StrategyStateV2, dirty: false };
            } catch {
                // fall through to re-init
            }
        }

        const migrated = await this.migrateFromV1IfPresent(userId);
        if (migrated) return { state: migrated, dirty: false };

        const assets: Record<AssetType, number> = {
            lemonade_stand: 0,
            newspaper_route: 0,
            crypto_miner: 0,
            ai_startup: 0,
        };
        const state: StrategyStateV2 = {
            cash: STARTER_CASH,
            lastTick: Date.now(),
            assets,
            advisors: [],
            contractsDone: [],
        };
        await this.context.redis.set(this.key(userId), JSON.stringify(state));
        return { state, dirty: false };
    }

    private computeIncomeMultiplier(state: StrategyStateV2, now: number): { mult: number; boost?: StrategyBoost; dirty: boolean } {
        let dirty = false;
        let mult = 1;

        // Advisors stack multiplicatively (small, predictable).
        for (const a of state.advisors || []) {
            mult *= a.multiplier || 1;
        }

        // Contract boost (expires).
        if (state.boost) {
            if (state.boost.expiresAt <= now) {
                state.boost = undefined;
                dirty = true;
            } else {
                mult *= state.boost.multiplier;
            }
        }

        return { mult, boost: state.boost, dirty };
    }

    private async applyAccruedIncome(state: StrategyStateV2): Promise<{ state: StrategyStateV2; dirty: boolean; hourlyIncome: number; incomeMultiplier: number; assetValue: number }> {
        const now = Date.now();
        const baseIncome = computeBaseHourlyIncome(state.assets);
        const assetValue = computeAssetValue(state.assets);

        const totalAssetsOwned = Object.values(state.assets).reduce((s, n) => s + (n || 0), 0);
        if (totalAssetsOwned === 0 && state.cash < STARTER_CASH) {
            state.cash = STARTER_CASH;
        }

        const multResult = this.computeIncomeMultiplier(state, now);
        const incomeMultiplier = multResult.mult;
        let dirty = multResult.dirty;

        const elapsedMs = Math.max(0, now - (state.lastTick || now));
        const elapsedHours = elapsedMs / 3600000;
        if (elapsedHours > 0.0001 && baseIncome > 0) {
            const earned = baseIncome * incomeMultiplier * elapsedHours;
            state.cash += earned;
            state.lastTick = now;
            dirty = true;
        }

        return { state, dirty, hourlyIncome: Math.round(baseIncome * incomeMultiplier), incomeMultiplier, assetValue };
    }

    private maybeUnlockAdvisors(state: StrategyStateV2, netWorth: number): boolean {
        let dirty = false;
        const catalog = getAdvisorCatalog();
        const existing = new Set((state.advisors || []).map((a) => a.id));
        for (const item of catalog) {
            if (netWorth >= item.threshold && !existing.has(item.advisor.id)) {
                state.advisors = [...(state.advisors || []), item.advisor];
                dirty = true;
            }
        }
        return dirty;
    }

    private contractsForEpisode(episodeId: string, signalA: string, signalB: string): ContractOption[] {
        // Deterministic-ish: keep stable so players can discuss.
        const a: ContractOption = {
            id: 'a',
            title: `Sweep ${signalA}`,
            flavor: 'Quiet acquisition. Clean compounding.',
            reward: 160,
            multiplier: 1.12,
        };
        const b: ContractOption = {
            id: 'b',
            title: `Front-run ${signalB}`,
            flavor: 'Risky sprint. Loud profit.',
            reward: 320,
            multiplier: 1.07,
        };
        // Subtle variation by episode parity.
        const day = Number(episodeId.slice(-2));
        return day % 2 === 0 ? [a, b] : [b, a];
    }

    async getUserView(userId: string): Promise<StrategyView> {
        const episode = await getTodayEpisode(this.context as Context);
        const { state: loaded, dirty: preDirty } = await this.loadState(userId);
        const { state, dirty: incomeDirty, hourlyIncome, incomeMultiplier, assetValue } = await this.applyAccruedIncome(loaded);

        const netWorth = Math.round(state.cash + assetValue);
        const unlockDirty = this.maybeUnlockAdvisors(state, netWorth);

        const totalAssetsOwned = Object.values(state.assets).reduce((s, n) => s + (n || 0), 0);

        const signalA = episode.signals?.[0]?.query || 'Signal A';
        const signalB = episode.signals?.[1]?.query || 'Signal B';
        const todaysContracts = this.contractsForEpisode(episode.id, signalA, signalB);

        const hasAcceptedContractToday = (state.contractsDone || []).includes(episode.id);

        const dirty = preDirty || incomeDirty || unlockDirty;
        if (dirty) {
            await this.context.redis.set(this.key(userId), JSON.stringify(state));
        }

        return {
            cash: Math.round(state.cash),
            lastTick: state.lastTick,
            assets: state.assets,
            assetValue,
            hourlyIncome,
            incomeMultiplier,
            netWorth,
            tier: tierForNetWorth(netWorth),
            totalAssetsOwned,
            advisors: state.advisors || [],
            boost: state.boost,
            todaysContracts,
            hasAcceptedContractToday,
        };
    }

    async acceptContract(userId: string, choiceId: 'a' | 'b'): Promise<boolean> {
        const episode = await getTodayEpisode(this.context as Context);
        const { state } = await this.loadState(userId);
        const signalA = episode.signals?.[0]?.query || 'Signal A';
        const signalB = episode.signals?.[1]?.query || 'Signal B';
        const contracts = this.contractsForEpisode(episode.id, signalA, signalB);

        if ((state.contractsDone || []).includes(episode.id)) return false;
        const chosen = contracts.find((c) => c.id === choiceId) || contracts[0];

        state.cash += chosen.reward;
        state.boost = {
            sourceEpisodeId: episode.id,
            choiceId,
            label: chosen.title,
            multiplier: chosen.multiplier,
            reward: chosen.reward,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        state.contractsDone = clampKeepLast([...(state.contractsDone || []), episode.id], 14);
        state.lastTick = Date.now();
        await this.context.redis.set(this.key(userId), JSON.stringify(state));

        await this.syncLeaderboard(userId, Math.round(state.cash + computeAssetValue(state.assets)));
        return true;
    }

    async buyAsset(userId: string, assetType: AssetType, amount: number = 1): Promise<boolean> {
        const cfg = ASSETS[assetType];
        const { state } = await this.loadState(userId);
        const incomeApplied = await this.applyAccruedIncome(state);
        const s = incomeApplied.state;

        const totalCost = cfg.cost * amount;
        if (s.cash < totalCost) return false;

        s.cash -= totalCost;
        s.assets[assetType] = (s.assets[assetType] || 0) + amount;
        s.lastTick = Date.now();
        await this.context.redis.set(this.key(userId), JSON.stringify(s));

        await this.syncLeaderboard(userId, Math.round(s.cash + computeAssetValue(s.assets)));
        return true;
    }

    async onHourlyTick(_event: any) {
        // No-op for now: we accrue lazily on view/actions.
    }

    async syncLeaderboard(userId: string, netWorth: number): Promise<void> {
        const lb = new Leaderboard(this.context as Context, 'game1_strategy');
        let username = 'Unknown CEO';
        try {
            const user = await (this.context as Context).reddit.getUserById(userId);
            if (user) username = user.username;
        } catch { }
        await lb.submitScore(userId, username, netWorth);
    }

    async getLeaderboard() {
        const lb = new Leaderboard(this.context as Context, 'game1_strategy');
        return lb.getTop(10);
    }
}

