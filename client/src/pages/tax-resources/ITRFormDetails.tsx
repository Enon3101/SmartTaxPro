import React from 'react';
import { Link, useRoute } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ExternalLink,
  FileText,
  Info,
  X,
} from 'lucide-react';

// ITR Form data
const itrForms = {
  'itr1': {
    id: 'itr-1',
    name: 'ITR-1 (Sahaj)',
    description: 'The simplest form for individuals with income from salary, one house property, and other sources (interest etc.)',
    eligibleFor: [
      'Individuals with total income up to ₹50 lakhs',
      'Income from Salary/Pension',
      'Income from One House Property',
      'Income from Other Sources (excluding lottery, gambling, horse racing)',
    ],
    notEligibleFor: [
      'Income from Business/Profession',
      'Capital Gains',
      'Foreign Income',
      'Agricultural Income exceeding ₹5,000',
      'Director in a company',
      'Investments in unlisted equity shares',
      'Multiple house properties',
    ],
    dueDate: 'July 31, 2025',
    additionalInfo: 'The simplest ITR form and the most commonly used. This form is suitable for most salaried individuals with simple income sources.',
    documentsList: [
      'Form 16 from employer',
      'Form 26AS tax credit statement',
      'Interest certificates from banks',
      'House rent receipts (if claiming HRA)',
      'Investment proofs for tax-saving deductions',
    ],
    blogs: [
      {
        title: 'Complete Guide to ITR-1 Filing for Salaried Employees',
        slug: 'itr-1-guide-for-salaried',
        excerpt: "Learn step-by-step how to file your ITR-1 if you're a salaried employee with simple income sources.",
      },
      {
        title: 'Key Deductions You Can Claim in ITR-1',
        slug: 'key-deductions-itr-1',
        excerpt: 'Maximize your tax savings by understanding all eligible deductions when filing ITR-1.',
      },
    ],
  },
  'itr2': {
    id: 'itr-2',
    name: 'ITR-2',
    description: 'For individuals and HUFs with income from salary, house property, capital gains, and other sources',
    eligibleFor: [
      'Individuals with income from Salary/Pension',
      'Income from One or More House Properties',
      'Capital Gains/Losses',
      'Income from Other Sources (including lottery, gambling)',
      'Foreign Income or Foreign Assets',
      'Taxpayers having Director in a company',
      'Holding unlisted equity shares',
    ],
    notEligibleFor: [
      'Income from Business/Profession',
      'Income eligible to be declared in ITR-1 and no other conditions making ITR-2 mandatory',
    ],
    dueDate: 'July 31, 2025',
    additionalInfo: 'More comprehensive than ITR-1 and suitable for individuals with capital gains, foreign income, or multiple house properties.',
    documentsList: [
      'Form 16 from employer',
      'Form 26AS tax credit statement',
      'Capital gains statements from broker',
      'Interest certificates from banks',
      'Property documents for rental income',
      'Foreign income and asset details',
      'Director identification number (DIN) for company directors',
      'Unlisted equity share details',
    ],
    blogs: [
      {
        title: 'How to Report Capital Gains in ITR-2 Correctly',
        slug: 'capital-gains-reporting-itr-2',
        excerpt: 'Comprehensive guide on reporting various types of capital gains correctly in your ITR-2.',
      },
      {
        title: 'ITR-2 vs ITR-1: Which Form Should You Choose?',
        slug: 'itr-2-vs-itr-1-comparison',
        excerpt: 'Understand the key differences between ITR-1 and ITR-2 to choose the right form for your income profile.',
      },
    ],
  },
  'itr3': {
    id: 'itr-3',
    name: 'ITR-3',
    description: 'For individuals and HUFs having income from business or profession',
    eligibleFor: [
      'Individuals and HUFs with income from Business or Profession',
      'Individuals with Presumptive Income under sections 44AD, 44ADA, and 44AE',
      'Partners in firms with salary and interest income',
      'Income from all other applicable sources (Salary, House Property, Capital Gains, Other Sources)',
    ],
    notEligibleFor: [
      'Individuals with no income from Business or Profession who qualify for ITR-1 or ITR-2',
    ],
    dueDate: 'July 31, 2025',
    additionalInfo: 'Suitable for self-employed individuals, professionals, and business owners. Involves more detailed financial reporting.',
    documentsList: [
      'Business financial statements (P&L, Balance Sheet)',
      'Books of accounts',
      'Bank statements',
      'GST returns (if applicable)',
      'Expense receipts and invoices',
      'TDS certificates',
      'Investment proofs for tax-saving deductions',
      'Audit report if turnover exceeds specified limits',
    ],
    blogs: [
      {
        title: 'Business Expense Deductions in ITR-3: A Complete Guide',
        slug: 'business-expense-deductions-itr-3',
        excerpt: 'Learn which business expenses are deductible and how to claim them correctly in your ITR-3.',
      },
      {
        title: 'How to File ITR-3 for Professionals and Consultants',
        slug: 'itr-3-guide-for-professionals',
        excerpt: 'Step-by-step guide for professionals and consultants on filing ITR-3 with presumptive taxation.',
      },
    ],
  },
  'itr4': {
    id: 'itr-4',
    name: 'ITR-4 (Sugam)',
    description: 'For presumptive income from business and profession',
    eligibleFor: [
      'Individuals, HUFs and Firms (other than LLP) with presumptive income under 44AD, 44ADA, and 44AE',
      'Individuals with total income up to ₹50 lakhs',
      'Income from Salary/Pension',
      'Income from One House Property',
      'Income from Other Sources (excluding lottery, gambling)',
    ],
    notEligibleFor: [
      'Capital Gains',
      'Foreign Income or Foreign Assets',
      'Agricultural Income exceeding ₹5,000',
      'Income from more than one house property',
      'Individuals having Director in a company',
      'Income from commission or brokerage over ₹50 lakhs',
      'Investments in unlisted equity shares',
    ],
    dueDate: 'July 31, 2025',
    additionalInfo: 'Simplified form for small businesses and professionals who opt for presumptive taxation schemes, which allows them to declare income at a prescribed percentage without maintaining detailed books of accounts.',
    documentsList: [
      'Bank statements',
      'Sales receipts/invoices',
      'Details of business expenses',
      'Vehicle details (for transport business)',
      'GST registration details (if applicable)',
      'TDS certificates',
      'Investment proofs for tax-saving deductions',
    ],
    blogs: [
      {
        title: 'Presumptive Taxation Schemes Explained for ITR-4 Filers',
        slug: 'presumptive-taxation-schemes-itr-4',
        excerpt: 'Understand the 44AD, 44ADA, and 44AE presumptive taxation schemes and when to opt for them.',
      },
      {
        title: 'Record-Keeping Requirements for ITR-4 Filers',
        slug: 'record-keeping-itr-4',
        excerpt: 'Learn what books and records you need to maintain even when filing under presumptive taxation.',
      },
    ],
  },
};

const ITRFormDetails = () => {
  const [, params] = useRoute('/tax-resources/:formId');
  const formId = params?.formId;
  
  // Default to ITR-1 if no valid form ID is provided
  const formData = formId && itrForms[formId] ? itrForms[formId] : itrForms['itr1'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/itr-forms-guide">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to ITR Forms Guide
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Tax Year 2025-26</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            {formData.name}
          </h1>
          <p className="text-muted-foreground text-lg">{formData.description}</p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Key information about {formData.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{formData.additionalInfo}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Due Date</h3>
                    <div className="flex items-center">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {formData.dueDate}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Who should file {formData.name}?</h3>
                  <p className="text-muted-foreground mb-4">This form is suitable for:</p>
                  <ul className="space-y-2">
                    {formData.eligibleFor.map((item, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Important Note</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Filing the wrong ITR form may result in a defective return notice from the Income Tax Department. Verify your eligibility before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Related Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {formData.blogs.map((blog, index) => (
                      <li key={index}>
                        <Link href={`/learning/blog/${blog.slug}`} className="flex gap-2 p-3 border rounded-md hover:bg-muted transition-colors">
                          <Info className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <div className="font-medium">{blog.title}</div>
                            <p className="text-sm text-muted-foreground mt-1">{blog.excerpt}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a 
                        href="https://www.incometax.gov.in/iec/foportal" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex gap-2 p-3 border rounded-md hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">Official Income Tax Filing Portal</div>
                          <p className="text-sm text-muted-foreground mt-1">The official government portal for filing your income tax returns</p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Filing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link href="/tax-filing/itr-wizard">Start Filing with Our Wizard</Link>
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Alternative Filing Methods:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-1" />
                        <span>Income Tax Department's e-Filing portal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-1" />
                        <span>Tax Utility Software (Java/Excel)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-1" />
                        <span>Through a Tax Professional (CA/Tax Expert)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="eligibility" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      Who Can File {formData.name}
                    </CardTitle>
                    <Badge variant="secondary">Eligible</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formData.eligibleFor.map((item, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <X className="h-5 w-5 text-red-600 mr-2" />
                      Who Cannot File {formData.name}
                    </CardTitle>
                    <Badge variant="destructive">Not Eligible</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formData.notEligibleFor.map((item, index) => (
                      <li key={index} className="flex">
                        <X className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">Income Sources</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <ul className="space-y-2">
                        {formId === 'itr1' && (
                          <>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Salary/Pension</span>
                                <p className="text-sm text-muted-foreground">Income from employment or pension received</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">One House Property</span>
                                <p className="text-sm text-muted-foreground">Income/loss from a single house property</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Other Sources</span>
                                <p className="text-sm text-muted-foreground">Interest income, family pension, etc. (excluding lottery, gambling, horse racing)</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr2' && (
                          <>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Salary/Pension</span>
                                <p className="text-sm text-muted-foreground">Income from employment or pension received</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Multiple House Properties</span>
                                <p className="text-sm text-muted-foreground">Income/loss from more than one house property</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Capital Gains/Losses</span>
                                <p className="text-sm text-muted-foreground">Short-term and long-term capital gains from investments</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Other Sources (All Types)</span>
                                <p className="text-sm text-muted-foreground">Including interest, dividends, lottery, gambling, etc.</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr3' && (
                          <>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Business/Profession Income</span>
                                <p className="text-sm text-muted-foreground">Income from business or professional activities</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Salary/Pension</span>
                                <p className="text-sm text-muted-foreground">Income from employment or pension received</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">House Property</span>
                                <p className="text-sm text-muted-foreground">Income/loss from any number of house properties</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Capital Gains</span>
                                <p className="text-sm text-muted-foreground">Short-term and long-term capital gains/losses</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr4' && (
                          <>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Presumptive Business Income</span>
                                <p className="text-sm text-muted-foreground">Under sections 44AD, 44ADA, and 44AE</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Salary/Pension</span>
                                <p className="text-sm text-muted-foreground">Income from employment or pension received</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">One House Property</span>
                                <p className="text-sm text-muted-foreground">Income/loss from a single house property</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Other Sources</span>
                                <p className="text-sm text-muted-foreground">Interest income, family pension, etc. (excluding lottery, gambling)</p>
                              </div>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-3">Income Limits & Special Conditions</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <ul className="space-y-2">
                        {formId === 'itr1' && (
                          <>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Total Income Limit</span>
                                <p className="text-sm text-muted-foreground">Income must not exceed ₹50 lakhs</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Agricultural Income</span>
                                <p className="text-sm text-muted-foreground">Agricultural income must not exceed ₹5,000</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr2' && (
                          <>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">No Income Limit</span>
                                <p className="text-sm text-muted-foreground">ITR-2 has no total income ceiling</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Foreign Assets/Income</span>
                                <p className="text-sm text-muted-foreground">Suitable for reporting foreign assets and foreign income</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Applicable for Directors</span>
                                <p className="text-sm text-muted-foreground">Directors of companies must file ITR-2 (or ITR-3 if applicable)</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr3' && (
                          <>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">No Income Limit</span>
                                <p className="text-sm text-muted-foreground">ITR-3 has no total income ceiling</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Mandatory Audit</span>
                                <p className="text-sm text-muted-foreground">Tax audit required if turnover exceeds ₹1 crore (₹2 crore if cash transactions are less than 5%)</p>
                              </div>
                            </li>
                          </>
                        )}
                        {formId === 'itr4' && (
                          <>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Total Income Limit</span>
                                <p className="text-sm text-muted-foreground">Income must not exceed ₹50 lakhs</p>
                              </div>
                            </li>
                            <li className="flex">
                              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                              <div>
                                <span className="font-medium">Presumptive Income Schemes</span>
                                <p className="text-sm text-muted-foreground">Only for those opting for presumptive taxation under sections 44AD, 44ADA, or 44AE</p>
                              </div>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents Required</CardTitle>
                <CardDescription>Documents you need to prepare before filing {formData.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">Essential Documents</h3>
                    <ul className="space-y-2">
                      {formData.documentsList.map((item, index) => (
                        <li key={index} className="flex">
                          <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">General Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Permanent Account Number (PAN)</span>
                          <p className="text-sm text-muted-foreground">Your valid PAN is essential for filing any ITR form</p>
                        </div>
                      </li>
                      <li className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Aadhaar Card</span>
                          <p className="text-sm text-muted-foreground">Your Aadhaar should be linked with your PAN</p>
                        </div>
                      </li>
                      <li className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Bank Account Details</span>
                          <p className="text-sm text-muted-foreground">Account number, IFSC code, and bank name for refund purposes</p>
                        </div>
                      </li>
                      <li className="flex">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Contact Information</span>
                          <p className="text-sm text-muted-foreground">Valid mobile number and email address for communication from the tax department</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Document Verification Tip</h4>
                        <p className="text-blue-700 text-sm mt-1">
                          You can download your Form 26AS, Annual Information Statement (AIS), and Tax Information Summary (TIS) from the Income Tax Portal to verify all your income details before filing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Deduction Proofs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Keep the following proof documents handy for claiming various deductions under the Income Tax Act:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Section 80C Investments</span>
                        <p className="text-sm text-muted-foreground">PF, PPF, ELSS, Life Insurance, etc.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Section 80D</span>
                        <p className="text-sm text-muted-foreground">Medical insurance premium receipts</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Section 80G</span>
                        <p className="text-sm text-muted-foreground">Donation receipts with 80G registration details</p>
                      </div>
                    </li>
                    <li className="flex">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Home Loan</span>
                        <p className="text-sm text-muted-foreground">Interest and principal repayment certificates</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Filing Assistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Need help with filing your ITR? Here are some options:
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full" asChild>
                      <Link href="/tax-filing/itr-wizard">Use Our ITR Wizard</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/tax-expert">
                        Consult a Tax Expert
                      </Link>
                    </Button>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">
                        Our platform guides you through the entire filing process with automated calculations and error checks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ITRFormDetails;