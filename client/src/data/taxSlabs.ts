/**
 * Indian Income Tax Slabs for different regimes and assessment years
 */

export interface TaxSlab {
  incomeFrom: number;
  incomeTo: number | null; // null represents no upper limit
  taxRate: number; // in percent
  description?: string;
}

export interface TaxRegime {
  name: string;
  description: string;
  applicableFrom: string;
  isDefault: boolean;
  slabs: TaxSlab[];
  surcharge?: {
    [key: string]: number; // Income threshold as key, surcharge percentage as value
  };
  cess: number; // health and education cess in percent
  deductions: string[]; // list of allowed deduction sections
}

export interface TaxSlabsYear {
  assessmentYear: string;
  regimes: TaxRegime[];
}

// Income Tax Slabs for Assessment Year 2024-25 (Financial Year 2023-24)
export const taxSlabs2024_25: TaxSlabsYear = {
  assessmentYear: "2024-25",
  regimes: [
    {
      name: "New Tax Regime",
      description: "Default tax regime with lower rates but no deductions/exemptions",
      applicableFrom: "FY 2023-24",
      isDefault: true,
      slabs: [
        { incomeFrom: 0, incomeTo: 300000, taxRate: 0, description: "Nil tax up to ₹3 lakh" },
        { incomeFrom: 300000, incomeTo: 600000, taxRate: 5, description: "5% tax between ₹3-6 lakh" },
        { incomeFrom: 600000, incomeTo: 900000, taxRate: 10, description: "10% tax between ₹6-9 lakh" },
        { incomeFrom: 900000, incomeTo: 1200000, taxRate: 15, description: "15% tax between ₹9-12 lakh" },
        { incomeFrom: 1200000, incomeTo: 1500000, taxRate: 20, description: "20% tax between ₹12-15 lakh" },
        { incomeFrom: 1500000, incomeTo: null, taxRate: 30, description: "30% tax above ₹15 lakh" }
      ],
      surcharge: {
        "5000000": 10, // 10% surcharge for income above 50 lakhs
        "10000000": 15, // 15% surcharge for income above 1 crore
        "20000000": 25, // 25% surcharge for income above 2 crore
        "50000000": 37  // 37% surcharge for income above 5 crore
      },
      cess: 4,
      deductions: ["Basic Standard Deduction on salary income"]
    },
    {
      name: "Old Tax Regime",
      description: "Higher tax rates but allows claiming various deductions and exemptions",
      applicableFrom: "Before FY 2023-24",
      isDefault: false,
      slabs: [
        { incomeFrom: 0, incomeTo: 250000, taxRate: 0, description: "Nil tax up to ₹2.5 lakh" },
        { incomeFrom: 250000, incomeTo: 500000, taxRate: 5, description: "5% tax between ₹2.5-5 lakh" },
        { incomeFrom: 500000, incomeTo: 1000000, taxRate: 20, description: "20% tax between ₹5-10 lakh" },
        { incomeFrom: 1000000, incomeTo: null, taxRate: 30, description: "30% tax above ₹10 lakh" }
      ],
      surcharge: {
        "5000000": 10, // 10% surcharge for income above 50 lakhs
        "10000000": 15, // 15% surcharge for income above 1 crore
        "20000000": 25, // 25% surcharge for income above 2 crore
        "50000000": 37  // 37% surcharge for income above 5 crore
      },
      cess: 4,
      deductions: [
        "Section 80C (up to ₹1.5 lakh)",
        "Section 80CCC (Pension plans)",
        "Section 80CCD (NPS contribution)",
        "Section 80D (Health Insurance)",
        "Section 80DD (Medical treatment of dependent with disability)",
        "Section 80DDB (Medical treatment for specified diseases)",
        "Section 80E (Interest on education loan)",
        "Section 80EE/EEA (Interest on home loan)",
        "Section 80G (Donations)",
        "Section 80GG (Rent paid)",
        "Section 80TTA (Interest on savings account)",
        "HRA Exemption",
        "LTA Exemption",
        "Standard Deduction on salary"
      ]
    }
  ]
};

// Income Tax Slabs for Assessment Year 2025-26 (Financial Year 2024-25)
export const taxSlabs2025_26: TaxSlabsYear = {
  assessmentYear: "2025-26",
  regimes: [
    {
      name: "New Tax Regime",
      description: "Default tax regime with lower rates but no deductions/exemptions",
      applicableFrom: "FY 2024-25",
      isDefault: true,
      slabs: [
        { incomeFrom: 0, incomeTo: 300000, taxRate: 0, description: "Nil tax up to ₹3 lakh" },
        { incomeFrom: 300000, incomeTo: 700000, taxRate: 5, description: "5% tax between ₹3-7 lakh" },
        { incomeFrom: 700000, incomeTo: 1000000, taxRate: 10, description: "10% tax between ₹7-10 lakh" },
        { incomeFrom: 1000000, incomeTo: 1200000, taxRate: 15, description: "15% tax between ₹10-12 lakh" },
        { incomeFrom: 1200000, incomeTo: 1500000, taxRate: 20, description: "20% tax between ₹12-15 lakh" },
        { incomeFrom: 1500000, incomeTo: null, taxRate: 30, description: "30% tax above ₹15 lakh" }
      ],
      surcharge: {
        "5000000": 10, // 10% surcharge for income above 50 lakhs
        "10000000": 15, // 15% surcharge for income above 1 crore
        "20000000": 25, // 25% surcharge for income above 2 crore
        "50000000": 37 // 37% surcharge for income above 5 crore
      },
      cess: 4,
      deductions: ["Basic Standard Deduction on salary income"]
    },
    {
      name: "Old Tax Regime",
      description: "Higher tax rates but allows claiming various deductions and exemptions",
      applicableFrom: "FY 2024-25",
      isDefault: false,
      slabs: [
        { incomeFrom: 0, incomeTo: 250000, taxRate: 0, description: "Nil tax up to ₹2.5 lakh" },
        { incomeFrom: 250000, incomeTo: 500000, taxRate: 5, description: "5% tax between ₹2.5-5 lakh" },
        { incomeFrom: 500000, incomeTo: 1000000, taxRate: 20, description: "20% tax between ₹5-10 lakh" },
        { incomeFrom: 1000000, incomeTo: null, taxRate: 30, description: "30% tax above ₹10 lakh" }
      ],
      surcharge: {
        "5000000": 10, // 10% surcharge for income above 50 lakhs
        "10000000": 15, // 15% surcharge for income above 1 crore
        "20000000": 25, // 25% surcharge for income above 2 crore
        "50000000": 37  // 37% surcharge for income above 5 crore
      },
      cess: 4,
      deductions: [
        "Section 80C (up to ₹1.5 lakh)",
        "Section 80CCC (Pension plans)",
        "Section 80CCD (NPS contribution)",
        "Section 80D (Health Insurance)",
        "Section 80DD (Medical treatment of dependent with disability)",
        "Section 80DDB (Medical treatment for specified diseases)",
        "Section 80E (Interest on education loan)",
        "Section 80EE/EEA (Interest on home loan)",
        "Section 80G (Donations)",
        "Section 80GG (Rent paid)",
        "Section 80TTA (Interest on savings account)",
        "HRA Exemption",
        "LTA Exemption",
        "Standard Deduction on salary"
      ]
    }
  ]
};

// For senior citizens (60+ years) in old tax regime
export const seniorCitizenSlabs: TaxSlab[] = [
  { incomeFrom: 0, incomeTo: 300000, taxRate: 0, description: "Nil tax up to ₹3 lakh" },
  { incomeFrom: 300000, incomeTo: 500000, taxRate: 5, description: "5% tax between ₹3-5 lakh" },
  { incomeFrom: 500000, incomeTo: 1000000, taxRate: 20, description: "20% tax between ₹5-10 lakh" },
  { incomeFrom: 1000000, incomeTo: null, taxRate: 30, description: "30% tax above ₹10 lakh" }
];

// For super senior citizens (80+ years) in old tax regime
export const superSeniorCitizenSlabs: TaxSlab[] = [
  { incomeFrom: 0, incomeTo: 500000, taxRate: 0, description: "Nil tax up to ₹5 lakh" },
  { incomeFrom: 500000, incomeTo: 1000000, taxRate: 20, description: "20% tax between ₹5-10 lakh" },
  { incomeFrom: 1000000, incomeTo: null, taxRate: 30, description: "30% tax above ₹10 lakh" }
];

// Get current tax slabs based on assessment year
export function getTaxSlabsByYear(assessmentYear: string): TaxSlabsYear {
  if (assessmentYear === "2025-26") {
    return taxSlabs2025_26;
  }
  return taxSlabs2024_25; // default
}

// Calculate tax for a given income in a specific regime
export function calculateTax(income: number, regime: TaxRegime, isResident: boolean = true, age: number = 30): {
  taxAmount: number;
  effectiveTaxRate: number;
  breakup: Array<{slab: TaxSlab, tax: number}>;
  surchargeAmount: number;
  cessAmount: number;
  totalTax: number;
} {
  // Use appropriate slabs based on age (only for old regime)
  let slabs = regime.slabs;
  
  if (regime.name === "Old Tax Regime" && isResident) {
    if (age >= 80) {
      slabs = superSeniorCitizenSlabs;
    } else if (age >= 60) {
      slabs = seniorCitizenSlabs;
    }
  }
  
  // Calculate tax slab-wise
  let taxAmount = 0;
  const breakup: Array<{slab: TaxSlab, tax: number}> = [];
  
  for (const slab of slabs) {
    if (income > slab.incomeFrom) {
      const slabTo = slab.incomeTo || Infinity;
      const taxableInSlab = Math.min(income, slabTo) - slab.incomeFrom;
      const slabTax = (taxableInSlab * slab.taxRate) / 100;
      
      if (slabTax > 0) {
        taxAmount += slabTax;
        breakup.push({
          slab,
          tax: slabTax
        });
      }
    }
  }
  
  // Calculate surcharge if applicable
  let surchargeAmount = 0;
  let surchargeRate = 0;
  
  if (regime.surcharge) {
    // Convert object keys to numbers and sort in descending order
    const thresholds = Object.keys(regime.surcharge)
      .map(key => Number(key))
      .sort((a, b) => b - a);
    
    // Find the applicable surcharge rate
    for (const threshold of thresholds) {
      if (income >= threshold) {
        surchargeRate = regime.surcharge[threshold.toString()];
        surchargeAmount = (taxAmount * surchargeRate) / 100;
        break;
      }
    }
  }
  
  // Calculate health and education cess
  const cessAmount = ((taxAmount + surchargeAmount) * regime.cess) / 100;
  
  // Calculate total tax
  const totalTax = taxAmount + surchargeAmount + cessAmount;
  
  // Calculate effective tax rate
  const effectiveTaxRate = (totalTax / income) * 100;
  
  return {
    taxAmount,
    effectiveTaxRate,
    breakup,
    surchargeAmount,
    cessAmount,
    totalTax
  };
}