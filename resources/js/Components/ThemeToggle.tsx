import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  inDropdown?: boolean;
  closeDropdown?: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ inDropdown = false, closeDropdown }) => {
  const { resolvedTheme, setTheme } = useTheme();

  // Determine what to show based on current resolved theme
  const isDark = resolvedTheme === 'dark';
  const targetTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Light' : 'Dark';

  const handleToggle = () => {
    // alert('Theme switching is currently disabled.');
    console.log(`Switching to ${targetTheme} mode`);
    console.log(`Current resolved theme: ${resolvedTheme}`);
    setTheme(targetTheme);
    if (inDropdown && closeDropdown) {
      closeDropdown();
    }
  };

  if (inDropdown) {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Icon className="h-4 w-4 mr-3" />
      {label}
      </button>
    );
  }

  // Standalone toggle button
  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      title={`Switch to ${label} mode`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};