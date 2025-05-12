import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { X, Plus, BarChart4, Landmark, TrendingUp } from 'lucide-react';
import SalarySection from "@/components/SalarySection";
import { nanoid } from "nanoid";
import { formatCurrency } from "@/lib/taxCalculations";
import { TaxDataContext } from "@/context/TaxDataProvider";
import ProgressTracker from "@/components/ProgressTracker";

// Indian PAN card validation utility functions
// PAN Format: AAAPL1234C
// First 3 characters: Alphabetic series running from AAA to ZZZ
// 4th character: Entity type
// 5th character: First character of surname/last name
// 6-9th character: Sequence number
// 10th character: Alphabetic check digit

// Entity codes for PAN card (4th character)
const PAN_ENTITY_TYPES: Record<string, string> = {
  'P': 'Individual',
  'F': 'Firm (Partnership)',
  'C': 'Company',
  'H': 'HUF (Hindu Undivided Family)',
  'A': 'AOP (Association of Persons)',
  'T': 'Trust',
  'B': 'Body of Individuals',
  'L': 'Local Authority',
  'J': 'Artificial Juridical Person',
  'G': 'Government'
};

function validatePAN(pan: string): boolean {
  // Basic validation: 10 characters, alphanumeric
  if (!pan || pan.length !== 10) {
    return false;
  }
  
  // Regex pattern for PAN: First 5 characters are letters, next 4 are digits, last is a letter
  const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return pattern.test(pan);
}

function getPANEntityType(pan: string): string | null {
  if (!validatePAN(pan) || pan.length < 4) {
    return null;
  }
  
  const entityCode = pan.charAt(3);
  return PAN_ENTITY_TYPES[entityCode] || null;
}

function isIndividualPAN(pan: string): boolean {
  if (!validatePAN(pan)) return false;
  
  const entityType = getPANEntityType(pan);
  return entityType === 'Individual';
}

interface Step {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export default function StartFiling() {
  const { 
    taxFormId, 
    currentStep, 
    setCurrentStep, 
    nextStep, 
    previousStep,
    updatePersonalInfo,
    updateIncome,
    updateDeductions80C,
    updateDeductions80D,
    updateOtherDeductions,
    taxFormData,
    assessmentYear,
    setAssessmentYear,
  } = useContext(TaxDataContext);
  
  const [location, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
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
    taxFiling: {
      year: assessmentYear,
      status: "Not Filed",
      type: "Individual"
    },
    incomeSource: [] as string[],
    salaryIncome: [{
      id: nanoid(),
      employerName: "",
      grossSalary: "",
      standardDeduction: "50,000", // Default standard deduction
      section10Exemptions: "",
      section10ExemptionsList: [] as Array<{type: string, amount: string}>,
      professionalTax: "",
      tdsDeducted: "",
      netSalary: "",
    }],
    housePropertyIncome: [{
      id: nanoid(),
      propertyType: "self-occupied",
      annualLetableValue: "",
      municipalTaxes: "",
      unrealizedRent: "",
      interestOnHousingLoan: "",
      netAnnualValue: "",
    }],
    capitalGainsIncome: [{
      id: nanoid(),
      assetType: "",
      saleProceeds: "",
      purchaseCost: "",
      improvementCost: "",
      acquisitionDate: "",
      disposalDate: "",
      indexationApplicable: true,
      indexedCost: "",
      exemptionSection: "",
      exemptionAmount: "",
      netCapitalGain: "",
    }],
    businessIncome: [{
      id: nanoid(),
      businessName: "",
      businessType: "",
      grossReceipts: "",
      grossProfit: "",
      depreciation: "",
      otherExpenses: "",
      netProfit: "",
    }],
    interestIncome: [{
      id: nanoid(),
      interestSource: "",
      amount: "",
      tdsDeducted: "",
    }],
    otherIncome: [{
      id: nanoid(),
      incomeSource: "",
      amount: "",
      tdsDeducted: "",
    }],
  });
  
  const [filerType, setFilerType] = useState<string | null>(null);
  const [showSalaryOption, setShowSalaryOption] = useState(true);

  // State for deductions
  const [deductions80C, setDeductions80C] = useState({
    ppf: taxFormData?.deductions80C?.ppf || "",
    elss: taxFormData?.deductions80C?.elss || "",
    lifeInsurance: taxFormData?.deductions80C?.lifeInsurance || "",
    houseLoanPrincipal: taxFormData?.deductions80C?.houseLoanPrincipal || "",
    sukanya: taxFormData?.deductions80C?.sukanya || "",
    nsc: taxFormData?.deductions80C?.nsc || "",
    fixedDeposit: taxFormData?.deductions80C?.fixedDeposit || "",
    epf: taxFormData?.deductions80C?.epf || "",
    nps: taxFormData?.deductions80C?.nps || "",
    tuitionFees: taxFormData?.deductions80C?.tuitionFees || "",
    totalAmount: taxFormData?.deductions80C?.totalAmount || "0"
  });
  
  const [deductions80D, setDeductions80D] = useState({
    selfMedicalInsurance: taxFormData?.deductions80D?.selfMedicalInsurance || "",
    parentsMedicalInsurance: taxFormData?.deductions80D?.parentsMedicalInsurance || "",
    preventiveHealthCheckup: taxFormData?.deductions80D?.preventiveHealthCheckup || "",
    medicalExpenditure: taxFormData?.deductions80D?.medicalExpenditure || "",
    totalAmount: taxFormData?.deductions80D?.totalAmount || "0"
  });
  
  const [otherDeductions, setOtherDeductions] = useState({
    section80CCD: taxFormData?.otherDeductions?.section80CCD || "",
    section80E: taxFormData?.otherDeductions?.section80E || "",
    section80G: taxFormData?.otherDeductions?.section80G || "",
    section80TTA: taxFormData?.otherDeductions?.section80TTA || "",
    section80TTB: taxFormData?.otherDeductions?.section80TTB || "",
    section80EEA: taxFormData?.otherDeductions?.section80EEA || "",
    section80DDB: taxFormData?.otherDeductions?.section80DDB || "",
    section80U: taxFormData?.otherDeductions?.section80U || "",
    totalAmount: taxFormData?.otherDeductions?.totalAmount || "0"
  });
  
  useEffect(() => {
    // Update assessment year when context changes
    setFormData(prev => ({
      ...prev,
      taxFiling: {
        ...prev.taxFiling,
        year: assessmentYear
      }
    }));
  }, [assessmentYear]);
  
  // Load data from context if available
  useEffect(() => {
    if (taxFormData && taxFormData.personalInfo) {
      setFormData({
        ...formData,
        ...taxFormData.personalInfo,
        salaryIncome: Array.isArray(taxFormData.personalInfo.salaryIncome) 
          ? taxFormData.personalInfo.salaryIncome 
          : formData.salaryIncome,
        housePropertyIncome: Array.isArray(taxFormData.personalInfo.housePropertyIncome) 
          ? taxFormData.personalInfo.housePropertyIncome 
          : formData.housePropertyIncome,
        capitalGainsIncome: Array.isArray(taxFormData.personalInfo.capitalGainsIncome) 
          ? taxFormData.personalInfo.capitalGainsIncome 
          : formData.capitalGainsIncome,
        businessIncome: Array.isArray(taxFormData.personalInfo.businessIncome) 
          ? taxFormData.personalInfo.businessIncome 
          : formData.businessIncome,
        interestIncome: Array.isArray(taxFormData.personalInfo.interestIncome) 
          ? taxFormData.personalInfo.interestIncome 
          : formData.interestIncome,
        otherIncome: Array.isArray(taxFormData.personalInfo.otherIncome) 
          ? taxFormData.personalInfo.otherIncome 
          : formData.otherIncome,
      });
      
      // Set filer type based on PAN if available
      if (taxFormData.personalInfo.pan) {
        setFilerType(getPANEntityType(taxFormData.personalInfo.pan));
        setShowSalaryOption(isIndividualPAN(taxFormData.personalInfo.pan));
      }
    }
  }, [taxFormData]);
  
  // Update showSalaryOption based on PAN validation
  useEffect(() => {
    if (formData.pan) {
      const isIndividual = isIndividualPAN(formData.pan);
      setShowSalaryOption(isIndividual);
      
      // If not individual and salary is selected, remove it
      if (!isIndividual && formData.incomeSource.includes("salary")) {
        setFormData(prev => ({
          ...prev,
          incomeSource: prev.incomeSource.filter(source => source !== "salary")
        }));
      }
      
      // Set filer type
      setFilerType(getPANEntityType(formData.pan));
    }
  }, [formData.pan]);
  
  // Define filing steps
  const steps: Step[] = [
    {
      number: 1,
      title: "Basic Information",
      description: "Personal details and PAN",
      completed: Boolean(formData.fullName && formData.pan && validatePAN(formData.pan)),
      active: currentStep === 1
    },
    {
      number: 2,
      title: "Income Sources",
      description: "Select all applicable income sources",
      completed: formData.incomeSource.length > 0,
      active: currentStep === 2
    },
    {
      number: 3,
      title: "Income Details",
      description: "Provide details for each income source",
      completed: false, // Will be calculated based on all income fields
      active: currentStep === 3
    },
    {
      number: 4,
      title: "Deductions",
      description: "Section 80C, 80D, and other deductions",
      completed: false,
      active: currentStep === 4
    },
    {
      number: 5,
      title: "Taxes Paid",
      description: "TDS, advance tax, and self-assessment tax",
      completed: false,
      active: currentStep === 5
    },
    {
      number: 6,
      title: "Review & Submit",
      description: "Final review before submission",
      completed: false,
      active: currentStep === 6
    }
  ];
  
  const handleContinue = () => {
    // Save data to context
    switch (currentStep) {
      case 1:
        updatePersonalInfo({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          taxFiling: formData.taxFiling
        });
        break;
      case 2:
        updatePersonalInfo({
          incomeSource: formData.incomeSource
        });
        break;
      case 3:
        updatePersonalInfo({
          salaryIncome: formData.salaryIncome,
          housePropertyIncome: formData.housePropertyIncome,
          capitalGainsIncome: formData.capitalGainsIncome,
          businessIncome: formData.businessIncome,
          interestIncome: formData.interestIncome,
          otherIncome: formData.otherIncome,
        });
        
        // Also update income data in separate section
        updateIncome({
          salaryIncome: formData.salaryIncome,
          housePropertyIncome: formData.housePropertyIncome,
          capitalGainsIncome: formData.capitalGainsIncome,
          businessIncome: formData.businessIncome,
          interestIncome: formData.interestIncome,
          otherIncome: formData.otherIncome,
        });
        break;
      default:
        break;
    }
    
    // Move to next step or to tax filing page if completed
    if (currentStep < steps.length) {
      nextStep();
    } else {
      setLocation("/tax-filing");
    }
  };
  
  // Helper to update income fields
  const updateIncomeField = (sourceType: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      if (sourceType === "salaryIncome") {
        const updatedSalary = [...prev.salaryIncome];
        updatedSalary[index] = {
          ...updatedSalary[index],
          [field]: value
        };
        return {
          ...prev,
          salaryIncome: updatedSalary
        };
      } else if (sourceType === "housePropertyIncome") {
        const updatedProperty = [...prev.housePropertyIncome];
        updatedProperty[index] = {
          ...updatedProperty[index],
          [field]: value
        };
        return {
          ...prev,
          housePropertyIncome: updatedProperty
        };
      } else if (sourceType === "capitalGainsIncome") {
        const updatedCapitalGains = [...prev.capitalGainsIncome];
        updatedCapitalGains[index] = {
          ...updatedCapitalGains[index],
          [field]: value
        };
        return {
          ...prev,
          capitalGainsIncome: updatedCapitalGains
        };
      } else if (sourceType === "businessIncome") {
        const updatedBusiness = [...prev.businessIncome];
        updatedBusiness[index] = {
          ...updatedBusiness[index],
          [field]: value
        };
        return {
          ...prev,
          businessIncome: updatedBusiness
        };
      } else if (sourceType === "interestIncome") {
        const updatedInterest = [...prev.interestIncome];
        updatedInterest[index] = {
          ...updatedInterest[index],
          [field]: value
        };
        return {
          ...prev,
          interestIncome: updatedInterest
        };
      } else if (sourceType === "otherIncome") {
        const updatedOther = [...prev.otherIncome];
        updatedOther[index] = {
          ...updatedOther[index],
          [field]: value
        };
        return {
          ...prev,
          otherIncome: updatedOther
        };
      }
      return prev;
    });
  };
  
  // Add new income entry
  const addIncomeEntry = (sourceType: string) => {
    setFormData(prev => {
      if (sourceType === "salaryIncome") {
        return {
          ...prev,
          salaryIncome: [
            ...prev.salaryIncome,
            {
              id: nanoid(),
              employerName: "",
              grossSalary: "",
              standardDeduction: "50,000", // Default standard deduction
              section10Exemptions: "",
              section10ExemptionsList: [],
              professionalTax: "",
              tdsDeducted: "",
              netSalary: "",
            }
          ]
        };
      } else if (sourceType === "housePropertyIncome") {
        return {
          ...prev,
          housePropertyIncome: [
            ...prev.housePropertyIncome,
            {
              id: nanoid(),
              propertyType: "self-occupied",
              annualLetableValue: "",
              municipalTaxes: "",
              unrealizedRent: "",
              interestOnHousingLoan: "",
              netAnnualValue: "",
            }
          ]
        };
      } else if (sourceType === "capitalGainsIncome") {
        return {
          ...prev,
          capitalGainsIncome: [
            ...prev.capitalGainsIncome,
            {
              id: nanoid(),
              assetType: "",
              saleProceeds: "",
              purchaseCost: "",
              improvementCost: "",
              acquisitionDate: "",
              disposalDate: "",
              indexationApplicable: true,
              indexedCost: "",
              exemptionSection: "",
              exemptionAmount: "",
              netCapitalGain: "",
            }
          ]
        };
      } else if (sourceType === "businessIncome") {
        return {
          ...prev,
          businessIncome: [
            ...prev.businessIncome,
            {
              id: nanoid(),
              businessName: "",
              businessType: "",
              grossReceipts: "",
              grossProfit: "",
              depreciation: "",
              otherExpenses: "",
              netProfit: "",
            }
          ]
        };
      } else if (sourceType === "interestIncome") {
        return {
          ...prev,
          interestIncome: [
            ...prev.interestIncome,
            {
              id: nanoid(),
              interestSource: "",
              amount: "",
              tdsDeducted: "",
            }
          ]
        };
      } else if (sourceType === "otherIncome") {
        return {
          ...prev,
          otherIncome: [
            ...prev.otherIncome,
            {
              id: nanoid(),
              incomeSource: "",
              amount: "",
              tdsDeducted: "",
            }
          ]
        };
      }
      return prev;
    });
  };
  
  // Remove income entry
  const removeIncomeEntry = (sourceType: string, index: number) => {
    setFormData(prev => {
      if (sourceType === "salaryIncome" && prev.salaryIncome.length > 1) {
        return {
          ...prev,
          salaryIncome: prev.salaryIncome.filter((_, i) => i !== index)
        };
      } else if (sourceType === "housePropertyIncome" && prev.housePropertyIncome.length > 1) {
        return {
          ...prev,
          housePropertyIncome: prev.housePropertyIncome.filter((_, i) => i !== index)
        };
      } else if (sourceType === "capitalGainsIncome" && prev.capitalGainsIncome.length > 1) {
        return {
          ...prev,
          capitalGainsIncome: prev.capitalGainsIncome.filter((_, i) => i !== index)
        };
      } else if (sourceType === "businessIncome" && prev.businessIncome.length > 1) {
        return {
          ...prev,
          businessIncome: prev.businessIncome.filter((_, i) => i !== index)
        };
      } else if (sourceType === "interestIncome" && prev.interestIncome.length > 1) {
        return {
          ...prev,
          interestIncome: prev.interestIncome.filter((_, i) => i !== index)
        };
      } else if (sourceType === "otherIncome" && prev.otherIncome.length > 1) {
        return {
          ...prev,
          otherIncome: prev.otherIncome.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Start Your Tax Filing</h1>
      <p className="text-gray-600 text-center mb-8">
        Assessment Year: {assessmentYear}
      </p>
      
      <div className="mb-8">
        <ProgressTracker steps={steps} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Income Sources"}
            {currentStep === 3 && "Income Details"}
            {currentStep === 4 && "Deductions"}
            {currentStep === 5 && "Taxes Paid"}
            {currentStep === 6 && "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Provide your personal details to get started"}
            {currentStep === 2 && "Select all sources of income that apply to you"}
            {currentStep === 3 && "Enter details for each of your income sources"}
            {currentStep === 4 && "Claim tax deductions under various sections"}
            {currentStep === 5 && "Enter details of taxes already paid"}
            {currentStep === 6 && "Review your information before final submission"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input 
                    id="pan" 
                    value={formData.pan}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setFormData({...formData, pan: value});
                    }}
                    className={formData.pan && !validatePAN(formData.pan) ? "border-red-500" : ""}
                  />
                  {formData.pan && !validatePAN(formData.pan) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid 10-character PAN
                    </p>
                  )}
                  {formData.pan && validatePAN(formData.pan) && filerType && (
                    <p className="text-green-600 text-xs mt-1">
                      Filer Type: {filerType}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentYear">Assessment Year</Label>
                  <Select 
                    value={assessmentYear}
                    onValueChange={(value) => setAssessmentYear(value)}
                  >
                    <SelectTrigger id="assessmentYear">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input 
                    id="pincode" 
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Income Sources */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-4">
                Select all sources of income that apply to you for the assessment year {assessmentYear}.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showSalaryOption && (
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="income-salary"
                      className="mt-1"
                      checked={formData.incomeSource.includes("salary")}
                      onChange={(e) => {
                        const updatedSources = e.target.checked 
                          ? [...formData.incomeSource, "salary"]
                          : formData.incomeSource.filter(source => source !== "salary");
                        setFormData({...formData, incomeSource: updatedSources});
                      }}
                    />
                    <div>
                      <label htmlFor="income-salary" className="text-base font-medium cursor-pointer">
                        Salary Income
                      </label>
                      <p className="text-gray-500 text-sm">Income from employment or pension</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="income-house-property"
                    className="mt-1"
                    checked={formData.incomeSource.includes("house-property")}
                    onChange={(e) => {
                      const updatedSources = e.target.checked 
                        ? [...formData.incomeSource, "house-property"]
                        : formData.incomeSource.filter(source => source !== "house-property");
                      setFormData({...formData, incomeSource: updatedSources});
                    }}
                  />
                  <div>
                    <label htmlFor="income-house-property" className="text-base font-medium cursor-pointer">
                      House Property Income
                    </label>
                    <p className="text-gray-500 text-sm">Rental income or interest on housing loan</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="income-capital-gains"
                    className="mt-1"
                    checked={formData.incomeSource.includes("capital-gains")}
                    onChange={(e) => {
                      const updatedSources = e.target.checked 
                        ? [...formData.incomeSource, "capital-gains"]
                        : formData.incomeSource.filter(source => source !== "capital-gains");
                      setFormData({...formData, incomeSource: updatedSources});
                    }}
                  />
                  <div>
                    <label htmlFor="income-capital-gains" className="text-base font-medium cursor-pointer">
                      Capital Gains
                    </label>
                    <p className="text-gray-500 text-sm">Profit from sale of assets, shares, or property</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="income-business"
                    className="mt-1"
                    checked={formData.incomeSource.includes("business")}
                    onChange={(e) => {
                      const updatedSources = e.target.checked 
                        ? [...formData.incomeSource, "business"]
                        : formData.incomeSource.filter(source => source !== "business");
                      setFormData({...formData, incomeSource: updatedSources});
                    }}
                  />
                  <div>
                    <label htmlFor="income-business" className="text-base font-medium cursor-pointer">
                      Business Income
                    </label>
                    <p className="text-gray-500 text-sm">Income from business or profession</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="income-interest"
                    className="mt-1"
                    checked={formData.incomeSource.includes("interest")}
                    onChange={(e) => {
                      const updatedSources = e.target.checked 
                        ? [...formData.incomeSource, "interest"]
                        : formData.incomeSource.filter(source => source !== "interest");
                      setFormData({...formData, incomeSource: updatedSources});
                    }}
                  />
                  <div>
                    <label htmlFor="income-interest" className="text-base font-medium cursor-pointer">
                      Interest Income
                    </label>
                    <p className="text-gray-500 text-sm">Interest from savings, deposits, or bonds</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="income-other"
                    className="mt-1"
                    checked={formData.incomeSource.includes("other")}
                    onChange={(e) => {
                      const updatedSources = e.target.checked 
                        ? [...formData.incomeSource, "other"]
                        : formData.incomeSource.filter(source => source !== "other");
                      setFormData({...formData, incomeSource: updatedSources});
                    }}
                  />
                  <div>
                    <label htmlFor="income-other" className="text-base font-medium cursor-pointer">
                      Other Income
                    </label>
                    <p className="text-gray-500 text-sm">Gifts, lottery, gambling, or other sources</p>
                  </div>
                </div>
              </div>
              
              {formData.incomeSource.length === 0 && (
                <div className="text-amber-600 bg-amber-50 p-3 rounded-md text-sm mt-4">
                  Please select at least one source of income to proceed.
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Income Details */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Salary Income - Now using the SalarySection component */}
              {formData.incomeSource.includes("salary") && (
                <SalarySection
                  salaryIncome={formData.salaryIncome}
                  updateIncomeField={updateIncomeField}
                  addIncomeEntry={addIncomeEntry}
                  removeIncomeEntry={removeIncomeEntry}
                />
              )}
              
              {/* House Property Income */}
              {formData.incomeSource.includes("house-property") && (
                <div className="p-6 bg-white border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Landmark className="mr-2 h-5 w-5" />
                      House Property Income
                    </h3>
                    
                    {/* Add another property button */}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addIncomeEntry("housePropertyIncome")}
                      className="text-xs flex items-center"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Another Property
                    </Button>
                  </div>
                  
                  {/* For each property, show a set of fields */}
                  {formData.housePropertyIncome.map((property, index) => (
                    <div key={property.id} className="mb-6 last:mb-0 border-t pt-4 first:border-t-0 first:pt-0">
                      {/* Show property number and delete button if there are multiple */}
                      {formData.housePropertyIncome.length > 1 && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-500">
                            Property #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIncomeEntry("housePropertyIncome", index)}
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={formData.housePropertyIncome.length <= 1}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`propertyType-${index}`}>Property Type</Label>
                          <Select 
                            value={property.propertyType}
                            onValueChange={(value) => updateIncomeField("housePropertyIncome", index, "propertyType", value)}
                          >
                            <SelectTrigger id={`propertyType-${index}`}>
                              <SelectValue placeholder="Select Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self-occupied">Self-Occupied</SelectItem>
                              <SelectItem value="let-out">Let Out</SelectItem>
                              <SelectItem value="deemed-let-out">Deemed Let Out</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {property.propertyType !== "self-occupied" && (
                          <div className="space-y-2">
                            <Label htmlFor={`annualLetableValue-${index}`}>Annual Letable Value</Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                              <Input
                                id={`annualLetableValue-${index}`}
                                className="pl-7"
                                value={property.annualLetableValue}
                                onChange={(e) => {
                                  // Store the original cursor position
                                  const cursorPosition = e.target.selectionStart;
                                  
                                  // Format the value
                                  const value = formatCurrency(e.target.value);
                                  updateIncomeField("housePropertyIncome", index, "annualLetableValue", value);
                                  
                                  // Set cursor position in the next render cycle
                                  setTimeout(() => {
                                    if (e.target && typeof cursorPosition === 'number') {
                                      e.target.setSelectionRange(cursorPosition, cursorPosition);
                                    }
                                  }, 0);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {property.propertyType !== "self-occupied" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`municipalTaxes-${index}`}>Municipal Taxes</Label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <Input
                                  id={`municipalTaxes-${index}`}
                                  className="pl-7"
                                  value={property.municipalTaxes}
                                  onChange={(e) => {
                                    // Store the original cursor position
                                    const cursorPosition = e.target.selectionStart;
                                    
                                    // Format the value
                                    const value = formatCurrency(e.target.value);
                                    updateIncomeField("housePropertyIncome", index, "municipalTaxes", value);
                                    
                                    // Set cursor position in the next render cycle
                                    setTimeout(() => {
                                      if (e.target && typeof cursorPosition === 'number') {
                                        e.target.setSelectionRange(cursorPosition, cursorPosition);
                                      }
                                    }, 0);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`unrealizedRent-${index}`}>Unrealized Rent</Label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <Input
                                  id={`unrealizedRent-${index}`}
                                  className="pl-7"
                                  value={property.unrealizedRent}
                                  onChange={(e) => {
                                    // Store the original cursor position
                                    const cursorPosition = e.target.selectionStart;
                                    
                                    // Format the value
                                    const value = formatCurrency(e.target.value);
                                    updateIncomeField("housePropertyIncome", index, "unrealizedRent", value);
                                    
                                    // Set cursor position in the next render cycle
                                    setTimeout(() => {
                                      if (e.target && typeof cursorPosition === 'number') {
                                        e.target.setSelectionRange(cursorPosition, cursorPosition);
                                      }
                                    }, 0);
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor={`interestOnHousingLoan-${index}`}>Interest on Housing Loan</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <Input
                              id={`interestOnHousingLoan-${index}`}
                              className="pl-7"
                              value={property.interestOnHousingLoan}
                              onChange={(e) => {
                                // Store the original cursor position
                                const cursorPosition = e.target.selectionStart;
                                
                                // Format the value
                                const value = formatCurrency(e.target.value);
                                updateIncomeField("housePropertyIncome", index, "interestOnHousingLoan", value);
                                
                                // Set cursor position in the next render cycle
                                setTimeout(() => {
                                  if (e.target && typeof cursorPosition === 'number') {
                                    e.target.setSelectionRange(cursorPosition, cursorPosition);
                                  }
                                }, 0);
                              }}
                            />
                          </div>
                          {property.propertyType === "self-occupied" && (
                            <p className="text-xs text-gray-500">Maximum deduction of ₹2,00,000 under Section 24(b)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Additional income sources would be added here */}
              
              {formData.incomeSource.length === 0 && (
                <div className="text-amber-600 bg-amber-50 p-4 rounded-lg">
                  No income sources selected. Please go back to Step 2 and select at least one source of income.
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Deductions */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Tax Deductions</h3>
                <p className="text-sm text-blue-600">
                  Claim deductions under various sections to reduce your taxable income. The standard deduction of 
                  {assessmentYear === "2025-26" || assessmentYear === "2026-27" ? " ₹75,000" : " ₹50,000"} 
                  has been automatically applied to your salary income.
                </p>
              </div>
              
              {/* Section 80C Deductions */}
              <div className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Section 80C Deductions (Max ₹1,50,000)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ppf">PPF (Public Provident Fund)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="ppf"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="elss">ELSS (Equity Linked Saving Scheme)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="elss"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lifeInsurance">Life Insurance Premium</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="lifeInsurance"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="houseLoanPrincipal">Housing Loan Principal Repayment</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="houseLoanPrincipal"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sukanya">Sukanya Samriddhi Yojana</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="sukanya"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nsc">NSC (National Savings Certificate)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="nsc"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fixedDeposit">Tax Saving Fixed Deposit (5 years)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="fixedDeposit"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="epf">EPF/GPF Contribution</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="epf"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nps">NPS Tier 1 Account Contribution</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="nps"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tuitionFees">Tuition Fees for Children (max 2)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="tuitionFees"
                        className="pl-7"
                        placeholder="Enter Amount"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 80D Deductions */}
              <div className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Section 80D - Health Insurance</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="selfMedicalInsurance">Medical Insurance Premium (Self & Family)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="selfMedicalInsurance"
                        className="pl-7"
                        placeholder="Max ₹25,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Max ₹25,000 (₹50,000 if age 60+)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentsMedicalInsurance">Medical Insurance Premium (Parents)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="parentsMedicalInsurance"
                        className="pl-7"
                        placeholder="Max ₹25,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Max ₹25,000 (₹50,000 if age 60+)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preventiveHealthCheckup">Preventive Health Check-up</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="preventiveHealthCheckup"
                        className="pl-7"
                        placeholder="Max ₹5,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Maximum of ₹5,000 included in the limits above</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicalExpenditure">Medical Expenditure (Senior Citizens)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="medicalExpenditure"
                        className="pl-7"
                        placeholder="For uninsured senior citizens"
                      />
                    </div>
                    <p className="text-xs text-gray-500">For uninsured senior citizens (part of ₹50,000 limit)</p>
                  </div>
                </div>
              </div>
              
              {/* Other Deductions */}
              <div className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Other Deductions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="section80CCD">Section 80CCD(1B) - Additional NPS</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80CCD"
                        className="pl-7"
                        placeholder="Max ₹50,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Additional deduction for NPS (max ₹50,000)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80E">Section 80E - Education Loan Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80E"
                        className="pl-7"
                        placeholder="No upper limit"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Interest on education loan (no maximum limit)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80G">Section 80G - Donations</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80G"
                        className="pl-7"
                        placeholder="Depending on donation type"
                      />
                    </div>
                    <p className="text-xs text-gray-500">50-100% deduction based on donation type</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80TTA">Section 80TTA - Savings Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80TTA"
                        className="pl-7"
                        placeholder="Max ₹10,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Interest from savings account (max ₹10,000)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80TTB">Section 80TTB - Interest for Seniors</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80TTB"
                        className="pl-7"
                        placeholder="Max ₹50,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Interest income for senior citizens (max ₹50,000)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80EEA">Section 80EEA - Housing Loan Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80EEA"
                        className="pl-7"
                        placeholder="Max ₹1,50,000"
                      />
                    </div>
                    <p className="text-xs text-gray-500">First-time home buyers (max ₹1,50,000)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80DDB">Section 80DDB - Medical Treatment</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80DDB"
                        className="pl-7"
                        placeholder="Specified diseases"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Treatment of specified diseases (max ₹40,000/₹1,00,000)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section80U">Section 80U - Disability</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="section80U"
                        className="pl-7"
                        placeholder="For persons with disability"
                      />
                    </div>
                    <p className="text-xs text-gray-500">₹75,000 (disability) or ₹1,25,000 (severe disability)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Taxes Paid */}
          {currentStep === 5 && (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium mb-2">Taxes Paid Coming Soon</h3>
              <p className="text-gray-500">
                We're still working on this section. Please check back later.
              </p>
            </div>
          )}
          
          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium mb-2">Review & Submit Coming Soon</h3>
              <p className="text-gray-500">
                We're still working on this section. Please check back later.
              </p>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={
                (currentStep === 1 && (!formData.fullName || !formData.pan || !validatePAN(formData.pan))) ||
                (currentStep === 2 && formData.incomeSource.length === 0)
              }
            >
              {currentStep < steps.length ? "Continue" : "Complete Filing"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}