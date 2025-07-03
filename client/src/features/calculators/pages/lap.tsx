import { motion } from 'framer-motion';
import { Home, Calculator, ArrowLeft, DollarSign, Percent, CalendarDays } from "lucide-react";
import React, { useState } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator"; // Removed unused import
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatIndianCurrency } from "@/lib/formatters"; // Assuming this is the correct formatter

// Calculation logic (from existing file, slightly modified to ensure all outputs are numbers)
const calculateLAPLogic = (
  propertyValue: number,
  monthlyIncome: number,
  existingLoanEmi: number,
  loanTenureYears: number,
  interestRate: number // Made mandatory for calculator input
) => {
  // LAP eligibility is typically 60-70% of property value, let's use 65%
  const maxLoanBasedOnPropertyValue = propertyValue * 0.65;
  
  // EMI calculation for the maxLoanBasedOnPropertyValue
  const monthlyRate = interestRate / 100 / 12;
  const months = loanTenureYears * 12;
  
  // let emiForMaxLoan = 0; // Removed unused variable
  // if (months > 0 && monthlyRate > 0) {
  //   emiForMaxLoan = (maxLoanBasedOnPropertyValue * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  // }
  
  // Affordability check (e.g., EMI should not exceed 50% of net monthly income after existing EMIs)
  // This is a common heuristic; actual bank criteria vary.
  const maxPermissibleEmi = (monthlyIncome * 0.50) - existingLoanEmi;
  
  let eligibleLoanAmountBasedOnIncome = 0;
  if (maxPermissibleEmi > 0 && monthlyRate > 0 && months > 0) {
    eligibleLoanAmountBasedOnIncome = (maxPermissibleEmi * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months));
  }

  const finalEligibleLoanAmount = Math.min(maxLoanBasedOnPropertyValue, eligibleLoanAmountBasedOnIncome);
  
  let finalEmi = 0;
  if (finalEligibleLoanAmount > 0 && monthlyRate > 0 && months > 0) {
    finalEmi = (finalEligibleLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  return {
    maxLoanAmountProperty: maxLoanBasedOnPropertyValue > 0 ? maxLoanBasedOnPropertyValue : 0,
    estimatedEmi: finalEmi > 0 && isFinite(finalEmi) ? finalEmi : 0,
    eligibleLoanAmount: finalEligibleLoanAmount > 0 ? finalEligibleLoanAmount : 0,
    maxPermissibleEmi: maxPermissibleEmi > 0 ? maxPermissibleEmi : 0,
    isEligible: finalEligibleLoanAmount > 0 && finalEmi > 0 && isFinite(finalEmi)
  };
};

const LapCalculator = () => {
  const [propertyValue, setPropertyValue] = useState<number>(5000000); // e.g., 50 Lakhs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000); // e.g., 1 Lakh
  const [existingLoanEmi, setExistingLoanEmi] = useState<number>(0);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(10.5); // Default interest rate

  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Calculation Results
  const [maxLoanAmountProperty, setMaxLoanAmountProperty] = useState<number>(0);
  const [estimatedEmi, setEstimatedEmi] = useState<number>(0);
  const [eligibleLoanAmount, setEligibleLoanAmount] = useState<number>(0);
  const [maxPermissibleEmi, setMaxPermissibleEmi] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(false);

  const handleCalculate = () => {
    const results = calculateLAPLogic(
      propertyValue,
      monthlyIncome,
      existingLoanEmi,
      loanTenureYears,
      interestRate
    );
    setMaxLoanAmountProperty(results.maxLoanAmountProperty);
    setEstimatedEmi(results.estimatedEmi);
    setEligibleLoanAmount(results.eligibleLoanAmount);
    setMaxPermissibleEmi(results.maxPermissibleEmi);
    setIsEligible(results.isEligible);
    setIsCalculated(true);
  };

  const handleReset = () => {
    setPropertyValue(5000000);
    setMonthlyIncome(100000);
    setExistingLoanEmi(0);
    setLoanTenureYears(15);
    setInterestRate(10.5);
    setIsCalculated(false);
    setMaxLoanAmountProperty(0);
    setEstimatedEmi(0);
    setEligibleLoanAmount(0);
    setMaxPermissibleEmi(0);
    setIsEligible(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/calculators">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Calculators
          </Link>
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-primary" />
            Loan Against Property (LAP) Calculator
          </h1>
          <p className="text-muted-foreground">
            Estimate your eligibility and EMI for a Loan Against Property.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Input Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-value" className="flex items-center">
                  <Home className="mr-2 h-4 w-4 text-gray-500" /> Property Value (₹)
                </Label>
                <Input
                  id="property-value"
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value) || 0)}
                  placeholder="e.g., 5000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-income" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500" /> Net Monthly Income (₹)
                </Label>
                <Input
                  id="monthly-income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  placeholder="e.g., 100000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="existing-emi" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500" /> Existing Monthly Loan EMIs (₹)
                </Label>
                <Input
                  id="existing-emi"
                  type="number"
                  value={existingLoanEmi}
                  onChange={(e) => setExistingLoanEmi(Number(e.target.value) || 0)}
                  placeholder="e.g., 15000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-tenure" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-gray-500" /> Loan Tenure (Years)
                </Label>
                <Input
                  id="loan-tenure"
                  type="number"
                  value={loanTenureYears}
                  min="1"
                  max="30"
                  onChange={(e) => setLoanTenureYears(Number(e.target.value) || 0)}
                  placeholder="e.g., 15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate" className="flex items-center">
                  <Percent className="mr-2 h-4 w-4 text-gray-500" /> Annual Interest Rate (%)
                </Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  step="0.01"
                  min="1"
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  placeholder="e.g., 10.5"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  size="lg"
                  disabled={propertyValue <= 0 || monthlyIncome <= 0 || loanTenureYears <= 0 || interestRate <= 0}
                >
                  Calculate LAP Eligibility
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isCalculated && (
            <>
              <Card className="bg-muted/50 border-primary border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">LAP Eligibility Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {isEligible ? (
                    <div className="text-center p-4 bg-green-100 border border-green-400 rounded-md">
                      <h3 className="text-lg font-semibold text-green-700">Congratulations! You may be eligible for a Loan Against Property.</h3>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-red-100 border border-red-400 rounded-md">
                      <h3 className="text-lg font-semibold text-red-700">Based on the inputs, you may not be eligible or the loan amount is very low.</h3>
                      <p className="text-sm text-red-600">Consider adjusting inputs or consult with a financial advisor.</p>
                    </div>
                  )}

                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Max Loan Amount (based on 65% of Property Value)</TableCell>
                        <TableCell className="text-right font-bold text-lg">{formatIndianCurrency(maxLoanAmountProperty)}</TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell className="font-medium">Max Permissible EMI (based on 50% of Income - Existing EMIs)</TableCell>
                        <TableCell className="text-right font-bold text-lg">{formatIndianCurrency(maxPermissibleEmi)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/10">
                        <TableCell className="font-semibold text-primary">Eligible Loan Amount</TableCell>
                        <TableCell className="text-right font-bold text-lg text-primary">{formatIndianCurrency(eligibleLoanAmount)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Estimated Monthly EMI</TableCell>
                        <TableCell className="text-right font-bold text-lg">{formatIndianCurrency(estimatedEmi)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    *This is an indicative calculation. Actual loan amount and EMI may vary based on bank policies and your credit profile.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Calculator className="mr-2 h-5 w-5 text-primary" />
                    Calculation Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li><strong>Loan-to-Value (LTV) Ratio:</strong> Typically, banks offer 60-70% of the property&apos;s market value. We&amp;apos;ve used 65% for this estimation.</li>
                    <li><strong>Fixed Obligation to Income Ratio (FOIR):</strong> Banks assess your repayment capacity. Generally, total EMIs (including the proposed LAP) should not exceed 40-50% of your net monthly income. We&amp;apos;ve used 50% for this estimation.</li>
                    <li><strong>Interest Rate:</strong> This significantly impacts your EMI. Rates vary by lender and applicant profile.</li>
                    <li><strong>Loan Tenure:</strong> Longer tenures reduce EMI but increase total interest paid.</li>
                    <li><strong>Property Type & Condition:</strong> Lenders evaluate the property&apos;s marketability.</li>
                    <li><strong>Credit Score & History:</strong> A good credit score is crucial for loan approval and favorable terms.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">Important Notes:</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5 text-muted-foreground">
                    <li>A Loan Against Property (LAP) can be taken against residential or commercial property.</li>
                    <li>The property must be owned by you and have a clear title.</li>
                    <li>Funds from LAP can be used for various purposes like business expansion, education, medical emergencies, etc., but usually not for speculative purposes.</li>
                    <li>Processing fees, legal charges, and valuation fees are applicable.</li>
                    <li>Ensure all property documents are in order for a smooth process.</li>
                    <li>This calculator provides an estimate. Final loan terms are at the discretion of the lending institution.</li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleReset}>
                  Reset Calculator
                </Button>
              </div>
            </>
          )}
          
          {!isCalculated && (
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unlock the Value of Your Property</h3>
                <p className="text-muted-foreground mb-6">
                  A Loan Against Property allows you to leverage your existing property to meet significant financial needs.
                  Use this calculator to get an estimate of your potential loan amount and EMI.
                </p>
                
                <div className="text-left space-y-4">
                  <div>
                    <h4 className="font-semibold">Key Inputs for LAP Calculation:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li><strong>Property&apos;s Current Market Value:</strong> The higher the value, the higher the potential loan.</li>
                      <li><strong>Your Net Monthly Income:</strong> Determines your repayment capacity.</li>
                      <li><strong>Existing Loan EMIs:</strong> Affects your disposable income for new EMIs.</li>
                      <li><strong>Desired Loan Tenure:</strong> Impacts the EMI amount.</li>
                      <li><strong>Applicable Interest Rate:</strong> Varies across lenders.</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground pt-2">
                    Fill in these details and click &quot;Calculate LAP Eligibility&quot; to see your estimated loan details.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LapCalculator;
