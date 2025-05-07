
import React, { useState, useEffect } from "react";
import { tradeService } from "@/services/tradeService";
import { formatCurrency } from "@/utils/tradeCalculations";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TradeList from "@/components/Trade/TradeList";
import { Trade } from "@/types/trade";

const TradeCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true);
        const fetchedTrades = await tradeService.getAllTrades();
        setTrades(fetchedTrades);
      } catch (error) {
        console.error("Error loading trades:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTrades();
  }, []);
  
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
  
  const filteredTrades = selectedDate
    ? trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return (
          tradeDate.getDate() === selectedDate.getDate() &&
          tradeDate.getMonth() === selectedDate.getMonth() &&
          tradeDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];
  
  const dailyPnL = filteredTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading trade calendar...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trade Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View trades by date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
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
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Trades on ${selectedDate.toLocaleDateString()}`
                : "Select a date to view trades"}
            </CardTitle>
            {selectedDate && filteredTrades.length > 0 && (
              <CardDescription>
                Daily P&L:{" "}
                <span
                  className={
                    dailyPnL > 0 ? "text-trade-profit" : "text-trade-loss"
                  }
                >
                  {formatCurrency(dailyPnL)}
                </span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              filteredTrades.length > 0 ? (
                <TradeList trades={filteredTrades} />
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No trades found for this date
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Select a date from the calendar to view trades
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeCalendarPage;
