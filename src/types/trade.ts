
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
  exitPrice: number | null;
  quantity: number;
  status: TradeStatus;
  pnl: number | null;
  pnlPercentage: number | null;
  notes: string | null;
  screenshot?: string; // URL to the screenshot
  tags?: string[];
  user_id?: string;
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
  maxDrawdown: number;
}

export interface DatabaseTrade {
  id: string;
  user_id: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  position_size: number;
  direction: string;
  entry_date: string;
  exit_date: string | null;
  profit_loss: number | null;
  profit_loss_percentage: number | null;
  strategy: string | null;
  setup: string | null;
  notes: string | null;
  status: string;
  screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}
