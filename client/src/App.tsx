import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TaxFiling from "@/pages/TaxFiling";
import TaxResources from "@/pages/TaxResources";
import Support from "@/pages/Support";
import Pricing from "@/pages/Pricing";
import StartFiling from "@/pages/StartFiling";
import Admin from "@/pages/Admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Lazy load calculator pages
const Calculators = lazy(() => import("@/pages/calculators"));
const TaxRegimeCalculator = lazy(() => import("@/pages/calculators/tax-regime"));
const HraCalculator = lazy(() => import("@/pages/calculators/hra"));
const TdsCalculator = lazy(() => import("@/pages/calculators/tds"));
const CapitalGainsCalculator = lazy(() => import("@/pages/calculators/capital-gains"));

// Loading component for lazy-loaded routes
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/file-taxes" component={TaxFiling} />
      <Route path="/tax-resources" component={TaxResources} />
      <Route path="/support" component={Support} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/start-filing" component={StartFiling} />
      <Route path="/admin" component={Admin} />
      
      {/* Calculator Routes */}
      <Route path="/calculators">
        {(params) => {
          // This will only run when the path is exactly /calculators
          if (!params[0]) {
            return (
              <Suspense fallback={<PageLoading />}>
                <Calculators />
              </Suspense>
            );
          }
          return null;
        }}
      </Route>
      <Route path="/calculators/tax-regime">
        <Suspense fallback={<PageLoading />}>
          <TaxRegimeCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/hra">
        <Suspense fallback={<PageLoading />}>
          <HraCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/tds">
        <Suspense fallback={<PageLoading />}>
          <TdsCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/capital-gains">
        <Suspense fallback={<PageLoading />}>
          <CapitalGainsCalculator />
        </Suspense>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TaxDataProvider>
            <TooltipProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Router />
                </main>
                <Footer />
              </div>
              <Toaster />
            </TooltipProvider>
          </TaxDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
