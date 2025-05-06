export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(decimal / 100);
};

export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  winRate: number;
  netPnL: number;
  totalProfit: number;
  totalLoss: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  maxDrawdown: number;
}

// Calculate PnL for a trade
export const calculatePnL = (entryPrice: number, exitPrice: number, quantity: number, direction: string): number => {
  if (direction === 'buy') {
    return (exitPrice - entryPrice) * quantity;
  } else {
    return (entryPrice - exitPrice) * quantity;
  }
};

// Calculate PnL percentage for a trade
export const calculatePnLPercentage = (entryPrice: number, exitPrice: number, direction: string): number => {
  if (direction === 'buy') {
    return ((exitPrice - entryPrice) / entryPrice) * 100;
  } else {
    return ((entryPrice - exitPrice) / entryPrice) * 100;
  }
};

// Calculate trading statistics from trade history
export const calculateStats = (trades: any[]): TradeStats => {
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const totalTrades = closedTrades.length;
  
  const winningTrades = closedTrades.filter(trade => trade.pnl > 0).length;
  const losingTrades = closedTrades.filter(trade => trade.pnl < 0).length;
  const breakEvenTrades = closedTrades.filter(trade => trade.pnl === 0).length;
  
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const netPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  
  const profitTrades = closedTrades.filter(trade => trade.pnl > 0);
  const lossTrades = closedTrades.filter(trade => trade.pnl < 0);
  
  const totalProfit = profitTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalLoss = Math.abs(lossTrades.reduce((sum, trade) => sum + trade.pnl, 0));
  
  const averageWin = profitTrades.length > 0 ? totalProfit / profitTrades.length : 0;
  const averageLoss = lossTrades.length > 0 ? totalLoss / lossTrades.length : 0;
  
  const largestWin = profitTrades.length > 0 
    ? Math.max(...profitTrades.map(trade => trade.pnl)) 
    : 0;
    
  const largestLoss = lossTrades.length > 0 
    ? Math.abs(Math.min(...lossTrades.map(trade => trade.pnl))) 
    : 0;
    
  // Calculate profit factor
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  
  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let currentDrawdown = 0;
  
  // Sort trades by date
  const sortedTrades = [...closedTrades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let runningPnL = 0;
  
  sortedTrades.forEach(trade => {
    runningPnL += trade.pnl;
    
    if (runningPnL > peak) {
      peak = runningPnL;
      currentDrawdown = 0;
    } else {
      currentDrawdown = peak - runningPnL;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }
  });
  
  return {
    totalTrades,
    winningTrades,
    losingTrades,
    breakEvenTrades,
    winRate,
    netPnL,
    totalProfit,
    totalLoss,
    averageWin,
    averageLoss,
    largestWin,
    largestLoss,
    profitFactor,
    maxDrawdown
  };
};
