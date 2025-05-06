
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  trend
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={cn(
            "text-xs mt-1", 
            trend === "up" && "text-trade-profit",
            trend === "down" && "text-trade-loss", 
            trend === "neutral" && "text-trade-neutral",
            !trend && "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
