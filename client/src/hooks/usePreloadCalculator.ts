import { useCallback } from 'react';

// A hook to preload calculator modules when hovering over links
export function usePreloadCalculator() {
  const preloadTaxRegimeCalculator = useCallback(() => {
    import("@/pages/calculators/tax-regime");
  }, []);
  
  const preloadHraCalculator = useCallback(() => {
    import("@/pages/calculators/hra");
  }, []);
  
  const preloadTdsCalculator = useCallback(() => {
    import("@/pages/calculators/tds");
  }, []);
  
  const preloadCapitalGainsCalculator = useCallback(() => {
    import("@/pages/calculators/capital-gains");
  }, []);
  
  const preloadSipCalculator = useCallback(() => {
    import("@/pages/calculators/sip");
  }, []);
  
  const preloadFdCalculator = useCallback(() => {
    import("@/pages/calculators/fd");
  }, []);
  
  const preloadLoanEmiCalculator = useCallback(() => {
    import("@/pages/calculators/loan-emi");
  }, []);
  
  return {
    preloadTaxRegimeCalculator,
    preloadHraCalculator,
    preloadTdsCalculator,
    preloadCapitalGainsCalculator,
    preloadSipCalculator,
    preloadFdCalculator,
    preloadLoanEmiCalculator,
    getPreloadFunction: (calculatorType: string) => {
      switch(calculatorType) {
        case 'tax-regime': return preloadTaxRegimeCalculator;
        case 'hra': return preloadHraCalculator;
        case 'tds': return preloadTdsCalculator;
        case 'capital-gains': return preloadCapitalGainsCalculator;
        case 'sip': return preloadSipCalculator;
        case 'fd': return preloadFdCalculator;
        case 'loan-emi': return preloadLoanEmiCalculator;
        default: return () => {};
      }
    }
  };
}