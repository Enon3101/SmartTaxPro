import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, ArrowRightLeft, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

// Tax rates for Old Regime (AY 2024-25)
const oldRegimeTaxSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 }
];

// Tax rates for New Regime (AY 2024-25)
const newRegimeTaxSlabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 }
];

// Standard deduction amount (same for both regimes)
const STANDARD_DEDUCTION = 50000;

// Surcharge rates
const surchargeSlab = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 10 },
  { min: 10000000, max: 20000000, rate: 15 },
  { min: 20000000, max: 50000000, rate: 25 },
  { min: 50000000, max: Infinity, rate: 37 }
];

// Education cess rate
const EDUCATION_CESS = 4;

const TaxRegimeCalculator = () => {
  const [salaryIncome, setSalaryIncome] = useState<number>(1000000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [lta, setLta] = useState<number>(0);
  const [section80C, setSection80C] = useState<number>(0);
  const [section80D, setSection80D] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [housingLoanInterest, setHousingLoanInterest] = useState<number>(0);
  const [nps, setNps] = useState<number>(0);
  const [age, setAge] = useState<string>("below60");
  const [activeTab, setActiveTab] = useState<string>("input");
  
  // Helper function to calculate tax based on slabs
  const calculateTaxFromSlabs = (income: number, slabs: any[]) => {
    let tax = 0;
    for (const slab of slabs) {
      if (income > slab.min) {
        const taxableInThisSlab = Math.min(income - slab.min, slab.max - slab.min);
        tax += (taxableInThisSlab * slab.rate) / 100;
      }
    }
    return tax;
  };

  // Helper function to calculate surcharge
  const calculateSurcharge = (tax: number, totalIncome: number) => {
    let surchargeRate = 0;
    for (const slab of surchargeSlab) {
      if (totalIncome > slab.min && totalIncome <= slab.max) {
        surchargeRate = slab.rate;
        break;
      }
    }
    return (tax * surchargeRate) / 100;
  };

  // Helper function to calculate cess
  const calculateCess = (tax: number, surcharge: number) => {
    return ((tax + surcharge) * EDUCATION_CESS) / 100;
  };

  // Calculate tax under old regime
  const calculateOldRegimeTax = () => {
    // Adjust age-based exemption
    let basicExemptionLimit = 250000;
    if (age === "60to80") {
      basicExemptionLimit = 300000;
    } else if (age === "above80") {
      basicExemptionLimit = 500000;
    }
    
    // Calculate total income
    const grossTotalIncome = salaryIncome + otherIncome;
    
    // Calculate deductions
    const totalDeductions = Math.min(section80C, 150000) + section80D + otherDeductions + housingLoanInterest + Math.min(nps, 50000);
    
    // Exemptions specific to old regime
    const totalExemptions = hraExemption + lta + STANDARD_DEDUCTION;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, grossTotalIncome - totalExemptions - totalDeductions);
    
    // Apply age-based exemption limit
    const taxableIncomeAfterBasicExemption = Math.max(0, taxableIncome - basicExemptionLimit + 250000);
    
    // Calculate tax using slabs
    const tax = calculateTaxFromSlabs(taxableIncomeAfterBasicExemption, oldRegimeTaxSlabs);
    
    // Calculate surcharge
    const surcharge = calculateSurcharge(tax, taxableIncome);
    
    // Calculate cess
    const cess = calculateCess(tax, surcharge);
    
    // Calculate total tax
    const totalTax = tax + surcharge + cess;
    
    return {
      grossTotalIncome,
      totalExemptions,
      totalDeductions,
      taxableIncome,
      tax,
      surcharge,
      cess,
      totalTax
    };
  };

  // Calculate tax under new regime
  const calculateNewRegimeTax = () => {
    // Calculate total income
    const grossTotalIncome = salaryIncome + otherIncome;
    
    // Under new regime, only standard deduction is allowed
    const totalExemptions = STANDARD_DEDUCTION;
    
    // No additional deductions under new regime except specified ones
    const totalDeductions = 0;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, grossTotalIncome - totalExemptions - totalDeductions);
    
    // Calculate tax using slabs
    const tax = calculateTaxFromSlabs(taxableIncome, newRegimeTaxSlabs);
    
    // Calculate surcharge
    const surcharge = calculateSurcharge(tax, taxableIncome);
    
    // Calculate cess
    const cess = calculateCess(tax, surcharge);
    
    // Calculate total tax
    const totalTax = tax + surcharge + cess;
    
    return {
      grossTotalIncome,
      totalExemptions,
      totalDeductions,
      taxableIncome,
      tax,
      surcharge,
      cess,
      totalTax
    };
  };

  // Calculate both tax regimes
  const oldRegimeResult = calculateOldRegimeTax();
  const newRegimeResult = calculateNewRegimeTax();
  
  // Determine which regime is better
  const taxDifference = oldRegimeResult.totalTax - newRegimeResult.totalTax;
  const betterRegime = taxDifference > 0 ? "new" : "old";
  const savings = Math.abs(taxDifference);

  const handleSliderChange = (value: number[]) => {
    setSalaryIncome(value[0]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">New vs Old Tax Regime Calculator</h1>
        <p className="text-muted-foreground">
          Compare your tax liability under both tax regimes for FY 2023-24 (AY 2024-25)
        </p>
      </div>

      <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="input">Enter Details</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calculator className="mr-2 h-5 w-5" />
                Income Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salary-income">Salary Income</Label>
                <div className="flex flex-col space-y-4">
                  <Slider
                    id="salary-slider"
                    min={0}
                    max={5000000}
                    step={10000}
                    value={[salaryIncome]}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                  <Input
                    id="salary-income"
                    type="number"
                    value={salaryIncome}
                    onChange={(e) => setSalaryIncome(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="other-income">Other Income (Interest, Rent, etc.)</Label>
                <Input
                  id="other-income"
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Age Group</Label>
                <RadioGroup value={age} onValueChange={setAge} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="below60" id="below60" />
                    <Label htmlFor="below60">Below 60</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60to80" id="60to80" />
                    <Label htmlFor="60to80">60 to 80 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="above80" id="above80" />
                    <Label htmlFor="above80">Above 80 years</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <PiggyBank className="mr-2 h-5 w-5" />
                Exemptions & Deductions (For Old Regime)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hra-exemption">HRA Exemption</Label>
                <Input
                  id="hra-exemption"
                  type="number"
                  value={hraExemption}
                  onChange={(e) => setHraExemption(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lta">LTA Exemption</Label>
                <Input
                  id="lta"
                  type="number"
                  value={lta}
                  onChange={(e) => setLta(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section80c">
                  Section 80C (EPF, PPF, ELSS, etc.) - Max ₹1,50,000
                </Label>
                <Input
                  id="section80c"
                  type="number"
                  value={section80C}
                  onChange={(e) => setSection80C(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section80d">
                  Section 80D (Medical Insurance Premium)
                </Label>
                <Input
                  id="section80d"
                  type="number"
                  value={section80D}
                  onChange={(e) => setSection80D(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="housing-loan">Housing Loan Interest</Label>
                <Input
                  id="housing-loan"
                  type="number"
                  value={housingLoanInterest}
                  onChange={(e) => setHousingLoanInterest(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nps">NPS Contribution (Additional) - Max ₹50,000</Label>
                <Input
                  id="nps"
                  type="number"
                  value={nps}
                  onChange={(e) => setNps(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="other-deductions">Other Deductions (80G, 80TTA, etc.)</Label>
                <Input
                  id="other-deductions"
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg" onClick={() => setActiveTab("results")}>
              Calculate Tax
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card className="bg-muted/50 border-primary border shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Tax Saving Summary</h3>
                  <p className="text-lg">The {betterRegime === "new" ? "New" : "Old"} Tax Regime is better for you.</p>
                  <p className="text-2xl font-bold text-primary mt-2">You save {formatCurrency(savings)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-background rounded-full p-6 shadow-inner">
                    <ArrowRightLeft className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Old Tax Regime</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Gross Total Income</TableCell>
                      <TableCell className="text-right">{formatCurrency(oldRegimeResult.grossTotalIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Less: Exemptions</TableCell>
                      <TableCell className="text-right">- {formatCurrency(oldRegimeResult.totalExemptions)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Less: Deductions</TableCell>
                      <TableCell className="text-right">- {formatCurrency(oldRegimeResult.totalDeductions)}</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Net Taxable Income</TableCell>
                      <TableCell className="text-right">{formatCurrency(oldRegimeResult.taxableIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Separator className="my-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Income Tax</TableCell>
                      <TableCell className="text-right">{formatCurrency(oldRegimeResult.tax)}</TableCell>
                    </TableRow>
                    {oldRegimeResult.surcharge > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">Surcharge</TableCell>
                        <TableCell className="text-right">{formatCurrency(oldRegimeResult.surcharge)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-medium">Health & Education Cess (4%)</TableCell>
                      <TableCell className="text-right">{formatCurrency(oldRegimeResult.cess)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Tax Liability</TableCell>
                      <TableCell className="text-right text-lg">{formatCurrency(oldRegimeResult.totalTax)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New Tax Regime</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Gross Total Income</TableCell>
                      <TableCell className="text-right">{formatCurrency(newRegimeResult.grossTotalIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Less: Standard Deduction</TableCell>
                      <TableCell className="text-right">- {formatCurrency(newRegimeResult.totalExemptions)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Less: Deductions</TableCell>
                      <TableCell className="text-right">- {formatCurrency(newRegimeResult.totalDeductions)}</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Net Taxable Income</TableCell>
                      <TableCell className="text-right">{formatCurrency(newRegimeResult.taxableIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Separator className="my-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Income Tax</TableCell>
                      <TableCell className="text-right">{formatCurrency(newRegimeResult.tax)}</TableCell>
                    </TableRow>
                    {newRegimeResult.surcharge > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">Surcharge</TableCell>
                        <TableCell className="text-right">{formatCurrency(newRegimeResult.surcharge)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-medium">Health & Education Cess (4%)</TableCell>
                      <TableCell className="text-right">{formatCurrency(newRegimeResult.cess)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Tax Liability</TableCell>
                      <TableCell className="text-right text-lg">{formatCurrency(newRegimeResult.totalTax)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax Slab Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Old Regime Tax Slabs</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Range</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Up to ₹2,50,000</TableCell>
                        <TableCell className="text-right">Nil</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹2,50,001 to ₹5,00,000</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹5,00,001 to ₹10,00,000</TableCell>
                        <TableCell className="text-right">20%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Above ₹10,00,000</TableCell>
                        <TableCell className="text-right">30%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">New Regime Tax Slabs</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Range</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Up to ₹3,00,000</TableCell>
                        <TableCell className="text-right">Nil</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹3,00,001 to ₹6,00,000</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹6,00,001 to ₹9,00,000</TableCell>
                        <TableCell className="text-right">10%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹9,00,001 to ₹12,00,000</TableCell>
                        <TableCell className="text-right">15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>₹12,00,001 to ₹15,00,000</TableCell>
                        <TableCell className="text-right">20%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Above ₹15,00,000</TableCell>
                        <TableCell className="text-right">30%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("input")}>
              Edit Details
            </Button>
            <Button variant="default">
              Download Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxRegimeCalculator;