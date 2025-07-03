import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { 
  HelpCircle, 
  Home, 
  IndianRupee, 
  Info, 
  Calendar, 
  Percent, 
  ArrowRight,
  FileText,
  PieChart
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculatorClient, HomeLoanResponse } from '@/lib/calculatorClient';


// Schema for form validation
const formSchema = z.object({
  principal: z.number().min(100000, { message: "Loan amount must be at least ₹1,00,000" })
    .max(100000000, { message: "Loan amount must be less than ₹10 crore" }),
  interestRate: z.number().min(4, { message: "Interest rate must be at least 4%" })
    .max(20, { message: "Interest rate must be less than 20%" }),
  tenureYears: z.number().min(1, { message: "Tenure must be at least 1 year" })
    .max(30, { message: "Tenure must be at most 30 years" })
});

type FormValues = z.infer<typeof formSchema>;

// Using the interface from calculatorClient.ts
// No need to redefine LoanCalculationResult

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const HomeLoanCalculator = () => {
  const [calculationResult, setCalculationResult] = useState<HomeLoanResponse | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Format amounts as Indian Rupees
  const formatAmount = (amount: number) => {
    return currencyFormatter.format(amount);
  };
  
  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 3000000,  // 30 lakhs default loan amount
      interestRate: 8.5,   // 8.5% default interest rate
      tenureYears: 20      // 20 years default tenure
    }
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return calculatorClient.calculateHomeLoan(data);
    },
    onSuccess: (data: HomeLoanResponse) => {
      setCalculationResult(data);
    },
    onError: (error) => {
      console.error('Error calculating home loan details:', error);
      // Show error toast or message here
    }
  });
  
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  
  // Helper to generate amortization schedule
  const generateAmortizationSchedule = () => {
    if (!calculationResult) return [];
    
    const { principal, interestRate, tenureYears, monthlyEmi } = calculationResult;
    const monthlyRate = interestRate / (12 * 100);
    const numberOfPayments = tenureYears * 12;
    
    let remainingPrincipal = principal;
    const schedule = [];
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = monthlyEmi - interestPayment;
      remainingPrincipal -= principalPayment;
      
      if (i % 12 === 0 || i === 1 || i === numberOfPayments) { // Show yearly and first/last entries
        schedule.push({
          paymentNumber: i,
          emi: monthlyEmi,
          principalPayment,
          interestPayment,
          remainingPrincipal: Math.max(0, remainingPrincipal),
          year: Math.ceil(i / 12)
        });
      }
    }
    
    return schedule;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/2">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Home Loan EMI Calculator</CardTitle>
                </div>
                <CardDescription>
                  Calculate your monthly EMI, total interest and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="principal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            Loan Amount
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <div className="pt-2 mb-4">
                            <Slider
                              min={100000}
                              max={10000000}
                              step={100000}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>₹1L</span>
                              <span>₹50L</span>
                              <span>₹1Cr</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Enter your home loan amount (₹1 lakh to ₹10 crore)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Percent className="h-4 w-4" />
                            Interest Rate (% p.a.)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                              <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <div className="pt-2 mb-4">
                            <Slider
                              min={4}
                              max={20}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>4%</span>
                              <span>12%</span>
                              <span>20%</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Current home loan interest rates range from 6.5% to 11%
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tenureYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Loan Tenure (Years)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">Years</span>
                            </div>
                          </FormControl>
                          <div className="pt-2 mb-4">
                            <Slider
                              min={1}
                              max={30}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>1 yr</span>
                              <span>15 yrs</span>
                              <span>30 yrs</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Maximum home loan tenure is typically 30 years
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? 'Calculating...' : 'Calculate Home Loan EMI'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {calculationResult && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Home Loan Details</CardTitle>
                  <CardDescription>
                    Your monthly EMI and other loan details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="basic">
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          <span className="hidden sm:inline">Basic Details</span>
                          <span className="sm:hidden">Basic</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="breakdown">
                        <span className="flex items-center gap-1">
                          <PieChart className="h-4 w-4" />
                          <span className="hidden sm:inline">Breakdown</span>
                          <span className="sm:hidden">Details</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="schedule">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="hidden sm:inline">Repayment Schedule</span>
                          <span className="sm:hidden">Schedule</span>
                        </span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div className="bg-primary/5 p-6 rounded-lg border border-border">
                        <h3 className="text-sm text-muted-foreground mb-1">Monthly EMI</h3>
                        <p className="text-3xl font-bold text-primary">
                          {formatAmount(calculationResult.monthlyEmi)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm text-muted-foreground mb-1">Principal</h3>
                          <p className="text-lg font-semibold">
                            {formatAmount(calculationResult.principal)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm text-muted-foreground mb-1">Total Interest</h3>
                          <p className="text-lg font-semibold">
                            {formatAmount(calculationResult.totalInterest)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm text-muted-foreground mb-1">Total Amount</h3>
                          <p className="text-lg font-semibold">
                            {formatAmount(calculationResult.totalAmount)}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-sm text-muted-foreground mb-1">Tenure</h3>
                          <p className="text-lg font-semibold">
                            {calculationResult.tenureYears} years
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="breakdown" className="space-y-4">
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Additional Costs</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Processing Fee</span>
                              <span>{formatAmount(calculationResult.additionalInfo.processingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Stamp Duty</span>
                              <span>{formatAmount(calculationResult.additionalInfo.stampDuty)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Registration Fee</span>
                              <span>{formatAmount(calculationResult.additionalInfo.registrationFee)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold">
                              <span>Total Additional Costs</span>
                              <span>{formatAmount(
                                calculationResult.additionalInfo.processingFee + 
                                calculationResult.additionalInfo.stampDuty + 
                                calculationResult.additionalInfo.registrationFee
                              )}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Cost Breakdown</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Principal</span>
                              <span>{formatAmount(calculationResult.principal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Interest Amount</span>
                              <span>{formatAmount(calculationResult.totalInterest)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Additional Costs</span>
                              <span>{formatAmount(
                                calculationResult.additionalInfo.processingFee + 
                                calculationResult.additionalInfo.stampDuty + 
                                calculationResult.additionalInfo.registrationFee
                              )}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold">
                              <span>Total Cost of Home Purchase</span>
                              <span>{formatAmount(
                                calculationResult.totalAmount + 
                                calculationResult.additionalInfo.processingFee + 
                                calculationResult.additionalInfo.stampDuty + 
                                calculationResult.additionalInfo.registrationFee
                              )}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableCaption>Home Loan Repayment Schedule (Yearly)</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Year</TableHead>
                              <TableHead>Payment No.</TableHead>
                              <TableHead>EMI</TableHead>
                              <TableHead>Principal</TableHead>
                              <TableHead>Interest</TableHead>
                              <TableHead>Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateAmortizationSchedule().map((entry) => (
                              <TableRow key={entry.paymentNumber}>
                                <TableCell>{entry.year}</TableCell>
                                <TableCell>{entry.paymentNumber}</TableCell>
                                <TableCell>{formatAmount(entry.emi)}</TableCell>
                                <TableCell>{formatAmount(entry.principalPayment)}</TableCell>
                                <TableCell>{formatAmount(entry.interestPayment)}</TableCell>
                                <TableCell>{formatAmount(entry.remainingPrincipal)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Note: This is a simplified schedule showing yearly payments. Actual EMIs may vary slightly due to rounding.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="text-sm text-muted-foreground flex items-start gap-1">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>These calculations are for illustration purposes only. Actual loan terms may vary based on bank policies, your credit score and other factors.</p>
                  </div>
                </CardFooter>
              </Card>
            )}
            
            {!calculationResult && (
              <Card className="h-full shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Home Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter your loan details and click calculate to see your EMI breakdown</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Home Loan EMI Calculator FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What is a Home Loan EMI?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Home Loan EMI (Equated Monthly Installment) is a fixed amount paid by the borrower to the lender each month towards repayment of the home loan. It consists of both principal and interest components.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How is Home Loan EMI calculated?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Home Loan EMI is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly interest rate, and n is the number of monthly installments.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What additional costs should I consider?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When taking a home loan, you should also consider processing fees (0.5-1% of loan amount), stamp duty (varies by state, typically 4-7%), registration charges, and legal fees. Some banks may also charge loan insurance premiums.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How to get the best home loan interest rate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To get the best interest rate, maintain a good credit score (750+), compare offers from multiple lenders, negotiate based on your relationship with the bank, opt for a higher down payment, and check if you qualify for any special government schemes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
