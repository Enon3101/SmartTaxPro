import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { DefaultParams, Route, RouteComponentProps, Switch } from "wouter";

import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import TaxExpertWidget from "@/components/TaxExpertWidget";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import BlogAdmin from "@/pages/BlogAdmin";
import Calculators from "@/pages/Calculators";
import Dashboard from "@/pages/Dashboard";
import DatabaseEditor from "@/pages/DatabaseEditor";
import DocumentVault from "@/pages/DocumentVault"; // Import DocumentVault page
import FilingComplete from "@/pages/FilingComplete";
import FilingRequirements from "@/pages/FilingRequirements";
import Home from "@/pages/HomeSimplified";
import ItrFiling from "@/pages/ItrFiling";
import ItrWizard from "@/pages/ItrWizard";
import BlogListPage from "@/pages/learning/BlogListPage";
import Login from "@/pages/Login";
import MyFilings from "@/pages/MyFilings"; // Import MyFilings page
import NotFound from "@/pages/not-found";
import Payment from "@/pages/Payment";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import StartFiling from "@/pages/StartFiling";
import Support from "@/pages/Support";
import TaxExpert from "@/pages/TaxExpert";
import TaxFiling from "@/pages/TaxFiling";
import TaxResources from "@/pages/TaxResources";
import { AuthProvider } from "./context/AuthContext";
import { ItrWizardProvider } from "./context/ItrWizardContext";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { queryClient } from "./lib/queryClient";


// import LearningResources from "@/pages/LearningResources"; // Will be replaced by BlogListPage for /learning
// import BlogPost from "@/pages/BlogPost"; // Unused import

// Lazy load calculator pages with improved loading
const CalculatorsIndex = lazy(() => import("@/pages/Calculators")); // Changed to uppercase 'C'
const LearningBlogPost = lazy(() => import("@/pages/learning/BlogPostPage")); // Updated path

// Take Home Salary Calculator
const TakeHomeSalaryCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/take-home-salary"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

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

const GstCalculator = lazy(() => {
  return Promise.all([
    import("@/components/GstCalculator"), // Path to the new component
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

// Define components for routes to help with type inference
const CreateBlogAdminPage: React.FC<RouteComponentProps<DefaultParams>> = () => {
  return <BlogAdmin mode="create" />;
};

const EditBlogAdminPage: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  return <BlogAdmin mode="edit" id={props.params.id} />;
};

const ListBlogAdminPage: React.FC<RouteComponentProps<DefaultParams>> = () => {
  return <BlogAdmin mode="list" />;
};

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
      <Route path="/learning" component={BlogListPage} /> {/* Changed to BlogListPage */}
      <Route path="/learning/blog/:slug">
        <Suspense fallback={<PageLoading />}>
          <LearningBlogPost />
        </Suspense>
      </Route>
      <Route path="/tax-resources" component={TaxResources} />
      <Route path="/tax-resources/:formId">
        {() => ( // Removed unused _params
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
      <ProtectedRoute path="/admin" component={Admin} allowedRoles={['admin']} /> {/* Protected for admin */}
      <Route path="/admin-login" component={AdminLogin} /> {/* Public login for admin - can be removed if main login is used */}

      {/* BlogAdmin routes using ProtectedRoute */}
      <ProtectedRoute path="/admin/blog" component={ListBlogAdminPage} allowedRoles={['admin']} />
      {/* Removed unused @ts-expect-error */}
      <ProtectedRoute
        path="/admin/blog/new"
        component={CreateBlogAdminPage}
        allowedRoles={['admin']}
      />
      <ProtectedRoute
        path="/admin/blog/edit/:id"
        component={EditBlogAdminPage}
        allowedRoles={['admin']}
      />
      <ProtectedRoute path="/admin/database-editor" component={DatabaseEditor} allowedRoles={['admin']} /> {/* Protected for admin */}
      <Route path="/payment" component={Payment} />
      <Route path="/filing-complete" component={FilingComplete} />
      <Route path="/tax-expert" component={TaxExpert} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/itr-filing" component={ItrFiling} />
      <ProtectedRoute path="/itr-filing/:filingId" component={ItrFiling} /> {/* Route for specific filing */}
      <ProtectedRoute path="/my-filings" component={MyFilings} />
      <ProtectedRoute path="/document-vault/:filingId" component={DocumentVault} /> {/* Route for specific filing's documents */}
      <ProtectedRoute path="/document-vault" component={DocumentVault} /> {/* General document vault */}

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
        <Suspense fallback={<PageLoading />}>
          <TakeHomeSalaryCalculator />
        </Suspense>
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

      <Route path="/calculators/gst">
        <Suspense fallback={<PageLoading />}>
          <GstCalculator />
        </Suspense>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.warn(
      "VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not function."
    );
    // Potentially render a fallback UI or allow app to run without Google Auth
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TaxDataProvider>
            <ItrWizardProvider>
              <GoogleOAuthProvider clientId={googleClientId || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER"}>
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
              </GoogleOAuthProvider>
            </ItrWizardProvider>
          </TaxDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
