import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { 
  PiggyBank, 
  Building, 
  Clock, 
  Coins, 
  HelpCircle, 
  Info, 
  AlertCircle,
  Calculator,
  LineChart
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Calculate compound interest for PPF
const calculatePPF = (
  principal: number,
  additionalYearlyContribution: number,
  interestRate: number,
  years: number
) => {
  if (principal < 0 || additionalYearlyContribution < 0 || interestRate < 0 || years <= 0) {
    return [];
  }

  const results = [];
  let balance = principal;
  let totalInvestment = principal;
  let totalInterest = 0;

  for (let year = 1; year <= years; year++) {
    // Add yearly contribution (except for first year as it's included in principal)
    if (year > 1) {
      balance += additionalYearlyContribution;
      totalInvestment += additionalYearlyContribution;
    }

    // Calculate interest for the year
    const yearlyInterest = balance * (interestRate / 100);
    balance += yearlyInterest;
    totalInterest += yearlyInterest;

    results.push({
      year,
      yearlyContribution: year === 1 ? principal : additionalYearlyContribution,
      yearlyInterest,
      balance,
      totalInvestment,
      totalInterest
    });
  }

  return results;
};

// Main Calculator Component
const PPFCalculator = () => {
  // State for form inputs
  const [initialInvestment, setInitialInvestment] = useState<number | "">(500);
  const [yearlyContribution, setYearlyContribution] = useState<number | "">(500);
  const [interestRate, setInterestRate] = useState<number | "">(7.1);
  const [years, setYears] = useState<number | "">(15);
  const [showAllYears, setShowAllYears] = useState(false);

  // PPF calculation results
  const [calculationResults, setCalculationResults] = useState<any[]>([]);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Calculate PF on input change
  useEffect(() => {
    if (
      initialInvestment === "" ||
      yearlyContribution === "" ||
      interestRate === "" ||
      years === ""
    ) {
      return;
    }

    // Ensure values are within PPF limits
    const validInitialInvestment = Math.max(500, Math.min(Number(initialInvestment), 150000));
    const validYearlyContribution = Math.max(500, Math.min(Number(yearlyContribution), 150000));
    
    const results = calculatePPF(
      validInitialInvestment,
      validYearlyContribution,
      Number(interestRate),
      Number(years)
    );

    setCalculationResults(results);
    
    if (results.length > 0) {
      const lastResult = results[results.length - 1];
      setMaturityAmount(lastResult.balance);
      setTotalInvestment(lastResult.totalInvestment);
      setTotalInterest(lastResult.totalInterest);
    }
  }, [initialInvestment, yearlyContribution, interestRate, years]);

  // Format currency values
  const formatCurrency = (value: number) => formatIndianCurrency(value);

  // Handle input changes as numbers
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    min: number,
    max: number
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    
    if (value === "") {
      setter(value);
    } else if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, max));
      setter(clampedValue);
    }
  };

  // Get the number of years to display
  const getVisibleYears = () => {
    if (showAllYears || calculationResults.length <= 5) {
      return calculationResults;
    } else {
      // Show first 2 years, last 2 years, and current year
      const visibleYears = [
        ...calculationResults.slice(0, 2),
        ...calculationResults.slice(-3)
      ];
      return visibleYears;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
        <PiggyBank className="mr-2 h-6 w-6 md:h-8 md:w-8" /> 
        PPF Calculator
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
        Calculate returns on your Public Provident Fund (PPF) investment over 15 years
      </p>
      
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>PPF Investment Details</CardTitle>
              <CardDescription>
                Enter your investment details to calculate PPF returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="initialInvestment" className="flex items-center justify-between mb-2">
                    <span>Initial Investment (₹)</span>
                    <span className="text-xs text-muted-foreground">Min: ₹500, Max: ₹1,50,000</span>
                  </Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Input
                      id="initialInvestment"
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => handleNumberInput(e, setInitialInvestment, 500, 150000)}
                      placeholder="500"
                      min={500}
                      max={150000}
                      className="flex-grow"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="yearlyContribution" className="flex items-center justify-between">
                    <span>Yearly Contribution (₹)</span>
                    <span className="text-xs text-muted-foreground">Min: ₹500, Max: ₹1,50,000</span>
                  </Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="yearlyContribution"
                      type="number"
                      value={yearlyContribution}
                      onChange={(e) => handleNumberInput(e, setYearlyContribution, 500, 150000)}
                      placeholder="500"
                      min={500}
                      max={150000}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Label htmlFor="interestRate" className="flex items-center justify-between mb-2">
                    <span>Interest Rate (%)</span>
                    <span className="text-xs text-muted-foreground">Current: 7.1% p.a.</span>
                  </Label>
                  <div className="flex items-center">
                    <LineChart className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => handleNumberInput(e, setInterestRate, 0, 20)}
                      placeholder="7.1"
                      step={0.1}
                      className="flex-grow"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Label htmlFor="years" className="flex items-center justify-between mb-2">
                    <span>Investment Period (Years)</span>
                    <span className="text-xs text-muted-foreground">PPF has a lock-in period of 15 years</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={years !== "" ? [Number(years)] : [15]}
                      onValueChange={(values) => setYears(values[0])}
                      max={50}
                      min={5}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => handleNumberInput(e, setYears, 5, 50)}
                      placeholder="15"
                      min={5}
                      max={50}
                      className="flex-grow"
                    />
                  </div>
                </div>
                
                <div className="bg-muted p-3 md:p-4 rounded-md mt-5 md:mt-6">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-primary" />
                    <h3 className="text-xs md:text-sm font-medium">About PPF</h3>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 leading-tight md:leading-normal">
                    <li>• Public Provident Fund (PPF) is a government-backed long-term savings scheme in India.</li>
                    <li>• Minimum deposit: ₹500, maximum: ₹1,50,000 per financial year.</li>
                    <li>• Current interest rate is 7.1% p.a. (compounded annually).</li>
                    <li>• 15 year lock-in period, partial withdrawal from 7th year.</li>
                    <li>• Qualifies for tax deduction under Section 80C.</li>
                    <li>• Interest and maturity amount are tax-free under Section 10.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>PPF Calculation Results</CardTitle>
              <CardDescription>
                Projected growth of your PPF investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Investment</h4>
                  <p className="text-xl font-bold">{formatCurrency(totalInvestment)}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Interest</h4>
                  <p className="text-xl font-bold text-primary">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Maturity Amount</h4>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(maturityAmount)}</p>
                </div>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Year</TableHead>
                      <TableHead>Investment</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVisibleYears().map((result) => (
                      <TableRow key={result.year}>
                        <TableCell className="font-medium whitespace-nowrap">{result.year}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(result.yearlyContribution)}</TableCell>
                        <TableCell className="text-primary whitespace-nowrap">{formatCurrency(result.yearlyInterest)}</TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">{formatCurrency(result.balance)}</TableCell>
                      </TableRow>
                    ))}
                    
                    {calculationResults.length > 5 && !showAllYears && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllYears(true)}
                            className="text-xs"
                          >
                            Show all {calculationResults.length} years
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {showAllYears && calculationResults.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllYears(false)}
                            className="text-xs"
                          >
                            Show fewer years
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="tax-benefits">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Tax Benefits of PPF
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Deduction under Section 80C:</span> Investments up to ₹1.5 lakh per year can be claimed as a deduction from your taxable income.</p>
                      <p><span className="font-medium">Tax-free interest:</span> The interest earned on PPF is completely tax-free.</p>
                      <p><span className="font-medium">Tax-free maturity amount:</span> The entire maturity amount received at the end of the lock-in period is tax-free.</p>
                      <p><span className="font-medium">Example:</span> If you invest ₹1.5 lakh annually in PPF and fall in the 30% tax bracket, you can save ₹45,000 in taxes every year.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="withdrawal-rules">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Withdrawal and Extension Rules
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Partial withdrawals:</span> Allowed from the 7th financial year onwards, limited to 50% of the balance at the end of the 4th year preceding the withdrawal year or the immediate preceding year, whichever is lower.</p>
                      <p><span className="font-medium">Loan facility:</span> Loans against PPF are available from the 3rd to 6th financial year, with an interest rate of 1% higher than the PPF interest rate.</p>
                      <p><span className="font-medium">Extension:</span> After the initial 15-year period, you can extend your PPF account in blocks of 5 years indefinitely with or without additional contributions.</p>
                      <p><span className="font-medium">Premature closure:</span> Allowed only in extreme circumstances like serious illness or higher education, after 5 years of account opening.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PPFCalculator;