import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, CalendarDays, HelpCircle } from "lucide-react";

const TaxResources = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tax Resources</h1>
        <p className="text-[#ADB5BD]">
          Helpful tools and guides to simplify your Indian tax filing experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>ITR Forms & Instructions</CardTitle>
            <CardDescription>Access common Income Tax Return forms</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-primary hover:underline">
                  ITR-1 (Sahaj) for Salaried Individuals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  ITR-2 (Salary, Capital Gains, House Property)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  ITR-3 (Business Income & Professionals)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  ITR-4 (Sugam) for Presumptive Income
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  View All ITR Forms →
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Calculator className="h-8 w-8 text-secondary mb-2" />
            <CardTitle>Tax Calculators</CardTitle>
            <CardDescription>Estimate your taxes and refund under Indian tax laws</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/calculators/tax-regime" className="text-primary hover:underline">
                  New vs Old Tax Regime Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/tds" className="text-primary hover:underline">
                  TDS Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/hra" className="text-primary hover:underline">
                  HRA Exemption Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/capital-gains" className="text-primary hover:underline">
                  Capital Gains Calculator (Securities)
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-primary hover:underline">
                  View All Calculators →
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CalendarDays className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Tax Deadlines</CardTitle>
            <CardDescription>Stay on top of important Indian tax dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">July 31, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">ITR filing deadline for non-audit cases (AY 2024-25)</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">June 15, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">First installment of advance tax (15%)</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">September 15, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">Second installment of advance tax (45%)</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">October 31, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">ITR deadline for audit cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Tax Guides & Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                New vs Old Tax Regime: Which Should You Choose?
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Understand the differences between the new and old tax regimes in India, 
                and determine which option might save you more tax based on your income and investments.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Tax Benefits Under Section 80C to 80U
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Explore the comprehensive list of deductions available under various subsections from 
                80C to 80U, including investments, insurance, and medical expenses.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                GST for Small Businesses & Professionals
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Navigate the Goods and Services Tax framework for small businesses, 
                freelancers, and professionals. Learn about registration, filing requirements, and input tax credits.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Tax Benefits for NPS and ELSS Investments
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Discover the tax advantages of investing in National Pension System (NPS) and 
                Equity-Linked Savings Schemes (ELSS) under Indian tax laws.
              </p>
              <Link href="#" className="text-primary hover:underline font-medium">
                Read More →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-primary/5 border-0 mb-12">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Have a Tax Question?</h3>
              <p className="text-[#ADB5BD] mb-4">
                Our tax experts are ready to help you navigate complex Indian tax situations 
                and find the best solutions for your specific needs.
              </p>
              <Link href="/support" className="text-primary hover:underline font-medium">
                Contact Our Tax Experts →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResources;
