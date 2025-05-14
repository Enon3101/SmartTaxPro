/**
 * Type declarations for itrSelector.js
 */

declare module '@/utils/itrSelector' {
  /**
   * Determines the appropriate ITR form based on selected income sources
   * @param sources - Array of income source codes
   * @returns The appropriate ITR form code
   */
  export function determineITRForm(sources?: string[]): string;

  /**
   * Get description text for an ITR form
   * @param itrForm - The ITR form code
   * @returns Description of the ITR form
   */
  export function getITRDescription(itrForm: string): string;

  const itrSelector: {
    determineITRForm: typeof determineITRForm;
    getITRDescription: typeof getITRDescription;
  };

  export default itrSelector;
}