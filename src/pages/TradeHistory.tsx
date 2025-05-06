
import React, { useState } from "react";
import { tradeService } from "@/services/tradeService";
import TradeList from "@/components/Trade/TradeList";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState(tradeService.getAllTrades());
  const { toast } = useToast();
  
  // Function to clear all trades
  const clearAllTrades = () => {
    tradeService.clearAllTrades();
    setTrades([]);
    
    toast({
      title: "All trades cleared",
      description: "Your trade history has been cleared successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trade History</h1>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash className="h-4 w-4" />
              Clear All Trades
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all trades?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your trade records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllTrades}>Clear All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {trades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-lg">No trades found</p>
          <p className="text-muted-foreground">Your trade history will appear here once you save a trade.</p>
        </div>
      ) : (
        <TradeList trades={trades} />
      )}
    </div>
  );
};

export default TradeHistory;
