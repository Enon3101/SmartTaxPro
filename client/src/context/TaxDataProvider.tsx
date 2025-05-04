import { ReactNode, createContext, useEffect, useState } from "react";
import { calculateTaxSummary } from "@/lib/taxCalculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface TaxFormData {
  id: string;
  personalInfo: any;
  incomeData: any;
  deductionsData: any;
  creditsData: any;
  status: string;
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
  updateIncome: (data: any) => void;
  updateDeductions: (data: any) => void;
  updateCredits: (data: any) => void;
  isLoading: boolean;
}

export const TaxDataContext = createContext<TaxDataContextType>({
  currentStep: 1,
  setCurrentStep: () => {},
  nextStep: () => {},
  previousStep: () => {},
  taxFormId: "",
  taxSummary: {
    totalIncome: 0,
    adjustments: 0,
    standardDeduction: 13850,
    taxableIncome: 0,
    estimatedTax: 0,
    taxCredits: 0,
    taxPaid: 0,
    estimatedRefund: 0,
  },
  taxFormData: null,
  updatePersonalInfo: () => {},
  updateIncome: () => {},
  updateDeductions: () => {},
  updateCredits: () => {},
  isLoading: true,
});

export const TaxDataProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taxFormId, setTaxFormId] = useState("");
  const [taxFormData, setTaxFormData] = useState<TaxFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Calculate the tax summary based on the current form data
  const taxSummary = calculateTaxSummary(taxFormData?.incomeData);

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
              } else if (data.creditsData) {
                setCurrentStep(4); // Credits
              } else if (data.deductionsData) {
                setCurrentStep(3); // Deductions
              } else if (data.incomeData) {
                setCurrentStep(2); // Income
              } else {
                setCurrentStep(1); // Personal Info
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

  const updateIncome = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, incomeData: data } : null);
  };

  const updateDeductions = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, deductionsData: data } : null);
  };

  const updateCredits = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, creditsData: data } : null);
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
        updateIncome,
        updateDeductions,
        updateCredits,
        isLoading,
      }}
    >
      {children}
    </TaxDataContext.Provider>
  );
};
