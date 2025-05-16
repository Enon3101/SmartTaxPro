import { Router } from 'express';
import { z } from 'zod';

const calculatorRouter = Router();

// Schema for loan EMI calculator
const loanEmiSchema = z.object({
  principal: z.number().positive(),
  interestRate: z.number().positive(),
  tenureYears: z.number().positive()
});

// Schema for home/car/personal loan calculators (same as loan EMI but with specific type)
const specificLoanSchema = z.object({
  principal: z.number().positive(),
  interestRate: z.number().positive(),
  tenureYears: z.number().positive(),
  loanType: z.enum(['home', 'car', 'personal'])
});

// Schema for SIP calculator
const sipCalculatorSchema = z.object({
  monthlyInvestment: z.number().positive(),
  expectedReturnRate: z.number().positive(),
  tenureYears: z.number().positive()
});

// Schema for FD calculator
const fdCalculatorSchema = z.object({
  principal: z.number().positive(),
  interestRate: z.number().positive(),
  tenureYears: z.number().positive(),
  compoundingFrequency: z.enum(['yearly', 'half-yearly', 'quarterly', 'monthly']).default('yearly')
});

// Schema for PPF calculator
const ppfCalculatorSchema = z.object({
  yearlyDeposit: z.number().positive(),
  tenure: z.number().min(15).max(30).default(15),
  interestRate: z.number().positive().default(7.1)
});

// Schema for NPS calculator
const npsCalculatorSchema = z.object({
  monthlyContribution: z.number().positive(),
  currentAge: z.number().min(18).max(60),
  retirementAge: z.number().min(60).max(70).default(60),
  expectedReturnRate: z.number().positive()
});

// Schema for lumpsum MF calculator
const lumpsumCalculatorSchema = z.object({
  amount: z.number().positive(),
  expectedReturnRate: z.number().positive(),
  tenureYears: z.number().positive()
});

// Schema for compound interest calculator
const compoundInterestSchema = z.object({
  principal: z.number().positive(),
  interestRate: z.number().positive(),
  tenureYears: z.number().positive(),
  compoundingFrequency: z.enum(['yearly', 'half-yearly', 'quarterly', 'monthly']).default('yearly')
});

// Schema for loan against property eligibility calculator
const lapEligibilitySchema = z.object({
  propertyValue: z.number().positive(),
  monthlyIncome: z.number().positive(),
  existingLoanEmi: z.number().min(0).default(0),
  loanTenureYears: z.number().positive().max(20).default(15)
});

// Schema for retirement corpus calculator
const retirementCalculatorSchema = z.object({
  currentAge: z.number().min(18).max(59),
  retirementAge: z.number().min(60).max(70),
  monthlyExpenses: z.number().positive(),
  inflation: z.number().positive().default(6),
  expectedReturnRate: z.number().positive(),
  lifeExpectancy: z.number().min(70).max(100).default(85)
});

// Schema for gratuity calculator
const gratuityCalculatorSchema = z.object({
  lastDrawnSalary: z.number().positive(),
  yearsOfService: z.number().positive()
});

// Calculator functions

// Function to calculate EMI
function calculateEmi(principal: number, interestRate: number, tenureYears: number): number {
  const monthlyRate = interestRate / (12 * 100);
  const tenureMonths = tenureYears * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
         (Math.pow(1 + monthlyRate, tenureMonths) - 1);
}

// Function to calculate SIP returns
function calculateSipReturns(
  monthlyInvestment: number, 
  expectedReturnRate: number, 
  tenureYears: number
): { 
  totalInvestment: number, 
  interestEarned: number, 
  maturityValue: number 
} {
  const monthlyRate = expectedReturnRate / (12 * 100);
  const tenureMonths = tenureYears * 12;
  
  const totalInvestment = monthlyInvestment * tenureMonths;
  const maturityValue = monthlyInvestment * 
                         ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / monthlyRate) * 
                         (1 + monthlyRate);
  
  return {
    totalInvestment,
    interestEarned: maturityValue - totalInvestment,
    maturityValue
  };
}

// Function to calculate FD maturity value
function calculateFdMaturity(
  principal: number, 
  interestRate: number, 
  tenureYears: number, 
  compoundingFrequency: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly'
): {
  totalInvestment: number,
  interestEarned: number,
  maturityValue: number
} {
  let compoundsPerYear = 1;
  
  switch (compoundingFrequency) {
    case 'yearly':
      compoundsPerYear = 1;
      break;
    case 'half-yearly':
      compoundsPerYear = 2;
      break;
    case 'quarterly':
      compoundsPerYear = 4;
      break;
    case 'monthly':
      compoundsPerYear = 12;
      break;
  }
  
  const rate = interestRate / 100;
  const n = compoundsPerYear * tenureYears;
  const maturityValue = principal * Math.pow(1 + (rate / compoundsPerYear), n);
  
  return {
    totalInvestment: principal,
    interestEarned: maturityValue - principal,
    maturityValue
  };
}

// Function to calculate PPF maturity value
function calculatePpfMaturity(
  yearlyDeposit: number, 
  tenure: number, 
  interestRate: number
): {
  totalInvestment: number,
  interestEarned: number,
  maturityValue: number
} {
  let balance = 0;
  let totalInterest = 0;
  const rate = interestRate / 100;
  
  for (let i = 0; i < tenure; i++) {
    balance += yearlyDeposit;
    const yearInterest = balance * rate;
    totalInterest += yearInterest;
    balance += yearInterest;
  }
  
  const totalInvestment = yearlyDeposit * tenure;
  
  return {
    totalInvestment,
    interestEarned: totalInterest,
    maturityValue: balance
  };
}

// Function to calculate NPS corpus
function calculateNpsCorpus(
  monthlyContribution: number, 
  currentAge: number, 
  retirementAge: number, 
  expectedReturnRate: number
): {
  totalInvestment: number,
  interestEarned: number,
  maturityValue: number,
  annuityValue: number,
  lumpsumValue: number
} {
  const tenureYears = retirementAge - currentAge;
  const yearlyContribution = monthlyContribution * 12;
  let corpus = 0;
  let totalContribution = 0;
  
  for (let i = 0; i < tenureYears; i++) {
    totalContribution += yearlyContribution;
    corpus += yearlyContribution;
    corpus *= (1 + expectedReturnRate / 100);
  }
  
  // As per NPS rules, 60% can be withdrawn as lumpsum, 40% to be used for annuity
  const lumpsumValue = corpus * 0.6;
  const annuityValue = corpus * 0.4;
  
  return {
    totalInvestment: totalContribution,
    interestEarned: corpus - totalContribution,
    maturityValue: corpus,
    annuityValue,
    lumpsumValue
  };
}

// Function to calculate lumpsum returns
function calculateLumpsumReturns(
  amount: number, 
  expectedReturnRate: number, 
  tenureYears: number
): {
  totalInvestment: number,
  interestEarned: number,
  maturityValue: number
} {
  const maturityValue = amount * Math.pow(1 + expectedReturnRate / 100, tenureYears);
  
  return {
    totalInvestment: amount,
    interestEarned: maturityValue - amount,
    maturityValue
  };
}

// Function to calculate compound interest
function calculateCompoundInterest(
  principal: number, 
  interestRate: number, 
  tenureYears: number, 
  compoundingFrequency: 'yearly' | 'half-yearly' | 'quarterly' | 'monthly'
): {
  totalInvestment: number,
  interestEarned: number,
  maturityValue: number
} {
  // This is same as FD calculation
  return calculateFdMaturity(principal, interestRate, tenureYears, compoundingFrequency);
}

// Function to calculate loan against property eligibility
function calculateLapEligibility(
  propertyValue: number, 
  monthlyIncome: number, 
  existingLoanEmi: number,
  loanTenureYears: number
): {
  maxLoanAmountByProperty: number,
  maxLoanAmountByIncome: number,
  eligibleLoanAmount: number,
  maxEmi: number
} {
  // Typically, banks finance up to 60-80% of property value
  const maxLoanAmountByProperty = propertyValue * 0.7;
  
  // Monthly income criteria - Usually 60% of income can go towards all EMIs
  const maxEmi = (monthlyIncome * 0.6) - existingLoanEmi;
  
  // Convert EMI to loan amount
  const monthlyRate = 9 / (12 * 100); // Assuming 9% interest rate
  const tenureMonths = loanTenureYears * 12;
  
  const maxLoanAmountByIncome = maxEmi * 
                               ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / 
                               (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)));
  
  // Eligible loan is lower of the two
  const eligibleLoanAmount = Math.min(maxLoanAmountByProperty, maxLoanAmountByIncome);
  
  return {
    maxLoanAmountByProperty,
    maxLoanAmountByIncome,
    eligibleLoanAmount,
    maxEmi
  };
}

// Function to calculate retirement corpus
function calculateRetirementCorpus(
  currentAge: number, 
  retirementAge: number, 
  monthlyExpenses: number, 
  inflation: number,
  expectedReturnRate: number,
  lifeExpectancy: number
): {
  corpusRequired: number,
  monthlyInvestmentRequired: number,
  yearlyExpensesAtRetirement: number,
  yearsAfterRetirement: number
} {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsAfterRetirement = lifeExpectancy - retirementAge;
  
  // Calculate monthly expenses at retirement
  const monthlyExpensesAtRetirement = monthlyExpenses * 
                                      Math.pow(1 + inflation / 100, yearsToRetirement);
  
  const yearlyExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
  
  // Post-retirement, assuming investment continues at lower risk
  const postRetirementRate = expectedReturnRate * 0.7; // 70% of pre-retirement rate
  
  // Calculate corpus required at retirement
  // Using the formula for present value of annuity
  const corpus = yearlyExpensesAtRetirement * 
                ((1 - Math.pow(1 + postRetirementRate / 100, -yearsAfterRetirement)) / 
                (postRetirementRate / 100));
  
  // Calculate required monthly investment to reach this corpus
  const monthlyRate = expectedReturnRate / (12 * 100);
  const months = yearsToRetirement * 12;
  
  const monthlyInvestment = corpus / 
                           ((Math.pow(1 + monthlyRate, months) - 1) / 
                           monthlyRate * (1 + monthlyRate));
  
  return {
    corpusRequired: corpus,
    monthlyInvestmentRequired: monthlyInvestment,
    yearlyExpensesAtRetirement,
    yearsAfterRetirement
  };
}

// Function to calculate gratuity
function calculateGratuity(
  lastDrawnSalary: number, 
  yearsOfService: number
): {
  gratuityAmount: number,
  taxableAmount: number,
  taxExemptAmount: number
} {
  // Gratuity formula as per Payment of Gratuity Act, 1972
  // (15 * Last Drawn Salary * Number of Years of Service) / 26
  const basicSalary = lastDrawnSalary * 0.5; // Assuming basic salary as 50% of total
  const gratuityAmount = (15 * basicSalary * Math.min(yearsOfService, 30)) / 26;
  
  // Tax exemption limit for gratuity is 20,00,000
  const taxExemptAmount = Math.min(gratuityAmount, 2000000);
  const taxableAmount = Math.max(0, gratuityAmount - 2000000);
  
  return {
    gratuityAmount,
    taxableAmount,
    taxExemptAmount
  };
}

// API Routes

// Loan EMI Calculator
calculatorRouter.post('/loan-emi', (req, res) => {
  try {
    const { principal, interestRate, tenureYears } = loanEmiSchema.parse(req.body);
    
    const monthlyEmi = calculateEmi(principal, interestRate, tenureYears);
    const totalAmount = monthlyEmi * tenureYears * 12;
    const totalInterest = totalAmount - principal;
    
    res.json({
      monthlyEmi,
      totalAmount,
      totalInterest,
      principal,
      tenureYears,
      interestRate
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Specific Loan Calculator (Home, Car, Personal)
calculatorRouter.post('/specific-loan', (req, res) => {
  try {
    const { principal, interestRate, tenureYears, loanType } = specificLoanSchema.parse(req.body);
    
    const monthlyEmi = calculateEmi(principal, interestRate, tenureYears);
    const totalAmount = monthlyEmi * tenureYears * 12;
    const totalInterest = totalAmount - principal;
    
    // Additional loan-specific details
    let additionalInfo = {};
    
    switch (loanType) {
      case 'home':
        additionalInfo = {
          stampDuty: principal * 0.05,  // Assuming 5% stamp duty
          registrationFee: 30000,       // Typical registration fee
          processingFee: principal * 0.005, // 0.5% processing fee
        };
        break;
      case 'car':
        additionalInfo = {
          insurance: principal * 0.04,  // Approx 4% for car insurance
          processingFee: principal * 0.01, // 1% processing fee
          roadTax: principal * 0.1,     // Approx 10% road tax
        };
        break;
      case 'personal':
        additionalInfo = {
          processingFee: principal * 0.02, // 2% processing fee
          prePaymentPenalty: principal * 0.03, // 3% prepayment penalty
        };
        break;
    }
    
    res.json({
      monthlyEmi,
      totalAmount,
      totalInterest,
      principal,
      tenureYears,
      interestRate,
      loanType,
      additionalInfo
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// SIP Calculator
calculatorRouter.post('/sip', (req, res) => {
  try {
    const { monthlyInvestment, expectedReturnRate, tenureYears } = sipCalculatorSchema.parse(req.body);
    
    const result = calculateSipReturns(monthlyInvestment, expectedReturnRate, tenureYears);
    
    res.json({
      ...result,
      monthlyInvestment,
      expectedReturnRate,
      tenureYears
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// FD Calculator
calculatorRouter.post('/fd', (req, res) => {
  try {
    const { principal, interestRate, tenureYears, compoundingFrequency } = fdCalculatorSchema.parse(req.body);
    
    const result = calculateFdMaturity(principal, interestRate, tenureYears, compoundingFrequency);
    
    res.json({
      ...result,
      principal,
      interestRate,
      tenureYears,
      compoundingFrequency
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// PPF Calculator
calculatorRouter.post('/ppf', (req, res) => {
  try {
    const { yearlyDeposit, tenure, interestRate } = ppfCalculatorSchema.parse(req.body);
    
    const result = calculatePpfMaturity(yearlyDeposit, tenure, interestRate);
    
    res.json({
      ...result,
      yearlyDeposit,
      tenure,
      interestRate,
      taxStatus: 'Tax exempt under 80C',
      lockedYears: Math.min(tenure, 15)
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// NPS Calculator
calculatorRouter.post('/nps', (req, res) => {
  try {
    const { monthlyContribution, currentAge, retirementAge, expectedReturnRate } = npsCalculatorSchema.parse(req.body);
    
    const result = calculateNpsCorpus(monthlyContribution, currentAge, retirementAge, expectedReturnRate);
    
    res.json({
      ...result,
      monthlyContribution,
      currentAge,
      retirementAge,
      expectedReturnRate,
      taxBenefits: {
        section80CCD1: 'Up to ₹1.5 lakhs under 80C',
        section80CCD1B: 'Additional ₹50,000 under 80CCD(1B)',
        section80CCD2: 'Employer contribution up to 10% of salary'
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Lumpsum Calculator
calculatorRouter.post('/lumpsum', (req, res) => {
  try {
    const { amount, expectedReturnRate, tenureYears } = lumpsumCalculatorSchema.parse(req.body);
    
    const result = calculateLumpsumReturns(amount, expectedReturnRate, tenureYears);
    
    res.json({
      ...result,
      amount,
      expectedReturnRate,
      tenureYears,
      cagr: expectedReturnRate
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Compound Interest Calculator
calculatorRouter.post('/compound-interest', (req, res) => {
  try {
    const { principal, interestRate, tenureYears, compoundingFrequency } = compoundInterestSchema.parse(req.body);
    
    const result = calculateCompoundInterest(principal, interestRate, tenureYears, compoundingFrequency);
    
    // Calculate effective annual rate
    const compoundsPerYear = compoundingFrequency === 'yearly' ? 1 :
                            compoundingFrequency === 'half-yearly' ? 2 :
                            compoundingFrequency === 'quarterly' ? 4 : 12;
    
    const effectiveRate = (Math.pow(1 + (interestRate / 100) / compoundsPerYear, compoundsPerYear) - 1) * 100;
    
    res.json({
      ...result,
      principal,
      interestRate,
      tenureYears,
      compoundingFrequency,
      effectiveAnnualRate: effectiveRate
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Loan Against Property Eligibility Calculator
calculatorRouter.post('/lap', (req, res) => {
  try {
    const { propertyValue, monthlyIncome, existingLoanEmi, loanTenureYears } = lapEligibilitySchema.parse(req.body);
    
    const result = calculateLapEligibility(propertyValue, monthlyIncome, existingLoanEmi, loanTenureYears);
    
    res.json({
      ...result,
      propertyValue,
      monthlyIncome,
      existingLoanEmi,
      loanTenureYears,
      loanToValueRatio: (result.eligibleLoanAmount / propertyValue) * 100,
      emiToIncomeRatio: (result.maxEmi / monthlyIncome) * 100
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Retirement Calculator
calculatorRouter.post('/retirement', (req, res) => {
  try {
    const { currentAge, retirementAge, monthlyExpenses, inflation, expectedReturnRate, lifeExpectancy } = retirementCalculatorSchema.parse(req.body);
    
    const result = calculateRetirementCorpus(
      currentAge, 
      retirementAge, 
      monthlyExpenses, 
      inflation, 
      expectedReturnRate, 
      lifeExpectancy
    );
    
    res.json({
      ...result,
      currentAge,
      retirementAge,
      monthlyExpenses,
      inflation,
      expectedReturnRate,
      lifeExpectancy,
      yearsToRetirement: retirementAge - currentAge
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Gratuity Calculator
calculatorRouter.post('/gratuity', (req, res) => {
  try {
    const { lastDrawnSalary, yearsOfService } = gratuityCalculatorSchema.parse(req.body);
    
    const result = calculateGratuity(lastDrawnSalary, yearsOfService);
    
    res.json({
      ...result,
      lastDrawnSalary,
      yearsOfService,
      formula: '(15 × Basic Salary × Years of Service) / 26',
      taxExemptionLimit: 2000000
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input: ' + error.message });
  }
});

// Home Loan EMI Calculator
calculatorRouter.post('/home-loan', (req, res) => {
  try {
    const { principal, interestRate, tenureYears } = req.body;
    const validatedData = { principal, interestRate, tenureYears, loanType: 'home' };
    
    const { principal: p, interestRate: ir, tenureYears: ty, loanType } = specificLoanSchema.parse(validatedData);
    
    const monthlyEmi = calculateEmi(p, ir, ty);
    const totalAmount = monthlyEmi * ty * 12;
    const totalInterest = totalAmount - p;
    
    // Home loan specific details
    const additionalInfo = {
      stampDuty: p * 0.05,         // Assuming 5% stamp duty
      registrationFee: 30000,       // Typical registration fee
      processingFee: p * 0.005,    // 0.5% processing fee
    };
    
    res.json({
      monthlyEmi,
      totalAmount,
      totalInterest,
      principal: p,
      tenureYears: ty,
      interestRate: ir,
      loanType,
      additionalInfo
    });
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid input: ' + (error.message || 'Invalid data') });
  }
});

// Car Loan EMI Calculator
calculatorRouter.post('/car-loan', (req, res) => {
  try {
    const { principal, interestRate, tenureYears } = req.body;
    const validatedData = { principal, interestRate, tenureYears, loanType: 'car' };
    
    const { principal: p, interestRate: ir, tenureYears: ty, loanType } = specificLoanSchema.parse(validatedData);
    
    const monthlyEmi = calculateEmi(p, ir, ty);
    const totalAmount = monthlyEmi * ty * 12;
    const totalInterest = totalAmount - p;
    
    // Car loan specific details
    const additionalInfo = {
      insurance: p * 0.04,          // Approx 4% for car insurance
      processingFee: p * 0.01,      // 1% processing fee
      roadTax: p * 0.1,             // Approx 10% road tax
    };
    
    res.json({
      monthlyEmi,
      totalAmount,
      totalInterest,
      principal: p,
      tenureYears: ty,
      interestRate: ir,
      loanType,
      additionalInfo
    });
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid input: ' + (error.message || 'Invalid data') });
  }
});

// Personal Loan EMI Calculator
calculatorRouter.post('/personal-loan', (req, res) => {
  try {
    const { principal, interestRate, tenureYears } = req.body;
    const validatedData = { principal, interestRate, tenureYears, loanType: 'personal' };
    
    const { principal: p, interestRate: ir, tenureYears: ty, loanType } = specificLoanSchema.parse(validatedData);
    
    const monthlyEmi = calculateEmi(p, ir, ty);
    const totalAmount = monthlyEmi * ty * 12;
    const totalInterest = totalAmount - p;
    
    // Personal loan specific details
    const additionalInfo = {
      processingFee: p * 0.02,      // 2% processing fee
      prePaymentPenalty: p * 0.03,  // 3% prepayment penalty
    };
    
    res.json({
      monthlyEmi,
      totalAmount,
      totalInterest,
      principal: p,
      tenureYears: ty,
      interestRate: ir,
      loanType,
      additionalInfo
    });
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid input: ' + (error.message || 'Invalid data') });
  }
});

export default calculatorRouter;