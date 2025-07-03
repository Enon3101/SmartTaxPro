export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  taxFiling: {
    year: string;
    status: string;
    type: string;
  };
  incomeSource: string[];
}

export interface SalaryIncome {
  id: string;
  employerName: string;
  grossSalary: string;
  standardDeduction: string;
  section10Exemptions: string;
  section10ExemptionsList: Array<{type: string, amount: string}>;
  professionalTax: string;
  tdsDeducted: string;
  netSalary: string;
}

export interface HousePropertyIncome {
  id: string;
  propertyType: string;
  propertyAddress: string;
  tenantName: string;
  tenantPAN: string;
  annualLetableValue: string;
  municipalTaxes: string;
  unrealizedRent: string;
  interestOnHousingLoan: string;
  netAnnualValue: string;
}

export interface CapitalGainsIncome {
  id: string;
  assetType: string;
  saleProceeds: string;
  purchaseCost: string;
  improvementCost: string;
  acquisitionDate: string;
  disposalDate: string;
  indexationApplicable: boolean;
  indexedCost: string;
  exemptionSection: string;
  exemptionAmount: string;
  netCapitalGain: string;
}

export interface BusinessIncome {
  id: string;
  businessName: string;
  businessType: string;
  grossReceipts: string;
  grossProfit: string;
  depreciation: string;
  otherExpenses: string;
  netProfit: string;
}

export interface InterestIncome {
  id: string;
  interestSource: string;
  amount: string;
  tdsDeducted: string;
}

export interface OtherIncome {
  id: string;
  incomeSource: string;
  amount: string;
  tdsDeducted: string;
}

export interface Deductions80C {
  ppf: string;
  elss: string;
  lifeInsurance: string;
  houseLoanPrincipal: string;
  sukanya: string;
  nsc: string;
  fixedDeposit: string;
  epf: string;
  nps: string;
  tuitionFees: string;
  totalAmount: string;
}

export interface Deductions80D {
  selfAndFamilyMedicalInsurance: string;
  parentsMedicalInsurance: string;
  selfAndFamilyMedicalExpenditure: string;
  parentsMedicalExpenditure: string;
  preventiveHealthCheckup: string;
  totalAmount: string;
}

export interface OtherDeductions {
  section80CCD: string;
  section80E: string;
  section80G: string;
  section80GG: string;
  section80TTA: string;
  section80TTB: string;
  section80DDB: string;
  section80U: string;
  totalAmount: string;
}

export interface TaxesPaid {
  tdsFromSalary: string;
  tdsFromOtherIncome: string;
  advanceTaxPaid: string;
  selfAssessmentTaxPaid: string;
  totalTaxesPaid: string;
}

export interface TaxFormData {
  personalInfo: PersonalInfo;
  salaryIncome: SalaryIncome[];
  housePropertyIncome: HousePropertyIncome[];
  capitalGainsIncome: CapitalGainsIncome[];
  businessIncome: BusinessIncome[];
  interestIncome: InterestIncome[];
  otherIncome: OtherIncome[];
  deductions80C: Deductions80C;
  deductions80D: Deductions80D;
  otherDeductions: OtherDeductions;
  taxPaid: TaxesPaid;
}

export interface TaxSummary {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTaxLiability: number;
  totalTaxesPaid: number;
  refundOrPayable: number;
}

export interface FilingStep {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}