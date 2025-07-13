import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { DefaultParams, Route, RouteComponentProps, Switch } from "wouter";

import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/Footer";
import Header from "@/components/layout/Header";
import AuthGuard from "@/roles/AuthGuard";
import { ScrollToTop } from "@/components/ScrollToTop";
import TaxExpertWidget from "@/components/TaxExpertWidget";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Admin from "@/features/admin/components/admin.page";
import AdminLogin from "@/features/admin/components/admin-login.page";
import AdminFileLibrary from "@/features/file-management/components/admin-file-library.page";
import BlogAdmin from "@/features/blog/components/blog-admin.page";
import Calculators from "@/pages/calculators.page";
import DatabaseEditor from "@/pages/database-editor.page";
import DocumentVault from "@/pages/document-vault.page";
import FilingComplete from "@/pages/filing-complete.page";
import FilingRequirements from "@/pages/filing-requirements.page";
import Home from "@/pages/home.page";
import ItrFiling from "@/features/tax-filing/components/itr-filing.page";
import ItrWizard from "@/features/tax-filing/components/itr-wizard.page";
import BlogListPage from "@/features/blog/components/blog-list.page";
import Login from "@/pages/login.page";
import MyFilings from "@/pages/my-filings.page";
import NotFound from "@/pages/not-found.page";
import TaxFormDetails from "@/pages/tax-form-details.page";
import Payment from "@/pages/payment.page";
import Pricing from "@/pages/pricing.page";
import Profile from "@/pages/profile.page";
import Register from "@/pages/register.page";
import StartFiling from "@/pages/start-filing.page";
import Support from "@/pages/support.page";
import TaxExpert from "@/pages/tax-expert.page";
import TaxFiling from "@/pages/tax-filing.page";
import TaxResources from "@/pages/tax-resources.page";
// Import for the new AY 2023-24 Guide
const HowToFileITROnline2023_24 = lazy(() => {
  return Promise.all([
    import("@/pages/tax-resources/HowToFileITROnline2023_24"),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]).then(([moduleExports]) => moduleExports);
});

import { AuthProvider } from "@/features/auth/AuthContext";
import { ItrWizardProvider } from "./context/ItrWizardContext";
import { TaxDataProvider } from "./context/TaxDataProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { queryClient } from "./lib/queryClient";


// import LearningResources from "@/pages/LearningResources"; // Will be replaced by BlogListPage for /learning
// import BlogPost from "@/pages/BlogPost"; // Unused import

// Lazy load calculator pages with improved loading
const CalculatorsIndex = lazy(() => import("@/pages/calculators.page"));
const LearningBlogPost = lazy(() => import("@/features/blog/components/blog-post.page"));

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

const LapCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/lap"),
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
    import("@/pages/itr-forms-guide.page"),
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

const NPSCalculator = lazy(() => {
  return Promise.all([
    import("@/pages/calculators/nps"),
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
      <Route path="/">
  <Suspense fallback={<PageLoading />}>
    <Home />
  </Suspense>
</Route>
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
      <Route path="/tax-resources/how-to-file-itr-online-2023-24">
        <Suspense fallback={<PageLoading />}>
          <HowToFileITROnline2023_24 />
        </Suspense>
      </Route>
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
      <AuthGuard path="/admin" component={Admin} allowedRoles={['admin', 'super_admin']} />
      <Route path="/admin-login" component={AdminLogin} /> {/* Public login for admin - can be removed if main login is used */}

      {/* Admin File Library */}
      <AuthGuard path="/admin/files" component={AdminFileLibrary} allowedRoles={['admin', 'super_admin']} />

      {/* BlogAdmin routes using ProtectedRoute */}
      <AuthGuard path="/admin/blog" component={ListBlogAdminPage} allowedRoles={['admin', 'super_admin']} />
      <AuthGuard
        path="/admin/blog/new"
        component={CreateBlogAdminPage}
        allowedRoles={['admin', 'super_admin']}
      />
      <AuthGuard
        path="/admin/blog/edit/:id"
        component={EditBlogAdminPage}
        allowedRoles={['admin', 'super_admin']}
      />
      <AuthGuard path="/admin/database-editor" component={DatabaseEditor} allowedRoles={['admin', 'super_admin']} />
      <Route path="/payment" component={Payment} />
      <Route path="/filing-complete" component={FilingComplete} />
      <Route path="/tax-expert" component={TaxExpert} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <AuthGuard path="/itr-filing" component={ItrFiling} />
      <AuthGuard path="/itr-filing/:filingId" component={ItrFiling} />
      <AuthGuard path="/my-filings" component={MyFilings} />
      <AuthGuard path="/document-vault/:filingId" component={DocumentVault} />
      <AuthGuard path="/document-vault" component={DocumentVault} />

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
      <Route path="/calculators/lap">
        <Suspense fallback={<PageLoading />}>
          <LapCalculator />
        </Suspense>
      </Route>
    
      <Route path="/calculators/gst">
        <Suspense fallback={<PageLoading />}>
          <GstCalculator />
        </Suspense>
      </Route>
    
      <Route path="/calculators/nps">
  <Suspense fallback={<PageLoading />}>
    <NPSCalculator />
  </Suspense>
</Route>
<Route path="/tax-form/:id">
  <Suspense fallback={<PageLoading />}>
    <TaxFormDetails />
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
                  <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
                    <ScrollToTop />
                    <Header />
                    <main className="flex-grow pb-16 sm:pb-0 px-0">
                      <div className="w-full max-w-none overflow-x-hidden">
                        <Router />
                      </div>
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
