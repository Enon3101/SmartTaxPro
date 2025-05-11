import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calculator, 
  CalendarDays, 
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
import { usePreloadCalculator } from "@/hooks/usePreloadCalculator";

const Calculators = () => {
  const { 
    preloadTaxRegimeCalculator,
    preloadHraCalculator,
    preloadTdsCalculator,
    preloadCapitalGainsCalculator,
    preloadSipCalculator,
    preloadFdCalculator,
    preloadLoanEmiCalculator
  } = usePreloadCalculator();
  
  // Preload the most commonly used calculators when the page loads
  useEffect(() => {
    // Delay preloading to prioritize rendering the current page first
    const timer = setTimeout(() => {
      // Preload the most popular calculators
      preloadTaxRegimeCalculator();
      preloadSipCalculator();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [preloadTaxRegimeCalculator, preloadSipCalculator]);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Financial & Tax Calculators</h1>
        <p className="text-muted-foreground">
          Use our comprehensive set of calculators to estimate taxes and plan your finances.
        </p>
      </div>
      
      <Tabs defaultValue="tax" className="w-full mb-12">
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadTaxRegimeCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadTdsCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadHraCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadCapitalGainsCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadSipCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadFdCalculator}
                  >
                    Use Calculator →
                  </div>
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
                  <div 
                    className="text-primary font-medium hover:underline text-sm"
                    onMouseEnter={preloadLoanEmiCalculator}
                  >
                    Use Calculator →
                  </div>
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
      
      {/* Tax Deadlines */}
      <div className="mt-8 mb-12">
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
    </div>
  );
};

export default Calculators;