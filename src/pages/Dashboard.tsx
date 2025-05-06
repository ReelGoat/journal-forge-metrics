
import React, { useState } from "react";
import { RefreshCw, Trash } from "lucide-react";
import { tradeService } from "@/services/tradeService";
import { calculateStats } from "@/utils/tradeCalculations";
import StatCard from "@/components/Dashboard/StatCard";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
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

  // Function to clear all data
  const clearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      tradeService.clearAllTrades();
      setTrades([]);
      toast({
        title: "Data cleared",
        description: "All your trading data has been cleared.",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="gap-2" onClick={clearData}>
            <Trash className="h-4 w-4" />
            Clear Data
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
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
      
      <div className="mt-8 text-center">
        <p className="text-lg mb-4">View detailed performance metrics and charts</p>
        <Button asChild>
          <Link to="/performance">View Performance Analysis</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
