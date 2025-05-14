import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
import { 
  getTaxSlabsByYear, 
  calculateTax, 
  type TaxSlab, 
  type TaxRegime 
} from '@/data/taxSlabs';
import { useToast } from '@/hooks/use-toast';
import { formatIndianCurrency } from '@/lib/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    let taxable = totalIncome;
    
    // In new regime, only standard deduction is allowed for salary
    if (regime === 'new') {
      const standardDeduction = deductions.find(d => d.id === 'standard')?.value || 0;
      return Math.max(0, taxable - standardDeduction);
    } else {
      // In old regime, all deductions are allowed
      return Math.max(0, taxable - totalDeductions);
    }
  };
  
  const taxableIncome = calculateTaxableIncome();
  
  // Handle income source change
  const handleIncomeChange = (id: string, value: number) => {
    setIncomeSources(prev => 
      prev.map(source => source.id === id ? {...source, value} : source)
    );
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
    
    // Generate detailed breakdown of all deductions
    const generateDeductionBreakdown = () => {
      if (regime === 'new') {
        return [
          { section: 'Standard Deduction', amount: deductions.find(d => d.id === 'standard')?.value || 0 }
        ];
      } else {
        return deductions
          .filter(d => d.value > 0)
          .map(d => ({ section: d.name, amount: d.value }));
      }
    };
    
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
              <Tabs defaultValue="basic-details" className="w-full">
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
                            disabled={regime === 'new'}
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
                          {regime === 'new' && (
                            <p className="text-sm text-muted-foreground">Age is not relevant in the new tax regime</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => setTaxOutput(null)}
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
                    <div className="bg-muted p-3 rounded-md">
                      <h3 className="font-medium mb-2">Add Your Income Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter the income from various sources during the financial year
                      </p>
                    </div>
                    
                    {incomeSources.map((source) => (
                      <div key={source.id} className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={source.id} className="flex items-center">
                            {source.name}
                            {source.description && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{source.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </Label>
                          <span className="text-sm font-medium">
                            {formatIndianCurrency(source.value)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Slider
                            id={source.id}
                            value={[source.value]}
                            max={3000000}
                            step={1000}
                            onValueChange={(values) => handleIncomeChange(source.id, values[0])}
                            className="flex-1"
                          />
                          <Input
                            id={`${source.id}-input`}
                            type="number"
                            value={source.value}
                            onChange={(e) => handleIncomeChange(source.id, Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <h3 className="font-medium">Total Income</h3>
                        <p className="text-sm text-muted-foreground">Sum of all income sources</p>
                      </div>
                      <span className="text-xl font-bold">
                        {formatIndianCurrency(totalIncome)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between gap-2">
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
                        onClick={() => setTaxOutput(null)}
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
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Deductions & Exemptions</h3>
                        <Badge variant={regime === 'old' ? 'default' : 'destructive'}>
                          {regime === 'old' ? 'Allowed' : 'Limited'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {regime === 'old' 
                          ? 'The old tax regime allows various deductions to reduce your taxable income.' 
                          : 'The new tax regime offers lower tax rates but limited deductions.'}
                      </p>
                    </div>
                    
                    {regime === 'new' && (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Limited Deductions in New Regime</h4>
                            <p className="text-sm text-yellow-700">
                              In the new tax regime, most deductions are not allowed except for the standard deduction on salary income.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Categorize deductions for better organization */}
                    <div className="space-y-6">
                      {/* Common Deductions - Show first */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-blue-600">Common Deductions</h4>
                        {deductions
                          .filter(d => ['standard', '80c', '80d', '80tta'].includes(d.id))
                          .map((deduction) => (
                            <div key={deduction.id} className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <Label 
                                  htmlFor={deduction.id} 
                                  className={`flex items-center ${(regime === 'new' && deduction.id !== 'standard') ? 'text-muted-foreground' : ''}`}
                                >
                                  {deduction.name}
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </Label>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Slider
                                  id={deduction.id}
                                  value={[deduction.value]}
                                  max={
                                    deduction.id === '80c' ? 150000 : 
                                    deduction.id === '80d' ? (personType === 'individual' && ageGroup !== 'below60' ? 100000 : 50000) : 
                                    deduction.id === '80tta' ? 10000 : 
                                    deduction.id === 'standard' ? 50000 : 
                                    500000
                                  }
                                  step={100}
                                  onValueChange={(values) => handleDeductionChange(deduction.id, values[0])}
                                  className="flex-1"
                                  disabled={regime === 'new' && deduction.id !== 'standard'}
                                />
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value))}
                                  className="w-24"
                                  disabled={regime === 'new' && deduction.id !== 'standard'}
                                />
                              </div>
                              {/* Show limits reached messages */}
                              {deduction.id === '80c' && deduction.value === 150000 && (
                                <p className="text-sm text-amber-600">Maximum limit of ₹1.5 lakh reached</p>
                              )}
                              {deduction.id === '80d' && personType === 'individual' && ageGroup !== 'below60' && deduction.value === 100000 && (
                                <p className="text-sm text-amber-600">Maximum limit of ₹1 lakh reached</p>
                              )}
                              {deduction.id === '80d' && (personType !== 'individual' || ageGroup === 'below60') && deduction.value === 50000 && (
                                <p className="text-sm text-amber-600">Maximum limit of ₹50,000 reached</p>
                              )}
                              {deduction.id === '80tta' && deduction.value === 10000 && (
                                <p className="text-sm text-amber-600">Maximum limit of ₹10,000 reached</p>
                              )}
                            </div>
                          ))}
                      </div>
                      
                      {/* Retirement and Pension - Second category */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-blue-600">Retirement & Pension</h4>
                        {deductions
                          .filter(d => ['80ccc', '80ccd1', '80ccd1b', '80ccd2'].includes(d.id))
                          .map((deduction) => (
                            <div key={deduction.id} className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <Label 
                                  htmlFor={deduction.id} 
                                  className={`flex items-center ${regime === 'new' ? 'text-muted-foreground' : ''}`}
                                >
                                  {deduction.name}
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </Label>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Slider
                                  id={deduction.id}
                                  value={[deduction.value]}
                                  max={
                                    deduction.id === '80ccd1b' ? 50000 : 
                                    (deduction.id === '80ccc' || deduction.id === '80ccd1') ? 150000 :
                                    200000
                                  }
                                  step={100}
                                  onValueChange={(values) => handleDeductionChange(deduction.id, values[0])}
                                  className="flex-1"
                                  disabled={regime === 'new'}
                                />
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value))}
                                  className="w-24"
                                  disabled={regime === 'new'}
                                />
                              </div>
                              {/* Additional info for specific deduction limits */}
                              {deduction.id === '80ccd1b' && deduction.value === 50000 && (
                                <p className="text-sm text-amber-600">Maximum limit of ₹50,000 reached</p>
                              )}
                            </div>
                          ))}
                      </div>
                      
                      {/* Medical and Health - Third category */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-blue-600">Medical & Health</h4>
                        {deductions
                          .filter(d => ['80dd', '80ddb', '80u'].includes(d.id))
                          .map((deduction) => (
                            <div key={deduction.id} className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <Label 
                                  htmlFor={deduction.id} 
                                  className={`flex items-center ${regime === 'new' ? 'text-muted-foreground' : ''}`}
                                >
                                  {deduction.name}
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </Label>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Slider
                                  id={deduction.id}
                                  value={[deduction.value]}
                                  max={
                                    deduction.id === '80ddb' ? 
                                      (personType === 'individual' && ageGroup !== 'below60' ? 100000 : 40000) : 
                                    125000
                                  }
                                  step={1000}
                                  onValueChange={(values) => handleDeductionChange(deduction.id, values[0])}
                                  className="flex-1"
                                  disabled={regime === 'new'}
                                />
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value))}
                                  className="w-24"
                                  disabled={regime === 'new'}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {/* Loans and Interest - Fourth category */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-blue-600">Loans & Interest</h4>
                        {deductions
                          .filter(d => ['80e', '80ee', '80eea'].includes(d.id))
                          .map((deduction) => (
                            <div key={deduction.id} className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <Label 
                                  htmlFor={deduction.id} 
                                  className={`flex items-center ${regime === 'new' ? 'text-muted-foreground' : ''}`}
                                >
                                  {deduction.name}
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </Label>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Slider
                                  id={deduction.id}
                                  value={[deduction.value]}
                                  max={
                                    deduction.id === '80ee' ? 50000 : 
                                    deduction.id === '80eea' ? 150000 : 
                                    300000
                                  }
                                  step={1000}
                                  onValueChange={(values) => handleDeductionChange(deduction.id, values[0])}
                                  className="flex-1"
                                  disabled={regime === 'new'}
                                />
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value))}
                                  className="w-24"
                                  disabled={regime === 'new'}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {/* Other Deductions - Fifth category */}
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-blue-600">Other Deductions</h4>
                        {deductions
                          .filter(d => ['80g', '80gg', '80ttb', 'hra', 'lta'].includes(d.id))
                          .map((deduction) => (
                            <div key={deduction.id} className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <Label 
                                  htmlFor={deduction.id} 
                                  className={`flex items-center ${regime === 'new' ? 'text-muted-foreground' : ''}`}
                                >
                                  {deduction.name}
                                  {deduction.description && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{deduction.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </Label>
                                <span className="text-sm font-medium">
                                  {formatIndianCurrency(deduction.value)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Slider
                                  id={deduction.id}
                                  value={[deduction.value]}
                                  max={
                                    deduction.id === '80ttb' ? 50000 : 
                                    deduction.id === '80gg' ? 60000 : 
                                    500000
                                  }
                                  step={1000}
                                  onValueChange={(values) => handleDeductionChange(deduction.id, values[0])}
                                  className="flex-1"
                                  disabled={regime === 'new'}
                                />
                                <Input
                                  id={`${deduction.id}-input`}
                                  type="number"
                                  value={deduction.value}
                                  onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value))}
                                  className="w-24"
                                  disabled={regime === 'new'}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <h3 className="font-medium">Total Deductions</h3>
                        <p className="text-sm text-muted-foreground">Sum of all applicable deductions</p>
                      </div>
                      <span className="text-xl font-bold">
                        {formatIndianCurrency(regime === 'old' ? totalDeductions : (personType === 'individual' ? 50000 : 0))}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={calculateTaxOutput}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Calculate Tax <Calculator className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={resetCalculation}
                      >
                        Reset All Fields
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
                <Percent className="mr-2 h-5 w-5" /> Tax Calculation
              </CardTitle>
              <CardDescription>
                Your income tax summary for Assessment Year {assessmentYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!taxOutput ? (
                <div className="text-center py-8">
                  <div className="bg-muted inline-flex p-4 rounded-full mb-3">
                    <Calculator className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Calculation Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    Fill in your income and deduction details, then click 'Calculate Tax' to see your tax liability
                  </p>
                  <div className="flex flex-col gap-2 items-center">
                    <Badge variant="outline" className="mb-2">
                      {selectedRegimeData.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegimeData.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Official Tax Computation Format */}
                  <div className="border p-4 rounded-lg font-mono text-sm">
                    <div className="text-center font-semibold mb-4 border-b pb-2">
                      COMPUTATION OF TOTAL INCOME
                    </div>
                    
                    {/* Income from Salary */}
                    {incomeSources.find(src => src.id === 'salary' && src.value > 0) && (
                      <div className="mb-4">
                        <div className="flex justify-between font-semibold">
                          <span>Salaries</span>
                          <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'salary')?.value || 0)}</span>
                        </div>
                        <div className="pl-4 mt-2">
                          <div className="flex justify-between">
                            <span>Salary</span>
                            <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'salary')?.value || 0)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Less: Standard Deduction U/s 16(ia)</span>
                            <span>{formatIndianCurrency(deductions.find(d => d.id === 'standard')?.value || 0)}</span>
                          </div>
                          {deductions.find(d => d.id === 'hra')?.value > 0 && (
                            <div className="flex justify-between text-gray-600">
                              <span>Less: HRA Exemption U/s 10(13A)</span>
                              <span>{formatIndianCurrency(deductions.find(d => d.id === 'hra')?.value || 0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Income from House Property */}
                    {incomeSources.find(src => src.id === 'house_property' && src.value > 0) && (
                      <div className="mb-4">
                        <div className="flex justify-between font-semibold">
                          <span>Income From House Property</span>
                          <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'house_property')?.value || 0)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Income from Business */}
                    {incomeSources.find(src => src.id === 'business' && src.value > 0) && (
                      <div className="mb-4">
                        <div className="flex justify-between font-semibold">
                          <span>Profits And Gains From Business And Profession</span>
                          <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'business')?.value || 0)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Income from Capital Gains */}
                    {incomeSources.find(src => src.id === 'capital_gains' && src.value > 0) && (
                      <div className="mb-4">
                        <div className="flex justify-between font-semibold">
                          <span>Capital Gains</span>
                          <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'capital_gains')?.value || 0)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Income from Other Sources */}
                    {incomeSources.find(src => src.id === 'other_sources' && src.value > 0) && (
                      <div className="mb-4">
                        <div className="flex justify-between font-semibold">
                          <span>Income From Other Sources</span>
                          <span>{formatIndianCurrency(incomeSources.find(src => src.id === 'other_sources')?.value || 0)}</span>
                        </div>
                        {/* Add 80TTA deduction specifically for savings account interest */}
                        {deductions.find(d => d.id === '80tta')?.value > 0 && (
                          <div className="pl-4 mt-1">
                            <div className="flex justify-between text-gray-600">
                              <span>Interest from Savings Account</span>
                              <span>{formatIndianCurrency(Math.min(deductions.find(d => d.id === '80tta')?.value || 0, 10000))}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Gross Total Income */}
                    <div className="flex justify-between font-semibold mt-4 border-t pt-2">
                      <span>Gross Total Income</span>
                      <span>{formatIndianCurrency(taxOutput.totalIncome)}</span>
                    </div>
                    
                    {/* Deductions */}
                    {regime === 'old' && taxOutput.totalDeductions > 0 && (
                      <div className="mt-4">
                        <div className="font-semibold">Less Deductions Under Chapter-VIA</div>
                        <div className="pl-4 mt-2">
                          {/* Show active deductions */}
                          {deductions.filter(d => d.value > 0 && !['standard', 'hra', 'lta'].includes(d.id)).map((deduction) => (
                            <div key={deduction.id} className="flex justify-between">
                              <span>{deduction.name}</span>
                              <span>{formatIndianCurrency(deduction.value)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t mt-2 pt-1">
                            <span>Total Deductions</span>
                            <span>{formatIndianCurrency(taxOutput.totalDeductions)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Total Income */}
                    <div className="flex justify-between font-semibold mt-4 border-t pt-2">
                      <span>Total Income</span>
                      <span>{formatIndianCurrency(taxOutput.taxableIncome)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Total Income Rounded Off U/s 288A</span>
                      <span>{formatIndianCurrency(Math.round(taxOutput.taxableIncome / 10) * 10)}</span>
                    </div>
                    
                    {/* Tax Computation Section */}
                    <div className="text-center font-semibold mt-6 mb-4 border-t border-b py-2">
                      COMPUTATION OF TAX ON TOTAL INCOME
                    </div>
                    
                    {/* Show slabwise tax breakdown */}
                    {taxOutput.slabwiseBreakup.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.slab.incomeFrom === 0 
                            ? (item.slab.taxRate === 0 ? `Tax On Rs. ${item.slab.incomeTo?.toLocaleString('en-IN')}` : `Tax On Rs. ${Math.min(taxOutput.taxableIncome, (item.slab.incomeTo || 0)).toLocaleString('en-IN')}`)
                            : `Tax On Rs. ${(Math.min(taxOutput.taxableIncome, (item.slab.incomeTo || taxOutput.taxableIncome)) - item.slab.incomeFrom).toLocaleString('en-IN')} (${Math.min(taxOutput.taxableIncome, (item.slab.incomeTo || taxOutput.taxableIncome)).toLocaleString('en-IN')}-${item.slab.incomeFrom.toLocaleString('en-IN')}) @ ${item.slab.taxRate}%`
                          }
                        </span>
                        <span>
                          {item.slab.taxRate === 0 
                            ? 'Nil' 
                            : formatIndianCurrency(item.tax)
                          }
                        </span>
                      </div>
                    ))}
                    
                    {/* Tax Amount */}
                    <div className="flex justify-between font-semibold mt-2 pt-1">
                      <span>Tax On Rs. {taxOutput.taxableIncome.toLocaleString('en-IN')}</span>
                      <span>{formatIndianCurrency(taxOutput.taxAmount)}</span>
                    </div>
                    
                    {/* Surcharge if applicable */}
                    {taxOutput.surchargeAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Add: Surcharge</span>
                        <span>{formatIndianCurrency(taxOutput.surchargeAmount)}</span>
                      </div>
                    )}
                    
                    {/* Cess */}
                    <div className="flex justify-between">
                      <span>Add: Health & Education Cess @ 4%</span>
                      <span>{formatIndianCurrency(taxOutput.cessAmount)}</span>
                    </div>
                    
                    {/* Total Tax Liability */}
                    <div className="flex justify-between font-semibold mt-2 pt-1 border-t">
                      <span>Total Tax Liability</span>
                      <span>{formatIndianCurrency(taxOutput.totalTaxPayable)}</span>
                    </div>
                    
                    {/* Rounded Tax U/s 288B */}
                    <div className="flex justify-between font-semibold mt-4 mb-4">
                      <span>Tax Rounded Off U/s 288B</span>
                      <span>{formatIndianCurrency(taxOutput.totalTaxPayable)}</span>
                    </div>
                  </div>
                  
                  {/* Tax Summary Card */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Tax Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Income</span>
                        <span className="font-medium">{formatIndianCurrency(taxOutput.totalIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Taxable Income</span>
                        <span className="font-medium">{formatIndianCurrency(taxOutput.taxableIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tax</span>
                        <span className="font-medium">{formatIndianCurrency(taxOutput.totalTaxPayable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Effective Tax Rate</span>
                        <span className="font-medium">{taxOutput.effectiveTaxRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      onClick={calculateTaxOutput}
                      className="w-full"
                    >
                      Recalculate
                    </Button>
                    
                    <Link href="/itr-wizard" className="w-full">
                      <Button 
                        variant="default" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Start Filing ITR <ArrowUpRightFromCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;