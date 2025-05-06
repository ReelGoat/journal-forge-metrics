
import React from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Percent 
} from "lucide-react";
import { tradeService } from "@/services/tradeService";
import { calculateStats } from "@/utils/tradeCalculations";
import StatCard from "@/components/Dashboard/StatCard";
import PerformanceChart from "@/components/Dashboard/PerformanceChart";
import RecentTradesList from "@/components/Dashboard/RecentTradesList";
import TradeCalendar from "@/components/Dashboard/TradeCalendar";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";

const Dashboard: React.FC = () => {
  const trades = tradeService.getAllTrades();
  const stats = calculateStats(trades);
  
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
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.netPnL)}
          description={`From ${stats.totalTrades} trades`}
          icon={<LayoutDashboard />}
          trend={stats.netPnL > 0 ? "up" : stats.netPnL < 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          description={`${stats.winningTrades} / ${stats.totalTrades} trades`}
          icon={<Percent />}
          trend={stats.winRate > 50 ? "up" : stats.winRate < 50 ? "down" : "neutral"}
        />
        <StatCard
          title="Average Win"
          value={formatCurrency(stats.averageWin)}
          description={`Total profit: ${formatCurrency(stats.totalProfit)}`}
          icon={<TrendingUp />}
          trend="up"
        />
        <StatCard
          title="Average Loss"
          value={formatCurrency(stats.averageLoss)}
          description={`Total loss: ${formatCurrency(stats.totalLoss)}`}
          icon={<TrendingDown />}
          trend="down"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <PerformanceChart data={performanceData} />
        <RecentTradesList trades={trades.slice(0, 5)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TradeCalendar trades={trades} />
      </div>
    </div>
  );
};

export default Dashboard;
