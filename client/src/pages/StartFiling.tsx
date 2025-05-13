import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { X, Plus, BarChart4, Landmark, TrendingUp, ArrowDown, AlertTriangle } from 'lucide-react';
import SalarySection from "@/components/SalarySection";
import TaxComputationDocument from "@/components/TaxComputationDocument";
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
    updateTaxPaid,
    taxFormData,
    assessmentYear,
    setAssessmentYear,
    taxSummary,
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
      propertyAddress: "",
      tenantName: "",
      tenantPAN: "",
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
  
  // State for taxes paid
  const [taxesPaid, setTaxesPaid] = useState({
    tdsFromSalary: taxFormData?.taxPaid?.tdsFromSalary || "",
    tdsFromOtherIncome: taxFormData?.taxPaid?.tdsFromOtherIncome || "",
    advanceTaxPaid: taxFormData?.taxPaid?.advanceTaxPaid || "",
    selfAssessmentTaxPaid: taxFormData?.taxPaid?.selfAssessmentTaxPaid || "",
    totalTaxesPaid: taxFormData?.taxPaid?.totalTaxesPaid || "0"
  });
  
  const [deductions80D, setDeductions80D] = useState({
    selfAndFamilyMedicalInsurance: taxFormData?.deductions80D?.selfAndFamilyMedicalInsurance || "",
    parentsMedicalInsurance: taxFormData?.deductions80D?.parentsMedicalInsurance || "",
    selfAndFamilyMedicalExpenditure: taxFormData?.deductions80D?.selfAndFamilyMedicalExpenditure || "",
    parentsMedicalExpenditure: taxFormData?.deductions80D?.parentsMedicalExpenditure || "",
    preventiveHealthCheckup: taxFormData?.deductions80D?.preventiveHealthCheckup || "",
    totalAmount: taxFormData?.deductions80D?.totalAmount || "0"
  });
  
  const [otherDeductions, setOtherDeductions] = useState({
    section80CCD: taxFormData?.otherDeductions?.section80CCD || "",
    section80E: taxFormData?.otherDeductions?.section80E || "",
    section80G: taxFormData?.otherDeductions?.section80G || "",
    section80GG: taxFormData?.otherDeductions?.section80GG || "",
    section80TTA: taxFormData?.otherDeductions?.section80TTA || "",
    section80TTB: taxFormData?.otherDeductions?.section80TTB || "",
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
        
      case 4:
        // Update all deductions data
        updateDeductions80C(deductions80C);
        updateDeductions80D(deductions80D);
        updateOtherDeductions(otherDeductions);
        break;
        
      case 5:
        // Update taxes paid data
        updateTaxPaid(taxesPaid);
        break;
      default:
        break;
    }
    
    // Move to next step
    if (currentStep < steps.length) {
      nextStep();
    }
  };
  
  // Handle deduction changes
  const handleDeduction80CChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    
    setDeductions80C(prev => {
      const updatedDeductions = {
        ...prev,
        [field]: numericValue
      };
      
      // Calculate the total amount for 80C deductions
      const total = Object.entries(updatedDeductions)
        .filter(([key]) => key !== "totalAmount")
        .reduce((sum, [_, val]) => sum + (parseInt(val) || 0), 0);
      
      const updatedWithTotal = {
        ...updatedDeductions,
        totalAmount: total.toString()
      };
      
      // Update context
      updateDeductions80C(updatedWithTotal);
      
      return updatedWithTotal;
    });
  };
  
  const handleDeduction80DChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    
    setDeductions80D(prev => {
      const updatedDeductions = {
        ...prev,
        [field]: numericValue
      };
      
      // Calculate the total amount for 80D deductions
      const total = Object.entries(updatedDeductions)
        .filter(([key]) => key !== "totalAmount")
        .reduce((sum, [_, val]) => sum + (parseInt(val) || 0), 0);
      
      const updatedWithTotal = {
        ...updatedDeductions,
        totalAmount: total.toString()
      };
      
      // Update context
      updateDeductions80D(updatedWithTotal);
      
      return updatedWithTotal;
    });
  };
  
  const handleOtherDeductionChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    
    setOtherDeductions(prev => {
      const updatedDeductions = {
        ...prev,
        [field]: numericValue
      };
      
      // Calculate the total amount for other deductions
      const total = Object.entries(updatedDeductions)
        .filter(([key]) => key !== "totalAmount")
        .reduce((sum, [_, val]) => sum + (parseInt(val) || 0), 0);
      
      const updatedWithTotal = {
        ...updatedDeductions,
        totalAmount: total.toString()
      };
      
      // Update context
      updateOtherDeductions(updatedWithTotal);
      
      return updatedWithTotal;
    });
  };
  
  // Handler for taxes paid section
  const handleTaxesPaidChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    
    setTaxesPaid(prev => {
      const updatedTaxesPaid = {
        ...prev,
        [field]: numericValue
      };
      
      // Calculate the total tax paid
      const total = Object.entries(updatedTaxesPaid)
        .filter(([key]) => key !== "totalTaxesPaid")
        .reduce((sum, [_, val]) => sum + (parseInt(val) || 0), 0);
      
      const updatedWithTotal = {
        ...updatedTaxesPaid,
        totalTaxesPaid: total.toString()
      };
      
      // Update context with the latest tax paid data
      updateTaxPaid(updatedWithTotal);
      
      return updatedWithTotal;
    });
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
              propertyAddress: "",
              tenantName: "",
              tenantPAN: "",
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
              
              {/* Capital Gains Income */}
              {formData.incomeSource.includes("capital-gains") && (
                <div className="p-6 bg-white border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                      Capital Gains
                    </h3>
                    
                    {/* Add another capital gain source button */}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addIncomeEntry("capitalGainsIncome")}
                      className="text-xs flex items-center"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Another Asset
                    </Button>
                  </div>
                  
                  {/* For each capital gain entry, show a set of fields */}
                  {formData.capitalGainsIncome.map((capitalGain, index) => (
                    <div key={capitalGain.id} className="mb-6 last:mb-0 border-t pt-4 first:border-t-0 first:pt-0">
                      {/* Show capital gain number and delete button if there are multiple */}
                      {formData.capitalGainsIncome.length > 1 && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-500">
                            Asset #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIncomeEntry("capitalGainsIncome", index)}
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={formData.capitalGainsIncome.length <= 1}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`assetType-${index}`}>Asset Type</Label>
                          <Select 
                            value={capitalGain.assetType}
                            onValueChange={(value) => updateIncomeField("capitalGainsIncome", index, "assetType", value)}
                          >
                            <SelectTrigger id={`assetType-${index}`}>
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equity">Stocks & Equity</SelectItem>
                              <SelectItem value="property">Real Estate Property</SelectItem>
                              <SelectItem value="gold">Gold & Precious Metals</SelectItem>
                              <SelectItem value="crypto">Cryptocurrency</SelectItem>
                              <SelectItem value="other">Other Assets</SelectItem>
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
                              value={capitalGain.saleProceeds}
                              onChange={(e) => {
                                // Allow direct input of numbers
                                const input = e.target.value;
                                // Allow only numbers and decimal point for input
                                const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                // Update the field with the raw input
                                updateIncomeField("capitalGainsIncome", index, "saleProceeds", onlyNumbers);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`purchaseCost-${index}`}>Purchase Cost</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <Input
                              id={`purchaseCost-${index}`}
                              className="pl-7"
                              value={capitalGain.purchaseCost}
                              onChange={(e) => {
                                // Allow direct input of numbers
                                const input = e.target.value;
                                // Allow only numbers and decimal point for input
                                const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                // Update the field with the raw input
                                updateIncomeField("capitalGainsIncome", index, "purchaseCost", onlyNumbers);
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`improvementCost-${index}`}>Improvement Cost</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <Input
                              id={`improvementCost-${index}`}
                              className="pl-7"
                              value={capitalGain.improvementCost}
                              onChange={(e) => {
                                // Allow direct input of numbers
                                const input = e.target.value;
                                // Allow only numbers and decimal point for input
                                const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                // Update the field with the raw input
                                updateIncomeField("capitalGainsIncome", index, "improvementCost", onlyNumbers);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`acquisitionDate-${index}`}>Acquisition Date</Label>
                          <Input
                            id={`acquisitionDate-${index}`}
                            type="date"
                            value={capitalGain.acquisitionDate}
                            onChange={(e) => updateIncomeField("capitalGainsIncome", index, "acquisitionDate", e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Date when asset was purchased</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`disposalDate-${index}`}>Disposal Date</Label>
                          <Input
                            id={`disposalDate-${index}`}
                            type="date"
                            value={capitalGain.disposalDate}
                            onChange={(e) => updateIncomeField("capitalGainsIncome", index, "disposalDate", e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Date when asset was sold</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox 
                          id={`indexationApplicable-${index}`}
                          checked={capitalGain.indexationApplicable}
                          onCheckedChange={(checked: boolean) => 
                            updateIncomeField("capitalGainsIncome", index, "indexationApplicable", checked)
                          }
                        />
                        <label
                          htmlFor={`indexationApplicable-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Apply Indexation Benefit
                        </label>
                      </div>
                      
                      {capitalGain.indexationApplicable && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-xs text-blue-800 mb-2">
                            Indexation adjusts the purchase cost for inflation, reducing your capital gains tax liability for long-term assets.
                          </p>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`indexedCost-${index}`}>Indexed Cost of Acquisition</Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                              <Input
                                id={`indexedCost-${index}`}
                                className="pl-7"
                                value={capitalGain.indexedCost}
                                onChange={(e) => {
                                  // Allow direct input of numbers
                                  const input = e.target.value;
                                  // Allow only numbers and decimal point for input
                                  const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                  // Update the field with the raw input
                                  updateIncomeField("capitalGainsIncome", index, "indexedCost", onlyNumbers);
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Cost of acquisition × (CII of year of sale ÷ CII of year of purchase)
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Exemption Section */}
                      <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-100">
                        <h4 className="text-sm font-bold text-green-700 mb-2">Capital Gains Exemption</h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`exemptionSection-${index}`}>Exemption Under Section</Label>
                            <Select 
                              value={capitalGain.exemptionSection}
                              onValueChange={(value) => updateIncomeField("capitalGainsIncome", index, "exemptionSection", value)}
                            >
                              <SelectTrigger id={`exemptionSection-${index}`}>
                                <SelectValue placeholder="Select applicable section" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Exemption</SelectItem>
                                <SelectItem value="54">Section 54 - Residential Property</SelectItem>
                                <SelectItem value="54B">Section 54B - Agricultural Land</SelectItem>
                                <SelectItem value="54EC">Section 54EC - Specified Bonds</SelectItem>
                                <SelectItem value="54EE">Section 54EE - Startup Investment</SelectItem>
                                <SelectItem value="54F">Section 54F - Sale of Any Asset</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {capitalGain.exemptionSection && capitalGain.exemptionSection !== "none" && (
                            <div className="space-y-2">
                              <Label htmlFor={`exemptionAmount-${index}`}>Exemption Amount</Label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <Input
                                  id={`exemptionAmount-${index}`}
                                  className="pl-7"
                                  value={capitalGain.exemptionAmount}
                                  onChange={(e) => {
                                    // Allow direct input of numbers
                                    const input = e.target.value;
                                    // Allow only numbers and decimal point for input
                                    const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                    // Update the field with the raw input
                                    updateIncomeField("capitalGainsIncome", index, "exemptionAmount", onlyNumbers);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Income Summary Section */}
                      <div className="mt-5 p-4 bg-purple-50 rounded-md border border-purple-100">
                        <h4 className="text-sm font-bold text-purple-700 mb-2">Capital Gains Summary</h4>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Sale Value:</span>
                          <span className="font-medium">
                            ₹{Number(capitalGain.saleProceeds || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Less: {capitalGain.indexationApplicable ? 'Indexed Cost' : 'Purchase Cost'}:</span>
                          <span className="font-medium text-red-600">
                            -₹{(capitalGain.indexationApplicable && capitalGain.indexedCost 
                              ? Number(capitalGain.indexedCost) 
                              : Number(capitalGain.purchaseCost || 0)
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Less: Improvement Cost:</span>
                          <span className="font-medium text-red-600">
                            -₹{Number(capitalGain.improvementCost || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        {capitalGain.exemptionSection && capitalGain.exemptionSection !== "none" && capitalGain.exemptionAmount && (
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span>Less: Exemption (Section {capitalGain.exemptionSection}):</span>
                            <span className="font-medium text-red-600">
                              -₹{Number(capitalGain.exemptionAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center font-bold text-purple-800 pt-2 border-t border-purple-200">
                          <span>Net Capital Gain:</span>
                          <span>
                            ₹{(
                              Number(capitalGain.saleProceeds || 0) - 
                              (capitalGain.indexationApplicable && capitalGain.indexedCost 
                                ? Number(capitalGain.indexedCost) 
                                : Number(capitalGain.purchaseCost || 0)) - 
                              Number(capitalGain.improvementCost || 0) - 
                              (capitalGain.exemptionSection && capitalGain.exemptionSection !== "none" 
                                ? Number(capitalGain.exemptionAmount || 0) 
                                : 0)
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        {/* Store the calculated value in netCapitalGain field - silent update */}
                        <span className="hidden">
                          {(() => {
                            const netGain = (
                              Number(capitalGain.saleProceeds || 0) - 
                              (capitalGain.indexationApplicable && capitalGain.indexedCost 
                                ? Number(capitalGain.indexedCost) 
                                : Number(capitalGain.purchaseCost || 0)) - 
                              Number(capitalGain.improvementCost || 0) - 
                              (capitalGain.exemptionSection && capitalGain.exemptionSection !== "none" 
                                ? Number(capitalGain.exemptionAmount || 0) 
                                : 0)
                            ).toString();
                            
                            // Silent update - doesn't return JSX
                            if (netGain !== capitalGain.netCapitalGain) {
                              updateIncomeField("capitalGainsIncome", index, "netCapitalGain", netGain);
                            }
                            return null;
                          })()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                                  // Allow direct input of numbers
                                  const input = e.target.value;
                                  
                                  // Allow only numbers and decimal point for input
                                  const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                  
                                  // Update the field with the raw input
                                  updateIncomeField("housePropertyIncome", index, "annualLetableValue", onlyNumbers);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Property Address - for all property types */}
                      <div className="mt-4">
                        <Label htmlFor={`propertyAddress-${index}`}>Property Address</Label>
                        <Input
                          id={`propertyAddress-${index}`}
                          className="mt-1"
                          placeholder="Complete property address"
                          value={property.propertyAddress || ""}
                          onChange={(e) => updateIncomeField("housePropertyIncome", index, "propertyAddress", e.target.value)}
                        />
                      </div>
                      
                      {/* Tenant Details - only for let-out properties */}
                      {property.propertyType === "let-out" && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <h4 className="text-sm font-medium text-blue-700 mb-2">Tenant Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor={`tenantName-${index}`} className="text-xs">Tenant Name</Label>
                              <Input
                                id={`tenantName-${index}`}
                                placeholder="Full name of tenant"
                                value={property.tenantName || ""}
                                onChange={(e) => updateIncomeField("housePropertyIncome", index, "tenantName", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`tenantPAN-${index}`} className="text-xs">Tenant PAN (Optional)</Label>
                              <Input
                                id={`tenantPAN-${index}`}
                                placeholder="PAN number of tenant"
                                value={property.tenantPAN || ""}
                                onChange={(e) => updateIncomeField("housePropertyIncome", index, "tenantPAN", e.target.value.toUpperCase())}
                                maxLength={10}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
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
                                    // Allow direct input of numbers
                                    const input = e.target.value;
                                    
                                    // Allow only numbers and decimal point for input
                                    const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                    
                                    // Update the field with the raw input
                                    updateIncomeField("housePropertyIncome", index, "municipalTaxes", onlyNumbers);
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
                                    // Allow direct input of numbers
                                    const input = e.target.value;
                                    
                                    // Allow only numbers and decimal point for input
                                    const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                    
                                    // Update the field with the raw input
                                    updateIncomeField("housePropertyIncome", index, "unrealizedRent", onlyNumbers);
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
                                // Allow direct input of numbers
                                const input = e.target.value;
                                
                                // Allow only numbers and decimal point for input
                                const onlyNumbers = input.replace(/[^0-9.]/g, '');
                                
                                // Update the field with the raw input
                                updateIncomeField("housePropertyIncome", index, "interestOnHousingLoan", onlyNumbers);
                              }}
                            />
                          </div>
                          {property.propertyType === "self-occupied" && (
                            <p className="text-xs text-gray-500">Maximum deduction of ₹2,00,000 under Section 24(b)</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Property Income Summary - shows calculated net income */}
                      <div className="mt-5 p-4 bg-blue-50 rounded-md border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-700 mb-2">Income from House Property Summary</h4>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Annual Value:</span>
                          <span className="font-medium">
                            ₹{property.propertyType === "self-occupied" 
                              ? "0" 
                              : Number(property.annualLetableValue || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        {property.propertyType !== "self-occupied" && (
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span>Less: Municipal Taxes:</span>
                            <span className="font-medium text-red-600">
                              -₹{Number(property.municipalTaxes || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Less: Standard Deduction (30%):</span>
                          <span className="font-medium text-red-600">
                            {property.propertyType === "self-occupied" 
                              ? "₹0" 
                              : `-₹${Math.round(Number(property.annualLetableValue || 0) * 0.3).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>Less: Interest on Housing Loan:</span>
                          <span className="font-medium text-red-600">
                            -₹{Number(property.interestOnHousingLoan || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center font-bold text-blue-800 pt-2 border-t border-blue-200">
                          <span>Net Income from House Property:</span>
                          <span>
                            {property.propertyType === "self-occupied" 
                              ? `₹${(-Math.min(Number(property.interestOnHousingLoan || 0), 200000)).toLocaleString('en-IN')}` 
                              : `₹${(
                                  Number(property.annualLetableValue || 0) - 
                                  Number(property.municipalTaxes || 0) - 
                                  Math.round(Number(property.annualLetableValue || 0) * 0.3) - 
                                  Number(property.interestOnHousingLoan || 0)
                                ).toLocaleString('en-IN')}`
                            }
                          </span>
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
                        value={deductions80C.ppf}
                        onChange={(e) => handleDeduction80CChange("ppf", e.target.value)}
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
                        value={deductions80C.elss}
                        onChange={(e) => handleDeduction80CChange("elss", e.target.value)}
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
                        value={deductions80C.lifeInsurance}
                        onChange={(e) => handleDeduction80CChange("lifeInsurance", e.target.value)}
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
                        value={deductions80C.houseLoanPrincipal}
                        onChange={(e) => handleDeduction80CChange("houseLoanPrincipal", e.target.value)}
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
                    <Label htmlFor="selfAndFamilyMedicalInsurance">Medical Insurance Premium (Self & Family)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="selfAndFamilyMedicalInsurance"
                        className="pl-7"
                        placeholder="Max ₹25,000"
                        value={deductions80D.selfAndFamilyMedicalInsurance}
                        onChange={(e) => handleDeduction80DChange("selfAndFamilyMedicalInsurance", e.target.value)}
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
                    <Label htmlFor="parentsMedicalExpenditure">Medical Expenditure (Senior Citizens)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="parentsMedicalExpenditure"
                        className="pl-7"
                        placeholder="For uninsured senior citizens"
                        value={deductions80D.parentsMedicalExpenditure}
                        onChange={(e) => handleDeduction80DChange("parentsMedicalExpenditure", e.target.value)}
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
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-blue-800">Taxes Paid</h2>
              
              {/* Tax Liability Section */}
              <div className="bg-blue-50 shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Estimated Tax Liability</h3>
                    <p className="text-sm text-gray-600">Based on your income and deductions</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-700">
                      ₹{taxSummary?.estimatedTax?.toLocaleString('en-IN') || "0"}
                    </span>
                    <div className="flex items-center text-sm text-gray-600 justify-end mt-1">
                      <ArrowDown className="h-5 w-5 text-gray-600 mr-1" />
                      <span>Taxes Paid Details Below</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* TDS Section */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">TDS (Tax Deducted at Source)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tdsFromSalary">TDS Deducted from Salary</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input 
                        id="tdsFromSalary" 
                        className="pl-7" 
                        value={taxesPaid.tdsFromSalary}
                        onChange={(e) => handleTaxesPaidChange('tdsFromSalary', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">As per Form 16 provided by employer</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tdsFromOtherIncome">TDS from Other Income</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input 
                        id="tdsFromOtherIncome" 
                        className="pl-7" 
                        value={taxesPaid.tdsFromOtherIncome}
                        onChange={(e) => handleTaxesPaidChange('tdsFromOtherIncome', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">TDS on interest, rent, etc. (As per Form 26AS)</p>
                  </div>
                </div>
              </div>
              
              {/* Other Taxes Paid Section */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Other Taxes Paid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="advanceTaxPaid">Advance Tax Paid</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input 
                        id="advanceTaxPaid" 
                        className="pl-7" 
                        value={taxesPaid.advanceTaxPaid}
                        onChange={(e) => handleTaxesPaidChange('advanceTaxPaid', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Tax paid in advance during the financial year</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="selfAssessmentTaxPaid">Self-Assessment Tax Paid</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input 
                        id="selfAssessmentTaxPaid" 
                        className="pl-7" 
                        value={taxesPaid.selfAssessmentTaxPaid}
                        onChange={(e) => handleTaxesPaidChange('selfAssessmentTaxPaid', e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Tax paid after financial year end but before filing</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-md flex justify-between items-center">
                  <span className="font-medium">Total Taxes Paid:</span>
                  <span className="font-semibold text-blue-700">
                    ₹{Number(taxesPaid.totalTaxesPaid || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              {/* Tax Payable or Refund Due */}
              {taxSummary && (
                <div className={`p-6 rounded-lg shadow-lg ${
                  (taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-xl font-semibold ${
                        (taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                          ? 'text-red-700' 
                          : 'text-green-700'
                      }`}>
                        {(taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                          ? 'Tax Payable' 
                          : 'Refund Due'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {(taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                          ? 'You need to pay additional tax before filing' 
                          : 'You will receive a refund after processing'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${
                        (taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        ₹{(Math.round(Math.abs(taxSummary.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) / 10) * 10).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-blue-800">Review & Submit</h2>
              
              {/* Computation of Income Document */}
              <div className="mb-8">
                <TaxComputationDocument 
                  taxSummary={taxSummary} 
                  personalInfo={{
                    name: formData.fullName,
                    pan: formData.pan,
                    filingType: filerType || "Individual"
                  }}
                  assessmentYear={assessmentYear}
                />
              </div>
              
              {/* Filing Summary */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Filing Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                    <dl className="space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Name:</dt>
                        <dd className="font-medium">{formData.fullName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">PAN:</dt>
                        <dd className="font-medium">{formData.pan}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Assessment Year:</dt>
                        <dd className="font-medium">{assessmentYear}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Filing Type:</dt>
                        <dd className="font-medium">{filerType || "Individual"}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Income & Tax Details</h4>
                    <dl className="space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Total Income:</dt>
                        <dd className="font-medium">₹{taxSummary?.totalIncome?.toLocaleString('en-IN') || "0"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Total Deductions:</dt>
                        <dd className="font-medium">₹{taxSummary?.totalDeductions?.toLocaleString('en-IN') || "0"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Taxable Income:</dt>
                        <dd className="font-medium">₹{taxSummary?.taxableIncome?.toLocaleString('en-IN') || "0"}</dd>
                      </div>
                      <div className="flex justify-between font-medium">
                        <dt>Tax Amount:</dt>
                        <dd>₹{taxSummary?.estimatedTax?.toLocaleString('en-IN') || "0"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              
              {/* Payment Status */}
              <div className={`p-6 rounded-lg shadow-lg ${
                (taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  (taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                    ? 'text-red-700' 
                    : 'text-green-700'
                }`}>
                  {(taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                    ? 'Tax Payment Required' 
                    : 'Tax Refund Due'}
                </h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600">
                      {(taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                        ? 'You need to pay the following amount before filing:' 
                        : 'You will receive the following refund after processing:'}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${
                      (taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      ₹{(Math.round(Math.abs(taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) / 10) * 10).toLocaleString('en-IN')}
                    </p>
                  </div>
                  {(taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Pay using:</p>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          className="bg-white"
                          onClick={() => setLocation("/payment?method=netbanking")}
                        >
                          <img src="https://www.netmeds.com/images/cms/offers/1606302934_1605251328_netbanking.png" 
                               alt="Net Banking" 
                               className="h-6 w-auto mr-2" />
                          Net Banking
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-white"
                          onClick={() => setLocation("/payment?method=upi")}
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" 
                               alt="Paytm" 
                               className="h-5 w-auto mr-2" />
                          UPI
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {(taxSummary?.estimatedTax - Number(taxesPaid.totalTaxesPaid || 0)) > 0 ? (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium mb-2">File after payment</h4>
                    <p className="text-sm text-gray-600 mb-4">You need to complete the payment before you can file your return.</p>
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800" 
                      onClick={() => setLocation("/payment")}
                    >
                      Pay & File Now
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium mb-2">Ready to file</h4>
                    <p className="text-sm text-gray-600 mb-4">Your return is ready to be filed. Click the button below to proceed.</p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setLocation("/filing-complete")}
                    >
                      File My Return
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Declaration */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 mb-2">Declaration</h4>
                <p className="text-sm text-gray-600">
                  I solemnly declare that to the best of my knowledge and belief, the information given in this return and the schedules, statements, etc. accompanying it is correct and complete, and the amount of total income and other particulars shown therein are truly stated and are in accordance with the provisions of the Income-tax Act, 1961.
                </p>
              </div>
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