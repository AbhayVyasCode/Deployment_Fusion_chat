import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // State
  authUser: null,
  isLoading: true, // To check auth status on initial load

  // Actions
  setAuthUser: (user) => set({ authUser: user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    // This will be called by the logout button
    set({ authUser: null });
  },
}));

export default useAuthStore;