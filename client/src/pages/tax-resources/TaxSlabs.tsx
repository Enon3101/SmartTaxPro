import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CircleDollarSign,
  Cpu,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  Info,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatIndianCurrency } from '@/lib/formatters';

const TaxSlabs = () => {
  const [taxYear, setTaxYear] = useState('2025-26');
  const [regime, setRegime] = useState('new');
  const [personType, setPersonType] = useState('individual');
  const [ageGroup, setAgeGroup] = useState('below60');
  
  // Tax slabs for FY 2024-25 (AY 2025-26)
  const taxSlabs2025_26 = {
    new: {
      individual: {
        below60: [
          { from: 0, to: 300000, rate: 0, description: "No tax up to ₹3 lakh" },
          { from: 300000, to: 600000, rate: 5, description: "5% tax from ₹3 lakh to ₹6 lakh" },
          { from: 600000, to: 900000, rate: 10, description: "10% tax from ₹6 lakh to ₹9 lakh" },
          { from: 900000, to: 1200000, rate: 15, description: "15% tax from ₹9 lakh to ₹12 lakh" },
          { from: 1200000, to: 1500000, rate: 20, description: "20% tax from ₹12 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ],
        senior: [
          { from: 0, to: 300000, rate: 0, description: "No tax up to ₹3 lakh" },
          { from: 300000, to: 600000, rate: 5, description: "5% tax from ₹3 lakh to ₹6 lakh" },
          { from: 600000, to: 900000, rate: 10, description: "10% tax from ₹6 lakh to ₹9 lakh" },
          { from: 900000, to: 1200000, rate: 15, description: "15% tax from ₹9 lakh to ₹12 lakh" },
          { from: 1200000, to: 1500000, rate: 20, description: "20% tax from ₹12 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ],
        superSenior: [
          { from: 0, to: 300000, rate: 0, description: "No tax up to ₹3 lakh" },
          { from: 300000, to: 600000, rate: 5, description: "5% tax from ₹3 lakh to ₹6 lakh" },
          { from: 600000, to: 900000, rate: 10, description: "10% tax from ₹6 lakh to ₹9 lakh" },
          { from: 900000, to: 1200000, rate: 15, description: "15% tax from ₹9 lakh to ₹12 lakh" },
          { from: 1200000, to: 1500000, rate: 20, description: "20% tax from ₹12 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ]
      },
      company: [
        { from: 0, to: null, rate: 25, description: "Flat rate of 25% without any deductions" }
      ],
      firm: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% without any deductions" }
      ]
    },
    old: {
      individual: {
        below60: [
          { from: 0, to: 250000, rate: 0, description: "No tax up to ₹2.5 lakh" },
          { from: 250000, to: 500000, rate: 5, description: "5% tax from ₹2.5 lakh to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ],
        senior: [
          { from: 0, to: 300000, rate: 0, description: "No tax up to ₹3 lakh" },
          { from: 300000, to: 500000, rate: 5, description: "5% tax from ₹3 lakh to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ],
        superSenior: [
          { from: 0, to: 500000, rate: 0, description: "No tax up to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ]
      },
      company: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% (25% for small companies)" }
      ],
      firm: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% plus applicable surcharge and cess" }
      ]
    }
  };
  
  // Tax slabs for FY 2023-24 (AY 2024-25)
  const taxSlabs2024_25 = {
    new: {
      individual: {
        below60: [
          { from: 0, to: 250000, rate: 0, description: "No tax up to ₹2.5 lakh" },
          { from: 250000, to: 500000, rate: 5, description: "5% tax from ₹2.5 lakh to ₹5 lakh" },
          { from: 500000, to: 750000, rate: 10, description: "10% tax from ₹5 lakh to ₹7.5 lakh" },
          { from: 750000, to: 1000000, rate: 15, description: "15% tax from ₹7.5 lakh to ₹10 lakh" },
          { from: 1000000, to: 1250000, rate: 20, description: "20% tax from ₹10 lakh to ₹12.5 lakh" },
          { from: 1250000, to: 1500000, rate: 25, description: "25% tax from ₹12.5 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ],
        senior: [
          { from: 0, to: 250000, rate: 0, description: "No tax up to ₹2.5 lakh" },
          { from: 250000, to: 500000, rate: 5, description: "5% tax from ₹2.5 lakh to ₹5 lakh" },
          { from: 500000, to: 750000, rate: 10, description: "10% tax from ₹5 lakh to ₹7.5 lakh" },
          { from: 750000, to: 1000000, rate: 15, description: "15% tax from ₹7.5 lakh to ₹10 lakh" },
          { from: 1000000, to: 1250000, rate: 20, description: "20% tax from ₹10 lakh to ₹12.5 lakh" },
          { from: 1250000, to: 1500000, rate: 25, description: "25% tax from ₹12.5 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ],
        superSenior: [
          { from: 0, to: 250000, rate: 0, description: "No tax up to ₹2.5 lakh" },
          { from: 250000, to: 500000, rate: 5, description: "5% tax from ₹2.5 lakh to ₹5 lakh" },
          { from: 500000, to: 750000, rate: 10, description: "10% tax from ₹5 lakh to ₹7.5 lakh" },
          { from: 750000, to: 1000000, rate: 15, description: "15% tax from ₹7.5 lakh to ₹10 lakh" },
          { from: 1000000, to: 1250000, rate: 20, description: "20% tax from ₹10 lakh to ₹12.5 lakh" },
          { from: 1250000, to: 1500000, rate: 25, description: "25% tax from ₹12.5 lakh to ₹15 lakh" },
          { from: 1500000, to: null, rate: 30, description: "30% tax above ₹15 lakh" }
        ]
      },
      company: [
        { from: 0, to: null, rate: 25, description: "Flat rate of 25% without any deductions" }
      ],
      firm: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% without any deductions" }
      ]
    },
    old: {
      individual: {
        below60: [
          { from: 0, to: 250000, rate: 0, description: "No tax up to ₹2.5 lakh" },
          { from: 250000, to: 500000, rate: 5, description: "5% tax from ₹2.5 lakh to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ],
        senior: [
          { from: 0, to: 300000, rate: 0, description: "No tax up to ₹3 lakh" },
          { from: 300000, to: 500000, rate: 5, description: "5% tax from ₹3 lakh to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ],
        superSenior: [
          { from: 0, to: 500000, rate: 0, description: "No tax up to ₹5 lakh" },
          { from: 500000, to: 1000000, rate: 20, description: "20% tax from ₹5 lakh to ₹10 lakh" },
          { from: 1000000, to: null, rate: 30, description: "30% tax above ₹10 lakh" }
        ]
      },
      company: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% (25% for small companies)" }
      ],
      firm: [
        { from: 0, to: null, rate: 30, description: "Flat rate of 30% plus applicable surcharge and cess" }
      ]
    }
  };
  
  // Get the appropriate tax slabs based on selection
  const getSelectedTaxSlabs = () => {
    const selectedYear = taxYear === '2025-26' ? taxSlabs2025_26 : taxSlabs2024_25;
    
    if (personType === 'individual') {
      let ageGroupKey = 'below60';
      if (ageGroup === '60to80') ageGroupKey = 'senior';
      if (ageGroup === 'above80') ageGroupKey = 'superSenior';
      
      return selectedYear[regime].individual[ageGroupKey];
    } else {
      return selectedYear[regime][personType];
    }
  };
  
  const selectedTaxSlabs = getSelectedTaxSlabs();
  
  // Calculate surcharge rates
  const getSurchargeRates = () => {
    if (personType === 'individual') {
      return [
        { income: '50 lakhs to 1 crore', rate: '10%' },
        { income: '1 crore to 2 crores', rate: '15%' },
        { income: '2 crores to 5 crores', rate: '25%' },
        { income: 'Above 5 crores', rate: '37%' }
      ];
    } else if (personType === 'company') {
      return [
        { income: '1 crore to 10 crores', rate: '7%' },
        { income: 'Above 10 crores', rate: '12%' }
      ];
    } else if (personType === 'firm') {
      return [
        { income: 'Above 1 crore', rate: '12%' }
      ];
    }
    
    return [];
  };
  
  const regimeFeatures = {
    new: [
      { feature: "Tax Slabs", old: "4 slabs with rates from 0% to 30%", new: "6 slabs with rates from 0% to 30%" },
      { feature: "Basic Exemption", old: "₹2.5 lakh (₹3 lakh for senior citizens, ₹5 lakh for super senior citizens)", new: "₹3 lakh for all individuals" },
      { feature: "Standard Deduction", old: "₹50,000 for salaried", new: "₹50,000 for salaried" },
      { feature: "Section 80C Deductions", old: "Available up to ₹1.5 lakh", new: "Not available" },
      { feature: "Section 80D (Health Insurance)", old: "Available", new: "Not available" },
      { feature: "House Property Loss Set Off", old: "Up to ₹2 lakh", new: "Not available" },
      { feature: "LTA, HRA Exemptions", old: "Available", new: "Available" },
      { feature: "Professional Tax Deduction", old: "Available", new: "Available" }
    ]
  };
  
  const calculateTaxExample = () => {
    const income = 1000000; // ₹10 lakh
    
    // New Regime Calculation
    let newRegimeTax = 0;
    const newRegimeSlabs = taxSlabs2025_26.new.individual.below60;
    
    for (let i = 0; i < newRegimeSlabs.length; i++) {
      const slab = newRegimeSlabs[i];
      if (income > slab.from) {
        const slabIncome = slab.to ? Math.min(income, slab.to) - slab.from : income - slab.from;
        newRegimeTax += slabIncome * (slab.rate / 100);
      }
    }
    
    // Old Regime Calculation
    let oldRegimeTax = 0;
    const oldRegimeSlabs = taxSlabs2025_26.old.individual.below60;
    
    // Assuming standard deduction of ₹50,000 and 80C deduction of ₹1.5 lakh
    const taxableIncomeOld = income - 50000 - 150000;
    
    for (let i = 0; i < oldRegimeSlabs.length; i++) {
      const slab = oldRegimeSlabs[i];
      if (taxableIncomeOld > slab.from) {
        const slabIncome = slab.to ? Math.min(taxableIncomeOld, slab.to) - slab.from : taxableIncomeOld - slab.from;
        oldRegimeTax += slabIncome * (slab.rate / 100);
      }
    }
    
    // Add health and education cess of 4%
    newRegimeTax += newRegimeTax * 0.04;
    oldRegimeTax += oldRegimeTax * 0.04;
    
    return {
      newRegimeTax: Math.round(newRegimeTax),
      oldRegimeTax: Math.round(oldRegimeTax),
      saving: Math.round(Math.max(0, oldRegimeTax - newRegimeTax))
    };
  };
  
  const taxExample = calculateTaxExample();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tax-resources">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tax Resources
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Updated for AY 2025-26</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CircleDollarSign className="h-7 w-7 text-primary" />
            Income Tax Slabs & Rates
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive guide to income tax slabs and rates for different taxpayers and assessment years
          </p>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Assessment Year</label>
              <Select value={taxYear} onValueChange={setTaxYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-26">2025-26 (FY 2024-25)</SelectItem>
                  <SelectItem value="2024-25">2024-25 (FY 2023-24)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tax Regime</label>
              <Select value={regime} onValueChange={setRegime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Tax Regime</SelectItem>
                  <SelectItem value="old">Old Tax Regime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Person Type</label>
              <Select value={personType} onValueChange={setPersonType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Person Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual/HUF</SelectItem>
                  <SelectItem value="company">Domestic Company</SelectItem>
                  <SelectItem value="firm">Partnership Firm/LLP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {personType === 'individual' && (
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <Select value={ageGroup} onValueChange={setAgeGroup} disabled={regime === 'new'}>
                  <SelectTrigger className="w-full">
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
          
          {regime === 'new' && ageGroup !== 'below60' && (
            <div className="p-3 mt-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  In the new tax regime, there are no separate tax slabs for senior citizens. The same tax slabs apply to all individual taxpayers regardless of age.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="slabs" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="slabs">Tax Slabs</TabsTrigger>
            <TabsTrigger value="surcharge">Surcharge & Cess</TabsTrigger>
            <TabsTrigger value="comparison">Regime Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="slabs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle>
                      {personType === 'individual' ? 'Individual' : personType === 'company' ? 'Domestic Company' : 'Partnership Firm/LLP'} Tax Slabs
                    </CardTitle>
                    <CardDescription>
                      Assessment Year {taxYear} under {regime === 'new' ? 'New' : 'Old'} Tax Regime
                      {personType === 'individual' && regime === 'old' && ` (${ageGroup === 'below60' ? 'Below 60 years' : ageGroup === '60to80' ? '60-80 years' : 'Above 80 years'})`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {personType === 'individual' && (
                      <>
                        <Badge variant="outline" className="bg-primary/10">
                          {regime === 'new' ? 'Without Deductions' : 'With Deductions'}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Income Slab</TableHead>
                      <TableHead className="w-1/6">Tax Rate</TableHead>
                      <TableHead className="w-1/2">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTaxSlabs.map((slab, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {slab.from === 0 
                            ? (slab.to === null ? 'All income' : `Up to ${formatIndianCurrency(slab.to)}`) 
                            : (slab.to === null 
                                ? `Above ${formatIndianCurrency(slab.from)}` 
                                : `${formatIndianCurrency(slab.from)} - ${formatIndianCurrency(slab.to)}`)
                          }
                        </TableCell>
                        <TableCell>{slab.rate}%</TableCell>
                        <TableCell className="text-muted-foreground">{slab.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Plus applicable surcharge and 4% Health and Education Cess on the total tax amount
                  </TableCaption>
                </Table>
                
                {personType === 'individual' && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Key Deductions & Exemptions</h3>
                    
                    {regime === 'old' ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 80C Deductions:</span>
                            <span className="ml-1">Up to ₹1,50,000 (PPF, ELSS, Life Insurance Premiums, etc.)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 80D:</span>
                            <span className="ml-1">Health Insurance Premium (up to ₹25,000 for self and family, ₹50,000 for senior citizens)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 24:</span>
                            <span className="ml-1">Home Loan Interest Deduction up to ₹2,00,000</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 80CCD(1B):</span>
                            <span className="ml-1">Additional NPS contribution deduction up to ₹50,000</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Standard Deduction:</span>
                            <span className="ml-1">₹50,000 for salaried employees</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Standard Deduction:</span>
                            <span className="ml-1">₹50,000 for salaried employees</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 80CCD(2):</span>
                            <span className="ml-1">Employer's contribution to NPS (up to 10% of salary)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">No Section 80C, 80D, etc.:</span>
                            <span className="ml-1">Most deductions and exemptions not available under the new regime</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Rebate under Section 87A</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            Taxpayers with total income up to ₹7 lakh (New Regime) or ₹5 lakh (Old Regime) are eligible for tax rebate under Section 87A, making their tax liability zero.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button asChild variant="outline">
                  <Link href="/calculators/income-tax" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate Your Tax
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    File Your Return
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="surcharge" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                    Surcharge Rates
                  </CardTitle>
                  <CardDescription>
                    Additional tax on higher income levels for {personType === 'individual' ? 'individuals' : personType === 'company' ? 'companies' : 'firms'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Level</TableHead>
                        <TableHead>Surcharge Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSurchargeRates().map((rate, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{rate.income}</TableCell>
                          <TableCell>{rate.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      Surcharge is applied on the tax amount, not on the total income
                    </TableCaption>
                  </Table>
                  
                  {personType === 'individual' && (
                    <div className="p-3 mt-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Marginal Relief</h4>
                          <p className="text-sm mt-1">
                            If surcharge increases tax liability beyond the additional income that takes you to the higher surcharge bracket, marginal relief is available to limit the additional tax burden.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    Health & Education Cess
                  </CardTitle>
                  <CardDescription>
                    Additional levy on the total tax amount (including surcharge)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Current Health & Education Cess Rate:</span>
                      <span className="font-bold">4%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Applicable on the total income tax amount (including surcharge, if any) for all taxpayers.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">How Cess is Calculated</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Example calculation for ₹15 lakh income:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Base Tax Amount:</span>
                          <span>₹1,87,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Surcharge (if applicable):</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Health & Education Cess (4%):</span>
                          <span>₹7,500</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1 mt-1">
                          <span>Total Tax Liability:</span>
                          <span>₹1,95,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Purpose of Cess</h4>
                        <p className="text-blue-700 text-sm mt-1">
                          Health and Education Cess is collected specifically for financing health and education programs. Unlike regular taxes, cess collections are earmarked for these specific purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculation Steps</CardTitle>
                <CardDescription>How income tax is calculated including surcharge and cess</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <h3 className="font-medium">Calculate Base Tax</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apply tax rates to income slabs as per your applicable tax regime.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <h3 className="font-medium">Apply Rebate</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If eligible, apply Section 87A rebate (up to ₹25,000).
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <h3 className="font-medium">Calculate Surcharge</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apply surcharge if income exceeds threshold (% of base tax).
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">4</span>
                      </div>
                      <h3 className="font-medium">Apply Cess</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apply 4% cess on (base tax + surcharge).
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">5</span>
                      </div>
                      <h3 className="font-medium">Final Tax Amount</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The total of base tax, surcharge, and cess is your final tax liability.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg mt-4">
                  <h3 className="font-medium mb-3">Example Calculation for ₹1.2 Crore Income (Individual, New Regime)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Step</TableHead>
                        <TableHead>Calculation</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-sm">
                      <TableRow>
                        <TableCell className="font-medium">Base Tax</TableCell>
                        <TableCell>Tax on income as per applicable slabs</TableCell>
                        <TableCell className="text-right">₹32,50,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Surcharge</TableCell>
                        <TableCell>15% of base tax (for income between ₹1-2 crore)</TableCell>
                        <TableCell className="text-right">₹4,87,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Tax + Surcharge</TableCell>
                        <TableCell>Base tax + surcharge amount</TableCell>
                        <TableCell className="text-right">₹37,37,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Health & Education Cess</TableCell>
                        <TableCell>4% of (tax + surcharge)</TableCell>
                        <TableCell className="text-right">₹1,49,500</TableCell>
                      </TableRow>
                      <TableRow className="font-medium">
                        <TableCell>Total Tax Liability</TableCell>
                        <TableCell>Final tax amount</TableCell>
                        <TableCell className="text-right">₹38,87,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <Info className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">New vs Old Tax Regime: Making the Right Choice</h2>
                  <p className="text-muted-foreground">
                    Starting from assessment year 2023-24, taxpayers can choose between the new and old tax regimes. 
                    The new regime offers lower tax rates but eliminates most deductions and exemptions. 
                    The old regime has higher rates but allows various tax-saving deductions. 
                    Choose based on your investment pattern and deductions claimed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                  <CardDescription>Comparing key features of both tax regimes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-2/5">Feature</TableHead>
                        <TableHead className="w-1/3">Old Regime</TableHead>
                        <TableHead className="w-1/3">New Regime</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regimeFeatures.new.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{feature.feature}</TableCell>
                          <TableCell className={feature.old.includes("Available") ? "text-green-600" : ""}>{feature.old}</TableCell>
                          <TableCell className={feature.new.includes("Available") ? "text-green-600" : feature.new.includes("Not available") ? "text-red-600" : ""}>{feature.new}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="p-3 mt-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Default Regime</h4>
                        <p className="text-sm mt-1">
                          From FY 2023-24 (AY 2024-25), the new tax regime is the default regime. If you want to opt for the old regime, you need to specify it while filing your return.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sample Tax Calculation</CardTitle>
                  <CardDescription>For ₹10 lakh annual income (Salaried Individual)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">New Tax Regime</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Income:</span>
                        <span>₹10,00,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Deduction:</span>
                        <span>-₹50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span>₹9,50,000</span>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Tax on first ₹3,00,000:</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on next ₹3,00,000 at 5%:</span>
                          <span>₹15,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on next ₹3,00,000 at 10%:</span>
                          <span>₹30,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on next ₹50,000 at 15%:</span>
                          <span>₹7,500</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Total Income Tax:</span>
                          <span>₹52,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Health & Education Cess (4%):</span>
                          <span>₹2,100</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Tax Liability:</span>
                          <span>₹{taxExample.newRegimeTax}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Old Tax Regime (with ₹1.5 lakh 80C deduction)</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Income:</span>
                        <span>₹10,00,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Deduction:</span>
                        <span>-₹50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Section 80C Deductions:</span>
                        <span>-₹1,50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxable Income:</span>
                        <span>₹8,00,000</span>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Tax on first ₹2,50,000:</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on next ₹2,50,000 at 5%:</span>
                          <span>₹12,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on next ₹3,00,000 at 20%:</span>
                          <span>₹60,000</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Total Income Tax:</span>
                          <span>₹72,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Health & Education Cess (4%):</span>
                          <span>₹2,900</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Tax Liability:</span>
                          <span>₹{taxExample.oldRegimeTax}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-700 mb-2">Potential Tax Saving</h3>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Tax Saving with New Regime:</span>
                      <span className="font-bold text-green-700">₹{taxExample.saving}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      * The actual saving depends on your specific income and deduction profile. Use our tax calculator for a personalized comparison.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/calculators/tax-regime" className="flex items-center gap-2 justify-center">
                      <Calculator className="h-4 w-4" />
                      Compare Both Regimes for Your Income
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Which Regime is Better for You?</CardTitle>
                <CardDescription>Guidelines to help you make the right choice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Choose Old Regime If:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>You claim significant deductions under Sections 80C, 80D, etc.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>You have a home loan and claim interest deduction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>You have multiple house properties</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>You have significant long-term investments for tax savings</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>Your total deductions exceed ₹2.5 lakhs</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-medium text-green-700 mb-1">Typical Beneficiaries of Old Regime</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Home loan borrowers</li>
                        <li>• Those with multiple investments for tax saving</li>
                        <li>• People with high medical expenses/insurance</li>
                        <li>• Landlords with multiple properties</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Choose New Regime If:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>You don't claim many deductions or exemptions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>You're a fresher or early in your career</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>You have income up to ₹7 lakhs (eligible for rebate)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>You prefer simplified tax filing without tracking investments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>Your total deductions are under ₹2 lakhs</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="font-medium text-blue-700 mb-1">Typical Beneficiaries of New Regime</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Young professionals with minimal investments</li>
                        <li>• Taxpayers with income below ₹7 lakhs</li>
                        <li>• Those who value simplicity over tax planning</li>
                        <li>• People who don't have many tax-saving investments</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Still Confused Which Regime to Choose?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The best way to decide is to calculate your tax liability under both regimes based on your actual income and deductions. 
                    Our tax calculator provides a side-by-side comparison to help you make an informed decision.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/calculators/tax-regime">Tax Regime Calculator</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/tax-expert">Consult Our Tax Expert</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
              Start Filing Your Return <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxSlabs;