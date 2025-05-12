import { useState, useContext } from "react";
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
  'A': 'Association of Persons (AOP)',
  'T': 'Trust',
  'B': 'Body of Individuals (BOI)',
  'L': 'Local Authority',
  'J': 'Artificial Juridical Person',
  'G': 'Government',
};

// Function to validate PAN number
function validatePAN(pan: string): boolean {
  if (!pan) return false;
  
  // Remove spaces and convert to uppercase
  pan = pan.replace(/\s/g, '').toUpperCase();
  
  // PAN should be 10 characters
  if (pan.length !== 10) return false;
  
  // First 5 characters should be alphabets
  if (!/^[A-Z]{5}/.test(pan)) return false;
  
  // Next 4 characters should be numbers
  if (!/^[A-Z]{5}[0-9]{4}/.test(pan)) return false;
  
  // Last character should be an alphabet
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return false;
  
  return true;
}

// Function to get entity type from PAN
function getPANEntityType(pan: string): string | null {
  if (!validatePAN(pan)) return null;
  
  // Entity type is 4th character
  const entityCode = pan.charAt(3);
  return PAN_ENTITY_TYPES[entityCode] || null;
}

// Function to check if PAN belongs to an individual
function isIndividualPAN(pan: string): boolean {
  if (!validatePAN(pan)) return false;
  
  // 'P' entity code represents an individual
  return pan.charAt(3) === 'P';
}

import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  PlusCircle, 
  MinusCircle,
  Home, 
  Briefcase,
  PiggyBank,
  CreditCard,
  Calculator,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaxDataContext } from "@/context/TaxDataProvider";
import ProgressTracker from "@/components/ProgressTracker";
import { apiRequest } from "@/lib/queryClient";
import { formatIndianCurrency } from "@/lib/formatters";

// Define step types
interface Step {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

const StartFiling = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const {
    currentStep,
    setCurrentStep,
    nextStep: goToNextStep,
    previousStep: goToPreviousStep,
    updatePersonalInfo,
    taxFormId,
    taxFormData,
    assessmentYear,
    setAssessmentYear,
  } = useContext(TaxDataContext);
  
  const [selectedTab, setSelectedTab] = useState("quick-start");
  const [activeStep, setActiveStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    pan: "",
    name: "",
    dob: "",
    email: "",
    mobile: "",
    assessmentYear: "2024-25",
    incomeSource: [] as string[],
    // Income section details - now as arrays to support multiple income sources
    salaryIncome: [{
      id: "salary-1",
      employerName: "",
      grossSalary: "",
      tdsDeducted: ""
    }],
    housePropertyIncome: [{
      id: "property-1",
      propertyType: "self-occupied",
      rentalIncome: "",
      interestPaid: "",
      propertyTax: ""
    }],
    capitalGainsIncome: [{
      id: "capital-1",
      shortTerm: "",
      longTerm: ""
    }],
    businessIncome: [{
      id: "business-1",
      grossReceipts: "",
      expenses: "",
      netProfit: ""
    }],
    interestIncome: [{
      id: "interest-1",
      savingsAccount: "",
      fixedDeposits: "",
      other: ""
    }],
    otherIncome: [{
      id: "other-1",
      amount: "",
      description: ""
    }]
  });
  
  // Fill form with existing data if available
  useState(() => {
    if (taxFormData && taxFormData.personalInfo) {
      setFormData({
        ...formData,
        ...taxFormData.personalInfo,
        assessmentYear: taxFormData.assessmentYear || "2024-25"
      });
    }
  });
  
  const steps: Step[] = [
    {
      number: 1,
      title: "Basic Details",
      description: "Personal information",
      completed: activeStep > 1,
      active: activeStep === 1,
    },
    {
      number: 2,
      title: "Income Sources",
      description: "Select income types",
      completed: activeStep > 2,
      active: activeStep === 2,
    },
    {
      number: 3,
      title: "Income Details",
      description: "Based on selections",
      completed: activeStep > 3,
      active: activeStep === 3,
    },
    {
      number: 4,
      title: "Tax Payments",
      description: "TDS & advance tax",
      completed: activeStep > 4,
      active: activeStep === 4,
    },
    {
      number: 5,
      title: "Tax Calculation",
      description: "Refund or tax due",
      completed: activeStep > 5,
      active: activeStep === 5,
    },
    {
      number: 6,
      title: "File Return",
      description: "Submit your ITR",
      completed: activeStep > 6,
      active: activeStep === 6,
    },
  ];
  
  // Add state for PAN validation
  const [panValidationState, setPanValidationState] = useState({
    isValid: true,
    message: "",
    entityType: "",
    isIndividual: true
  });

  const handleInputChange = (name: string, value: string) => {
    // Special handling for PAN
    if (name === "pan") {
      // Convert to uppercase and remove spaces
      value = value.replace(/\s/g, '').toUpperCase();
      
      // Validate PAN
      const isPanValid = validatePAN(value);
      const entityType = getPANEntityType(value);
      const isIndividual = isIndividualPAN(value);
      
      // Update validation state
      setPanValidationState({
        isValid: isPanValid,
        message: isPanValid 
          ? (entityType ? `Valid PAN (${entityType})` : "")
          : (value.length === 10 ? "Invalid PAN format" : value.length > 0 ? "PAN must be 10 characters" : ""),
        entityType: entityType || "",
        isIndividual
      });
      
      // If PAN is changed and not an individual, remove salary from income sources
      if (!isIndividual && value.length === 10) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          incomeSource: prev.incomeSource.filter(source => source !== "salary")
        }));
        return;
      }
    }
    
    // Default handling for all fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (source: string) => {
    setFormData(prev => {
      const currentSources = [...prev.incomeSource];
      if (currentSources.includes(source)) {
        return {
          ...prev,
          incomeSource: currentSources.filter(item => item !== source)
        };
      } else {
        return {
          ...prev,
          incomeSource: [...currentSources, source]
        };
      }
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          
          toast({
            title: "File uploaded successfully",
            description: "Your Form 16 has been processed",
          });
          
          // Reset progress after completing
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const savePersonalInfo = async () => {
    if (!formData.pan || !formData.name) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }
    
    try {
      updatePersonalInfo(formData);
      
      // Save to API
      await apiRequest(
        `/api/tax-forms/${taxFormId}/personal-info`,
        { method: "POST" },
        formData
      );
      
      toast({
        title: "Information saved",
        description: "Your personal information has been saved",
      });
      
      // Move to next step in wizard
      nextStep();
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to proceed to the next step in the wizard
  const nextStep = () => {
    if (activeStep < steps.length) {
      // Calculate which step to go to next
      let nextStepNumber = activeStep + 1;
      
      // Skip to step 4 (Tax Payments) if coming from step 3
      if (activeStep === 3) {
        nextStepNumber = 4;
      }
      
      setActiveStep(nextStepNumber);
      
      // For TaxFiling detailed pages, redirect after income details are collected
      if (activeStep === 3 && formData.incomeSource.length > 0) {
        // Save income data to API here
        try {
          // For simplicity, use setTimeout to simulate API call
          setTimeout(() => {
            toast({
              title: "Income details saved",
              description: "Your income details have been saved successfully"
            });
          }, 500);
          
          // Redirect to tax-filing page with all the detailed forms
          setLocation("/tax-filing");
          return;
        } catch (error) {
          console.error("Error saving income details:", error);
          toast({
            title: "Error",
            description: "Failed to save income details. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  };
  
  const previousStep = () => {
    if (activeStep > 1) {
      // Special handling for step 3
      if (activeStep === 3) {
        // Go back to income source selection (step 2)
        setActiveStep(2);
      } else {
        setActiveStep(activeStep - 1);
      }
    }
  };
  
  // Income Details Component for Step 3
  const IncomeDetailsStep = () => {
    // Helper function to update nested state for multiple incomes
    const updateIncomeField = (sourceType: string, index: number, field: string, value: string) => {
      setFormData(prev => {
        const updatedForm = { ...prev };
        
        if (sourceType === "salaryIncome") {
          const updatedSalary = [...prev.salaryIncome];
          updatedSalary[index] = {
            ...updatedSalary[index],
            [field]: value
          };
          updatedForm.salaryIncome = updatedSalary;
        } else if (sourceType === "housePropertyIncome") {
          const updatedProperty = [...prev.housePropertyIncome];
          updatedProperty[index] = {
            ...updatedProperty[index],
            [field]: value
          };
          updatedForm.housePropertyIncome = updatedProperty;
        } else if (sourceType === "capitalGainsIncome") {
          const updatedCapital = [...prev.capitalGainsIncome];
          updatedCapital[index] = {
            ...updatedCapital[index],
            [field]: value
          };
          updatedForm.capitalGainsIncome = updatedCapital;
        } else if (sourceType === "businessIncome") {
          const updatedBusiness = [...prev.businessIncome];
          updatedBusiness[index] = {
            ...updatedBusiness[index],
            [field]: value
          };
          updatedForm.businessIncome = updatedBusiness;
        } else if (sourceType === "interestIncome") {
          const updatedInterest = [...prev.interestIncome];
          updatedInterest[index] = {
            ...updatedInterest[index],
            [field]: value
          };
          updatedForm.interestIncome = updatedInterest;
        } else if (sourceType === "otherIncome") {
          const updatedOther = [...prev.otherIncome];
          updatedOther[index] = {
            ...updatedOther[index],
            [field]: value
          };
          updatedForm.otherIncome = updatedOther;
        }
        
        return updatedForm;
      });
    };
    
    // Function to add a new income entry
    const addIncomeEntry = (sourceType: string) => {
      setFormData(prev => {
        const updatedForm = { ...prev };
        
        if (sourceType === "salaryIncome") {
          updatedForm.salaryIncome = [
            ...prev.salaryIncome,
            {
              id: `salary-${prev.salaryIncome.length + 1}`,
              employerName: "",
              grossSalary: "",
              tdsDeducted: ""
            }
          ];
        } else if (sourceType === "housePropertyIncome") {
          updatedForm.housePropertyIncome = [
            ...prev.housePropertyIncome,
            {
              id: `property-${prev.housePropertyIncome.length + 1}`,
              propertyType: "self-occupied",
              rentalIncome: "",
              interestPaid: "",
              propertyTax: ""
            }
          ];
        } else if (sourceType === "capitalGainsIncome") {
          updatedForm.capitalGainsIncome = [
            ...prev.capitalGainsIncome,
            {
              id: `capital-${prev.capitalGainsIncome.length + 1}`,
              shortTerm: "",
              longTerm: ""
            }
          ];
        } else if (sourceType === "businessIncome") {
          updatedForm.businessIncome = [
            ...prev.businessIncome,
            {
              id: `business-${prev.businessIncome.length + 1}`,
              grossReceipts: "",
              expenses: "",
              netProfit: ""
            }
          ];
        } else if (sourceType === "interestIncome") {
          updatedForm.interestIncome = [
            ...prev.interestIncome,
            {
              id: `interest-${prev.interestIncome.length + 1}`,
              savingsAccount: "",
              fixedDeposits: "",
              other: ""
            }
          ];
        } else if (sourceType === "otherIncome") {
          updatedForm.otherIncome = [
            ...prev.otherIncome,
            {
              id: `other-${prev.otherIncome.length + 1}`,
              amount: "",
              description: ""
            }
          ];
        }
        
        return updatedForm;
      });
    };
    
    // Function to remove an income entry
    const removeIncomeEntry = (sourceType: string, index: number) => {
      // Don't remove if it's the last entry
      setFormData(prev => {
        const updatedForm = { ...prev };
        
        if (sourceType === "salaryIncome" && prev.salaryIncome.length > 1) {
          updatedForm.salaryIncome = prev.salaryIncome.filter((_, i) => i !== index);
        } else if (sourceType === "housePropertyIncome" && prev.housePropertyIncome.length > 1) {
          updatedForm.housePropertyIncome = prev.housePropertyIncome.filter((_, i) => i !== index);
        } else if (sourceType === "capitalGainsIncome" && prev.capitalGainsIncome.length > 1) {
          updatedForm.capitalGainsIncome = prev.capitalGainsIncome.filter((_, i) => i !== index);
        } else if (sourceType === "businessIncome" && prev.businessIncome.length > 1) {
          updatedForm.businessIncome = prev.businessIncome.filter((_, i) => i !== index);
        } else if (sourceType === "interestIncome" && prev.interestIncome.length > 1) {
          updatedForm.interestIncome = prev.interestIncome.filter((_, i) => i !== index);
        } else if (sourceType === "otherIncome" && prev.otherIncome.length > 1) {
          updatedForm.otherIncome = prev.otherIncome.filter((_, i) => i !== index);
        }
        
        return updatedForm;
      });
    };
    
    // Format currency input
    const formatCurrency = (value: string) => {
      if (!value) return "";
      // Remove any non-digit characters
      const numericValue = value.replace(/[^\d]/g, "");
      // Format with Indian numbering system (lakhs, crores)
      return numericValue.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    };
    
    return (
      <div className="space-y-8">
        {formData.incomeSource.length === 0 ? (
          <div className="p-6 text-center bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">No income sources selected. Please go back and select at least one income source.</p>
          </div>
        ) : (
          <>
            {/* Salary Income - Now with multiple entries */}
            {formData.incomeSource.includes("salary") && (
              <div className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                    Salary Income
                  </h3>
                  
                  {/* Add another salary source button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addIncomeEntry("salaryIncome")}
                    className="text-xs flex items-center"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Add Another Employer
                  </Button>
                </div>
                
                {/* For each salary entry, show a set of fields */}
                {formData.salaryIncome.map((salary, index) => (
                  <div key={salary.id} className="mb-6 last:mb-0 border-t pt-4 first:border-t-0 first:pt-0">
                    {/* Show income number and delete button if there are multiple */}
                    {formData.salaryIncome.length > 1 && (
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          Employer #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncomeEntry("salaryIncome", index)}
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          disabled={formData.salaryIncome.length <= 1}
                        >
                          <MinusCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`employerName-${index}`}>Employer Name</Label>
                        <Input
                          id={`employerName-${index}`}
                          value={salary.employerName}
                          onChange={(e) => updateIncomeField("salaryIncome", index, "employerName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`grossSalary-${index}`}>Gross Salary</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                          <Input
                            id={`grossSalary-${index}`}
                            className="pl-7"
                            value={salary.grossSalary}
                            onChange={(e) => updateIncomeField("salaryIncome", index, "grossSalary", formatCurrency(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`tdsDeducted-${index}`}>TDS Deducted</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                          <Input
                            id={`tdsDeducted-${index}`}
                            className="pl-7"
                            value={salary.tdsDeducted}
                            onChange={(e) => updateIncomeField("salaryIncome", index, "tdsDeducted", formatCurrency(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* House Property Income - Now with multiple entries */}
            {formData.incomeSource.includes("house-property") && (
              <div className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Home className="h-5 w-5 text-green-500 mr-2" />
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
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Add Another Property
                  </Button>
                </div>
                
                {/* For each property entry, show a set of fields */}
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
                          <MinusCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
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
                            <SelectItem value="self-occupied">Self Occupied</SelectItem>
                            <SelectItem value="let-out">Let Out</SelectItem>
                            <SelectItem value="deemed-let-out">Deemed Let Out</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {property.propertyType !== "self-occupied" && (
                        <div className="space-y-2">
                          <Label htmlFor={`rentalIncome-${index}`}>Annual Rental Income</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <Input
                              id={`rentalIncome-${index}`}
                              className="pl-7"
                              value={property.rentalIncome}
                              onChange={(e) => updateIncomeField("housePropertyIncome", index, "rentalIncome", formatCurrency(e.target.value))}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor={`interestPaid-${index}`}>Interest Paid on Housing Loan</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                          <Input
                            id={`interestPaid-${index}`}
                            className="pl-7"
                            value={property.interestPaid}
                            onChange={(e) => updateIncomeField("housePropertyIncome", index, "interestPaid", formatCurrency(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      {property.propertyType !== "self-occupied" && (
                        <div className="space-y-2">
                          <Label htmlFor={`propertyTax-${index}`}>Municipal/Property Tax Paid</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <Input
                              id={`propertyTax-${index}`}
                              className="pl-7"
                              value={property.propertyTax}
                              onChange={(e) => updateIncomeField("housePropertyIncome", index, "propertyTax", formatCurrency(e.target.value))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Capital Gains Income */}
            {formData.incomeSource.includes("capital-gains") && (
              <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <PiggyBank className="h-5 w-5 text-purple-500 mr-2" />
                  Capital Gains
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shortTerm">Short Term Capital Gains</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="shortTerm"
                        className="pl-7"
                        value={formData.capitalGainsIncome.shortTerm}
                        onChange={(e) => updateIncomeField("capitalGainsIncome", "shortTerm", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longTerm">Long Term Capital Gains</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="longTerm"
                        className="pl-7"
                        value={formData.capitalGainsIncome.longTerm}
                        onChange={(e) => updateIncomeField("capitalGainsIncome", "longTerm", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Business Income */}
            {formData.incomeSource.includes("business") && (
              <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
                  Business/Profession Income
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grossReceipts">Gross Receipts/Turnover</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="grossReceipts"
                        className="pl-7"
                        value={formData.businessIncome.grossReceipts}
                        onChange={(e) => updateIncomeField("businessIncome", "grossReceipts", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Total Expenses</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="expenses"
                        className="pl-7"
                        value={formData.businessIncome.expenses}
                        onChange={(e) => updateIncomeField("businessIncome", "expenses", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="netProfit">Net Profit</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="netProfit"
                        className="pl-7"
                        value={formData.businessIncome.netProfit}
                        onChange={(e) => updateIncomeField("businessIncome", "netProfit", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Interest Income */}
            {formData.incomeSource.includes("interest") && (
              <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-pink-500 mr-2" />
                  Interest Income
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="savingsAccount">Savings Account Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="savingsAccount"
                        className="pl-7"
                        value={formData.interestIncome.savingsAccount}
                        onChange={(e) => updateIncomeField("interestIncome", "savingsAccount", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fixedDeposits">Fixed Deposits Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="fixedDeposits"
                        className="pl-7"
                        value={formData.interestIncome.fixedDeposits}
                        onChange={(e) => updateIncomeField("interestIncome", "fixedDeposits", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherInterest">Other Interest Income</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="otherInterest"
                        className="pl-7"
                        value={formData.interestIncome.other}
                        onChange={(e) => updateIncomeField("interestIncome", "other", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other Income */}
            {formData.incomeSource.includes("other") && (
              <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <PlusCircle className="h-5 w-5 text-gray-500 mr-2" />
                  Other Income
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherAmount">Amount</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input
                        id="otherAmount"
                        className="pl-7"
                        value={formData.otherIncome.amount}
                        onChange={(e) => updateIncomeField("otherIncome", "amount", formatCurrency(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDescription">Description</Label>
                    <Input
                      id="otherDescription"
                      value={formData.otherIncome.description}
                      onChange={(e) => updateIncomeField("otherIncome", "description", e.target.value)}
                      placeholder="e.g., Dividends, Lottery, Gifts"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  // Income Sources Selection Component for Step 2
  const IncomeSourcesStep = () => {
    // Filter out salary option for non-individual PAN types
    const isIndividual = panValidationState.isIndividual;
    
    const allIncomeSources = [
      { 
        id: "salary", 
        label: "Salary/Pension", 
        icon: <Briefcase className="h-5 w-5 text-blue-500" />,
        description: "Income from employment or pension",
        examples: "Form 16, salary slips, pension statements",
        individualOnly: true // Only individuals can have salary income
      },
      { 
        id: "house-property", 
        label: "House Property", 
        icon: <Home className="h-5 w-5 text-green-500" />,
        description: "Rental income or home loan interest",
        examples: "Rent receipts, home loan statements",
        individualOnly: false
      },
      { 
        id: "capital-gains", 
        label: "Capital Gains", 
        icon: <PiggyBank className="h-5 w-5 text-purple-500" />,
        description: "Profit from sale of investments",
        examples: "Shares, property, mutual funds, crypto",
        individualOnly: false
      },
      { 
        id: "business", 
        label: "Business/Profession", 
        icon: <Briefcase className="h-5 w-5 text-orange-500" />,
        description: "Income from business activities",
        examples: "Freelance work, consultancy, small business",
        individualOnly: false
      },
      { 
        id: "interest", 
        label: "Interest Income", 
        icon: <CreditCard className="h-5 w-5 text-pink-500" />,
        description: "Bank deposits, bonds, etc.",
        examples: "Savings account, FDs, RDs, bonds",
        individualOnly: false
      },
      { 
        id: "other", 
        label: "Other Sources", 
        icon: <PlusCircle className="h-5 w-5 text-gray-500" />,
        description: "Dividends, lottery, gifts, etc.",
        examples: "Stock dividends, lottery winnings, gifts",
        individualOnly: false
      },
    ];
    
    // Filter sources based on PAN type
    const filteredSources = allIncomeSources.filter(source => 
      !source.individualOnly || (source.individualOnly && isIndividual)
    );
    
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map(source => (
            <Card 
              key={source.id} 
              className={`cursor-pointer hover:border-blue-300 transition-all ${
                formData.incomeSource.includes(source.id) ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleCheckboxChange(source.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 mt-1">
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{source.label}</h3>
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        {formData.incomeSource.includes(source.id) && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                    <div className="mt-2 text-xs text-gray-400 italic">
                      Examples: {source.examples}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Selection Guidance</h3>
          <p className="text-sm text-blue-700">
            Select all the sources from which you earned income during the financial year.
            This helps us determine which ITR form is appropriate for your filing.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Start Your ITR Filing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete the step-by-step process to file your income tax return for Assessment Year {formData.assessmentYear}
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <ProgressTracker steps={steps} />
        
        <div className="mt-8">
          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter your personal details to begin your tax filing process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
                  <TabsList className="grid grid-cols-2 mb-8">
                    <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
                    <TabsTrigger value="upload-form16">Upload Form 16</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quick-start">
                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pan">PAN Number <span className="text-red-500">*</span></Label>
                          <Input 
                            id="pan" 
                            type="text" 
                            placeholder="e.g., ABCDE1234F"
                            value={formData.pan} 
                            onChange={(e) => handleInputChange("pan", e.target.value)} 
                            className={
                              formData.pan && !panValidationState.isValid ? "border-red-500" : 
                              formData.pan && panValidationState.isValid ? "border-green-500" : ""
                            }
                          />
                          {formData.pan && (
                            <div className={`text-xs mt-1 ${panValidationState.isValid ? 'text-green-600' : 'text-red-600'}`}>
                              {panValidationState.message}
                              {panValidationState.isValid && panValidationState.entityType && !panValidationState.isIndividual && (
                                <div className="mt-1 text-amber-600 font-medium">
                                  Note: Salary income option will not be available for non-individual PAN
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                          <Input 
                            id="name" 
                            type="text" 
                            placeholder="As per PAN card"
                            value={formData.name} 
                            onChange={(e) => handleInputChange("name", e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            value={formData.dob} 
                            onChange={(e) => handleInputChange("dob", e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="assessmentYear">Assessment Year <span className="text-red-500">*</span></Label>
                          <Select 
                            value={formData.assessmentYear} 
                            onValueChange={(value) => {
                              handleInputChange("assessmentYear", value);
                              setAssessmentYear(value);
                            }}
                          >
                            <SelectTrigger id="assessmentYear">
                              <SelectValue placeholder="Select Assessment Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2024-25">2024-25</SelectItem>
                              <SelectItem value="2023-24">2023-24</SelectItem>
                              <SelectItem value="2022-23">2022-23</SelectItem>
                              <SelectItem value="2021-22">2021-22</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your@email.com" 
                            value={formData.email} 
                            onChange={(e) => handleInputChange("email", e.target.value)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Input 
                            id="mobile" 
                            type="tel" 
                            placeholder="10-digit mobile number" 
                            value={formData.mobile} 
                            onChange={(e) => handleInputChange("mobile", e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full md:w-auto md:ml-auto bg-blue-500 hover:bg-blue-600"
                        onClick={savePersonalInfo}
                      >
                        Continue to Income Sources <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload-form16">
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mb-6">
                      <FileText className="h-10 w-10 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-1">Upload Form 16</h3>
                      <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">
                        Drag and drop your Form 16 PDF here, or click to browse files
                      </p>
                      
                      <div className="relative">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf"
                          onChange={handleFileUpload}
                        />
                        <Button variant="outline" className="relative">
                          <Upload className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                      </div>
                      
                      {uploadProgress !== null && (
                        <div className="w-full max-w-xs mt-4">
                          <div className="text-sm text-gray-500 flex justify-between mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Automatic Data Extraction</h4>
                          <p className="text-sm text-gray-500">We'll automatically extract data from your Form 16</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Pre-Fill Your Return</h4>
                          <p className="text-sm text-gray-500">Your income and TDS details will be pre-filled</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Fast Processing</h4>
                          <p className="text-sm text-gray-500">Complete your tax filing in minutes</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full md:w-auto md:ml-auto mt-6 bg-blue-500 hover:bg-blue-600"
                        onClick={nextStep}
                        disabled={uploadProgress !== null && uploadProgress < 100}
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  Select Your Income Sources
                </CardTitle>
                <CardDescription>
                  Choose all sources from which you earned income during FY {
                    (() => {
                      const yearEnd = formData.assessmentYear.split('-')[0];
                      const yearStart = Number(yearEnd) - 1;
                      return `${yearStart}-${yearEnd}`;
                    })()
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeSourcesStep />
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={previousStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={nextStep}
                    disabled={formData.incomeSource.length === 0}
                  >
                    Continue to Income Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  Income Details
                </CardTitle>
                <CardDescription>
                  Enter information for each of your selected income sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeDetailsStep />
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={previousStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={nextStep}
                  >
                    Continue to Tax Payments <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartFiling;