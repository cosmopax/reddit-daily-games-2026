export type AssetType = 'lemonade_stand' | 'newspaper_route' | 'crypto_miner' | 'ai_startup';

export interface AssetConfig {
    id: AssetType;
    cost: number;
    incomePerHour: number;
    name: string;
}

export const ASSETS: Record<AssetType, AssetConfig> = {
    lemonade_stand: { id: 'lemonade_stand', cost: 100, incomePerHour: 10, name: 'Lemonade Stand' },
    newspaper_route: { id: 'newspaper_route', cost: 500, incomePerHour: 60, name: 'Newspaper Route' },
    crypto_miner: { id: 'crypto_miner', cost: 2500, incomePerHour: 350, name: 'Crypto Miner' },
    ai_startup: { id: 'ai_startup', cost: 10000, incomePerHour: 1500, name: 'AI Startup' },
};

export interface UserState {
    cash: number;
    netWorth: number;
    assets: Record<AssetType, number>;
    lastTick: number; // Timestamp of last income processing
}
