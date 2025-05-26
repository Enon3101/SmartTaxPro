import { useState, useContext, useEffect } from "react";
// import { useLocation } from "wouter"; // Commented out as useLocation is unused

import {
  Landmark,
  ArrowRight, ArrowLeft, Upload, FileText, CheckCircle, PlusCircle, MinusCircle,
  Home, Briefcase, PiggyBank, CreditCard, FileCheck
} from 'lucide-react';

import ProgressTracker from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaxDataContext } from "@/context/TaxDataProvider";

import { useToast } from "@/hooks/use-toast";

import { apiRequest } from "@/lib/queryClient";
// import { formatIndianCurrency } from "@/lib/formatters"; // Commented out as it's unused for now

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
  
  pan = pan.replace(/\s/g, '').toUpperCase();
  
  if (pan.length !== 10) return false;
  if (!/^[A-Z]{5}/.test(pan)) return false;
  if (!/^[A-Z]{5}[0-9]{4}/.test(pan)) return false;
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return false;
  
  return true;
}

// Function to get entity type from PAN
function getPANEntityType(pan: string): string | null {
  if (!validatePAN(pan)) return null;
  
  const entityCode = pan.charAt(3);
  return PAN_ENTITY_TYPES[entityCode] || null;
}

// Function to check if PAN belongs to an individual
function isIndividualPAN(pan: string): boolean {
  if (!validatePAN(pan)) return false;
  
  return pan.charAt(3) === 'P';
}

// Define step types
interface Step {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

// Define types for income entries to avoid 'any'
interface SalaryIncomeEntry {
  id: string;
  employerName: string;
  grossSalary: string;
  standardDeduction: string;
  section10Exemptions: string;
  section10ExemptionsList: { type: string, amount: string }[];
  professionalTax: string;
  tdsDeducted: string;
  netSalary: string;
}

interface HousePropertyIncomeEntry {
  id: string;
  propertyType: string;
  rentalIncome: string;
  interestPaid: string;
  propertyTax: string;
}

interface CapitalGainsIncomeEntry {
  id: string;
  shortTerm: string;
  longTerm: string;
}

interface BusinessIncomeEntry {
  id: string;
  grossReceipts: string;
  expenses: string;
  netProfit: string;
}

interface InterestIncomeEntry {
  id: string;
  savingsAccount: string;
  fixedDeposits: string;
  other: string;
}

interface OtherIncomeEntry {
  id: string;
  amount: string;
  description: string;
}

interface DeductionsEntry {
  section80C: string;
  section80D: string;
  section80TTA: string;
  section80G: string;
}

interface FormData {
  pan: string;
  name: string;
  dob: string;
  email: string;
  mobile: string;
  assessmentYear: string;
  incomeSource: string[];
  salaryIncome: SalaryIncomeEntry[];
  housePropertyIncome: HousePropertyIncomeEntry[];
  capitalGainsIncome: CapitalGainsIncomeEntry[];
  businessIncome: BusinessIncomeEntry[];
  interestIncome: InterestIncomeEntry[];
  otherIncome: OtherIncomeEntry[];
  deductions: DeductionsEntry;
  personalInfo?: Record<string, unknown>;
}

interface DraftSummary {
  id: string;
  pan: string;
  assessmentYear: string;
  status: string;
  lastSaved: string;
  name: string;
}

const StartFiling = () => {
  const { toast } = useToast();
  const {
    updatePersonalInfo,
    taxFormId,
    taxFormData,
    assessmentYear, 
    setAssessmentYear,
  } = useContext(TaxDataContext);
  
  const [selectedTab, setSelectedTab] = useState("quick-start");
  const [activeStep, setActiveStep] = useState(1); 
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({ 
    pan: "",
    name: "",
    dob: "",
    email: "",
    mobile: "",
    assessmentYear: assessmentYear || "2024-25", 
    incomeSource: [],
    salaryIncome: [{
      id: "salary-1", employerName: "", grossSalary: "", standardDeduction: "50000",
      section10Exemptions: "0", section10ExemptionsList: [],
      professionalTax: "0", tdsDeducted: "", netSalary: ""
    }],
    housePropertyIncome: [{
      id: "property-1", propertyType: "self-occupied", rentalIncome: "", interestPaid: "", propertyTax: ""
    }],
    capitalGainsIncome: [{ id: "capital-1", shortTerm: "", longTerm: "" }],
    businessIncome: [{ id: "business-1", grossReceipts: "", expenses: "", netProfit: "" }],
    interestIncome: [{ id: "interest-1", savingsAccount: "", fixedDeposits: "", other: "" }],
    otherIncome: [{ id: "other-1", amount: "", description: "" }],
    deductions: {
      section80C: "",
      section80D: "",
      section80TTA: "",
      section80G: "",
    }
  });
  
  useEffect(() => {
    const selectedDraftId = localStorage.getItem("selectedDraftId");
    if (selectedDraftId) {
      const localDraftsText = localStorage.getItem("taxDrafts"); // This currently stores summaries
      if (localDraftsText) {
        const localDraftSummaries: DraftSummary[] = JSON.parse(localDraftsText);
        // We need to retrieve the FULL formData for the selected draft.
        // For this mock, we'll assume the full formData was also saved when the draft was created.
        // Ideally, handleSaveDraft would save the full formData keyed by draftId,
        // e.g., localStorage.setItem(`draftData-${selectedDraftId}`, JSON.stringify(formData));
        // For now, let's try to find a summary and then assume we can get full data.
        
        // This is a placeholder for fetching the full draft data.
        // In a real app, you'd fetch from an API or a more structured local store.
        // We'll simulate loading it if the summary exists.
        // We'll assume the 'formData' itself was stored with an ID matching selectedDraftId
        // This part needs to align with how `handleSaveDraft` actually stores the full data.
        // For the purpose of this mock, let's assume `handleSaveDraft` also stores
        // the full `formData` under a key like `draftFullData-${draftId}`.
        
        const fullDraftDataString = localStorage.getItem(`draftFullData-${selectedDraftId}`);
        if (fullDraftDataString) {
          const loadedDraftData: FormData = JSON.parse(fullDraftDataString);
          
          setFormData(loadedDraftData);
          updatePersonalInfo(loadedDraftData); // Update context
          if (loadedDraftData.assessmentYear) {
            setAssessmentYear(loadedDraftData.assessmentYear);
          }
          // If TaxDataContext needs to be aware of the specific taxFormId for this draft:
          // This assumes TaxDataContext has a way to set/use this ID.
          // For example: if (context.setLoadedTaxFormId) context.setLoadedTaxFormId(selectedDraftId);
          
          toast({ title: "Draft Loaded", description: `Resumed filing for PAN: ${loadedDraftData.pan}, AY: ${loadedDraftData.assessmentYear}`});
          localStorage.removeItem("selectedDraftId");
          return; // Important to prevent overwriting with context data below
        } catch (e) {
          console.error("Error parsing full draft data from localStorage:", e);
          toast({ title: "Error Loading Draft", description: "Could not parse draft data.", variant: "destructive"});
          localStorage.removeItem("selectedDraftId"); // Clean up
        }
      } else {
        toast({ title: "Error Loading Draft", description: "Full draft data not found in local storage.", variant: "destructive"});
        localStorage.removeItem("selectedDraftId"); // Clean up
      }
    }

    // Original logic to load from context if no specific draft is selected from MyFilings
    if (taxFormData) {
      const currentAY = (taxFormData as any).assessmentYear || formData.assessmentYear;
      const personalInfoData = ((taxFormData as any).personalInfo || {}) as Record<string, unknown>;
      const deductionsData = ((taxFormData as any).deductions || {}) as Partial<DeductionsEntry>;
  
      const updatedFormData: FormData = {
        ...formData, 
        ...(personalInfoData as Partial<FormData>), 
        assessmentYear: currentAY,
        incomeSource: Array.isArray(personalInfoData.incomeSource) ? personalInfoData.incomeSource as string[] : formData.incomeSource,
        salaryIncome: Array.isArray(personalInfoData.salaryIncome) && (personalInfoData.salaryIncome as SalaryIncomeEntry[]).length > 0
          ? personalInfoData.salaryIncome as SalaryIncomeEntry[]
          : formData.salaryIncome,
        housePropertyIncome: Array.isArray(personalInfoData.housePropertyIncome) && (personalInfoData.housePropertyIncome as HousePropertyIncomeEntry[]).length > 0
          ? personalInfoData.housePropertyIncome as HousePropertyIncomeEntry[]
          : formData.housePropertyIncome,
        capitalGainsIncome: Array.isArray(personalInfoData.capitalGainsIncome) && (personalInfoData.capitalGainsIncome as CapitalGainsIncomeEntry[]).length > 0
          ? personalInfoData.capitalGainsIncome as CapitalGainsIncomeEntry[]
          : formData.capitalGainsIncome,
        businessIncome: Array.isArray(personalInfoData.businessIncome) && (personalInfoData.businessIncome as BusinessIncomeEntry[]).length > 0
          ? personalInfoData.businessIncome as BusinessIncomeEntry[]
          : formData.businessIncome,
        interestIncome: Array.isArray(personalInfoData.interestIncome) && (personalInfoData.interestIncome as InterestIncomeEntry[]).length > 0
          ? personalInfoData.interestIncome as InterestIncomeEntry[]
          : formData.interestIncome,
        otherIncome: Array.isArray(personalInfoData.otherIncome) && (personalInfoData.otherIncome as OtherIncomeEntry[]).length > 0
          ? personalInfoData.otherIncome as OtherIncomeEntry[]
          : formData.otherIncome,
        deductions: { ...formData.deductions, ...deductionsData }
      };
      setFormData(updatedFormData);
      if (currentAY) setAssessmentYear(currentAY);
    } else {
      setFormData(prev => ({...prev, assessmentYear: assessmentYear || "2024-25"}));
    }
  }, [taxFormData, assessmentYear, setAssessmentYear, formData]);
  
  const steps: Step[] = [
    { number: 1, title: "Basic Details", description: "Personal information", completed: activeStep > 1, active: activeStep === 1 },
    { number: 2, title: "Income Sources", description: "Select income types", completed: activeStep > 2, active: activeStep === 2 },
    { number: 3, title: "Income Details", description: "Based on selections", completed: activeStep > 3, active: activeStep === 3 },
    { number: 4, title: "Deductions", description: "Chapter VI-A deductions", completed: activeStep > 4, active: activeStep === 4 },
    { number: 5, title: "Tax Payments", description: "TDS & advance tax", completed: activeStep > 5, active: activeStep === 5 },
    { number: 6, title: "Tax Calculation", description: "Refund or tax due", completed: activeStep > 6, active: activeStep === 6 },
    { number: 7, title: "File Return", description: "Submit your ITR", completed: activeStep > 7, active: activeStep === 7 },
  ];
  
  const [panValidationState, setPanValidationState] = useState({
    isValid: true, message: "", entityType: "", isIndividual: true
  });

  const handleInputChange = (name: string, value: string) => {
    if (name === "pan") {
      value = value.replace(/\s/g, '').toUpperCase();
      const isPanValid = validatePAN(value);
      const entityType = getPANEntityType(value);
      const isIndividualUser = isIndividualPAN(value);
      setPanValidationState({
        isValid: isPanValid,
        message: isPanValid ? (entityType ? `Valid PAN (${entityType})` : "") : (value.length === 10 ? "Invalid PAN format" : value.length > 0 ? "PAN must be 10 characters" : ""),
        entityType: entityType || "",
        isIndividual: isIndividualUser
      });
      if (!isIndividualUser && value.length === 10) {
        setFormData(prev => ({ ...prev, [name]: value, incomeSource: prev.incomeSource.filter(source => source !== "salary") }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (source: string) => {
    setFormData(prev => ({
      ...prev,
      incomeSource: prev.incomeSource.includes(source)
        ? prev.incomeSource.filter(item => item !== source)
        : [...prev.incomeSource, source]
    }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload a file smaller than 5MB", variant: "destructive" });
      return;
    }
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          toast({ title: "File uploaded successfully", description: "Your Form 16 has been processed" });
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const savePersonalInfoAndProceed = async () => {
    if (!formData.pan || !formData.name) {
      toast({ title: "Required fields missing", description: "Please fill in all required fields marked with *", variant: "destructive" });
      return;
    }
    try {
      updatePersonalInfo(formData); 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { assessmentYear: ayFromFormData, salaryIncome, housePropertyIncome, capitalGainsIncome, businessIncome, interestIncome, otherIncome, deductions, ...personalInfoOnly } = formData;
      const personalInfoPayload = { assessmentYear: formData.assessmentYear, ...personalInfoOnly };


      if (taxFormId) { 
        await apiRequest(
          "POST",
          `/api/tax-forms/${taxFormId}/personal-info`,
          {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personalInfoPayload)
          }
        );
      } else {
        const createFormPayload = {
          assessmentYear: formData.assessmentYear,
          personalInfo: personalInfoOnly, 
          incomeSource: formData.incomeSource
        };
        const newFormResponse = await apiRequest(
          'POST',
          '/api/tax-forms',
          {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createFormPayload)
          }
        );
        const newFormData = await newFormResponse.json();
        if (newFormData && newFormData.id) {
          console.log("New form created/updated with ID:", newFormData.id);
        }
      }
      toast({ title: "Information saved", description: "Your personal information has been saved" });
      setActiveStep(prev => prev + 1); 
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast({ title: "Error", description: "Failed to save your information. Please try again.", variant: "destructive" });
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Update context (acts as local save)
      updatePersonalInfo(formData);

      // Determine a unique ID for the draft
      const draftId = taxFormId || `draft-${Date.now()}`;

      // Mock API call to save the entire formData
      if (taxFormId) {
        await apiRequest(
          "PUT",
          `/api/tax-forms/${taxFormId}/draft`,
          {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          }
        );
      } else {
        // This section would ideally create a new form and get an ID from the backend
        // For mock purposes, we'll use the generated draftId for localStorage
        const createFormPayload = {
          // ... (payload as before, potentially including the draftId or letting backend generate)
          assessmentYear: formData.assessmentYear,
          personalInfo: { pan: formData.pan, name: formData.name, dob: formData.dob, email: formData.email, mobile: formData.mobile },
          incomeSource: formData.incomeSource,
          salaryIncome: formData.salaryIncome,
          housePropertyIncome: formData.housePropertyIncome,
          capitalGainsIncome: formData.capitalGainsIncome,
          businessIncome: formData.businessIncome,
          interestIncome: formData.interestIncome,
          otherIncome: formData.otherIncome,
          deductions: formData.deductions,
          status: "DRAFT", // Explicitly set status
        };
        // Simulate API call for creation if needed, or assume taxFormId would be set by now
        console.log("Simulating creation of new draft with payload:", createFormPayload);
        // const newFormResponse = await apiRequest('POST', '/api/tax-forms', { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(createFormPayload) });
        // const newSavedFormData = await newFormResponse.json();
        // if (newSavedFormData && newSavedFormData.id) { console.log("New draft form created/updated with ID:", newSavedFormData.id); }
      }

      // Save draft summary to localStorage
      const draftSummary = {
        id: draftId,
        pan: formData.pan,
        assessmentYear: formData.assessmentYear,
        status: "Draft",
        lastSaved: new Date().toISOString(),
        // Potentially add a snippet of data or a name for easier identification
        name: formData.name || "Unnamed Filing",
      };

      const drafts: DraftSummary[] = JSON.parse(localStorage.getItem("taxDrafts") || "[]");
      const existingDraftIndex = drafts.findIndex((d: DraftSummary) => d.id === draftId);
      if (existingDraftIndex > -1) {
        drafts[existingDraftIndex] = draftSummary;
      } else {
        drafts.push(draftSummary);
      }
      localStorage.setItem("taxDrafts", JSON.stringify(drafts));
      // Also save the full formData keyed by the draftId
      localStorage.setItem(`draftFullData-${draftId}`, JSON.stringify(formData));

      toast({ title: "Draft Saved", description: "Your progress has been saved." });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({ title: "Save Failed", description: "Could not save your draft. Please try again.", variant: "destructive" });
    }
  };

  const localNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
      if (activeStep === 3 && formData.incomeSource.length > 0) { 
        // setLocation("/tax-filing"); 
      }
    }
  };
  
  const localPreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
    }
  };
  
  const IncomeDetailsStep = () => {
    const updateIncomeField = <K extends keyof FormData>(
      sourceType: K,
      itemIndex: number,
      field: K extends 'salaryIncome' ? keyof SalaryIncomeEntry :
             K extends 'housePropertyIncome' ? keyof HousePropertyIncomeEntry :
             K extends 'capitalGainsIncome' ? keyof CapitalGainsIncomeEntry :
             K extends 'businessIncome' ? keyof BusinessIncomeEntry :
             K extends 'interestIncome' ? keyof InterestIncomeEntry :
             K extends 'otherIncome' ? keyof OtherIncomeEntry :
             never,
      value: string
    ) => {
      setFormData(prev => {
        const items = prev[sourceType] as (SalaryIncomeEntry | HousePropertyIncomeEntry | CapitalGainsIncomeEntry | BusinessIncomeEntry | InterestIncomeEntry | OtherIncomeEntry)[];
        const updatedItems = items.map((item, idx) =>
          idx === itemIndex ? { ...item, [field as string]: value } : item
        );
        return { ...prev, [sourceType]: updatedItems };
      });
    };
    
    const addIncomeEntry = <K extends keyof FormData>(sourceType: K) => {
      setFormData(prev => {
        const currentItems = prev[sourceType] as (SalaryIncomeEntry | HousePropertyIncomeEntry | CapitalGainsIncomeEntry | BusinessIncomeEntry | InterestIncomeEntry | OtherIncomeEntry)[];
        let newItem: SalaryIncomeEntry | HousePropertyIncomeEntry | CapitalGainsIncomeEntry | BusinessIncomeEntry | InterestIncomeEntry | OtherIncomeEntry;
        
        switch (sourceType) {
          case "salaryIncome":
            newItem = { id: `salary-${currentItems.length + 1}`, employerName: "", grossSalary: "", standardDeduction: "50000", section10Exemptions: "0", section10ExemptionsList: [], professionalTax: "0", tdsDeducted: "", netSalary: "" };
            break;
          case "housePropertyIncome":
            newItem = { id: `property-${currentItems.length + 1}`, propertyType: "self-occupied", rentalIncome: "", interestPaid: "", propertyTax: "" };
            break;
          case "capitalGainsIncome":
            newItem = { id: `capital-${currentItems.length + 1}`, shortTerm: "", longTerm: "" };
            break;
          case "businessIncome":
            newItem = { id: `business-${currentItems.length + 1}`, grossReceipts: "", expenses: "", netProfit: "" };
            break;
          case "interestIncome":
            newItem = { id: `interest-${currentItems.length + 1}`, savingsAccount: "", fixedDeposits: "", other: "" };
            break;
          case "otherIncome":
            newItem = { id: `other-${currentItems.length + 1}`, amount: "", description: "" };
            break;
          default:
            return prev; 
        }
        return { ...prev, [sourceType]: [...currentItems, newItem] };
      });
    };
    
    const removeIncomeEntry = <K extends keyof FormData>(sourceType: K, index: number) => {
      setFormData(prev => {
        const currentItems = prev[sourceType] as (SalaryIncomeEntry | HousePropertyIncomeEntry | CapitalGainsIncomeEntry | BusinessIncomeEntry | InterestIncomeEntry | OtherIncomeEntry)[];
        if (currentItems.length <= 1) return prev;
        return { ...prev, [sourceType]: currentItems.filter((_, i) => i !== index) };
      });
    };
    
    const formatCurrency = (value: string | null | undefined): string => {
      if (value === null || value === undefined || value.trim() === "") return "";
      const numericValue = value.replace(/[^\d]/g, "");
      if (!numericValue) return "";
      try {
        if (numericValue.length <= 3) return numericValue;
        const lastThree = numericValue.substring(numericValue.length - 3);
        const remainingDigits = numericValue.substring(0, numericValue.length - 3);
        return remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
      } catch (e: any) {
        console.error("Error formatting currency:", e);
        return numericValue; // Fallback to unformatted numeric string on error
      }
    };
    
    return (
      <div className="space-y-8">
        {formData.incomeSource.length === 0 ? (
          <div className="p-6 text-center bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">No income sources selected. Please go back and select at least one income source.</p>
          </div>
        ) : (
          <>
            {formData.incomeSource.includes("salary") && formData.salaryIncome.map((salary, index) => (
              <div key={salary.id} className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                    Salary Income {formData.salaryIncome.length > 1 ? `#${index + 1}` : ''}
                  </h3>
                  <div className="flex items-center gap-2">
                    {index === formData.salaryIncome.length - 1 && (
                       <Button type="button" variant="outline" size="sm" onClick={() => addIncomeEntry("salaryIncome")} className="text-xs flex items-center">
                         <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Employer
                       </Button>
                    )}
                    {formData.salaryIncome.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeIncomeEntry("salaryIncome", index)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <MinusCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`employerName-${salary.id}`}>Employer Name</Label>
                    <Input id={`employerName-${salary.id}`} value={salary.employerName} onChange={(e) => updateIncomeField("salaryIncome", index, "employerName", e.target.value)} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`grossSalary-${salary.id}`}>Gross Salary</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <Input id={`grossSalary-${salary.id}`} className="pl-7" value={salary.grossSalary} onChange={(e) => updateIncomeField("salaryIncome", index, "grossSalary", formatCurrency(e.target.value))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tdsDeducted-${salary.id}`}>TDS Deducted</Label>
                       <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <Input id={`tdsDeducted-${salary.id}`} className="pl-7" value={salary.tdsDeducted} onChange={(e) => updateIncomeField("salaryIncome", index, "tdsDeducted", formatCurrency(e.target.value))} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formData.incomeSource.includes("house-property") && formData.housePropertyIncome.map((property, index) => (
              <div key={property.id} className="p-6 bg-white border rounded-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                        <Home className="h-5 w-5 text-green-500 mr-2" />
                        House Property Income {formData.housePropertyIncome.length > 1 ? `#${index + 1}`: ''}
                    </h3>
                    <div className="flex items-center gap-2">
                        {index === formData.housePropertyIncome.length -1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => addIncomeEntry("housePropertyIncome")} className="text-xs flex items-center">
                                <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Property
                            </Button>
                        )}
                        {formData.housePropertyIncome.length > 1 && (
                             <Button type="button" variant="ghost" size="icon" onClick={() => removeIncomeEntry("housePropertyIncome", index)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <MinusCircle className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`propertyType-${property.id}`}>Property Type</Label>
                    <Select value={property.propertyType} onValueChange={(value) => updateIncomeField("housePropertyIncome", index, "propertyType", value)}>
                      <SelectTrigger id={`propertyType-${property.id}`}><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-occupied">Self Occupied</SelectItem>
                        <SelectItem value="let-out">Let Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {property.propertyType === 'let-out' && (
                    <div className="space-y-2">
                      <Label htmlFor={`rentalIncome-${property.id}`}>Annual Rental Income</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <Input id={`rentalIncome-${property.id}`} className="pl-7" value={property.rentalIncome} onChange={(e) => updateIncomeField("housePropertyIncome", index, "rentalIncome", formatCurrency(e.target.value))} />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor={`interestPaid-${property.id}`}>Interest on Housing Loan</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input id={`interestPaid-${property.id}`} className="pl-7" value={property.interestPaid} onChange={(e) => updateIncomeField("housePropertyIncome", index, "interestPaid", formatCurrency(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formData.incomeSource.includes("interest") && formData.interestIncome.map((interest, index) => (
              <div key={interest.id} className="p-6 bg-white border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Landmark className="h-5 w-5 text-teal-500 mr-2" />
                    Interest Income {formData.interestIncome.length > 1 ? `#${index + 1}` : ''}
                  </h3>
                  <div className="flex items-center gap-2">
                    {index === formData.interestIncome.length - 1 && (
                       <Button type="button" variant="outline" size="sm" onClick={() => addIncomeEntry("interestIncome")} className="text-xs flex items-center">
                         <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add Interest Source
                       </Button>
                    )}
                    {formData.interestIncome.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeIncomeEntry("interestIncome", index)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <MinusCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`savingsAccount-${interest.id}`}>Savings Account Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input id={`savingsAccount-${interest.id}`} className="pl-7" value={interest.savingsAccount} onChange={(e) => updateIncomeField("interestIncome", index, "savingsAccount", formatCurrency(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`fixedDeposits-${interest.id}`}>Fixed Deposits Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input id={`fixedDeposits-${interest.id}`} className="pl-7" value={interest.fixedDeposits} onChange={(e) => updateIncomeField("interestIncome", index, "fixedDeposits", formatCurrency(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`otherInterest-${interest.id}`}>Other Interest</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <Input id={`otherInterest-${interest.id}`} className="pl-7" value={interest.other} onChange={(e) => updateIncomeField("interestIncome", index, "other", formatCurrency(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formData.incomeSource.filter(src => !["salary", "house-property", "interest"].includes(src)).map(src => (
              <div key={src} className="p-6 bg-white border rounded-lg">
                  <h3 className="text-lg font-medium">Details for {src.replace('-', ' ')}</h3>
                  <p className="text-sm text-gray-500">Fields for this section will be added here.</p>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-start mt-6">
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        </div>
      </div>
    );
  };

  const DeductionsStep = () => {
    const formatCurrency = (value: string | null | undefined): string => { 
      if (value === null || value === undefined || value.trim() === "") return "";
      const numericValue = value.replace(/[^\d]/g, "");
      if (!numericValue) return "";
      try {
        if (numericValue.length <= 3) return numericValue;
        const lastThree = numericValue.substring(numericValue.length - 3);
        const remainingDigits = numericValue.substring(0, numericValue.length - 3);
        return remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
      } catch (error) {
        console.error("Error formatting currency:", error);
        return numericValue; 
      }
    };

    const handleDeductionChange = (field: keyof typeof formData.deductions, value: string) => {
      setFormData(prev => ({
        ...prev,
        deductions: {
          ...prev.deductions,
          [field]: formatCurrency(value) 
        }
      }));
    };

    return (
      <div className="space-y-8">
        <div className="p-6 bg-white border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Chapter VI-A Deductions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="section80C">Section 80C (e.g., LIC, PPF, ELSS)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <Input id="section80C" className="pl-7" value={formData.deductions.section80C} onChange={(e) => handleDeductionChange("section80C", e.target.value)} placeholder="Max 1,50,000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section80D">Section 80D (Medical Insurance)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <Input id="section80D" className="pl-7" value={formData.deductions.section80D} onChange={(e) => handleDeductionChange("section80D", e.target.value)} placeholder="Enter amount" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section80TTA">Section 80TTA (Interest on Savings Account)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <Input id="section80TTA" className="pl-7" value={formData.deductions.section80TTA} onChange={(e) => handleDeductionChange("section80TTA", e.target.value)} placeholder="Max 10,000" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="section80G">Section 80G (Donations)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <Input id="section80G" className="pl-7" value={formData.deductions.section80G} onChange={(e) => handleDeductionChange("section80G", e.target.value)} placeholder="Enter amount" />
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">More deduction fields will be added here. This is a basic set for ITR-1.</p>
        </div>
        <div className="flex justify-start mt-6">
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        </div>
        <div className="flex justify-start mt-6">
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        </div>
        <div className="flex justify-start mt-6">
          <Button variant="outline" onClick={handleSaveDraft} className="mr-auto">Save Draft</Button>
        </div>
      </div>
    );
  };
  
  const IncomeSourcesStep = () => {
    const isIndividual = panValidationState.isIndividual;
    const allIncomeSources = [
      { id: "salary", label: "Salary/Pension", icon: <Briefcase className="h-5 w-5 text-blue-500" />, description: "Income from employment or pension", examples: "Form 16, salary slips", individualOnly: true },
      { id: "house-property", label: "House Property", icon: <Home className="h-5 w-5 text-green-500" />, description: "Rental income or home loan interest", examples: "Rent receipts, loan statements", individualOnly: false },
      { id: "capital-gains", label: "Capital Gains", icon: <PiggyBank className="h-5 w-5 text-purple-500" />, description: "Profit from sale of investments", examples: "Shares, property, mutual funds", individualOnly: false },
      { id: "business", label: "Business/Profession", icon: <Briefcase className="h-5 w-5 text-orange-500" />, description: "Income from business activities", examples: "Freelance, consultancy", individualOnly: false },
      { id: "interest", label: "Interest Income", icon: <CreditCard className="h-5 w-5 text-pink-500" />, description: "Bank deposits, bonds, etc.", examples: "Savings A/C, FDs, RDs", individualOnly: false },
      { id: "other", label: "Other Sources", icon: <PlusCircle className="h-5 w-5 text-gray-500" />, description: "Dividends, lottery, gifts, etc.", examples: "Dividends, lottery winnings", individualOnly: false },
    ];
    const filteredSources = allIncomeSources.filter(s => !s.individualOnly || isIndividual);

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map(source => (
            <Card key={source.id} className={`cursor-pointer hover:border-blue-300 transition-all ${formData.incomeSource.includes(source.id) ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => handleCheckboxChange(source.id)}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 mt-1">{source.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{source.label}</h3>
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        {formData.incomeSource.includes(source.id) && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                    <div className="mt-2 text-xs text-gray-400 italic">Examples: {source.examples}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Selection Guidance</h3>
          <p className="text-sm text-blue-700">Select all sources from which you earned income. This helps determine the appropriate ITR form.</p>
        </div>
      </div>
    );
  };

  const TaxCalculationStep = () => {
    // Mock data for display
    const mockCalculations = {
      totalIncome: "12,50,000",
      totalDeductions: "1,75,000",
      taxableIncome: "10,75,000",
      taxBeforeCess: "1,32,500",
      healthAndEducationCess: "5,300",
      totalTaxLiability: "1,37,800",
      tdsPaid: "1,40,000", 
      advanceTaxPaid: "0", 
      netPayableOrRefund: "-2,200", 
    };

    const isRefund = parseFloat(mockCalculations.netPayableOrRefund.replace(/,/g, '')) < 0;
    const amountClass = isRefund ? "text-green-600 font-semibold" : "text-red-600 font-semibold";

    return (
      <div className="space-y-6">
        <div className="p-6 bg-white border rounded-lg">
          <h3 className="text-xl font-semibold mb-6 text-center text-blue-700">Your Tax Computation Summary (Mock)</h3>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Gross Income:</span>
              <span className="font-medium">₹ {mockCalculations.totalIncome}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Deductions (Chapter VI-A):</span>
              <span className="font-medium">₹ {mockCalculations.totalDeductions}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Taxable Income:</span>
              <span className="font-medium">₹ {mockCalculations.taxableIncome}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Income Tax (Before Cess):</span>
              <span className="font-medium">₹ {mockCalculations.taxBeforeCess}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Health & Education Cess (4%):</span>
              <span className="font-medium">₹ {mockCalculations.healthAndEducationCess}</span>
            </div>
            <div className="flex justify-between py-2 border-b font-semibold text-blue-600">
              <span>Total Tax Liability:</span>
              <span>₹ {mockCalculations.totalTaxLiability}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">TDS Paid:</span>
              <span className="font-medium">₹ {mockCalculations.tdsPaid}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Advance Tax Paid:</span>
              <span className="font-medium">₹ {mockCalculations.advanceTaxPaid}</span>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-lg text-center ${isRefund ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-lg">
              {isRefund ? "Net Refund Due:" : "Net Tax Payable:"}
              <span className={`ml-2 ${amountClass}`}>
                ₹ {isRefund ? mockCalculations.netPayableOrRefund.substring(1) : mockCalculations.netPayableOrRefund}
              </span>
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            *This is a mock calculation based on the data provided. Actual calculation may vary.
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
                <CardDescription>Enter your personal details to begin your tax filing process</CardDescription>
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
                          <Input id="pan" type="text" placeholder="e.g., ABCDE1234F" value={formData.pan} onChange={(e) => handleInputChange("pan", e.target.value)} className={formData.pan && !panValidationState.isValid ? "border-red-500" : formData.pan && panValidationState.isValid ? "border-green-500" : ""} />
                          {formData.pan && (
                            <div className={`text-xs mt-1 ${panValidationState.isValid ? 'text-green-600' : 'text-red-600'}`}>
                              {panValidationState.message}
                              {panValidationState.isValid && panValidationState.entityType && !panValidationState.isIndividual && (
                                <div className="mt-1 text-amber-600 font-medium">Note: Salary income option will not be available for non-individual PAN</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                          <Input id="name" type="text" placeholder="As per PAN card" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" value={formData.dob} onChange={(e) => handleInputChange("dob", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assessmentYear">Assessment Year <span className="text-red-500">*</span></Label>
                          <Select value={formData.assessmentYear} onValueChange={(value) => { handleInputChange("assessmentYear", value); setAssessmentYear(value); }}>
                            <SelectTrigger id="assessmentYear"><SelectValue placeholder="Select Assessment Year" /></SelectTrigger>
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
                          <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Input id="mobile" type="tel" placeholder="10-digit mobile number" value={formData.mobile} onChange={(e) => handleInputChange("mobile", e.target.value)} />
                        </div>
                      </div>
                      <Button className="w-full md:w-auto md:ml-auto bg-blue-500 hover:bg-blue-600" onClick={savePersonalInfoAndProceed}>
                        Continue to Income Sources <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload-form16">
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mb-6">
                      <FileText className="h-10 w-10 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-1">Upload Form 16</h3>
                      <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">Drag and drop your Form 16 PDF here, or click to browse files</p>
                      <div className="relative">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf" onChange={handleFileUpload} />
                        <Button variant="outline" className="relative"><Upload className="mr-2 h-4 w-4" /> Browse Files</Button>
                      </div>
                      {uploadProgress !== null && (
                        <div className="w-full max-w-xs mt-4">
                          <div className="text-sm text-gray-500 flex justify-between mb-1"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" /><div><h4 className="font-medium">Automatic Data Extraction</h4><p className="text-sm text-gray-500">We'll automatically extract data from your Form 16</p></div></div>
                      <div className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" /><div><h4 className="font-medium">Pre-Fill Your Return</h4><p className="text-sm text-gray-500">Your income and TDS details will be pre-filled</p></div></div>
                      <div className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" /><div><h4 className="font-medium">Fast Processing</h4><p className="text-sm text-gray-500">Complete your tax filing in minutes</p></div></div>
                      <Button className="w-full md:w-auto md:ml-auto mt-6 bg-blue-500 hover:bg-blue-600" onClick={localNextStep} disabled={uploadProgress !== null && uploadProgress < 100}>
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
                <CardDescription>Choose all sources from which you earned income during FY {(() => { const yearEnd = formData.assessmentYear.split('-')[0]; const yearStart = Number(yearEnd) - 1; return `${yearStart}-${yearEnd}`; })()}</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeSourcesStep />
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={localNextStep} disabled={formData.incomeSource.length === 0}>Continue to Income Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
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
                <CardDescription>Enter information for each of your selected income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeDetailsStep />
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={localNextStep}>Continue to Deductions <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
          {activeStep === 4 && ( 
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                  Deductions (Chapter VI-A)
                </CardTitle>
                <CardDescription>Enter your eligible deductions to reduce taxable income</CardDescription>
              </CardHeader>
              <CardContent>
                <DeductionsStep />
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={localNextStep}>Continue to Tax Payments <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
           {activeStep === 5 && (
            <Card>
              <CardHeader><CardTitle>Step 5: Tax Payments (Placeholder)</CardTitle></CardHeader>
              <CardContent>
                <p>UI for Tax Payments will be built here.</p>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={localNextStep}>Continue to Tax Calculation <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
           {activeStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
                  Tax Calculation
                </CardTitle>
                <CardDescription>Review your mock tax computation below.</CardDescription>
              </CardHeader>
              <CardContent>
                <TaxCalculationStep />
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={localNextStep}>Continue to File Return <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
           {activeStep === 7 && (
            <Card>
              <CardHeader><CardTitle>Step 7: File Return (Placeholder)</CardTitle></CardHeader>
              <CardContent>
                <p>UI for Filing Return will be built here.</p>
                 <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={localPreviousStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => alert("Return Filing Mocked!")}>File Return (Mock) <FileCheck className="ml-2 h-4 w-4" /></Button>
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
