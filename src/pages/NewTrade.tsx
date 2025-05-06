
import React from "react";
import { useNavigate } from "react-router-dom";
import { tradeService } from "@/services/tradeService";
import { TradeFormData } from "@/types/trade";
import TradeForm from "@/components/Trade/TradeForm";
import { useToast } from "@/hooks/use-toast";

const NewTrade: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (data: TradeFormData) => {
    try {
      const newTrade = tradeService.addTrade(data);
      toast({
        title: "Trade Added",
        description: "Your trade has been successfully logged.",
      });
      navigate(`/trade/${newTrade.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trade. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Log New Trade</h1>
      <TradeForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewTrade;
