import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  Landmark, Calculator, Clock, Wallet, 
  Home, Car, CreditCard, Briefcase 
} from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoanType {
  id: string;
  name: string;
  icon: JSX.Element;
  maxAmount: number;
  maxTenure: number;
  defaultRate: number;
  rateRange: [number, number];
}

const loanTypes: Record<string, LoanType> = {
  "home": {
    id: "home",
    name: "Home Loan",
    icon: <Home className="h-4 w-4" />,
    maxAmount: 10000000,
    maxTenure: 30,
    defaultRate: 8.5,
    rateRange: [6.5, 12]
  },
  "car": {
    id: "car",
    name: "Car Loan",
    icon: <Car className="h-4 w-4" />,
    maxAmount: 2000000,
    maxTenure: 7,
    defaultRate: 10,
    rateRange: [7.5, 15]
  },
  "personal": {
    id: "personal",
    name: "Personal Loan",
    icon: <CreditCard className="h-4 w-4" />,
    maxAmount: 1000000,
    maxTenure: 5,
    defaultRate: 12,
    rateRange: [10, 18]
  },
  "education": {
    id: "education",
    name: "Education Loan",
    icon: <Briefcase className="h-4 w-4" />,
    maxAmount: 5000000,
    maxTenure: 15,
    defaultRate: 9,
    rateRange: [7, 13]
  }
};

const LoanEmiCalculator = () => {
  const [loanType, setLoanType] = useState<string>("home");
  const [loanAmount, setLoanAmount] = useState<number>(2000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [tenureType, setTenureType] = useState<string>("years");
  
  // Results
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Update interest rate when loan type changes
  useEffect(() => {
    const selectedLoan = loanTypes[loanType];
    setInterestRate(selectedLoan.defaultRate);
    // Adjust loan amount and tenure based on loan type
    setLoanAmount((prev) => Math.min(prev, selectedLoan.maxAmount));
    if (tenureType === "years") {
      setLoanTenure((prev) => Math.min(prev, selectedLoan.maxTenure));
    }
  }, [loanType]);
  
  // Recalculate EMI when inputs change
  useEffect(() => {
    calculateEmi();
  }, [loanAmount, interestRate, loanTenure, tenureType]);
  
  // Calculate EMI
  const calculateEmi = () => {
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // Where:
    // P = Principal (loan amount)
    // r = Monthly interest rate (annual rate / 12 / 100)
    // n = Total number of payments (tenure in months)
    
    const monthlyInterestRate = interestRate / 12 / 100;
    const totalMonths = tenureType === "years" ? loanTenure * 12 : loanTenure;
    
    if (loanAmount <= 0 || interestRate <= 0 || totalMonths <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setYearlyBreakdown([]);
      return;
    }
    
    const emiValue = loanAmount * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, totalMonths) / 
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    
    setEmi(emiValue);
    
    const totalPaymentValue = emiValue * totalMonths;
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalPaymentValue - loanAmount);
    
    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyInterestRate, totalMonths, emiValue);
  };
  
  // Generate yearly amortization schedule
  const generateAmortizationSchedule = (
    principal: number, 
    monthlyRate: number, 
    totalMonths: number, 
    monthlyPayment: number
  ) => {
    // Initialize variables
    let remainingPrincipal = principal;
    let yearlyData: any[] = [];
    let principalPaidYearly = 0;
    let interestPaidYearly = 0;
    let currentYear = 1;
    let monthsInYear = 12;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Calculate interest for this month
      const interestForMonth = remainingPrincipal * monthlyRate;
      
      // Calculate principal payment for this month
      const principalForMonth = monthlyPayment - interestForMonth;
      
      // Update remaining principal
      remainingPrincipal = Math.max(0, remainingPrincipal - principalForMonth);
      
      // Update yearly totals
      principalPaidYearly += principalForMonth;
      interestPaidYearly += interestForMonth;
      
      // If end of year or loan term, add to yearlyData
      if (month % 12 === 0 || month === totalMonths) {
        // For the last period (which might not be a full year)
        const actualMonthsInPeriod = month % 12 === 0 ? 12 : month % 12;
        
        yearlyData.push({
          year: currentYear,
          principalPaid: principalPaidYearly,
          interestPaid: interestPaidYearly,
          totalPayment: principalPaidYearly + interestPaidYearly,
          remainingPrincipal,
          months: actualMonthsInPeriod
        });
        
        // Reset for next year
        principalPaidYearly = 0;
        interestPaidYearly = 0;
        currentYear++;
      }
    }
    
    setYearlyBreakdown(yearlyData);
  };
  
  const handleSliderChange = (field: string, value: number[]) => {
    switch (field) {
      case "amount":
        setLoanAmount(value[0]);
        break;
      case "interest":
        setInterestRate(value[0]);
        break;
      case "tenure":
        setLoanTenure(value[0]);
        break;
    }
  };
  
  const handleTenureTypeChange = (value: string) => {
    // Convert current tenure to the new type
    if (value === "years" && tenureType === "months") {
      // Convert months to years (rounded)
      setLoanTenure(Math.max(1, Math.min(Math.round(loanTenure / 12), loanTypes[loanType].maxTenure)));
    } else if (value === "months" && tenureType === "years") {
      // Convert years to months
      setLoanTenure(loanTenure * 12);
    }
    
    setTenureType(value);
  };
  
  const selectedLoan = loanTypes[loanType];
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Loan EMI Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your Equated Monthly Installment (EMI) for different loan types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Landmark className="mr-2 h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Loan Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(loanTypes).map((type) => (
                    <Button
                      key={type.id}
                      variant={loanType === type.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setLoanType(type.id)}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <Slider
                  id="loan-amount"
                  min={10000}
                  max={selectedLoan.maxAmount}
                  step={10000}
                  value={[loanAmount]}
                  onValueChange={(value) => handleSliderChange("amount", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
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
                  min={selectedLoan.rateRange[0]}
                  max={selectedLoan.rateRange[1]}
                  step={0.05}
                  value={[interestRate]}
                  onValueChange={(value) => handleSliderChange("interest", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="mt-2"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loan-tenure">Loan Tenure</Label>
                  <RadioGroup 
                    value={tenureType} 
                    onValueChange={handleTenureTypeChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="years" id="years" />
                      <Label htmlFor="years" className="text-sm">Years</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="months" id="months" />
                      <Label htmlFor="months" className="text-sm">Months</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Slider
                  id="loan-tenure"
                  min={1}
                  max={tenureType === "years" ? selectedLoan.maxTenure : selectedLoan.maxTenure * 12}
                  step={1}
                  value={[loanTenure]}
                  onValueChange={(value) => handleSliderChange("tenure", value)}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">About EMI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Equated Monthly Installment (EMI) is a fixed amount paid by a borrower to a lender at a specified date each month. 
                EMIs are used to pay off both interest and principal each month so that over a specified time period, the loan is paid off in full.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">EMI Formula:</span> EMI = P × r × (1+r)^n / ((1+r)^n - 1)
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Shorter Tenure:</span> Lower total interest cost but higher monthly EMI.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Prepayment Benefits:</span> Paying more than the EMI reduces your principal faster.
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
                  <p className="text-sm">Monthly EMI</p>
                  <p className="text-2xl font-semibold text-primary">{formatCurrency(emi)}</p>
                  <p className="text-xs text-muted-foreground">
                    Loan EMI per month
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Total Interest</p>
                  <p className="text-2xl font-semibold">{formatCurrency(totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">
                    Total interest over {tenureType === "years" ? `${loanTenure} years` : `${loanTenure} months`}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm">Total Payment</p>
                  <p className="text-2xl font-semibold">{formatCurrency(totalPayment)}</p>
                  <p className="text-xs text-muted-foreground">
                    Principal + Interest
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Principal ({Math.round((loanAmount / totalPayment) * 100)}%)</span>
                  <span>Interest ({Math.round((totalInterest / totalPayment) * 100)}%)</span>
                </div>
                <div className="relative h-4 bg-muted overflow-hidden rounded-full">
                  <div
                    className="absolute h-full bg-primary left-0 top-0 rounded-l-full"
                    style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="breakdown">Yearly Breakdown</TabsTrigger>
              <TabsTrigger value="chart">Repayment Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakdown">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Repayment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Year</TableCell>
                          <TableCell className="font-medium">Principal Paid</TableCell>
                          <TableCell className="font-medium">Interest Paid</TableCell>
                          <TableCell className="font-medium">Remaining Principal</TableCell>
                        </TableRow>
                        
                        {yearlyBreakdown.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{formatCurrency(item.principalPaid)}</TableCell>
                            <TableCell className="text-primary">{formatCurrency(item.interestPaid)}</TableCell>
                            <TableCell>{formatCurrency(item.remainingPrincipal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center space-x-6 justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 rounded-full border-8 border-primary mx-auto"></div>
                            <p className="mt-2 font-medium">Principal</p>
                            <p className="text-xl">{formatCurrency(loanAmount)}</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-24 h-24 rounded-full border-8 border-secondary mx-auto"></div>
                            <p className="mt-2 font-medium">Interest</p>
                            <p className="text-xl">{formatCurrency(totalInterest)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <p className="text-sm text-muted-foreground">
                            For every rupee in principal, you pay {(totalInterest / loanAmount).toFixed(2)} rupees in interest.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold">EMI Composition</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        In the initial years of your loan, a larger portion of your EMI goes toward interest. 
                        As the loan matures, more of your EMI goes toward reducing the principal.
                      </p>
                      
                      {yearlyBreakdown.slice(0, 5).map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Year {item.year}</span>
                            <span>{formatCurrency(item.totalPayment)}</span>
                          </div>
                          <div className="relative h-2 bg-muted overflow-hidden rounded-full">
                            <div
                              className="absolute h-full bg-primary left-0 top-0 rounded-l-full"
                              style={{ width: `${(item.principalPaid / item.totalPayment) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Principal: {Math.round((item.principalPaid / item.totalPayment) * 100)}%</span>
                            <span>Interest: {Math.round((item.interestPaid / item.totalPayment) * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Tips for Loan Management</h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                <li>Consider making prepayments to reduce total interest cost.</li>
                <li>For home loans, check if you're eligible for tax benefits under Section 24 and Section 80C.</li>
                <li>Compare different lenders to get the best interest rate for your profile.</li>
                <li>Your EMI should ideally not exceed 40-50% of your monthly income.</li>
                <li>A longer tenure means lower EMIs but higher total interest cost.</li>
                <li>Maintain a good credit score to negotiate better loan terms.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanEmiCalculator;