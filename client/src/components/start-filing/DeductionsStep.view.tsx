import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PiggyBank, 
  Heart, 
  Home, 
  GraduationCap, 
  Car, 
  Shield,
  Calculator,
  Info,
  AlertTriangle
} from "lucide-react";

// Deductions schema
const deductionsSchema = z.object({
  section80C: z.object({
    elss: z.string().optional(),
    ppf: z.string().optional(),
    nps: z.string().optional(),
    lic: z.string().optional(),
    homeLoanPrincipal: z.string().optional(),
    sukanyaSamriddhi: z.string().optional(),
    seniorCitizenSavings: z.string().optional(),
    nsc: z.string().optional(),
    taxSavingFd: z.string().optional(),
    mutualFunds: z.string().optional(),
    tuitionFees: z.string().optional(),
    others: z.string().optional(),
  }),
  section80D: z.object({
    healthInsurancePremium: z.string().optional(),
    preventiveHealthCheckup: z.string().optional(),
    medicalExpenses: z.string().optional(),
  }),
  section80G: z.object({
    donations: z.string().optional(),
  }),
  section80TTA: z.object({
    savingsAccountInterest: z.string().optional(),
  }),
  section80TTB: z.object({
    bankInterest: z.string().optional(),
  }),
  section24: z.object({
    homeLoanInterest: z.string().optional(),
  }),
  section80E: z.object({
    educationLoanInterest: z.string().optional(),
  }),
  section80CCD: z.object({
    npsContribution: z.string().optional(),
  }),
});

type DeductionsFormData = z.infer<typeof deductionsSchema>;

interface DeductionsStepProps {
  initialData?: Partial<DeductionsFormData>;
  onNext: (data: DeductionsFormData) => void;
  onBack?: () => void;
}

const SECTION_80C_OPTIONS = [
  { value: "elss", label: "ELSS (Equity Linked Savings Scheme)", maxAmount: 150000 },
  { value: "ppf", label: "Public Provident Fund (PPF)", maxAmount: 150000 },
  { value: "nps", label: "National Pension System (NPS)", maxAmount: 150000 },
  { value: "lic", label: "Life Insurance Premium", maxAmount: 150000 },
  { value: "homeLoanPrincipal", label: "Home Loan Principal Repayment", maxAmount: 150000 },
  { value: "sukanyaSamriddhi", label: "Sukanya Samriddhi Yojana", maxAmount: 150000 },
  { value: "seniorCitizenSavings", label: "Senior Citizen Savings Scheme", maxAmount: 150000 },
  { value: "nsc", label: "National Savings Certificate (NSC)", maxAmount: 150000 },
  { value: "taxSavingFd", label: "Tax Saving Fixed Deposits", maxAmount: 150000 },
  { value: "mutualFunds", label: "Tax Saving Mutual Funds", maxAmount: 150000 },
  { value: "tuitionFees", label: "Children's Tuition Fees", maxAmount: 150000 },
  { value: "others", label: "Others", maxAmount: 150000 },
];

export function DeductionsStep({ initialData, onNext, onBack }: DeductionsStepProps) {
  const [deductions, setDeductions] = useState<DeductionsFormData>({
    section80C: initialData?.section80C || {},
    section80D: initialData?.section80D || {},
    section80G: initialData?.section80G || {},
    section80TTA: initialData?.section80TTA || {},
    section80TTB: initialData?.section80TTB || {},
    section24: initialData?.section24 || {},
    section80E: initialData?.section80E || {},
    section80CCD: initialData?.section80CCD || {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeductionsFormData>({
    resolver: zodResolver(deductionsSchema),
    defaultValues: deductions,
  });

  const updateDeduction = (section: keyof DeductionsFormData, field: string, value: string) => {
    setDeductions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const calculateSection80CTotal = () => {
    const section80C = deductions.section80C;
    return Object.values(section80C).reduce((total, amount) => {
      return total + (parseFloat(amount || "0") || 0);
    }, 0);
  };

  const section80CTotal = calculateSection80CTotal();
  const section80CRemaining = Math.max(0, 150000 - section80CTotal);

  const onSubmit = () => {
    onNext(deductions);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-blue-800">
          Tax Deductions
        </CardTitle>
        <p className="text-gray-600">
          Claim your eligible tax deductions to reduce your taxable income
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="80c" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="80c">Section 80C</TabsTrigger>
            <TabsTrigger value="80d">Section 80D</TabsTrigger>
            <TabsTrigger value="other">Other Sections</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Section 80C */}
          <TabsContent value="80c" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center">
                <PiggyBank className="h-5 w-5 text-blue-500 mr-2" />
                Section 80C Deductions
              </h3>
              <div className="text-sm text-gray-600">
                Maximum: ₹1,50,000 | Used: ₹{section80CTotal.toLocaleString('en-IN')} | 
                Remaining: ₹{section80CRemaining.toLocaleString('en-IN')}
              </div>
            </div>

            {section80CTotal > 150000 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-red-700 font-medium">
                    Section 80C limit exceeded by ₹{(section80CTotal - 150000).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Only ₹1,50,000 will be considered for deduction
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SECTION_80C_OPTIONS.map((option) => (
                <div key={option.value} className="space-y-2">
                  <Label htmlFor={`80c-${option.value}`}>{option.label}</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                    <Input
                      id={`80c-${option.value}`}
                      className="pl-7"
                      placeholder="Enter amount"
                      value={deductions.section80C[option.value as keyof typeof deductions.section80C] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        updateDeduction("section80C", option.value, value);
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Maximum: ₹{option.maxAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Section 80D */}
          <TabsContent value="80d" className="space-y-6">
            <h3 className="text-lg font-medium flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Section 80D - Health Insurance & Medical Expenses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="healthInsurance">Health Insurance Premium</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id="healthInsurance"
                    className="pl-7"
                    placeholder="Enter premium amount"
                    value={deductions.section80D.healthInsurancePremium || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      updateDeduction("section80D", "healthInsurancePremium", value);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Maximum: ₹25,000 (₹50,000 for senior citizens)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preventiveCheckup">Preventive Health Checkup</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id="preventiveCheckup"
                    className="pl-7"
                    placeholder="Enter amount"
                    value={deductions.section80D.preventiveHealthCheckup || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      updateDeduction("section80D", "preventiveHealthCheckup", value);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Maximum: ₹5,000 (included in 80D limit)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalExpenses">Medical Expenses (Senior Citizens)</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id="medicalExpenses"
                    className="pl-7"
                    placeholder="Enter medical expenses"
                    value={deductions.section80D.medicalExpenses || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      updateDeduction("section80D", "medicalExpenses", value);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Maximum: ₹50,000 (for senior citizens)
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-700 font-medium">Section 80D Information</span>
              </div>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>• Health insurance premium for self, spouse, children, and parents</li>
                <li>• Preventive health checkup expenses up to ₹5,000</li>
                <li>• Medical expenses for senior citizens (60+ years) up to ₹50,000</li>
                <li>• Total deduction limit: ₹25,000 (₹50,000 for senior citizens)</li>
              </ul>
            </div>
          </TabsContent>

          {/* Other Sections */}
          <TabsContent value="other" className="space-y-6">
            <h3 className="text-lg font-medium">Other Deductions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 80G - Donations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                    Section 80G - Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="donations">Donations to Charitable Institutions</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="donations"
                        className="pl-7"
                        placeholder="Enter donation amount"
                        value={deductions.section80G.donations || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          updateDeduction("section80G", "donations", value);
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      50% or 100% deduction based on institution
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 24 - Home Loan Interest */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Home className="h-4 w-4 text-green-500 mr-2" />
                    Section 24 - Home Loan Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="homeLoanInterest">Interest on Home Loan</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="homeLoanInterest"
                        className="pl-7"
                        placeholder="Enter interest amount"
                        value={deductions.section24.homeLoanInterest || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          updateDeduction("section24", "homeLoanInterest", value);
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Maximum: ₹2,00,000 (self-occupied property)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 80E - Education Loan Interest */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <GraduationCap className="h-4 w-4 text-purple-500 mr-2" />
                    Section 80E - Education Loan Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="educationLoanInterest">Interest on Education Loan</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="educationLoanInterest"
                        className="pl-7"
                        placeholder="Enter interest amount"
                        value={deductions.section80E.educationLoanInterest || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          updateDeduction("section80E", "educationLoanInterest", value);
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      No maximum limit for 8 years
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 80CCD - NPS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    Section 80CCD - NPS Contribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="npsContribution">NPS Contribution</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="npsContribution"
                        className="pl-7"
                        placeholder="Enter NPS contribution"
                        value={deductions.section80CCD.npsContribution || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          updateDeduction("section80CCD", "npsContribution", value);
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Additional ₹50,000 over 80C limit
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Summary */}
          <TabsContent value="summary" className="space-y-6">
            <h3 className="text-lg font-medium">Deductions Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Section-wise Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Section 80C:</span>
                    <span className="font-medium">₹{Math.min(section80CTotal, 150000).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 80D:</span>
                    <span className="font-medium">₹{(parseFloat(deductions.section80D.healthInsurancePremium || "0") + parseFloat(deductions.section80D.preventiveHealthCheckup || "0") + parseFloat(deductions.section80D.medicalExpenses || "0")).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 80G:</span>
                    <span className="font-medium">₹{parseFloat(deductions.section80G.donations || "0").toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 24:</span>
                    <span className="font-medium">₹{parseFloat(deductions.section24.homeLoanInterest || "0").toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 80E:</span>
                    <span className="font-medium">₹{parseFloat(deductions.section80E.educationLoanInterest || "0").toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 80CCD:</span>
                    <span className="font-medium">₹{parseFloat(deductions.section80CCD.npsContribution || "0").toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Deductions:</span>
                      <span>₹{(Math.min(section80CTotal, 150000) + 
                        parseFloat(deductions.section80D.healthInsurancePremium || "0") + 
                        parseFloat(deductions.section80D.preventiveHealthCheckup || "0") + 
                        parseFloat(deductions.section80D.medicalExpenses || "0") + 
                        parseFloat(deductions.section80G.donations || "0") + 
                        parseFloat(deductions.section24.homeLoanInterest || "0") + 
                        parseFloat(deductions.section80E.educationLoanInterest || "0") + 
                        parseFloat(deductions.section80CCD.npsContribution || "0")).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800">
                      <strong>Section 80C:</strong> Maximum deduction ₹1,50,000
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800">
                      <strong>Section 80D:</strong> Health insurance premium up to ₹25,000
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800">
                      <strong>Section 24:</strong> Home loan interest up to ₹2,00,000
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                    <p className="text-purple-800">
                      <strong>Section 80CCD:</strong> Additional ₹50,000 for NPS
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onSubmit} className="ml-auto">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 