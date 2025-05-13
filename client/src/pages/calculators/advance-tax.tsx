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
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  Coins, 
  FileText, 
  HelpCircle, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Advance tax due dates for individuals
const advanceTaxDueDates = [
  { 
    installment: "First Installment", 
    dueDate: "June 15, 2023", 
    percentage: 15, 
    description: "15% of the total advance tax" 
  },
  { 
    installment: "Second Installment", 
    dueDate: "September 15, 2023", 
    percentage: 45, 
    description: "45% of the total advance tax (cumulative)" 
  },
  { 
    installment: "Third Installment", 
    dueDate: "December 15, 2023", 
    percentage: 75, 
    description: "75% of the total advance tax (cumulative)" 
  },
  { 
    installment: "Fourth Installment", 
    dueDate: "March 15, 2024", 
    percentage: 100, 
    description: "100% of the total advance tax (cumulative)" 
  }
];

// Tax slab calculation (simplified for this example)
const calculateTax = (income: number, regime: string, isProfessional: boolean) => {
  let tax = 0;
  
  // For individuals
  if (!isProfessional) {
    if (regime === "new") {
      // New tax regime slabs (simplified)
      if (income <= 300000) {
        tax = 0;
      } else if (income <= 600000) {
        tax = (income - 300000) * 0.05;
      } else if (income <= 900000) {
        tax = 15000 + (income - 600000) * 0.10;
      } else if (income <= 1200000) {
        tax = 45000 + (income - 900000) * 0.15;
      } else if (income <= 1500000) {
        tax = 90000 + (income - 1200000) * 0.20;
      } else {
        tax = 150000 + (income - 1500000) * 0.30;
      }
    } else {
      // Old tax regime slabs (simplified)
      if (income <= 250000) {
        tax = 0;
      } else if (income <= 500000) {
        tax = (income - 250000) * 0.05;
      } else if (income <= 1000000) {
        tax = 12500 + (income - 500000) * 0.20;
      } else {
        tax = 112500 + (income - 1000000) * 0.30;
      }
    }
  } else {
    // For professionals/businesses
    tax = income * 0.30; // Flat 30% tax rate for simplification
  }
  
  // Add 4% health and education cess
  tax = tax * 1.04;
  
  return Math.round(tax);
};

// Main Calculator Component
const AdvanceTaxCalculator = () => {
  // State for form inputs
  const [taxPayerType, setTaxPayerType] = useState("individual");
  const [regime, setRegime] = useState("new");
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState(0);
  const [tdsAlreadyDeducted, setTdsAlreadyDeducted] = useState(0);
  const [selfAssessmentPaid, setSelfAssessmentPaid] = useState(0);
  
  // State for results
  const [totalTaxLiability, setTotalTaxLiability] = useState(0);
  const [advanceTaxLiability, setAdvanceTaxLiability] = useState(0);
  const [installments, setInstallments] = useState<Array<{
    installment: string;
    dueDate: string;
    amount: number;
    percentage: number;
    description: string;
  }>>([]);
  
  // Calculate advance tax on input change
  useEffect(() => {
    // Calculate total tax liability
    const totalTax = calculateTax(
      estimatedAnnualIncome,
      regime,
      taxPayerType === "professional"
    );
    setTotalTaxLiability(totalTax);
    
    // Calculate advance tax after deductions
    const advanceTax = Math.max(0, totalTax - tdsAlreadyDeducted - selfAssessmentPaid);
    setAdvanceTaxLiability(advanceTax);
    
    // Calculate installments
    const installmentData = advanceTaxDueDates.map(data => {
      // Calculate installment amount
      const amount = Math.round((advanceTax * data.percentage) / 100);
      
      // For each installment, the amount shown is the additional amount for that quarter
      let additionalAmount = amount;
      if (data.installment !== "First Installment") {
        const prevInstallment = advanceTaxDueDates.find(
          d => d.percentage === data.percentage - 30 // 15 -> 45 -> 75 -> 100
        );
        if (prevInstallment) {
          const prevAmount = Math.round((advanceTax * prevInstallment.percentage) / 100);
          additionalAmount = amount - prevAmount;
        }
      }
      
      return {
        ...data,
        amount: additionalAmount
      };
    });
    
    setInstallments(installmentData);
    
  }, [estimatedAnnualIncome, tdsAlreadyDeducted, selfAssessmentPaid, regime, taxPayerType]);
  
  // Format currency values
  const formatCurrency = (value: number) => formatIndianCurrency(value);
  
  // Handle input changes as numbers
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    setter(isNaN(value) ? 0 : value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
        <Calendar className="mr-2 h-6 w-6 md:h-8 md:w-8" /> 
        Advance Tax Calculator
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
        Calculate your quarterly advance tax installments for Financial Year 2023-24
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Estimated Income & Tax Details</CardTitle>
              <CardDescription>
                Enter your estimated annual income and other tax details to calculate advance tax
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxPayerType">Taxpayer Type</Label>
                    <Select value={taxPayerType} onValueChange={setTaxPayerType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual/HUF</SelectItem>
                        <SelectItem value="professional">Professional/Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {taxPayerType === "individual" && (
                    <div>
                      <Label htmlFor="regime">Tax Regime</Label>
                      <Select value={regime} onValueChange={setRegime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Tax Regime</SelectItem>
                          <SelectItem value="old">Old Tax Regime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="estimatedAnnualIncome">Estimated Annual Income (FY 2023-24)</Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimatedAnnualIncome"
                      type="number"
                      value={estimatedAnnualIncome || ""}
                      onChange={(e) => handleNumberInput(e, setEstimatedAnnualIncome)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tdsAlreadyDeducted">TDS Already Deducted</Label>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tdsAlreadyDeducted"
                        type="number"
                        value={tdsAlreadyDeducted || ""}
                        onChange={(e) => handleNumberInput(e, setTdsAlreadyDeducted)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="selfAssessmentPaid">Self-Assessment Tax Already Paid</Label>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="selfAssessmentPaid"
                        type="number"
                        value={selfAssessmentPaid || ""}
                        onChange={(e) => handleNumberInput(e, setSelfAssessmentPaid)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 mt-4 bg-muted rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Advance Tax Requirement</h4>
                      <p className="text-sm text-muted-foreground">
                        If your estimated tax liability exceeds ₹10,000 after TDS deductions, 
                        you are required to pay advance tax in installments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Advance Tax Schedule</CardTitle>
              <CardDescription>
                Due dates and amounts for each advance tax installment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Installment</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{installment.installment}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {installment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>{installment.percentage}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(installment.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Notes on Advance Tax</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1">
                      <li>For professionals/businesses, advance tax is computed differently.</li>
                      <li>If income from capital gains is uncertain, advance tax on such income can be paid in the quarter in which the gain occurs.</li>
                      <li>Interest under section 234B and 234C may apply if advance tax is not paid on time.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Advance Tax Summary</CardTitle>
              <CardDescription>
                Your advance tax liability for FY 2023-24
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tax Calculation</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Estimated Annual Income</TableCell>
                        <TableCell className="text-right">{formatCurrency(estimatedAnnualIncome)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Tax Liability</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalTaxLiability)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">TDS Already Deducted</TableCell>
                        <TableCell className="text-right">- {formatCurrency(tdsAlreadyDeducted)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Self-Assessment Tax Paid</TableCell>
                        <TableCell className="text-right">- {formatCurrency(selfAssessmentPaid)}</TableCell>
                      </TableRow>
                      <TableRow className="font-bold text-base">
                        <TableCell>
                          Advance Tax Liability
                          <ChevronRight className="inline ml-1 h-4 w-4" />
                        </TableCell>
                        <TableCell className="text-right text-primary">{formatCurrency(advanceTaxLiability)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                {advanceTaxLiability < 10000 ? (
                  <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-green-600 dark:text-green-500" />
                      <h4 className="text-sm md:text-base font-medium text-green-800 dark:text-green-400">No Advance Tax Required</h4>
                    </div>
                    <p className="text-xs md:text-sm text-green-700 dark:text-green-400 mt-1 ml-5 md:ml-7 leading-tight md:leading-normal">
                      Your tax liability after TDS is less than ₹10,000, so no advance tax is required.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-blue-600 dark:text-blue-500" />
                      <h4 className="text-sm md:text-base font-medium text-blue-800 dark:text-blue-400">Advance Tax Required</h4>
                    </div>
                    <p className="text-xs md:text-sm text-blue-700 dark:text-blue-400 mt-1 ml-5 md:ml-7 leading-tight md:leading-normal">
                      Your tax liability is over ₹10,000. Pay advance tax according to the schedule above.
                    </p>
                  </div>
                )}
              </div>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="help">
                  <AccordionTrigger className="text-xs md:text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Need help understanding advance tax?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-xs md:text-sm text-muted-foreground space-y-2">
                      <p className="leading-tight md:leading-normal">
                        <strong>What is Advance Tax?</strong> It's income tax paid in advance during the financial year in installments, instead of as a lump sum at year-end.
                      </p>
                      <p className="leading-tight md:leading-normal">
                        <strong>Who needs to pay it?</strong> Any person whose estimated tax liability exceeds ₹10,000 after TDS deductions.
                      </p>
                      <p>
                        <strong>When is it due?</strong> It's paid in four installments: by June 15 (15%), September 15 (45%), December 15 (75%), and March 15 (100%).
                      </p>
                      <p>
                        <strong>What happens if I don't pay?</strong> Interest under sections 234B and 234C of the Income Tax Act may be charged for non-payment or short payment of advance tax.
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

export default AdvanceTaxCalculator;