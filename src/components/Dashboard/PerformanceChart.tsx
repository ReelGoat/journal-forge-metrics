
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PerformanceData {
  date: string;
  profit: number;
  loss: number;
  cumulative: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const chartConfig = {
    profit: { color: "#33cc66" },
    loss: { color: "#ff3366" },
    cumulative: { color: "#0ea5e9" },
  };

  return (
    <Tabs defaultValue="bar">
      <div className="flex justify-end pb-4">
        <TabsList>
          <TabsTrigger value="bar">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="bar">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">P&L by Period</h3>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: '#666' }}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{ fontSize: 10 }} 
                  tickLine={{ stroke: '#666' }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="profit" fill="#33cc66" name="Profit" />
                <Bar dataKey="loss" fill="#ff3366" name="Loss" />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Cumulative P&L</h3>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  tick={{ fontSize: 10 }}
                  tickLine={{ stroke: '#666' }}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{ fontSize: 10 }} 
                  tickLine={{ stroke: '#666' }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  name="Cumulative" 
                  stroke="#0ea5e9" 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="weekly">
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Weekly data view will be available when sufficient data is collected
        </div>
      </TabsContent>
      
      <TabsContent value="monthly">
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Monthly data view will be available when sufficient data is collected
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PerformanceChart;
