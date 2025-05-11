import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use next-themes which handles the dark mode implementation and localStorage persistence
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

// Simple hook to use theme values
export const useTheme = () => {
  // Implement our own hook that wraps next-themes
  // This is to avoid hydration mismatch when server rendering
  const [mounted, setMounted] = useState(false);
  
  // After mount, we can show the UI
  useEffect(() => setMounted(true), []);
  
  return { mounted };
};