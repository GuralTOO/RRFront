import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from './ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 transition-all bg-transparent"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun 
          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" 
          strokeWidth={2.5}
          color="#3b82f6"
        />
      ) : (
        <Moon 
          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" 
          strokeWidth={2.5}
          color="#3b82f6"
        />
      )}
    </Button>
  );
};

export default ThemeSwitcher;