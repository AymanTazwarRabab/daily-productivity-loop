
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import React, { useEffect } from "react";
import { getSettings } from "./utils/localStorage";

function App() {
  // Create a client inside the component to ensure React context works properly
  const [queryClient] = React.useState(() => new QueryClient());

  // Apply theme settings on initial load
  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply saved color theme
    const settings = getSettings();
    if (settings.colorTheme) {
      // Find the color theme in our predefined list
      const colorThemes = [
        { name: 'Default', primary: isDarkMode ? 'hsl(260, 70%, 60%)' : 'hsl(260, 84%, 50%)', 
                          background: isDarkMode ? 'hsl(260, 20%, 10%)' : 'hsl(260, 25%, 98%)' },
        { name: 'Purple', primary: '#9b87f5', background: '#1A1F2C' },
        { name: 'Ocean', primary: '#0EA5E9', background: '#0c1e2b' },
        { name: 'Forest', primary: '#16a34a', background: '#0f1f14' },
        { name: 'Sunset', primary: '#F97316', background: '#261311' },
        { name: 'Berry', primary: '#D946EF', background: '#261129' },
      ];
      
      const theme = colorThemes.find(t => t.name === settings.colorTheme);
      if (theme) {
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-background', theme.background);
        
        if (theme.name !== 'Default') {
          document.documentElement.style.setProperty('--primary', theme.primary);
          document.documentElement.style.setProperty('--background', theme.background);
        }
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/statistics" element={<Statistics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
