import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TaxDataProvider } from "./context/TaxDataProvider";
import GoogleAuthProvider from "./components/GoogleAuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Make sure Google OAuth client ID is available in the environment
if (import.meta.env.DEV && !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID environment variable is not set. Google Sign-In functionality will not work.");
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleAuthProvider>
      <TaxDataProvider>
        <App />
      </TaxDataProvider>
    </GoogleAuthProvider>
  </QueryClientProvider>
);
