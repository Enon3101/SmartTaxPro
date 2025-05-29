import { motion } from 'framer-motion';
import {
  Calculator,
  ArrowLeft,
  InfoIcon,
  Percent,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Equal
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
import { 
  getTaxSlabsByYear, 
  calculateTax, 
  type TaxSlab, 
  type TaxRegime 
} from '@/data/taxSlabs';
import { formatIndianCurrency } from '@/lib/formatters';

type IncomeSource = {
  id: string;
  name: string;
  value: number;
  description?: string;
};

type TaxComparison = {
  regime: string;
  totalTax: number;
  effectiveRate: number;
  savings?: number;
};

const EnhancedIncomeTaxCalculator = () => {
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [personType, setPersonType] = useState('individual');
  const [ageGroup, setAgeGroup] = useState('below60');
  const [isResident, setIsResident] = useState(true);
  
  // Income sources state
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: 'salary', name: 'Salary Income', value: 1200000 },
    { id: 'business', name: 'Business/Profession', value: 0 },
    { id: 'house_property', name: 'House Property', value: 0 },
    { id: 'capital_gains', name: 'Capital Gains', value: 0 },
    { id: 'other_sources', name: 'Other Sources', value: 0 }
  ]);
  
  // Deductions state (for old regime)
  const [deductions, setDeductions] = useState<IncomeSource[]>([
    { id: '80c', name: 'Section 80C', value: 150000, description: 'PPF, ELSS, Life Insurance (Max: ₹1.5L)' },
    { id: '80d', name: 'Section 80D', value: 25000, description: 'Health Insurance Premium' },
    { id: '80ccd1b', name: 'Section 80CCD(1B)', value: 50000, description: 'Additional NPS (Max: ₹50K)' },
    { id: 'hra', name: 'HRA Exemption', value: 200000, description: 'House Rent Allowance' },
    { id: 'other', name: 'Other Deductions', value: 0, description: 'Other eligible deductions' }
  ]);
  
  // Tax calculations for both regimes
  const [taxComparisons, setTaxComparisons] = useState<TaxComparison[]>([]);
  const [bestRegime, setBestRegime] = useState<string>('');
  
  // Calculate total income
  const totalIncome = incomeSources.reduce((acc, source) => acc + source.value, 0);
  
  // Calculate total deductions
  const totalDeductions = deductions.reduce((acc, deduction) => acc + deduction.value, 0);
  
  // Get tax regime details
  const taxYearData = getTaxSlabsByYear(assessmentYear);
  
  // Calculate tax for both regimes
  useEffect(() => {
    if (totalIncome > 0) {
      const age = ageGroup === 'below60' ? 30 : (ageGroup === '60to80' ? 65 : 85);
      const comparisons: TaxComparison[] = [];
      
      // Calculate for each regime
      taxYearData.regimes.forEach(regime => {
        let taxableIncome = totalIncome;
        
        // Apply standard deduction
        const standardDeductionLimit = assessmentYear === '2026-27' ? 75000 : 50000;
        const salaryIncome = incomeSources.find(s => s.id === 'salary')?.value || 0;
        const standardDeduction = salaryIncome > 0 ? Math.min(standardDeductionLimit, salaryIncome) : 0;
        
        if (regime.name === 'New Tax Regime') {
          // Only standard deduction allowed
          taxableIncome = Math.max(0, totalIncome - standardDeduction);
        } else {
          // All deductions allowed including standard deduction
          taxableIncome = Math.max(0, totalIncome - totalDeductions - standardDeduction);
        }
        
        const taxCalculation = calculateTax(taxableIncome, regime, isResident, age);
        
        comparisons.push({
          regime: regime.name,
          totalTax: Math.round(taxCalculation.totalTax / 10) * 10, // Round to nearest 10
          effectiveRate: (taxCalculation.totalTax / totalIncome) * 100
        });
      });
      
      // Calculate savings and determine best regime
      const newRegimeTax = comparisons.find(c => c.regime === 'New Tax Regime')?.totalTax || 0;
      const oldRegimeTax = comparisons.find(c => c.regime === 'Old Tax Regime')?.totalTax || 0;
      
      comparisons.forEach(comparison => {
        if (comparison.regime === 'New Tax Regime') {
          comparison.savings = oldRegimeTax - newRegimeTax;
        } else {
          comparison.savings = newRegimeTax - oldRegimeTax;
        }
      });
      
      setBestRegime(newRegimeTax <= oldRegimeTax ? 'New Tax Regime' : 'Old Tax Regime');
      setTaxComparisons(comparisons);
    }
  }, [totalIncome, totalDeductions, assessmentYear, ageGroup, isResident, incomeSources]);
  
  // Handle income source change
  const handleIncomeChange = (id: string, value: number) => {
    setIncomeSources(prev => 
      prev.map(source => source.id === id ? {...source, value} : source)
    );
  };
  
  // Handle deduction change
  const handleDeductionChange = (id: string, value: number) => {
    setDeductions(prev => 
      prev.map(deduction => deduction.id === id ? {...deduction, value} : deduction)
    );
  };
  
  const getSavingsIcon = (savings: number) => {
    if (savings > 0) return <TrendingDown className="h-4 w-4 text-green-600" />;
    if (savings < 0) return <TrendingUp className="h-4 w-4 text-red-600" />;
    return <Equal className="h-4 w-4 text-gray-600" />;
  };
  
  const getSavingsColor = (savings: number) => {
    if (savings > 0) return 'text-green-600';
    if (savings < 0) return 'text-red-600';
    return 'text-gray-600';
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
            <Calculator className="h-7 w-7 text-primary" />
            Enhanced Income Tax Calculator
          </h1>
          <p className="text-muted-foreground">
            Compare Old vs New Tax Regime and find the best option for your income
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <InfoIcon className="mr-2 h-5 w-5 text-primary" />
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assessment-year">Assessment Year</Label>
                <Select value={assessmentYear} onValueChange={setAssessmentYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25 (FY 2023-24)</SelectItem>
                    <SelectItem value="2025-26">2025-26 (FY 2024-25)</SelectItem>
                    <SelectItem value="2026-27">2026-27 (FY 2025-26)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below60">Below 60 years</SelectItem>
                    <SelectItem value="60to80">60-80 years (Senior Citizen)</SelectItem>
                    <SelectItem value="above80">Above 80 years (Super Senior)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Enter your annual income from various sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomeSources.map((source) => (
                <div key={source.id} className="space-y-2">
                  <Label htmlFor={source.id}>{source.name}</Label>
                  <Input
                    id={source.id}
                    type="number"
                    value={source.value}
                    onChange={(e) => handleIncomeChange(source.id, Number(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Income:</span>
                  <span className="text-primary">{formatIndianCurrency(totalIncome)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Deductions (for Old Regime) */}
          <Card>
            <CardHeader>
              <CardTitle>Deductions (Old Regime Only)</CardTitle>
              <CardDescription>These deductions are only applicable in the old tax regime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deductions.map((deduction) => (
                <div key={deduction.id} className="space-y-2">
                  <Label htmlFor={deduction.id} className="text-sm">
                    {deduction.name}
                    {deduction.description && (
                      <span className="text-xs text-muted-foreground block">
                        {deduction.description}
                      </span>
                    )}
                  </Label>
                  <Input
                    id={deduction.id}
                    type="number"
                    value={deduction.value}
                    onChange={(e) => handleDeductionChange(deduction.id, Number(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Deductions:</span>
                  <span className="text-primary">{formatIndianCurrency(totalDeductions)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Tax Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Tax Regime Comparison
                {bestRegime && (
                  <Badge variant="secondary" className="ml-2">
                    Best: {bestRegime}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Compare tax liability under both regimes for AY {assessmentYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {taxComparisons.map((comparison, index) => (
                  <Card key={index} className={`${comparison.regime === bestRegime ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {comparison.regime}
                        {comparison.regime === bestRegime && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Tax:</span>
                        <span className="font-semibold">{formatIndianCurrency(comparison.totalTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Effective Rate:</span>
                        <span className="font-semibold">{comparison.effectiveRate.toFixed(2)}%</span>
                      </div>
                      {comparison.savings !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Savings:</span>
                          <div className={`flex items-center gap-1 font-semibold ${getSavingsColor(comparison.savings)}`}>
                            {getSavingsIcon(comparison.savings)}
                            <span>{formatIndianCurrency(Math.abs(comparison.savings))}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="new-regime" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="new-regime">New Tax Regime</TabsTrigger>
                  <TabsTrigger value="old-regime">Old Tax Regime</TabsTrigger>
                </TabsList>
                
                {taxYearData.regimes.map((regime, index) => (
                  <TabsContent key={index} value={regime.name === 'New Tax Regime' ? 'new-regime' : 'old-regime'}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Income Calculation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Income:</span>
                              <span>{formatIndianCurrency(totalIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Standard Deduction:</span>
                              <span>-{formatIndianCurrency(assessmentYear === '2026-27' ? 75000 : 50000)}</span>
                            </div>
                            {regime.name === 'Old Tax Regime' && (
                              <div className="flex justify-between">
                                <span>Other Deductions:</span>
                                <span>-{formatIndianCurrency(totalDeductions)}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span>Taxable Income:</span>
                              <span>
                                {formatIndianCurrency(
                                  regime.name === 'New Tax Regime' 
                                    ? Math.max(0, totalIncome - (assessmentYear === '2026-27' ? 75000 : 50000))
                                    : Math.max(0, totalIncome - totalDeductions - (assessmentYear === '2026-27' ? 75000 : 50000))
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Tax Slabs</h4>
                          <div className="space-y-1 text-sm">
                            {regime.slabs.map((slab, slabIndex) => (
                              <div key={slabIndex} className="flex justify-between">
                                <span>
                                  {formatIndianCurrency(slab.incomeFrom)} - {slab.incomeTo ? formatIndianCurrency(slab.incomeTo) : '∞'}
                                </span>
                                <span>{slab.taxRate}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Features</h4>
                        <ul className="text-sm space-y-1">
                          {regime.deductions.slice(0, 5).map((deduction, deductionIndex) => (
                            <li key={deductionIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {deduction}
                            </li>
                          ))}
                          {regime.deductions.length > 5 && (
                            <li className="text-muted-foreground">...and {regime.deductions.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Recommendation */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <AlertCircle className="h-5 w-5" />
                Tax Planning Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  <strong>Best Option:</strong> {bestRegime} saves you{' '}
                  <span className="font-semibold text-green-600">
                    {formatIndianCurrency(
                      Math.abs(
                        (taxComparisons.find(c => c.regime === 'New Tax Regime')?.totalTax || 0) -
                        (taxComparisons.find(c => c.regime === 'Old Tax Regime')?.totalTax || 0)
                      )
                    )}
                  </span>{' '}
                  compared to the other regime.
                </p>
                
                <div className="text-sm space-y-2">
                  <p><strong>Key Considerations:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>New regime offers lower tax rates but limited deductions</li>
                    <li>Old regime allows various deductions but has higher tax rates</li>
                    <li>Consider your investment pattern and eligible deductions</li>
                    <li>You can switch between regimes annually (with some restrictions)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedIncomeTaxCalculator;