import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";

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
  Briefcase, 
  PiggyBank, 
  DollarSign, 
  TrendingUp, 
  Home, 
  BarChart3,
  Plus,
  X,
  Info
} from "lucide-react";

// Income source schema
const incomeSourceSchema = z.object({
  incomeSources: z.array(z.string()).min(1, "Select at least one income source"),
});

// Salary income schema
const salaryIncomeSchema = z.object({
  employerName: z.string().min(1, "Employer name is required"),
  grossSalary: z.string().min(1, "Gross salary is required"),
  standardDeduction: z.string().default("50000"),
  section10Exemptions: z.string().optional(),
  professionalTax: z.string().optional(),
  tdsDeducted: z.string().optional(),
});

// Business income schema
const businessIncomeSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  grossReceipts: z.string().min(1, "Gross receipts is required"),
  grossProfit: z.string().optional(),
  depreciation: z.string().optional(),
  otherExpenses: z.string().optional(),
  netProfit: z.string().optional(),
});

// Capital gains schema
const capitalGainsSchema = z.object({
  assetType: z.string().min(1, "Asset type is required"),
  saleProceeds: z.string().min(1, "Sale proceeds is required"),
  purchaseCost: z.string().min(1, "Purchase cost is required"),
  improvementCost: z.string().optional(),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
  disposalDate: z.string().min(1, "Disposal date is required"),
  indexationApplicable: z.boolean().default(true),
});

type IncomeSourceFormData = z.infer<typeof incomeSourceSchema>;
type SalaryIncomeData = z.infer<typeof salaryIncomeSchema>;
type BusinessIncomeData = z.infer<typeof businessIncomeSchema>;
type CapitalGainsData = z.infer<typeof capitalGainsSchema>;

interface IncomeStepProps {
  initialData?: {
    incomeSources: string[];
    salaryIncome: Array<SalaryIncomeData & { id: string }>;
    businessIncome: Array<BusinessIncomeData & { id: string }>;
    capitalGainsIncome: Array<CapitalGainsData & { id: string }>;
    interestIncome: Array<{ id: string; interestSource: string; amount: string; tdsDeducted: string }>;
    otherIncome: Array<{ id: string; incomeSource: string; amount: string; tdsDeducted: string }>;
  };
  onNext: (data: any) => void;
  onBack?: () => void;
}

const INCOME_SOURCES = [
  { value: "salary", label: "Salary/Pension", icon: Briefcase },
  { value: "business", label: "Business/Profession", icon: TrendingUp },
  { value: "capital-gains", label: "Capital Gains", icon: BarChart3 },
  { value: "house-property", label: "House Property", icon: Home },
  { value: "interest", label: "Interest Income", icon: PiggyBank },
  { value: "other", label: "Other Income", icon: DollarSign },
];

export function IncomeStep({ initialData, onNext, onBack }: IncomeStepProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(
    initialData?.incomeSources || []
  );
  const [currentSource, setCurrentSource] = useState<string | null>(
    selectedSources[0] || null
  );
  
  // Income data state
  const [salaryIncome, setSalaryIncome] = useState<Array<SalaryIncomeData & { id: string }>>(
    initialData?.salaryIncome || []
  );
  const [businessIncome, setBusinessIncome] = useState<Array<BusinessIncomeData & { id: string }>>(
    initialData?.businessIncome || []
  );
  const [capitalGainsIncome, setCapitalGainsIncome] = useState<Array<CapitalGainsData & { id: string }>>(
    initialData?.capitalGainsIncome || []
  );
  const [interestIncome, setInterestIncome] = useState<Array<{ id: string; interestSource: string; amount: string; tdsDeducted: string }>>(
    initialData?.interestIncome || []
  );
  const [otherIncome, setOtherIncome] = useState<Array<{ id: string; incomeSource: string; amount: string; tdsDeducted: string }>>(
    initialData?.otherIncome || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeSourceFormData>({
    resolver: zodResolver(incomeSourceSchema),
    defaultValues: { incomeSources: selectedSources },
  });

  const handleSourceToggle = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const addIncomeEntry = (type: string) => {
    const newEntry = { id: nanoid() };
    
    switch (type) {
      case "salary":
        setSalaryIncome(prev => [...prev, { ...newEntry, employerName: "", grossSalary: "", standardDeduction: "50000" } as any]);
        break;
      case "business":
        setBusinessIncome(prev => [...prev, { ...newEntry, businessName: "", businessType: "", grossReceipts: "" } as any]);
        break;
      case "capital-gains":
        setCapitalGainsIncome(prev => [...prev, { ...newEntry, assetType: "", saleProceeds: "", purchaseCost: "", acquisitionDate: "", disposalDate: "", indexationApplicable: true } as any]);
        break;
      case "interest":
        setInterestIncome(prev => [...prev, { ...newEntry, interestSource: "", amount: "", tdsDeducted: "" }]);
        break;
      case "other":
        setOtherIncome(prev => [...prev, { ...newEntry, incomeSource: "", amount: "", tdsDeducted: "" }]);
        break;
    }
  };

  const removeIncomeEntry = (type: string, index: number) => {
    switch (type) {
      case "salary":
        setSalaryIncome(prev => prev.filter((_, i) => i !== index));
        break;
      case "business":
        setBusinessIncome(prev => prev.filter((_, i) => i !== index));
        break;
      case "capital-gains":
        setCapitalGainsIncome(prev => prev.filter((_, i) => i !== index));
        break;
      case "interest":
        setInterestIncome(prev => prev.filter((_, i) => i !== index));
        break;
      case "other":
        setOtherIncome(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const updateIncomeField = (type: string, index: number, field: string, value: any) => {
    switch (type) {
      case "salary":
        setSalaryIncome(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case "business":
        setBusinessIncome(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case "capital-gains":
        setCapitalGainsIncome(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case "interest":
        setInterestIncome(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
      case "other":
        setOtherIncome(prev => prev.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        ));
        break;
    }
  };

  const onSubmit = () => {
    const incomeData = {
      incomeSources: selectedSources,
      salaryIncome,
      businessIncome,
      capitalGainsIncome,
      interestIncome,
      otherIncome,
    };
    onNext(incomeData);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-blue-800">
          Income Sources
        </CardTitle>
        <p className="text-gray-600">
          Select your income sources and provide details for each
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Income Source Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select Income Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INCOME_SOURCES.map((source) => {
              const IconComponent = source.icon;
              return (
                <div
                  key={source.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSources.includes(source.value)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleSourceToggle(source.value)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedSources.includes(source.value)}
                      onChange={() => handleSourceToggle(source.value)}
                    />
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{source.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Details */}
        {selectedSources.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Income Details</h3>
            
            <Tabs value={currentSource || selectedSources[0]} onValueChange={setCurrentSource}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                {selectedSources.map(source => (
                  <TabsTrigger key={source} value={source}>
                    {INCOME_SOURCES.find(s => s.value === source)?.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Salary Income */}
              {selectedSources.includes("salary") && (
                <TabsContent value="salary" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      Salary/Pension Income
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIncomeEntry("salary")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Another
                    </Button>
                  </div>

                  {salaryIncome.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      Click "Add Another" to add salary income details
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {salaryIncome.map((salary, index) => (
                        <Card key={salary.id} className="relative">
                          <CardContent className="p-6">
                            {salaryIncome.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeIncomeEntry("salary", index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`employerName-${index}`}>Employer Name</Label>
                                <Input
                                  id={`employerName-${index}`}
                                  placeholder="Enter employer name"
                                  value={salary.employerName}
                                  onChange={(e) => updateIncomeField("salary", index, "employerName", e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`grossSalary-${index}`}>Gross Salary</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`grossSalary-${index}`}
                                    className="pl-7"
                                    placeholder="Enter gross salary"
                                    value={salary.grossSalary}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("salary", index, "grossSalary", value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Business Income */}
              {selectedSources.includes("business") && (
                <TabsContent value="business" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      Business/Profession Income
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIncomeEntry("business")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Another
                    </Button>
                  </div>

                  {businessIncome.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      Click "Add Another" to add business income details
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {businessIncome.map((business, index) => (
                        <Card key={business.id} className="relative">
                          <CardContent className="p-6">
                            {businessIncome.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeIncomeEntry("business", index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`businessName-${index}`}>Business Name</Label>
                                <Input
                                  id={`businessName-${index}`}
                                  placeholder="Enter business name"
                                  value={business.businessName}
                                  onChange={(e) => updateIncomeField("business", index, "businessName", e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`businessType-${index}`}>Business Type</Label>
                                <Select
                                  value={business.businessType}
                                  onValueChange={(value) => updateIncomeField("business", index, "businessType", value)}
                                >
                                  <SelectTrigger id={`businessType-${index}`}>
                                    <SelectValue placeholder="Select business type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="proprietorship">Proprietorship</SelectItem>
                                    <SelectItem value="partnership">Partnership</SelectItem>
                                    <SelectItem value="llp">LLP</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="profession">Profession</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`grossReceipts-${index}`}>Gross Receipts</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`grossReceipts-${index}`}
                                    className="pl-7"
                                    placeholder="Enter gross receipts"
                                    value={business.grossReceipts}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("business", index, "grossReceipts", value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Capital Gains */}
              {selectedSources.includes("capital-gains") && (
                <TabsContent value="capital-gains" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium flex items-center">
                      <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                      Capital Gains
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIncomeEntry("capital-gains")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Another
                    </Button>
                  </div>

                  {capitalGainsIncome.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      Click "Add Another" to add capital gains details
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {capitalGainsIncome.map((gains, index) => (
                        <Card key={gains.id} className="relative">
                          <CardContent className="p-6">
                            {capitalGainsIncome.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeIncomeEntry("capital-gains", index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`assetType-${index}`}>Asset Type</Label>
                                <Select
                                  value={gains.assetType}
                                  onValueChange={(value) => updateIncomeField("capital-gains", index, "assetType", value)}
                                >
                                  <SelectTrigger id={`assetType-${index}`}>
                                    <SelectValue placeholder="Select asset type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="property">Property</SelectItem>
                                    <SelectItem value="shares">Shares</SelectItem>
                                    <SelectItem value="mutual-funds">Mutual Funds</SelectItem>
                                    <SelectItem value="bonds">Bonds</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`saleProceeds-${index}`}>Sale Proceeds</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`saleProceeds-${index}`}
                                    className="pl-7"
                                    placeholder="Enter sale proceeds"
                                    value={gains.saleProceeds}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("capital-gains", index, "saleProceeds", value);
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`purchaseCost-${index}`}>Purchase Cost</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`purchaseCost-${index}`}
                                    className="pl-7"
                                    placeholder="Enter purchase cost"
                                    value={gains.purchaseCost}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("capital-gains", index, "purchaseCost", value);
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`acquisitionDate-${index}`}>Acquisition Date</Label>
                                <Input
                                  id={`acquisitionDate-${index}`}
                                  type="date"
                                  value={gains.acquisitionDate}
                                  onChange={(e) => updateIncomeField("capital-gains", index, "acquisitionDate", e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`disposalDate-${index}`}>Disposal Date</Label>
                                <Input
                                  id={`disposalDate-${index}`}
                                  type="date"
                                  value={gains.disposalDate}
                                  onChange={(e) => updateIncomeField("capital-gains", index, "disposalDate", e.target.value)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Interest Income */}
              {selectedSources.includes("interest") && (
                <TabsContent value="interest" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium flex items-center">
                      <PiggyBank className="h-5 w-5 text-green-500 mr-2" />
                      Interest Income
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIncomeEntry("interest")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Another
                    </Button>
                  </div>

                  {interestIncome.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      Click "Add Another" to add interest income details
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {interestIncome.map((interest, index) => (
                        <Card key={interest.id} className="relative">
                          <CardContent className="p-6">
                            {interestIncome.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeIncomeEntry("interest", index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`interestSource-${index}`}>Interest Source</Label>
                                <Select
                                  value={interest.interestSource}
                                  onValueChange={(value) => updateIncomeField("interest", index, "interestSource", value)}
                                >
                                  <SelectTrigger id={`interestSource-${index}`}>
                                    <SelectValue placeholder="Select interest source" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="savings">Savings Account</SelectItem>
                                    <SelectItem value="fixed-deposit">Fixed Deposits</SelectItem>
                                    <SelectItem value="recurring-deposit">Recurring Deposits</SelectItem>
                                    <SelectItem value="bonds">Bonds</SelectItem>
                                    <SelectItem value="others">Other Interest</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`interestAmount-${index}`}>Interest Amount</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`interestAmount-${index}`}
                                    className="pl-7"
                                    placeholder="Enter interest amount"
                                    value={interest.amount}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("interest", index, "amount", value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Other Income */}
              {selectedSources.includes("other") && (
                <TabsContent value="other" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium flex items-center">
                      <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                      Other Income
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addIncomeEntry("other")}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Another
                    </Button>
                  </div>

                  {otherIncome.length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                      Click "Add Another" to add other income details
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {otherIncome.map((income, index) => (
                        <Card key={income.id} className="relative">
                          <CardContent className="p-6">
                            {otherIncome.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeIncomeEntry("other", index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`incomeDescription-${index}`}>Income Description</Label>
                                <Input
                                  id={`incomeDescription-${index}`}
                                  placeholder="Description of income"
                                  value={income.incomeSource}
                                  onChange={(e) => updateIncomeField("other", index, "incomeSource", e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`otherAmount-${index}`}>Amount</Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                  <Input
                                    id={`otherAmount-${index}`}
                                    className="pl-7"
                                    placeholder="Enter amount"
                                    value={income.amount}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9.]/g, '');
                                      updateIncomeField("other", index, "amount", value);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            onClick={onSubmit}
            disabled={selectedSources.length === 0}
            className="ml-auto"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
