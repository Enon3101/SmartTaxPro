import { ReactNode, createContext, useEffect, useState } from "react";
import { calculateTaxSummary } from "@/lib/taxCalculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface TaxFormData {
  id: string;
  personalInfo: any;
  formType: string; // ITR-1, ITR-2, ITR-3, ITR-4
  incomeData: any;
  deductions80C: any;
  deductions80D: any;
  otherDeductions: any;
  taxPaid: any;
  status: string;
  assessmentYear: string;
}

interface TaxDataContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  taxFormId: string;
  taxSummary: ReturnType<typeof calculateTaxSummary>;
  taxFormData: TaxFormData | null;
  updatePersonalInfo: (data: any) => void;
  updateFormType: (formType: string) => void;
  updateIncome: (data: any) => void;
  updateDeductions80C: (data: any) => void;
  updateDeductions80D: (data: any) => void;
  updateOtherDeductions: (data: any) => void;
  updateTaxPaid: (data: any) => void;
  isLoading: boolean;
  assessmentYear: string;
  setAssessmentYear: (year: string) => void;
}

export const TaxDataContext = createContext<TaxDataContextType>({
  currentStep: 1,
  setCurrentStep: () => {},
  nextStep: () => {},
  previousStep: () => {},
  taxFormId: "",
  taxSummary: {
    totalIncome: 0,
    salaryIncome: 0,
    housePropertyIncome: 0,
    capitalGainsIncome: 0,
    otherIncome: 0,
    standardDeduction: 50000,
    totalDeductions: 0,
    deductions80C: 0,
    deductions80D: 0,
    otherDeductions: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    cessAmount: 0,
    surchargeAmount: 0,
    tdsAmount: 0,
    advanceTaxPaid: 0,
    selfAssessmentTaxPaid: 0,
    totalTaxPaid: 0,
    taxPayable: 0,
    refundDue: 0,
  },
  taxFormData: null,
  updatePersonalInfo: () => {},
  updateFormType: () => {},
  updateIncome: () => {},
  updateDeductions80C: () => {},
  updateDeductions80D: () => {},
  updateOtherDeductions: () => {},
  updateTaxPaid: () => {},
  isLoading: true,
  assessmentYear: "2024-25",
  setAssessmentYear: () => {},
});

export const TaxDataProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taxFormId, setTaxFormId] = useState("");
  const [taxFormData, setTaxFormData] = useState<TaxFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [assessmentYear, setAssessmentYear] = useState("2024-25");
  const { toast } = useToast();

  // Calculate the tax summary based on the current form data
  const taxSummary = calculateTaxSummary(
    taxFormData?.incomeData,
    taxFormData?.deductions80C,
    taxFormData?.deductions80D,
    taxFormData?.otherDeductions,
    taxFormData?.taxPaid
  );

  useEffect(() => {
    const initializeTaxForm = async () => {
      try {
        // Check if we have a tax form ID in localStorage
        const storedTaxFormId = localStorage.getItem("taxFormId");
        
        if (storedTaxFormId) {
          // If we have an ID, try to fetch the form data
          try {
            const response = await fetch(`/api/tax-forms/${storedTaxFormId}`, {
              credentials: "include",
            });
            
            if (response.ok) {
              const data = await response.json();
              setTaxFormId(storedTaxFormId);
              setTaxFormData(data);
              
              // Set the current step based on progress
              if (data.status === "completed") {
                setCurrentStep(5); // Review & File
              } else if (data.taxPaid) {
                setCurrentStep(4); // Tax Paid
              } else if (data.deductions80C || data.deductions80D || data.otherDeductions) {
                setCurrentStep(3); // Deductions
              } else if (data.incomeData) {
                setCurrentStep(2); // Income
              } else {
                setCurrentStep(1); // Personal Info
              }

              if (data.assessmentYear) {
                setAssessmentYear(data.assessmentYear);
              }
            } else {
              // If the form doesn't exist, create a new one
              createNewTaxForm();
            }
          } catch (error) {
            console.error("Error fetching tax form:", error);
            createNewTaxForm();
          }
        } else {
          // If no ID in storage, create a new tax form
          createNewTaxForm();
        }
      } catch (error) {
        console.error("Error initializing tax form:", error);
        toast({
          title: "Error",
          description: "Failed to initialize tax form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const createNewTaxForm = async () => {
      try {
        // Generate a new ID
        const newTaxFormId = nanoid();
        
        // Create a new tax form on the server
        const response = await apiRequest("POST", "/api/tax-forms", {
          id: newTaxFormId,
          status: "in_progress",
          assessmentYear: assessmentYear,
          formType: "ITR-1"
        });
        
        if (response.ok) {
          const data = await response.json();
          setTaxFormId(newTaxFormId);
          setTaxFormData(data);
          localStorage.setItem("taxFormId", newTaxFormId);
        } else {
          throw new Error("Failed to create new tax form");
        }
      } catch (error) {
        console.error("Error creating new tax form:", error);
        toast({
          title: "Error",
          description: "Failed to create a new tax form. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeTaxForm();
  }, []);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, personalInfo: data } : null);
  };

  const updateFormType = (formType: string) => {
    setTaxFormData((prev) => prev ? { ...prev, formType } : null);
  };

  const updateIncome = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, incomeData: data } : null);
  };

  const updateDeductions80C = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80C: data } : null);
  };

  const updateDeductions80D = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80D: data } : null);
  };

  const updateOtherDeductions = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, otherDeductions: data } : null);
  };

  const updateTaxPaid = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, taxPaid: data } : null);
  };

  return (
    <TaxDataContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
        taxFormId,
        taxSummary,
        taxFormData,
        updatePersonalInfo,
        updateFormType,
        updateIncome,
        updateDeductions80C,
        updateDeductions80D,
        updateOtherDeductions,
        updateTaxPaid,
        isLoading,
        assessmentYear,
        setAssessmentYear,
      }}
    >
      {children}
    </TaxDataContext.Provider>
  );
};
