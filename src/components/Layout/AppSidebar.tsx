
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  CalendarCheck, 
  History, 
  Settings,
  BarChart,
  LogOut,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "Performance",
      path: "/performance",
      icon: BarChart
    },
    {
      title: "Trade Calendar",
      path: "/calendar",
      icon: CalendarCheck
    },
    {
      title: "Trade History",
      path: "/history",
      icon: History
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Trade Journal</h1>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-4">
        <Link to="/trade/new" className="w-full">
          <Button className="w-full flex items-center gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
            <Plus className="w-4 h-4" />
            <span>Log Trade</span>
          </Button>
        </Link>
        
        <div className="flex flex-col space-y-4">
          {user && (
            <div className="text-xs text-sidebar-foreground/80">
              Logged in as: {user.email}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
          
          <div className="text-xs text-sidebar-foreground/60">
            © {new Date().getFullYear()} Trade Journal App
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
