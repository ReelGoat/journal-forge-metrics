
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tradeService } from "@/services/tradeService";
import { Trade, TradeFormData } from "@/types/trade";
import TradeForm from "@/components/Trade/TradeForm";
import { useToast } from "@/hooks/use-toast";

const EditTrade: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trade, setTrade] = useState<Trade | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundTrade = tradeService.getTradeById(id);
      if (foundTrade) {
        setTrade(foundTrade);
      } else {
        navigate("/history", { replace: true });
      }
    }
  }, [id, navigate]);
  
  const handleSubmit = (data: TradeFormData) => {
    if (id) {
      try {
        const updatedTrade = tradeService.updateTrade(id, data);
        if (updatedTrade) {
          toast({
            title: "Trade Updated",
            description: "Your trade has been successfully updated.",
          });
          navigate(`/trade/${id}`);
        } else {
          toast({
            title: "Error",
            description: "Failed to update the trade. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };
  
  if (!trade) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading trade details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Trade</h1>
      <TradeForm
        initialData={{
          date: trade.date,
          marketCategory: trade.marketCategory,
          symbol: trade.symbol,
          direction: trade.direction,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          quantity: trade.quantity,
          status: trade.status,
          notes: trade.notes,
          tags: trade.tags,
          screenshot: null,
        }}
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  );
};

export default EditTrade;
