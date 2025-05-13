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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  LineChart,
  TrendingUp
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Calculate compound interest
const calculateCompoundInterest = (
  principal: number, 
  rateOfInterest: number, 
  timeInYears: number,
  compoundingFrequency: number = 1 // Annual by default
) => {
  const r = rateOfInterest / 100;
  const n = compoundingFrequency;
  const t = timeInYears;
  
  // Compound interest formula: P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + (r / n), n * t);
  return amount;
};

// Main Calculator Component
const PFCalculator = () => {
  // State for form inputs
  const [basicSalary, setBasicSalary] = useState<number | "">("");
  const [employeeContribution, setEmployeeContribution] = useState<number>(12);
  const [employerContribution, setEmployerContribution] = useState<number>(12);
  const [epsContribution, setEpsContribution] = useState<boolean>(true);
  const [yearsOfService, setYearsOfService] = useState<number | "">(1);
  const [interestRate, setInterestRate] = useState<number>(8.15); // Current EPF interest rate for 2023-24
  const [currentPFBalance, setCurrentPFBalance] = useState<number | "">("");
  const [retirementAge, setRetirementAge] = useState<number | "">(60);
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [annualSalaryIncrement, setAnnualSalaryIncrement] = useState<number>(5);
  
  // State for results
  const [monthlyContribution, setMonthlyContribution] = useState({
    employee: 0,
    employer: 0,
    eps: 0,
    total: 0
  });
  const [annualContribution, setAnnualContribution] = useState({
    employee: 0,
    employer: 0,
    eps: 0,
    total: 0
  });
  const [maturityDetails, setMaturityDetails] = useState({
    totalContribution: 0,
    totalInterest: 0,
    totalAmount: 0,
    employeeAmount: 0,
    employerAmount: 0
  });
  
  // State for year-wise breakdown
  const [yearlyBreakdown, setYearlyBreakdown] = useState<Array<{
    year: number,
    openingBalance: number,
    employeeContribution: number,
    employerContribution: number,
    epsContribution: number,
    interestEarned: number,
    closingBalance: number
  }>>([]);
  
  // Handlers for number inputs
  const handleNumberInput = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setter(parsedValue);
    }
  };
  
  // Calculate PF on input change
  useEffect(() => {
    // Skip calculation if required fields are empty
    if (
      basicSalary === "" || 
      employeeContribution === 0 || 
      employerContribution === 0
    ) {
      // Reset results
      setMonthlyContribution({
        employee: 0,
        employer: 0,
        eps: 0,
        total: 0
      });
      setAnnualContribution({
        employee: 0,
        employer: 0,
        eps: 0,
        total: 0
      });
      setMaturityDetails({
        totalContribution: 0,
        totalInterest: 0,
        totalAmount: 0,
        employeeAmount: 0,
        employerAmount: 0
      });
      setYearlyBreakdown([]);
      return;
    }
    
    const salary = typeof basicSalary === "number" ? basicSalary : 0;
    
    // Calculate monthly employee contribution
    const employeeMonthly = (salary * employeeContribution) / 100;
    
    // Calculate monthly employer contribution
    const employerMonthly = (salary * employerContribution) / 100;
    
    // Calculate EPS contribution (max 8.33% of Rs. 15,000 = Rs. 1,250)
    let epsMonthly = 0;
    if (epsContribution) {
      const epsCap = 15000; // EPS salary cap
      const epsPercentage = 8.33; // EPS contribution percentage
      epsMonthly = Math.min(salary, epsCap) * (epsPercentage / 100);
    }
    
    // Employer contribution to EPF = Total employer contribution - EPS contribution
    const employerEpfMonthly = employerMonthly - epsMonthly;
    
    // Total monthly contribution
    const totalMonthly = employeeMonthly + employerEpfMonthly;
    
    // Set monthly contribution
    setMonthlyContribution({
      employee: employeeMonthly,
      employer: employerEpfMonthly,
      eps: epsMonthly,
      total: totalMonthly
    });
    
    // Set annual contribution
    setAnnualContribution({
      employee: employeeMonthly * 12,
      employer: employerEpfMonthly * 12,
      eps: epsMonthly * 12,
      total: totalMonthly * 12
    });
    
    // Calculate maturity amount
    if (yearsOfService !== "") {
      calculateMaturityAmount();
    }
    
  }, [
    basicSalary, 
    employeeContribution, 
    employerContribution, 
    epsContribution, 
    yearsOfService,
    interestRate,
    currentPFBalance,
    currentAge,
    retirementAge,
    annualSalaryIncrement
  ]);
  
  // Calculate maturity amount with year-wise breakdown
  const calculateMaturityAmount = () => {
    const salary = typeof basicSalary === "number" ? basicSalary : 0;
    const years = typeof yearsOfService === "number" ? yearsOfService : 1;
    const initialPfBalance = typeof currentPFBalance === "number" ? currentPFBalance : 0;
    const currentAgeValue = typeof currentAge === "number" ? currentAge : 30;
    const retirementAgeValue = typeof retirementAge === "number" ? retirementAge : 60;
    
    // Calculate years to retirement
    const actualYears = retirementAgeValue !== "" && currentAgeValue !== "" 
      ? Math.min(years, retirementAgeValue - currentAgeValue)
      : years;
    
    // Initialize variables for calculation
    let totalEmployeeContribution = 0;
    let totalEmployerContribution = 0;
    let totalEpsContribution = 0;
    let totalInterestEarned = 0;
    let runningBalance = initialPfBalance;
    let currentBasicSalary = salary;
    
    // Initialize yearly breakdown
    const breakdown: Array<{
      year: number,
      openingBalance: number,
      employeeContribution: number,
      employerContribution: number,
      epsContribution: number,
      interestEarned: number,
      closingBalance: number
    }> = [];
    
    // Calculate for each year
    for (let year = 1; year <= actualYears; year++) {
      // Calculate current year's contributions
      const employeeYearlyContribution = (currentBasicSalary * employeeContribution / 100) * 12;
      
      // Calculate EPS contribution
      const epsCap = 15000; // EPS salary cap
      const epsPercentage = 8.33; // EPS contribution percentage
      const monthlyEpsContribution = epsContribution 
        ? Math.min(currentBasicSalary, epsCap) * (epsPercentage / 100)
        : 0;
      const epsYearlyContribution = monthlyEpsContribution * 12;
      
      // Employer contribution to EPF
      const employerYearlyContribution = (currentBasicSalary * employerContribution / 100) * 12 - epsYearlyContribution;
      
      // Total yearly contribution
      const yearlyContribution = employeeYearlyContribution + employerYearlyContribution;
      
      // Opening balance for the year
      const openingBalance = runningBalance;
      
      // Calculate interest for the year
      // Simplified calculation: interest on opening balance + interest on contributions for half a year
      const interestOnOpeningBalance = openingBalance * (interestRate / 100);
      const interestOnContributions = yearlyContribution * (interestRate / 200); // Half year interest
      const yearlyInterest = interestOnOpeningBalance + interestOnContributions;
      
      // Closing balance for the year
      const closingBalance = openingBalance + yearlyContribution + yearlyInterest;
      
      // Update running balance
      runningBalance = closingBalance;
      
      // Add to yearly breakdown
      breakdown.push({
        year,
        openingBalance,
        employeeContribution: employeeYearlyContribution,
        employerContribution: employerYearlyContribution,
        epsContribution: epsYearlyContribution,
        interestEarned: yearlyInterest,
        closingBalance
      });
      
      // Update totals
      totalEmployeeContribution += employeeYearlyContribution;
      totalEmployerContribution += employerYearlyContribution;
      totalEpsContribution += epsYearlyContribution;
      totalInterestEarned += yearlyInterest;
      
      // Increase salary for next year based on annual increment
      currentBasicSalary *= (1 + annualSalaryIncrement / 100);
    }
    
    // Set maturity details
    setMaturityDetails({
      totalContribution: totalEmployeeContribution + totalEmployerContribution,
      totalInterest: totalInterestEarned,
      totalAmount: runningBalance,
      employeeAmount: totalEmployeeContribution + (totalInterestEarned / 2), // Approximation
      employerAmount: totalEmployerContribution + (totalInterestEarned / 2)  // Approximation
    });
    
    // Set yearly breakdown
    setYearlyBreakdown(breakdown);
  };
  
  // Format currency values
  const formatCurrency = (value: number) => formatIndianCurrency(value);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <PiggyBank className="mr-2 h-8 w-8" /> 
        EPF/PF Calculator
      </h1>
      <p className="text-muted-foreground mb-8">
        Calculate your Employee Provident Fund (EPF) contributions and maturity amount
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Projection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>PF Contribution Calculator</CardTitle>
                  <CardDescription>
                    Calculate your monthly and annual PF contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="basicSalary">Monthly Basic Salary + DA</Label>
                    <div className="flex items-center">
                      <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="basicSalary"
                        type="number"
                        value={basicSalary}
                        onChange={(e) => handleNumberInput(e.target.value, setBasicSalary)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PF is calculated on Basic Salary plus Dearness Allowance (DA)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employeeContribution">Employee Contribution (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="employeeContribution"
                          value={[employeeContribution]}
                          onValueChange={(value) => setEmployeeContribution(value[0])}
                          min={0}
                          max={100}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {employeeContribution.toFixed(2)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Statutory rate is 12%. You can contribute more voluntarily.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="employerContribution">Employer Contribution (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="employerContribution"
                          value={[employerContribution]}
                          onValueChange={(value) => setEmployerContribution(value[0])}
                          min={0}
                          max={100}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {employerContribution.toFixed(2)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Statutory rate is 12%. (3.67% to EPF + 8.33% to EPS)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="epsContribution"
                      checked={epsContribution}
                      onCheckedChange={setEpsContribution}
                    />
                    <Label htmlFor="epsContribution">
                      Include Employee Pension Scheme (EPS) contribution
                    </Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="currentPFBalance">Current PF Balance (if any)</Label>
                    <div className="flex items-center">
                      <PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPFBalance"
                        type="number"
                        value={currentPFBalance}
                        onChange={(e) => handleNumberInput(e.target.value, setCurrentPFBalance)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="yearsOfService">Years of Service</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="yearsOfService"
                          type="number"
                          value={yearsOfService}
                          onChange={(e) => handleNumberInput(e.target.value, setYearsOfService)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate">PF Interest Rate (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="interestRate"
                          value={[interestRate]}
                          onValueChange={(value) => setInterestRate(value[0])}
                          min={0}
                          max={12}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {interestRate.toFixed(2)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Current PF interest rate for FY 2023-24 is 8.15%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Projection</CardTitle>
                  <CardDescription>
                    Project your PF corpus at retirement with salary increments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="basicSalary">Current Monthly Basic Salary + DA</Label>
                    <div className="flex items-center">
                      <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="basicSalary"
                        type="number"
                        value={basicSalary}
                        onChange={(e) => handleNumberInput(e.target.value, setBasicSalary)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentAge">Current Age</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentAge"
                          type="number"
                          value={currentAge}
                          onChange={(e) => handleNumberInput(e.target.value, setCurrentAge)}
                          placeholder="30"
                          min="18"
                          max="59"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="retirementAge">Retirement Age</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="retirementAge"
                          type="number"
                          value={retirementAge}
                          onChange={(e) => handleNumberInput(e.target.value, setRetirementAge)}
                          placeholder="60"
                          min="45"
                          max="70"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="annualSalaryIncrement">Annual Salary Increment (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="annualSalaryIncrement"
                          value={[annualSalaryIncrement]}
                          onValueChange={(value) => setAnnualSalaryIncrement(value[0])}
                          min={0}
                          max={15}
                          step={0.1}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {annualSalaryIncrement.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="interestRate">PF Interest Rate (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="interestRate"
                          value={[interestRate]}
                          onValueChange={(value) => setInterestRate(value[0])}
                          min={0}
                          max={12}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {interestRate.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employeeContribution">Employee Contribution (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="employeeContribution"
                          value={[employeeContribution]}
                          onValueChange={(value) => setEmployeeContribution(value[0])}
                          min={0}
                          max={100}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {employeeContribution.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="employerContribution">Employer Contribution (%)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          id="employerContribution"
                          value={[employerContribution]}
                          onValueChange={(value) => setEmployerContribution(value[0])}
                          min={0}
                          max={100}
                          step={0.01}
                          className="flex-1"
                        />
                        <div className="w-16 text-center font-medium">
                          {employerContribution.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="currentPFBalance">Current PF Balance (if any)</Label>
                    <div className="flex items-center">
                      <PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPFBalance"
                        type="number"
                        value={currentPFBalance}
                        onChange={(e) => handleNumberInput(e.target.value, setCurrentPFBalance)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="epsContribution"
                      checked={epsContribution}
                      onCheckedChange={setEpsContribution}
                    />
                    <Label htmlFor="epsContribution">
                      Include Employee Pension Scheme (EPS) contribution
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {yearlyBreakdown.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Year-wise Breakdown</CardTitle>
                <CardDescription>
                  Growth of your PF corpus over the years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Opening Balance</TableHead>
                        <TableHead>Employee Contribution</TableHead>
                        <TableHead>Employer EPF</TableHead>
                        <TableHead>Interest Earned</TableHead>
                        <TableHead>Closing Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyBreakdown.map((yearData, index) => (
                        <TableRow key={index}>
                          <TableCell>{yearData.year}</TableCell>
                          <TableCell>{formatCurrency(yearData.openingBalance)}</TableCell>
                          <TableCell>{formatCurrency(yearData.employeeContribution)}</TableCell>
                          <TableCell>{formatCurrency(yearData.employerContribution)}</TableCell>
                          <TableCell>{formatCurrency(yearData.interestEarned)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(yearData.closingBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-5">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  PF Calculation Results
                </div>
              </CardTitle>
              <CardDescription>
                Your PF contribution and projected maturity amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-primary/5 rounded-lg mb-6 text-center">
                <h3 className="text-lg font-medium mb-2">Projected PF Corpus</h3>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(maturityDetails.totalAmount)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  at {interestRate}% interest rate after {typeof yearsOfService === "number" ? yearsOfService : 0} years
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Monthly Contributions</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Employee Contribution</TableCell>
                        <TableCell className="text-right">{formatCurrency(monthlyContribution.employee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Employer EPF Contribution</TableCell>
                        <TableCell className="text-right">{formatCurrency(monthlyContribution.employer)}</TableCell>
                      </TableRow>
                      {epsContribution && (
                        <TableRow>
                          <TableCell className="font-medium">Employer EPS Contribution</TableCell>
                          <TableCell className="text-right">{formatCurrency(monthlyContribution.eps)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow className="font-semibold">
                        <TableCell>Total Monthly PF Deposit</TableCell>
                        <TableCell className="text-right">{formatCurrency(monthlyContribution.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Annual Contributions</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Employee Contribution</TableCell>
                        <TableCell className="text-right">{formatCurrency(annualContribution.employee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Employer EPF Contribution</TableCell>
                        <TableCell className="text-right">{formatCurrency(annualContribution.employer)}</TableCell>
                      </TableRow>
                      {epsContribution && (
                        <TableRow>
                          <TableCell className="font-medium">Employer EPS Contribution</TableCell>
                          <TableCell className="text-right">{formatCurrency(annualContribution.eps)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow className="font-semibold">
                        <TableCell>Total Annual PF Deposit</TableCell>
                        <TableCell className="text-right">{formatCurrency(annualContribution.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                {maturityDetails.totalAmount > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Maturity Breakdown</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total Contributions</TableCell>
                          <TableCell className="text-right">{formatCurrency(maturityDetails.totalContribution)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Interest Earned</TableCell>
                          <TableCell className="text-right">{formatCurrency(maturityDetails.totalInterest)}</TableCell>
                        </TableRow>
                        <TableRow className="font-semibold">
                          <TableCell>Total Maturity Amount</TableCell>
                          <TableCell className="text-right">{formatCurrency(maturityDetails.totalAmount)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="help">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      About EPF and EPS
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Employees' Provident Fund (EPF):</strong> A retirement savings scheme where both you and your employer contribute to your PF account.
                      </p>
                      <p>
                        <strong>Employees' Pension Scheme (EPS):</strong> A portion of the employer's contribution (8.33% of wages, capped at ₹15,000) goes to the EPS, which provides pension benefits after retirement.
                      </p>
                      <p>
                        <strong>Tax Benefits:</strong> EPF contributions are eligible for tax deductions under Section 80C of the Income Tax Act. Interest earned is tax-free if you continue the service for 5 years or more.
                      </p>
                      <p>
                        <strong>Withdrawal:</strong> EPF can be withdrawn on retirement, resignation, or for specific needs like housing, education, or medical emergencies.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="calculation">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      How is PF calculated?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Employee Contribution:</strong> 12% of (Basic Salary + Dearness Allowance)
                      </p>
                      <p>
                        <strong>Employer Contribution:</strong> 12% of (Basic Salary + DA), divided as:
                      </p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>3.67% to Employee Provident Fund (EPF)</li>
                        <li>8.33% to Employee Pension Scheme (EPS), subject to a maximum of ₹1,250 per month</li>
                      </ul>
                      <p>
                        <strong>Interest Calculation:</strong> Interest is calculated monthly but credited annually.
                      </p>
                      <p>
                        <strong>Note:</strong> The current interest rate for EPF is 8.15% for the financial year 2023-24.
                      </p>
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

export default PFCalculator;