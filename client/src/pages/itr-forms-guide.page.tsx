import { Calculator, Calendar } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  Book,
  FileText,
  HelpCircle,
  Info,
  Landmark,
  UserCheck,
  Users2,
} from 'lucide-react';
import React from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ITRFormsGuidePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ITR Forms Guide</h1>
        <p className="text-muted-foreground">
          Comprehensive guide to different Income Tax Return (ITR) forms for Assessment Year 2025-26
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="deadline">Deadlines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="bg-muted rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">What is an ITR Form?</h2>
                <p className="text-muted-foreground">
                  Income Tax Return (ITR) forms are official documents issued by the Income Tax Department of India to report your income, tax payments, deductions, and exemptions for a given financial year. Different ITR forms are designed for different types of taxpayers based on their income sources and financial status.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary/5">For Individuals</Badge>
                  <Badge variant="outline" className="bg-primary/5">For Businesses</Badge>
                  <Badge variant="outline" className="bg-primary/5">For Professionals</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-1 (Sahaj)</span>
                  </CardTitle>
                  <Badge>Simplest</Badge>
                </div>
                <CardDescription>For individuals with simple income</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Suitable for individuals with income from salary, one house property, and other sources.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Total income up to ₹50 lakhs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Income from salary or pension</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Income from one house property</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 ">
                  <Link href="/tax-resources/itr1" className="flex items-center justify-center gap-1">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-2</span>
                  </CardTitle>
                  <Badge variant="secondary">Common</Badge>
                </div>
                <CardDescription>For individuals and HUFs with capital gains</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  For individuals and HUFs having income from salary, multiple house property, capital gains, and other sources.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>No income limit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Capital gains/losses reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Foreign income and assets</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  <Link href="/tax-resources/itr2" className="flex items-center justify-center gap-1">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-3</span>
                  </CardTitle>
                  <Badge variant="outline">Business</Badge>
                </div>
                <CardDescription>For business income & professionals</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  For individuals and HUFs having income from a business or profession.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Business/professional income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Partners in firms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>All other applicable incomes</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  <Link href="/tax-resources/itr3" className="flex items-center justify-center gap-1">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-4 (Sugam)</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Presumptive</Badge>
                </div>
                <CardDescription>For presumptive income businesses</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  For individuals, HUFs and firms with income computed under presumptive taxation scheme.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Presumptive income u/s 44AD/44ADA/44AE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Small businesses and professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Total income up to ₹50 lakhs</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50">
                  <Link href="/tax-resources/itr4" className="flex items-center justify-center gap-1">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-5</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Entities</Badge>
                </div>
                <CardDescription>For firms, LLPs, and other entities</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  For firms, LLPs, AOPs, BOIs, artificial juridical persons, estate of deceased, estate of insolvent, etc.
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Partnership firms & LLPs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Association of Persons (AOPs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Body of Individuals (BOIs)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50" disabled>
                  <span className="flex items-center justify-center gap-1">
                    Coming Soon <Info className="h-4 w-4" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>ITR-6</span>
                  </CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Companies</Badge>
                </div>
                <CardDescription>For companies other than section 11</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  For companies other than those claiming exemption under section 11 (charitable/religious trusts).
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>All domestic companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Foreign companies with Indian income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Corporate tax rates apply</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" disabled>
                  <span className="flex items-center justify-center gap-1">
                    Coming Soon <Info className="h-4 w-4" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-4 items-start">
            <AlertCircle className="text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Important Note</h3>
              <p className="text-sm text-amber-700">
                Filing the correct ITR form is crucial. Using an incorrect form may result in a defective return notice from the Income Tax Department. If you&amp;apos;re unsure which form to use, consult our Tax Expert or use our ITR Wizard to determine the correct form based on your income sources.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">ITR Forms Comparison Chart</h2>
            <p className="text-muted-foreground mb-4">
              Compare different ITR forms based on eligible income sources and applicability
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-4 py-2 text-left">Features</th>
                    <th className="border px-4 py-2 text-center">ITR-1</th>
                    <th className="border px-4 py-2 text-center">ITR-2</th>
                    <th className="border px-4 py-2 text-center">ITR-3</th>
                    <th className="border px-4 py-2 text-center">ITR-4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Income Limit</td>
                    <td className="border px-4 py-2 text-center">Up to ₹50 lakhs</td>
                    <td className="border px-4 py-2 text-center">No limit</td>
                    <td className="border px-4 py-2 text-center">No limit</td>
                    <td className="border px-4 py-2 text-center">Up to ₹50 lakhs</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Salary/Pension</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">House Property</td>
                    <td className="border px-4 py-2 text-center">One property only</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓ Multiple</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓ Multiple</td>
                    <td className="border px-4 py-2 text-center">One property only</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Capital Gains</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Other Sources</td>
                    <td className="border px-4 py-2 text-center">Limited*</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓ All</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓ All</td>
                    <td className="border px-4 py-2 text-center">Limited*</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Business/Profession</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center">Presumptive only</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Foreign Income</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">For Company Directors</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Unlisted Equity Shares</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-green-600">✓</td>
                    <td className="border px-4 py-2 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium bg-muted/50">Applicable Sections</td>
                    <td className="border px-4 py-2 text-center">Basic</td>
                    <td className="border px-4 py-2 text-center">Comprehensive</td>
                    <td className="border px-4 py-2 text-center">Business focused</td>
                    <td className="border px-4 py-2 text-center">44AD, 44ADA, 44AE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              * Limited other sources: Interest, Family pension, etc. (excluding lottery, gambling, horse racing)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Who Should File Which Form?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Individuals with Salary Income</h3>
                  <ul className="ml-6 space-y-1 text-sm list-disc">
                    <li>If only salary, one house property, and other sources (no lottery/gambling) with total income up to ₹50 lakhs: <span className="font-medium text-primary">ITR-1</span></li>
                    <li>If you have multiple properties, capital gains, or foreign income: <span className="font-medium text-primary">ITR-2</span></li>
                    <li>If you are a director in a company: <span className="font-medium text-primary">ITR-2</span></li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Business Owners and Professionals</h3>
                  <ul className="ml-6 space-y-1 text-sm list-disc">
                    <li>If you have income from business or profession with proper books of accounts: <span className="font-medium text-primary">ITR-3</span></li>
                    <li>If you&amp;apos;re eligible for presumptive taxation under sections 44AD, 44ADA, or 44AE with total income up to ₹50 lakhs: <span className="font-medium text-primary">ITR-4</span></li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Investors and Property Owners</h3>
                  <ul className="ml-6 space-y-1 text-sm list-disc">
                    <li>If you have capital gains from stock market, mutual funds, property, etc.: <span className="font-medium text-primary">ITR-2</span></li>
                    <li>If you have income from multiple house properties: <span className="font-medium text-primary">ITR-2</span></li>
                    <li>If you have foreign income or assets: <span className="font-medium text-primary">ITR-2</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Common Form Selection Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Scenario 1: Salaried Individual</h3>
                  <p className="text-sm">Rajesh earns ₹12 lakhs per year from his job and has interest income of ₹25,000 from bank deposits.</p>
                  <div className="mt-2 text-sm flex items-center gap-2">
                    <Badge>Recommended Form</Badge>
                    <span className="font-medium">ITR-1</span>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Scenario 2: Landlord with Multiple Properties</h3>
                  <p className="text-sm">Priya has a salary of ₹15 lakhs and rental income from two residential properties.</p>
                  <div className="mt-2 text-sm flex items-center gap-2">
                    <Badge>Recommended Form</Badge>
                    <span className="font-medium">ITR-2</span>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Scenario 3: Business Owner</h3>
                  <p className="text-sm">Anil runs a retail store with annual turnover of ₹60 lakhs and maintains regular books of accounts.</p>
                  <div className="mt-2 text-sm flex items-center gap-2">
                    <Badge>Recommended Form</Badge>
                    <span className="font-medium">ITR-3</span>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Scenario 4: Freelance Consultant</h3>
                  <p className="text-sm">Meera is a freelance designer earning ₹18 lakhs annually and opts for presumptive taxation.</p>
                  <div className="mt-2 text-sm flex items-center gap-2">
                    <Badge>Recommended Form</Badge>
                    <span className="font-medium">ITR-4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="deadline" className="mt-6">
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Key Deadlines for AY 2025-26</h2>
                  <p className="text-muted-foreground">
                    For income earned during Financial Year 2024-25 (April 1, 2024 to March 31, 2025)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="default">Original Due Dates</Badge>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">Penalty Rules</Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700">Important Deadlines</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-4 py-2 text-left">Deadline</th>
                    <th className="border px-4 py-2 text-left">Applicable For</th>
                    <th className="border px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-medium text-primary">July 31, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>ITR-1, ITR-2, ITR-3, ITR-4</span>
                        <span className="text-sm text-muted-foreground">(For individuals not requiring audit)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Original due date for individuals and HUFs without audit requirements
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium text-primary">October 31, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>ITR-3, ITR-5, ITR-6</span>
                        <span className="text-sm text-muted-foreground">(For taxpayers requiring audit)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Due date for taxpayers with business income requiring tax audit
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium text-red-600">December 31, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>Late filing for all ITRs</span>
                        <span className="text-sm text-muted-foreground">(With penalty)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Last date to file belated returns with penalty (₹5,000 or ₹1,000 for small taxpayers)
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium text-red-600">March 31, 2026</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>Final deadline</span>
                        <span className="text-sm text-muted-foreground">(With higher penalty)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Absolute final deadline to file returns for AY 2025-26 with increased penalty
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">June 15, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>First Installment of Advance Tax</span>
                        <span className="text-sm text-muted-foreground">(15% of total tax)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      For taxpayers having income other than salary
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">September 15, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>Second Installment of Advance Tax</span>
                        <span className="text-sm text-muted-foreground">(45% of total tax)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Cumulative 45% of estimated annual tax
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">December 15, 2025</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>Third Installment of Advance Tax</span>
                        <span className="text-sm text-muted-foreground">(75% of total tax)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Cumulative 75% of estimated annual tax
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">March 15, 2026</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <span>Fourth Installment of Advance Tax</span>
                        <span className="text-sm text-muted-foreground">(100% of total tax)</span>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      Final payment of advance tax for FY 2025-26
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Late Filing Penalties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Late Filing Fees (Section 234F)</h3>
                    <ul className="ml-6 space-y-2 text-sm list-disc">
                      <li>
                        <span className="font-medium">₹5,000</span> if filed after the due date but before December 31, 2025
                      </li>
                      <li>
                        <span className="font-medium">₹10,000</span> if filed after December 31, 2025 but before March 31, 2026
                      </li>
                      <li>
                        <span className="font-medium">₹1,000</span> for small taxpayers with income up to ₹5 lakhs (if filed before December 31, 2025)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Interest Charges (Section 234A)</h3>
                    <ul className="ml-6 space-y-1 text-sm list-disc">
                      <li>
                        <span className="font-medium">1% per month</span> on tax due, calculated from due date to actual filing date
                      </li>
                      <li>
                        Interest is charged on the unpaid tax amount even if late filing fee is paid
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-md text-amber-800 text-sm">
                    <p className="font-medium">Important Note:</p>
                    <p>Returns filed after March 31, 2026 are considered non-filed, which can lead to prosecution in case of significant tax evasion.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-primary" />
                    Additional Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/calculators/advance-tax" className="block p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Advance Tax Calculator
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Calculate your advance tax liability and due dates
                    </p>
                  </Link>
                  
                  <Link href="/calculators/income-tax" className="block p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Income Tax Calculator
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estimate your tax liability for FY 2024-25 / AY 2025-26
                    </p>
                  </Link>
                  
                  <a 
                    href="https://www.incometax.gov.in/iec/foportal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <Landmark className="h-4 w-4" />
                      Income Tax Filing Portal
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Official government portal for ITR filing
                    </p>
                  </a>
                  
                  <Link href="/tax-expert" className="block p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium flex items-center gap-2">
                      <Users2 className="h-4 w-4" />
                      Consult a Tax Expert
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get personalized assistance with your tax filing
                    </p>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                  Start Filing Your Return <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ITRFormsGuidePage;
