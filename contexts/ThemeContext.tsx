import React, { createContext, useState, useContext } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  bgGradient: [string, string, ...string[]];
  cardBg: string;
  cardBorder: string;
  softTeal: string;
  textPrimary: string;
  textSecondary: string;
  headerBg: string;
  modalBg: string;
  inputBg: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeCustomProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(deviceScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const isDark = theme === 'dark';

  // Exact Background Gradients matching Screenshot 1 (Sunset) & Screenshot 2 (Burgundy)
  const colors: ThemeColors = isDark
    ? {
        bg: 'transparent',
        // Dark Mode: Deep Burgundy / Velvet Wine Red Gradient
        bgGradient: ['#2A0619', '#4E0C2D', '#2A0619', '#12020E'],
        cardBg: 'rgba(54, 14, 34, 0.72)',
        cardBorder: 'rgba(244, 114, 182, 0.28)',
        softTeal: 'rgba(74, 20, 46, 0.65)',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 225, 238, 0.8)',
        headerBg: 'rgba(42, 10, 26, 0.85)',
        modalBg: '#2D0A1C',
        inputBg: 'rgba(30, 6, 18, 0.7)',
      }
    : {
        bg: 'transparent',
        // Light Mode: Vibrant Multi-Tone Sunset Glow Gradient (Pink -> Gold -> Blue Pastel)
        bgGradient: ['#F43F5E', '#F97316', '#FDE047', '#93C5FD'],
        cardBg: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(255, 255, 255, 0.6)',
        softTeal: 'rgba(255, 237, 213, 0.75)',
        textPrimary: '#3B1E08',
        textSecondary: 'rgba(74, 40, 10, 0.85)',
        headerBg: 'rgba(255, 255, 255, 0.9)',
        modalBg: '#FFFFFF',
        inputBg: 'rgba(255, 247, 237, 0.85)',
      };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    const isDark = false;
    return {
      theme: 'light' as ThemeMode,
      isDark,
      toggleTheme: () => {},
      setTheme: () => {},
      colors: {
        bg: 'transparent',
        bgGradient: ['#F43F5E', '#F97316', '#FDE047', '#93C5FD'] as [string, string, ...string[]],
        cardBg: 'rgba(255, 255, 255, 0.85)',
        cardBorder: 'rgba(255, 255, 255, 0.6)',
        softTeal: 'rgba(255, 237, 213, 0.75)',
        textPrimary: '#3B1E08',
        textSecondary: 'rgba(74, 40, 10, 0.85)',
        headerBg: 'rgba(255, 255, 255, 0.9)',
        modalBg: '#FFFFFF',
        inputBg: 'rgba(255, 247, 237, 0.85)',
      },
    };
  }
  return context;
}
