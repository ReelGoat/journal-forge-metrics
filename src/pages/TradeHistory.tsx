
import React from "react";
import { tradeService } from "@/services/tradeService";
import TradeList from "@/components/Trade/TradeList";

const TradeHistory: React.FC = () => {
  const trades = tradeService.getAllTrades();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade History</h1>
      <TradeList trades={trades} />
    </div>
  );
};

export default TradeHistory;
