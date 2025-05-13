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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Calculator, 
  ChevronRight, 
  Coins, 
  Home, 
  Building, 
  BookOpen, 
  BarChart, 
  PiggyBank, 
  FileText, 
  HelpCircle, 
  Info 
} from "lucide-react";
import { getTaxSlabsByYear } from "@/data/taxSlabs";
import { formatIndianCurrency } from "@/lib/formatters";

// Tax slab lookup and calculation
const calculateTaxByRegime = (totalIncome: number, regime: string, isResident: boolean = true, age: number = 30) => {
  // Get the tax slabs for the assessment year 2024-25
  const taxSlabsData = getTaxSlabsByYear("2024-25");
  
  // Find the appropriate tax regime
  const taxRegime = taxSlabsData.regimes.find(r => 
    regime === "new" ? r.name === "New Tax Regime" : r.name === "Old Tax Regime"
  ) || taxSlabsData.regimes[0];

  let slabs = taxRegime.slabs;
  let tax = 0;
  
  // Apply senior citizen slabs for old regime if applicable
  if (regime === "old" && isResident) {
    if (age >= 80) {
      // Super senior citizens (80 years and above)
      slabs = taxSlabsData.regimes.find(r => r.name === "Old Tax Regime (Super Senior)")?.slabs || slabs;
    } else if (age >= 60) {
      // Senior citizens (60-80 years)
      slabs = taxSlabsData.regimes.find(r => r.name === "Old Tax Regime (Senior)")?.slabs || slabs;
    }
  }
  
  // Calculate tax based on slabs
  for (const slab of slabs) {
    if (totalIncome > slab.incomeFrom) {
      const taxableIncome = slab.incomeTo === null ? 
        totalIncome - slab.incomeFrom :
        Math.min(slab.incomeTo, totalIncome) - slab.incomeFrom;
      
      tax += taxableIncome * (slab.taxRate / 100);
      
      if (slab.incomeTo !== null && totalIncome <= slab.incomeTo) {
        break;
      }
    }
  }
  
  // Calculate cess
  const cess = tax * (taxRegime.cess / 100);
  
  // Calculate surcharge
  let surcharge = 0;
  if (taxRegime.surcharge) {
    const surchargeThresholds = Object.keys(taxRegime.surcharge)
      .map(Number)
      .sort((a, b) => b - a); // Sort in descending order
    
    for (const threshold of surchargeThresholds) {
      if (totalIncome > threshold) {
        surcharge = tax * (taxRegime.surcharge[threshold] / 100);
        break;
      }
    }
  }
  
  const totalTax = tax + cess + surcharge;
  
  return {
    basicTax: Math.round(tax),
    cess: Math.round(cess),
    surcharge: Math.round(surcharge),
    totalTax: Math.round(totalTax)
  };
};

// Main Calculator Component
const IncomeTaxCalculator = () => {
  // State for form inputs
  const [regime, setRegime] = useState("new");
  const [age, setAge] = useState("below60");
  const [residentialStatus, setResidentialStatus] = useState("resident");
  
  // Income inputs
  const [salary, setSalary] = useState(0);
  const [housePropertyIncome, setHousePropertyIncome] = useState(0);
  const [businessIncome, setBusinessIncome] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  
  // Deductions
  const [section80C, setSection80C] = useState(0);
  const [section80D, setSection80D] = useState(0);
  const [section80TTA, setSection80TTA] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  
  // Tax Paid
  const [tdsOnSalary, setTdsOnSalary] = useState(0);
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(0);
  const [selfAssessmentTaxPaid, setSelfAssessmentTaxPaid] = useState(0);
  
  // Results
  const [grossTotalIncome, setGrossTotalIncome] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxLiability, setTaxLiability] = useState({
    basicTax: 0,
    cess: 0,
    surcharge: 0,
    totalTax: 0
  });
  const [taxAlreadyPaid, setTaxAlreadyPaid] = useState(0);
  const [taxPayable, setTaxPayable] = useState(0);
  
  // Calculate tax on input change
  useEffect(() => {
    // Calculate gross total income
    const totalIncome = salary + housePropertyIncome + businessIncome + capitalGains + otherIncome;
    setGrossTotalIncome(totalIncome);
    
    // Calculate total deductions
    // For new regime, most deductions are not allowed
    let totalDeductionsAmount = 0;
    
    if (regime === "old") {
      totalDeductionsAmount = Math.min(section80C, 150000) + 
                              section80D + 
                              Math.min(section80TTA, 10000) + 
                              otherDeductions;
    } else {
      // New regime has limited deductions
      // For simplicity, we'll assume very few deductions are available
      // In a real implementation, this would be much more detailed
      totalDeductionsAmount = Math.min(otherDeductions, 50000);
    }
    
    setTotalDeductions(totalDeductionsAmount);
    
    // Calculate taxable income
    const taxableIncomeAmount = Math.max(0, totalIncome - totalDeductionsAmount);
    setTaxableIncome(taxableIncomeAmount);
    
    // Calculate tax liability
    const ageInYears = age === "below60" ? 30 : age === "60to80" ? 65 : 85;
    const isResident = residentialStatus === "resident";
    
    const taxDetails = calculateTaxByRegime(
      taxableIncomeAmount, 
      regime, 
      isResident, 
      ageInYears
    );
    
    setTaxLiability(taxDetails);
    
    // Calculate total tax already paid
    const totalTaxPaid = tdsOnSalary + advanceTaxPaid + selfAssessmentTaxPaid;
    setTaxAlreadyPaid(totalTaxPaid);
    
    // Calculate tax payable or refundable
    const taxPayableAmount = taxDetails.totalTax - totalTaxPaid;
    
    // Round to nearest 10 as per Indian tax rules
    const roundedTaxPayable = Math.round(taxPayableAmount / 10) * 10;
    setTaxPayable(roundedTaxPayable);
    
  }, [
    regime, age, residentialStatus, 
    salary, housePropertyIncome, businessIncome, capitalGains, otherIncome, 
    section80C, section80D, section80TTA, otherDeductions,
    tdsOnSalary, advanceTaxPaid, selfAssessmentTaxPaid
  ]);
  
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
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <Calculator className="mr-2 h-8 w-8" /> 
        Income Tax Calculator
      </h1>
      <p className="text-muted-foreground mb-8">
        Calculate your income tax liability for the Financial Year 2023-24 (Assessment Year 2024-25)
      </p>
      
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Tax Regime and Personal Details</CardTitle>
              <CardDescription>
                Select your tax regime and personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                <div>
                  <Label htmlFor="age">Age Group</Label>
                  <Select 
                    value={age} 
                    onValueChange={setAge}
                    disabled={regime === "new"}  // Age doesn't matter in new regime
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below60">Below 60 years</SelectItem>
                      <SelectItem value="60to80">60 to 80 years</SelectItem>
                      <SelectItem value="above80">Above 80 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="residentialStatus">Residential Status</Label>
                  <Select value={residentialStatus} onValueChange={setResidentialStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="nri">Non-Resident Indian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="deductions">Deductions</TabsTrigger>
                  <TabsTrigger value="tax-paid">Taxes Paid</TabsTrigger>
                </TabsList>
                
                <TabsContent value="income">
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salary">Salary Income</Label>
                        <div className="flex items-center">
                          <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="salary"
                            type="number"
                            value={salary || ""}
                            onChange={(e) => handleNumberInput(e, setSalary)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="housePropertyIncome">House Property Income</Label>
                        <div className="flex items-center">
                          <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="housePropertyIncome"
                            type="number"
                            value={housePropertyIncome || ""}
                            onChange={(e) => handleNumberInput(e, setHousePropertyIncome)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessIncome">Business/Profession Income</Label>
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="businessIncome"
                            type="number"
                            value={businessIncome || ""}
                            onChange={(e) => handleNumberInput(e, setBusinessIncome)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="capitalGains">Capital Gains</Label>
                        <div className="flex items-center">
                          <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="capitalGains"
                            type="number"
                            value={capitalGains || ""}
                            onChange={(e) => handleNumberInput(e, setCapitalGains)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="otherIncome">Other Income (Interest, Dividends, etc.)</Label>
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="otherIncome"
                          type="number"
                          value={otherIncome || ""}
                          onChange={(e) => handleNumberInput(e, setOtherIncome)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="deductions">
                  <div className="space-y-4 py-4">
                    {regime === "old" ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="section80C">Section 80C (Max ₹1,50,000)</Label>
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="section80C"
                                type="number"
                                value={section80C || ""}
                                onChange={(e) => handleNumberInput(e, setSection80C)}
                                placeholder="0"
                                max={150000}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="section80D">Section 80D (Health Insurance)</Label>
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="section80D"
                                type="number"
                                value={section80D || ""}
                                onChange={(e) => handleNumberInput(e, setSection80D)}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="section80TTA">Section 80TTA (Savings Interest, Max ₹10,000)</Label>
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="section80TTA"
                                type="number"
                                value={section80TTA || ""}
                                onChange={(e) => handleNumberInput(e, setSection80TTA)}
                                placeholder="0"
                                max={10000}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="otherDeductions">Other Deductions</Label>
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="otherDeductions"
                                type="number"
                                value={otherDeductions || ""}
                                onChange={(e) => handleNumberInput(e, setOtherDeductions)}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start mb-4">
                          <Info className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">New Tax Regime Deductions</h4>
                            <p className="text-sm text-muted-foreground">
                              Under the new tax regime, most deductions under Section 80C, 80D, etc. are not available. 
                              You get a simplified tax structure with lower tax rates instead.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="otherDeductions">Standard/Other Allowed Deductions</Label>
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="otherDeductions"
                              type="number"
                              value={otherDeductions || ""}
                              onChange={(e) => handleNumberInput(e, setOtherDeductions)}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="tax-paid">
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tdsOnSalary">TDS on Salary</Label>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="tdsOnSalary"
                            type="number"
                            value={tdsOnSalary || ""}
                            onChange={(e) => handleNumberInput(e, setTdsOnSalary)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="advanceTaxPaid">Advance Tax Paid</Label>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="advanceTaxPaid"
                            type="number"
                            value={advanceTaxPaid || ""}
                            onChange={(e) => handleNumberInput(e, setAdvanceTaxPaid)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="selfAssessmentTaxPaid">Self-Assessment Tax Paid</Label>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="selfAssessmentTaxPaid"
                          type="number"
                          value={selfAssessmentTaxPaid || ""}
                          onChange={(e) => handleNumberInput(e, setSelfAssessmentTaxPaid)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-5">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Tax Calculation Summary</CardTitle>
              <CardDescription>
                Based on your inputs for FY 2023-24 (AY 2024-25)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Income Summary</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Gross Total Income</TableCell>
                        <TableCell className="text-right">{formatCurrency(grossTotalIncome)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Deductions</TableCell>
                        <TableCell className="text-right">- {formatCurrency(totalDeductions)}</TableCell>
                      </TableRow>
                      <TableRow className="font-semibold">
                        <TableCell>Taxable Income</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxableIncome)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tax Liability</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Income Tax</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxLiability.basicTax)}</TableCell>
                      </TableRow>
                      {taxLiability.surcharge > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">Surcharge</TableCell>
                          <TableCell className="text-right">{formatCurrency(taxLiability.surcharge)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">Health & Education Cess</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxLiability.cess)}</TableCell>
                      </TableRow>
                      <TableRow className="font-semibold">
                        <TableCell>Total Tax Liability</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxLiability.totalTax)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tax Payment</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Tax Liability</TableCell>
                        <TableCell className="text-right">{formatCurrency(taxLiability.totalTax)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Tax Already Paid</TableCell>
                        <TableCell className="text-right">- {formatCurrency(taxAlreadyPaid)}</TableCell>
                      </TableRow>
                      <TableRow className="font-bold text-base">
                        <TableCell className={taxPayable > 0 ? "text-red-600" : "text-green-600"}>
                          {taxPayable > 0 ? "Tax Payable" : "Tax Refundable"}
                          <ChevronRight className="inline ml-1 h-4 w-4" />
                        </TableCell>
                        <TableCell className={`text-right ${taxPayable > 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatCurrency(Math.abs(taxPayable))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="help">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Need help with this calculator?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        This calculator helps you estimate your income tax liability for Financial Year 2023-24 
                        (Assessment Year 2024-25) under both New and Old tax regimes.
                      </p>
                      <p>
                        <strong>New Tax Regime:</strong> Offers lower tax rates but eliminates most deductions and exemptions.
                      </p>
                      <p>
                        <strong>Old Tax Regime:</strong> Has higher tax rates but allows various deductions under 
                        Sections 80C, 80D, HRA, etc.
                      </p>
                      <p className="text-xs italic mt-4">
                        Note: This calculator provides an estimation only. For precise tax calculation, 
                        please consult with a tax professional.
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

export default IncomeTaxCalculator;