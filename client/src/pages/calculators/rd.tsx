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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowUpDown, 
  Building, 
  Clock, 
  Coins, 
  HelpCircle, 
  Info, 
  AlertCircle,
  Calculator
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Calculate RD maturity amount
const calculateRD = (
  monthlyDeposit: number,
  interestRate: number,
  tenureMonths: number,
  seniorCitizen: boolean = false
) => {
  if (monthlyDeposit <= 0 || interestRate <= 0 || tenureMonths <= 0) {
    return {
      totalDeposit: 0,
      totalInterest: 0,
      maturityAmount: 0,
      quarterlyDetails: []
    };
  }

  // Adjust interest rate for senior citizens (typically +0.5%)
  const effectiveInterestRate = seniorCitizen ? interestRate + 0.5 : interestRate;
  
  // Convert annual interest rate to monthly
  const monthlyRate = effectiveInterestRate / 12 / 100;
  
  let maturityAmount = 0;
  let totalDeposit = monthlyDeposit * tenureMonths;
  let quarterlyDetails = [];

  // Calculating Quarterly Details
  for (let quarter = 1; quarter <= Math.ceil(tenureMonths / 3); quarter++) {
    const monthsInQuarter = Math.min(3, tenureMonths - (quarter - 1) * 3);
    const depositInQuarter = monthlyDeposit * monthsInQuarter;
    
    // Calculate accumulated amount till this quarter
    let currentMaturityAmount = 0;
    for (let m = 1; m <= quarter * 3 && m <= tenureMonths; m++) {
      const n = tenureMonths - m + 1; // Remaining months
      currentMaturityAmount += monthlyDeposit * Math.pow(1 + monthlyRate, n - 1);
    }
    
    const quarterEndMonth = Math.min(quarter * 3, tenureMonths);
    
    quarterlyDetails.push({
      quarter,
      monthRange: `${(quarter - 1) * 3 + 1}-${quarterEndMonth}`,
      depositAmount: depositInQuarter,
      accumulatedDeposit: monthlyDeposit * quarterEndMonth,
      maturityValue: currentMaturityAmount
    });
  }

  // Calculate final maturity amount
  for (let m = 1; m <= tenureMonths; m++) {
    const n = tenureMonths - m + 1; // Remaining months
    maturityAmount += monthlyDeposit * Math.pow(1 + monthlyRate, n - 1);
  }

  const totalInterest = maturityAmount - totalDeposit;

  return {
    totalDeposit,
    totalInterest,
    maturityAmount,
    quarterlyDetails
  };
};

// Main Calculator Component
const RDCalculator = () => {
  // State for form inputs
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | "">(5000);
  const [interestRate, setInterestRate] = useState<number | "">(6.5);
  const [tenureMonths, setTenureMonths] = useState<number | "">(36);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState("no");
  const [showAllQuarters, setShowAllQuarters] = useState(false);

  // RD calculation results
  const [totalDeposit, setTotalDeposit] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [quarterlyDetails, setQuarterlyDetails] = useState<any[]>([]);

  // Calculate RD on input change
  useEffect(() => {
    if (
      monthlyDeposit === "" ||
      interestRate === "" ||
      tenureMonths === ""
    ) {
      return;
    }

    const results = calculateRD(
      Number(monthlyDeposit),
      Number(interestRate),
      Number(tenureMonths),
      isSeniorCitizen === "yes"
    );

    setTotalDeposit(results.totalDeposit);
    setTotalInterest(results.totalInterest);
    setMaturityAmount(results.maturityAmount);
    setQuarterlyDetails(results.quarterlyDetails);
  }, [monthlyDeposit, interestRate, tenureMonths, isSeniorCitizen]);

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

  // Get the number of quarters to display
  const getVisibleQuarters = () => {
    if (showAllQuarters || quarterlyDetails.length <= 5) {
      return quarterlyDetails;
    } else {
      // Show first 2 quarters, last 2 quarters, and middle quarter
      const visibleQuarters = [
        ...quarterlyDetails.slice(0, 2),
        ...quarterlyDetails.slice(-2)
      ];
      return visibleQuarters;
    }
  };

  // Calculate effective annual yield
  const calculateEffectiveYield = () => {
    if (totalDeposit === 0 || maturityAmount === 0) return 0;
    
    const avgInvestmentPeriod = Number(tenureMonths) / 2 / 12; // average time in years
    const effectiveYield = (Math.pow(maturityAmount / totalDeposit, 1 / avgInvestmentPeriod) - 1) * 100;
    
    return effectiveYield.toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <ArrowUpDown className="mr-2 h-8 w-8" /> 
        Recurring Deposit Calculator
      </h1>
      <p className="text-muted-foreground mb-8">
        Calculate maturity value of your Recurring Deposit investments
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>RD Investment Details</CardTitle>
              <CardDescription>
                Enter your RD details to calculate maturity amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthlyDeposit">Monthly Deposit (₹)</Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthlyDeposit"
                      type="number"
                      value={monthlyDeposit}
                      onChange={(e) => handleNumberInput(e, setMonthlyDeposit, 500)}
                      placeholder="5000"
                      min={500}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="interestRate" className="flex items-center justify-between">
                    <span>Interest Rate (% per annum)</span>
                    <span className="text-xs text-muted-foreground">Current rates range from 5.5% to 7.5%</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={interestRate !== "" ? [Number(interestRate)] : [6.5]}
                      onValueChange={(values) => setInterestRate(values[0])}
                      max={10}
                      min={4}
                      step={0.1}
                    />
                  </div>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => handleNumberInput(e, setInterestRate, 0.1)}
                      placeholder="6.5"
                      step={0.1}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tenureMonths" className="flex items-center justify-between">
                    <span>Tenure (Months)</span>
                    <span className="text-xs text-muted-foreground">Typically ranges from 6 to 120 months</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={tenureMonths !== "" ? [Number(tenureMonths)] : [36]}
                      onValueChange={(values) => setTenureMonths(values[0])}
                      max={120}
                      min={3}
                      step={3}
                    />
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tenureMonths"
                      type="number"
                      value={tenureMonths}
                      onChange={(e) => handleNumberInput(e, setTenureMonths, 3)}
                      placeholder="36"
                      min={3}
                      max={120}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="seniorCitizen">Senior Citizen</Label>
                  <RadioGroup
                    defaultValue="no"
                    value={isSeniorCitizen}
                    onValueChange={setIsSeniorCitizen}
                    className="mt-2 flex"
                  >
                    <div className="flex items-center space-x-2 mr-6">
                      <RadioGroupItem value="yes" id="senior-yes" />
                      <Label htmlFor="senior-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="senior-no" />
                      <Label htmlFor="senior-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                  {isSeniorCitizen === "yes" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Senior citizens typically get +0.5% additional interest rate
                    </p>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-6">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">About Recurring Deposits</h3>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Recurring Deposit (RD) is a term deposit offered by banks where you deposit a fixed amount monthly.</li>
                    <li>• The minimum deposit amount varies, typically from ₹100 to ₹500 depending on the bank.</li>
                    <li>• Tenure ranges from 6 months to 10 years.</li>
                    <li>• Interest is compounded quarterly in most banks.</li>
                    <li>• Premature withdrawal is allowed with a penalty on the interest rate.</li>
                    <li>• Interest earned on RDs is taxable under "Income from Other Sources" as per your income tax slab.</li>
                    <li>• TDS is applicable if the interest earned exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>RD Calculation Results</CardTitle>
              <CardDescription>
                Maturity details of your Recurring Deposit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Investment</h4>
                  <p className="text-xl font-bold">{formatCurrency(totalDeposit)}</p>
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
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-6">
                <h3 className="text-sm font-medium flex items-center mb-2">
                  <Calculator className="h-4 w-4 mr-2 text-primary" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Effective Annual Yield</p>
                    <p className="font-medium">{calculateEffectiveYield()}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Interest to Principal Ratio</p>
                    <p className="font-medium">{totalDeposit > 0 ? ((totalInterest / totalDeposit) * 100).toFixed(2) : 0}%</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Quarterly Progress</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Quarter</TableHead>
                      <TableHead>Deposit</TableHead>
                      <TableHead>Accumulated</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVisibleQuarters().map((detail) => (
                      <TableRow key={detail.quarter}>
                        <TableCell className="font-medium">{detail.quarter} ({detail.monthRange})</TableCell>
                        <TableCell>{formatCurrency(detail.depositAmount)}</TableCell>
                        <TableCell>{formatCurrency(detail.accumulatedDeposit)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(detail.maturityValue)}</TableCell>
                      </TableRow>
                    ))}
                    
                    {quarterlyDetails.length > 5 && !showAllQuarters && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllQuarters(true)}
                            className="text-xs"
                          >
                            Show all {quarterlyDetails.length} quarters
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {showAllQuarters && quarterlyDetails.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllQuarters(false)}
                            className="text-xs"
                          >
                            Show fewer quarters
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="tax-implications">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Tax Implications
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Interest taxation:</span> Interest earned on RDs is fully taxable and added to your total income. It is taxed as per your income tax slab rate.</p>
                      <p><span className="font-medium">TDS applicability:</span> Banks deduct TDS (Tax Deducted at Source) at the rate of 10% if the interest earned exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year.</p>
                      <p><span className="font-medium">Form 15G/15H exemption:</span> If your total income is below the taxable limit, you can submit Form 15G (for non-senior citizens) or Form 15H (for senior citizens) to avoid TDS deduction.</p>
                      <p><span className="font-medium">PAN requirement:</span> If PAN is not provided, TDS will be deducted at a higher rate of two%.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="premature-withdrawal">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Premature Withdrawal Rules
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Penalty:</span> Most banks charge a penalty of 0.5% to 1% on the interest rate for premature withdrawal. Some banks may have a slab-based penalty structure based on how long the RD has been held.</p>
                      <p><span className="font-medium">Minimum tenure:</span> Generally, banks require that the RD has been maintained for at least 3 months before allowing premature withdrawal.</p>
                      <p><span className="font-medium">Partial withdrawal:</span> Partial withdrawals are typically not allowed in RDs. You need to break the entire deposit if you wish to withdraw funds.</p>
                      <p><span className="font-medium">Impact on returns:</span> Premature withdrawal significantly reduces your effective returns, as you not only pay a penalty but also lose out on the higher interest rates that come with longer tenures.</p>
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

export default RDCalculator;