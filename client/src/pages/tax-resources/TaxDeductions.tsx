import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  CheckCircle,
  ExternalLink,
  FileText,
  Heart,
  Home,
  Info,
  Lightbulb,
  School,
  ShieldCheck,
  Umbrella,
  Wallet,
} from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaxDeductions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tax-resources">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tax Resources
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Tax Year 2025-26</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            Complete Guide to Tax Deductions
          </h1>
          <p className="text-muted-foreground text-lg">
            Understand all the deductions available under the Income Tax Act to maximize your tax savings
          </p>
        </div>
        
        <Tabs defaultValue="major" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="major">Major Deductions</TabsTrigger>
            <TabsTrigger value="special">Special Deductions</TabsTrigger>
            <TabsTrigger value="calculator">Deduction Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="major" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Understanding Tax Deductions</h2>
                  <p className="text-muted-foreground">
                    Tax deductions reduce your taxable income, which in turn lowers your tax liability. The Indian Income Tax Act offers various deductions under different sections to help taxpayers save on their tax outgo. These deductions are available for specific investments, expenses, and payments made during the financial year.
                  </p>
                  <div className="p-3 border border-amber-200 bg-amber-50 rounded-md mt-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Important Note</h4>
                        <p className="text-amber-700 text-sm mt-1">
                          From FY 2020-21, taxpayers have the option to choose between the old tax regime (with deductions) and the new tax regime (with lower tax rates but no major deductions). Choose wisely based on your financial situation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Section 80C Deductions (₹1.5 Lakh Limit)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Investments</CardTitle>
                    <Badge>Up to ₹1,50,000</Badge>
                  </div>
                  <CardDescription>Investment options under Section 80C</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="ppf">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Public Provident Fund (PPF)
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>A government-backed long-term investment scheme with tax-free returns.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Lock-in period: 15 years</li>
                            <li>Interest rate: ~7.1% (reviewed quarterly)</li>
                            <li>Annual investment limit: ₹1.5 lakhs</li>
                            <li>Minimum investment: ₹500 per financial year</li>
                          </ul>
                          <div className="flex justify-end mt-2">
                            <Link href="/calculators/ppf">
                              <Button variant="link" size="sm" className="h-auto p-0">
                                PPF Calculator <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="elss">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        ELSS Mutual Funds
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Equity Linked Savings Scheme (ELSS) are mutual funds that invest primarily in equities.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Shortest lock-in period (3 years) among 80C options</li>
                            <li>Potential for higher returns compared to other tax-saving options</li>
                            <li>Market-linked returns, hence carries market risk</li>
                            <li>Can start with SIPs of as low as ₹500</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="nsc">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        National Savings Certificate (NSC)
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>A fixed income investment scheme offered by India Post.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Lock-in period: 5 years</li>
                            <li>Interest rate: ~6.8% (compounded annually)</li>
                            <li>Interest is taxable but qualifies for deduction under 80C</li>
                            <li>Minimum investment: ₹1,000 (no maximum limit)</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="fd">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Tax-Saving Fixed Deposits
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Special fixed deposits offered by banks with a 5-year lock-in period.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Lock-in period: 5 years</li>
                            <li>Interest rates: 6.5-7% depending on the bank</li>
                            <li>Interest earned is taxable</li>
                            <li>Minimum investment: Varies by bank (typically ₹1,000)</li>
                          </ul>
                          <div className="flex justify-end mt-2">
                            <Link href="/calculators/fd">
                              <Button variant="link" size="sm" className="h-auto p-0">
                                FD Calculator <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="ulip">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Unit Linked Insurance Plans (ULIPs)
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Insurance products that combine investment and protection.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Lock-in period: 5 years</li>
                            <li>Market-linked returns with insurance coverage</li>
                            <li>Choice of funds (equity, debt, balanced)</li>
                            <li>Long-term capital gains tax exemption under Section 10(10D)</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Payments & Expenses</CardTitle>
                    <Badge>Up to ₹1,50,000</Badge>
                  </div>
                  <CardDescription>Payments eligible under Section 80C</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="life-insurance">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Life Insurance Premiums
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Premium paid for life insurance policies for self, spouse, and children.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Premium should not exceed 10% of sum assured for policies issued after April 1, 2012</li>
                            <li>Term insurance, endowment, money-back policies all qualify</li>
                            <li>ULIP premiums also qualify subject to certain conditions</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="home-loan">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Home Loan Principal Repayment
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Principal component of your home loan EMI qualifies for deduction.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Only for self-occupied or vacant property</li>
                            <li>Property should not be sold within 5 years of possession</li>
                            <li>Stamp duty and registration charges also qualify</li>
                          </ul>
                          <div className="flex justify-end mt-2">
                            <Link href="/calculators/home-loan">
                              <Button variant="link" size="sm" className="h-auto p-0">
                                Home Loan Calculator <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="tuition-fees">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Children's Tuition Fees
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Tuition fees paid for full-time education of up to two children.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Only full-time education at recognized institutions in India</li>
                            <li>Covers only tuition fees, not development fees, donations, etc.</li>
                            <li>Can be claimed for biological or adopted children</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="epf">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Employee Provident Fund (EPF)
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Contribution to EPF is automatically deducted from your salary.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Employee's contribution (12% of basic salary) qualifies for deduction</li>
                            <li>Employer's contribution is exempt up to 12% of basic salary</li>
                            <li>Interest earned is tax-free if withdrawn after 5 years of continuous service</li>
                          </ul>
                          <div className="flex justify-end mt-2">
                            <Link href="/calculators/pf">
                              <Button variant="link" size="sm" className="h-auto p-0">
                                PF Calculator <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="vpf">
                      <AccordionTrigger className="hover:no-underline text-base font-medium">
                        Voluntary Provident Fund (VPF)
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1">
                        <div className="space-y-2 text-sm">
                          <p>Additional voluntary contribution to EPF beyond the mandatory 12%.</p>
                          <ul className="space-y-1 list-disc pl-5">
                            <li>Can contribute up to 100% of basic salary</li>
                            <li>Same interest rate as EPF (8.15% for 2023-24)</li>
                            <li>Same tax benefits and withdrawal rules as EPF</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4">Health Insurance & Medical Deductions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" /> 
                      Section 80D
                    </CardTitle>
                    <Badge>Up to ₹1,00,000</Badge>
                  </div>
                  <CardDescription>Health Insurance Premiums & Medical Expenditure</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>For Whom</TableHead>
                        <TableHead>Basic Limit</TableHead>
                        <TableHead>Additional (Sr. Citizens)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Self, Spouse & Children</TableCell>
                        <TableCell>₹25,000</TableCell>
                        <TableCell>+ ₹25,000 (if self/spouse is senior)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Parents</TableCell>
                        <TableCell>₹25,000</TableCell>
                        <TableCell>+ ₹25,000 (if parents are senior)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Preventive Health Checkup</TableCell>
                        <TableCell colSpan={2}>₹5,000 (included in above limits)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Medical Expenditure (Sr. Citizens)</TableCell>
                        <TableCell colSpan={2}>Up to ₹50,000 if no insurance</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableCaption>Maximum deduction possible: ₹1,00,000</TableCaption>
                  </Table>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-4">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Example Scenario</h4>
                        <p className="text-blue-700 text-sm mt-1">
                          For a family where both taxpayer and parents are senior citizens, the maximum deduction would be ₹1,00,000 (₹50,000 for self & spouse + ₹50,000 for parents).
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-500" /> 
                      Other Medical Deductions
                    </CardTitle>
                  </div>
                  <CardDescription>Additional health-related tax benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80DD</h3>
                      <p className="text-sm mb-2">Deduction for maintenance and medical treatment of a dependent with disability.</p>
                      <div className="flex justify-between text-sm">
                        <span>Regular disability:</span>
                        <span className="font-medium">₹75,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Severe disability (80% or more):</span>
                        <span className="font-medium">₹1,25,000</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80DDB</h3>
                      <p className="text-sm mb-2">Deduction for medical treatment of specified diseases for self or dependents.</p>
                      <div className="flex justify-between text-sm">
                        <span>For self or dependents:</span>
                        <span className="font-medium">Up to ₹40,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>For senior citizens:</span>
                        <span className="font-medium">Up to ₹1,00,000</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        (Covers diseases like cancer, AIDS, neurological diseases, etc.)
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80U</h3>
                      <p className="text-sm mb-2">Deduction for individuals with disabilities (for self only).</p>
                      <div className="flex justify-between text-sm">
                        <span>Regular disability (40% or more):</span>
                        <span className="font-medium">₹75,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Severe disability (80% or more):</span>
                        <span className="font-medium">₹1,25,000</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        (Disability certificate from a government hospital required)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4">Housing & Loan Deductions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" /> 
                      Home Loan Interest
                    </CardTitle>
                    <Badge>Up to ₹3,50,000</Badge>
                  </div>
                  <CardDescription>Section 24(b) & 80EEA Benefits</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 24(b): Interest on Housing Loan</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Self-occupied property:</span>
                          <span className="font-medium">Up to ₹2,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Let-out property:</span>
                          <span className="font-medium">No limit (full interest)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          For let-out properties, the entire interest amount can be claimed after adjusting for rental income.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80EEA: Additional Interest Deduction</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>First-time home buyers:</span>
                          <span className="font-medium">Additional ₹1,50,000</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Conditions: Loan sanctioned between April 1, 2019 and March 31, 2022, stamp duty value up to ₹45 lakhs, no other house owned by taxpayer.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Pre-Construction Interest</h3>
                      <div className="space-y-2 text-sm">
                        <p>Interest paid during the construction period can be claimed in 5 equal installments starting from the year of completion.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" /> 
                      Other Loan Deductions
                    </CardTitle>
                  </div>
                  <CardDescription>Educational & Electric Vehicle Loans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80E: Education Loan Interest</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Education loan interest:</span>
                          <span className="font-medium">No upper limit</span>
                        </div>
                        <ul className="space-y-1 list-disc pl-5 mt-2">
                          <li>Loan must be for higher education of self, spouse, or children</li>
                          <li>Loan should be from a financial institution or approved charitable institution</li>
                          <li>Deduction available for a maximum of 8 years or until interest is paid, whichever is earlier</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80EEB: Electric Vehicle Loan</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Interest on loan for EV:</span>
                          <span className="font-medium">Up to ₹1,50,000</span>
                        </div>
                        <ul className="space-y-1 list-disc pl-5 mt-2">
                          <li>Loan must be taken for purchasing an electric vehicle</li>
                          <li>Loan should be sanctioned between April 1, 2019 and March 31, 2023</li>
                          <li>No other EV loan deduction claimed for any other assessment year</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="special" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Special Deductions & Tax Benefits</h2>
                  <p className="text-muted-foreground">
                    Beyond the major deductions, the Income Tax Act provides several special deductions for specific expenses, investments, and donations. These lesser-known deductions can significantly reduce your tax liability if applicable to your situation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-indigo-500" /> 
                    Section 80G
                  </CardTitle>
                  <CardDescription>Donations to Charitable Institutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deduction Type</TableHead>
                        <TableHead>Limit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-sm">
                      <TableRow>
                        <TableCell>100% deduction without qualifying limit</TableCell>
                        <TableCell>Full amount</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>50% deduction without qualifying limit</TableCell>
                        <TableCell>50% of amount</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>100% deduction with qualifying limit</TableCell>
                        <TableCell>100% (up to 10% of adjusted gross total income)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>50% deduction with qualifying limit</TableCell>
                        <TableCell>50% (up to 10% of adjusted gross total income)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-700">Notable Donations:</p>
                    <ul className="space-y-1 list-disc pl-5 mt-1 text-blue-700">
                      <li>Prime Minister's National Relief Fund (100%)</li>
                      <li>National Defence Fund (100%)</li>
                      <li>PM CARES Fund (100%)</li>
                      <li>Swachh Bharat Kosh (100%)</li>
                      <li>Most religious institutions (50%)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5 text-green-500" /> 
                    Section 80CCD
                  </CardTitle>
                  <CardDescription>Pension Scheme Contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">80CCD(1): Employee's NPS Contribution</h3>
                      <div className="space-y-2 text-sm">
                        <p>Contribution to National Pension System (NPS).</p>
                        <div className="flex justify-between">
                          <span>For salaried individuals:</span>
                          <span className="font-medium">Up to 10% of salary</span>
                        </div>
                        <div className="flex justify-between">
                          <span>For self-employed:</span>
                          <span className="font-medium">Up to 20% of gross income</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This falls within the overall ₹1.5 lakh limit of Section 80C.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">80CCD(1B): Additional NPS Deduction</h3>
                      <div className="space-y-2 text-sm">
                        <p>Additional deduction for NPS contribution beyond 80C limit.</p>
                        <div className="flex justify-between">
                          <span>Maximum deduction:</span>
                          <span className="font-medium">Up to ₹50,000</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This is over and above the ₹1.5 lakh limit under Section 80C.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">80CCD(2): Employer's NPS Contribution</h3>
                      <div className="space-y-2 text-sm">
                        <p>Employer's contribution to employee's NPS account.</p>
                        <div className="flex justify-between">
                          <span>For government employees:</span>
                          <span className="font-medium">Full amount</span>
                        </div>
                        <div className="flex justify-between">
                          <span>For other employees:</span>
                          <span className="font-medium">Up to 10% of salary</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This is completely separate from the 80C and 80CCD(1B) limits.
                        </p>
                        <div className="flex justify-end mt-2">
                          <Link href="/calculators/nps">
                            <Button variant="link" size="sm" className="h-auto p-0">
                              NPS Calculator <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500" /> 
                    Special Categories
                  </CardTitle>
                  <CardDescription>Unique Deductions & Rebates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80TTA: Interest on Savings</h3>
                      <div className="space-y-2 text-sm">
                        <p>Deduction on interest earned from savings account.</p>
                        <div className="flex justify-between">
                          <span>Maximum deduction:</span>
                          <span className="font-medium">Up to ₹10,000</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applicable to interest from savings accounts with banks, post offices, and co-operative societies.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80TTB: Senior Citizens</h3>
                      <div className="space-y-2 text-sm">
                        <p>Deduction on interest income for senior citizens.</p>
                        <div className="flex justify-between">
                          <span>Maximum deduction:</span>
                          <span className="font-medium">Up to ₹50,000</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applicable to interest from savings accounts, fixed deposits, and recurring deposits.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 87A: Tax Rebate</h3>
                      <div className="space-y-2 text-sm">
                        <p>Rebate for individuals with lower income.</p>
                        <div className="flex justify-between">
                          <span>For income up to ₹5 lakhs:</span>
                          <span className="font-medium">₹12,500 or tax amount (whichever is less)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Effectively, no tax for individuals with taxable income up to ₹5 lakhs.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Section 80GG: Rent Paid</h3>
                      <div className="space-y-2 text-sm">
                        <p>Deduction for rent paid when HRA is not received.</p>
                        <div className="flex justify-between">
                          <span>Maximum deduction:</span>
                          <span className="font-medium">Least of:</span>
                        </div>
                        <ul className="space-y-1 list-disc pl-5 mt-1">
                          <li>₹5,000 per month</li>
                          <li>25% of total income</li>
                          <li>Rent paid minus 10% of total income</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg mt-6">
              <h3 className="text-lg font-semibold mb-3">Lesser Known Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80GGB & 80GGC</h4>
                    <p className="text-xs text-muted-foreground">Deduction for political contributions by companies and individuals (100% of contribution)</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80RRB</h4>
                    <p className="text-xs text-muted-foreground">Deduction for income from patents (up to ₹3 lakhs) for resident individuals</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80QQB</h4>
                    <p className="text-xs text-muted-foreground">Deduction for royalty income from books (up to ₹3 lakhs) for resident authors</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80JJA</h4>
                    <p className="text-xs text-muted-foreground">Deduction for businesses engaged in collecting and processing biodegradable waste</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80CCC</h4>
                    <p className="text-xs text-muted-foreground">Deduction for pension plan contributions (up to ₹1.5 lakhs within 80C limit)</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Section 80TTA</h4>
                    <p className="text-xs text-muted-foreground">Deduction for interest on savings account (up to ₹10,000)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mt-8">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Important Notice: New Tax Regime</h4>
                  <p className="text-amber-700 text-sm mt-1">
                    Remember that if you opt for the new tax regime, most of these deductions (except for employer's NPS contribution under 80CCD(2)) will not be available. Analyze your tax liability under both regimes before making a choice.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Deduction & Tax Saving Calculator</h2>
                  <p className="text-muted-foreground">
                    Use our calculators to estimate your potential tax savings from various deductions and compare between old and new tax regimes.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button asChild>
                      <Link href="/calculators/income-tax">Income Tax Calculator</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/calculators/tax-regime">Tax Regime Comparison</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Popular Tax Calculators</CardTitle>
                  <CardDescription>Tools to help you plan your taxes effectively</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/calculators/income-tax" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">Income Tax Calculator</h3>
                    <p className="text-sm text-muted-foreground mt-1">Calculate your tax liability based on your income and investments</p>
                  </Link>
                  
                  <Link href="/calculators/tax-regime" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">Tax Regime Comparison</h3>
                    <p className="text-sm text-muted-foreground mt-1">Compare old vs new tax regime to see which is better for you</p>
                  </Link>
                  
                  <Link href="/calculators/hra" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">HRA Exemption Calculator</h3>
                    <p className="text-sm text-muted-foreground mt-1">Calculate your eligible HRA exemption amount</p>
                  </Link>
                  
                  <Link href="/calculators/home-loan" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">Home Loan Calculator</h3>
                    <p className="text-sm text-muted-foreground mt-1">Calculate EMI and tax benefits on your home loan</p>
                  </Link>
                  
                  <Link href="/calculators/sip" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">SIP Calculator</h3>
                    <p className="text-sm text-muted-foreground mt-1">Calculate returns on your SIP investments including ELSS</p>
                  </Link>
                  
                  <Link href="/calculators/ppf" className="block p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                    <h3 className="font-medium">PPF Calculator</h3>
                    <p className="text-sm text-muted-foreground mt-1">Calculate returns on your PPF investments and tax savings</p>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Possible Tax Savings Chart</CardTitle>
                  <CardDescription>Maximum potential tax savings from major deductions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deduction</TableHead>
                        <TableHead>Maximum Amount</TableHead>
                        <TableHead className="text-right">Tax Savings (30% Slab)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Section 80C</TableCell>
                        <TableCell>₹1,50,000</TableCell>
                        <TableCell className="text-right">₹46,800</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Section 80CCD(1B) (NPS)</TableCell>
                        <TableCell>₹50,000</TableCell>
                        <TableCell className="text-right">₹15,600</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Section 80D (Health Insurance)</TableCell>
                        <TableCell>₹1,00,000</TableCell>
                        <TableCell className="text-right">₹31,200</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Section 24 (Home Loan Interest)</TableCell>
                        <TableCell>₹2,00,000</TableCell>
                        <TableCell className="text-right">₹62,400</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Section 80EEA (Additional Home Loan)</TableCell>
                        <TableCell>₹1,50,000</TableCell>
                        <TableCell className="text-right">₹46,800</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Section 80TTA/TTB</TableCell>
                        <TableCell>₹10,000/₹50,000</TableCell>
                        <TableCell className="text-right">₹3,120/₹15,600</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted">
                        <TableCell className="font-medium">Total Potential Savings</TableCell>
                        <TableCell>₹7,00,000</TableCell>
                        <TableCell className="text-right font-bold">₹2,18,400</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableCaption>Tax savings calculated at 31.2% (30% + 4% cess)</TableCaption>
                  </Table>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-4 text-sm">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-700">
                        The actual tax savings will depend on your income tax slab. The above calculation assumes the highest tax slab of 30% plus 4% cess.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Tax Planning Tips</CardTitle>
                  <CardDescription>Strategic advice for maximizing deductions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Mix Investments Wisely
                      </h3>
                      <p className="text-sm">
                        Distribute your ₹1.5 lakh Section 80C investments across different instruments based on your goals, risk tolerance, and liquidity needs.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Health Insurance is a Must
                      </h3>
                      <p className="text-sm">
                        Beyond tax savings, having adequate health insurance for you and your family provides crucial financial protection.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        NPS for Additional Savings
                      </h3>
                      <p className="text-sm">
                        Contribute to NPS to get an additional ₹50,000 deduction under Section 80CCD(1B) beyond the ₹1.5 lakh limit.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Don't Miss House Rent Payments
                      </h3>
                      <p className="text-sm">
                        If not eligible for HRA, claim deduction under Section 80GG for rent paid.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Compare Tax Regimes
                      </h3>
                      <p className="text-sm">
                        Always calculate your tax liability under both old and new tax regimes to determine which is more beneficial for you.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button asChild variant="outline">
                      <Link href="/tax-expert" className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Consult Our Tax Expert
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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

export default TaxDeductions;
