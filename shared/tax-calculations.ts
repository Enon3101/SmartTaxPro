// Shared tax calculation logic for both server and client

export interface TaxSummary {
  totalIncome: number;
  salaryIncome: number;
  housePropertyIncome: number;
  capitalGainsIncome: number;
  otherIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  deductions80C: number;
  deductions80D: number;
  otherDeductions: number;
  taxableIncome: number;
  estimatedTax: number;
  cessAmount: number;
  surchargeAmount: number;
  tdsAmount: number;
  advanceTaxPaid: number;
  selfAssessmentTaxPaid: number;
  totalTaxPaid: number;
  taxPayable: number;
  refundDue: number;
}

const STANDARD_DEDUCTION: Record<string, number> = {
  "2023-24": 50000,
  "2024-25": 50000,
  "2025-26": 75000,
  "2026-27": 75000
};

const TAX_SLABS_AY2024_25 = {
  oldRegime: {
    below60: [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
    senior: [
      { limit: 300000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
    superSenior: [
      { limit: 500000, rate: 0 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
  },
  newRegime: [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ],
};

const MAX_80C_DEDUCTION = 150000;
const MAX_80D_DEDUCTION_INDIVIDUAL = 25000;
const CESS_RATE = 0.04;

interface IncomeItem {
  netSalary?: string;
  netAnnualValue?: string;
  netCapitalGain?: string;
  netProfit?: string;
  amount?: string;
}

export interface IncomeData {
  salaryIncome?: string | IncomeItem[];
  housePropertyIncome?: string | IncomeItem[];
  capitalGainsIncome?: string | IncomeItem[];
  shortTermCapitalGains?: string;
  longTermCapitalGains?: string;
  businessIncome?: string | IncomeItem[];
  interestIncome?: string | IncomeItem[];
  otherIncome?: string | IncomeItem[];
  dividendIncome?: string;
  otherSources?: string;
}

export interface DeductionData {
  totalAmount?: string;
}

export interface TaxPaidData {
  tds?: string;
  advanceTax?: string;
  selfAssessmentTax?: string;
}

export function calculateTaxSummary(
  incomeData: IncomeData,
  deductions80C: DeductionData = {},
  deductions80D: DeductionData = {},
  otherDeductions: DeductionData = {},
  taxPaid: TaxPaidData = {},
  assessmentYear: string = "2024-25",
  taxRegime: 'new' | 'old' = 'new',
  age: number = 40
): TaxSummary {
  // ... (copy the full implementation from client/src/lib/taxCalculations.ts)
// ... existing code ...
}

// (Copy the rest of the helper functions and constants as needed) 