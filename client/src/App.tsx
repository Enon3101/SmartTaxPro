import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { ItrWizardProvider } from "./context/ItrWizardContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/HomeSimplified";
import TaxFiling from "@/pages/TaxFiling";
import Calculators from "@/pages/Calculators";
import LearningResources from "@/pages/LearningResources";
import TaxResources from "@/pages/TaxResources";
import Support from "@/pages/Support";
import Pricing from "@/pages/Pricing";
import StartFiling from "@/pages/StartFiling";
import Payment from "@/pages/Payment";
import FilingComplete from "@/pages/FilingComplete";
import FilingRequirements from "@/pages/FilingRequirements";
import ItrWizard from "@/pages/ItrWizard";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import BlogPost from "@/pages/BlogPost";
import BlogAdmin from "@/pages/BlogAdmin";
import DatabaseEditor from "@/pages/DatabaseEditor";
import TaxExpert from "@/pages/TaxExpert";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import TaxExpertWidget from "@/components/TaxExpertWidget";
import { ScrollToTop } from "@/components/ScrollToTop";

// Lazy load calculator pages with improved loading
const CalculatorsIndex = lazy(() => import("@/pages/calculators"));

// Loan calculators
const HomeLoanCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/home-loan"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const CarLoanCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/car-loan"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const PersonalLoanCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/personal-loan"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// Tax calculators with better prefetching
const TaxRegimeCalculator = lazy(() => {
  // Add a small delay to give browser time to prioritize current page rendering
  return Promise.all([
    import("@/pages/calculators/tax-regime"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// Additional calculators
const CompoundInterestCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/compound-interest"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const PPFCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/ppf"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const RDCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/rd"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const RetirementCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/retirement"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const HraCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/hra"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const TdsCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/tds"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const CapitalGainsCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/capital-gains"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// Financial calculators
const SipCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/sip"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const FdCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/fd"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const LoanEmiCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/loan-emi"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// New calculators
const IncomeTaxCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/income-tax"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// ITR Form Guides
const ITRFormsGuidePage = lazy(() => {
  return Promise.all([
    import("@/pages/ITRFormsGuidePage"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// ITR Form Details
const ITRFormDetails = lazy(() => {
  return Promise.all([
    import("@/pages/tax-resources/ITRFormDetails"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const AdvanceTaxCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/advance-tax"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const GratuityCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/gratuity"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

const PFCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/pf"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

// Enhanced loading component for lazy-loaded routes
const PageLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
    <div className="text-center">
      <p className="font-medium">Loading Calculator</p>
      <p className="text-sm text-muted-foreground mt-1">
        Please wait a moment...
      </p>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tax-filing" component={TaxFiling} />
      <Route path="/file-taxes" component={TaxFiling} />
      <Route path="/itr-forms-guide">
        <Suspense fallback={<PageLoading />}>
          <ITRFormsGuidePage />
        </Suspense>
      </Route>
      <Route path="/calculators" component={Calculators} />
      <Route path="/learning" component={LearningResources} />
      <Route path="/learning/blog/:slug">{(params) => <BlogPost />}</Route>
      <Route path="/tax-resources" component={TaxResources} />
      <Route path="/tax-resources/:formId">
        {(params) => (
          <Suspense fallback={<PageLoading />}>
            <ITRFormDetails />
          </Suspense>
        )}
      </Route>
      <Route path="/support" component={Support} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/start-filing" component={StartFiling} />
      <Route path="/filing-requirements" component={FilingRequirements} />
      <Route path="/itr-wizard" component={ItrWizard} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin/blog">{() => <BlogAdmin />}</Route>
      <Route path="/admin/blog/new">{() => <BlogAdmin mode="create" />}</Route>
      <Route path="/admin/blog/edit/:id">
        {(params) => <BlogAdmin mode="edit" id={params.id} />}
      </Route>
      <Route path="/admin/database-editor" component={DatabaseEditor} />
      <Route path="/payment" component={Payment} />
      <Route path="/filing-complete" component={FilingComplete} />
      <Route path="/tax-expert" component={TaxExpert} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />

      {/* Calculator Routes */}
      <Route path="/calculators/index">
        {(params) => {
          // This will only run when the path is exactly /calculators/index
          if (!params[0]) {
            return (
              <Suspense fallback={<PageLoading />}>
                <CalculatorsIndex />
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

      {/* Financial calculator routes */}
      <Route path="/calculators/sip">
        <Suspense fallback={<PageLoading />}>
          <SipCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/fd">
        <Suspense fallback={<PageLoading />}>
          <FdCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/loan-emi">
        <Suspense fallback={<PageLoading />}>
          <LoanEmiCalculator />
        </Suspense>
      </Route>

      {/* New calculator routes */}
      <Route path="/calculators/income-tax">
        <Suspense fallback={<PageLoading />}>
          <IncomeTaxCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/advance-tax">
        <Suspense fallback={<PageLoading />}>
          <AdvanceTaxCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/gratuity">
        <Suspense fallback={<PageLoading />}>
          <GratuityCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/pf">
        <Suspense fallback={<PageLoading />}>
          <PFCalculator />
        </Suspense>
      </Route>
      
      {/* Additional calculator routes */}
      <Route path="/calculators/take-home-salary">
        {() => (
          <Suspense fallback={<PageLoading />}>
            <TakeHomeSalaryCalculator />
          </Suspense>
        )}
      </Route>
      <Route path="/calculators/ppf">
        <Suspense fallback={<PageLoading />}>
          <PPFCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/rd">
        <Suspense fallback={<PageLoading />}>
          <RDCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/retirement">
        <Suspense fallback={<PageLoading />}>
          <RetirementCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/compound-interest">
        <Suspense fallback={<PageLoading />}>
          <CompoundInterestCalculator />
        </Suspense>
      </Route>
      
      {/* Loan calculator routes */}
      <Route path="/calculators/home-loan">
        <Suspense fallback={<PageLoading />}>
          <HomeLoanCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/car-loan">
        <Suspense fallback={<PageLoading />}>
          <CarLoanCalculator />
        </Suspense>
      </Route>
      <Route path="/calculators/personal-loan">
        <Suspense fallback={<PageLoading />}>
          <PersonalLoanCalculator />
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
            <ItrWizardProvider>
              <TooltipProvider>
                <div className="flex flex-col min-h-screen bg-background text-foreground">
                  <ScrollToTop />
                  <Header />
                  <main className="flex-grow pb-16 sm:pb-0">
                    <Router />
                  </main>
                  <Footer />
                  <BottomNav />
                  <TaxExpertWidget />
                </div>
                <Toaster />
              </TooltipProvider>
            </ItrWizardProvider>
          </TaxDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
