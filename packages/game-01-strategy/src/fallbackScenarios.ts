import { DailyScenario } from './types';

/**
 * Pre-written Vic/Sal scenarios for when Gemini is unavailable.
 * Each teaches a real financial concept through the Seinen Noir lens.
 * Vic = WSB degen energy, high risk.  Sal = Wire-style wisdom, conservative.
 */
export const FALLBACK_SCENARIOS: DailyScenario[] = [
    {
        id: 'scenario_short_squeeze',
        headline: 'MEME STOCK SURGES 400% ON REDDIT HYPE',
        narrative: 'The street is buzzing. A dying video game retailer just went vertical. Every delivery kid and barista is checking their brokerage app. The suits on Wall Street are sweating through their Ferragamos.',
        financialConcept: 'Short Squeeze',
        illegalAnalogy: 'Imagine a bookie takes bets that a fighter will lose. But the crowd loves the underdog so much they bet the other way — now the bookie has to pay out more than he collected. That\'s a short squeeze. The house gets burned by its own greed.',
        vic: {
            dialogue: 'BRO. This is the play. Diamond hands or die trying. These hedge fund clowns borrowed shares they can\'t return — we ARE the exit liquidity now. YOLO everything. 🚀🚀🚀',
            action: 'Go all-in on the meme stock',
            multiplierRange: [0.3, 4.5],
        },
        sal: {
            dialogue: 'Kid, I\'ve seen this movie. The crowd always thinks they\'re the wolf — turns out they\'re the sheep. Take 5% fun money, ride the wave, but keep your empire intact. The house always wins... eventually.',
            action: 'Small speculative position, protect the core',
            multiplierRange: [0.9, 1.4],
        },
    },
    {
        id: 'scenario_compound_interest',
        headline: 'CENTRAL BANK HOLDS RATES AT 20-YEAR HIGH',
        narrative: 'The Fed chair just dropped the hammer. Rates aren\'t moving. The bond market groans. But somewhere in the shadows, patient money is smiling. High rates mean high-yield savings are printing free cash for those who wait.',
        financialConcept: 'Compound Interest',
        illegalAnalogy: 'Think of a loan shark who lets the vig ride. First week it\'s $100. Next week it\'s $110. Month later? $260. That\'s compound interest working for the shark. Now imagine YOU\'RE the shark — but legal. Your money earns money, and that money earns money. Einstein called it the eighth wonder of the world.',
        vic: {
            dialogue: 'Savings accounts are for CHUMPS. While your money sits earning 5%, mine\'s in leveraged growth plays earning 50%. Fortune favors the degen. Time in the market beats timing the market? Nah — LEVERAGE beats everything.',
            action: 'Leverage into growth stocks',
            multiplierRange: [0.5, 2.8],
        },
        sal: {
            dialogue: 'Lock it in. 5.5% guaranteed, compounding daily. In 10 years that\'s not 55% — it\'s 71%. Do nothing. Let time work. The streets taught me: the real gangsters never rush.',
            action: 'Move cash to high-yield savings',
            multiplierRange: [1.05, 1.15],
        },
    },
    {
        id: 'scenario_diversification',
        headline: 'TECH SECTOR CRASHES — AI BUBBLE BURSTING?',
        narrative: 'Silicon Valley woke up to a bloodbath. The magnificent seven just became the tragic seven. Every portfolio heavy on tech is hemorrhaging. But the old heads who spread their bets? They\'re eating breakfast like nothing happened.',
        financialConcept: 'Diversification',
        illegalAnalogy: 'A smart dealer never keeps all his stash in one spot. Apartment here, storage unit there, cousin\'s garage. When the cops raid one location, you lose a piece — not everything. That\'s diversification. Spread the risk, survive the raid.',
        vic: {
            dialogue: 'BUY THE DIP! Tech is the future, this is just a shakeout. Warren Buffett said be greedy when others are fearful. I\'m being MAXIMUM greedy. All in on AI. This time it\'s different!',
            action: 'Double down on crashed tech stocks',
            multiplierRange: [0.4, 3.2],
        },
        sal: {
            dialogue: 'This is why we spread. Real estate, bonds, commodities, international. My portfolio dropped 3% while the tech bros lost 40%. Boring wins. Diversify or die — that\'s street law AND Wall Street law.',
            action: 'Rebalance across multiple sectors',
            multiplierRange: [0.85, 1.25],
        },
    },
    {
        id: 'scenario_margin_trading',
        headline: 'BROKER OFFERS 10X LEVERAGE ON CRYPTO',
        narrative: 'A new trading app just dropped and it\'s offering 10x leverage on Bitcoin. Your $1,000 moves like $10,000. The upside is intoxicating. The downside? Liquidation in a heartbeat.',
        financialConcept: 'Margin Trading & Leverage',
        illegalAnalogy: 'Imagine borrowing a kilo from a supplier on credit to flip it fast. If the price goes up, you\'re a genius — pay back the supplier, keep the profit. If the price crashes? The supplier doesn\'t care about your losses. He wants his money. That margin call hits different.',
        vic: {
            dialogue: 'TEN X LEVERAGE ON BITCOIN?! This is literally free money. BTC is going to 200K, everyone knows it. 10x means my $5K becomes $50K exposure. When it pumps 20%, that\'s a 200% gain for me. I am literally CANNOT go tits up.',
            action: 'Max leverage on Bitcoin',
            multiplierRange: [0.1, 5.0],
        },
        sal: {
            dialogue: 'Kid, 10x leverage means a 10% dip wipes you to zero. ZERO. I\'ve seen more traders blow up on leverage than I can count. Buy spot. Own the actual asset. Sleep at night. Leverage is a loaded gun with the safety off.',
            action: 'Buy Bitcoin with no leverage',
            multiplierRange: [0.85, 1.5],
        },
    },
    {
        id: 'scenario_real_estate',
        headline: 'HOUSING PRICES DROP 15% — OPPORTUNITY OR TRAP?',
        narrative: 'The housing market just caught a cold. Properties that were selling in bidding wars last year are sitting on the market gathering dust. Some see blood in the water. Others see a falling knife.',
        financialConcept: 'Real Estate Investment',
        illegalAnalogy: 'It\'s like buying a foreclosed trap house in a gentrifying neighborhood. Today it\'s sketchy, worth nothing. But you see the coffee shops creeping in, the bike lanes going up. You buy when it\'s ugly, hold while it transforms, sell when it\'s pretty. Location, timing, patience — same game, legal version.',
        vic: {
            dialogue: 'HOUSING CRASH = FIRE SALE! I\'m buying three properties with minimum down payment. When the market rebounds — and it ALWAYS rebounds — I\'ll be sitting on a million in equity. Banks are basically giving money away!',
            action: 'Buy multiple properties with high leverage',
            multiplierRange: [0.3, 3.0],
        },
        sal: {
            dialogue: 'A 15% drop could become 30%. Could also be the bottom. Here\'s what the smart money does: buy ONE solid property in a good location, put 20% down, rent it out. Cash flow covers the mortgage. Time does the rest.',
            action: 'Buy one rental property conservatively',
            multiplierRange: [0.9, 1.4],
        },
    },
    {
        id: 'scenario_dollar_cost_avg',
        headline: 'MARKETS IN TURMOIL — VOLATILITY INDEX SPIKES 300%',
        narrative: 'Nobody knows which way is up. Monday gains get wiped by Tuesday crashes. The VIX — Wall Street\'s fear gauge — is screaming. Talking heads on TV can\'t agree on anything. In times like these, conviction is expensive.',
        financialConcept: 'Dollar-Cost Averaging',
        illegalAnalogy: 'A smart hustler doesn\'t buy his entire supply when prices are crazy volatile. He buys a little every week — sometimes he overpays, sometimes he gets a deal. Over time, his average cost evens out. That\'s dollar-cost averaging. Consistency beats timing.',
        vic: {
            dialogue: 'VOLATILITY IS OPPORTUNITY! Buy now while everyone\'s scared, sell next month when they FOMO back in. Trying to time the bottom is literally my personality. One massive buy. Let\'s GO.',
            action: 'Lump sum buy at current prices',
            multiplierRange: [0.5, 2.5],
        },
        sal: {
            dialogue: 'Split your cash into 4 equal parts. Invest one part each week. If it drops, you buy more for less. If it rises, your earlier buys profit. No stress, no gambling. Just math doing its thing.',
            action: 'Dollar-cost average over 4 weeks',
            multiplierRange: [0.9, 1.2],
        },
    },
    {
        id: 'scenario_startup_equity',
        headline: 'FRIEND\'S AI STARTUP OFFERS YOU 5% EQUITY',
        narrative: 'Your boy from the old neighborhood just got his AI startup into Y Combinator. He needs another $10K and he\'s offering you 5% of the company. Could be the next unicorn. Could be the next WeWork.',
        financialConcept: 'Venture Capital & Equity',
        illegalAnalogy: 'When a new crew starts operating in a territory, the early backers get the biggest cut. The first guy who fronts the cash gets 20% of everything — forever. That\'s what venture capital is. You fund the operation early, you own a piece of every future dollar. If it pops off, you\'re a kingpin. If it busts, you eat the loss.',
        vic: {
            dialogue: 'FIVE PERCENT OF THE NEXT OPENAI?! Take my money. Take ALL my money. I\'m putting in 20K. Early stage equity is how billionaires are MADE, not by buying index funds like a normie.',
            action: 'Invest double what was asked',
            multiplierRange: [0.0, 8.0],
        },
        sal: {
            dialogue: 'Never invest more than you can burn. The kid\'s smart, the idea\'s good, but 90% of startups fail. Put in the 10K if you believe, but only if losing it won\'t change your life. This is lottery ticket money, not rent money.',
            action: 'Invest the minimum, keep reserves',
            multiplierRange: [0.0, 3.0],
        },
    },
    {
        id: 'scenario_inflation_hedge',
        headline: 'INFLATION HITS 9.1% — DOLLAR LOSING VALUE FAST',
        narrative: 'Your cash is worth less every day. A dollar today buys what 91 cents did last year. The silent tax is eating everyone alive. The question isn\'t whether to act — it\'s how.',
        financialConcept: 'Inflation Hedging',
        illegalAnalogy: 'Inflation is like a crew that skims a little off every transaction in the neighborhood. You don\'t notice at first, but after a year, 10% of everything has vanished. The way to fight back? Convert your cash into assets that appreciate — real estate, gold, businesses. Things the skimmers can\'t devalue.',
        vic: {
            dialogue: 'CASH IS TRASH! Convert everything to Bitcoin, gold, and real assets. The dollar is a melting ice cube. I\'m going 100% commodities and crypto. Fiat currency is a government-sponsored scam.',
            action: 'Convert all cash to hard assets',
            multiplierRange: [0.6, 2.2],
        },
        sal: {
            dialogue: 'Inflation is real, but panic is worse. Move 60% into inflation-protected bonds and dividend stocks. Keep 40% liquid for opportunities. The dollar might be losing value, but having zero cash when a deal comes? That\'s worse.',
            action: 'Balanced inflation hedge with cash reserves',
            multiplierRange: [0.95, 1.3],
        },
    },
    {
        id: 'scenario_passive_income',
        headline: 'LOCAL LAUNDROMAT FOR SALE — $50K, CASH FLOW POSITIVE',
        narrative: 'The old man who ran the laundromat on 5th and Vine is retiring. The machines are paid off, the lease is locked in, and it nets $3K a month like clockwork. Boring? Maybe. But boring money spends the same as exciting money.',
        financialConcept: 'Passive Income & Cash Flow',
        illegalAnalogy: 'The smartest guys in the game don\'t hustle on the corner forever. They buy the corner store. Then the laundromat next door. Then the apartment building above it. Each one kicks up a monthly nut without them lifting a finger. That\'s passive income — the legal version of tribute.',
        vic: {
            dialogue: 'A LAUNDROMAT? Bro, are we in 1995? For 50K I could put that into a high-growth SaaS play or some DeFi yield farming that\'ll 10x. Passive income is fine if you want to be PASSIVELY rich. I want to be AGGRESSIVELY rich.',
            action: 'Skip the laundromat, invest in high-growth tech',
            multiplierRange: [0.3, 3.5],
        },
        sal: {
            dialogue: '$3K a month. Every month. Rain or shine, bull or bear. That\'s $36K a year on a $50K investment — 72% return before expenses. It ain\'t sexy, but it\'s the foundation of every fortune I\'ve ever seen built. Buy the laundromat.',
            action: 'Buy the laundromat for steady cash flow',
            multiplierRange: [1.1, 1.4],
        },
    },
    {
        id: 'scenario_emergency_fund',
        headline: 'MAJOR EMPLOYER ANNOUNCES 20,000 LAYOFFS',
        narrative: 'The tech giant everyone thought was untouchable just cut a fifth of its workforce. Suddenly everyone\'s Googling "recession proof career." The question isn\'t if hard times come — it\'s whether you have a cushion when they do.',
        financialConcept: 'Emergency Fund',
        illegalAnalogy: 'Every smart operator keeps a stash nobody knows about. Not the money you flex with, not the money you invest — the money that\'s there when everything goes sideways. Bail money. Lawyer money. Start-over money. That\'s your emergency fund. The boring savings that saves your life.',
        vic: {
            dialogue: 'Emergency fund? You mean the money that\'s sitting there DOING NOTHING while inflation eats it alive? Nah fam, every dollar needs to be WORKING. If I get laid off, I\'ll just trade my way out of it. Literally can\'t lose.',
            action: 'Invest emergency fund for higher returns',
            multiplierRange: [0.4, 2.0],
        },
        sal: {
            dialogue: '6 months of expenses. In a savings account. Non-negotiable. I\'ve seen millionaires go broke because they had everything tied up in assets and couldn\'t make rent when the music stopped. Cash is oxygen.',
            action: 'Set aside 6 months of expenses in savings',
            multiplierRange: [0.98, 1.05],
        },
    },
    {
        id: 'scenario_options_trading',
        headline: 'EARNINGS SEASON: TECH GIANT REPORTS TOMORROW',
        narrative: 'The biggest company in the world drops earnings tomorrow. Options are priced for a move. Everyone has a prediction. Nobody has a crystal ball. The degenerates are loading up on calls. The cautious are selling premium.',
        financialConcept: 'Options Trading',
        illegalAnalogy: 'Options are like betting on the outcome of a deal without actually being in the deal. You pay a small fee for the RIGHT to buy or sell at a set price. If the deal goes your way, you cash in big. If not, you only lose your entry fee. It\'s like paying for a seat at the poker table — your downside is the buy-in, your upside is the whole pot.',
        vic: {
            dialogue: 'YOLO 0DTE calls. If they beat earnings — and they WILL — these calls go 10x overnight. Yeah, they expire worthless if I\'m wrong, but I\'m not wrong. My DD is impeccable. The risk/reward is INSANE.',
            action: 'Buy far out-of-the-money call options',
            multiplierRange: [0.0, 6.0],
        },
        sal: {
            dialogue: 'Sell covered calls against shares you already own. Let the gamblers pay YOU for their lottery tickets. You cap your upside, sure, but you get paid every week. Be the casino, not the gambler.',
            action: 'Sell covered calls for premium income',
            multiplierRange: [0.95, 1.15],
        },
    },
    {
        id: 'scenario_crypto_winter',
        headline: 'MAJOR CRYPTO EXCHANGE COLLAPSES — BILLIONS LOST',
        narrative: 'Another crypto exchange just imploded. Customer funds are gone. The founder\'s on the run. Bitcoin drops 40% in a day. The obituary writers are sharpening their pencils. But the true believers? They see this as a gift.',
        financialConcept: 'Market Cycles & Contrarian Investing',
        illegalAnalogy: 'After every major bust in the streets, real estate gets cheap. When the big players fall and fear takes over, that\'s when the patient operators move in. They buy up territory for pennies. Two years later, they own the whole block. Markets work the same way — panic creates opportunity, but only for those with cash and nerve.',
        vic: {
            dialogue: 'CRYPTO WINTER IS THE BEST TIME TO BUY! Bitcoin has died 473 times according to the media. It always comes back. I\'m maxing out my credit cards to buy this dip. Generational wealth opportunity!',
            action: 'Buy crypto aggressively during the crash',
            multiplierRange: [0.2, 4.0],
        },
        sal: {
            dialogue: 'The exchange collapsed because people trusted a black box with their money. Lesson one: not your keys, not your crypto. Lesson two: if you buy, buy a little Bitcoin on a REGULATED exchange, and hold it in your own wallet. Small position. Long horizon.',
            action: 'Small Bitcoin allocation, self-custody',
            multiplierRange: [0.8, 1.6],
        },
    },
];

/**
 * Get a random fallback scenario, optionally excluding recently used IDs.
 */
export function getRandomScenario(excludeIds: string[] = []): DailyScenario {
    const available = FALLBACK_SCENARIOS.filter(s => !excludeIds.includes(s.id));
    if (available.length === 0) return FALLBACK_SCENARIOS[Math.floor(Math.random() * FALLBACK_SCENARIOS.length)];
    return available[Math.floor(Math.random() * available.length)];
}
