import { create } from 'zustand';

// This store manages the theme state and persists it to localStorage.
const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'light',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
    }),
}));

export default useThemeStore;
