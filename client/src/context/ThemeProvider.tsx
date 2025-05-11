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

  // We need this effect to handle the initial theme application to avoid flashing
  useEffect(() => {
    // Apply the dark class based on localStorage, if any
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && systemPrefersDark) || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <ThemeContextWrapper mounted={mounted}>
        {children}
      </ThemeContextWrapper>
    </NextThemesProvider>
  );
}

// Wrapper component to provide theme context values
function ThemeContextWrapper({ children, mounted }: { children: React.ReactNode, mounted: boolean }) {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  // Determine if the current theme is dark
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && systemTheme === 'dark');
  
  const contextValue = {
    theme,
    setTheme,
    systemTheme,
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