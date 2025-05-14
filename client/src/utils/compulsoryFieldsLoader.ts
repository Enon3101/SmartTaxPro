import compulsoryFieldsData from '../data/compulsoryFields.json';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface ShowWhenCondition {
  field: string;
  equals: string[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: FieldOption[];
  validation?: FieldValidation;
  showWhen?: ShowWhenCondition;
}

export interface IncomeSourceFields {
  fields: FormField[];
  description: string;
}

/**
 * Get the compulsory fields for a specific income source
 * @param sourceCode The income source code
 * @returns The fields for the income source or null if not found
 */
export function getCompulsoryFields(sourceCode: string): IncomeSourceFields | null {
  return compulsoryFieldsData[sourceCode as keyof typeof compulsoryFieldsData] || null;
}

/**
 * Get all compulsory fields for multiple income sources
 * @param sourceCodes Array of income source codes
 * @returns Object with income source codes as keys and their fields as values
 */
export function getAllCompulsoryFields(sourceCodes: string[]): Record<string, IncomeSourceFields> {
  const result: Record<string, IncomeSourceFields> = {};
  
  sourceCodes.forEach(code => {
    const fields = getCompulsoryFields(code);
    if (fields) {
      result[code] = fields;
    }
  });
  
  return result;
}

export default {
  getCompulsoryFields,
  getAllCompulsoryFields
};