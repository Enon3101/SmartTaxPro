import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import './i18n'; // Initialize i18next

import App from "./App";
import GoogleAuthProvider from "./components/GoogleAuthProvider";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Make sure Google OAuth client ID is available in the environment
if (import.meta.env.DEV && !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID environment variable is not set. Google Sign-In functionality will not work.");
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <GoogleAuthProvider>
        <TaxDataProvider>
          <App />
        </TaxDataProvider>
      </GoogleAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
