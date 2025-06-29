import React from 'react';
import { useTheme, Theme } from '../App';
import { Icon } from './Icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
      aria-label="Toggle theme"
    >
      <Icon 
        icon={theme === Theme.LIGHT ? 'MoonIcon' : 'SunIcon'} 
        className="w-5 h-5 text-neutral-600 dark:text-neutral-300" 
      />
    </button>
  );
};

export default ThemeToggle;