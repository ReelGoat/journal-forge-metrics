
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  CalendarCheck, 
  History, 
  Settings,
  BarChart
} from "lucide-react";

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

const AppSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "New Trade",
      path: "/trade/new",
      icon: TrendingUp
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
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} Trade Journal App
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
