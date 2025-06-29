
import React from 'react';
import { useTheme, Theme } from '../App'; // Assuming useTheme and Theme are exported from App.tsx
import { Icon } from './Icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-500/20 transition-colors duration-200"
      aria-label={theme === Theme.LIGHT ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === Theme.LIGHT ? (
        <Icon icon="MoonIcon" className="w-6 h-6 text-neutral-700" />
      ) : (
        <Icon icon="SunIcon" className="w-6 h-6 text-orange-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
