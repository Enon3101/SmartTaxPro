/**
 * ITR Form Selector Utility
 * 
 * This utility helps determine the appropriate ITR form based on a taxpayer's
 * income sources according to Indian Income Tax rules.
 */

// Default ITR form if none can be determined
const DEFAULT_ITR = "ITR-1";

// Form Rules based on Income Source Codes
// S: Salary, H: House Property, G: Capital Gains, B: Business, P: Presumptive Business, I: Interest
const formRules = {
  "ITR-1": {
    eligibleSources: ["S", "H", "I"],
    restrictions: {
      maxSources: 3,
      disallowedCombinations: [["H", "I"], ["H", "G"]],
      maxIncome: 5000000, // 50 lakhs
      allowedForIndividualsOnly: true,
      foreignIncome: false,
      agriculturalIncome: 5000, // Up to ₹5,000
      allowLoss: false,
      allowMoreThanOneHouseProperty: false
    }
  },
  "ITR-2": {
    eligibleSources: ["S", "H", "G", "I"],
    restrictions: {
      disallowedSources: ["B", "P"],
      allowedForIndividualsAndHUF: true,
      foreignIncome: true,
      agriculturalIncome: true,
      allowLoss: true,
      allowMoreThanOneHouseProperty: true
    }
  },
  "ITR-3": {
    eligibleSources: ["S", "H", "G", "B", "I"],
    restrictions: {
      disallowedSources: [],
      allowedForIndividualsAndHUF: true,
      foreignIncome: true,
      agriculturalIncome: true,
      allowLoss: true,
      allowMoreThanOneHouseProperty: true,
      presumptiveBusiness: false
    }
  },
  "ITR-4": {
    eligibleSources: ["S", "H", "P", "I"],
    restrictions: {
      disallowedSources: ["G", "B"],
      maxIncome: 5000000, // 50 lakhs
      allowedForIndividualsAndHUF: true,
      foreignIncome: false,
      allowLoss: false,
      allowMoreThanOneHouseProperty: false,
      presumptiveBusiness: true
    }
  }
};

/**
 * Determines the appropriate ITR form based on selected income sources
 * @param {Array} sources - Array of income source codes
 * @returns {String} The appropriate ITR form code
 */
export function determineITRForm(sources = []) {
  if (!sources || sources.length === 0) {
    return DEFAULT_ITR;
  }
  
  // Business Income (not presumptive) requires ITR-3
  if (sources.includes("B")) {
    return "ITR-3";
  }
  
  // Capital Gains requires at least ITR-2
  if (sources.includes("G")) {
    return "ITR-2";
  }
  
  // Presumptive Business Income requires ITR-4 if no other complex sources
  if (sources.includes("P") && !sources.includes("G") && !sources.includes("B")) {
    return "ITR-4";
  }
  
  // Simple income sources (Salary, one House Property, Other Income)
  // can use ITR-1 if no other complexities
  const simpleSources = ["S", "H", "I"];
  const hasOnlySimpleSources = sources.every(source => simpleSources.includes(source));
  
  if (hasOnlySimpleSources) {
    return "ITR-1";
  }
  
  // Default to a more comprehensive form if unsure
  return "ITR-2";
}

/**
 * Get description text for an ITR form
 * @param {String} itrForm - The ITR form code
 * @returns {String} Description of the ITR form
 */
export function getITRDescription(itrForm) {
  const descriptions = {
    "ITR-1": "For individuals with income from salary, one house property, and other sources (interest, etc.) with total income up to ₹50 lakhs.",
    "ITR-2": "For individuals and HUFs with income from salary, house property, capital gains, and other sources, but not from business or profession.",
    "ITR-3": "For individuals and HUFs having income from business or profession, along with salary, house property, capital gains, etc.",
    "ITR-4": "For individuals, HUFs, and firms with presumptive income from business or profession with total income up to ₹50 lakhs."
  };
  
  return descriptions[itrForm] || "Please select income sources to determine the correct ITR form.";
}

export default {
  determineITRForm,
  getITRDescription
};