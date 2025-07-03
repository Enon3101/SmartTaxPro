import { Calculator, Home, Car, IndianRupee, Percent, Calendar, History, PiggyBank } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CalculatorsPage = () => {
  const calculatorCategories = [
    {
      title: "Tax Calculators",
      description: "Tools to estimate your taxes and savings",
      calculators: [
        { name: "Income Tax Calculator", href: "/calculators/income-tax", icon: <IndianRupee className="h-5 w-5" /> },
        { name: "Tax Regime Comparison", href: "/calculators/tax-regime", icon: <History className="h-5 w-5" /> },
        { name: "HRA Exemption Calculator", href: "/calculators/hra", icon: <Home className="h-5 w-5" /> },
        { name: "TDS Calculator", href: "/calculators/tds", icon: <Calendar className="h-5 w-5" /> },
        { name: "Capital Gains Tax", href: "/calculators/capital-gains", icon: <IndianRupee className="h-5 w-5" /> },
        { name: "Take-home Salary Calculator", href: "/calculators/take-home-salary", icon: <IndianRupee className="h-5 w-5" /> },
        { name: "GST Calculator", href: "/calculators/gst", icon: <Percent className="h-5 w-5" /> }
      ]
    },
    {
      title: "Investment Calculators",
      description: "Plan your investments and future savings",
      calculators: [
        { name: "SIP Return Calculator", href: "/calculators/sip", icon: <Calendar className="h-5 w-5" /> },
        { name: "FD Maturity Calculator", href: "/calculators/fd", icon: <PiggyBank className="h-5 w-5" /> },
        { name: "PPF Calculator", href: "/calculators/ppf", icon: <Calculator className="h-5 w-5" /> },
        { name: "NPS Pension Calculator", href: "/calculators/nps", icon: <Calendar className="h-5 w-5" /> },
        { name: "Lumpsum MF Calculator", href: "/calculators/lumpsum", icon: <IndianRupee className="h-5 w-5" /> },
        { name: "Compound Interest", href: "/calculators/compound-interest", icon: <Percent className="h-5 w-5" /> }
      ]
    },
    {
      title: "Loan & Retirement",
      description: "Plan your loans and retirement corpus",
      calculators: [
        { name: "Loan EMI Calculator", href: "/calculators/loan-emi", icon: <Calculator className="h-5 w-5" /> },
        { name: "Home Loan EMI", href: "/calculators/home-loan", icon: <Home className="h-5 w-5" /> },
        { name: "Car Loan EMI", href: "/calculators/car-loan", icon: <Car className="h-5 w-5" /> },
        { name: "Personal Loan EMI", href: "/calculators/personal-loan", icon: <IndianRupee className="h-5 w-5" /> },
        { name: "Loan Against Property", href: "/calculators/lap", icon: <Home className="h-5 w-5" /> },
        { name: "Retirement Corpus Planner", href: "/calculators/retirement", icon: <Calendar className="h-5 w-5" /> },
        { name: "Gratuity Calculator", href: "/calculators/gratuity", icon: <Calculator className="h-5 w-5" /> }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Financial Calculators</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Use our comprehensive financial calculators to plan your taxes, investments, loans, and more.
          Make informed financial decisions with accurate calculations.
        </p>
      </div>

      <div className="space-y-10">
        {calculatorCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.calculators.map((calculator, calculatorIndex) => (
                <Link href={calculator.href} key={calculatorIndex}>
                  <Card className="cursor-pointer h-full transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          {calculator.icon}
                        </div>
                        <CardTitle className="text-lg">{calculator.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" className="w-full justify-start text-primary">
                        Use Calculator
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-muted rounded-lg p-6 mt-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">About Our Financial Calculators</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            Our calculators are designed to provide accurate estimates for your financial planning needs.
            All calculations are based on standard formulas used by financial institutions in India.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white">
              <h3 className="font-semibold mb-2">Updated Tax Rules</h3>
              <p className="text-sm text-muted-foreground">
                All tax calculators are updated with the latest tax slabs and rules for FY 2025-26.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white">
              <h3 className="font-semibold mb-2">Investment Planning</h3>
              <p className="text-sm text-muted-foreground">
                Plan your investments with accurate projections based on current market rates and trends.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white">
              <h3 className="font-semibold mb-2">Loan Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Compare different loan options and understand the total cost of borrowing with our EMI calculators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;
