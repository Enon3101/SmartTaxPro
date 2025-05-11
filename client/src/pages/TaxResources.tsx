import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calculator, 
  CalendarDays, 
  HelpCircle,
  DollarSign,
  Home,
  BarChart3,
  Calendar,
  Coins,
  PiggyBank,
  TrendingUp,
  LineChart,
  Percent,
  Building,
  Landmark
} from "lucide-react";

const TaxResources = () => {
  // Tax Calculators with icons and descriptions
  const taxCalculators = [
    {
      id: "tax-regime",
      title: "New vs Old Tax Regime Calculator",
      icon: <Calculator className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Compare your tax liability under both tax regimes to make an informed decision.",
      url: "/calculators/tax-regime"
    },
    {
      id: "tds",
      title: "TDS Calculator",
      icon: <DollarSign className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate Tax Deducted at Source (TDS) for various income types under Indian tax laws.",
      url: "/calculators/tds"
    },
    {
      id: "hra",
      title: "HRA Exemption Calculator",
      icon: <Home className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate your House Rent Allowance (HRA) exemption based on your salary and rent paid.",
      url: "/calculators/hra"
    },
    {
      id: "capital-gains",
      title: "Capital Gains Calculator",
      icon: <BarChart3 className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate tax on short-term and long-term capital gains from stocks, mutual funds, and property.",
      url: "/calculators/capital-gains"
    },
    {
      id: "income-tax",
      title: "Income Tax Calculator",
      icon: <Coins className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate your total income tax liability based on your income, deductions, and tax regime.",
      url: "/calculators/income-tax"
    },
    {
      id: "advance-tax",
      title: "Advance Tax Calculator",
      icon: <Calendar className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate your quarterly advance tax installments based on your estimated annual income.",
      url: "/calculators/advance-tax"
    },
    {
      id: "gratuity",
      title: "Gratuity Calculator",
      icon: <PiggyBank className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate your gratuity amount based on your salary and years of service.",
      url: "/calculators/gratuity"
    }
  ];
  
  // Financial Calculators with icons and descriptions
  const financialCalculators = [
    {
      id: "sip",
      title: "SIP Calculator",
      icon: <TrendingUp className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate returns on your Systematic Investment Plan (SIP) investments over time.",
      url: "/calculators/sip"
    },
    {
      id: "compound-interest",
      title: "Compound Interest Calculator",
      icon: <LineChart className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate how your investments grow over time with compound interest.",
      url: "/calculators/compound-interest"
    },
    {
      id: "fd",
      title: "FD Calculator",
      icon: <Building className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate returns on your Fixed Deposit investments with different interest rates and tenures.",
      url: "/calculators/fd"
    },
    {
      id: "loan-emi",
      title: "Loan EMI Calculator",
      icon: <Landmark className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
      url: "/calculators/loan-emi"
    },
    {
      id: "ppf",
      title: "PPF Calculator",
      icon: <Percent className="h-10 w-10 text-primary mb-4 mx-auto" />,
      description: "Calculate returns on your Public Provident Fund (PPF) investments over 15 years.",
      url: "/calculators/ppf"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tax Resources</h1>
        <p className="text-muted-foreground">
          Helpful tools and guides to simplify your Indian tax filing experience.
        </p>
      </div>

      {/* Calculators Section */}
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Financial & Tax Calculators</h2>
          <p className="text-muted-foreground">
            Use our comprehensive set of calculators to estimate taxes and plan your finances.
          </p>
        </div>
        
        <Tabs defaultValue="tax" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tax">Tax Calculators</TabsTrigger>
            <TabsTrigger value="financial">Financial Calculators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tax">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* New vs Old Tax Regime Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Calculator className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">New vs Old Tax Regime Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compare your tax liability under both tax regimes to make an informed decision.
                  </p>
                  <Link href="/calculators/tax-regime">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* TDS Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <DollarSign className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">TDS Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate Tax Deducted at Source (TDS) for various income types under Indian tax laws.
                  </p>
                  <Link href="/calculators/tds">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* HRA Exemption Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Home className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">HRA Exemption Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate your House Rent Allowance (HRA) exemption based on your salary and rent paid.
                  </p>
                  <Link href="/calculators/hra">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Capital Gains Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <BarChart3 className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Capital Gains Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate tax on short-term and long-term capital gains from stocks, mutual funds, and property.
                  </p>
                  <Link href="/calculators/capital-gains">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Income Tax Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Coins className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Income Tax Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate your total income tax liability based on your income, deductions, and tax regime.
                  </p>
                  <Link href="/calculators/income-tax">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Advance Tax Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Calendar className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Advance Tax Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate your quarterly advance tax installments based on your estimated annual income.
                  </p>
                  <Link href="/calculators/advance-tax">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Gratuity Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <PiggyBank className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Gratuity Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate your gratuity amount based on your salary and years of service.
                  </p>
                  <Link href="/calculators/gratuity">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SIP Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <TrendingUp className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">SIP Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate returns on your Systematic Investment Plan (SIP) investments over time.
                  </p>
                  <Link href="/calculators/sip">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Compound Interest Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <LineChart className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Compound Interest Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate how your investments grow over time with compound interest.
                  </p>
                  <Link href="/calculators/compound-interest">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* FD Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Building className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">FD Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate returns on your Fixed Deposit investments with different interest rates and tenures.
                  </p>
                  <Link href="/calculators/fd">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* Loan EMI Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Landmark className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Loan EMI Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.
                  </p>
                  <Link href="/calculators/loan-emi">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* PPF Calculator */}
              <div className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                  <Percent className="text-primary h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">PPF Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate returns on your Public Provident Fund (PPF) investments over 15 years.
                  </p>
                  <Link href="/calculators/ppf">
                    <div className="text-primary font-medium hover:underline text-sm">Use Calculator →</div>
                  </Link>
                </div>
              </div>
              
              {/* View All Calculators */}
              <Link href="/calculators" className="w-full">
                <div className="border border-dashed border-primary rounded-md overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex justify-center p-6 border-b border-primary/30 bg-primary/5 flex-grow">
                    <Calculator className="text-primary h-16 w-16 opacity-60" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-1">View All Calculators</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Explore our complete range of financial and tax calculators
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ITR Forms & Deadlines */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <CardTitle>ITR Forms & Instructions</CardTitle>
            </div>
            <CardDescription>Access common Income Tax Return forms</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <Link href="#" className="text-primary hover:underline">
                  ITR-1 (Sahaj) for Salaried Individuals
                </Link>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <Link href="#" className="text-primary hover:underline">
                  ITR-2 (Salary, Capital Gains, House Property)
                </Link>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <Link href="#" className="text-primary hover:underline">
                  ITR-3 (Business Income & Professionals)
                </Link>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <Link href="#" className="text-primary hover:underline">
                  ITR-4 (Sugam) for Presumptive Income
                </Link>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                <Link href="#" className="text-primary hover:underline">
                  View All ITR Forms →
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <CalendarDays className="h-6 w-6 text-primary mr-2" />
              <CardTitle>Tax Deadlines</CardTitle>
            </div>
            <CardDescription>Stay on top of important Indian tax dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="min-w-[100px] font-medium">July 31, 2024</div>
                <div className="text-sm text-muted-foreground">ITR filing deadline for non-audit cases (AY 2024-25)</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-[100px] font-medium">June 15, 2024</div>
                <div className="text-sm text-muted-foreground">First installment of advance tax (15%)</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-[100px] font-medium">Sept 15, 2024</div>
                <div className="text-sm text-muted-foreground">Second installment of advance tax (45%)</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-[100px] font-medium">Oct 31, 2024</div>
                <div className="text-sm text-muted-foreground">ITR deadline for audit cases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Guides & Articles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Tax Guides & Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                New vs Old Tax Regime: Which Should You Choose?
              </h3>
              <p className="text-muted-foreground mb-4">
                Understand the differences between the new and old tax regimes in India, 
                and determine which option might save you more tax based on your income and investments.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Tax Benefits Under Section 80C to 80U
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore the comprehensive list of deductions available under various subsections from 
                80C to 80U, including investments, insurance, and medical expenses.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                GST for Small Businesses & Professionals
              </h3>
              <p className="text-muted-foreground mb-4">
                Navigate the Goods and Services Tax framework for small businesses, 
                freelancers, and professionals. Learn about registration, filing requirements, and input tax credits.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Tax Benefits for NPS and ELSS Investments
              </h3>
              <p className="text-muted-foreground mb-4">
                Discover the tax advantages of investing in National Pension System (NPS) and 
                Equity-Linked Savings Schemes (ELSS) under Indian tax laws.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Box */}
      <Card className="bg-primary/5 border-0 mb-12">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Have a Tax Question?</h3>
              <p className="text-muted-foreground mb-4">
                Our tax experts are ready to help you navigate complex Indian tax situations 
                and find the best solutions for your specific needs.
              </p>
              <Link href="/support" className="text-primary hover:underline font-medium">
                Contact Our Tax Experts →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResources;
