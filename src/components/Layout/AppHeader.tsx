import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // If already on the trade history page, we'll use the local search
      if (location.pathname === '/history') {
        // We'll dispatch a custom event that the TradeList component can listen to
        const searchEvent = new CustomEvent('app-search', { 
          detail: { query: searchQuery } 
        });
        window.dispatchEvent(searchEvent);
        
        toast({
          title: "Searching trades",
          description: `Showing results for "${searchQuery}"`,
        });
      } else {
        // Otherwise navigate to trade history with search param
        navigate(`/history?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };
  
  return (
    <header className="border-b border-border py-3 px-6 flex items-center justify-between bg-card">
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search trades..."
            className="h-10 w-[250px] rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button onClick={() => navigate('/trade/new')} className="flex items-center gap-1 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
          <Plus className="w-4 h-4" />
          <span>Log Trade</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
