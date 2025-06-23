import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  darkMode: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  setDarkMode: (isDark: boolean) => void;
  setSuccessMessage: (message: string | null) => void;
  setErrorMessage: (message: string | null) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: true,
      successMessage: null,
      errorMessage: null,
      setDarkMode: (isDark) => set({ darkMode: isDark }),
      setSuccessMessage: (message) => set({ successMessage: message, errorMessage: null }),
      setErrorMessage: (message) => set({ errorMessage: message, successMessage: null }),
      clearMessages: () => set({ successMessage: null, errorMessage: null }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
); 