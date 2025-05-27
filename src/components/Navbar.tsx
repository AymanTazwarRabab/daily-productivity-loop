
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart, Settings, Calendar, Home } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/statistics', icon: BarChart, label: 'Statistics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 p-2 md:p-0 md:top-0 md:bottom-auto md:border-t-0 md:border-b z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-end space-x-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`
                nav-item btn-enhanced flex flex-col md:flex-row items-center
                ${isActive(item.path) 
                  ? 'bg-primary/10 text-primary shadow-md active' 
                  : 'hover:bg-primary/5 text-readable'
                }
                transition-all duration-300 hover:scale-105
              `}
            >
              <item.icon className={`
                h-4 w-4 md:mr-2 transition-all duration-300
                ${isActive(item.path) ? 'text-primary' : ''}
              `} />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
