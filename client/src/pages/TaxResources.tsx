import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, CalendarDays, HelpCircle } from "lucide-react";

const TaxResources = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tax Resources</h1>
        <p className="text-[#ADB5BD]">
          Helpful tools and guides to simplify your tax filing experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Tax Forms & Instructions</CardTitle>
            <CardDescription>Access common IRS forms and instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Form 1040 (Individual Return)</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Form W-4 (Tax Withholding)</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Form 1099 Series (Independent Contractors)</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Form 8949 (Capital Gains & Losses)</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">View All Forms →</a>
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Calculator className="h-8 w-8 text-secondary mb-2" />
            <CardTitle>Tax Calculators</CardTitle>
            <CardDescription>Estimate your taxes and refund</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Tax Refund Estimator</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">W-4 Withholding Calculator</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Self-Employment Tax Calculator</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">Capital Gains Calculator</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-primary hover:underline">View All Calculators →</a>
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CalendarDays className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Tax Deadlines</CardTitle>
            <CardDescription>Stay on top of important tax dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">April 15, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">Federal tax filing deadline for 2023 returns</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">June 17, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">Q2 estimated tax payment due</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">September 16, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">Q3 estimated tax payment due</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">October 15, 2024</h3>
                <p className="text-sm text-[#ADB5BD]">Extended tax filing deadline</p>
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
                Understanding Tax Deductions vs. Tax Credits
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Learn the difference between tax deductions and tax credits, and how 
                each can impact your tax return in different ways.
              </p>
              <Link href="#">
                <a className="text-primary hover:underline font-medium">Read More →</a>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                5 Tax Benefits for Homeowners
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Discover key tax advantages available to homeowners, from mortgage 
                interest deductions to property tax considerations.
              </p>
              <Link href="#">
                <a className="text-primary hover:underline font-medium">Read More →</a>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Self-Employment Tax Guidelines
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Navigate the complexities of self-employment taxes, quarterly estimates, 
                and deductions available to freelancers and small business owners.
              </p>
              <Link href="#">
                <a className="text-primary hover:underline font-medium">Read More →</a>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Maximizing Your Retirement Tax Benefits
              </h3>
              <p className="text-[#ADB5BD] mb-4">
                Explore tax-advantaged retirement accounts and strategies to reduce 
                your tax burden while building your nest egg.
              </p>
              <Link href="#">
                <a className="text-primary hover:underline font-medium">Read More →</a>
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
                Our tax experts are ready to help you navigate complex tax situations 
                and find the best solutions for your specific needs.
              </p>
              <Link href="/support">
                <a className="text-primary hover:underline font-medium">
                  Contact Our Tax Experts →
                </a>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxResources;
