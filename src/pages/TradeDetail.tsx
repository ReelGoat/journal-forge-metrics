
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tradeService } from "@/services/tradeService";
import { Trade } from "@/types/trade";
import TradeDetails from "@/components/Trade/TradeDetails";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const TradeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
  
  const handleDelete = () => {
    if (id) {
      const success = tradeService.deleteTrade(id);
      if (success) {
        toast({
          title: "Trade Deleted",
          description: "The trade has been successfully deleted.",
        });
        navigate("/history", { replace: true });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the trade. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
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
      <TradeDetails
        trade={trade}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              trade and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TradeDetail;
