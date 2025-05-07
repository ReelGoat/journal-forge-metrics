
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { tradeService } from "@/services/tradeService";

interface TradeCalendarProps {
  trades: Trade[];
}

const TradeCalendar: React.FC<TradeCalendarProps> = ({ trades }) => {
  const tradesByDate = trades.reduce<Record<string, Trade[]>>((acc, trade) => {
    const dateKey = trade.date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(trade);
    return acc;
  }, {});

  const getDayClassName = (date: Date | undefined) => {
    if (!date) return "";
    
    const dateKey = date.toISOString().split('T')[0];
    const tradesOnDate = tradesByDate[dateKey] || [];
    
    if (tradesOnDate.length === 0) return "";
    
    const totalPnL = tradesOnDate.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    
    if (totalPnL > 0) {
      return "bg-trade-profit/30 text-white font-bold rounded-full";
    } else if (totalPnL < 0) {
      return "bg-trade-loss/30 text-white font-bold rounded-full";
    } else {
      return "bg-trade-neutral/30 text-white font-bold rounded-full";
    }
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Trade Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          className="rounded-md border"
          dayClassName={getDayClassName}
        />
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-trade-profit/30" />
            <span>Profit</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-trade-loss/30" />
            <span>Loss</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeCalendar;
