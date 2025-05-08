
import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { tradeService } from "@/services/tradeService";
import { Trade } from "@/types/trade";
import { calculateStats } from "@/utils/tradeCalculations";
import StatCard from "@/components/Dashboard/StatCard";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import TradeCalendarWidget from "@/components/Dashboard/TradeCalendarWidget";

const Dashboard: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const stats = calculateStats(trades);
  const { toast } = useToast();
  
  // Fetch trades on component mount
  useEffect(() => {
    fetchTrades();
  }, []);
  
  // Function to fetch trades
  const fetchTrades = async () => {
    setLoading(true);
    try {
      const fetchedTrades = await tradeService.getAllTrades();
      setTrades(fetchedTrades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trade data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    try {
      await fetchTrades();
      toast({
        title: "Data refreshed",
        description: "Your trading data has been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P&L"
          value={formatCurrency(stats.netPnL)}
          description="Overall performance"
          iconType="money"
          trend={stats.netPnL > 0 ? "up" : stats.netPnL < 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          description="Percentage of winning trades"
          iconType="percent"
          trend={stats.winRate > 50 ? "up" : stats.winRate < 50 ? "down" : "neutral"}
        />
        <StatCard
          title="Average Win"
          value={formatCurrency(stats.averageWin)}
          description="Average winning trade"
          iconType="up"
          trend="up"
        />
        <StatCard
          title="Average Loss"
          value={formatCurrency(stats.averageLoss)}
          description="Average losing trade"
          iconType="down"
          trend="down"
        />
        <StatCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          description="Gain to loss ratio"
          iconType="chart"
          trend={stats.profitFactor > 1 ? "up" : "down"}
        />
        <StatCard
          title="Max Drawdown"
          value={formatCurrency(stats.maxDrawdown)}
          description="Maximum capital drawdown"
          iconType="clock"
          trend="down"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TradeCalendarWidget trades={trades} />
        
        {trades.length === 0 && !loading ? (
          <div className="col-span-1 md:col-span-2 text-center p-8 border border-dashed rounded-lg flex flex-col justify-center items-center">
            <p className="text-lg mb-4">No trades found. Start logging your trades to see performance data.</p>
            <Button asChild>
              <Link to="/trade/new">Log Your First Trade</Link>
            </Button>
          </div>
        ) : (
          <div className="col-span-1 md:col-span-2 text-center p-8 border border-dashed rounded-lg flex flex-col justify-center items-center">
            <p className="text-lg mb-4">View detailed performance metrics and charts</p>
            <Button asChild>
              <Link to="/performance">View Performance Analysis</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
