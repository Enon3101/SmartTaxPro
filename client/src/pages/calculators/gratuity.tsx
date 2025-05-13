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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  PiggyBank, 
  Building, 
  Clock, 
  Coins, 
  HelpCircle, 
  Info, 
  AlertCircle,
  Calculator
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Main Calculator Component
const GratuityCalculator = () => {
  // State for form inputs
  const [employeeType, setEmployeeType] = useState("covered");
  const [serviceYears, setServiceYears] = useState<number | "">("");
  const [serviceMonths, setServiceMonths] = useState<number | "">("");
  const [monthlySalary, setMonthlySalary] = useState<number | "">("");
  const [dailyWage, setDailyWage] = useState<number | "">("");
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<number | "">("");
  const [includeDA, setIncludeDA] = useState("yes");
  const [daAmount, setDaAmount] = useState<number | "">("");
  
  // State for results
  const [gratuityAmount, setGratuityAmount] = useState(0);
  const [calculationBreakdown, setCalculationBreakdown] = useState<string[]>([]);
  
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
  
  // Calculate gratuity on input change
  useEffect(() => {
    // Skip calculation if required fields are empty
    if (
      (employeeType === "covered" && (serviceYears === "" || monthlySalary === "")) ||
      (employeeType === "non-covered" && (serviceYears === "" || dailyWage === "" || daysWorkedPerWeek === ""))
    ) {
      setGratuityAmount(0);
      setCalculationBreakdown([]);
      return;
    }
    
    // Convert to numbers and handle empty months
    const years = typeof serviceYears === "number" ? serviceYears : 0;
    const months = typeof serviceMonths === "number" ? serviceMonths : 0;
    
    // Calculate total service period in years
    const totalServiceYears = years + (months / 12);
    
    let breakdown: string[] = [];
    let amount = 0;
    
    if (employeeType === "covered") {
      // For employees covered under Gratuity Act
      // Formula: (Last drawn salary + DA) * 15/26 * years of service
      
      const salary = typeof monthlySalary === "number" ? monthlySalary : 0;
      const da = includeDA === "yes" && typeof daAmount === "number" ? daAmount : 0;
      const totalSalary = salary + da;
      
      // Calculate gratuity (15 days salary for each year of service)
      // 15/26 represents 15 days out of 26 working days
      amount = (totalSalary * 15 / 26) * totalServiceYears;
      
      // Add to breakdown
      breakdown = [
        `Total monthly salary: ₹${totalSalary.toFixed(2)} (Basic + DA)`,
        `15 days salary: ₹${(totalSalary * 15 / 26).toFixed(2)}`,
        `Years of service: ${totalServiceYears.toFixed(2)} years`,
        `Gratuity amount: ₹${(totalSalary * 15 / 26).toFixed(2)} × ${totalServiceYears.toFixed(2)} = ₹${amount.toFixed(2)}`
      ];
      
      // Apply the maximum gratuity limit of Rs. 20,00,000
      if (amount > 2000000) {
        amount = 2000000;
        breakdown.push(`Amount capped at maximum limit of ₹20,00,000 as per Payment of Gratuity Act`);
      }
    } else {
      // For employees not covered under Gratuity Act
      // Formula: Last drawn salary * days_worked_per_month * years of service / 30
      
      const wage = typeof dailyWage === "number" ? dailyWage : 0;
      const daysPerWeek = typeof daysWorkedPerWeek === "number" ? daysWorkedPerWeek : 0;
      
      // Calculate monthly wage (assuming 52 weeks in a year)
      const monthlyWage = (wage * daysPerWeek * 52) / 12;
      
      // Calculate gratuity (one month's salary for each year of service)
      amount = monthlyWage * totalServiceYears;
      
      // Add to breakdown
      breakdown = [
        `Daily wage: ₹${wage.toFixed(2)}`,
        `Days worked per week: ${daysPerWeek}`,
        `Estimated monthly wage: ₹${monthlyWage.toFixed(2)}`,
        `Years of service: ${totalServiceYears.toFixed(2)} years`,
        `Gratuity amount: ₹${monthlyWage.toFixed(2)} × ${totalServiceYears.toFixed(2)} = ₹${amount.toFixed(2)}`
      ];
    }
    
    setGratuityAmount(Math.round(amount));
    setCalculationBreakdown(breakdown);
    
  }, [
    employeeType, serviceYears, serviceMonths, monthlySalary, 
    dailyWage, daysWorkedPerWeek, includeDA, daAmount
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
        <PiggyBank className="mr-2 h-6 w-6 md:h-8 md:w-8" /> 
        Gratuity Calculator
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
        Calculate the gratuity amount payable based on your service period and salary
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>
                Enter your employment and salary details to calculate gratuity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm md:text-base font-medium">Employment Type</Label>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                    Select whether you are covered under the Payment of Gratuity Act
                  </p>
                  
                  <RadioGroup value={employeeType} onValueChange={setEmployeeType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="covered" id="covered" />
                      <Label htmlFor="covered" className="font-normal">
                        Covered by Gratuity Act (Organizations with 10+ employees)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-covered" id="non-covered" />
                      <Label htmlFor="non-covered" className="font-normal">
                        Not covered by Gratuity Act
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm md:text-base font-medium">Service Period</Label>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                    Enter the total period of your employment
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceYears">Years</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="serviceYears"
                          type="number"
                          value={serviceYears}
                          onChange={(e) => handleNumberInput(e.target.value, setServiceYears)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="serviceMonths">Months</Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="serviceMonths"
                          type="number"
                          value={serviceMonths}
                          onChange={(e) => handleNumberInput(e.target.value, setServiceMonths)}
                          placeholder="0"
                          min="0"
                          max="11"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {employeeType === "covered" && (
                    <div className="p-3 mt-2 bg-muted rounded-md text-sm text-muted-foreground">
                      <span className="font-medium">Note:</span> As per the Gratuity Act, employees are eligible for gratuity after completing at least 5 years of continuous service.
                    </div>
                  )}
                </div>
                
                {employeeType === "covered" ? (
                  <div>
                    <Label className="text-base font-medium">Salary Details</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter your last drawn basic salary
                    </p>
                    
                    <div>
                      <Label htmlFor="monthlySalary">Monthly Basic Salary</Label>
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="monthlySalary"
                          type="number"
                          value={monthlySalary}
                          onChange={(e) => handleNumberInput(e.target.value, setMonthlySalary)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="mb-2 inline-block">Include Dearness Allowance (DA)?</Label>
                      <RadioGroup value={includeDA} onValueChange={setIncludeDA} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes-da" />
                          <Label htmlFor="yes-da" className="font-normal">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no-da" />
                          <Label htmlFor="no-da" className="font-normal">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {includeDA === "yes" && (
                      <div className="mt-4">
                        <Label htmlFor="daAmount">Monthly DA Amount</Label>
                        <div className="flex items-center">
                          <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="daAmount"
                            type="number"
                            value={daAmount}
                            onChange={(e) => handleNumberInput(e.target.value, setDaAmount)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label className="text-base font-medium">Wage Details</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter your daily wage and working days
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dailyWage">Daily Wage</Label>
                        <div className="flex items-center">
                          <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dailyWage"
                            type="number"
                            value={dailyWage}
                            onChange={(e) => handleNumberInput(e.target.value, setDailyWage)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="daysWorkedPerWeek">Days Worked Per Week</Label>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="daysWorkedPerWeek"
                            type="number"
                            value={daysWorkedPerWeek}
                            onChange={(e) => handleNumberInput(e.target.value, setDaysWorkedPerWeek)}
                            placeholder="0"
                            min="1"
                            max="7"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Gratuity Calculation Result
                </div>
              </CardTitle>
              <CardDescription>
                Your estimated gratuity amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-primary/5 rounded-lg mb-6 text-center">
                <h3 className="text-lg font-medium mb-2">Total Gratuity Amount</h3>
                <div className="text-3xl font-bold text-primary">
                  {formatIndianCurrency(gratuityAmount)}
                </div>
              </div>
              
              {calculationBreakdown.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Calculation Breakdown</h3>
                  <ul className="space-y-2 text-sm">
                    {calculationBreakdown.map((item, index) => (
                      <li key={index} className="flex">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {employeeType === "covered" && gratuityAmount > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tax Treatment of Gratuity</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gratuity received from an employer covered under the Gratuity Act is exempt up to ₹20 lakhs under Section 10(10) of the Income Tax Act. Any amount exceeding this limit is taxable as per your income tax slab.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="eligibility">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Gratuity Eligibility Criteria
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p className="font-medium">For employees covered under Payment of Gratuity Act:</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Must have completed at least 5 years of continuous service</li>
                        <li>Paid at the time of retirement, resignation, death, or disablement</li>
                        <li>Maximum gratuity amount is capped at ₹20 lakhs</li>
                      </ul>
                      
                      <p className="font-medium mt-3">For employees NOT covered under Payment of Gratuity Act:</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Eligibility and calculation vary based on company policy</li>
                        <li>Typically calculated as one month's salary for each completed year of service</li>
                        <li>Income tax exemption limit still applies as per Section 10(10) of Income Tax Act</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="calculation">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Gratuity Calculation Formula
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p className="font-medium">For employees covered under Gratuity Act:</p>
                      <p>Gratuity = (Last drawn salary + DA) × 15/26 × Number of years of service</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Last drawn salary includes basic salary and dearness allowance</li>
                        <li>15/26 represents 15 days out of 26 working days in a month</li>
                        <li>Any fraction of service year exceeding 6 months is considered as a full year</li>
                      </ul>
                      
                      <p className="font-medium mt-3">For employees NOT covered under Gratuity Act:</p>
                      <p>Gratuity = Last drawn salary × Number of years of service</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Typically one month's salary for each completed year of service</li>
                        <li>Calculation methodology may vary based on company policy</li>
                      </ul>
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

export default GratuityCalculator;