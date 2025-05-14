import formRules from '../data/formRules.json';

/**
 * Determines the appropriate ITR form based on selected income sources
 * @param {string[]} sources - Array of income source codes
 * @returns {string} The appropriate ITR form code
 */
export function determineITRForm(sources = []) {
  if (!sources || sources.length === 0) {
    return null;
  }

  // Sort by form complexity (ITR-1 is simplest, ITR-3 most complex)
  const sortedRules = [...formRules.rules].sort((a, b) => {
    // ITR-1 should come first (simplest), then ITR-4, ITR-2, ITR-3
    const formOrder = { 'ITR-1': 1, 'ITR-4': 2, 'ITR-2': 3, 'ITR-3': 4 };
    return formOrder[a.form] - formOrder[b.form];
  });

  // Check each form rule to find the first matching one
  for (const rule of sortedRules) {
    const { conditions } = rule;
    
    // Check if all selected sources are allowed in this form
    const allSourcesAllowed = sources.every(source => 
      conditions.allowedSources.includes(source)
    );
    
    // Check if any disallowed sources are selected
    const hasDisallowedSources = sources.some(source => 
      conditions.disallowedSources.includes(source)
    );

    // Special cases handling
    const hasCapitalGains = sources.includes('capital_gains');
    const hasBusiness = sources.includes('business');

    // If this form allows all selected sources and has no disallowed sources
    if (allSourcesAllowed && !hasDisallowedSources) {
      // Special case for ITR-1 vs ITR-2 (capital gains check)
      if (rule.form === 'ITR-1' && hasCapitalGains) {
        continue; // Skip to next form
      }
      
      // Special case for ITR-4 - can only be used with presumptive income
      // This is a simplified check - in a real app, we'd check if the business actually uses presumptive taxation
      if (rule.form === 'ITR-4' && hasBusiness) {
        // For now, we'll use ITR-3 for business income as a safer default
        // In a real implementation, this would check if the business qualifies for presumptive taxation
        continue;
      }
      
      return rule.form;
    }
  }

  // Default to most complex form if no rules match
  return 'ITR-3';
}

/**
 * Get description text for an ITR form
 * @param {string} itrForm - The ITR form code
 * @returns {string} Description of the ITR form
 */
export function getITRDescription(itrForm) {
  if (!itrForm) return '';
  
  const rule = formRules.rules.find(rule => rule.form === itrForm);
  return rule ? rule.description : '';
}

export default {
  determineITRForm,
  getITRDescription
};