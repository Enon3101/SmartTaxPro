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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Coins, 
  HelpCircle, 
  Info, 
  Calendar,
  BarChart
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Calculate compound interest
const calculateCompoundInterest = (
  principal: number,
  interestRate: number,
  years: number,
  compoundFrequency: string,
  additionalContribution: number = 0,
  contributionFrequency: string = "yearly"
) => {
  if (principal < 0 || interestRate < 0 || years <= 0) {
    return [];
  }

  // Convert compound frequency to number of times per year
  let compoundsPerYear = 1;
  switch (compoundFrequency) {
    case "annually": compoundsPerYear = 1; break;
    case "half-yearly": compoundsPerYear = 2; break;
    case "quarterly": compoundsPerYear = 4; break;
    case "monthly": compoundsPerYear = 12; break;
    case "daily": compoundsPerYear = 365; break;
    default: compoundsPerYear = 1;
  }

  // Convert contribution frequency to number of times per year
  let contributionsPerYear = 1;
  switch (contributionFrequency) {
    case "yearly": contributionsPerYear = 1; break;
    case "half-yearly": contributionsPerYear = 2; break;
    case "quarterly": contributionsPerYear = 4; break;
    case "monthly": contributionsPerYear = 12; break;
    default: contributionsPerYear = 1;
  }

  const totalPeriods = years * compoundsPerYear;
  const ratePerPeriod = interestRate / 100 / compoundsPerYear;
  const results = [];
  
  let currentBalance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    // Add contribution
    if (additionalContribution > 0 && period % (compoundsPerYear / contributionsPerYear) === 0) {
      currentBalance += additionalContribution;
      totalContributions += additionalContribution;
    }

    // Apply compound interest
    const interestEarned = currentBalance * ratePerPeriod;
    currentBalance += interestEarned;
    totalInterest += interestEarned;

    // Record result at the end of each year
    if (period % compoundsPerYear === 0) {
      const year = period / compoundsPerYear;
      results.push({
        year,
        balance: currentBalance,
        totalInterest,
        totalContributions
      });
    }
  }

  return results;
};

// Main Calculator Component
const CompoundInterestCalculator = () => {
  // State for form inputs
  const [principal, setPrincipal] = useState<number | "">(100000);
  const [interestRate, setInterestRate] = useState<number | "">(7.5);
  const [years, setYears] = useState<number | "">(10);
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [additionalContribution, setAdditionalContribution] = useState<number | "">(0);
  const [contributionFrequency, setContributionFrequency] = useState("yearly");
  const [showAllYears, setShowAllYears] = useState(false);

  // Results state
  const [calculationResults, setCalculationResults] = useState<any[]>([]);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Calculate compound interest on input change
  useEffect(() => {
    if (
      principal === "" ||
      interestRate === "" ||
      years === "" ||
      additionalContribution === ""
    ) {
      return;
    }

    const results = calculateCompoundInterest(
      Number(principal),
      Number(interestRate),
      Number(years),
      compoundFrequency,
      Number(additionalContribution),
      contributionFrequency
    );

    setCalculationResults(results);
    
    if (results.length > 0) {
      const lastResult = results[results.length - 1];
      setFinalAmount(lastResult.balance);
      setTotalInvestment(lastResult.totalContributions);
      setTotalInterest(lastResult.totalInterest);
    }
  }, [principal, interestRate, years, compoundFrequency, additionalContribution, contributionFrequency]);

  // Format currency values
  const formatCurrency = (value: number) => formatIndianCurrency(value);

  // Handle input changes as numbers
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    min: number = 0
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    
    if (value === "") {
      setter(value);
    } else if (!isNaN(value) && value >= min) {
      setter(value);
    }
  };

  // Get the number of years to display
  const getVisibleYears = () => {
    if (showAllYears || calculationResults.length <= 5) {
      return calculationResults;
    } else {
      // Show first 2 years, last 2 years, and middle year
      const visibleYears = [
        ...calculationResults.slice(0, 2),
        calculationResults[Math.floor(calculationResults.length / 2) - 1],
        ...calculationResults.slice(-2)
      ];
      return visibleYears;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <TrendingUp className="mr-2 h-8 w-8" /> 
        Compound Interest Calculator
      </h1>
      <p className="text-muted-foreground mb-8">
        Calculate how your investments grow over time with compound interest
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>
                Enter your investment details to calculate compound interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="principal">Initial Investment (₹)</Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="principal"
                      type="number"
                      value={principal}
                      onChange={(e) => handleNumberInput(e, setPrincipal)}
                      placeholder="10000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="additionalContribution">Additional Contribution (₹)</Label>
                  <div className="flex items-center">
                    <ArrowUpRight className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="additionalContribution"
                      type="number"
                      value={additionalContribution}
                      onChange={(e) => handleNumberInput(e, setAdditionalContribution)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
                  <Select
                    value={contributionFrequency}
                    onValueChange={setContributionFrequency}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Yearly" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="interestRate" className="flex items-center justify-between">
                    <span>Interest Rate (% per annum)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={interestRate !== "" ? [Number(interestRate)] : [7.5]}
                      onValueChange={(values) => setInterestRate(values[0])}
                      max={30}
                      min={0.1}
                      step={0.1}
                    />
                  </div>
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => handleNumberInput(e, setInterestRate, 0.1)}
                      placeholder="7.5"
                      step={0.1}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="compoundFrequency">Compound Frequency</Label>
                  <Select
                    value={compoundFrequency}
                    onValueChange={setCompoundFrequency}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Yearly" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="years">Investment Duration (Years)</Label>
                  <div className="mb-2">
                    <Slider
                      value={years !== "" ? [Number(years)] : [10]}
                      onValueChange={(values) => setYears(values[0])}
                      max={50}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => handleNumberInput(e, setYears, 1)}
                      placeholder="10"
                      min={1}
                      max={50}
                    />
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-6">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">About Compound Interest</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Compound interest is calculated on the initial principal and also on the accumulated interest of previous periods. It's the result of reinvesting interest, rather than paying it out, so that interest in the next period is earned on the principal sum plus previously accumulated interest.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The more frequently interest is compounded, the higher the effective annual rate will be, resulting in greater returns over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>
                Projected growth of your investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Investment</h4>
                  <p className="text-xl font-bold">{formatCurrency(totalInvestment)}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Interest</h4>
                  <p className="text-xl font-bold text-primary">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Final Amount</h4>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(finalAmount)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Year</TableHead>
                      <TableHead>Investment</TableHead>
                      <TableHead>Interest Earned</TableHead>
                      <TableHead>Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVisibleYears().map((result) => (
                      <TableRow key={result.year}>
                        <TableCell className="font-medium">{result.year}</TableCell>
                        <TableCell>{formatCurrency(result.totalContributions)}</TableCell>
                        <TableCell className="text-primary">{formatCurrency(result.totalInterest)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(result.balance)}</TableCell>
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
                <AccordionItem value="formula">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Compound Interest Formula
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>The basic compound interest formula is:</p>
                      <div className="bg-muted p-3 rounded font-mono text-xs">
                        A = P(1 + r/n)^(n*t)
                      </div>
                      <p>Where:</p>
                      <ul className="space-y-1 pl-5 list-disc">
                        <li>A = Final amount</li>
                        <li>P = Principal (initial investment)</li>
                        <li>r = Annual interest rate (in decimal form)</li>
                        <li>n = Number of times interest is compounded per year</li>
                        <li>t = Time in years</li>
                      </ul>
                      <p>For investments with regular contributions, the formula becomes more complex, and this calculator uses an iterative approach to calculate the final amount.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-implications">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-primary" /> 
                      Tax Implications in India
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Bank Fixed Deposits:</span> Interest is fully taxable as per your income tax slab rate. TDS is applicable if interest exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.</p>
                      <p><span className="font-medium">PPF, EPF, and Sukanya Samriddhi:</span> Interest earned is tax-exempt.</p>
                      <p><span className="font-medium">Debt Mutual Funds:</span> For investments made on or after April 1, 2023, gains are taxed as per your income tax slab rate. For investments before this date, long-term capital gains (holding period of more than 3 years) are taxed at 20% with indexation benefits.</p>
                      <p><span className="font-medium">Equity Mutual Funds:</span> Long-term capital gains (holding period of more than 1 year) are taxed at 10% without indexation benefits for gains exceeding ₹1 lakh in a financial year. Short-term capital gains are taxed at 15%.</p>
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

export default CompoundInterestCalculator;