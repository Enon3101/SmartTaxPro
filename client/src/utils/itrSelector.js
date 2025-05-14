import formRules from "../data/formRules.json";

/**
 * Determines the appropriate ITR form based on selected income sources
 * @param {Array<string>} sourceCodes - Array of income source codes (e.g. ["S", "H"])
 * @returns {string} The appropriate ITR form (e.g. "ITR-1")
 */
export function pickITR(sourceCodes) {
  if (!sourceCodes || sourceCodes.length === 0) {
    return null;
  }
  
  // Sort codes to ensure consistent key regardless of selection order
  const key = sourceCodes.sort().join("");
  
  // If we have a direct match in our rules, return it
  if (formRules[key]) {
    return formRules[key].itr;
  }
  
  // Apply fallback logic for combinations not explicitly defined
  
  // If there are more than 3 income sources, default to ITR-2
  if (sourceCodes.length >= 3) {
    return "ITR-2";
  }
  
  // If there's business income with books audited, go with ITR-3
  if (sourceCodes.includes("B")) {
    return "ITR-3";
  }
  
  // If there's presumptive business income, go with ITR-4
  if (sourceCodes.includes("P")) {
    return "ITR-4";
  }
  
  // If there's capital gains, go with ITR-2
  if (sourceCodes.includes("G")) {
    return "ITR-2";
  }
  
  // For any other combination, default to ITR-2 as a safe choice
  return "ITR-2";
}

/**
 * Gets the description of what the form is for
 * @param {string} itrForm - The ITR form (e.g. "ITR-1")
 * @returns {string} Description of the form
 */
export function getITRDescription(itrForm) {
  switch (itrForm) {
    case "ITR-1":
      return "For individuals with income from salary, one house property, and other sources (interest, etc.)";
    case "ITR-2":
      return "For individuals and HUFs with income from salary, house property, capital gains, and other sources";
    case "ITR-3":
      return "For individuals and HUFs having income from business or profession";
    case "ITR-4":
      return "For presumptive income from business or profession (Section 44AD, 44ADA, 44AE)";
    case "ITR-5":
      return "For firms, LLPs, AOPs, BOIs, artificial juridical person, and cooperative societies";
    case "ITR-6":
      return "For Companies other than those claiming exemption under section 11";
    case "ITR-7":
      return "For persons including companies required to furnish return under Section 139(4A) or Section 139(4B) or Section 139(4C) or Section 139(4D) or Section 139(4E) or Section 139(4F)";
    default:
      return "Income Tax Return Form";
  }
}

/**
 * Gets the list of required fields based on income sources
 * @param {Array<string>} sourceCodes - Array of income source codes (e.g. ["S", "H"])
 * @returns {Array<string>} List of required fields
 */
export function getRequiredFields(sourceCodes) {
  if (!sourceCodes || sourceCodes.length === 0) {
    return [];
  }
  
  // Get unique field requirements across all selected sources
  const requirementSets = sourceCodes.map(code => {
    if (formRules[code]) {
      return formRules[code].schedules || [];
    }
    return [];
  });
  
  // Flatten and deduplicate
  return [...new Set(requirementSets.flat())];
}