
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trade } from "@/types/trade";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeftIcon } from "lucide-react";

interface TradeDetailsProps {
  trade: Trade;
  onDelete: () => void;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({ trade, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/trade/edit/${trade.id}`)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {trade.symbol}
                <Badge variant={trade.direction === "buy" ? "default" : "destructive"}>
                  {trade.direction === "buy" ? "BUY" : "SELL"}
                </Badge>
                <Badge variant={trade.status === "open" ? "outline" : "secondary"}>
                  {trade.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {new Date(trade.date).toLocaleString()} - {trade.marketCategory.toUpperCase()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div
                className={`text-xl font-bold ${
                  trade.pnl >= 0 ? "text-trade-profit" : "text-trade-loss"
                }`}
              >
                {formatCurrency(trade.pnl)}
              </div>
              <div
                className={`text-sm ${
                  trade.pnl >= 0 ? "text-trade-profit" : "text-trade-loss"
                }`}
              >
                {formatPercentage(trade.pnlPercentage)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Entry Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{trade.entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{trade.quantity}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Exit Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{trade.exitPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">P&L</p>
                    <p className={`font-medium ${
                      trade.pnl >= 0 ? "text-trade-profit" : "text-trade-loss"
                    }`}>
                      {formatCurrency(trade.pnl)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {trade.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                )) || <p className="text-sm text-muted-foreground">No tags</p>}
              </div>

              <h3 className="font-medium text-sm text-muted-foreground mb-1">Notes</h3>
              <div className="bg-accent p-3 rounded-md">
                <p className="text-sm whitespace-pre-line">
                  {trade.notes || "No notes added for this trade."}
                </p>
              </div>
            </div>
          </div>

          {trade.screenshot && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Trade Screenshot</h3>
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src={trade.screenshot}
                  alt="Trade screenshot"
                  className="w-full max-h-96 object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeDetails;
