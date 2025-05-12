/**
 * Tax Data Interfaces
 * This file contains TypeScript interfaces for tax-related data structures.
 */

// Capital Gains entry interface
export interface CapitalGainsEntry {
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

// Salary entry interface
export interface SalaryEntry {
  id: string;
  employerName: string;
  grossSalary: string;
  standardDeduction: string;
  section10Exemptions: string;
  section10ExemptionsList: SectionExemption[];
  professionalTax: string;
  tdsDeducted?: string; // Optional as it may be moved to taxes paid section
  netSalary: string;
}

// Section 10 exemption interface
export interface SectionExemption {
  type: string;
  amount: string;
}

// House property entry interface
export interface HousePropertyEntry {
  id: string;
  propertyType: string;
  propertyAddress: string;
  propertyPincode: string;
  annualRentReceived: string;
  municipalTaxes: string;
  interestOnLoan: string;
  municipalValuation: string;
  fairRent: string;
  standardDeduction: string;
  netAnnualValue: string;
  incomeFromHouseProperty: string;
  
  // For let-out properties
  tenantName?: string;
  tenantPAN?: string;
}

// Business income entry interface
export interface BusinessIncomeEntry {
  id: string;
  businessName: string;
  businessType: string;
  grossReceipts: string;
  grossProfit: string;
  depreciation: string;
  otherExpenses: string;
  netProfit: string;
}

// Interest income entry interface
export interface InterestIncomeEntry {
  id: string;
  interestSource: string;
  amount: string;
  tdsDeducted: string;
}

// Other income entry interface
export interface OtherIncomeEntry {
  id: string;
  incomeSource: string;
  amount: string;
  tdsDeducted: string;
}

// Taxes paid interface
export interface TaxesPaid {
  tdsFromSalary: string;
  tdsFromOtherIncome: string;
  advanceTaxPaid: string;
  selfAssessmentTaxPaid: string;
  totalTaxesPaid: string;
}

// Section 80C deductions interface
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

// Section 80D deductions interface
export interface Deductions80D {
  selfAndFamilyMedicalInsurance: string;
  parentsMedicalInsurance: string;
  selfAndFamilyMedicalExpenditure: string;
  parentsMedicalExpenditure: string;
  preventiveHealthCheckup: string;
  totalAmount: string;
}

// Other deductions interface
export interface OtherDeductions {
  section80E: string; // Interest on education loan
  section80G: string; // Donations
  section80GG: string; // Rent paid
  section80TTA: string; // Interest on savings account
  section80TTB: string; // Interest for senior citizens
  section80CCD: string; // NPS contribution
  section80DDB: string; // Medical treatment
  section80U: string; // Person with disability
  totalAmount: string;
}

// Complete income data interface
export interface IncomeData {
  salaryIncome: SalaryEntry[];
  housePropertyIncome: HousePropertyEntry[];
  capitalGainsIncome: CapitalGainsEntry[];
  businessIncome: BusinessIncomeEntry[];
  interestIncome: InterestIncomeEntry[];
  otherIncome: OtherIncomeEntry[];
}

// Complete tax form data interface
export interface TaxFormData {
  id: string;
  personalInfo: any; // Personal information structure
  formType: string; // ITR-1, ITR-2, ITR-3, ITR-4
  incomeData: IncomeData;
  deductions80C: Deductions80C;
  deductions80D: Deductions80D;
  otherDeductions: OtherDeductions;
  taxPaid: TaxesPaid;
  status: string;
  assessmentYear: string;
}