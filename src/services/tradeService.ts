
import { Trade, TradeFormData, TradeStatus } from "../types/trade";
import { calculatePnL, calculatePnLPercentage } from "../utils/tradeCalculations";

// Mock data for initial trades
const mockTrades: Trade[] = [
  {
    id: "1",
    date: new Date(2023, 4, 10, 9, 30),
    marketCategory: "forex",
    symbol: "EUR/USD",
    direction: "buy",
    entryPrice: 1.0750,
    exitPrice: 1.0820,
    quantity: 1,
    status: "closed",
    pnl: 0.007 * 100000,
    pnlPercentage: 0.65,
    notes: "Strong bullish momentum after NFP data, caught the uptrend.",
    tags: ["NFP", "trend-following"]
  },
  {
    id: "2",
    date: new Date(2023, 4, 11, 14, 15),
    marketCategory: "forex",
    symbol: "GBP/USD",
    direction: "sell",
    entryPrice: 1.2650,
    exitPrice: 1.2580,
    quantity: 1,
    status: "closed",
    pnl: 0.007 * 100000,
    pnlPercentage: 0.55,
    notes: "Technical breakdown at resistance, good risk-reward setup.",
    tags: ["technical", "resistance"]
  },
  {
    id: "3",
    date: new Date(2023, 4, 12, 10, 45),
    marketCategory: "forex",
    symbol: "USD/JPY",
    direction: "buy",
    entryPrice: 134.50,
    exitPrice: 133.75,
    quantity: 1,
    status: "closed",
    pnl: -0.0075 * 100000,
    pnlPercentage: -0.56,
    notes: "Unexpected BOJ announcement caused a quick reversal.",
    tags: ["news", "central-bank"]
  },
  {
    id: "4",
    date: new Date(2023, 4, 13, 16, 20),
    marketCategory: "crypto",
    symbol: "BTC/USD",
    direction: "buy",
    entryPrice: 27500,
    exitPrice: 28200,
    quantity: 0.1,
    status: "closed",
    pnl: 70,
    pnlPercentage: 2.55,
    notes: "Bitcoin breaking out of consolidation pattern.",
    tags: ["breakout", "technical"]
  },
  {
    id: "5",
    date: new Date(2023, 4, 15, 11, 0),
    marketCategory: "stocks",
    symbol: "AAPL",
    direction: "sell",
    entryPrice: 175.50,
    exitPrice: 172.25,
    quantity: 10,
    status: "closed",
    pnl: 32.5,
    pnlPercentage: 1.85,
    notes: "Earnings miss caused a selloff, shorted at the open.",
    tags: ["earnings", "gap-down"]
  }
];

// Service to handle trade operations
class TradeService {
  private trades: Trade[] = [...mockTrades];

  // Get all trades
  getAllTrades(): Trade[] {
    return [...this.trades].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Get a trade by ID
  getTradeById(id: string): Trade | undefined {
    return this.trades.find(trade => trade.id === id);
  }

  // Add a new trade
  addTrade(tradeData: TradeFormData): Trade {
    const newId = String(this.trades.length + 1);
    
    let pnl = 0;
    let pnlPercentage = 0;
    
    if (tradeData.status === 'closed' && tradeData.exitPrice) {
      pnl = calculatePnL(
        tradeData.entryPrice, 
        tradeData.exitPrice, 
        tradeData.quantity, 
        tradeData.direction
      );
      
      pnlPercentage = calculatePnLPercentage(
        tradeData.entryPrice, 
        tradeData.exitPrice, 
        tradeData.direction
      );
    }
    
    const newTrade: Trade = {
      id: newId,
      ...tradeData,
      exitPrice: tradeData.exitPrice || 0,
      pnl,
      pnlPercentage,
      screenshot: tradeData.screenshot ? URL.createObjectURL(tradeData.screenshot) : undefined
    };
    
    this.trades.push(newTrade);
    return newTrade;
  }

  // Update an existing trade
  updateTrade(id: string, tradeData: Partial<TradeFormData>): Trade | undefined {
    const index = this.trades.findIndex(trade => trade.id === id);
    if (index === -1) return undefined;
    
    const updatedTrade = { ...this.trades[index], ...tradeData };
    
    if (tradeData.entryPrice !== undefined || tradeData.exitPrice !== undefined || tradeData.direction !== undefined || tradeData.quantity !== undefined) {
      const entryPrice = tradeData.entryPrice || this.trades[index].entryPrice;
      const exitPrice = tradeData.exitPrice || this.trades[index].exitPrice;
      const direction = tradeData.direction || this.trades[index].direction;
      const quantity = tradeData.quantity || this.trades[index].quantity;
      
      updatedTrade.pnl = calculatePnL(entryPrice, exitPrice, quantity, direction);
      updatedTrade.pnlPercentage = calculatePnLPercentage(entryPrice, exitPrice, direction);
    }
    
    this.trades[index] = updatedTrade as Trade;
    return updatedTrade as Trade;
  }

  // Delete a trade
  deleteTrade(id: string): boolean {
    const initialLength = this.trades.length;
    this.trades = this.trades.filter(trade => trade.id !== id);
    return this.trades.length < initialLength;
  }

  // Clear all trades
  clearAllTrades(): void {
    this.trades = [];
  }

  // Filter trades by criteria
  filterTrades(filters: Partial<{
    marketCategory: string;
    symbol: string;
    direction: string;
    status: TradeStatus;
    dateFrom: Date;
    dateTo: Date;
    profitOnly: boolean;
    lossOnly: boolean;
  }>): Trade[] {
    return this.trades.filter(trade => {
      if (filters.marketCategory && trade.marketCategory !== filters.marketCategory) return false;
      if (filters.symbol && !trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) return false;
      if (filters.direction && trade.direction !== filters.direction) return false;
      if (filters.status && trade.status !== filters.status) return false;
      if (filters.dateFrom && trade.date < filters.dateFrom) return false;
      if (filters.dateTo && trade.date > filters.dateTo) return false;
      if (filters.profitOnly && trade.pnl <= 0) return false;
      if (filters.lossOnly && trade.pnl >= 0) return false;
      return true;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const tradeService = new TradeService();
