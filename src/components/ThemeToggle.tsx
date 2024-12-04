import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400 transition-all" />
      )}
    </Button>
  );
}
