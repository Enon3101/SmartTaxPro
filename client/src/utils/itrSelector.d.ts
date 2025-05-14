declare module '../utils/itrSelector' {
  /**
   * Get the description of an ITR form
   * @param itrForm ITR form code (e.g., 'ITR-1', 'ITR-2', etc.)
   * @returns Description of the ITR form
   */
  export function getITRDescription(itrForm: string): string;
  
  /**
   * Determine which ITR form is applicable based on income sources
   * @param incomeSources Array of income source codes
   * @returns The applicable ITR form code
   */
  export function determineITRForm(incomeSources: string[]): string;
  
  /**
   * Check if an ITR form is applicable for specified income sources
   * @param itrForm ITR form code
   * @param incomeSources Array of income source codes
   * @returns Whether the ITR form is applicable
   */
  export function isApplicable(itrForm: string, incomeSources: string[]): boolean;
}