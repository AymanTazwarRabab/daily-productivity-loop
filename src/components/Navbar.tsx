
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart, Settings, Calendar, Home } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 md:p-0 md:top-0 md:bottom-auto md:border-t-0 md:border-b z-10">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-end space-x-2">
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex flex-col md:flex-row items-center">
            <Home className="h-4 w-4 md:mr-2" />
            <span className="text-xs md:text-sm">Home</span>
          </Button>
        </Link>
        <Link to="/statistics">
          <Button variant="ghost" size="sm" className="flex flex-col md:flex-row items-center">
            <BarChart className="h-4 w-4 md:mr-2" />
            <span className="text-xs md:text-sm">Statistics</span>
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="sm" className="flex flex-col md:flex-row items-center">
            <Settings className="h-4 w-4 md:mr-2" />
            <span className="text-xs md:text-sm">Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
