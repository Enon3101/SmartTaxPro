import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { 
  HelpCircle, 
  IndianRupee, 
  Info, 
  Calendar, 
  Percent, 
  FileText,
  PieChart,
  Wallet
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
import { calculatorClient, PersonalLoanResponse } from '@/lib/calculatorClient';


// Schema for form validation
const formSchema = z.object({
  principal: z.number().min(10000, { message: "Loan amount must be at least ₹10,000" })
    .max(5000000, { message: "Loan amount must be less than ₹50 lakh" }),
  interestRate: z.number().min(9, { message: "Interest rate must be at least 9%" })
    .max(36, { message: "Interest rate must be less than 36%" }),
  tenureYears: z.number().min(0.5, { message: "Tenure must be at least 6 months" })
    .max(5, { message: "Personal loan tenure must be at most 5 years" })
});

type FormValues = z.infer<typeof formSchema>;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const PersonalLoanCalculator = () => {
  const [calculationResult, setCalculationResult] = useState<PersonalLoanResponse | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Format amounts as Indian Rupees
  const formatAmount = (amount: number) => {
    return currencyFormatter.format(amount);
  };
  
  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 300000,  // 3 lakhs default personal loan amount
      interestRate: 14,   // 14% default interest rate
      tenureYears: 3      // 3 years default tenure
    }
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return calculatorClient.calculatePersonalLoan(data);
    },
    onSuccess: (data: PersonalLoanResponse) => {
      setCalculationResult(data);
    },
    onError: (error) => {
      console.error('Error calculating personal loan details:', error);
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
      
      if (i % 6 === 0 || i === 1 || i === numberOfPayments) { // Show half-yearly and first/last entries
        schedule.push({
          paymentNumber: i,
          emi: monthlyEmi,
          principalPayment,
          interestPayment,
          remainingPrincipal: Math.max(0, remainingPrincipal),
          month: i
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
                  <Wallet className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Personal Loan EMI Calculator</CardTitle>
                </div>
                <CardDescription>
                  Calculate your monthly personal loan EMI, total interest and more
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
                              min={10000}
                              max={1000000}
                              step={10000}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>₹10K</span>
                              <span>₹5L</span>
                              <span>₹10L</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Enter your personal loan amount (₹10,000 to ₹10,00,000)
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
                              min={9}
                              max={30}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>9%</span>
                              <span>18%</span>
                              <span>30%</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Personal loan interest rates typically range from 10.5% to 24%
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
                                step="0.5"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                              <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">Years</span>
                            </div>
                          </FormControl>
                          <div className="pt-2 mb-4">
                            <Slider
                              min={0.5}
                              max={5}
                              step={0.5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>6 mo</span>
                              <span>3 yrs</span>
                              <span>5 yrs</span>
                            </div>
                          </div>
                          <FormDescription className="pt-1">
                            Personal loan tenure typically ranges from 6 months to 5 years
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
                      {isPending ? 'Calculating...' : 'Calculate Personal Loan EMI'}
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
                  <CardTitle className="text-xl">Personal Loan Details</CardTitle>
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
                          <h3 className="text-sm text-muted-foreground mb-1">Loan Amount</h3>
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
                              <span className="text-muted-foreground">Pre-Payment Penalty</span>
                              <span>{formatAmount(calculationResult.additionalInfo.prePaymentPenalty)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold">
                              <span>Total Additional Costs</span>
                              <span>{formatAmount(
                                calculationResult.additionalInfo.processingFee + 
                                calculationResult.additionalInfo.prePaymentPenalty
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
                                calculationResult.additionalInfo.prePaymentPenalty
                              )}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-semibold">
                              <span>Total Cost of Loan</span>
                              <span>{formatAmount(
                                calculationResult.totalAmount + 
                                calculationResult.additionalInfo.processingFee + 
                                calculationResult.additionalInfo.prePaymentPenalty
                              )}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableCaption>Personal Loan Repayment Schedule (Half-Yearly)</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>EMI</TableHead>
                              <TableHead>Principal</TableHead>
                              <TableHead>Interest</TableHead>
                              <TableHead>Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {generateAmortizationSchedule().map((entry) => (
                              <TableRow key={entry.paymentNumber}>
                                <TableCell>{entry.month}</TableCell>
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
                        Note: This is a simplified schedule showing payments at 6-month intervals. Actual EMIs may vary slightly due to rounding.
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
                  <CardTitle className="text-xl">Personal Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter your personal loan details and click calculate to see your EMI breakdown</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Personal Loan EMI Calculator FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What is a Personal Loan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A personal loan is an unsecured loan that doesn't require collateral and can be used for various purposes like medical emergencies, home renovation, travel, or debt consolidation. The EMI consists of both principal and interest components.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why are personal loan interest rates higher?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personal loans typically have higher interest rates compared to secured loans (like home loans) because they aren't backed by any collateral, which makes them riskier for lenders. Your credit score significantly impacts the interest rate offered.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What documents are needed for a personal loan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Typically, you'll need identity proof (Aadhaar, PAN), address proof, income proof (salary slips, IT returns for 2 years), bank statements for the past 6 months, and a passport-sized photograph. Some lenders may require additional documents.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Can I prepay my personal loan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, most lenders allow prepayment of personal loans, but usually with a prepayment penalty (typically 2-4% of the outstanding amount). Some lenders may not allow prepayment before a minimum period (usually 6-12 months) from loan disbursal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalLoanCalculator;