
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
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="bar">Profit/Loss</TabsTrigger>
              <TabsTrigger value="line">Cumulative P/L</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="bar" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="date" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--card-foreground))"
                  }} 
                />
                <Legend />
                <Bar dataKey="profit" name="Profit" fill="#33cc66" />
                <Bar dataKey="loss" name="Loss" fill="#ff3366" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="line" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="date" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--card-foreground))"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  name="Cumulative P/L" 
                  stroke="#0ea5e9" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
