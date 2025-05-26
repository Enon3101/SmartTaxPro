import React from 'react';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  HelpCircle,
  Info,
  Laptop,
  Lightbulb, // Added Lightbulb
  ListChecks,
  Upload,
  User,
  XCircle,
} from 'lucide-react';

const EFilingGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tax-resources">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tax Resources
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Assessment Year 2025-26</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Laptop className="h-7 w-7 text-primary" />
            Complete e-Filing Guide
          </h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive step-by-step guide to filing your income tax returns online in India
          </p>
        </div>
        
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="steps">Filing Steps</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <ListChecks className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Filing Process Overview</h2>
                  <p className="text-muted-foreground">
                    The e-filing process involves registering on the Income Tax portal, gathering necessary documents, 
                    selecting the appropriate ITR form, filling in your details, verifying the return, and tracking its status. 
                    This guide will walk you through each step in detail.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button asChild size="sm">
                      <a href="https://www.incometax.gov.in/iec/foportal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Official IT Portal
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Use Our ITR Wizard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Step-by-Step Guide to e-Filing</h2>
              
              <Card id="step1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <div>
                      <CardTitle>Registration & Login</CardTitle>
                      <CardDescription>Create your account on the Income Tax e-Filing portal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">For First-Time Users:</h3>
                      <ol className="space-y-2 ml-5 list-decimal">
                        <li>Visit the <a href="https://www.incometax.gov.in/iec/foportal" target="_blank" rel="noopener noreferrer" className="text-primary underline">Income Tax e-Filing portal</a></li>
                        <li>Click on "Register Yourself"</li>
                        <li>Select the appropriate user type (Individual)</li>
                        <li>Enter your PAN details</li>
                        <li>Verify with Aadhaar OTP</li>
                        <li>Create a password and set security questions</li>
                        <li>Complete your profile information</li>
                      </ol>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-2">
                        <div className="flex gap-2">
                          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-700">
                            Ensure your PAN is linked with your Aadhaar as it's mandatory for filing returns. You can check the status on the Income Tax portal.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">For Returning Users:</h3>
                      <ol className="space-y-2 ml-5 list-decimal">
                        <li>Visit the Income Tax e-Filing portal</li>
                        <li>Enter your User ID (PAN), password, and captcha</li>
                        <li>For added security, enable two-factor authentication</li>
                      </ol>
                      
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mt-2">
                        <div className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-800">Forgot Password?</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              Use the "Forgot Password" option on the login page. You'll need your PAN, registered mobile/email, and date of birth for verification.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-dashed rounded-md mt-4">
                        <h4 className="font-medium mb-1">Common Login Issues:</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>Invalid credentials - Double-check your PAN and password</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>Security question mismatch - Case-sensitive answers</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>Locked account - Wait 24 hours or contact support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="step2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div>
                      <CardTitle>Gather Required Documents</CardTitle>
                      <CardDescription>Collect all necessary details and documents for filing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Essential Documents</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Form 16</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Salary certificate from your employer with TDS details</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Form 26AS</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Tax credit statement showing TDS deducted on your income</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Annual Information Statement (AIS)</span>
                            <p className="text-sm text-muted-foreground mt-0.5">Comprehensive statement of your financial transactions</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Bank Statements</span>
                            <p className="text-sm text-muted-foreground mt-0.5">For interest income and verification purposes</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Investment & Deduction Proofs</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Section 80C Investments</span>
                            <p className="text-sm text-muted-foreground mt-0.5">PPF, ELSS, Life Insurance, Fixed Deposits, etc.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Health Insurance Premiums</span>
                            <p className="text-sm text-muted-foreground mt-0.5">For Section 80D deductions</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Home Loan Interest Certificate</span>
                            <p className="text-sm text-muted-foreground mt-0.5">For Section 24 interest deduction</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <span className="font-medium">Donation Receipts</span>
                            <p className="text-sm text-muted-foreground mt-0.5">For Section 80G deductions</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Download className="h-5 w-5 text-blue-600" />
                      How to Access Key Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div className="space-y-1">
                        <p className="font-medium">Form 26AS:</p>
                        <ol className="list-decimal ml-5 space-y-1">
                          <li>Login to Income Tax portal</li>
                          <li>Go to "Services" > "Annual Tax Statements"</li>
                          <li>Select "View Form 26AS (Tax Credit)"</li>
                          <li>Select assessment year and view/download</li>
                        </ol>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Annual Information Statement (AIS):</p>
                        <ol className="list-decimal ml-5 space-y-1">
                          <li>Login to Income Tax portal</li>
                          <li>Go to "Services" > "Annual Information Statement"</li>
                          <li>View AIS details for the relevant year</li>
                          <li>Download PDF or JSON format</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="step3">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <div>
                      <CardTitle>Select the Correct ITR Form</CardTitle>
                      <CardDescription>Choose the appropriate ITR form based on your income sources</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p>
                      Selecting the correct Income Tax Return (ITR) form is crucial. The form depends on your income sources, 
                      total income, and residential status. Using an incorrect form may lead to defective returns.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-1 flex items-center gap-2">
                          <Badge>ITR-1 (Sahaj)</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">For individuals with:</p>
                        <ul className="text-xs space-y-1">
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Income up to ₹50 lakhs</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Salary/Pension income</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>One house property</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Other sources (except gambling)</span>
                          </li>
                        </ul>
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/tax-resources/itr1">View Details</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-1 flex items-center gap-2">
                          <Badge>ITR-2</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">For individuals/HUFs with:</p>
                        <ul className="text-xs space-y-1">
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Capital gains</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Foreign income/assets</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Multiple properties</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Lottery/gambling income</span>
                          </li>
                        </ul>
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/tax-resources/itr2">View Details</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-1 flex items-center gap-2">
                          <Badge>ITR-3</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">For individuals/HUFs with:</p>
                        <ul className="text-xs space-y-1">
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Business/profession income</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Partners in firms</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Proprietary business owners</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Any applicable income</span>
                          </li>
                        </ul>
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/tax-resources/itr3">View Details</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium mb-1 flex items-center gap-2">
                          <Badge>ITR-4 (Sugam)</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">For individuals/HUFs/firms with:</p>
                        <ul className="text-xs space-y-1">
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Presumptive income (Sec 44AD)</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Professional income (Sec 44ADA)</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Transport business (Sec 44AE)</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                            </div>
                            <span>Income up to ₹50 lakhs</span>
                          </li>
                        </ul>
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/tax-resources/itr4">View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <Button asChild>
                        <Link href="/itr-forms-guide" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Complete ITR Forms Guide
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="step4">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <div>
                      <CardTitle>Filing Your Return</CardTitle>
                      <CardDescription>Step-by-step process to fill and submit your ITR</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Option 1: Filing Online (Java Utility/Excel Utility)</h3>
                      <ol className="space-y-4 ml-5 list-decimal">
                      <li>
                        <div className="font-medium">Login to the Income Tax e-Filing Portal</div>
                        <p className="text-sm text-muted-foreground">Access your account using your PAN and password</p>
                      </li>
                      <li>
                        <div className="font-medium">Navigate to "e-File" > "Income Tax Returns" > "File Income Tax Return"</div>
                        <p className="text-sm text-muted-foreground">Select the assessment year and filing mode</p>
                      </li>
                      <li>
                        <div className="font-medium">Choose the appropriate ITR form based on your income sources</div>
                        <p className="text-sm text-muted-foreground">The portal may suggest a form based on your income profile</p>
                      </li>
                      <li>
                        <div className="font-medium">Fill in Personal Information</div>
                        <p className="text-sm text-muted-foreground">Review pre-filled details and complete any missing information</p>
                      </li>
                      <li>
                        <div className="font-medium">Enter Income Details</div>
                        <p className="text-sm text-muted-foreground">Input income from salary, house property, capital gains, other sources, etc.</p>
                      </li>
                      <li>
                        <div className="font-medium">Claim Deductions and Tax-Saving Investments</div>
                        <p className="text-sm text-muted-foreground">Enter details under sections 80C, 80D, 80G, etc. as applicable</p>
                      </li>
                      <li>
                        <div className="font-medium">Enter Tax Payment Details</div>
                        <p className="text-sm text-muted-foreground">TDS, TCS, advance tax, and self-assessment tax paid</p>
                      </li>
                      <li>
                        <div className="font-medium">Review Tax Calculation</div>
                        <p className="text-sm text-muted-foreground">Check calculated tax liability, refund, or additional tax payable</p>
                      </li>
                      <li>
                        <div className="font-medium">Pay Any Additional Tax (if applicable)</div>
                        <p className="text-sm text-muted-foreground">Use the "Pay Tax" option to clear any remaining tax liability</p>
                      </li>
                      <li>
                        <div className="font-medium">Submit Your Return</div>
                        <p className="text-sm text-muted-foreground">Review all entries and submit to complete the filing process</p>
                      </li>
                    </ol>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-4">
                      <div className="flex gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Pre-filled Data</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            The portal pre-fills data from Form 26AS, AIS, and TIS including salary, interest income, dividends, 
                            and tax payments. Always verify this information against your documents for accuracy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Option 2: Offline Utilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Excel/Java Utility Method</h4>
                        <ol className="space-y-2 ml-4 list-decimal text-sm">
                          <li>Download the appropriate utility from the portal</li>
                          <li>Fill in the required details offline</li>
                          <li>Validate and generate an XML file</li>
                          <li>Upload the XML file to the Income Tax portal</li>
                          <li>Submit the return online after verification</li>
                        </ol>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">JSON Utility Method</h4>
                        <ol className="space-y-2 ml-4 list-decimal text-sm">
                          <li>Download pre-filled JSON file from portal</li>
                          <li>Import into the offline JSON utility</li>
                          <li>Complete and validate the return</li>
                          <li>Upload the final JSON file to the portal</li>
                          <li>Submit after final review</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Important Note</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            Even when using offline utilities, you must upload the final file to the Income Tax portal and 
                            verify your return. Without verification, your return is considered invalid.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Option 3: Using Our ITR Wizard</h3>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="text-sm mb-3">
                        Our platform offers a simplified step-by-step ITR filing wizard that guides you through the entire process:
                      </p>
                      <ol className="space-y-2 ml-4 list-decimal text-sm">
                        <li>Start our ITR wizard and choose the correct form</li>
                        <li>Enter personal, income, and deduction details</li>
                        <li>Review calculated tax liability or refund</li>
                        <li>Preview your return and submit</li>
                        <li>Verify the return using any available method</li>
                      </ol>
                      <div className="mt-4">
                        <Button asChild>
                          <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Start ITR Wizard
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="step5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">5</span>
                    </div>
                    <div>
                      <CardTitle>Verify Your Return</CardTitle>
                      <CardDescription>Complete the verification process to validate your return</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    After submitting your ITR, verification is mandatory within 30 days. Without verification, 
                    your ITR is considered invalid. You can choose from several verification methods:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="border p-3 rounded-md">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Fingerprint className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Aadhaar OTP</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              The quickest method. Generate an OTP on your registered mobile linked with Aadhaar.
                            </p>
                            <div className="text-xs mt-2 text-green-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Instant verification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Net Banking</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Verify through your bank's net banking portal. Available for major banks.
                            </p>
                            <div className="text-xs mt-2 text-green-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Instant verification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Upload className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Electronic Verification Code (EVC)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Generate an EVC via the Income Tax portal, bank account, or registered email/mobile.
                            </p>
                            <div className="text-xs mt-2 text-green-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Instant verification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="border p-3 rounded-md">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Digital Signature Certificate (DSC)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              For those with a valid Digital Signature Certificate, usually companies and professionals.
                            </p>
                            <div className="text-xs mt-2 text-green-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Instant verification</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Physical ITR-V</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Print, sign, and mail the acknowledgment form to CPC, Bengaluru within 120 days of filing.
                            </p>
                            <div className="text-xs mt-2 text-amber-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Takes 2-3 weeks for processing</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex gap-2">
                          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">Verification Steps</h4>
                            <ol className="text-sm text-blue-700 mt-1 space-y-1 list-decimal ml-4">
                              <li>Login to the Income Tax portal</li>
                              <li>Go to 'e-Verify Return' section</li>
                              <li>Select the pending return to verify</li>
                              <li>Choose your preferred verification method</li>
                              <li>Complete the verification process</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mt-2">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Critical Reminder</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          An unverified return is considered invalid. Always verify your return within 30 days of filing. 
                          ITR-V physical verification has an extended deadline of 120 days.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="step6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">6</span>
                    </div>
                    <div>
                      <CardTitle>Track Your Return Status</CardTitle>
                      <CardDescription>Monitor the processing of your tax return</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    After filing and verifying your return, you can track its status through the Income Tax portal. 
                    The processing typically takes 20-45 days, after which you'll receive either a refund or an intimation notice.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h3 className="font-medium">How to Check ITR Status</h3>
                    <ol className="space-y-2 ml-5 list-decimal text-sm">
                      <li>Login to the Income Tax e-Filing portal</li>
                      <li>Go to 'View Filed Returns' or 'View Returns/Forms'</li>
                      <li>Select the relevant assessment year</li>
                      <li>Check the status column for your return</li>
                      <li>For more details, click on the acknowledgment number</li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-3 rounded-md">
                      <h3 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Return Filed
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ITR submitted successfully but verification pending
                      </p>
                    </div>
                    
                    <div className="border p-3 rounded-md">
                      <h3 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Return Verified
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ITR verified successfully, awaiting processing
                      </p>
                    </div>
                    
                    <div className="border p-3 rounded-md">
                      <h3 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Return Processed
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Processing complete, refund initiated or tax confirmed
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">What Happens After Processing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-md">
                        <h4 className="font-medium text-green-700 mb-2">If You're Due a Refund</h4>
                        <ol className="space-y-1 ml-4 list-decimal text-sm text-green-700">
                          <li>The amount will be directly credited to your bank account</li>
                          <li>Track refund status on NSDL TIN website or Income Tax portal</li>
                          <li>Refund typically processed within 20-60 days of assessment</li>
                          <li>You'll receive an intimation under Section 143(1)</li>
                        </ol>
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-md">
                        <h4 className="font-medium text-amber-700 mb-2">If There's Additional Tax Due</h4>
                        <ol className="space-y-1 ml-4 list-decimal text-sm text-amber-700">
                          <li>You'll receive an intimation under Section 143(1)</li>
                          <li>Pay the additional tax within 30 days of intimation</li>
                          <li>If you disagree, you can file a rectification request</li>
                          <li>Non-payment may lead to interest and penalties</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Notice or Assessment</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          In some cases, your return may be selected for detailed scrutiny under Section 143(2). 
                          If you receive such a notice, gather all supporting documents and respond within the specified timeframe.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Answers to common questions about income tax filing in India
                  </p>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is the last date for filing income tax returns?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>For Assessment Year 2025-26 (Financial Year 2024-25):</p>
                    <ul className="space-y-1 list-disc ml-5">
                      <li>For individuals and entities not requiring tax audit: <span className="font-medium">July 31, 2025</span></li>
                      <li>For companies and taxpayers requiring tax audit: <span className="font-medium">October 31, 2025</span></li>
                      <li>For individuals with international transactions: <span className="font-medium">November 30, 2025</span></li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Note: These dates are subject to extension by the Income Tax Department. Always check the official portal for the latest deadlines.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it mandatory to file an income tax return?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>Filing an ITR is mandatory if you fall under any of these categories:</p>
                    <ul className="space-y-1 list-disc ml-5">
                      <li>Your total income exceeds the basic exemption limit (₹3 lakh in new regime, ₹2.5 lakh in old regime)</li>
                      <li>You're a company or firm, regardless of profit or loss</li>
                      <li>You want to claim an income tax refund</li>
                      <li>You have foreign assets or foreign income</li>
                      <li>You've deposited more than ₹1 crore in current accounts</li>
                      <li>You've spent more than ₹2 lakh on foreign travel</li>
                      <li>You've spent more than ₹1 lakh on electricity consumption</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Even if not mandatory, filing returns is recommended for creating a financial record, facilitating loan approvals, visa applications, etc.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens if I miss the ITR filing deadline?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>If you miss the regular filing deadline, you can still file a belated return:</p>
                    <ul className="space-y-1 list-disc ml-5">
                      <li>Belated returns can be filed until December 31, 2025 (for AY 2025-26)</li>
                      <li>Late filing fee under Section 234F:</li>
                      <ul className="ml-5 space-y-1 list-disc">
                        <li>₹5,000 if filed after the due date but before December 31, 2025</li>
                        <li>₹10,000 if filed after December 31, 2025 but before March 31, 2026</li>
                        <li>₹1,000 for small taxpayers with income up to ₹5 lakhs</li>
                      </ul>
                      <li>Interest under Section 234A at 1% per month on any tax due</li>
                      <li>Loss of certain benefits like inability to carry forward certain losses</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      After March 31, 2026, you cannot file a return for AY 2025-26 at all.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I revise my income tax return after filing?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>Yes, you can revise your return if you discover any omission or error:</p>
                    <ul className="space-y-1 list-disc ml-5">
                      <li>You can file a revised return any time before the end of the relevant assessment year or before completion of assessment, whichever is earlier</li>
                      <li>For AY 2025-26, revised returns can be filed until March 31, 2026</li>
                      <li>You can revise your return multiple times within this timeframe</li>
                      <li>You need your original acknowledgment number to file a revised return</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Note: Belated returns (filed after the original due date) can also be revised, but within the same deadlines.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need to submit documents while filing ITR?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>No, the income tax filing process in India follows a self-assessment system:</p>
                    <ul className="space-y-1 list-disc ml-5">
                      <li>You're not required to upload or attach any documents with your ITR</li>
                      <li>However, you must keep all supporting documents with you for at least 6 years</li>
                      <li>If your return is selected for scrutiny or verification, you'll need to produce these documents</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Important documents to preserve include Form 16, Form 26AS, investment proofs, bank statements, property documents, etc.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>How can I check my tax refund status?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>You can check your refund status in two ways:</p>
                    <ol className="space-y-2 list-decimal ml-5">
                      <li>
                        <span className="font-medium">Through the Income Tax e-Filing Portal:</span>
                        <ul className="space-y-1 list-disc ml-5 mt-1">
                          <li>Login to the Income Tax e-Filing portal</li>
                          <li>Go to 'View Filed Returns/Forms'</li>
                          <li>Select the relevant assessment year</li>
                          <li>Click on the acknowledgment number to view detailed status</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-medium">Through NSDL TIN Website:</span>
                        <ul className="space-y-1 list-disc ml-5 mt-1">
                          <li>Visit the <a href="https://tin.tin.nsdl.com/oltas/refund-status-pan.html" target="_blank" rel="noopener noreferrer" className="text-primary underline">NSDL TIN website</a></li>
                          <li>Enter your PAN and assessment year</li>
                          <li>View the refund status</li>
                        </ul>
                      </li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-2">
                      The refund process typically takes 20-60 days after your return is processed. Any refund will be directly credited to the bank account mentioned in your ITR.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>Which tax regime should I choose - new or old?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>The choice between the new and old tax regimes depends on your financial situation:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-1">Choose Old Regime If:</h4>
                        <ul className="space-y-1 list-disc ml-5 text-sm text-blue-700">
                          <li>You claim significant deductions (80C, 80D, etc.)</li>
                          <li>You have a home loan (interest deduction)</li>
                          <li>You have multiple house properties</li>
                          <li>Your total deductions exceed ₹2.5 lakhs</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md">
                        <h4 className="font-medium text-green-700 mb-1">Choose New Regime If:</h4>
                        <ul className="space-y-1 list-disc ml-5 text-sm text-green-700">
                          <li>You don't claim many deductions</li>
                          <li>You're early in your career with few investments</li>
                          <li>Your income is up to ₹7 lakhs (for full rebate)</li>
                          <li>You prefer simplicity in tax filing</li>
                        </ul>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Use our <Link href="/calculators/tax-regime" className="text-primary underline">Tax Regime Comparison Calculator</Link> to determine which regime is more beneficial for your specific situation.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger>What is Form 26AS and AIS, and why are they important?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>Form 26AS and AIS are essential documents for accurate tax filing:</p>
                    
                    <div className="bg-muted p-3 rounded-md mt-2">
                      <h4 className="font-medium mb-1">Form 26AS (Annual Tax Statement):</h4>
                      <ul className="space-y-1 list-disc ml-5 text-sm">
                        <li>Contains details of tax deducted/collected at source (TDS/TCS)</li>
                        <li>Shows advance tax and self-assessment tax paid</li>
                        <li>Includes tax refunds and high-value transactions</li>
                        <li>Helps verify if all TDS credits are reflected in your return</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md mt-2">
                      <h4 className="font-medium mb-1">Annual Information Statement (AIS):</h4>
                      <ul className="space-y-1 list-disc ml-5 text-sm">
                        <li>More comprehensive than Form 26AS</li>
                        <li>Contains information about financial transactions from various sources</li>
                        <li>Includes interest income, dividends, capital gains, foreign remittances</li>
                        <li>Shows purchases, sales, property transactions, and more</li>
                      </ul>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Always reconcile these documents with your records before filing your ITR to ensure accuracy and avoid discrepancies that might trigger notices from the tax department.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9">
                <AccordionTrigger>How do I claim TDS refund in my income tax return?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>If excess TDS has been deducted from your income, you can claim a refund by:</p>
                    <ol className="space-y-1 list-decimal ml-5">
                      <li>Filing your ITR and reporting all income accurately</li>
                      <li>Ensuring all TDS details from Form 26AS are correctly reflected in your ITR</li>
                      <li>Claiming all eligible deductions and exemptions</li>
                      <li>The system automatically calculates refund if TDS exceeds tax liability</li>
                      <li>Providing correct bank account details in your ITR for direct credit of refund</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-2">
                      After processing, if the department confirms that excess tax has been paid, the refund amount will be directly credited to your bank account. You can track the status through the Income Tax portal or NSDL website.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10">
                <AccordionTrigger>What should I do if I receive a tax notice?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>If you receive a tax notice, follow these steps:</p>
                    <ol className="space-y-2 list-decimal ml-5">
                      <li>
                        <span className="font-medium">Don't panic</span>
                        <p className="text-sm text-muted-foreground">Not all notices indicate problems; some are routine</p>
                      </li>
                      <li>
                        <span className="font-medium">Identify the notice type</span>
                        <p className="text-sm text-muted-foreground">Common notices include Section 143(1) intimation, 139(9) defective return, 154 rectification</p>
                      </li>
                      <li>
                        <span className="font-medium">Note the compliance deadline</span>
                        <p className="text-sm text-muted-foreground">Every notice has a response timeline that must be adhered to</p>
                      </li>
                      <li>
                        <span className="font-medium">Gather relevant documents</span>
                        <p className="text-sm text-muted-foreground">Collect all supporting documents related to the issue in the notice</p>
                      </li>
                      <li>
                        <span className="font-medium">Submit your response</span>
                        <p className="text-sm text-muted-foreground">Respond through the Income Tax portal or as specified in the notice</p>
                      </li>
                      <li>
                        <span className="font-medium">Keep a record</span>
                        <p className="text-sm text-muted-foreground">Maintain copies of all communications and acknowledgments</p>
                      </li>
                    </ol>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mt-2">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700">
                          If the notice is complex or involves significant amounts, consider consulting a tax professional or using our <Link href="/tax-expert" className="text-amber-600 underline">Tax Expert Service</Link>.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-center mt-8">
              <Button asChild variant="outline">
                <Link href="/tax-expert" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Ask Our Tax Expert
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-6 mt-6">
            <div className="bg-primary/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="rounded-full bg-primary/10 p-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Tips for Smoother & Error-Free Filing</h2>
                  <p className="text-muted-foreground">
                    Proven strategies to make your tax filing process more efficient and avoid common mistakes
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Before Filing
                  </CardTitle>
                  <CardDescription>Preparation tips for efficient filing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Reconcile Financial Documents</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Cross-check Form 16, 26AS, and AIS to ensure all income and TDS details match.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Organize Deduction Proofs</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Compile all investment proofs by category (80C, 80D, etc.) before starting.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Update Personal Information</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Ensure your contact details, bank account information, and address are current.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Check PAN-Aadhaar Linking</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Verify your PAN is linked with Aadhaar, as it's mandatory for filing.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">5</span>
                      </div>
                      <div>
                        <p className="font-medium">Calculate Tax Liability</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Pre-calculate your expected tax liability to identify any shortfall.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    During Filing
                  </CardTitle>
                  <CardDescription>Best practices while completing your ITR</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Use Pre-filled Data Carefully</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Verify all pre-filled information and correct any discrepancies.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Report All Income Sources</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Declare all income, even if TDS wasn't deducted or it's below taxable limits.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Save Work Frequently</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Use the 'Save Draft' feature to prevent data loss during the filing process.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Double-Check Bank Details</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Ensure bank account details are accurate for refund processing.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">5</span>
                      </div>
                      <div>
                        <p className="font-medium">Use the Calculator Tool</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Utilize the built-in tax calculator to verify your final tax computation.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    After Filing
                  </CardTitle>
                  <CardDescription>Post-filing actions and follow-ups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Verify Immediately</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Complete the verification process right after filing, preferably via Aadhaar OTP.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Save Acknowledgment</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Download and save your ITR-V acknowledgment for future reference.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Monitor Processing Status</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Regularly check your ITR processing status on the Income Tax portal.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Track Refund Status</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          If expecting a refund, check its status using the NSDL TIN website.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">5</span>
                      </div>
                      <div>
                        <p className="font-medium">Respond to Notices Promptly</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Address any notices or queries from the tax department without delay.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Common Mistakes to Avoid</CardTitle>
                <CardDescription>Frequent errors that can lead to notices or processing delays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Selecting Incorrect ITR Form</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Using the wrong form can lead to a defective return. Choose based on your income sources.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Missing Income Sources</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Failing to report all income sources, especially those in AIS/26AS, can trigger notices.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">TDS Mismatch</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Ensure TDS claimed in your return matches with Form 26AS and AIS.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Filing Without Verification</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          An unverified return is considered invalid. Always complete verification within 30 days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Incorrect Bank Details</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Wrong account information can delay or misdirect your tax refund.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Invalid Deduction Claims</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Claiming deductions without eligible investments or expenses can lead to scrutiny.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Double Reporting Income</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Entering the same income in multiple sections leads to inflated tax liability.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ignoring High-Value Transactions</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Large transactions reported to the tax department should be properly accounted for.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Last-Minute Filing</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Rushing on the last day can lead to errors and portal congestion issues.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Not Checking e-Filed Return</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Review your submitted return for accuracy before verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Filing Tips</CardTitle>
                <CardDescription>Expert strategies for maximizing benefits and minimizing errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        Optimizing Tax Planning
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-700">
                            Compare both tax regimes using our calculator to determine which is more beneficial for you
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-700">
                            Consider tax-efficient investment options that align with your financial goals
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-700">
                            Maximize less-known deductions like NPS additional contribution (80CCD1B) and interest on education loans (80E)
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-md">
                      <h3 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        Handling Capital Gains Effectively
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700">
                            Maintain detailed records of purchase dates and costs for accurate capital gains calculation
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700">
                            Use indexation benefits for long-term capital gains on non-equity assets
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700">
                            Consider tax-saving investment options under Section 54EC for property capital gains
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-md">
                      <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-purple-600" />
                        For Business Income Filers
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                          </div>
                          <p className="text-sm text-purple-700">
                            Consider presumptive taxation (Section 44AD/ADA) if eligible to simplify compliance
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                          </div>
                          <p className="text-sm text-purple-700">
                            Maintain proper books of accounts and documentation for all business expenses
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                          </div>
                          <p className="text-sm text-purple-700">
                            Reconcile GST returns with income tax returns to avoid discrepancies
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-md">
                      <h3 className="font-medium text-amber-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                        For International Income
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-amber-600" />
                          </div>
                          <p className="text-sm text-amber-700">
                            Report all foreign assets in Schedule FA, even if they don't generate income
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-amber-600" />
                          </div>
                          <p className="text-sm text-amber-700">
                            Claim Foreign Tax Credit for taxes paid in other countries (Form 67 required)
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-amber-600" />
                          </div>
                          <p className="text-sm text-amber-700">
                            Be aware of DTAA (Double Taxation Avoidance Agreement) benefits where applicable
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-md mt-6">
                  <h3 className="font-medium mb-3">Income Tax Filing Calendar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium mb-1 text-sm">April-June</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Collect Form 16, investment proofs</li>
                        <li>• Pay any remaining advance tax</li>
                        <li>• June 15th: First installment of advance tax</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium mb-1 text-sm">July-September</h4>
                      <ul className="text-xs space-y-1">
                        <li>• July 31st: Due date for individuals</li>
                        <li>• Check Form 26AS and AIS</li>
                        <li>• Sept 15th: Second advance tax installment</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium mb-1 text-sm">October-December</h4>
                      <ul className="text-xs space-y-1">
                        <li>• Oct 31st: Due date for audit cases</li>
                        <li>• Dec 15th: Third advance tax installment</li>
                        <li>• Dec 31st: Last date for belated returns</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium mb-1 text-sm">January-March</h4>
                      <ul className="text-xs space-y-1">
                        <li>• March 15th: Final advance tax payment</li>
                        <li>• March 31st: Absolute final date for returns</li>
                        <li>• Plan investments for next year</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                  Start Filing Your Return <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EFilingGuide;
