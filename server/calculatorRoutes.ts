import express, { Request, Response } from 'express';
import { z } from 'zod';

import { calculateTaxSummary } from '../shared/tax-calculations';
// import { authenticateToken } from './auth'; // Will add authentication later

const router = express.Router();

// Define Zod schema for tax calculation input
const TaxCalculationInputSchema = z.object({
  personalDetails: z.object({
    assessmentYear: z.string().regex(/^\d{4}-\d{2}$/, "Invalid Assessment Year format (e.g., 2024-25)"),
    taxpayerCategory: z.enum(['individual', 'huf', 'aop', 'boi', 'firm', 'llp', 'company', 'trust']),
    residentialStatus: z.enum(['resident', 'non-resident', 'not-ordinarily-resident']),
    age: z.number().int().min(0).max(120).optional(), // Optional, for senior citizen checks
  }),
  incomeSources: z.object({
    salary: z.number().min(0).default(0),
    housePropertyIncome: z.number().default(0), // Can be negative
    capitalGains: z.object({
      stcgNormalRate: z.number().min(0).default(0), // STCG taxable at normal slab rates
      stcg111A: z.number().min(0).default(0),      // STCG u/s 111A (equity/equity MF on STT paid) - 15%
      ltcg112: z.number().min(0).default(0),       // LTCG u/s 112 (e.g., debt MF > 36m, property, unlisted shares) - 20% with indexation
      ltcg112A_Equity: z.number().min(0).default(0),// LTCG u/s 112A (equity/equity MF on STT paid, > 12m holding) - 10% on gains > 1 Lakh
      ltcgOther: z.number().min(0).default(0),     // Other LTCG (e.g. specific bonds if any special rate)
    }).default({}),
    businessProfessionIncome: z.number().default(0), // Can be negative
    otherSourcesIncome: z.number().min(0).default(0),
    agriculturalIncome: z.number().min(0).default(0),
  }),
  deductions: z.object({
    chapterVIA: z.object({
      section80C: z.number().min(0).default(0), // 80C investments (PPF/LIC etc)
      section80CCC: z.number().min(0).default(0), // Pension funds
      section80CCD1: z.number().min(0).default(0), // NPS employee contribution
      section80CCD1B: z.number().min(0).default(0), // Additional NPS contribution (max 50k)
      section80CCD2: z.number().min(0).default(0), // NPS employer contribution
      section80D: z.number().min(0).default(0), // Medical insurance
      section80DD: z.number().min(0).default(0), // Disabled dependent
      section80DDB: z.number().min(0).default(0), // Medical treatment for specified diseases
      section80E: z.number().min(0).default(0), // Interest on education loan
      section80EEA: z.number().min(0).default(0), // Interest on housing loan (affordable housing)
      section80EEB: z.number().min(0).default(0), // Interest on electric vehicle loan
      section80G: z.number().min(0).default(0), // Donations
      section80GG: z.number().min(0).default(0), // Rent paid (no HRA)
      section80GGA: z.number().min(0).default(0), // Donations for scientific research/rural development
      section80GGC: z.number().min(0).default(0), // Donations to political parties
      section80TTA: z.number().min(0).default(0), // Interest on savings account (max 10k for non-seniors)
      section80TTB: z.number().min(0).default(0), // Interest on deposits for senior citizens (max 50k)
      section80U: z.number().min(0).default(0), // Self-disability
      // Add other relevant sections as needed
    }).default({}),
    otherDeductions: z.object({
      standardDeduction: z.number().min(0).default(0), // For salaried, typically 50k
      professionalTax: z.number().min(0).default(0),
      homeLoanInterest: z.number().min(0).default(0), // Under Sec 24(b) for house property income
      // Add other deductions as needed
    }).default({}),
  }),
  taxRegime: z.enum(['old', 'new']).default('new'),
  // We might need FY later if AY is not enough to determine slabs
});

router.post('/tax', /* authenticateToken, */ (req: Request, res: Response) => {
  try {
    const validatedData = TaxCalculationInputSchema.parse(req.body);

    const incomeData = {
      salaryIncome: validatedData.incomeSources.salary.toString(),
      housePropertyIncome: validatedData.incomeSources.housePropertyIncome.toString(),
      capitalGainsIncome: (
        (validatedData.incomeSources.capitalGains?.stcgNormalRate || 0) +
        (validatedData.incomeSources.capitalGains?.stcg111A || 0) +
        (validatedData.incomeSources.capitalGains?.ltcg112 || 0) +
        (validatedData.incomeSources.capitalGains?.ltcg112A_Equity || 0) +
        (validatedData.incomeSources.capitalGains?.ltcgOther || 0)
      ).toString(),
      businessIncome: validatedData.incomeSources.businessProfessionIncome.toString(),
      otherSourcesIncome: validatedData.incomeSources.otherSourcesIncome.toString(),
    };

    const deductions80C = {
      totalAmount: (
        (validatedData.deductions.chapterVIA?.section80C || 0) +
        (validatedData.deductions.chapterVIA?.section80CCC || 0) +
        (validatedData.deductions.chapterVIA?.section80CCD1 || 0)
      ).toString(),
    };

    const deductions80D = {
      totalAmount: (validatedData.deductions.chapterVIA?.section80D || 0).toString(),
    };

    const otherDeductions = {
      totalAmount: "0", // Simplified for now
    };

    const taxPaid = {
      tds: "0",
      advanceTax: "0",
      selfAssessmentTax: "0",
    };

    const result = calculateTaxSummary(
      incomeData,
      deductions80C,
      deductions80D,
      otherDeductions,
      taxPaid,
      validatedData.personalDetails.assessmentYear,
      validatedData.taxRegime,
      validatedData.personalDetails.age
    );

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Tax calculation error:", error);
    res.status(500).json({ message: "Internal server error during tax calculation." });
  }
});

// Personal Loan Calculator Schemas
const PersonalLoanRequestSchema = z.object({
  principal: z.number().min(1000, "Principal must be at least 1000"),
  interestRate: z.number().min(0.1, "Interest rate must be at least 0.1%").max(100, "Interest rate cannot exceed 100%"),
  tenureYears: z.number().min(0.1, "Tenure must be at least ~1 month").max(30, "Tenure cannot exceed 30 years"),
});

const PersonalLoanResponseSchema = z.object({
  monthlyEmi: z.number(),
  totalAmount: z.number(),
  totalInterest: z.number(),
  principal: z.number(),
  tenureYears: z.number(),
  interestRate: z.number(),
  loanType: z.string().default("Personal Loan"),
  additionalInfo: z.object({
    processingFee: z.number().default(0), // Example, can be calculated or fixed
    prePaymentPenalty: z.number().default(0), // Example
  }),
});

// Personal Loan Calculation Logic
const calculatePersonalLoan = (
  data: z.infer<typeof PersonalLoanRequestSchema>
): z.infer<typeof PersonalLoanResponseSchema> => {
  const { principal, interestRate, tenureYears } = data;

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;

  if (principal <= 0 || monthlyInterestRate <= 0 || numberOfMonths <= 0) {
    // Or throw an error, depending on how strict validation should be
    return {
      monthlyEmi: 0,
      totalAmount: principal,
      totalInterest: 0,
      principal,
      tenureYears,
      interestRate,
      loanType: "Personal Loan",
      additionalInfo: { processingFee: 0, prePaymentPenalty: 0 },
    };
  }
  
  const emi =
    (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
    (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

  const monthlyEmi = parseFloat(emi.toFixed(2));
  const totalAmount = parseFloat((monthlyEmi * numberOfMonths).toFixed(2));
  const totalInterest = parseFloat((totalAmount - principal).toFixed(2));

  // Example: Calculate a processing fee (e.g., 1% of principal)
  const processingFee = parseFloat((principal * 0.01).toFixed(2));


  return {
    monthlyEmi,
    totalAmount,
    totalInterest,
    principal,
    tenureYears,
    interestRate,
    loanType: "Personal Loan",
    additionalInfo: {
      processingFee,
      prePaymentPenalty: 0, // Assuming no pre-payment penalty for this example
    },
  };
};

router.post('/personal-loan', (req: Request, res: Response) => {
  try {
    const validatedData = PersonalLoanRequestSchema.parse(req.body);
    const result = calculatePersonalLoan(validatedData);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Personal loan calculation error:", error);
    res.status(500).json({ message: "Internal server error during personal loan calculation." });
  }
});

export default router;
