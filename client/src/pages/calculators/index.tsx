import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, DollarSign, Home, Landmark, BarChart3, PiggyBank, 
  Calendar, Coins, TrendingUp, LineChart, Percent, 
  ArrowUpDown, Brain, Briefcase
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Calculators = () => {
  const taxCalculators = [
    {
      id: "tax-regime",
      title: "New vs Old Tax Regime Calculator",
      description: "Compare your tax liability under both tax regimes to make an informed decision.",
      icon: <Calculator className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/tax-regime"
    },
    {
      id: "tds",
      title: "TDS Calculator",
      description: "Calculate Tax Deducted at Source (TDS) for various income types under Indian tax laws.",
      icon: <DollarSign className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/tds"
    },
    {
      id: "hra",
      title: "HRA Exemption Calculator",
      description: "Calculate your House Rent Allowance (HRA) exemption based on your salary and rent paid.",
      icon: <Home className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/hra"
    },
    {
      id: "capital-gains",
      title: "Capital Gains Calculator",
      description: "Calculate tax on short-term and long-term capital gains from stocks, mutual funds, and property.",
      icon: <BarChart3 className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/capital-gains"
    },
    {
      id: "income-tax",
      title: "Income Tax Calculator",
      description: "Calculate your total income tax liability based on your income, deductions, and tax regime.",
      icon: <Coins className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/income-tax"
    },
    {
      id: "advance-tax",
      title: "Advance Tax Calculator",
      description: "Calculate your quarterly advance tax installments based on your estimated annual income.",
      icon: <Calendar className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/advance-tax"
    },
    {
      id: "gratuity",
      title: "Gratuity Calculator",
      description: "Calculate your gratuity amount based on your salary and years of service.",
      icon: <PiggyBank className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/gratuity"
    }
  ];
  
  const financialCalculators = [
    {
      id: "sip",
      title: "SIP Calculator",
      description: "Calculate returns on your Systematic Investment Plan (SIP) investments over time.",
      icon: <TrendingUp className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/sip"
    },
    {
      id: "compound-interest",
      title: "Compound Interest Calculator",
      description: "Calculate how your investments grow over time with compound interest.",
      icon: <LineChart className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/compound-interest"
    },
    {
      id: "fd",
      title: "FD Calculator",
      description: "Calculate returns on your Fixed Deposit investments with different interest rates and tenures.",
      icon: <Percent className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/fd"
    },
    {
      id: "ppf",
      title: "PPF Calculator",
      description: "Calculate returns on your Public Provident Fund (PPF) investments over 15 years.",
      icon: <Briefcase className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/ppf"
    },
    {
      id: "rd",
      title: "RD Calculator",
      description: "Calculate maturity value of your Recurring Deposit investments.",
      icon: <ArrowUpDown className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/rd"
    },
    {
      id: "loan-emi",
      title: "Loan EMI Calculator",
      description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
      icon: <Landmark className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/loan-emi"
    },
    {
      id: "retirement",
      title: "Retirement Calculator",
      description: "Plan your retirement by calculating the corpus required for your desired retirement lifestyle.",
      icon: <Brain className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/retirement"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Financial & Tax Calculators</h1>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {taxCalculators.map((calculator) => (
              <Link key={calculator.id} href={calculator.url}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-2">{calculator.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{calculator.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{calculator.description}</p>
                    <div className="text-primary font-medium">Use Calculator →</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {financialCalculators.map((calculator) => (
              <Link key={calculator.id} href={calculator.url}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-2">{calculator.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{calculator.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{calculator.description}</p>
                    <div className="text-primary font-medium">Use Calculator →</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;