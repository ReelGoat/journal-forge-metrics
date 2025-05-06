
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentTradesListProps {
  trades: Trade[];
}

const RecentTradesList: React.FC<RecentTradesListProps> = ({ trades }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trades.map((trade) => (
            <div 
              key={trade.id} 
              className="flex items-center justify-between p-3 rounded-md bg-accent cursor-pointer hover:bg-accent/80 transition-colors"
              onClick={() => navigate(`/trade/${trade.id}`)}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  trade.pnl >= 0 ? "bg-trade-profit/20" : "bg-trade-loss/20"
                )}>
                  {trade.pnl >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-trade-profit" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-trade-loss" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{trade.symbol}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(trade.date).toLocaleDateString()} - {trade.direction.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-medium",
                  trade.pnl >= 0 ? "text-trade-profit" : "text-trade-loss"
                )}>
                  {formatCurrency(trade.pnl)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(trade.pnlPercentage)}
                </p>
              </div>
            </div>
          ))}
          {trades.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent trades found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTradesList;
