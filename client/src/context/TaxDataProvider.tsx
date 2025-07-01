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
import { saveDraft, listAllDrafts, deleteDraft } from '@/lib/indexedDbDrafts';

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

// Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Helper functions to ensure all required fields are present
const getCompleteIncomeData = (data: Partial<IncomeData>): IncomeData => ({
  salaryIncome: data.salaryIncome ?? [],
  housePropertyIncome: data.housePropertyIncome ?? [],
  capitalGainsIncome: data.capitalGainsIncome ?? [],
  businessIncome: data.businessIncome ?? [],
  interestIncome: data.interestIncome ?? [],
  otherIncome: data.otherIncome ?? [],
});
const getCompleteDeductions80C = (data: Partial<Deductions80C>): Deductions80C => ({
  ppf: data.ppf ?? '',
  elss: data.elss ?? '',
  lifeInsurance: data.lifeInsurance ?? '',
  houseLoanPrincipal: data.houseLoanPrincipal ?? '',
  sukanya: data.sukanya ?? '',
  nsc: data.nsc ?? '',
  fixedDeposit: data.fixedDeposit ?? '',
  epf: data.epf ?? '',
  nps: data.nps ?? '',
  tuitionFees: data.tuitionFees ?? '',
  totalAmount: data.totalAmount ?? '',
});
const getCompleteDeductions80D = (data: Partial<Deductions80D>): Deductions80D => ({
  selfAndFamilyMedicalInsurance: data.selfAndFamilyMedicalInsurance ?? '',
  parentsMedicalInsurance: data.parentsMedicalInsurance ?? '',
  selfAndFamilyMedicalExpenditure: data.selfAndFamilyMedicalExpenditure ?? '',
  parentsMedicalExpenditure: data.parentsMedicalExpenditure ?? '',
  preventiveHealthCheckup: data.preventiveHealthCheckup ?? '',
  totalAmount: data.totalAmount ?? '',
});
const getCompleteOtherDeductions = (data: Partial<OtherDeductions>): OtherDeductions => ({
  section80E: data.section80E ?? '',
  section80G: data.section80G ?? '',
  section80GG: data.section80GG ?? '',
  section80TTA: data.section80TTA ?? '',
  section80TTB: data.section80TTB ?? '',
  section80CCD: data.section80CCD ?? '',
  section80DDB: data.section80DDB ?? '',
  section80U: data.section80U ?? '',
  totalAmount: data.totalAmount ?? '',
});
const getCompleteTaxesPaid = (data: Partial<TaxesPaid>): TaxesPaid => ({
  tdsFromSalary: data.tdsFromSalary ?? '',
  tdsFromOtherIncome: data.tdsFromOtherIncome ?? '',
  advanceTaxPaid: data.advanceTaxPaid ?? '',
  selfAssessmentTaxPaid: data.selfAssessmentTaxPaid ?? '',
  totalTaxesPaid: data.totalTaxesPaid ?? '',
});

export const TaxDataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get auth state
  const [currentStep, setCurrentStep] = useState(1);
  const [taxFormId, setTaxFormId] = useState("");
  const [taxFormData, setTaxFormData] = useState<TaxFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for tax data
  const [assessmentYear, setAssessmentYear] = useState("2024-25");
  const { toast } = useToast();
  const [isSyncingDrafts, setIsSyncingDrafts] = useState(false);

  // Calculate the tax summary based on the current form data
  const taxSummary = calculateTaxSummary(
    taxFormData?.incomeData ?? {
      salaryIncome: [],
      housePropertyIncome: [],
      capitalGainsIncome: [],
      businessIncome: [],
      interestIncome: [],
      otherIncome: [],
    },
    taxFormData?.deductions80C ?? { ppf: '', elss: '', lifeInsurance: '', houseLoanPrincipal: '', sukanya: '', nsc: '', fixedDeposit: '', epf: '', nps: '', tuitionFees: '', totalAmount: '' },
    taxFormData?.deductions80D ?? { selfAndFamilyMedicalInsurance: '', parentsMedicalInsurance: '', selfAndFamilyMedicalExpenditure: '', parentsMedicalExpenditure: '', preventiveHealthCheckup: '', totalAmount: '' },
    taxFormData?.otherDeductions ?? { section80E: '', section80G: '', section80GG: '', section80TTA: '', section80TTB: '', section80CCD: '', section80DDB: '', section80U: '', totalAmount: '' },
    taxFormData?.taxPaid ?? { tdsFromSalary: '', tdsFromOtherIncome: '', advanceTaxPaid: '', selfAssessmentTaxPaid: '', totalTaxesPaid: '' },
    assessmentYear // Use the selected assessment year for calculation
  );

  const patchTaxForm = async (fields: Partial<TaxFormData>) => {
    if (!taxFormId) return;
    try {
      const response = await apiRequest(
        "PATCH",
        `/api/tax-forms/${taxFormId}`,
        {
          body: JSON.stringify(fields),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to autosave');
      toast({ title: 'Autosaved', description: 'Your changes have been saved.' });
    } catch (e) {
      toast({ title: 'Autosave failed', description: (e as Error).message, variant: 'destructive' });
    }
  };
  const debouncedPatch = debounce(patchTaxForm, 1000);

  // Helper to sync all drafts to server
  const syncDraftsToServer = async () => {
    setIsSyncingDrafts(true);
    try {
      const drafts = await listAllDrafts();
      for (const { key, data } of drafts) {
        if (!taxFormId || key !== taxFormId) continue;
        try {
          const response = await apiRequest(
            "PATCH",
            `/api/tax-forms/${taxFormId}`,
            {
              body: JSON.stringify(data),
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (response.ok) {
            await deleteDraft(key);
          }
        } catch (e) {
          // If sync fails, keep draft for next attempt
        }
      }
      toast({ title: 'Drafts synced', description: 'Offline changes have been saved to the server.' });
    } finally {
      setIsSyncingDrafts(false);
    }
  };

  // On app load and when coming online, sync drafts
  useEffect(() => {
    if (navigator.onLine) {
      syncDraftsToServer();
    }
    const handleOnline = () => syncDraftsToServer();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxFormId]);

  // Helper to save to IndexedDB and optionally sync
  const saveAndSync = async (fields: Partial<TaxFormData>) => {
    if (!taxFormId) return;
    await saveDraft(taxFormId, fields);
    if (navigator.onLine) {
      patchTaxForm(fields);
    } else {
      toast({ title: 'Saved offline', description: 'Your changes will sync when you are back online.' });
    }
  };

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
            console.error("Error initializing tax form:", error);
            toast({
              title: "Error",
              description: "Failed to initialize tax form. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          await createNewTaxForm();
        }
      } catch (error) {
        console.error("Error initializing tax form:", error);
        toast({
          title: "Error",
          description: "Failed to initialize tax form. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    initializeTaxForm();
  }, [isAuthenticated, isAuthLoading, toast, assessmentYear]);

  const updatePersonalInfo = (data: any) => {
    setTaxFormData((prev) => prev ? { ...prev, personalInfo: { ...(prev.personalInfo || {}), ...data } } : null);
    saveAndSync({ personalInfo: data });
  };
  const updateFormType = (formType: string) => {
    setTaxFormData((prev) => prev ? { ...prev, formType } : null);
    saveAndSync({ formType });
  };
  const updateIncome = (data: Partial<IncomeData>) => {
    setTaxFormData((prev) => prev ? { ...prev, incomeData: getCompleteIncomeData({ ...(prev.incomeData || {}), ...data }) } : null);
    saveAndSync({ incomeData: getCompleteIncomeData(data) });
  };
  const updateDeductions80C = (data: Partial<Deductions80C>) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80C: getCompleteDeductions80C({ ...(prev.deductions80C || {}), ...data }) } : null);
    saveAndSync({ deductions80C: getCompleteDeductions80C(data) });
  };
  const updateDeductions80D = (data: Partial<Deductions80D>) => {
    setTaxFormData((prev) => prev ? { ...prev, deductions80D: getCompleteDeductions80D({ ...(prev.deductions80D || {}), ...data }) } : null);
    saveAndSync({ deductions80D: getCompleteDeductions80D(data) });
  };
  const updateOtherDeductions = (data: Partial<OtherDeductions>) => {
    setTaxFormData((prev) => prev ? { ...prev, otherDeductions: getCompleteOtherDeductions({ ...(prev.otherDeductions || {}), ...data }) } : null);
    saveAndSync({ otherDeductions: getCompleteOtherDeductions(data) });
  };
  const updateTaxPaid = (data: Partial<TaxesPaid>) => {
    setTaxFormData((prev) => prev ? { ...prev, taxPaid: getCompleteTaxesPaid({ ...(prev.taxPaid || {}), ...data }) } : null);
    saveAndSync({ taxPaid: getCompleteTaxesPaid(data) });
  };

  return (
    <TaxDataContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep: () => {},
        previousStep: () => {},
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