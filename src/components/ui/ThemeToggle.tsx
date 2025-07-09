import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const { trackUserEngagement } = useAnalytics();

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    
    trackUserEngagement('theme_toggle', 'theme_button', {
      from_theme: theme,
      to_theme: newTheme,
      effective_theme: effectiveTheme
    });

    toggleTheme();
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System theme';
      default:
        return 'Light mode';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;