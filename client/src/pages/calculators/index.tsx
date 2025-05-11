import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, DollarSign, Home, Landmark, BarChart3, PiggyBank, Calendar, Coins } from "lucide-react";

const Calculators = () => {
  const calculators = [
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
      id: "loan-emi",
      title: "Loan EMI Calculator",
      description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
      icon: <Landmark className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/loan-emi"
    },
    {
      id: "gratuity",
      title: "Gratuity Calculator",
      description: "Calculate your gratuity amount based on your salary and years of service.",
      icon: <PiggyBank className="h-8 w-8 text-primary mb-4" />,
      url: "/calculators/gratuity"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tax Calculators</h1>
        <p className="text-muted-foreground">
          Use our comprehensive set of tax calculators to estimate various aspects of your taxes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {calculators.map((calculator) => (
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
    </div>
  );
};

export default Calculators;