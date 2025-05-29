import express, { Request, Response } from 'express';
import { z } from 'zod';
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
      section80C: z.number().min(0).default(0), // Max 1.5L combined with 80CCC, 80CCD(1)
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

// Define Zod schema for tax calculation output
const TaxCalculationOutputSchema = z.object({
  grossTotalIncome: z.number(),
  totalDeductions: z.number(),
  netTaxableIncome: z.number(),
  taxBeforeCess: z.number(),
  healthAndEducationCess: z.number(),
  totalTaxLiability: z.number(),
  relief87A: z.number().optional(),
  surcharge: z.number().optional(),
  breakdown: z.object({
    incomeTax: z.any(), // Could be an object with slab-wise calculation
    capitalGainsTax: z.any().optional(),
  }).optional(),
  message: z.string().optional(),
});

// FY 2024-25 (AY 2025-26) Old Tax Regime Slabs for Individuals < 60 years
const oldRegimeSlabs_Individual_FY2024_25 = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

// FY 2024-25 (AY 2025-26) New Tax Regime Slabs (Default) - Sec 115BAC
const newRegimeSlabs_FY2024_25 = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 0.05 },
  { limit: 900000, rate: 0.10 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];


const calculateTaxLiability = (
  data: z.infer<typeof TaxCalculationInputSchema>
): z.infer<typeof TaxCalculationOutputSchema> => {
  const { incomeSources, deductions, personalDetails, taxRegime } = data;
  const isSeniorCitizen = personalDetails.age !== undefined && personalDetails.age >= 60;
  // const isSuperSeniorCitizen = personalDetails.age !== undefined && personalDetails.age >= 80; // TODO: Use for super senior citizen slab adjustments

  // 1. Calculate Gross Total Income (GTI)
  let grossTotalIncome = 0;
  grossTotalIncome += incomeSources.salary || 0;
  grossTotalIncome += incomeSources.housePropertyIncome || 0; 
  // Add all capital gains to GTI. Specific tax rates will be applied later.
  grossTotalIncome += (incomeSources.capitalGains?.stcgNormalRate || 0) +
                      (incomeSources.capitalGains?.stcg111A || 0) +
                      (incomeSources.capitalGains?.ltcg112 || 0) +
                      (incomeSources.capitalGains?.ltcg112A_Equity || 0) +
                      (incomeSources.capitalGains?.ltcgOther || 0);
  grossTotalIncome += incomeSources.businessProfessionIncome || 0; 
  grossTotalIncome += incomeSources.otherSourcesIncome || 0;
  // agriculturalIncome is generally exempt up to a certain limit or if total income is low.
  // For simplicity, not including it in taxable income directly here, but it can affect slab rates.

  // 2. Calculate Total Deductions
  let totalDeductions = 0;
  let calculatedStandardDeduction = 0;

  if (taxRegime === 'old') {
    // Standard Deduction (for salaried and pensioners)
    if (incomeSources.salary > 0) {
      calculatedStandardDeduction = Math.min(incomeSources.salary, 50000);
      totalDeductions += calculatedStandardDeduction;
    }
    totalDeductions += Math.min(deductions.otherDeductions.professionalTax || 0, 2500); // Max Rs. 2,500

    // Chapter VI-A Deductions
    const section80CLimit = 150000;
    const section80CActual = (deductions.chapterVIA.section80C || 0) +
                             (deductions.chapterVIA.section80CCC || 0) +
                             (deductions.chapterVIA.section80CCD1 || 0);
    totalDeductions += Math.min(section80CActual, section80CLimit);
    totalDeductions += Math.min(deductions.chapterVIA.section80CCD1B || 0, 50000); // Additional NPS
    // Add other Chapter VI-A deductions with their respective limits
    totalDeductions += deductions.chapterVIA.section80D || 0; // Needs more logic for age based limits
    totalDeductions += deductions.chapterVIA.section80TTA || 0; // Max 10k for non-seniors
    if (isSeniorCitizen) {
      totalDeductions += Math.min(deductions.chapterVIA.section80TTB || 0, 50000);
    }
     // Home Loan Interest on self-occupied property (Sec 24(b)) - part of housePropertyIncome calculation usually
     // but if provided separately as deduction under otherDeductions.homeLoanInterest for old regime
    totalDeductions += Math.min(deductions.otherDeductions.homeLoanInterest || 0, 200000);


  } else { // New Regime (FY 2024-25 / AY 2025-26)
    // Standard Deduction is available in the new regime from FY 2023-24
    if (incomeSources.salary > 0) {
      calculatedStandardDeduction = Math.min(incomeSources.salary, 50000);
      totalDeductions += calculatedStandardDeduction;
    }
    // Employer's contribution to NPS (Sec 80CCD(2)) is allowed
    totalDeductions += deductions.chapterVIA.section80CCD2 || 0;
    // Deduction for family pension (Sec 57(iia)) - 1/3rd of pension or 15,000, whichever is less.
    // This would typically be part of 'otherSourcesIncome' calculation.
  }

  // 3. Calculate Net Taxable Income (NTI)
  const netTaxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

  // 4. Calculate Tax on NTI (excluding special rate incomes)
  let incomeTaxOnNormalIncome = 0;
  
  // Calculate taxes on special rate incomes first
  const stcg111A_Income = incomeSources.capitalGains?.stcg111A || 0;
  const taxOnSTCG111A = stcg111A_Income * 0.15;

  const ltcg112A_Equity_Income = incomeSources.capitalGains?.ltcg112A_Equity || 0;
  const taxableLTCG112A = Math.max(0, ltcg112A_Equity_Income - 100000); // Exemption of 1 Lakh
  const taxOnLTCG112A = taxableLTCG112A * 0.10;

  const ltcg112_Income = incomeSources.capitalGains?.ltcg112 || 0;
  // TODO: Indexation for LTCG 112 needs to be applied before this step if input is sale consideration & cost.
  // Assuming ltcg112_Income is the indexed gain.
  const taxOnLTCG112 = ltcg112_Income * 0.20;
  
  // Income to be taxed at normal slab rates
  // NTI - (STCG 111A + LTCG 112A (full amount before exemption) + LTCG 112)
  // stcgNormalRate is already part of normal income.
  let remainingNti = netTaxableIncome - stcg111A_Income - ltcg112A_Equity_Income - ltcg112_Income;
  remainingNti = Math.max(0, remainingNti); // Ensure it's not negative

  const slabs = taxRegime === 'new' ? newRegimeSlabs_FY2024_25 : oldRegimeSlabs_Individual_FY2024_25;
  // TODO: Adjust slabs for senior and super senior citizens in old regime
  // For old regime:
  // Senior Citizen (60-80 yrs): Basic exemption Rs. 3,00,000
  // Super Senior Citizen (>80 yrs): Basic exemption Rs. 5,00,000

  let slabBasedTax = 0;
  let previousLimit = 0;
  for (const slab of slabs) {
    if (remainingNti > previousLimit) {
      const taxableInSlab = Math.min(remainingNti, slab.limit) - previousLimit;
      slabBasedTax += taxableInSlab * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }
  incomeTaxOnNormalIncome = slabBasedTax;

  let taxBeforeCess = incomeTaxOnNormalIncome + taxOnSTCG111A + taxOnLTCG112A + taxOnLTCG112;
  // Note: taxOnLTCG112 is added here. Other special rates (e.g. ltcgOther) would also be added.

  // 5. Rebate under Section 87A
  // Rebate is on total tax liability before cess, but NTI should not exceed the threshold.
  // The rebate calculation should consider if the NTI (after all deductions) is within the limit.
  let relief87A = 0;
  if (taxRegime === 'new' && netTaxableIncome <= 700000) {
    relief87A = Math.min(taxBeforeCess, 25000); // Max rebate is 25k if NTI <= 7L
  } else if (taxRegime === 'old' && netTaxableIncome <= 500000) {
    relief87A = Math.min(taxBeforeCess, 12500); // Max rebate is 12.5k if NTI <= 5L
  }
  taxBeforeCess = Math.max(0, taxBeforeCess - relief87A);

  // 6. Surcharge (simplified)
  let surcharge = 0;
  if (netTaxableIncome > 5000000 && netTaxableIncome <= 10000000) { // 50 Lakh to 1 Cr
    surcharge = taxBeforeCess * 0.10;
  } else if (netTaxableIncome > 10000000 && netTaxableIncome <= 20000000) { // 1 Cr to 2 Cr
    surcharge = taxBeforeCess * 0.15;
  } else if (netTaxableIncome > 20000000 && netTaxableIncome <= 50000000) { // 2 Cr to 5 Cr
    surcharge = taxBeforeCess * 0.25;
  } else if (netTaxableIncome > 50000000) { // Above 5 Cr
    surcharge = taxBeforeCess * 0.37;
  }
  // Note: Surcharge rates on STCG (111A) and LTCG (112A) are capped at 15% if applicable. This needs more detailed handling.
  
  taxBeforeCess += surcharge;

  // 7. Health and Education Cess
  const healthAndEducationCess = taxBeforeCess * 0.04;

  // 8. Total Tax Liability
  const totalTaxLiability = taxBeforeCess + healthAndEducationCess;

  return {
    grossTotalIncome,
    totalDeductions,
    netTaxableIncome,
    taxBeforeCess: taxBeforeCess, // This is tax after surcharge but before cess in this context
    healthAndEducationCess,
    totalTaxLiability: Math.round(totalTaxLiability), // Round to nearest rupee
    relief87A: relief87A > 0 ? relief87A : undefined,
    surcharge: surcharge > 0 ? surcharge : undefined,
    message: `Tax calculated for AY ${personalDetails.assessmentYear} under ${taxRegime} regime. This is a simplified calculation.`,
    breakdown: { 
      incomeTax: {
        slabBasedTax: Math.round(incomeTaxOnNormalIncome),
        stcg111aTax: Math.round(taxOnSTCG111A),
        ltcg112aTax: Math.round(taxOnLTCG112A),
        ltcg112Tax: Math.round(taxOnLTCG112),
      },
      // capitalGainsTax: could be a sum or more detailed object later
    }
  };
};

router.post('/tax', /* authenticateToken, */ (req: Request, res: Response) => {
  try {
    const validatedData = TaxCalculationInputSchema.parse(req.body);
    const result = calculateTaxLiability(validatedData);
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
