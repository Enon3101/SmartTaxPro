import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TrendingUp, Calculator, IndianRupee, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

// Component to show tooltip on hover
const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative cursor-help">
    <div className="flex items-center text-sm text-muted-foreground underline decoration-dotted underline-offset-2">
      {children}
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 rounded bg-popover px-3 py-2 text-xs opacity-0 shadow transition-opacity group-hover:opacity-100 z-50">
      The future value of your investment will depend on the expected rate of return. Higher returns come with higher risks.
    </div>
  </div>
);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Results
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Debounce calculation to improve performance
  useEffect(() => {
    // Use a debounce timer to avoid excessive calculations on rapid changes
    const debounceTimer = setTimeout(() => {
      calculateSipReturns();
    }, 300); // 300ms debounce delay
    
    // Cleanup timer on every change
    return () => clearTimeout(debounceTimer);
  }, [monthlyInvestment, years, expectedReturn]);
  
  // Calculate SIP returns with optimizations
  const calculateSipReturns = () => {
    // Performance optimization: Validate inputs first to prevent unnecessary calculations
    if (monthlyInvestment <= 0 || years <= 0 || expectedReturn <= 0) {
      return;
    }
    
    // Calculate total investment
    const totalMonths = years * 12;
    const totalInvested = monthlyInvestment * totalMonths;
    setTotalInvestment(totalInvested);
    
    // Calculate future value using SIP formula
    // M × {((1 + r)^n - 1) / r} × (1 + r)
    // Where:
    // M = Monthly investment
    // r = Rate of interest per month (annual rate / 12 / 100)
    // n = Total number of payments (years * 12)
    
    const monthlyRate = expectedReturn / 12 / 100;
    // Use a more efficient calculation method with fewer operations
    const power = Math.pow(1 + monthlyRate, totalMonths);
    const futureValueCalculated = monthlyInvestment * 
      (((power - 1) / monthlyRate) * (1 + monthlyRate));
    
    setFutureValue(futureValueCalculated);
    setEstimatedReturns(futureValueCalculated - totalInvested);
    
    // Optimization: Only generate yearly breakdown when needed (when calculation is complete)
    // and limit the size of the breakdown for very long time periods
    const breakdown = [];
    let runningInvestment = 0;
    let runningValue = 0;
    
    // If years is very large, calculate fewer data points to improve performance
    const yearStep = years > 20 ? 2 : 1; // Use 2-year intervals for long periods
    
    for (let year = yearStep; year <= years; year += yearStep) {
      const investmentThisYear = monthlyInvestment * 12 * (year === yearStep ? year : yearStep);
      runningInvestment += investmentThisYear;
      
      // Calculate future value at the end of this year
      const monthsCompleted = year * 12;
      // Reuse the same formula but with calculated year
      const yearPower = Math.pow(1 + monthlyRate, monthsCompleted);
      const futureValueAtYear = monthlyInvestment * 
        (((yearPower - 1) / monthlyRate) * (1 + monthlyRate));
      
      runningValue = futureValueAtYear;
      const returnsThisYear = runningValue - runningInvestment;
      
      breakdown.push({
        year,
        investedAmount: runningInvestment,
        estimatedValue: runningValue,
        returns: returnsThisYear
      });
    }
    
    setYearlyBreakdown(breakdown);
    setIsCalculated(true);
  };
  
  // Optimized slider change handler with type safety
  const handleSliderChange = (field: "investment" | "years" | "return", value: number[]) => {
    // Only update if the value has actually changed
    const newValue = value[0];
    
    switch (field) {
      case "investment":
        if (newValue !== monthlyInvestment) {
          setMonthlyInvestment(newValue);
        }
        break;
      case "years":
        if (newValue !== years) {
          setYears(newValue);
        }
        break;
      case "return":
        if (newValue !== expectedReturn) {
          setExpectedReturn(newValue);
        }
        break;
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">SIP Calculator</h1>
        <p className="text-muted-foreground">
          Calculate potential returns on your Systematic Investment Plan (SIP) investments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-2 h-5 w-5" />
                SIP Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(monthlyInvestment)}</span>
                </div>
                <Slider
                  id="monthly-investment"
                  min={500}
                  max={100000}
                  step={500}
                  value={[monthlyInvestment]}
                  onValueChange={(value) => handleSliderChange("investment", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="investment-period">Investment Period (Years)</Label>
                  <span className="text-sm font-medium">{years} years</span>
                </div>
                <Slider
                  id="investment-period"
                  min={1}
                  max={30}
                  step={1}
                  value={[years]}
                  onValueChange={(value) => handleSliderChange("years", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="expected-return" className="flex items-center">
                    <span className="mr-1">Expected Annual Return (%)</span>
                    <InfoTooltip>ⓘ</InfoTooltip>
                  </Label>
                  <span className="text-sm font-medium">{expectedReturn}%</span>
                </div>
                <Slider
                  id="expected-return"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[expectedReturn]}
                  onValueChange={(value) => handleSliderChange("return", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">About SIP</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. 
                It helps in wealth creation through the power of compounding and rupee cost averaging.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <IndianRupee className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Rupee Cost Averaging:</span> Helps you buy more units when prices are low and fewer when prices are high.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Power of Compounding:</span> Your returns generate additional returns over time.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Disciplined Approach:</span> Regular investments build a habit of saving and investing.
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
                  <p className="text-sm">Total Investment</p>
                  <p className="text-2xl font-semibold">{formatCurrency(totalInvestment)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(monthlyInvestment)} per month for {years} years
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Estimated Returns</p>
                  <p className="text-2xl font-semibold text-primary">{formatCurrency(estimatedReturns)}</p>
                  <p className="text-xs text-muted-foreground">
                    At {expectedReturn}% annual returns
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Future Value</p>
                  <p className="text-2xl font-semibold">{formatCurrency(futureValue)}</p>
                  <p className="text-xs text-muted-foreground">
                    Total corpus after {years} years
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Total Investment</span>
                  <span>Estimated Returns</span>
                </div>
                <div className="relative h-4 bg-muted overflow-hidden rounded-full">
                  <div
                    className="absolute h-full bg-primary left-0 top-0 rounded-l-full"
                    style={{
                      width: `${(totalInvestment / futureValue) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span>{Math.round((totalInvestment / futureValue) * 100)}%</span>
                  <span>{Math.round((estimatedReturns / futureValue) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SIP Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Year</TableCell>
                      <TableCell className="font-medium">Invested Amount</TableCell>
                      <TableCell className="font-medium">Estimated Returns</TableCell>
                      <TableCell className="font-medium">Expected Corpus</TableCell>
                    </TableRow>
                    
                    {yearlyBreakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>{formatCurrency(item.investedAmount)}</TableCell>
                        <TableCell className="text-primary">{formatCurrency(item.returns)}</TableCell>
                        <TableCell>{formatCurrency(item.estimatedValue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Things to Note</h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                <li>The calculated results are for illustrative purposes only.</li>
                <li>The actual returns will depend on the performance of the chosen fund.</li>
                <li>Past performance is not a guarantee of future returns.</li>
                <li>The power of compounding works better over longer investment periods.</li>
                <li>Increasing your SIP amount periodically can significantly boost your wealth creation.</li>
                <li>SIP investments in equity mutual funds are subject to market risks.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;