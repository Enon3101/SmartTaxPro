import {
  FileText,
  Building,
  Home,
  Users,
  Briefcase,
  DollarSign,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Newspaper,
  ArrowRight,
  FilePlus2
} from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ITRFormInfo = {
  id: string;
  name: string;
  description: string;
  eligibleFor: string[];
  notEligibleFor: string[];
  dueDate: string;
  icon: React.ReactNode;
  blogs: {
    title: string;
    slug: string;
    excerpt: string;
  }[];
};

const itrForms: ITRFormInfo[] = [
  {
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
    icon: <FileText className="h-5 w-5" />,
    blogs: [
      {
        title: "Complete Guide to ITR-1 Filing for Salaried Employees",
        slug: "itr-1-guide-for-salaried",
        excerpt: "Learn step-by-step how to file your ITR-1 if you're a salaried employee with simple income sources.",
      },
      {
        title: "Key Deductions You Can Claim in ITR-1",
        slug: "key-deductions-itr-1",
        excerpt: "Maximize your tax savings by understanding all eligible deductions when filing ITR-1.",
      },
    ],
  },
  {
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
    icon: <Building className="h-5 w-5" />,
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
  {
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
    icon: <Briefcase className="h-5 w-5" />,
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
  {
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
    icon: <DollarSign className="h-5 w-5" />,
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
  {
    id: 'itr-5',
    name: 'ITR-5',
    description: 'For entities other than individuals, HUFs, companies, and persons filing ITR-7',
    eligibleFor: [
      'Partnership Firms',
      'Limited Liability Partnerships (LLPs)',
      'Association of Persons (AOPs)',
      'Body of Individuals (BOIs)',
      'Artificial Juridical Person',
      'Estate of Deceased',
      'Estate of Insolvent',
      'Business Trust',
      'Investment Fund',
    ],
    notEligibleFor: [
      'Individuals',
      'HUFs',
      'Companies',
      'Charitable and Religious Trusts (covered under ITR-7)',
    ],
    dueDate: 'July 31, 2025',
    icon: <Users className="h-5 w-5" />,
    blogs: [
      {
        title: 'Partnership Firm Taxation: Complete Guide to ITR-5 Filing',
        slug: 'partnership-firm-taxation-itr-5',
        excerpt: 'Comprehensive guide for partnership firms on filing ITR-5 correctly with profit allocation.',
      },
      {
        title: 'LLP vs Partnership Firm: Tax Implications and Filing Requirements',
        slug: 'llp-vs-partnership-tax-implications',
        excerpt: 'Compare the tax structures and filing requirements of LLPs and partnership firms.',
      },
    ],
  },
  {
    id: 'itr-6',
    name: 'ITR-6',
    description: 'For companies other than those claiming exemption under section 11',
    eligibleFor: [
      'Domestic Companies',
      'Foreign Companies',
      'Banking Companies',
      'Insurance Companies',
      'Companies engaged in generation and distribution of power',
    ],
    notEligibleFor: [
      'Companies claiming exemption under section 11 (charitable or religious purpose)',
    ],
    dueDate: 'October 31, 2025',
    icon: <Building className="h-5 w-5" />,
    blogs: [
      {
        title: 'Corporate Tax Filing: Complete Guide to ITR-6',
        slug: 'corporate-tax-filing-itr-6',
        excerpt: 'Detailed walkthrough of the ITR-6 filing process for companies with compliance tips.',
      },
      {
        title: 'Key Schedules in ITR-6 for Corporate Tax Return Filing',
        slug: 'key-schedules-itr-6-corporate',
        excerpt: 'Understanding important schedules in ITR-6 that companies need to carefully complete.',
      },
    ],
  },
  {
    id: 'itr-7',
    name: 'ITR-7',
    description: 'For charitable/religious trusts, political parties, scientific research, and news agencies',
    eligibleFor: [
      'Trusts claiming exemption under section 11',
      'Political Parties',
      'Electoral Trusts',
      'Research Associations',
      'News Agencies',
      'Universities and Educational Institutions',
      'Hospitals',
      'Infrastructure Debt Funds',
    ],
    notEligibleFor: [
      'Entities not covered under sections 11, 12, 13A, 13B, or 10(23C)',
    ],
    dueDate: 'October 31, 2025',
    icon: <Home className="h-5 w-5" />,
    blogs: [
      {
        title: 'Compliance Requirements for Charitable Trusts Filing ITR-7',
        slug: 'compliance-charitable-trusts-itr-7',
        excerpt: 'Understand the registration, filing, and compliance requirements for charitable trusts.',
      },
      {
        title: 'Common Audit Issues Faced by NGOs and Charitable Organizations',
        slug: 'audit-issues-ngos-charitable',
        excerpt: 'Learn about common audit issues that NGOs and charitable organizations face during tax assessments.',
      },
    ],
  },
];

export function ITRFormsGuide() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Income Tax Return (ITR) Forms Guide
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Understand which ITR form is right for you based on your income sources and filing situation
        </p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="cards">Form Overview</TabsTrigger>
          <TabsTrigger value="comparison">Detailed Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itrForms.map((form) => (
              <Card key={form.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-primary/10 p-2 rounded-full">{form.icon}</div>
                    <CardTitle className="text-xl">{form.name}</CardTitle>
                  </div>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2 bg-green-50">Eligible For</Badge>
                      <ul className="ml-5 space-y-1 list-disc text-sm">
                        {form.eligibleFor.slice(0, 3).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                        {form.eligibleFor.length > 3 && (
                          <li className="text-muted-foreground">+ {form.eligibleFor.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Due Date:</span>
                        <Badge variant="secondary">{form.dueDate}</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Newspaper className="h-4 w-4" />
                        Related Guides & Blogs
                      </h4>
                      <div className="space-y-2">
                        {form.blogs.map((blog) => (
                          <Link key={blog.slug} href={`/blog/${blog.slug}`} className="block">
                            <div className="p-2 border rounded-md hover:bg-muted transition-colors">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">{blog.title}</p>
                                <ChevronRight className="h-4 w-4 shrink-0 mt-1" />
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {blog.excerpt}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link href={`/tax-filing/itr-wizard?form=${form.id}`}>
                      <Button className="w-full gap-1">
                        Start Filing {form.name} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed ITR Forms Comparison</CardTitle>
              <CardDescription>
                Expand each ITR form to see detailed eligibility criteria and exclusions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {itrForms.map((form) => (
                  <AccordionItem key={form.id} value={form.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {form.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-left">{form.name}</h4>
                          <p className="text-sm text-muted-foreground text-left">
                            {form.description}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Badge variant="outline" className="mb-1 bg-green-50">Eligible For</Badge>
                          </h4>
                          <ul className="ml-5 space-y-1 list-disc">
                            {form.eligibleFor.map((item, index) => (
                              <li key={index} className="text-sm">{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Badge variant="outline" className="mb-1 bg-destructive/10">Not Eligible For</Badge>
                          </h4>
                          <ul className="ml-5 space-y-1 list-disc">
                            {form.notEligibleFor.map((item, index) => (
                              <li key={index} className="text-sm">{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                          <Newspaper className="h-4 w-4" />
                          Related Guides & Blogs
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {form.blogs.map((blog) => (
                            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                              <div className="p-3 border rounded-md hover:bg-muted transition-colors h-full">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{blog.title}</p>
                                  <ExternalLink className="h-4 w-4 shrink-0 mt-1" />
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {blog.excerpt}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Link href={`/tax-filing/itr-wizard?form=${form.id}`}>
                          <Button className="gap-1">
                            Start Filing {form.name} <FilePlus2 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ITRFormsGuide;