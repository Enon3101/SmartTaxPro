import {
  PiggyBank,
  // Clock, // Unused
  // Coins, // Unused
  HelpCircle,
  // Info, // Unused
  // AlertCircle, // Unused
  // Calculator, // Unused
  ArrowLeft,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  // TableHead, TableHeader, // Removed as not used in this version of UI
  TableRow,
} from "@/components/ui/table";
import { formatIndianCurrency } from "@/lib/formatters";

const GratuityCalculator = () => {
  const [employeeType, setEmployeeType] = useState("covered");
  const [serviceYears, setServiceYears] = useState<number | "">(5);
  const [serviceMonths, setServiceMonths] = useState<number | "">(0);

  const [lastDrawnBasic, setLastDrawnBasic] = useState<number | "">(50000);
  const [lastDrawnDA, setLastDrawnDA] = useState<number | "">(0);
  const [avgMonthlySalaryNonCovered, setAvgMonthlySalaryNonCovered] = useState<number | "">(50000);
  const [actualGratuityReceived, setActualGratuityReceived] = useState<number | "">("");

  const [calculatedGratuity, setCalculatedGratuity] = useState(0);
  const [finalPayableGratuity, setFinalPayableGratuity] = useState(0);
  const [taxExemptGratuity, setTaxExemptGratuity] = useState(0);
  const [taxableGratuity, setTaxableGratuity] = useState(0);
  const [calculationBreakdown, setCalculationBreakdown] = useState<string[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | "">>
    // min?: number, // Optional min/max if needed later
    // max?: number 
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      // if (min !== undefined && parsedValue < min) setter(min);
      // else if (max !== undefined && parsedValue > max) setter(max);
      // else setter(parsedValue);
      setter(parsedValue);
    } else if (parsedValue < 0) {
      setter(0);
    }
  };

  const calculateGratuityLogic = useCallback(() => {
    const yearsNum = typeof serviceYears === "number" ? serviceYears : 0;
    const monthsNum = typeof serviceMonths === "number" ? serviceMonths : 0;

    if (yearsNum === 0 && monthsNum === 0) {
      setCalculatedGratuity(0);
      setFinalPayableGratuity(0);
      setTaxExemptGratuity(0);
      setTaxableGratuity(0);
      setCalculationBreakdown([]);
      setIsCalculated(false);
      return;
    }

    let formulaGratuityResult = 0;
    let effectiveYearsOfService = 0;
    let salaryBaseForCalc = 0;
    const currentBreakdown: string[] = []; // Changed to const
    const statutoryCap = 2000000;

    if (employeeType === "covered") {
      const basic = typeof lastDrawnBasic === "number" ? lastDrawnBasic : 0;
      const da = typeof lastDrawnDA === "number" ? lastDrawnDA : 0;
      salaryBaseForCalc = basic + da;

      if (salaryBaseForCalc <= 0 && (basic !== 0 || da !== 0) ) {
         setIsCalculated(true); setCalculationBreakdown(["Last drawn basic + DA must be positive for 'covered' type if not both zero."]); 
         setFinalPayableGratuity(0); setTaxExemptGratuity(0); setTaxableGratuity(0); setCalculatedGratuity(0);
         return;
      }
      
      effectiveYearsOfService = yearsNum;
      if (monthsNum >= 6) {
        effectiveYearsOfService = yearsNum + 1;
      }
      
      currentBreakdown.push(`Last Drawn Salary (Basic + DA): ${formatIndianCurrency(salaryBaseForCalc)}`);
      currentBreakdown.push(`Effective Years of Service (Rounded): ${effectiveYearsOfService} years`);
      if (salaryBaseForCalc > 0 && effectiveYearsOfService > 0) {
        formulaGratuityResult = (salaryBaseForCalc * 15 / 26) * effectiveYearsOfService;
      }
      currentBreakdown.push(`Gratuity (Formula: (Salary * 15/26 * Years)): ${formatIndianCurrency(formulaGratuityResult)}`);
      
      const payable = Math.min(formulaGratuityResult, statutoryCap);
      setFinalPayableGratuity(payable); // Set this before using it in actualReceivedNum
      if (formulaGratuityResult > statutoryCap) {
        currentBreakdown.push(`Payable Gratuity capped at statutory limit of ${formatIndianCurrency(statutoryCap)}`);
      } else {
        currentBreakdown.push(`Payable Gratuity: ${formatIndianCurrency(payable)}`); // Use payable here
      }

    } else { // Not covered by Act
      salaryBaseForCalc = typeof avgMonthlySalaryNonCovered === "number" ? avgMonthlySalaryNonCovered : 0;
      effectiveYearsOfService = yearsNum; // Only completed years

      if (salaryBaseForCalc <= 0) {
         setIsCalculated(true); setCalculationBreakdown(["Average monthly salary must be positive for 'non-covered' type."]); 
         setFinalPayableGratuity(0); setTaxExemptGratuity(0); setTaxableGratuity(0); setCalculatedGratuity(0);
         return;
      }

      currentBreakdown.push(`Average Monthly Salary (last 10 months Basic + DA): ${formatIndianCurrency(salaryBaseForCalc)}`);
      currentBreakdown.push(`Completed Years of Service: ${effectiveYearsOfService} years`);
      if (salaryBaseForCalc > 0 && effectiveYearsOfService > 0) {
        formulaGratuityResult = (salaryBaseForCalc * 15 / 30) * effectiveYearsOfService;
      }
      currentBreakdown.push(`Gratuity (Formula: (Avg Salary * 15/30 * Completed Years)): ${formatIndianCurrency(formulaGratuityResult)}`);
      setFinalPayableGratuity(formulaGratuityResult); 
      currentBreakdown.push(`Payable Gratuity: ${formatIndianCurrency(formulaGratuityResult)}`);
    }

    setCalculatedGratuity(formulaGratuityResult);

    // Tax Exemption Calculation
    // Use finalPayableGratuity (which is already set) if actualGratuityReceived is not provided
    const actualReceivedNum = typeof actualGratuityReceived === "number" && actualGratuityReceived > 0 
                           ? actualGratuityReceived 
                           : (employeeType === "covered" ? Math.min(formulaGratuityResult, statutoryCap) : formulaGratuityResult);


    currentBreakdown.push(`Amount considered for tax calculation (Actual or Payable): ${formatIndianCurrency(actualReceivedNum)}`);
    
    const exemptionComponent3 = formulaGratuityResult;
    const exempt = Math.min(statutoryCap, actualReceivedNum, exemptionComponent3);
    setTaxExemptGratuity(exempt);
    const taxable = Math.max(0, actualReceivedNum - exempt);
    setTaxableGratuity(taxable);

    currentBreakdown.push(`Tax-Exempt Gratuity (Min of Rs 20L, Amount for Tax Calc, Formula Gratuity): ${formatIndianCurrency(exempt)}`);
    currentBreakdown.push(`Taxable Gratuity: ${formatIndianCurrency(taxable)}`);
    
    setCalculationBreakdown(currentBreakdown);
    setIsCalculated(true);
  }, [employeeType, serviceYears, serviceMonths, lastDrawnBasic, lastDrawnDA, avgMonthlySalaryNonCovered, actualGratuityReceived]); 
  
   useEffect(() => {
    calculateGratuityLogic();
  }, [calculateGratuityLogic]);


  const handleReset = () => {
    setEmployeeType("covered");
    setServiceYears(5);
    setServiceMonths(0);
    setLastDrawnBasic(50000);
    setLastDrawnDA(0);
    setAvgMonthlySalaryNonCovered(50000);
    setActualGratuityReceived("");
    setIsCalculated(false);
    setCalculatedGratuity(0);
    setFinalPayableGratuity(0);
    setTaxExemptGratuity(0);
    setTaxableGratuity(0);
    setCalculationBreakdown([]);
  };

  const currentServiceYears = typeof serviceYears === 'number' ? serviceYears : 0;
  const currentServiceMonths = typeof serviceMonths === 'number' ? serviceMonths : 0;

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/calculators">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Calculators
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
          <PiggyBank className="mr-2 h-6 w-6 md:h-8 md:w-8 text-primary" />
          Gratuity Calculator
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Calculate your gratuity amount and tax implications
        </p>
      </div>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>
                Enter your employment and salary details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm md:text-base font-medium">Are you covered under the Payment of Gratuity Act, 1972?</Label>
                  <RadioGroup value={employeeType} onValueChange={setEmployeeType} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="covered" id="covered" />
                      <Label htmlFor="covered" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-covered" id="non-covered" />
                      <Label htmlFor="non-covered" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm md:text-base font-medium">Service Period</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="serviceYears">Years</Label>
                      <Input id="serviceYears" type="number" value={serviceYears} onChange={(e) => handleNumberInput(e.target.value, setServiceYears)} placeholder="e.g., 10" min="0"/>
                    </div>
                    <div>
                      <Label htmlFor="serviceMonths">Months</Label>
                      <Input id="serviceMonths" type="number" value={serviceMonths} onChange={(e) => handleNumberInput(e.target.value, setServiceMonths)} placeholder="e.g., 7" min="0" max="11"/>
                    </div>
                  </div>
                </div>
                
                {employeeType === "covered" ? (
                  <>
                    <div>
                      <Label htmlFor="lastDrawnBasic">Last Drawn Monthly Basic Salary</Label>
                      <Input id="lastDrawnBasic" type="number" value={lastDrawnBasic} onChange={(e) => handleNumberInput(e.target.value, setLastDrawnBasic)} placeholder="e.g., 50000" min="0"/>
                    </div>
                    <div>
                      <Label htmlFor="lastDrawnDA">Last Drawn Monthly Dearness Allowance (DA)</Label>
                      <Input id="lastDrawnDA" type="number" value={lastDrawnDA} onChange={(e) => handleNumberInput(e.target.value, setLastDrawnDA)} placeholder="e.g., 5000" min="0"/>
                    </div>
                  </>
                ) : (
                  <div>
                    <Label htmlFor="avgMonthlySalaryNonCovered">Average Monthly Salary (Basic + DA) for last 10 months</Label>
                    <Input id="avgMonthlySalaryNonCovered" type="number" value={avgMonthlySalaryNonCovered} onChange={(e) => handleNumberInput(e.target.value, setAvgMonthlySalaryNonCovered)} placeholder="e.g., 50000" min="0"/>
                  </div>
                )}
                 <div>
                    <Label htmlFor="actualGratuityReceived">Actual Gratuity Received (Optional - if already known)</Label>
                    <Input id="actualGratuityReceived" type="number" value={actualGratuityReceived} onChange={(e) => handleNumberInput(e.target.value, setActualGratuityReceived)} placeholder="Enter if known" min="0"/>
                </div>
                <Button onClick={calculateGratuityLogic} className="w-full">Calculate Gratuity</Button>
                 {employeeType === "covered" && (currentServiceYears === 0 && currentServiceMonths === 0 ? false : (currentServiceYears < 5 && !(currentServiceYears === 4 && currentServiceMonths >=6) ) ) && (
                     <div className="p-3 mt-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                       <p className="font-bold">Eligibility Note</p>
                       <p>Employees covered under the Gratuity Act are generally eligible after 5 years of continuous service. Service less than 4 years and 6 months (i.e., not rounded to 5 years) might not qualify.</p>
                     </div>
                   )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          {isCalculated && (
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Gratuity Calculation Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg mb-4 text-center">
                  <h3 className="text-md font-medium text-muted-foreground mb-1">Payable Gratuity Amount</h3>
                  <div className="text-2xl font-bold text-primary">
                    {formatIndianCurrency(finalPayableGratuity)}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-md font-semibold">Calculation Details:</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Raw Gratuity (by Formula)</TableCell>
                        <TableCell className="text-right">{formatIndianCurrency(calculatedGratuity)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <h5 className="text-sm font-semibold mt-2">Breakdown Steps:</h5>
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    {calculationBreakdown.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <div className="pt-2">
                     <h4 className="text-md font-semibold">Tax Implications:</h4>
                     <Table>
                        <TableBody>
                           <TableRow>
                              <TableCell>Tax-Exempt Gratuity</TableCell>
                              <TableCell className="text-right">{formatIndianCurrency(taxExemptGratuity)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell>Taxable Gratuity</TableCell>
                              <TableCell className="text-right">{formatIndianCurrency(taxableGratuity)}</TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </div>
                </div>
                 <Button onClick={handleReset} variant="outline" className="w-full mt-4">Reset</Button>
              </CardContent>
            </Card>
          )}
          <Card className={isCalculated ? "mt-6" : ""}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="eligibility">
                <AccordionTrigger className="px-6 text-sm">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Gratuity Eligibility & Rules
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">Covered by Gratuity Act, 1972:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>Applies to establishments with 10+ employees.</li>
                      <li>Eligibility: After 5 years of continuous service (not applicable on death/disablement).</li>
                      <li>Formula: (Last Drawn Basic + DA) × (15/26) × Rounded Years of Service.</li>
                      <li>Service Years: 6+ months in the last year rounded up to next full year.</li>
                      <li>Max Payout: Capped at ₹20 lakhs.</li>
                    </ul>
                    <p className="font-medium mt-2">Not Covered by Gratuity Act:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>Depends on employment contract/company policy.</li>
                      <li>Common Formula: (Avg. Salary of last 10 months) × (15/30) × Completed Years of Service.</li>
                      <li>Service Years: Only completed years considered.</li>
                    </ul>
                     <p className="font-medium mt-2">Tax Exemption (Sec 10(10)):</p>
                     <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Least of: (a) ₹20 Lakhs, (b) Actual Gratuity Received, (c) Gratuity by formula.</li>
                        <li>Fully exempt for Government employees.</li>
                     </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GratuityCalculator;
