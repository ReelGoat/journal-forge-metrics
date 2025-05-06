
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trade, MarketCategory } from "@/types/trade";
import { formatCurrency, formatPercentage } from "@/utils/tradeCalculations";
import { cn } from "@/lib/utils";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface TradeListProps {
  trades: Trade[];
}

const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<MarketCategory | "all">("all");
  const [filterDirection, setFilterDirection] = useState<"buy" | "sell" | "all">("all");

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === "all" || trade.marketCategory === filterCategory;
    const matchesDirection = filterDirection === "all" || trade.direction === filterDirection;

    return matchesSearch && matchesCategory && matchesDirection;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by symbol, notes, tags..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Market</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filterCategory === "all"}
                onCheckedChange={() => setFilterCategory("all")}
              >
                All Markets
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "forex"}
                onCheckedChange={() => setFilterCategory("forex")}
              >
                Forex
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "stocks"}
                onCheckedChange={() => setFilterCategory("stocks")}
              >
                Stocks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "crypto"}
                onCheckedChange={() => setFilterCategory("crypto")}
              >
                Crypto
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "commodities"}
                onCheckedChange={() => setFilterCategory("commodities")}
              >
                Commodities
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "indices"}
                onCheckedChange={() => setFilterCategory("indices")}
              >
                Indices
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterCategory === "metals"}
                onCheckedChange={() => setFilterCategory("metals")}
              >
                Metals
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Direction</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filterDirection === "all"}
                onCheckedChange={() => setFilterDirection("all")}
              >
                All Directions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterDirection === "buy"}
                onCheckedChange={() => setFilterDirection("buy")}
              >
                Buy/Long
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterDirection === "sell"}
                onCheckedChange={() => setFilterDirection("sell")}
              >
                Sell/Short
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead className="hidden md:table-cell">Entry</TableHead>
              <TableHead className="hidden md:table-cell">Exit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No trades found
                </TableCell>
              </TableRow>
            ) : (
              filteredTrades.map((trade) => (
                <TableRow
                  key={trade.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => navigate(`/trade/${trade.id}`)}
                >
                  <TableCell>
                    {new Date(trade.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        trade.direction === "buy"
                          ? "bg-trade-profit/20 text-trade-profit"
                          : "bg-trade-loss/20 text-trade-loss"
                      )}
                    >
                      {trade.direction === "buy" ? "BUY" : "SELL"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {trade.entryPrice}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {trade.exitPrice}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        trade.status === "open"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-gray-500/20 text-gray-400"
                      )}
                    >
                      {trade.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className={cn(
                        trade.pnl >= 0 ? "text-trade-profit" : "text-trade-loss"
                      )}
                    >
                      {formatCurrency(trade.pnl)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage(trade.pnlPercentage)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeList;
