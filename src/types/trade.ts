
export type MarketCategory = 'forex' | 'stocks' | 'crypto' | 'commodities' | 'indices' | 'metals';

export type TradeDirection = 'buy' | 'sell';

export type TradeStatus = 'open' | 'closed';

export interface Trade {
  id: string;
  date: Date;
  marketCategory: MarketCategory;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  status: TradeStatus;
  pnl: number;
  pnlPercentage: number;
  notes: string;
  screenshot?: string; // URL to the screenshot
  tags?: string[];
}

export interface TradeFormData {
  date: Date;
  marketCategory: MarketCategory;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  status: TradeStatus;
  notes: string;
  screenshot?: File | null;
  tags?: string[];
}

export interface TradingStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netPnL: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
}
