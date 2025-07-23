"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const getInitialTheme = (): Theme => {
  // For SSR, return a safe default that matches the inline script
  if (typeof window === 'undefined') {
    return 'dark'; // Default to dark to match inline script fallback
  }
  
  // Check if the document already has theme classes applied by inline script
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('light')) {
      return 'light';
    }
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
  }
  
  // Check for saved theme preference
  try {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (e) {
    // localStorage might not be available
  }
  
  // Check system preference
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch (e) {
    return 'dark'; // Safe fallback
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with dark theme to match SSR
  const [theme, setTheme] = useState<Theme>('dark');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated flag and get correct theme from client
    setIsHydrated(true);
    
    // Only get the correct theme after hydration to prevent mismatch
    if (typeof window !== 'undefined') {
      const correctTheme = getInitialTheme();
      if (correctTheme !== theme) {
        setTheme(correctTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Only apply theme changes after hydration
    if (!isHydrated) return;
    
    // Save theme preference
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // localStorage might not be available
    }
    
    // Apply theme to document by setting className directly
    document.documentElement.className = theme;
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    if (isHydrated) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}