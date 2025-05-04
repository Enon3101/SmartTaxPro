interface TaxSummary {
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

// Constants for Indian tax calculations
const STANDARD_DEDUCTION = 50000; // Standard deduction for salaried individuals
const MAX_80C_DEDUCTION = 150000; // Maximum deduction under section 80C
const MAX_80D_DEDUCTION_INDIVIDUAL = 25000; // Health insurance for self/family
const MAX_80D_DEDUCTION_SENIOR = 50000; // Health insurance for senior citizens
const CESS_RATE = 0.04; // 4% Health and Education Cess

export function calculateTaxSummary(incomeData: any, deductions80C: any = {}, deductions80D: any = {}, otherDeductions: any = {}, taxPaid: any = {}): TaxSummary {
  // Calculate salary income (with standard deduction for salaried individuals)
  const salaryIncome = parseFloat(incomeData?.salaryIncome?.replace(/,/g, "") || "0");
  
  // House property income
  const housePropertyIncome = parseFloat(incomeData?.housePropertyIncome?.replace(/,/g, "") || "0");
  
  // Capital gains 
  const shortTermCG = parseFloat(incomeData?.shortTermCapitalGains?.replace(/,/g, "") || "0");
  const longTermCG = parseFloat(incomeData?.longTermCapitalGains?.replace(/,/g, "") || "0");
  const capitalGainsIncome = shortTermCG + longTermCG;
  
  // Other income (interest, dividends, etc.)
  const interestIncome = parseFloat(incomeData?.interestIncome?.replace(/,/g, "") || "0");
  const dividendIncome = parseFloat(incomeData?.dividendIncome?.replace(/,/g, "") || "0");
  const otherSources = parseFloat(incomeData?.otherSources?.replace(/,/g, "") || "0");
  const otherIncome = interestIncome + dividendIncome + otherSources;
  
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
  let standardDeductionApplied = salaryIncome > 0 ? Math.min(STANDARD_DEDUCTION, salaryIncome) : 0;
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
