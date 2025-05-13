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

const MAX_80C_DEDUCTION = 150000; // Maximum deduction under section 80C
const MAX_80D_DEDUCTION_INDIVIDUAL = 25000; // Health insurance for self/family
const MAX_80D_DEDUCTION_SENIOR = 50000; // Health insurance for senior citizens
const MAX_80D_DEDUCTION_SUPER_SENIOR = 50000; // Health insurance for super senior citizens (above 80)
const MAX_80DD_DEDUCTION = 125000; // Maintenance and medical treatment of disabled dependent
const MAX_80DDB_DEDUCTION_GENERAL = 40000; // Medical treatment for specified diseases (general)
const MAX_80DDB_DEDUCTION_SENIOR = 100000; // Medical treatment for specified diseases (senior citizens)
const MAX_80E_EDUCATION_LOAN_INTEREST = Infinity; // No limit for education loan interest
const MAX_80EE_HOME_LOAN_INTEREST = 50000; // Additional interest on housing loan
const MAX_80G_DONATION = Infinity; // Donations to certain funds, charitable institutions
const MAX_80GG_RENT_PAID = 60000; // Rent paid when HRA not received
const MAX_80TTA_INTEREST = 10000; // Interest on savings account (non-senior citizens)
const MAX_80TTB_INTEREST = 50000; // Interest on deposits for senior citizens
const MAX_80U_DISABILITY = 125000; // Self with disability

const CESS_RATE = 0.04; // 4% Health and Education Cess

export function calculateTaxSummary(
  incomeData: any, 
  deductions80C: any = {}, 
  deductions80D: any = {}, 
  otherDeductions: any = {}, 
  taxPaid: any = {}, 
  assessmentYear: string = "2024-25"
): TaxSummary {
  // Calculate salary income (with standard deduction for salaried individuals)
  // Handle both single value and array of salary entries
  let salaryIncome = 0;
  if (Array.isArray(incomeData?.salaryIncome)) {
    // Sum up all salary entries' net salary
    salaryIncome = incomeData.salaryIncome.reduce((total: number, salary: any) => {
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
    housePropertyIncome = incomeData.housePropertyIncome.reduce((total: number, property: any) => {
      const netIncome = parseFloat((property.netAnnualValue || "0").replace(/,/g, "")) || 0;
      return total + netIncome;
    }, 0);
  } else {
    housePropertyIncome = parseFloat(incomeData?.housePropertyIncome?.replace(/,/g, "") || "0");
  }
  
  // Capital gains
  let capitalGainsIncome = 0;
  if (Array.isArray(incomeData?.capitalGainsIncome)) {
    capitalGainsIncome = incomeData.capitalGainsIncome.reduce((total: number, gain: any) => {
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
    businessIncome = incomeData.businessIncome.reduce((total: number, business: any) => {
      const netProfit = parseFloat((business.netProfit || "0").replace(/,/g, "")) || 0;
      return total + netProfit;
    }, 0);
  } else {
    businessIncome = parseFloat(incomeData?.businessIncome?.replace(/,/g, "") || "0");
  }
  
  // Interest income
  let interestIncome = 0;
  if (Array.isArray(incomeData?.interestIncome)) {
    interestIncome = incomeData.interestIncome.reduce((total: number, interest: any) => {
      const amount = parseFloat((interest.amount || "0").replace(/,/g, "")) || 0;
      return total + amount;
    }, 0);
  } else {
    interestIncome = parseFloat(incomeData?.interestIncome?.replace(/,/g, "") || "0");
  }
  
  // Other income
  let otherIncomeAmount = 0;
  if (Array.isArray(incomeData?.otherIncome)) {
    otherIncomeAmount = incomeData.otherIncome.reduce((total: number, other: any) => {
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
  let standardDeductionApplied = salaryIncome > 0 ? Math.min(standardDeductionAmount, salaryIncome) : 0;
  
  // Standard deduction is applied only once regardless of number of employers
  const taxableIncome = Math.max(0, totalIncome - standardDeductionApplied - totalDeductions);
  
  // Calculate income tax based on applicable income tax slabs
  // This is for the new tax regime (FY 2023-24, AY 2024-25)
  let basicTax = 0;
  
  if (taxableIncome <= 300000) {
    basicTax = 0; // First 3 lakh is tax-free
  } else if (taxableIncome <= 600000) {
    basicTax = (taxableIncome - 300000) * 0.05; // 5% on income between 3-6 lakh
  } else if (taxableIncome <= 900000) {
    basicTax = 15000 + (taxableIncome - 600000) * 0.10; // 10% on income between 6-9 lakh
  } else if (taxableIncome <= 1200000) {
    basicTax = 45000 + (taxableIncome - 900000) * 0.15; // 15% on income between 9-12 lakh
  } else if (taxableIncome <= 1500000) {
    basicTax = 90000 + (taxableIncome - 1200000) * 0.20; // 20% on income between 12-15 lakh
  } else {
    basicTax = 150000 + (taxableIncome - 1500000) * 0.30; // 30% on income above 15 lakh
  }
  
  // Calculate surcharge if applicable (on income above 50 lakh)
  let surchargeAmount = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    surchargeAmount = basicTax * 0.10; // 10% surcharge if income is between 50L-1Cr
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    surchargeAmount = basicTax * 0.15; // 15% surcharge if income is between 1Cr-2Cr
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    surchargeAmount = basicTax * 0.25; // 25% surcharge if income is between 2Cr-5Cr
  } else if (taxableIncome > 50000000) {
    surchargeAmount = basicTax * 0.37; // 37% surcharge if income is above 5Cr
  }
  
  // Calculate Health and Education Cess (4% on income tax + surcharge)
  const cessAmount = (basicTax + surchargeAmount) * CESS_RATE;
  
  // Calculate total income tax liability
  const estimatedTax = basicTax + surchargeAmount + cessAmount;
  
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
  
  return formatIndianCurrency(numericAmount, true, 0);
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
