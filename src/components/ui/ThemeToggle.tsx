"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage or document class for initial state
    const isDarkMode = 
      document.documentElement.classList.contains("dark") || 
      localStorage.getItem("theme") === "dark";
      
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Avoid hydration mismatch by not rendering the icon until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl border border-gray-100 text-gray-500 shadow-sm">
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="w-10 h-10 rounded-2xl border border-gray-100 text-gray-500 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors shadow-sm"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
