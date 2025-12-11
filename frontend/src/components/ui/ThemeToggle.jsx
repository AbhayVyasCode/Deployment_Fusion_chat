import React from 'react';
import useThemeStore from '../../store/useThemeStore';
import MoonIcon from '../icons/MoonIcon';
import SunIcon from '../icons/SunIcon';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

export default ThemeToggle;
