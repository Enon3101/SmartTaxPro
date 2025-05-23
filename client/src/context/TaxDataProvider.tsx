import { nanoid } from "nanoid";
import { ReactNode, createContext, useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateTaxSummary } from "@/lib/taxCalculations";
import {
  TaxFormData,
  IncomeData,
  Deductions80C,
  Deductions80D,
  OtherDeductions,
  TaxesPaid,
  // CapitalGainsEntry, // Not directly used in this file's props/state after correction
  // SalaryEntry, // Not directly used
  // HousePropertyEntry, // Not directly used
  // BusinessIncomeEntry, // Not directly used
  // InterestIncomeEntry, // Not directly used
  // OtherIncomeEntry, // Not directly used
} from "@/lib/taxInterfaces"; // PersonalInfo is 'any' in TaxFormData

interface TaxDataContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  taxFormId: string;
  taxSummary: ReturnType<typeof calculateTaxSummary>;
  taxFormData: TaxFormData | null;
  updatePersonalInfo: (data: any) => void; // personalInfo is 'any' in TaxFormData
  updateFormType: (formType: string) => void;
  updateIncome: (data: Partial<IncomeData>) => void;
  updateDeductions80C: (data: Partial<Deductions80C>) => void;
  updateDeductions80D: (data: Partial<Deductions80D>) => void;
  updateOtherDeductions: (data: Partial<OtherDeductions>) => void;
  updateTaxPaid: (data: Partial<TaxesPaid>) => void;
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
    taxFormData?.taxPaid,
    assessmentYear // Use the selected assessment year for calculation
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
        const response = await apiRequest(
          "POST",
          "/api/tax-forms",
          {
            body: JSON.stringify({
              id: newTaxFormId,
              status: "in_progress",
              assessmentYear: assessmentYear,
              formType: "ITR-1"
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create tax form: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        
        setTaxFormId(newTaxFormId);
        setTaxFormData(data);
        localStorage.setItem("taxFormId", newTaxFormId);
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
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (data: any) => { // personalInfo is 'any' in TaxFormData
    setTaxFormData((prev) => prev ? { ...prev, personalInfo: { ...(prev.personalInfo || {}), ...data } } : null);
  };

  const updateFormType = (formType: string) => {
    setTaxFormData((prev) => prev ? { ...prev, formType } : null);
  };

  const updateIncome = (data: Partial<IncomeData>) => {
    setTaxFormData((prev) => prev ? { ...prev, incomeData: { ...(prev.incomeData || {}), ...data } as IncomeData } : null);
  };

  const updateDeductions80C = (data: Partial<Deductions80C>) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80C: { ...(prev.deductions80C || {}), ...data } as Deductions80C } : null);
  };

  const updateDeductions80D = (data: Partial<Deductions80D>) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80D: { ...(prev.deductions80D || {}), ...data } as Deductions80D } : null);
  };

  const updateOtherDeductions = (data: Partial<OtherDeductions>) => {
    setTaxFormData((prev) => prev ? { ...prev, otherDeductions: { ...(prev.otherDeductions || {}), ...data } as OtherDeductions } : null);
  };

  const updateTaxPaid = (data: Partial<TaxesPaid>) => {
    setTaxFormData((prev) => prev ? { ...prev, taxPaid: { ...(prev.taxPaid || {}), ...data } as TaxesPaid } : null);
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
