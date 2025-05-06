
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, CircleDollarSign, Percent, TrendingUp, TrendingDown, BarChart } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  iconType?: "money" | "percent" | "chart" | "up" | "down" | "clock";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  trend,
  iconType
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (iconType) {
      case "money": return <CircleDollarSign className="text-muted-foreground" />;
      case "percent": return <Percent className="text-muted-foreground" />;
      case "chart": return <BarChart className="text-muted-foreground" />;
      case "up": return <TrendingUp className="text-muted-foreground" />;
      case "down": return <TrendingDown className="text-muted-foreground" />;
      case "clock": return <Clock className="text-muted-foreground" />;
      default: return <div className="h-4 w-4"></div>;
    }
  };

  const getValueColor = () => {
    if (trend === "up") return "text-trade-profit";
    if (trend === "down") return "text-trade-loss";
    return "";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-5 w-5">{getIcon()}</div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", getValueColor())}>{value}</div>
        {description && (
          <p className="text-xs mt-1 text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
