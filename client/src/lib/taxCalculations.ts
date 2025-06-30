import { formatIndianCurrency } from "./formatters";

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

// Constants for Indian tax calculations based on assessment year
const STANDARD_DEDUCTION: Record<string, number> = {
  "2023-24": 50000, // FY 2022-23
  "2024-25": 50000, // FY 2023-24
  "2025-26": 75000, // FY 2024-25 (new budget update)
  "2026-27": 75000  // FY 2025-26
};

// Tax Slabs for AY 2024-25 (FY 2023-24)
const TAX_SLABS_AY2024_25 = {
  oldRegime: {
    below60: [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
    senior: [ // 60 to 79
      { limit: 300000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
    superSenior: [ // 80+
      { limit: 500000, rate: 0 },
      { limit: 1000000, rate: 0.20 },
      { limit: Infinity, rate: 0.30 },
    ],
  },
  newRegime: [ // Common for all ages for AY 2024-25
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ],
};

const MAX_80C_DEDUCTION = 150000; // Maximum deduction under section 80C
const MAX_80D_DEDUCTION_INDIVIDUAL = 25000; // Health insurance for self/family
// const MAX_80D_DEDUCTION_SENIOR = 50000; // Unused
// const MAX_80D_DEDUCTION_SUPER_SENIOR = 50000; // Unused
// const MAX_80DD_DEDUCTION = 125000; // Unused
// const MAX_80DDB_DEDUCTION_GENERAL = 40000; // Unused
// const MAX_80DDB_DEDUCTION_SENIOR = 100000; // Unused
// const MAX_80E_EDUCATION_LOAN_INTEREST = Infinity; // Unused
// const MAX_80EE_HOME_LOAN_INTEREST = 50000; // Unused
// const MAX_80G_DONATION = Infinity; // Unused
// const MAX_80GG_RENT_PAID = 60000; // Unused
// const MAX_80TTA_INTEREST = 10000; // Unused
// const MAX_80TTB_INTEREST = 50000; // Unused
// const MAX_80U_DISABILITY = 125000; // Unused

const CESS_RATE = 0.04; // 4% Health and Education Cess

interface IncomeItem {
  netSalary?: string;
  netAnnualValue?: string;
  netCapitalGain?: string;
  netProfit?: string;
  amount?: string;
}

interface IncomeData {
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

interface DeductionData {
  totalAmount?: string;
}

interface TaxPaidData {
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
  assessmentYear: string = "2024-25", // Defaulting to AY 2024-25 for now
  taxRegime: 'new' | 'old' = 'new', // Default to new regime
  age: number = 40 // Default age, assuming below 60
): TaxSummary {
  // Calculate salary income (with standard deduction for salaried individuals)
  // Handle both single value and array of salary entries
  let salaryIncome = 0;
  if (Array.isArray(incomeData?.salaryIncome)) {
    // Sum up all salary entries' net salary
    salaryIncome = incomeData.salaryIncome.reduce((total: number, salary: IncomeItem) => {
      const netSalary = parseFloat((salary.netSalary || "0").replace(/,/g, "")) || 0;
      return total + netSalary;
    }, 0);
  } else {
    // Fallback for old format
    salaryIncome = parseFloat(incomeData?.salaryIncome?.replace(/,/g, "") || "0");
  }
  
  // House property income
  let housePropertyIncome = 0;
  if (Array.isArray(incomeData?.housePropertyIncome)) {
    housePropertyIncome = incomeData.housePropertyIncome.reduce((total: number, property: IncomeItem) => {
      const netIncome = parseFloat((property.netAnnualValue || "0").replace(/,/g, "")) || 0;
      return total + netIncome;
    }, 0);
  } else {
    housePropertyIncome = parseFloat(incomeData?.housePropertyIncome?.replace(/,/g, "") || "0");
  }
  
  // Capital gains
  let capitalGainsIncome = 0;
  if (Array.isArray(incomeData?.capitalGainsIncome)) {
    capitalGainsIncome = incomeData.capitalGainsIncome.reduce((total: number, gain: IncomeItem) => {
      const netGain = parseFloat((gain.netCapitalGain || "0").replace(/,/g, "")) || 0;
      return total + netGain;
    }, 0);
  } else {
    const shortTermCG = parseFloat(incomeData?.shortTermCapitalGains?.replace(/,/g, "") || "0");
    const longTermCG = parseFloat(incomeData?.longTermCapitalGains?.replace(/,/g, "") || "0");
    capitalGainsIncome = shortTermCG + longTermCG;
  }
  
  // Business income
  let businessIncome = 0;
  if (Array.isArray(incomeData?.businessIncome)) {
    businessIncome = incomeData.businessIncome.reduce((total: number, business: IncomeItem) => {
      const netProfit = parseFloat((business.netProfit || "0").replace(/,/g, "")) || 0;
      return total + netProfit;
    }, 0);
  } else {
    businessIncome = parseFloat(incomeData?.businessIncome?.replace(/,/g, "") || "0");
  }
  
  // Interest income
  let interestIncome = 0;
  if (Array.isArray(incomeData?.interestIncome)) {
    interestIncome = incomeData.interestIncome.reduce((total: number, interest: IncomeItem) => {
      const amount = parseFloat((interest.amount || "0").replace(/,/g, "")) || 0;
      return total + amount;
    }, 0);
  } else {
    interestIncome = parseFloat(incomeData?.interestIncome?.replace(/,/g, "") || "0");
  }
  
  // Other income
  let otherIncomeAmount = 0;
  if (Array.isArray(incomeData?.otherIncome)) {
    otherIncomeAmount = incomeData.otherIncome.reduce((total: number, other: IncomeItem) => {
      const amount = parseFloat((other.amount || "0").replace(/,/g, "")) || 0;
      return total + amount;
    }, 0);
  } else {
    const dividendIncome = parseFloat(incomeData?.dividendIncome?.replace(/,/g, "") || "0");
    const otherSources = parseFloat(incomeData?.otherSources?.replace(/,/g, "") || "0");
    otherIncomeAmount = dividendIncome + otherSources;
  }
  
  const otherIncome = interestIncome + otherIncomeAmount + businessIncome;
  
  // Calculate total income
  const totalIncome = salaryIncome + housePropertyIncome + capitalGainsIncome + otherIncome;
  
  // Calculate deductions
  const section80C = Math.min(
    parseFloat(deductions80C?.totalAmount?.replace(/,/g, "") || "0"),
    MAX_80C_DEDUCTION
  );
  
  const section80D = Math.min(
    parseFloat(deductions80D?.totalAmount?.replace(/,/g, "") || "0"),
    MAX_80D_DEDUCTION_INDIVIDUAL
  );
  
  const additionalDeductions = parseFloat(otherDeductions?.totalAmount?.replace(/,/g, "") || "0");
  
  const totalDeductions = section80C + section80D + additionalDeductions;
  
  // Calculate taxable income (adjusted for standard deduction if applicable)
  // Get standard deduction based on assessment year or use default
  const standardDeductionAmount = STANDARD_DEDUCTION[assessmentYear] || STANDARD_DEDUCTION["2024-25"];
  
  // Standard deduction is fixed at 50,000 (or the appropriate amount for the assessment year)
  // or salary income, whichever is lower
  const standardDeductionApplied = salaryIncome > 0 ? Math.min(standardDeductionAmount, salaryIncome) : 0;
  
  // Standard deduction is applied only once regardless of number of employers
  const taxableIncome = Math.max(0, totalIncome - standardDeductionApplied - totalDeductions);
  
  // Calculate income tax based on applicable income tax slabs for AY 2024-25
  let slabs;
  if (taxRegime === 'old') {
    if (age < 60) {
      slabs = TAX_SLABS_AY2024_25.oldRegime.below60;
    } else if (age >= 60 && age < 80) {
      slabs = TAX_SLABS_AY2024_25.oldRegime.senior;
    } else { // age >= 80
      slabs = TAX_SLABS_AY2024_25.oldRegime.superSenior;
    }
  } else { // newRegime
    slabs = TAX_SLABS_AY2024_25.newRegime;
  }

  let basicTax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;

  for (const slab of slabs) {
    if (remainingIncome <= 0) break;
    const slabApplicableIncome = Math.min(remainingIncome, slab.limit - previousLimit);
    basicTax += slabApplicableIncome * slab.rate;
    remainingIncome -= slabApplicableIncome;
    previousLimit = slab.limit;
    if (slab.limit === Infinity) break; 
  }
  
  // Calculate Surcharge for AY 2024-25
  let surchargeAmount = 0;
  let surchargeRate = 0;
  const totalIncomeForSurcharge = totalIncome; // As per plan, surcharge is on total income

  if (taxRegime === 'old') {
    if (totalIncomeForSurcharge > 50000000) surchargeRate = 0.37;
    else if (totalIncomeForSurcharge > 20000000) surchargeRate = 0.25;
    else if (totalIncomeForSurcharge > 10000000) surchargeRate = 0.15;
    else if (totalIncomeForSurcharge > 5000000) surchargeRate = 0.10;
  } else { // newRegime
    if (totalIncomeForSurcharge > 20000000) surchargeRate = 0.25; // Max 25%
    else if (totalIncomeForSurcharge > 10000000) surchargeRate = 0.15;
    else if (totalIncomeForSurcharge > 5000000) surchargeRate = 0.10;
  }
  surchargeAmount = basicTax * surchargeRate;

  // Marginal Relief for Surcharge
  if (surchargeRate > 0) {
    let surchargeThreshold = 0;
    if (taxRegime === 'old') {
        if (totalIncomeForSurcharge > 50000000) surchargeThreshold = 50000000;
        else if (totalIncomeForSurcharge > 20000000) surchargeThreshold = 20000000;
        else if (totalIncomeForSurcharge > 10000000) surchargeThreshold = 10000000;
        else if (totalIncomeForSurcharge > 5000000) surchargeThreshold = 5000000;
    } else { // newRegime
        if (totalIncomeForSurcharge > 20000000) surchargeThreshold = 20000000;
        else if (totalIncomeForSurcharge > 10000000) surchargeThreshold = 10000000;
        else if (totalIncomeForSurcharge > 5000000) surchargeThreshold = 5000000;
    }

    if (surchargeThreshold > 0) {
        const incomeExceedingThreshold = totalIncomeForSurcharge - surchargeThreshold;
        // Calculate tax at threshold (simplified for this step, ideally re-calculate full tax)
        // For simplicity, we'll use the current basicTax for comparison, which isn't perfectly accurate for marginal relief
        // A more accurate marginal relief would re-calculate tax on 'surchargeThreshold' income.
        // However, the common approach is: tax payable on income of 'threshold' + (income - 'threshold')
        // vs tax payable on income + surcharge.
        // If (tax on income + surcharge) > (tax on threshold + (income - threshold)), relief is difference.
        // Here, if surcharge > incomeExceedingThreshold, relief is surcharge - incomeExceedingThreshold
        if (surchargeAmount > incomeExceedingThreshold) {
            surchargeAmount = incomeExceedingThreshold;
        }
    }
  }
  
  let taxAfterSurcharge = basicTax + surchargeAmount;

  // Rebate under Section 87A for AY 2024-25 (Resident Individuals)
  let rebateAmount = 0;
  // Assuming isResidentIndividual is true for this calculation for now.
  // In a full implementation, this would be an input.
  const isResidentIndividual = true; 

  if (isResidentIndividual) {
    if (taxRegime === 'old' && taxableIncome <= 500000) {
      rebateAmount = Math.min(taxAfterSurcharge, 12500);
    } else if (taxRegime === 'new' && taxableIncome <= 700000) {
      rebateAmount = Math.min(taxAfterSurcharge, 25000);
      // Marginal Relief for Rebate in New Regime
      if (taxableIncome > 700000 && taxableIncome <= 727777) { // Approx. where tax liability equals income over 7L
         const incomeOver7L = taxableIncome - 700000;
         if (taxAfterSurcharge > incomeOver7L) { // taxAfterSurcharge here is without rebate
            rebateAmount = taxAfterSurcharge - incomeOver7L;
         }
      }
    }
  }
  taxAfterSurcharge -= rebateAmount;
  
  // Calculate Health and Education Cess (4% on income tax + surcharge - rebate)
  const cessAmount = taxAfterSurcharge * CESS_RATE;
  
  // Calculate total income tax liability
  const estimatedTax = taxAfterSurcharge + cessAmount;
  
  // Calculate tax already paid (TDS, advance tax, self-assessment tax)
  const tdsAmount = parseFloat(taxPaid?.tds?.replace(/,/g, "") || "0");
  const advanceTaxPaid = parseFloat(taxPaid?.advanceTax?.replace(/,/g, "") || "0");
  const selfAssessmentTaxPaid = parseFloat(taxPaid?.selfAssessmentTax?.replace(/,/g, "") || "0");
  const totalTaxPaid = tdsAmount + advanceTaxPaid + selfAssessmentTaxPaid;
  
  // Calculate tax payable or refund
  const taxPayable = Math.max(0, estimatedTax - totalTaxPaid);
  const refundDue = Math.max(0, totalTaxPaid - estimatedTax);
  
  return {
    totalIncome,
    salaryIncome,
    housePropertyIncome,
    capitalGainsIncome,
    otherIncome,
    standardDeduction: standardDeductionApplied,
    totalDeductions,
    deductions80C: section80C,
    deductions80D: section80D,
    otherDeductions: additionalDeductions,
    taxableIncome,
    estimatedTax,
    cessAmount,
    surchargeAmount,
    tdsAmount,
    advanceTaxPaid,
    selfAssessmentTaxPaid,
    totalTaxPaid,
    taxPayable,
    refundDue,
  };
}

export function formatCurrency(amount: string | number): string {
  // Handle empty string case
  if (amount === '') return '';
  
  // Convert string to number if needed
  let numericAmount: number;
  if (typeof amount === 'string') {
    // Allow only numbers and decimals in input
    const sanitizedAmount = amount.replace(/[^0-9.]/g, '');
    if (sanitizedAmount === '') return ''; // Return empty if all characters were stripped
    
    // Only convert to formatted currency if there's a valid number
    numericAmount = parseFloat(sanitizedAmount) || 0;
  } else {
    numericAmount = amount || 0;
  }
  
  return formatIndianCurrency(numericAmount, { displaySymbol: true, decimalPlaces: 0 });
}

// Cost Inflation Index (CII) values by financial year as per Indian tax rules
export const costInflationIndex: {[key: string]: number} = {
  "1981-82": 100,
  "2001-02": 100,
  "2002-03": 105,
  "2003-04": 109,
  "2004-05": 113,
  "2005-06": 117,
  "2006-07": 122,
  "2007-08": 129,
  "2008-09": 137,
  "2009-10": 148,
  "2010-11": 167,
  "2011-12": 184,
  "2012-13": 200,
  "2013-14": 220,
  "2014-15": 240,
  "2015-16": 254,
  "2016-17": 264,
  "2017-18": 272,
  "2018-19": 280,
  "2019-20": 289,
  "2020-21": 301,
  "2021-22": 317,
  "2022-23": 331,
  "2023-24": 348,
  "2024-25": 365,
  "2025-26": 382, // Projected value
  "2026-27": 401  // Projected value
};

/**
 * Calculate indexed cost of acquisition for long-term capital gains
 * 
 * @param purchaseCost - Original purchase cost of the asset
 * @param acquisitionDate - Date when the asset was purchased
 * @param disposalDate - Date when the asset was sold
 * @returns The indexed cost of acquisition
 */
export function calculateIndexedCost(purchaseCost: string | number, acquisitionDate: string, disposalDate: string): number {
  if (!purchaseCost || !acquisitionDate || !disposalDate) return 0;
  
  const purchaseCostNum = typeof purchaseCost === "string" ? parseFloat(purchaseCost) : purchaseCost;
  
  // Get financial years from dates
  const acquisitionYear = getFinancialYear(new Date(acquisitionDate));
  const disposalYear = getFinancialYear(new Date(disposalDate));
  
  // If acquisition year is before 2001-02, use 2001-02 as base year as per IT Act
  const baseYear = parseInt(acquisitionYear.split("-")[0]) < 2001 ? "2001-02" : acquisitionYear;
  
  // Get CII values
  const acquisitionCII = costInflationIndex[baseYear] || 100;
  const disposalCII = costInflationIndex[disposalYear] || costInflationIndex["2023-24"]; // Use latest if not found
  
  // Calculate indexed cost using the formula:
  // Indexed Cost = Purchase Cost × (CII for year of sale ÷ CII for year of purchase)
  const indexedCost = (purchaseCostNum * disposalCII) / acquisitionCII;
  
  return Math.round(indexedCost);
}

/**
 * Get the financial year (e.g., "2023-24") from a date
 * 
 * @param date - The date to get financial year for
 * @returns The financial year in "YYYY-YY" format
 */
function getFinancialYear(date: Date): string {
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // In India, financial year runs from April 1 to March 31
  // If month is January to March (0-2), it's part of previous financial year
  const startYear = month <= 2 ? year - 1 : year;
  const endYear = startYear + 1;
  
  // Format as "YYYY-YY"
  return `${startYear}-${endYear.toString().substring(2)}`;
}
