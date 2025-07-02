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
  // -------------- Income Aggregation --------------
  const parseNum = (val?: string) => parseFloat((val || "0").replace(/,/g, "")) || 0;

  // Salary
  let salaryIncome = 0;
  if (Array.isArray(incomeData.salaryIncome)) {
    salaryIncome = incomeData.salaryIncome.reduce((t, s) => t + parseNum(s.netSalary), 0);
  } else {
    salaryIncome = parseNum(incomeData.salaryIncome as string);
  }

  // House Property
  let housePropertyIncome = 0;
  if (Array.isArray(incomeData.housePropertyIncome)) {
    housePropertyIncome = incomeData.housePropertyIncome.reduce((t, p) => t + parseNum(p.netAnnualValue), 0);
  } else {
    housePropertyIncome = parseNum(incomeData.housePropertyIncome as string);
  }

  // Capital Gains
  let capitalGainsIncome = 0;
  if (Array.isArray(incomeData.capitalGainsIncome)) {
    capitalGainsIncome = incomeData.capitalGainsIncome.reduce((t, g) => t + parseNum(g.netCapitalGain), 0);
  } else {
    capitalGainsIncome = parseNum(incomeData.shortTermCapitalGains) + parseNum(incomeData.longTermCapitalGains);
  }

  // Business Income
  let businessIncome = 0;
  if (Array.isArray(incomeData.businessIncome)) {
    businessIncome = incomeData.businessIncome.reduce((t, b) => t + parseNum(b.netProfit), 0);
  } else {
    businessIncome = parseNum(incomeData.businessIncome as string);
  }

  // Interest & Other Income
  const interestIncome = Array.isArray(incomeData.interestIncome)
    ? incomeData.interestIncome.reduce((t, i) => t + parseNum(i.amount), 0)
    : parseNum(incomeData.interestIncome as string);

  const otherIncomeAmount = Array.isArray(incomeData.otherIncome)
    ? incomeData.otherIncome.reduce((t, o) => t + parseNum(o.amount), 0)
    : parseNum(incomeData.dividendIncome) + parseNum(incomeData.otherSources);

  const otherIncome = interestIncome + otherIncomeAmount + businessIncome;

  const totalIncome = salaryIncome + housePropertyIncome + capitalGainsIncome + otherIncome;

  // -------------- Deductions --------------
  const section80C = Math.min(parseNum(deductions80C.totalAmount), MAX_80C_DEDUCTION);
  const section80D = Math.min(parseNum(deductions80D.totalAmount), MAX_80D_DEDUCTION_INDIVIDUAL);
  const additionalDeductions = parseNum(otherDeductions.totalAmount);
  const totalDeductions = section80C + section80D + additionalDeductions;

  // Standard deduction
  const stdDedAllowed = STANDARD_DEDUCTION[assessmentYear] ?? 50000;
  const standardDeductionApplied = salaryIncome > 0 ? Math.min(stdDedAllowed, salaryIncome) : 0;

  const taxableIncome = Math.max(0, totalIncome - standardDeductionApplied - totalDeductions);

  // -------------- Tax Calculation --------------
  const getSlabs = () => {
    if (taxRegime === 'old') {
      if (age < 60) return TAX_SLABS_AY2024_25.oldRegime.below60;
      if (age < 80) return TAX_SLABS_AY2024_25.oldRegime.senior;
      return TAX_SLABS_AY2024_25.oldRegime.superSenior;
    }
    return TAX_SLABS_AY2024_25.newRegime;
  };

  let basicTax = 0;
  let remaining = taxableIncome;
  let prevLimit = 0;
  for (const slab of getSlabs()) {
    if (remaining <= 0) break;
    const slabIncome = Math.min(remaining, slab.limit - prevLimit);
    basicTax += slabIncome * slab.rate;
    remaining -= slabIncome;
    prevLimit = slab.limit;
    if (slab.limit === Infinity) break;
  }

  // Surcharge simplified (old vs new)
  let surchargeRate = 0;
  if (taxRegime === 'old') {
    if (totalIncome > 50000000) surchargeRate = 0.37;
    else if (totalIncome > 20000000) surchargeRate = 0.25;
    else if (totalIncome > 10000000) surchargeRate = 0.15;
    else if (totalIncome > 5000000) surchargeRate = 0.10;
  } else {
    if (totalIncome > 20000000) surchargeRate = 0.25;
    else if (totalIncome > 10000000) surchargeRate = 0.15;
    else if (totalIncome > 5000000) surchargeRate = 0.10;
  }
  const surchargeAmount = basicTax * surchargeRate;

  let taxAfterSurcharge = basicTax + surchargeAmount;

  // Rebate 87A
  let rebate = 0;
  if ((taxRegime === 'old' && taxableIncome <= 500000) || (taxRegime === 'new' && taxableIncome <= 700000)) {
    rebate = Math.min(taxAfterSurcharge, taxRegime === 'old' ? 12500 : 25000);
  }
  taxAfterSurcharge -= rebate;

  const cessAmount = taxAfterSurcharge * CESS_RATE;
  const estimatedTax = taxAfterSurcharge + cessAmount;

  // Taxes paid
  const tdsAmount = parseNum(taxPaid.tds);
  const advanceTaxPaid = parseNum(taxPaid.advanceTax);
  const selfAssessmentTaxPaid = parseNum(taxPaid.selfAssessmentTax);
  const totalTaxPaid = tdsAmount + advanceTaxPaid + selfAssessmentTaxPaid;

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

// ---------- Helper utilities copied from client ----------

export const costInflationIndex: { [key: string]: number } = {
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
};

export function calculateIndexedCost(purchaseCost: number, acquisitionDate: string, disposalDate: string): number {
  const getFY = (d: Date) => {
    const yr = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
    return `${yr}-${(yr + 1).toString().slice(-2)}`;
  };
  const acqFY = getFY(new Date(acquisitionDate));
  const dispFY = getFY(new Date(disposalDate));
  const acqCII = costInflationIndex[acqFY] || 100;
  const dispCII = costInflationIndex[dispFY] || costInflationIndex["2023-24"];
  return Math.round((purchaseCost * dispCII) / acqCII);
}

export function formatIndianCurrency(value: number): string {
  return value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
} 