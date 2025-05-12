import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Plus, MinusCircle } from 'lucide-react';

interface SectionExemption {
  type: string;
  amount: string;
}

interface SalaryEntry {
  id: string;
  employerName: string;
  grossSalary: string;
  standardDeduction: string;
  section10Exemptions: string;
  section10ExemptionsList: SectionExemption[];
  professionalTax: string;
  tdsDeducted: string;
  netSalary: string;
}

interface SalarySectionProps {
  salaryIncome: SalaryEntry[];
  updateIncomeField: (sourceType: string, index: number, field: string, value: any) => void;
  addIncomeEntry: (sourceType: string) => void;
  removeIncomeEntry: (sourceType: string, index: number) => void;
}

const SalarySection: React.FC<SalarySectionProps> = ({ 
  salaryIncome, 
  updateIncomeField, 
  addIncomeEntry, 
  removeIncomeEntry 
}) => {
  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Salary Income</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => addIncomeEntry("salaryIncome")}
          className="text-xs flex items-center"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Another Employer
        </Button>
      </div>
      
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p>This is the new horizontal salary layout with multiple exemptions support.</p>
        <p>Number of salary entries: {salaryIncome.length}</p>
      </div>
    </div>
  );
};

export default SalarySection;