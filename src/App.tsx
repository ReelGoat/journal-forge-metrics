
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NewTrade from "./pages/NewTrade";
import TradeDetail from "./pages/TradeDetail";
import EditTrade from "./pages/EditTrade";
import TradeHistory from "./pages/TradeHistory";
import TradeCalendar from "./pages/TradeCalendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PerformanceAnalysis from "./pages/PerformanceAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } 
          />
          <Route 
            path="/trade/new" 
            element={
              <AppLayout>
                <NewTrade />
              </AppLayout>
            } 
          />
          <Route 
            path="/trade/:id" 
            element={
              <AppLayout>
                <TradeDetail />
              </AppLayout>
            } 
          />
          <Route 
            path="/trade/edit/:id" 
            element={
              <AppLayout>
                <EditTrade />
              </AppLayout>
            } 
          />
          <Route 
            path="/history" 
            element={
              <AppLayout>
                <TradeHistory />
              </AppLayout>
            } 
          />
          <Route 
            path="/performance" 
            element={
              <AppLayout>
                <PerformanceAnalysis />
              </AppLayout>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <AppLayout>
                <TradeCalendar />
              </AppLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
