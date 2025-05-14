import { ArrowLeftIcon, ExternalLinkIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "wouter";

const FilingRequirements = () => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'penalties'>('requirements');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 flex items-center gap-1">
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">ITR Filing Requirements</h1>
        <p className="text-muted-foreground text-lg">Assessment Year 2025-26 (Financial Year 2024-25)</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'requirements' ? 'default' : 'outline'}
          onClick={() => setActiveTab('requirements')}
          className="font-medium"
        >
          Who Should File ITR
        </Button>
        <Button
          variant={activeTab === 'penalties' ? 'default' : 'outline'}
          onClick={() => setActiveTab('penalties')}
          className="font-medium"
        >
          Penalties for Not Filing
        </Button>
      </div>

      {activeTab === 'requirements' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Individuals Required to File ITR for A.Y. 2025-26</CardTitle>
              <CardDescription>
                Below are the categories of individuals who must file their Income Tax Return
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RequirementCard
                    title="Income Above Basic Exemption"
                    description="Total income exceeds ₹2.5 lakhs (₹3 lakhs for senior citizens and ₹5 lakhs for super senior citizens)"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                  <RequirementCard
                    title="Business Income"
                    description="Any individual carrying on business or profession, regardless of profit or loss"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                  <RequirementCard
                    title="Foreign Income or Assets"
                    description="Residents with income or assets outside India, including foreign bank accounts"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                  <RequirementCard
                    title="High-Value Transactions"
                    description="Deposit of ₹1 crore or more in current account, foreign travel expenditure above ₹2 lakhs, electricity bill over ₹1 lakh"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                  <RequirementCard
                    title="Specific Investments"
                    description="Invested in shares, mutual funds with capital gains, or TDS/TCS over ₹25,000"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                  <RequirementCard
                    title="Seventh Pay Commission"
                    description="Government employees who have received arrears under Seventh Pay Commission"
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Special Cases</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Individuals holding directorships in companies</li>
                    <li>Persons with investments in unlisted equity shares</li>
                    <li>Individuals claiming relief under Double Taxation Avoidance Agreement (DTAA)</li>
                    <li>Non-resident Indians (NRIs) with income earned in India</li>
                    <li>Individuals with agricultural income exceeding ₹5 lakhs (along with other taxable income)</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Important Note</p>
                      <p className="text-yellow-700 text-sm">
                        Filing ITR is mandatory even if your tax liability is nil after considering TDS, advance tax paid, 
                        or applicable tax deductions and exemptions. Always check the latest guidelines from the Income Tax 
                        Department as requirements may change.
                      </p>
                      <div className="mt-2">
                        <a
                          href="https://www.incometax.gov.in/iec/foportal"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center"
                        >
                          Official Income Tax Department Portal
                          <ExternalLinkIcon className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'penalties' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Consequences of Not Filing ITR</CardTitle>
              <CardDescription>
                Missing the ITR filing deadline can lead to several penalties and disadvantages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Financial Penalties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PenaltyCard 
                    title="Late Filing Fee (Section 234F)"
                    description="₹5,000 if filed after due date but before December 31st, reduced to ₹1,000 for income below ₹5 lakhs"
                    severity="medium"
                  />
                  <PenaltyCard 
                    title="Interest on Unpaid Tax (Section 234A)"
                    description="1% per month (or part thereof) on unpaid tax amount until the date of payment"
                    severity="high"
                  />
                  <PenaltyCard 
                    title="Penalty for Concealment (Section 270A)"
                    description="50% to 200% of tax sought to be evaded for misreporting or under-reporting income"
                    severity="severe"
                  />
                  <PenaltyCard 
                    title="Prosecution in Serious Cases"
                    description="Imprisonment from 3 months to 7 years and fine for willful tax evasion above certain thresholds"
                    severity="severe"
                  />
                </div>

                <h3 className="text-xl font-semibold mt-8">Other Consequences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PenaltyCard 
                    title="Carry Forward of Losses Not Allowed"
                    description="Cannot carry forward certain losses (except house property loss) to offset against future income"
                    severity="high"
                  />
                  <PenaltyCard 
                    title="Delayed Tax Refunds"
                    description="Tax refunds may be delayed and may attract additional scrutiny"
                    severity="medium"
                  />
                  <PenaltyCard 
                    title="Difficulty in Visa Processing"
                    description="Many countries require ITR records for visa applications"
                    severity="medium"
                  />
                  <PenaltyCard 
                    title="Loan Approval Challenges"
                    description="Banks and financial institutions may require ITR for loan processing"
                    severity="medium"
                  />
                  <PenaltyCard 
                    title="Higher TDS Rates"
                    description="Higher rate of TDS (Tax Deducted at Source) may be applicable for non-filers"
                    severity="high"
                  />
                  <PenaltyCard 
                    title="Limited Time for Rectification"
                    description="Less time available to rectify mistakes or claim tax benefits"
                    severity="medium"
                  />
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-6">
                  <div className="flex items-start">
                    <AlertTriangleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Warning</p>
                      <p className="text-red-700 text-sm">
                        Non-compliance with tax filing obligations can trigger income tax notices and scrutiny assessments.
                        The Income Tax Department has sophisticated data matching capabilities to detect non-filing or
                        incorrect filing based on financial transactions.
                      </p>
                      <p className="text-red-700 text-sm mt-2">
                        For A.Y. 2025-26, the last date for filing ITR is generally July 31, 2025. Missing this deadline
                        will automatically subject you to penalties and restrictions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Link href="/start-filing">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Start Filing Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

interface RequirementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const RequirementCard = ({ title, description, icon }: RequirementCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{icon}</div>
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

type SeverityLevel = 'low' | 'medium' | 'high' | 'severe';

interface PenaltyCardProps {
  title: string;
  description: string;
  severity: SeverityLevel;
}

const PenaltyCard = ({ title, description, severity }: PenaltyCardProps) => {
  const getSeverityColor = (sev: SeverityLevel): string => {
    switch (sev) {
      case 'low':
        return 'bg-yellow-50 border-yellow-200';
      case 'medium':
        return 'bg-orange-50 border-orange-200';
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'severe':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  const getSeverityTextColor = (sev: SeverityLevel): string => {
    switch (sev) {
      case 'low':
        return 'text-yellow-800';
      case 'medium':
        return 'text-orange-800';
      case 'high':
        return 'text-red-700';
      case 'severe':
        return 'text-red-800 font-semibold';
      default:
        return 'text-gray-800';
    }
  }

  return (
    <div className={`p-4 rounded-lg border shadow-sm ${getSeverityColor(severity)}`}>
      <h4 className={`font-semibold ${getSeverityTextColor(severity)}`}>{title}</h4>
      <p className="text-gray-700 text-sm mt-1">{description}</p>
    </div>
  )
}

export default FilingRequirements;