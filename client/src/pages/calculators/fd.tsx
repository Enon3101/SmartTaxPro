import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  Percent, Calculator, DollarSign, Calendar,
  PiggyBank, Building, BadgeIndianRupee
} from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

const FdCalculator = () => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7.0);
  const [tenureYears, setTenureYears] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("quarterly");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
  const [isTaxDeducted, setIsTaxDeducted] = useState<boolean>(true);
  
  // Results
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [effectiveYield, setEffectiveYield] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  const [taxDeducted, setTaxDeducted] = useState<number>(0);
  
  // Senior citizen bonus interest rate
  const seniorCitizenBonus = 0.5; // 0.5% additional for senior citizens
  
  // TDS rate
  const tdsRate = 10; // 10% TDS on interest if no PAN or interest > 40,000 per FY
  
  // Auto-update calculations on input change
  useEffect(() => {
    calculateFdReturns();
  }, [
    principal, 
    interestRate, 
    tenureYears, 
    tenureMonths, 
    compoundingFrequency, 
    isSeniorCitizen,
    isTaxDeducted
  ]);
  
  // Calculate compounding period factor
  const getCompoundingPeriods = (): number => {
    switch (compoundingFrequency) {
      case "simple": return 1; // Simple interest
      case "yearly": return 1;
      case "half-yearly": return 2;
      case "quarterly": return 4;
      case "monthly": return 12;
      default: return 4; // Default: quarterly
    }
  };
  
  // Calculate FD returns
  const calculateFdReturns = () => {
    // Calculate total tenure in months
    const totalMonths = tenureYears * 12 + tenureMonths;
    
    // Calculate total tenure in years (for compound interest formula)
    const tenureInYears = totalMonths / 12;
    
    // Adjust interest rate for senior citizens
    const adjustedRate = isSeniorCitizen ? interestRate + seniorCitizenBonus : interestRate;
    
    // Calculate maturity amount
    let calculatedMaturityAmount = 0;
    
    if (compoundingFrequency === "simple") {
      // A = P(1 + rt) for simple interest
      calculatedMaturityAmount = principal * (1 + (adjustedRate / 100) * tenureInYears);
    } else {
      // A = P(1 + r/n)^(nt) for compound interest
      const n = getCompoundingPeriods();
      calculatedMaturityAmount = principal * Math.pow(1 + (adjustedRate / 100 / n), n * tenureInYears);
    }
    
    // Calculate interest earned
    const interestEarned = calculatedMaturityAmount - principal;
    
    // Calculate TDS if applicable (assuming TDS on interest over 40,000 per year)
    let tds = 0;
    if (isTaxDeducted && interestEarned > 40000) {
      tds = (interestEarned - 40000) * (tdsRate / 100);
    }
    
    // Adjust maturity amount after TDS
    const maturityAfterTax = calculatedMaturityAmount - tds;
    
    // Calculate effective annual yield
    const effectiveAnnualYield = (Math.pow(maturityAfterTax / principal, 1 / tenureInYears) - 1) * 100;
    
    setMaturityAmount(maturityAfterTax);
    setTotalInterest(interestEarned);
    setEffectiveYield(effectiveAnnualYield);
    setTaxDeducted(tds);
    
    // Generate yearly breakdown
    generateYearlyBreakdown(principal, adjustedRate, totalMonths, compoundingFrequency);
  };
  
  // Generate yearly breakdown of investment growth
  const generateYearlyBreakdown = (
    initialAmount: number, 
    rate: number, 
    totalMonths: number, 
    compoundingType: string
  ) => {
    const breakdown = [];
    const n = getCompoundingPeriods();
    let currentAmount = initialAmount;
    
    // Calculate max number of complete years
    const completeYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    
    // Generate data for each complete year
    for (let year = 1; year <= completeYears; year++) {
      let yearEndAmount = 0;
      let yearlyInterest = 0;
      
      if (compoundingType === "simple") {
        // Simple interest for one year
        yearlyInterest = currentAmount * (rate / 100);
        yearEndAmount = currentAmount + yearlyInterest;
      } else {
        // Compound interest for one year
        yearEndAmount = currentAmount * Math.pow(1 + (rate / 100 / n), n);
        yearlyInterest = yearEndAmount - currentAmount;
      }
      
      breakdown.push({
        year,
        startAmount: currentAmount,
        interest: yearlyInterest,
        endAmount: yearEndAmount
      });
      
      currentAmount = yearEndAmount;
    }
    
    // Add data for remaining months if any
    if (remainingMonths > 0) {
      let finalAmount = 0;
      let finalInterest = 0;
      
      if (compoundingType === "simple") {
        // Simple interest for remaining months
        finalInterest = currentAmount * (rate / 100) * (remainingMonths / 12);
        finalAmount = currentAmount + finalInterest;
      } else {
        // Compound interest for remaining months
        finalAmount = currentAmount * Math.pow(1 + (rate / 100 / n), n * (remainingMonths / 12));
        finalInterest = finalAmount - currentAmount;
      }
      
      breakdown.push({
        year: completeYears + 1,
        startAmount: currentAmount,
        interest: finalInterest,
        endAmount: finalAmount,
        months: remainingMonths
      });
    }
    
    setYearlyBreakdown(breakdown);
  };
  
  const handleSliderChange = (field: string, value: number[]) => {
    switch (field) {
      case "principal":
        setPrincipal(value[0]);
        break;
      case "interest":
        setInterestRate(value[0]);
        break;
      case "tenure-years":
        setTenureYears(value[0]);
        break;
      case "tenure-months":
        setTenureMonths(value[0]);
        break;
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">FD Calculator</h1>
        <p className="text-muted-foreground">
          Calculate returns on your Fixed Deposit investments with different interest rates and tenures
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BankIcon className="mr-2 h-5 w-5" />
                FD Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(principal)}</span>
                </div>
                <Slider
                  id="principal"
                  min={1000}
                  max={10000000}
                  step={1000}
                  value={[principal]}
                  onValueChange={(value) => handleSliderChange("principal", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
                  <span className="text-sm font-medium">{interestRate}%</span>
                </div>
                <Slider
                  id="interest-rate"
                  min={3}
                  max={12}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(value) => handleSliderChange("interest", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="mt-2"
                  step="0.1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="tenure-years">Years</Label>
                    <span className="text-sm font-medium">{tenureYears}</span>
                  </div>
                  <Slider
                    id="tenure-years"
                    min={0}
                    max={10}
                    step={1}
                    value={[tenureYears]}
                    onValueChange={(value) => handleSliderChange("tenure-years", value)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="tenure-months">Months</Label>
                    <span className="text-sm font-medium">{tenureMonths}</span>
                  </div>
                  <Slider
                    id="tenure-months"
                    min={0}
                    max={11}
                    step={1}
                    value={[tenureMonths]}
                    onValueChange={(value) => handleSliderChange("tenure-months", value)}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Compounding Frequency</Label>
                <RadioGroup 
                  value={compoundingFrequency} 
                  onValueChange={setCompoundingFrequency}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simple" id="simple" />
                    <Label htmlFor="simple">Simple Interest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Yearly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half-yearly" id="half-yearly" />
                    <Label htmlFor="half-yearly">Half-Yearly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly">Quarterly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex flex-col">
                  <Label htmlFor="senior-citizen" className="mb-1">Senior Citizen</Label>
                  <span className="text-xs text-muted-foreground">+0.5% additional interest</span>
                </div>
                <Switch
                  id="senior-citizen"
                  checked={isSeniorCitizen}
                  onCheckedChange={setIsSeniorCitizen}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="tax-deducted" className="mb-1">Apply TDS</Label>
                  <span className="text-xs text-muted-foreground">10% on interest exceeding ₹40,000</span>
                </div>
                <Switch
                  id="tax-deducted"
                  checked={isTaxDeducted}
                  onCheckedChange={setIsTaxDeducted}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">About Fixed Deposits</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fixed Deposits (FDs) are investment instruments offered by banks where you deposit a lump sum for a fixed 
                tenure at a predetermined interest rate. FDs are considered safe investments with guaranteed returns.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Percent className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Higher rates for longer tenures:</span> Banks typically offer higher interest rates for longer deposit periods.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <BadgeIndianRupee className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">TDS applicability:</span> 10% TDS is deducted if interest earned exceeds ₹40,000 in a financial year (₹50,000 for senior citizens).
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Premature withdrawal:</span> Early withdrawal may result in a lower interest rate and penalties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-muted/50 border-primary border shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm">Invested Amount</p>
                  <p className="text-2xl font-semibold">{formatCurrency(principal)}</p>
                  <p className="text-xs text-muted-foreground">
                    Initial deposit
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Total Interest</p>
                  <p className="text-2xl font-semibold text-primary">{formatCurrency(totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">
                    {isTaxDeducted && taxDeducted > 0 ? "(Before TDS)" : ""}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Maturity Amount</p>
                  <p className="text-2xl font-semibold">{formatCurrency(maturityAmount)}</p>
                  <p className="text-xs text-muted-foreground">
                    After {tenureYears} years, {tenureMonths} months
                  </p>
                </div>
              </div>
              
              {isTaxDeducted && taxDeducted > 0 && (
                <div className="mt-4 p-3 bg-background/90 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TDS deducted (10%)</span>
                    <span className="font-medium">{formatCurrency(taxDeducted)}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Principal ({Math.round((principal / maturityAmount) * 100)}%)</span>
                  <span>
                    Interest ({Math.round(((totalInterest - taxDeducted) / maturityAmount) * 100)}%)
                  </span>
                </div>
                <div className="relative h-4 bg-muted overflow-hidden rounded-full">
                  <div
                    className="absolute h-full bg-primary left-0 top-0 rounded-l-full"
                    style={{ width: `${(principal / maturityAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Effective Annual Yield</p>
                  <p className="text-xl font-bold text-secondary">{effectiveYield.toFixed(2)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Interest Rate</p>
                  <p className="text-xl">
                    {isSeniorCitizen ? `${interestRate}% + ${seniorCitizenBonus}%` : `${interestRate}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calculator className="mr-2 h-5 w-5" />
                Year-wise Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Year</TableCell>
                      <TableCell className="font-medium">Principal</TableCell>
                      <TableCell className="font-medium">Interest Earned</TableCell>
                      <TableCell className="font-medium">Year-End Amount</TableCell>
                    </TableRow>
                    
                    {yearlyBreakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.year} {item.months && item.months < 12 ? `(${item.months} months)` : ''}
                        </TableCell>
                        <TableCell>{formatCurrency(item.startAmount)}</TableCell>
                        <TableCell className="text-primary">{formatCurrency(item.interest)}</TableCell>
                        <TableCell>{formatCurrency(item.endAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">FD Investment Tips</h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                <li>Ladder your FDs (invest in different FDs with different maturity periods) to benefit from interest rate changes and maintain liquidity.</li>
                <li>For senior citizens, look for special FD schemes offered by banks with higher interest rates.</li>
                <li>Submit Form 15G/15H to avoid TDS if your income is below the taxable limit.</li>
                <li>Quarterly compounding generally offers better returns than yearly compounding.</li>
                <li>Consider tax-saving Fixed Deposits under Section 80C with a 5-year lock-in period for tax benefits.</li>
                <li>Compare FD rates across different banks before investing - small finance banks often offer higher rates than larger banks.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FdCalculator;