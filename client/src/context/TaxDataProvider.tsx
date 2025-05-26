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
} from "@/lib/taxInterfaces";

import { useAuth } from "./AuthContext";

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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get auth state
  const [currentStep, setCurrentStep] = useState(1);
  const [taxFormId, setTaxFormId] = useState("");
  const [taxFormData, setTaxFormData] = useState<TaxFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for tax data
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
    const createNewTaxForm = async () => {
      // This function should only be called if the user is authenticated
      if (!isAuthenticated) {
        console.warn("Attempted to create new tax form while unauthenticated.");
        setIsLoading(false); // Ensure loading state is cleared
        return;
      }
      try {
        const newTaxFormId = nanoid();
        const response = await apiRequest(
          "POST",
          "/api/tax-forms",
          {
            body: JSON.stringify({
              id: newTaxFormId,
              status: "in_progress",
              assessmentYear: assessmentYear, // Use current state assessmentYear
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
    
    const initializeTaxForm = async () => {
      if (!isAuthenticated) {
        // If user is not authenticated, don't attempt to load or create form.
        // Set loading to false and ensure taxFormData is null.
        setTaxFormData(null);
        setTaxFormId("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const storedTaxFormId = localStorage.getItem("taxFormId");
        
        if (storedTaxFormId) {
          try {
            // apiRequest will include auth token if available
            const response = await apiRequest("GET", `/api/tax-forms/${storedTaxFormId}`);
            
            if (response.ok) {
              const data = await response.json();
              setTaxFormId(storedTaxFormId);
              setTaxFormData(data);
              if (data.assessmentYear) {
                setAssessmentYear(data.assessmentYear);
              }
              // Determine current step based on fetched data
              if (data.status === "completed") setCurrentStep(5);
              else if (data.taxPaid) setCurrentStep(4);
              else if (data.deductions80C || data.deductions80D || data.otherDeductions) setCurrentStep(3);
              else if (data.incomeData) setCurrentStep(2);
              else setCurrentStep(1);
            } else if (response.status === 404 || response.status === 401 || response.status === 403) {
              // Form not found on server, or not authorized, or token invalid
              localStorage.removeItem("taxFormId"); // Clear invalid ID
              await createNewTaxForm(); // Create a new one if authenticated
            } else {
              // Other server error
              const errorText = await response.text();
              throw new Error(`Failed to fetch tax form: ${response.status} ${errorText}`);
            }
          } catch (error) {
            console.error("Error fetching or processing existing tax form:", error);
            localStorage.removeItem("taxFormId"); // Clear potentially problematic ID
            await createNewTaxForm(); // Attempt to create a new one if authenticated
          }
        } else {
          await createNewTaxForm(); // No stored ID, create new if authenticated
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

    if (!isAuthLoading) { // Only proceed if auth status is resolved
      initializeTaxForm();
    } else {
      // Auth is still loading, keep TaxDataProvider's isLoading true
      setIsLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuthLoading, assessmentYear]); // Add assessmentYear to dependencies if createNew uses it

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
