import { QueryClientProvider } from "@tanstack/react-query";
import React from "react"; // Import React for Suspense
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import './i18n'; // Initialize i18next

import App from "./App";
import GoogleAuthProvider from "@/features/auth/components/GoogleAuthProvider";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Make sure Google OAuth client ID is available in the environment
if (import.meta.env.DEV && !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID environment variable is not set. Google Sign-In functionality will not work.");
}

createRoot(document.getElementById("root")!).render(
  <React.Suspense fallback={<div>Loading translations...</div>}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleAuthProvider>
          <TaxDataProvider>
            <App />
          </TaxDataProvider>
        </GoogleAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.Suspense>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service worker registered:', reg);
      })
      .catch(err => {
        console.error('Service worker registration failed:', err);
      });
  });
}
