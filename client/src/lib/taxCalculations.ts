interface TaxSummary {
  totalIncome: number;
  adjustments: number;
  standardDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  taxCredits: number;
  taxPaid: number;
  estimatedRefund: number;
}

// Standard deduction for 2023
const STANDARD_DEDUCTION = 13850;

export function calculateTaxSummary(incomeData: any): TaxSummary {
  // Parse and calculate total income from W-2 forms
  const w2Income = incomeData?.w2Forms?.reduce((sum: number, form: any) => {
    const wages = parseFloat(form.wages.replace(/,/g, "")) || 0;
    return sum + wages;
  }, 0) || 0;

  // Parse and calculate additional income
  const additionalIncome = incomeData?.additionalIncome || {};
  const dividendIncome = parseFloat(additionalIncome.dividendIncome?.replace(/,/g, "")) || 0;
  const interestIncome = parseFloat(additionalIncome.interestIncome?.replace(/,/g, "")) || 0;
  const capitalGainsIncome = parseFloat(additionalIncome.capitalGainsIncome?.replace(/,/g, "")) || 0;
  const capitalLosses = parseFloat(additionalIncome.capitalLosses?.replace(/,/g, "")) || 0;

  // Calculate total income
  const totalIncome = w2Income + dividendIncome + interestIncome + capitalGainsIncome - capitalLosses;

  // Adjustments would typically come from deductions like student loan interest,
  // IRA contributions, etc. For now, we'll set it to 0
  const adjustments = 0;

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - adjustments - STANDARD_DEDUCTION);

  // Calculate estimated tax (simplified tax brackets for 2023)
  let estimatedTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 11000) {
      estimatedTax = taxableIncome * 0.10;
    } else if (taxableIncome <= 44725) {
      estimatedTax = 1100 + (taxableIncome - 11000) * 0.12;
    } else if (taxableIncome <= 95375) {
      estimatedTax = 5147 + (taxableIncome - 44725) * 0.22;
    } else if (taxableIncome <= 182100) {
      estimatedTax = 16290 + (taxableIncome - 95375) * 0.24;
    } else if (taxableIncome <= 231250) {
      estimatedTax = 37104 + (taxableIncome - 182100) * 0.32;
    } else if (taxableIncome <= 578125) {
      estimatedTax = 52832 + (taxableIncome - 231250) * 0.35;
    } else {
      estimatedTax = 174238.25 + (taxableIncome - 578125) * 0.37;
    }
  }

  // Tax credits (0 for now, would come from child tax credit, education credits, etc.)
  const taxCredits = 0;

  // Calculate tax already paid from W-2 withholding
  const taxPaid = incomeData?.w2Forms?.reduce((sum: number, form: any) => {
    const fedTax = parseFloat(form.federalTaxWithheld.replace(/,/g, "")) || 0;
    return sum + fedTax;
  }, 0) || 0;

  // Calculate estimated refund
  const estimatedRefund = Math.max(0, taxPaid + taxCredits - estimatedTax);

  return {
    totalIncome,
    adjustments,
    standardDeduction: STANDARD_DEDUCTION,
    taxableIncome,
    estimatedTax,
    taxCredits,
    taxPaid,
    estimatedRefund,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
