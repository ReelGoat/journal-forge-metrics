
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-border py-3 px-6 flex items-center justify-between bg-card">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search trades..."
            className="h-10 w-[250px] rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
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
