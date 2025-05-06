
import { Trade, TradingStats } from "../types/trade";

export function calculatePnL(entryPrice: number, exitPrice: number, quantity: number, direction: 'buy' | 'sell'): number {
  if (direction === 'buy') {
    return (exitPrice - entryPrice) * quantity;
  } else {
    return (entryPrice - exitPrice) * quantity;
  }
}

export function calculatePnLPercentage(entryPrice: number, exitPrice: number, direction: 'buy' | 'sell'): number {
  if (direction === 'buy') {
    return ((exitPrice - entryPrice) / entryPrice) * 100;
  } else {
    return ((entryPrice - exitPrice) / entryPrice) * 100;
  }
}

export function calculateStats(trades: Trade[]): TradingStats {
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const totalTrades = closedTrades.length;
  
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      netPnL: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0
    };
  }
  
  const winningTrades = closedTrades.filter(trade => trade.pnl > 0);
  const losingTrades = closedTrades.filter(trade => trade.pnl < 0);
  
  const winRate = (winningTrades.length / totalTrades) * 100;
  
  const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
  const netPnL = totalProfit - totalLoss;
  
  const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
  
  const averageWin = winningTrades.length === 0 ? 0 : totalProfit / winningTrades.length;
  const averageLoss = losingTrades.length === 0 ? 0 : totalLoss / losingTrades.length;
  
  return {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    totalProfit,
    totalLoss,
    netPnL,
    profitFactor,
    averageWin,
    averageLoss
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`;
}
