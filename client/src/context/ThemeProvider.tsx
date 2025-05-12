import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  systemTheme: string | undefined;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => null,
  systemTheme: undefined,
  isDark: false,
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Force light mode only
  useEffect(() => {
    // Always ensure dark mode is removed
    document.documentElement.classList.remove('dark');
    
    // Remove any saved theme
    localStorage.setItem('theme', 'light');
    
    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
  }, []);
  
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
      <ThemeContextWrapper mounted={mounted}>
        {children}
      </ThemeContextWrapper>
    </NextThemesProvider>
  );
}

// Wrapper component to provide theme context values
function ThemeContextWrapper({ children, mounted }: { children: React.ReactNode, mounted: boolean }) {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  // Always force light mode
  const isDark = false;
  
  // Force theme to be light if it's not, using useEffect to avoid setState in render
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  const contextValue = {
    theme: 'light', // Always report 'light' as the current theme
    setTheme,
    systemTheme: 'light', // Always report 'light' as the system theme
    isDark,
    mounted
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme values
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};