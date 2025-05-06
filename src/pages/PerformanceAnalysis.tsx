
import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { tradeService } from "@/services/tradeService";
import { calculateStats } from "@/utils/tradeCalculations";
import PerformanceChart from "@/components/Dashboard/PerformanceChart";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PerformanceAnalysis: React.FC = () => {
  const [trades, setTrades] = useState(tradeService.getAllTrades());
  const stats = calculateStats(trades);
  const { toast } = useToast();
  
  // Function to refresh data
  const refreshData = () => {
    setTrades(tradeService.getAllTrades());
    toast({
      title: "Data refreshed",
      description: "Your trading data has been refreshed.",
    });
  };
  
  // Generate performance data for the charts
  const performanceData = (() => {
    const data = [];
    const closedTrades = trades.filter(trade => trade.status === 'closed');
    
    // Group trades by date
    const tradesByDate = closedTrades.reduce<Record<string, any[]>>((acc, trade) => {
      const date = new Date(trade.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {});
    
    // Sort dates
    const sortedDates = Object.keys(tradesByDate).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    let cumulativePnL = 0;
    
    // Create data points for each date
    sortedDates.forEach(date => {
      const tradesOnDate = tradesByDate[date];
      
      const profit = tradesOnDate
        .filter(trade => trade.pnl > 0)
        .reduce((sum, trade) => sum + trade.pnl, 0);
      
      const loss = tradesOnDate
        .filter(trade => trade.pnl < 0)
        .reduce((sum, trade) => sum + trade.pnl, 0);
      
      cumulativePnL += profit + loss;
      
      data.push({
        date,
        profit,
        loss: Math.abs(loss), // Chart expects positive values
        cumulative: cumulativePnL
      });
    });
    
    return data;
  })();

  // Generate symbol performance data
  const symbolPerformance = React.useMemo(() => {
    const symbolData: Record<string, { trades: number, wins: number, pnl: number }> = {};
    
    trades.forEach(trade => {
      if (!symbolData[trade.symbol]) {
        symbolData[trade.symbol] = { trades: 0, wins: 0, pnl: 0 };
      }
      
      symbolData[trade.symbol].trades++;
      if (trade.pnl > 0) symbolData[trade.symbol].wins++;
      symbolData[trade.symbol].pnl += trade.pnl;
    });
    
    return Object.entries(symbolData).map(([symbol, data]) => ({
      symbol,
      trades: data.trades,
      winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
      pnl: data.pnl
    })).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Performance Analysis</h2>
          <p className="text-sm text-muted-foreground">Track your trading performance over time</p>
        </div>
        
        <div>
          <PerformanceChart data={performanceData} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Symbol Performance</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-center">Trades</TableHead>
                <TableHead className="text-center">Win Rate</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symbolPerformance.length > 0 ? (
                symbolPerformance.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell>{item.symbol}</TableCell>
                    <TableCell className="text-center">{item.trades}</TableCell>
                    <TableCell className="text-center">{item.winRate.toFixed(1)}%</TableCell>
                    <TableCell className={cn(
                      "text-right font-mono",
                      item.pnl > 0 ? "text-trade-profit" : item.pnl < 0 ? "text-trade-loss" : ""
                    )}>
                      {formatCurrency(item.pnl)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No trading data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
