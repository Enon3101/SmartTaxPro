import { motion } from 'framer-motion';
import { ArrowLeft, Info, Calculator, Download, Wallet } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatIndianCurrency } from '@/lib/formatters';

const TakeHomeSalaryCalculator = () => {
  // State for calculator inputs
  const [grossSalary, setGrossSalary] = useState<number>(1000000); // ₹10 Lakhs default
  const [taxRegime, setTaxRegime] = useState<'old' | 'new'>('new');
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [age, setAge] = useState<'below60' | '60to80' | 'above80'>('below60');
  const [cityType, setCityType] = useState<'metro' | 'non-metro'>('metro');
  
  // Deductions and allowances
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [lta, setLta] = useState<number>(0);
  const [specialAllowance, setSpecialAllowance] = useState<number>(0);
  
  // Other deductions
  const [epfContribution, setEpfContribution] = useState<number>(0);
  const [professionalTax, setProfessionalTax] = useState<number>(2400); // Default annual PT
  const [section80C, setSection80C] = useState<number>(0);
  const [section80D, setSection80D] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [rentPaid, setRentPaid] = useState<number>(0);
  
  // Calculated values
  const [standardDeduction, setStandardDeduction] = useState<number>(50000); // Fixed at ₹50,000
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [incomeTax, setIncomeTax] = useState<number>(0);
  const [cess, setCess] = useState<number>(0);
  const [surcharge, setSurcharge] = useState<number>(0);
  const [totalTaxLiability, setTotalTaxLiability] = useState<number>(0);
  const [takeHomeSalary, setTakeHomeSalary] = useState<number>(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0);
  
  // Metro cities for HRA
  const metroCities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];
  
  // Auto-calculate basic salary, HRA, and other components when gross salary changes
  useEffect(() => {
    // Common salary structure in India:
    // - Basic Salary: ~50% of Gross
    // - HRA: ~40-50% of Basic
    // - LTA: Small portion
    // - Special Allowance: Remainder
    const calculatedBasic = Math.round(grossSalary * 0.5);
    const calculatedHra = Math.round(calculatedBasic * 0.4);
    const calculatedLta = Math.round(grossSalary * 0.05);
    const calculatedSpecialAllowance = grossSalary - calculatedBasic - calculatedHra - calculatedLta;
    
    // Update state
    setBasicSalary(calculatedBasic);
    setHra(calculatedHra);
    setLta(calculatedLta);
    setSpecialAllowance(calculatedSpecialAllowance);
    
    // EPF contribution is typically 12% of basic salary
    setEpfContribution(Math.round(calculatedBasic * 0.12));
  }, [grossSalary]);
  
  // Calculate HRA exemption
  useEffect(() => {
    if (taxRegime === 'old') {
      // HRA exemption is the minimum of:
      // 1. Actual HRA received
      // 2. Rent paid minus 10% of basic salary
      // 3. 50% of basic salary for metro cities, 40% otherwise
      const cityMultiplier = cityType === 'metro' ? 0.5 : 0.4;
      const rentExcess = Math.max(0, rentPaid - (basicSalary * 0.1));
      const basicPercentage = basicSalary * cityMultiplier;
      
      // Calculate minimum of the three
      const calculatedHraExemption = Math.min(
        hra,
        rentExcess,
        basicPercentage
      );
      
      setHraExemption(Math.max(0, calculatedHraExemption));
    } else {
      // No HRA exemption in new tax regime
      setHraExemption(0);
    }
  }, [basicSalary, hra, rentPaid, cityType, taxRegime]);
  
  // Calculate taxable income
  useEffect(() => {
    if (taxRegime === 'old') {
      // Old regime allows deductions
      const deductions = 
        standardDeduction + 
        hraExemption + 
        section80C + 
        section80D + 
        otherDeductions;
      
      const calculated = Math.max(0, grossSalary - deductions - epfContribution - professionalTax);
      setTaxableIncome(calculated);
    } else {
      // New regime has no major deductions except standard deduction
      const calculated = Math.max(0, grossSalary - standardDeduction - epfContribution - professionalTax);
      setTaxableIncome(calculated);
    }
  }, [
    grossSalary, standardDeduction, hraExemption, section80C, section80D, 
    otherDeductions, taxRegime, epfContribution, professionalTax
  ]);
  
  // Calculate income tax based on tax slabs
  useEffect(() => {
    // Tax calculation function
    const calculateTax = () => {
      let tax = 0;
      const tempTaxableIncome = taxableIncome;
      
      if (taxRegime === 'new') {
        // New tax regime slabs for FY 2024-25 (AY 2025-26)
        if (tempTaxableIncome > 0) {
          // First ₹3 lakh - 0%
          if (tempTaxableIncome > 300000) {
            // Next ₹3 lakh - 5%
            tax += Math.min(tempTaxableIncome - 300000, 300000) * 0.05;
            if (tempTaxableIncome > 600000) {
              // Next ₹3 lakh - 10%
              tax += Math.min(tempTaxableIncome - 600000, 300000) * 0.1;
              if (tempTaxableIncome > 900000) {
                // Next ₹3 lakh - 15%
                tax += Math.min(tempTaxableIncome - 900000, 300000) * 0.15;
                if (tempTaxableIncome > 1200000) {
                  // Next ₹3 lakh - 20%
                  tax += Math.min(tempTaxableIncome - 1200000, 300000) * 0.2;
                  if (tempTaxableIncome > 1500000) {
                    // Above ₹15 lakh - 30%
                    tax += (tempTaxableIncome - 1500000) * 0.3;
                  }
                }
              }
            }
          }
        }
        
        // Rebate under section 87A - No tax up to ₹7 lakh taxable income in new regime
        if (tempTaxableIncome <= 700000) {
          tax = 0;
        }
      } else {
        // Old tax regime slabs for FY 2024-25 (AY 2025-26)
        const taxStartsFrom = age === 'below60' ? 250000 : age === '60to80' ? 300000 : 500000;
        
        if (tempTaxableIncome > taxStartsFrom) {
          // For individuals below 60
          if (age === 'below60') {
            // First ₹2.5 lakh - 0%
            // Next ₹2.5 lakh - 5%
            tax += Math.min(tempTaxableIncome - 250000, 250000) * 0.05;
            if (tempTaxableIncome > 500000) {
              // Next ₹5 lakh - 20%
              tax += Math.min(tempTaxableIncome - 500000, 500000) * 0.2;
              if (tempTaxableIncome > 1000000) {
                // Above ₹10 lakh - 30%
                tax += (tempTaxableIncome - 1000000) * 0.3;
              }
            }
          }
          
          // For senior citizens (60-80 years)
          else if (age === '60to80') {
            // First ₹3 lakh - 0%
            // Next ₹2 lakh - 5%
            tax += Math.min(tempTaxableIncome - 300000, 200000) * 0.05;
            if (tempTaxableIncome > 500000) {
              // Next ₹5 lakh - 20%
              tax += Math.min(tempTaxableIncome - 500000, 500000) * 0.2;
              if (tempTaxableIncome > 1000000) {
                // Above ₹10 lakh - 30%
                tax += (tempTaxableIncome - 1000000) * 0.3;
              }
            }
          }
          
          // For super senior citizens (above 80 years)
          else {
            // First ₹5 lakh - 0%
            if (tempTaxableIncome > 500000) {
              // Next ₹5 lakh - 20%
              tax += Math.min(tempTaxableIncome - 500000, 500000) * 0.2;
              if (tempTaxableIncome > 1000000) {
                // Above ₹10 lakh - 30%
                tax += (tempTaxableIncome - 1000000) * 0.3;
              }
            }
          }
        }
        
        // Rebate under section 87A - No tax up to ₹5 lakh taxable income in old regime
        if (tempTaxableIncome <= 500000) {
          tax = 0;
        }
      }
      
      return tax;
    };
    
    // Calculate tax
    const calculatedTax = calculateTax();
    setIncomeTax(calculatedTax);
    
    // Calculate surcharge for higher income (applies to both regimes)
    let calculatedSurcharge = 0;
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      calculatedSurcharge = calculatedTax * 0.1; // 10% surcharge
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      calculatedSurcharge = calculatedTax * 0.15; // 15% surcharge
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      calculatedSurcharge = calculatedTax * 0.25; // 25% surcharge
    } else if (taxableIncome > 50000000) {
      calculatedSurcharge = calculatedTax * 0.37; // 37% surcharge
    }
    setSurcharge(calculatedSurcharge);
    
    // Calculate 4% Health & Education Cess
    const calculatedCess = (calculatedTax + calculatedSurcharge) * 0.04;
    setCess(calculatedCess);
    
    // Total tax liability
    const totalTax = calculatedTax + calculatedSurcharge + calculatedCess;
    setTotalTaxLiability(totalTax);
    
    // Calculate effective tax rate
    const effectiveRate = (grossSalary > 0) ? (totalTax / grossSalary) * 100 : 0;
    setEffectiveTaxRate(effectiveRate);
    
    // Calculate take home salary
    const takeHome = grossSalary - totalTax - epfContribution - professionalTax;
    setTakeHomeSalary(takeHome);
  }, [taxableIncome, taxRegime, age]);
  
  // Format values for display
  const formatValue = (value: number) => {
    const monthlyValue = value / 12;
    return formatIndianCurrency(showMonthly ? monthlyValue : value);
  };
  
  // Helper function to calculate percentage
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
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
            <Wallet className="h-7 w-7 text-primary" />
            Take Home Salary Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your in-hand salary after tax and all deductions based on Indian income tax laws
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Salary Details</CardTitle>
              <CardDescription>Enter your salary information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="grossSalary">Gross Annual Salary</Label>
                  <span className="text-sm font-medium">{formatIndianCurrency(grossSalary)}</span>
                </div>
                <Slider
                  id="grossSalary"
                  min={100000}
                  max={10000000}
                  step={10000}
                  value={[grossSalary]}
                  onValueChange={(value) => setGrossSalary(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1 Lakh</span>
                  <span>₹1 Crore</span>
                </div>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                  <Input 
                    type="text" 
                    value={grossSalary} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value.replace(/,/g, ''));
                      if (!isNaN(value)) {
                        setGrossSalary(value);
                      }
                    }}
                    className="pl-7" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label>Tax Regime</Label>
                  <span className="text-xs text-muted-foreground">Choose your tax regime</span>
                </div>
                <Select value={taxRegime} onValueChange={(value: 'old' | 'new') => setTaxRegime(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Regime</SelectItem>
                    <SelectItem value="old">Old Regime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label>Age Group</Label>
                  <span className="text-xs text-muted-foreground">Affects tax slabs in old regime</span>
                </div>
                <Select value={age} onValueChange={(value: 'below60' | '60to80' | 'above80') => setAge(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below60">Below 60 years</SelectItem>
                    <SelectItem value="60to80">60 to 80 years</SelectItem>
                    <SelectItem value="above80">Above 80 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label>City Type</Label>
                  <span className="text-xs text-muted-foreground">Affects HRA exemption</span>
                </div>
                <Select value={cityType} onValueChange={(value: 'metro' | 'non-metro') => setCityType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select city type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro">Metro City</SelectItem>
                    <SelectItem value="non-metro">Non-Metro City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col gap-1">
                  <Label>Show Monthly Values</Label>
                  <span className="text-xs text-muted-foreground">Toggle between monthly and annual figures</span>
                </div>
                <Switch
                  checked={showMonthly}
                  onCheckedChange={setShowMonthly}
                />
              </div>
            </CardContent>
          </Card>
          
          {taxRegime === 'old' && (
            <Card>
              <CardHeader>
                <CardTitle>Deductions & Exemptions</CardTitle>
                <CardDescription>Available in old tax regime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rentPaid">Annual Rent Paid</Label>
                    <span className="text-sm font-medium">{formatIndianCurrency(rentPaid)}</span>
                  </div>
                  <Slider
                    id="rentPaid"
                    min={0}
                    max={1000000}
                    step={5000}
                    value={[rentPaid]}
                    onValueChange={(value) => setRentPaid(value[0])}
                    className="py-4"
                  />
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                    <Input 
                      type="text" 
                      value={rentPaid} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, ''));
                        if (!isNaN(value)) {
                          setRentPaid(value);
                        }
                      }}
                      className="pl-7" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="section80C">
                      Section 80C Investments
                      <span className="text-xs text-muted-foreground"> (Max ₹1.5L)</span>
                    </Label>
                    <span className="text-sm font-medium">{formatIndianCurrency(section80C)}</span>
                  </div>
                  <Slider
                    id="section80C"
                    min={0}
                    max={150000}
                    step={5000}
                    value={[section80C]}
                    onValueChange={(value) => setSection80C(value[0])}
                    className="py-4"
                  />
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                    <Input 
                      type="text" 
                      value={section80C} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, ''));
                        if (!isNaN(value)) {
                          setSection80C(Math.min(value, 150000));
                        }
                      }}
                      className="pl-7" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="section80D">
                      Section 80D Health Insurance
                      <span className="text-xs text-muted-foreground"> (Max ₹1L)</span>
                    </Label>
                    <span className="text-sm font-medium">{formatIndianCurrency(section80D)}</span>
                  </div>
                  <Slider
                    id="section80D"
                    min={0}
                    max={100000}
                    step={5000}
                    value={[section80D]}
                    onValueChange={(value) => setSection80D(value[0])}
                    className="py-4"
                  />
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                    <Input 
                      type="text" 
                      value={section80D} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, ''));
                        if (!isNaN(value)) {
                          setSection80D(Math.min(value, 100000));
                        }
                      }}
                      className="pl-7" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="otherDeductions">Other Deductions</Label>
                    <span className="text-sm font-medium">{formatIndianCurrency(otherDeductions)}</span>
                  </div>
                  <Slider
                    id="otherDeductions"
                    min={0}
                    max={200000}
                    step={5000}
                    value={[otherDeductions]}
                    onValueChange={(value) => setOtherDeductions(value[0])}
                    className="py-4"
                  />
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                    <Input 
                      type="text" 
                      value={otherDeductions} 
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/,/g, ''));
                        if (!isNaN(value)) {
                          setOtherDeductions(value);
                        }
                      }}
                      className="pl-7" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Take Home Salary</CardTitle>
                  <CardDescription>Your in-hand salary after all deductions</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {showMonthly ? 'Monthly' : 'Annual'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-6">
                {formatValue(takeHomeSalary)}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {showMonthly ? 'per month' : 'per year'}
                </span>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Gross Salary</p>
                    <p className="text-xl font-bold mt-1">{formatValue(grossSalary)}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Deductions</p>
                    <p className="text-xl font-bold mt-1">{formatValue(grossSalary - takeHomeSalary)}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
                    <p className="text-xl font-bold mt-1">{effectiveTaxRate.toFixed(2)}%</p>
                  </div>
                </div>
                
                <Tabs defaultValue="breakdown" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="breakdown">Salary Breakdown</TabsTrigger>
                    <TabsTrigger value="tax">Tax Calculation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="breakdown" className="space-y-4 pt-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Component</span>
                          <span className="font-medium">Amount</span>
                        </div>
                        <Separator />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Basic Salary</span>
                          <span className="font-medium">{formatValue(basicSalary)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>HRA</span>
                          <span className="font-medium">{formatValue(hra)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>LTA</span>
                          <span className="font-medium">{formatValue(lta)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Special Allowance</span>
                          <span className="font-medium">{formatValue(specialAllowance)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                          <span>Gross Salary</span>
                          <span className="text-green-600">{formatValue(grossSalary)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Deductions</div>
                        <div className="flex justify-between items-center">
                          <span>EPF (Employee Contribution)</span>
                          <span className="font-medium text-red-500">
                            - {formatValue(epfContribution)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Professional Tax</span>
                          <span className="font-medium text-red-500">
                            - {formatValue(professionalTax)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Income Tax + Cess + Surcharge</span>
                          <span className="font-medium text-red-500">
                            - {formatValue(totalTaxLiability)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                          <span>Take Home Salary</span>
                          <span className="text-primary text-lg">{formatValue(takeHomeSalary)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg mt-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Savings Note</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your monthly EPF contribution of {formatValue(epfContribution / 12)} is actually a form of saving. 
                            Your employer likely matches this with their own contribution, which isn't shown in the take-home calculation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tax" className="space-y-4 pt-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Component</span>
                          <span className="font-medium">Amount</span>
                        </div>
                        <Separator />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Gross Salary</span>
                          <span className="font-medium">{formatValue(grossSalary)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Standard Deduction</span>
                          <span className="font-medium text-green-600">
                            - {formatValue(standardDeduction)}
                          </span>
                        </div>
                        
                        {taxRegime === 'old' && (
                          <>
                            {hraExemption > 0 && (
                              <div className="flex justify-between items-center">
                                <span>HRA Exemption</span>
                                <span className="font-medium text-green-600">
                                  - {formatValue(hraExemption)}
                                </span>
                              </div>
                            )}
                            
                            {section80C > 0 && (
                              <div className="flex justify-between items-center">
                                <span>Section 80C Deduction</span>
                                <span className="font-medium text-green-600">
                                  - {formatValue(section80C)}
                                </span>
                              </div>
                            )}
                            
                            {section80D > 0 && (
                              <div className="flex justify-between items-center">
                                <span>Section 80D Deduction</span>
                                <span className="font-medium text-green-600">
                                  - {formatValue(section80D)}
                                </span>
                              </div>
                            )}
                            
                            {otherDeductions > 0 && (
                              <div className="flex justify-between items-center">
                                <span>Other Deductions</span>
                                <span className="font-medium text-green-600">
                                  - {formatValue(otherDeductions)}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span>EPF Contribution</span>
                          <span className="font-medium text-green-600">
                            - {formatValue(epfContribution)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span>Professional Tax</span>
                          <span className="font-medium text-green-600">
                            - {formatValue(professionalTax)}
                          </span>
                        </div>
                        
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                          <span>Total Taxable Income</span>
                          <span>{formatValue(taxableIncome)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Tax Calculation</div>
                        
                        <div className="flex justify-between items-center">
                          <span>Income Tax (As per slabs)</span>
                          <span className="font-medium">
                            {formatValue(incomeTax)}
                          </span>
                        </div>
                        
                        {surcharge > 0 && (
                          <div className="flex justify-between items-center">
                            <span>Surcharge</span>
                            <span className="font-medium">
                              {formatValue(surcharge)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span>Health & Education Cess (4%)</span>
                          <span className="font-medium">
                            {formatValue(cess)}
                          </span>
                        </div>
                        
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                          <span>Total Tax Liability</span>
                          <span className="text-red-500">{formatValue(totalTaxLiability)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Card className="mt-4 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tax Regime Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-3 rounded-md ${taxRegime === 'new' ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}>
                            <p className="text-sm font-medium">New Regime</p>
                            <p className="text-lg font-bold mt-1">{formatValue(
                              // Simplified calculation for display only
                              grossSalary - (taxRegime === 'new' ? totalTaxLiability : 
                                // Estimate for new regime
                                grossSalary * (grossSalary < 700000 ? 0 : 
                                  grossSalary < 1000000 ? 0.05 : 
                                    grossSalary < 1500000 ? 0.1 : 0.15)
                              ) - epfContribution - professionalTax
                            )}</p>
                            {taxRegime === 'new' && <Badge className="mt-2" variant="outline">Current Selection</Badge>}
                          </div>
                          
                          <div className={`p-3 rounded-md ${taxRegime === 'old' ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}>
                            <p className="text-sm font-medium">Old Regime</p>
                            <p className="text-lg font-bold mt-1">{formatValue(
                              // Simplified calculation for display only
                              grossSalary - (taxRegime === 'old' ? totalTaxLiability : 
                                // Estimate for old regime with standard exemptions
                                grossSalary * (grossSalary < 500000 ? 0 : 
                                  grossSalary < 1000000 ? 0.1 : 0.2)
                              ) - epfContribution - professionalTax
                            )}</p>
                            {taxRegime === 'old' && <Badge className="mt-2" variant="outline">Current Selection</Badge>}
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2 text-center">
                          For detailed regime comparison, use our <Link href="/calculators/tax-regime" className="text-primary underline">Tax Regime Comparison Calculator</Link>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="bg-muted p-4 rounded-lg mt-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Tax Details for {taxRegime === 'new' ? 'New' : 'Old'} Regime</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {taxRegime === 'new' ? 
                              'The new tax regime offers lower tax rates but without most exemptions and deductions. Standard deduction of ₹50,000 is still available.' : 
                              'The old tax regime has higher tax rates but allows various exemptions and deductions under sections 80C, 80D, HRA, etc.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <p>Calculated based on FY 2024-25 (AY 2025-26) tax rules</p>
              </div>
              
              <Button asChild variant="outline" size="sm">
                <Link href="/tax-resources/deductions">
                  <Info className="h-4 w-4 mr-1" />
                  Tax Deduction Guide
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Increase Your Take Home Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {taxRegime === 'old' ? (
                  <>
                    <div className="space-y-2">
                      <p className="font-medium">In the Old Tax Regime:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maximize your 80C investments (EPF, ELSS, LIC, etc.)</li>
                        <li>Claim HRA by submitting rent receipts</li>
                        <li>Claim health insurance premium under Section 80D</li>
                        <li>Claim education loan interest under Section 80E if applicable</li>
                        <li>Consider NPS contributions for additional tax benefits</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">Consider Switching to New Regime If:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>You don't claim many deductions or exemptions</li>
                        <li>Your taxable income is below ₹7 lakhs (full rebate)</li>
                        <li>You're early in your career with fewer tax-saving investments</li>
                        <li>You prefer simplified tax filing over complex deductions</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p className="font-medium">In the New Tax Regime:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>If your income is below ₹7 lakhs, you pay zero tax</li>
                        <li>Standard deduction of ₹50,000 is still available</li>
                        <li>Employer's NPS contribution still qualifies for tax benefits</li>
                        <li>Optimize your CTC structure to minimize taxable components</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">Consider Switching to Old Regime If:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>You have significant investments under Section 80C</li>
                        <li>You pay high rent and receive HRA</li>
                        <li>You have home loan interest deductions</li>
                        <li>Your total deductions exceed ₹2.5 lakhs annually</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TakeHomeSalaryCalculator;
