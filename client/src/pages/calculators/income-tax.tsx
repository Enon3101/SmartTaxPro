import {
  Calculator,
  ArrowRight,
  InfoIcon,
  HelpCircle,
  Percent,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowUpRightFromCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  getTaxSlabsByYear, 
  calculateTax, 
  type TaxSlab, 
  type TaxRegime 
} from '@/data/taxSlabs';
import { useToast } from '@/hooks/use-toast';
import { formatIndianCurrency } from '@/lib/formatters';

// Income Sources Type
type IncomeSource = {
  id: string;
  name: string;
  value: number;
  description?: string;
};

const IncomeTaxCalculator = () => {
  const { toast } = useToast();
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [regime, setRegime] = useState('new');
  const [personType, setPersonType] = useState('individual');
  const [ageGroup, setAgeGroup] = useState('below60');
  const [isResident, setIsResident] = useState(true);
  const [activeTab, setActiveTab] = useState('basic-details');
  
  // Income sources state
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: 'salary', name: 'Salary', value: 0 },
    { id: 'business', name: 'Business/Profession', value: 0 },
    { id: 'house_property', name: 'House Property', value: 0 },
    { id: 'capital_gains', name: 'Capital Gains', value: 0 },
    { id: 'other_sources', name: 'Other Sources', value: 0 }
  ]);
  
  // Deductions state
  const [deductions, setDeductions] = useState<IncomeSource[]>([
    { id: 'standard', name: 'Standard Deduction', value: 50000, description: 'Standard deduction on salary income (50,000 or salary, whichever is lower)' },
    { id: '80c', name: 'Section 80C', value: 0, description: 'Investments in PPF, ELSS, Life Insurance Premium, etc. (Max: ₹1.5 Lakh)' },
    { id: '80ccc', name: 'Section 80CCC', value: 0, description: 'Pension plans (Part of overall 80C limit)' },
    { id: '80ccd1', name: 'Section 80CCD(1)', value: 0, description: 'Employee contribution to NPS (Part of overall 80C limit)' },
    { id: '80ccd1b', name: 'Section 80CCD(1B)', value: 0, description: 'Additional NPS contribution (Max: ₹50,000)' },
    { id: '80ccd2', name: 'Section 80CCD(2)', value: 0, description: 'Employer contribution to NPS (Max: 10% of salary)' },
    { id: '80d', name: 'Section 80D', value: 0, description: 'Medical Insurance Premium (Self & Family: ₹25,000; Senior Citizens: ₹50,000)' },
    { id: '80dd', name: 'Section 80DD', value: 0, description: 'Maintenance of dependent with disability (₹75,000 or ₹1,25,000 for severe disability)' },
    { id: '80ddb', name: 'Section 80DDB', value: 0, description: 'Medical treatment for specified diseases (Max: ₹40,000; ₹1,00,000 for senior citizens)' },
    { id: '80e', name: 'Section 80E', value: 0, description: 'Interest on education loan (No maximum limit, for 8 years)' },
    { id: '80ee', name: 'Section 80EE', value: 0, description: 'Interest on home loan for first time home buyers (Max: ₹50,000)' },
    { id: '80eea', name: 'Section 80EEA', value: 0, description: 'Interest on loan for electric vehicle (Max: ₹1,50,000)' },
    { id: '80g', name: 'Section 80G', value: 0, description: 'Donations to charitable institutions (50-100% deduction, subject to qualifying limits)' },
    { id: '80gg', name: 'Section 80GG', value: 0, description: 'Rent paid when HRA is not received (Least of: ₹5,000/month, 25% of income, or excess rent over 10% of income)' },
    { id: '80tta', name: 'Section 80TTA', value: 0, description: 'Interest on savings account (Max: ₹10,000)' },
    { id: '80ttb', name: 'Section 80TTB', value: 0, description: 'Interest income for senior citizens (Max: ₹50,000)' },
    { id: '80u', name: 'Section 80U', value: 0, description: 'Self with disability (₹75,000 or ₹1,25,000 for severe disability)' },
    { id: 'hra', name: 'HRA Exemption', value: 0, description: 'House Rent Allowance exemption' },
    { id: 'lta', name: 'LTA Exemption', value: 0, description: 'Leave Travel Allowance exemption' }
  ]);
  
  // Tax calculation output state
  const [taxOutput, setTaxOutput] = useState<{
    totalIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    taxAmount: number;
    surchargeAmount: number;
    cessAmount: number;
    totalTaxPayable: number;
    effectiveTaxRate: number;
    slabwiseBreakup: Array<{slab: TaxSlab, tax: number}>;
  } | null>(null);
  
  // Get tax regime details
  const taxYearData = getTaxSlabsByYear(assessmentYear);
  const selectedRegimeData = taxYearData.regimes.find(r => 
    (regime === 'new' ? r.isDefault : !r.isDefault)) || taxYearData.regimes[0];

  // Calculate total income
  const totalIncome = incomeSources.reduce((acc, source) => acc + source.value, 0);
  
  // Calculate total deductions with proper rules
  const calculateTotalDeductions = () => {
    if (regime === 'new') {
      // New tax regime only allows standard deduction for salary income
      const standardDeduction = deductions.find(d => d.id === 'standard')?.value || 0;
      return standardDeduction;
    } else {
      // Old tax regime: need to apply section-specific logic
      
      // First, check for overall 80C + 80CCC + 80CCD(1) combined limit of 1.5 lakh
      const section80CValue = deductions.find(d => d.id === '80c')?.value || 0;
      const section80CCCValue = deductions.find(d => d.id === '80ccc')?.value || 0;
      const section80CCD1Value = deductions.find(d => d.id === '80ccd1')?.value || 0;
      
      // Combined limit of 1.5 lakh for 80C, 80CCC, 80CCD(1)
      const totalSection80CDeduction = Math.min(150000, section80CValue + section80CCCValue + section80CCD1Value);
      
      // Now calculate total deductions excluding these three sections
      const otherDeductions = deductions
        .filter(d => !['80c', '80ccc', '80ccd1'].includes(d.id))
        .reduce((acc, d) => acc + d.value, 0);
      
      return totalSection80CDeduction + otherDeductions;
    }
  };
  
  const totalDeductions = calculateTotalDeductions();
  
  // Calculate taxable income
  const calculateTaxableIncome = () => {
    const taxable = totalIncome;
    
    // Get standard deduction limit based on assessment year
    const standardDeductionLimit = assessmentYear === '2026-27' ? 75000 : 50000;
    
    // In new regime, only standard deduction is allowed for salary
    if (regime === 'new') {
      // Standard deduction is automatically applied to salary (limit or salary, whichever is lower)
      const salaryIncome = incomeSources.find(source => source.id === 'salary')?.value || 0;
      const standardDeduction = salaryIncome > 0 ? Math.min(standardDeductionLimit, salaryIncome) : 0;
      
      // Update the standard deduction field
      if (deductions.find(d => d.id === 'standard')?.value !== standardDeduction) {
        setDeductions(prev => 
          prev.map(d => d.id === 'standard' ? {
            ...d, 
            value: standardDeduction,
            description: `Standard deduction on salary income (${formatIndianCurrency(standardDeductionLimit)} or salary, whichever is lower)`
          } : d)
        );
      }
      
      return Math.max(0, taxable - standardDeduction);
    } else {
      // In old regime, all deductions are allowed including standard deduction
      // Apply standard deduction automatically (limit or salary, whichever is lower)
      const salaryIncome = incomeSources.find(source => source.id === 'salary')?.value || 0;
      const standardDeduction = salaryIncome > 0 ? Math.min(standardDeductionLimit, salaryIncome) : 0;
      
      // Update the standard deduction field
      if (deductions.find(d => d.id === 'standard')?.value !== standardDeduction) {
        setDeductions(prev => 
          prev.map(d => d.id === 'standard' ? {
            ...d, 
            value: standardDeduction,
            description: `Standard deduction on salary income (${formatIndianCurrency(standardDeductionLimit)} or salary, whichever is lower)`
          } : d)
        );
      }
      
      return Math.max(0, taxable - totalDeductions);
    }
  };
  
  const taxableIncome = calculateTaxableIncome();
  
  // Handle income source change
  const handleIncomeChange = (id: string, value: number) => {
    setIncomeSources(prev => 
      prev.map(source => source.id === id ? {...source, value} : source)
    );
    
    // Automatically adjust standard deduction when salary income changes
    if (id === 'salary') {
      // Standard deduction can't exceed salary and is capped at 50,000
      const standardDeductionValue = Math.min(value, 50000);
      handleDeductionChange('standard', standardDeductionValue);
    }
  };
  
  // Handle deduction change
  const handleDeductionChange = (id: string, value: number) => {
    // Apply caps based on specific section limits
    switch (id) {
      case '80c':
      case '80ccc':
      case '80ccd1':
        // Combined limit for 80C, 80CCC and 80CCD(1) is 1.5 lakh
        if (value > 150000) value = 150000;
        break;
      case '80ccd1b':
        // Additional NPS contribution limit is 50,000
        if (value > 50000) value = 50000;
        break;
      case '80d':
        // Health insurance premium limit
        const maxLimit = (personType === 'individual' && ageGroup !== 'below60') ? 100000 : 50000;
        if (value > maxLimit) value = maxLimit;
        break;
      case '80ddb':
        // Medical treatment limit based on age
        const ddbLimit = (personType === 'individual' && ageGroup !== 'below60') ? 100000 : 40000;
        if (value > ddbLimit) value = ddbLimit;
        break;
      case '80ee':
        // First time home buyer interest limit
        if (value > 50000) value = 50000;
        break;
      case '80eea':
        // Electric vehicle loan interest limit
        if (value > 150000) value = 150000;
        break;
      case '80tta':
        // Savings account interest limit for non-seniors
        if (value > 10000) value = 10000;
        break;
      case '80ttb':
        // Interest income limit for seniors
        if (value > 50000) value = 50000;
        break;
      case 'standard':
        // Standard deduction cap and validity check
        const salaryIncome = incomeSources.find(source => source.id === 'salary')?.value || 0;
        // Standard deduction can't exceed salary and is capped at 50,000
        if (value > salaryIncome) value = salaryIncome;
        if (value > 50000) value = 50000;
        break;
    }
    
    setDeductions(prev => 
      prev.map(deduction => deduction.id === id ? {...deduction, value} : deduction)
    );
  };

  // Calculate tax
  const calculateTaxOutput = () => {
    // Get age for age-based slabs
    const age = ageGroup === 'below60' ? 30 : (ageGroup === '60to80' ? 65 : 85);
    
    // Calculate tax using the utility function
    const taxCalculation = calculateTax(taxableIncome, selectedRegimeData, isResident, age);
    
    // Round tax to nearest 10 rupees as per Indian tax rules
    const roundTaxToNearest10 = (amount: number) => {
      return Math.round(amount / 10) * 10;
    };
    
    // Apply rounding to final tax amount
    const roundedTotalTax = roundTaxToNearest10(taxCalculation.totalTax);
    
    setTaxOutput({
      totalIncome,
      totalDeductions,
      taxableIncome,
      taxAmount: taxCalculation.taxAmount,
      surchargeAmount: taxCalculation.surchargeAmount,
      cessAmount: taxCalculation.cessAmount,
      totalTaxPayable: roundedTotalTax,
      effectiveTaxRate: (roundedTotalTax / totalIncome) * 100,
      slabwiseBreakup: taxCalculation.breakup
    });
    
    toast({
      title: 'Tax Calculation Complete',
      description: `Your total tax payable is ${formatIndianCurrency(roundedTotalTax)}`,
    });
  };

  // Reset calculation
  const resetCalculation = () => {
    setIncomeSources(prev => 
      prev.map(source => ({...source, value: 0}))
    );
    
    setDeductions(prev => 
      prev.map(deduction => deduction.id === 'standard' ? {...deduction, value: 50000} : {...deduction, value: 0})
    );
    
    setTaxOutput(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Income Tax Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your income tax liability for FY {assessmentYear.split('-')[0]}-{assessmentYear.split('-')[1]} based on the latest tax slabs
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input section - left column */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calculator className="mr-2 h-5 w-5" /> Tax Parameters
              </CardTitle>
              <CardDescription>
                Select your tax assessment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="deductions">Deductions</TabsTrigger>
                </TabsList>
                
                {/* Basic Details Tab */}
                <TabsContent value="basic-details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assessment-year">Assessment Year</Label>
                        <Select
                          value={assessmentYear}
                          onValueChange={setAssessmentYear}
                        >
                          <SelectTrigger id="assessment-year">
                            <SelectValue placeholder="Select Assessment Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2025-26">2025-26</SelectItem>
                            <SelectItem value="2026-27">2026-27</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tax-regime">Tax Regime</Label>
                        <Select
                          value={regime}
                          onValueChange={setRegime}
                        >
                          <SelectTrigger id="tax-regime">
                            <SelectValue placeholder="Select Tax Regime" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New Tax Regime</SelectItem>
                            <SelectItem value="old">Old Tax Regime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="person-type">Person Type</Label>
                        <Select
                          value={personType}
                          onValueChange={setPersonType}
                        >
                          <SelectTrigger id="person-type">
                            <SelectValue placeholder="Select Person Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="huf">HUF</SelectItem>
                            <SelectItem value="company">Domestic Company</SelectItem>
                            <SelectItem value="firm">Firm/LLP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {personType === 'individual' && (
                        <div className="space-y-2">
                          <Label htmlFor="age-group">Age Group</Label>
                          <Select
                            value={ageGroup}
                            onValueChange={setAgeGroup}
                          >
                            <SelectTrigger id="age-group">
                              <SelectValue placeholder="Select Age Group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below60">Below 60 years</SelectItem>
                              <SelectItem value="60to80">60 to 80 years</SelectItem>
                              <SelectItem value="above80">Above 80 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => setActiveTab('income')}
                        variant="outline"
                        className="w-full mt-2"
                      >
                        Continue to Income <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Income Tab */}
                <TabsContent value="income">
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Income Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter your income from various sources for the selected assessment year
                      </p>
                      
                      {incomeSources.map(source => (
                        <div key={source.id} className="mb-4 p-3 bg-background rounded-md border">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={source.id} className="font-medium">{source.name}</Label>
                            <span className="text-sm font-medium">
                              {formatIndianCurrency(source.value)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`${source.id}-input`}
                              type="number"
                              value={source.value || ''}
                              onChange={(e) => handleIncomeChange(source.id, Number(e.target.value) || 0)}
                              className="w-full"
                              min={0}
                              max={10000000}
                              step={1000}
                              placeholder={`Enter ${source.name}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Total Income</span>
                        <span className="font-bold">{formatIndianCurrency(totalIncome)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIncomeSources(prev => 
                            prev.map(source => ({...source, value: 0}))
                          );
                        }}
                      >
                        Reset Income
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('deductions')}
                        className="flex-1"
                      >
                        Continue to Deductions <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Deductions Tab */}
                <TabsContent value="deductions">
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Deductions & Exemptions</h3>
                        {regime === 'new' && (
                          <Badge variant="outline" className="font-normal text-xs">Limited in New Regime</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter applicable deductions under various sections
                      </p>
                      
                      <div className="space-y-4">
                        {deductions
                          .filter(deduction => 
                            regime === 'old' || deduction.id === 'standard'
                          )
                          .map(deduction => (
                            <div key={deduction.id} className="mb-4 p-3 bg-background rounded-md border">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                  <Label htmlFor={deduction.id} className="font-medium">{deduction.name}</Label>
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value || ''}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value) || 0)}
                                  className="w-full"
                                  min={0}
                                  placeholder={`Enter ${deduction.name}`}
                                />
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Total Income</span>
                        <span className="font-bold">{formatIndianCurrency(totalIncome)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Total Deductions</span>
                        <span className="font-medium">{formatIndianCurrency(totalDeductions)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Taxable Income</span>
                        <span className="font-bold">{formatIndianCurrency(taxableIncome)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => resetCalculation()}
                        className="flex-1"
                      >
                        Reset All
                      </Button>
                      <Button 
                        onClick={() => calculateTaxOutput()}
                        className="flex-1 bg-primary"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculate Tax
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Results section - right column */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Percent className="mr-2 h-5 w-5" /> Tax Computation
              </CardTitle>
              <CardDescription>
                Your estimated tax liability
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {taxOutput ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Assessment Year</span>
                      <span className="text-sm">{assessmentYear}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Tax Regime</span>
                      <Badge variant={regime === 'new' ? 'default' : 'outline'}>
                        {regime === 'new' ? 'New' : 'Old'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Person Type</span>
                      <span className="text-sm capitalize">{personType}</span>
                    </div>
                    {personType === 'individual' && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">Age Group</span>
                        <span className="text-sm">
                          {ageGroup === 'below60' ? 'Below 60 years' : 
                           ageGroup === '60to80' ? '60 to 80 years' : 'Above 80 years'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Income & Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Income</span>
                        <span className="font-medium">{formatIndianCurrency(taxOutput.totalIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Deductions</span>
                        <span className="font-medium">- {formatIndianCurrency(taxOutput.totalDeductions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Taxable Income</span>
                        <span className="font-bold">{formatIndianCurrency(taxOutput.taxableIncome)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Tax Calculation</h4>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">Slab-wise Tax</h5>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[70%]">Income Slab</TableHead>
                            <TableHead className="text-right w-[30%]">Tax</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taxOutput.slabwiseBreakup.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-sm">
                                {item.slab.incomeFrom === 0 ? 'Up to ' + formatIndianCurrency(item.slab.incomeTo || 0) : 
                                 item.slab.incomeTo === null ? 'Above ' + formatIndianCurrency(item.slab.incomeFrom) : 
                                 formatIndianCurrency(item.slab.incomeFrom) + ' to ' + formatIndianCurrency(item.slab.incomeTo || 0)}
                                <span className="ml-1 text-xs text-muted-foreground">
                                  @{item.slab.taxRate}%
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-medium w-[30%]">
                                {formatIndianCurrency(item.tax)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2">
                        <span className="text-sm col-span-9">Base Tax</span>
                        <span className="font-medium col-span-3 text-right">{formatIndianCurrency(taxOutput.taxAmount)}</span>
                      </div>
                      {taxOutput.surchargeAmount > 0 && (
                        <div className="grid grid-cols-12 gap-2">
                          <span className="text-sm col-span-9">Surcharge</span>
                          <span className="font-medium col-span-3 text-right">{formatIndianCurrency(taxOutput.surchargeAmount)}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-12 gap-2">
                        <span className="text-sm col-span-9">Health & Education Cess (4%)</span>
                        <span className="font-medium col-span-3 text-right">{formatIndianCurrency(taxOutput.cessAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total Tax</span>
                      <span className="text-xl font-bold">{formatIndianCurrency(taxOutput.totalTaxPayable)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
                      <span className="text-sm font-medium">{taxOutput.effectiveTaxRate.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => resetCalculation()}
                    >
                      Reset
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/start-filing">Start Filing <ArrowUpRightFromCircle className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Tax Computation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fill out the details in the form and click 'Calculate Tax' to see your tax estimate.
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('basic-details')}
                  >
                    Start Calculation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Additional tax info card */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tax Slabs for {assessmentYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge variant={regime === 'new' ? 'default' : 'outline'} className="mr-2">
                    {regime === 'new' ? 'New Regime' : 'Old Regime'}
                  </Badge>
                  {personType === 'individual' && (
                    <Badge variant="outline">
                      {ageGroup === 'below60' ? 'Below 60 years' : 
                       ageGroup === '60to80' ? '60 to 80 years' : 'Above 80 years'}
                    </Badge>
                  )}
                </div>
                
                <ScrollArea className="h-48 mt-2 rounded-md border p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Range</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRegimeData.slabs.map((slab, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            {slab.incomeFrom === 0 ? 'Up to ' + formatIndianCurrency(slab.incomeTo || 0) : 
                             slab.incomeTo === null ? 'Above ' + formatIndianCurrency(slab.incomeFrom) : 
                             formatIndianCurrency(slab.incomeFrom) + ' - ' + formatIndianCurrency(slab.incomeTo || 0)}
                          </TableCell>
                          <TableCell className="text-right">{slab.taxRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;
