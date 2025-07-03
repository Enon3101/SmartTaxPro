import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Calculator, 
  Upload, 
  CreditCard, 
  Shield, 
  Clock,
  TrendingUp,
  Home,
  Briefcase,
  PiggyBank,
  DollarSign,
  Building,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  AlertCircle,
  Info
} from "lucide-react";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaxDataContext } from "@/context/TaxDataProvider";
import { formatCurrency } from "@/lib/formatters";

interface FilingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  active: boolean;
}

interface IncomeSource {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  selected: boolean;
  amount: string;
  details: Record<string, any>;
}

const QuickFilingSection = () => {
  const { 
    assessmentYear, 
    setAssessmentYear,
    taxFormData,
    updatePersonalInfo,
    updateIncome,
    taxSummary
  } = useContext(TaxDataContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Income Sources
    incomeSources: [] as IncomeSource[],
    
    // Quick Estimates
    estimatedIncome: "",
    estimatedDeductions: "",
    
    // Filing Preferences
    filingType: "individual",
    hasForm16: false,
    hasBankStatements: false,
    hasInvestmentProofs: false
  });

  const [filingSteps] = useState<FilingStep[]>([
    {
      id: "personal",
      title: "Personal Details",
      description: "Basic information",
      icon: User,
      completed: false,
      active: true
    },
    {
      id: "income",
      title: "Income Sources",
      description: "Select your income types",
      icon: TrendingUp,
      completed: false,
      active: false
    },
    {
      id: "estimates",
      title: "Quick Estimates",
      description: "Rough income & deductions",
      icon: Calculator,
      completed: false,
      active: false
    },
    {
      id: "documents",
      title: "Documents",
      description: "Upload supporting docs",
      icon: Upload,
      completed: false,
      active: false
    },
    {
      id: "review",
      title: "Review & File",
      description: "Final review & submission",
      icon: FileText,
      completed: false,
      active: false
    }
  ]);

  const [incomeSources] = useState<IncomeSource[]>([
    {
      id: "salary",
      type: "salary",
      title: "Salary Income",
      description: "Employment or pension income",
      icon: Briefcase,
      selected: false,
      amount: "",
      details: {
        employerName: "",
        grossSalary: "",
        tdsDeducted: ""
      }
    },
    {
      id: "house-property",
      type: "house-property",
      title: "House Property",
      description: "Rental income or housing loan interest",
      icon: Home,
      selected: false,
      amount: "",
      details: {
        propertyType: "self-occupied",
        annualRent: "",
        loanInterest: ""
      }
    },
    {
      id: "business",
      type: "business",
      title: "Business Income",
      description: "Business or professional income",
      icon: Building,
      selected: false,
      amount: "",
      details: {
        businessType: "",
        grossReceipts: "",
        expenses: ""
      }
    },
    {
      id: "capital-gains",
      type: "capital-gains",
      title: "Capital Gains",
      description: "Sale of assets, stocks, property",
      icon: TrendingUp,
      selected: false,
      amount: "",
      details: {
        assetType: "",
        saleProceeds: "",
        purchaseCost: ""
      }
    },
    {
      id: "interest",
      type: "interest",
      title: "Interest Income",
      description: "Bank deposits, bonds, securities",
      icon: PiggyBank,
      selected: false,
      amount: "",
      details: {
        source: "",
        amount: "",
        tdsDeducted: ""
      }
    },
    {
      id: "other",
      type: "other",
      title: "Other Income",
      description: "Dividends, gifts, lottery, etc.",
      icon: DollarSign,
      selected: false,
      amount: "",
      details: {
        source: "",
        amount: ""
      }
    }
  ]);

  const progress = ((currentStep + 1) / filingSteps.length) * 100;

  const handleStepComplete = () => {
    if (currentStep < filingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleIncomeSourceToggle = (sourceId: string) => {
    setFormData(prev => ({
      ...prev,
      incomeSources: prev.incomeSources.map(source => 
        source.id === sourceId 
          ? { ...source, selected: !source.selected }
          : source
      )
    }));
  };

  const handleIncomeAmountChange = (sourceId: string, amount: string) => {
    setFormData(prev => ({
      ...prev,
      incomeSources: prev.incomeSources.map(source => 
        source.id === sourceId 
          ? { ...source, amount }
          : source
      )
    }));
  };

  const calculateTotalIncome = () => {
    return formData.incomeSources
      .filter(source => source.selected)
      .reduce((total, source) => total + (parseFloat(source.amount) || 0), 0);
  };

  const estimatedTax = () => {
    const totalIncome = calculateTotalIncome();
    const deductions = parseFloat(formData.estimatedDeductions) || 0;
    const taxableIncome = Math.max(0, totalIncome - deductions);
    
    // Simple tax calculation (can be enhanced)
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
    if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.10;
    if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
    if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.20;
    return 150000 + (taxableIncome - 1500000) * 0.30;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Start Your Tax Filing
        </h2>
        <p className="text-gray-600 text-lg">
          Complete your ITR in minutes with our smart filing wizard
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {filingSteps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Filing Interface */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Filing Steps */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {filingSteps[currentStep].title}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {filingSteps[currentStep].description}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {React.createElement(filingSteps[currentStep].icon, {
                    className: "h-6 w-6 text-blue-600"
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Personal Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pan">PAN Number *</Label>
                          <Input
                            id="pan"
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                            placeholder="ABCDE1234F"
                            maxLength={10}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData({...formData, gender: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="assessmentYear">Assessment Year</Label>
                          <Select
                            value={assessmentYear}
                            onValueChange={setAssessmentYear}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2023-24">2023-24</SelectItem>
                              <SelectItem value="2024-25">2024-25</SelectItem>
                              <SelectItem value="2025-26">2025-26</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Income Sources */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <p className="text-gray-600 mb-4">
                        Select all income sources that apply to you for FY {assessmentYear}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {incomeSources.map((source) => (
                          <motion.div
                            key={source.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all duration-200 ${
                                source.selected 
                                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => handleIncomeSourceToggle(source.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    source.selected ? 'bg-blue-100' : 'bg-gray-100'
                                  }`}>
                                    {React.createElement(source.icon, {
                                      className: `h-5 w-5 ${
                                        source.selected ? 'text-blue-600' : 'text-gray-500'
                                      }`
                                    })}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${
                                      source.selected ? 'text-blue-700' : 'text-gray-800'
                                    }`}>
                                      {source.title}
                                    </h4>
                                    <p className={`text-sm ${
                                      source.selected ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                      {source.description}
                                    </p>
                                  </div>
                                  <Checkbox 
                                    checked={source.selected}
                                    className="ml-2"
                                  />
                                </div>
                                
                                {source.selected && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-gray-200"
                                  >
                                    <Label htmlFor={`amount-${source.id}`}>
                                      Estimated Amount (₹)
                                    </Label>
                                    <Input
                                      id={`amount-${source.id}`}
                                      value={source.amount}
                                      onChange={(e) => handleIncomeAmountChange(source.id, e.target.value)}
                                      placeholder="Enter amount"
                                      className="mt-1"
                                    />
                                  </motion.div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Quick Estimates */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-blue-800">Quick Estimates</h4>
                        </div>
                        <p className="text-blue-700 text-sm">
                          Provide rough estimates. You can update these details later with exact figures.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="estimatedIncome">Total Income (₹)</Label>
                          <Input
                            id="estimatedIncome"
                            value={formData.estimatedIncome}
                            onChange={(e) => setFormData({...formData, estimatedIncome: e.target.value})}
                            placeholder="Enter total income"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Sum of all income sources: ₹{formatCurrency(calculateTotalIncome())}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="estimatedDeductions">Total Deductions (₹)</Label>
                          <Input
                            id="estimatedDeductions"
                            value={formData.estimatedDeductions}
                            onChange={(e) => setFormData({...formData, estimatedDeductions: e.target.value})}
                            placeholder="80C, 80D, etc."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Section 80C, 80D, HRA, etc.
                          </p>
                        </div>
                      </div>

                      {/* Tax Summary Card */}
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-green-800 mb-4">Estimated Tax Summary</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Taxable Income:</span>
                              <div className="font-medium">
                                ₹{formatCurrency(Math.max(0, calculateTotalIncome() - (parseFloat(formData.estimatedDeductions) || 0)))}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Estimated Tax:</span>
                              <div className="font-semibold text-green-700">
                                ₹{formatCurrency(estimatedTax())}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Step 4: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <h4 className="font-medium text-amber-800">Document Checklist</h4>
                        </div>
                        <p className="text-amber-700 text-sm">
                          You can upload these documents now or later during detailed filing.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-medium mb-2">Form 16</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Salary certificate from employer
                            </p>
                            <Button variant="outline" size="sm">
                              Upload Form 16
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-medium mb-2">Bank Statements</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Interest income certificates
                            </p>
                            <Button variant="outline" size="sm">
                              Upload Statements
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-medium mb-2">Investment Proofs</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Section 80C, 80D certificates
                            </p>
                            <Button variant="outline" size="sm">
                              Upload Proofs
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                          <CardContent className="p-6 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="font-medium mb-2">Other Documents</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Property documents, etc.
                            </p>
                            <Button variant="outline" size="sm">
                              Upload Others
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & File */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium text-green-800">Ready to File!</h4>
                        </div>
                        <p className="text-green-700 text-sm">
                          Review your information and proceed to complete filing.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="font-medium">{formData.fullName || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">PAN:</span>
                              <span className="font-medium">{formData.pan || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Assessment Year:</span>
                              <span className="font-medium">{assessmentYear}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Income Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Income:</span>
                              <span className="font-medium">₹{formatCurrency(calculateTotalIncome())}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Deductions:</span>
                              <span className="font-medium">₹{formatCurrency(parseFloat(formData.estimatedDeductions) || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estimated Tax:</span>
                              <span className="font-semibold text-green-700">₹{formatCurrency(estimatedTax())}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Complete detailed income entry with exact figures</li>
                          <li>• Upload all required documents</li>
                          <li>• Review and verify all information</li>
                          <li>• Pay any outstanding tax (if applicable)</li>
                          <li>• Submit your return</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleStepComplete}
                  disabled={
                    (currentStep === 0 && (!formData.fullName || !formData.pan)) ||
                    (currentStep === 1 && formData.incomeSources.filter(s => s.selected).length === 0)
                  }
                >
                  {currentStep === filingSteps.length - 1 ? (
                    <>
                      Complete Filing
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Summary & Features */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-lg text-green-800">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Income:</span>
                  <span className="font-medium">₹{formatCurrency(calculateTotalIncome())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductions:</span>
                  <span className="font-medium">₹{formatCurrency(parseFloat(formData.estimatedDeductions) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Income:</span>
                  <span className="font-medium">₹{formatCurrency(Math.max(0, calculateTotalIncome() - (parseFloat(formData.estimatedDeductions) || 0)))}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Tax:</span>
                    <span className="text-green-700">₹{formatCurrency(estimatedTax())}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="shadow-lg border-0">
            <CardHeader>
                              <CardTitle className="text-lg">Why Choose MyeCA.in?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">100% Secure</h4>
                  <p className="text-xs text-gray-500">Bank-level encryption</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">10 Minutes</h4>
                  <p className="text-xs text-gray-500">Complete filing time</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calculator className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Smart Calculator</h4>
                  <p className="text-xs text-gray-500">Maximize your refund</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Free Filing</h4>
                  <p className="text-xs text-gray-500">No hidden charges</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Our tax experts are here to help you with any questions.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Chat with Expert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuickFilingSection; 