import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Simple light-mode-only theme provider
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      {children}
    </NextThemesProvider>
  );
}

// Empty hook implementation for compatibility
export const useTheme = () => {
  return {
    theme: 'light',
    setTheme: () => {},
    systemTheme: 'light',
    isDark: false,
    mounted: true
  };
};