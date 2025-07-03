import { X, Plus, MinusCircle } from 'lucide-react';
import React from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatIndianCurrency } from "@/lib/formatters";

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
  netSalary: string;
}

interface SalarySectionProps {
  salaryIncome: SalaryEntry[];
  updateIncomeField: (sourceType: string, index: number, field: string, value: any) => void;
  addIncomeEntry: (sourceType: string) => void;
  removeIncomeEntry: (sourceType: string, index: number) => void;
}

// Format currency input with Indian numbering system (lakhs, crores)
const formatCurrency = (value: string | null | undefined) => {
  // Handle null/undefined/empty values
  if (!value) return "";
  
  // Extract just the digits
  const numericValue = value.replace(/[^\d]/g, "");
  if (!numericValue) return "";
  
  try {
    // First group: last 3 digits (thousands)
    // Following groups: 2 digits each (lakhs, crores)
    // Format example: 1,23,45,678
    if (numericValue.length <= 3) {
      return numericValue;
    }
    
    const lastThree = numericValue.substring(numericValue.length - 3);
    const remainingDigits = numericValue.substring(0, numericValue.length - 3);
    const formatted = remainingDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    
    return formatted;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return numericValue; // Return unformatted but valid value in case of error
  }
};

const SalarySection: React.FC<SalarySectionProps> = ({ 
  salaryIncome, 
  updateIncomeField, 
  addIncomeEntry, 
  removeIncomeEntry 
}) => {
  // Calculate total salary income
  const calculateTotalNetSalary = () => {
    return salaryIncome.reduce((total, salary) => {
      const netSalary = parseFloat((salary.netSalary || "0").replace(/,/g, "")) || 0;
      return total + netSalary;
    }, 0);
  };

  const totalNetSalary = formatCurrency(calculateTotalNetSalary().toString());

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          Salary Income
        </h3>
        
        {/* Add another salary source button */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Total Net Salary: <span className="text-primary">₹ {totalNetSalary}</span>
          </div>
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
      </div>
      
      {/* For each salary entry, show a set of fields */}
      {salaryIncome.map((salary, index) => (
        <div key={salary.id} className="mb-6 last:mb-0 border-t pt-4 first:border-t-0 first:pt-0">
          {/* Show income number and delete button if there are multiple */}
          {salaryIncome.length > 1 && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                Employer #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIncomeEntry("salaryIncome", index)}
                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                disabled={salaryIncome.length <= 1}
              >
                <MinusCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          
          {/* Single-line salary entry layout */}
          <div className="space-y-4">
            {/* Employer Name */}
            <div className="space-y-2">
              <Label htmlFor={`employerName-${index}`}>Employer Name</Label>
              <Input
                id={`employerName-${index}`}
                value={salary.employerName}
                onChange={(e) => updateIncomeField("salaryIncome", index, "employerName", e.target.value)}
              />
            </div>
            
            {/* Salary details in single-line format with headings in first column */}
            <div className="space-y-3 border rounded-md p-4">
              {/* Row 1: Gross Salary */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 font-medium">1. Gross Salary</div>
                <div className="col-span-8 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id={`grossSalary-${index}`}
                    className="pl-7"
                    value={salary.grossSalary}
                    onChange={(e) => {
                      // Store the original cursor position
                      const cursorPosition = e.target.selectionStart;
                      
                      // Format the value
                      const value = formatCurrency(e.target.value);
                      updateIncomeField("salaryIncome", index, "grossSalary", value);
                      
                      // Calculate net salary
                      const gross = parseFloat((value || "0").replace(/,/g, '')) || 0;
                      const stdDeduction = parseFloat((salary.standardDeduction || "0").replace(/,/g, '')) || 0;
                      const section10 = parseFloat((salary.section10Exemptions || "0").replace(/,/g, '')) || 0;
                      const profTax = parseFloat((salary.professionalTax || "0").replace(/,/g, '')) || 0;
                      const netSalary = Math.max(0, gross - stdDeduction - section10 - profTax);
                      updateIncomeField("salaryIncome", index, "netSalary", formatCurrency(netSalary.toString()));
                      
                      // Set cursor position in the next render cycle
                      setTimeout(() => {
                        if (e.target && typeof cursorPosition === 'number') {
                          e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }
                      }, 0);
                    }}
                  />
                </div>
              </div>
              
              {/* Row 2: Standard Deduction */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 font-medium">
                  2. Standard Deduction <span className="text-xs text-gray-500">(Sec 16(ia))</span>
                </div>
                <div className="col-span-8 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id={`standardDeduction-${index}`}
                    className="pl-7"
                    value={salary.standardDeduction}
                    onChange={(e) => {
                      // Store the original cursor position
                      const cursorPosition = e.target.selectionStart;
                      
                      // Format the value
                      const value = formatCurrency(e.target.value);
                      updateIncomeField("salaryIncome", index, "standardDeduction", value);
                      
                      // Calculate net salary
                      const gross = parseFloat((salary.grossSalary || "0").replace(/,/g, '')) || 0;
                      const stdDeduction = parseFloat((value || "0").replace(/,/g, '')) || 0;
                      const section10 = parseFloat((salary.section10Exemptions || "0").replace(/,/g, '')) || 0;
                      const profTax = parseFloat((salary.professionalTax || "0").replace(/,/g, '')) || 0;
                      const netSalary = Math.max(0, gross - stdDeduction - section10 - profTax);
                      updateIncomeField("salaryIncome", index, "netSalary", formatCurrency(netSalary.toString()));
                      
                      // Set cursor position in the next render cycle
                      setTimeout(() => {
                        if (e.target && typeof cursorPosition === 'number') {
                          e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }
                      }, 0);
                    }}
                  />
                </div>
              </div>
              
              {/* Row 3: Section 10 Exemptions with multiple entries */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 font-medium mt-2">3. Section 10 Exemptions</div>
                <div className="col-span-8 space-y-2">
                  {/* List of current exemptions */}
                  {salary.section10ExemptionsList && Array.isArray(salary.section10ExemptionsList) && 
                   salary.section10ExemptionsList.map((exemption, exemptionIndex) => (
                    <div key={exemptionIndex} className="flex space-x-2 items-center">
                      <Select 
                        value={exemption.type}
                        onValueChange={(value) => {
                          // Update the exemption type
                          const updatedExemptions = [...(salary.section10ExemptionsList || [])];
                          updatedExemptions[exemptionIndex] = {
                            ...updatedExemptions[exemptionIndex],
                            type: value
                          };
                          updateIncomeField("salaryIncome", index, "section10ExemptionsList", updatedExemptions);
                        }}
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hra">HRA</SelectItem>
                          <SelectItem value="lta">LTA</SelectItem>
                          <SelectItem value="transport">Transport Allowance</SelectItem>
                          <SelectItem value="medical">Medical Reimbursement</SelectItem>
                          <SelectItem value="special">Special Allowance</SelectItem>
                          <SelectItem value="other">Other Exemptions</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative w-32">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <Input
                          className="pl-7"
                          value={exemption.amount}
                          onChange={(e) => {
                            // Store the original cursor position
                            const cursorPosition = e.target.selectionStart;
                            
                            // Format the value
                            const value = formatCurrency(e.target.value);
                            
                            // Update exemption amount
                            const updatedExemptions = [...(salary.section10ExemptionsList || [])];
                            updatedExemptions[exemptionIndex] = {
                              ...updatedExemptions[exemptionIndex],
                              amount: value
                            };
                            updateIncomeField("salaryIncome", index, "section10ExemptionsList", updatedExemptions);
                            
                            // Calculate total exemptions
                            const totalExemptions = updatedExemptions.reduce((sum, item) => {
                              return sum + (parseFloat((item.amount || "0").replace(/,/g, '')) || 0);
                            }, 0);
                            
                            // Update section10Exemptions total
                            updateIncomeField(
                              "salaryIncome", 
                              index, 
                              "section10Exemptions", 
                              formatCurrency(totalExemptions.toString())
                            );
                            
                            // Calculate net salary
                            const gross = parseFloat((salary.grossSalary || "0").replace(/,/g, '')) || 0;
                            const stdDeduction = parseFloat((salary.standardDeduction || "0").replace(/,/g, '')) || 0;
                            const profTax = parseFloat((salary.professionalTax || "0").replace(/,/g, '')) || 0;
                            const netSalary = Math.max(0, gross - stdDeduction - totalExemptions - profTax);
                            updateIncomeField("salaryIncome", index, "netSalary", formatCurrency(netSalary.toString()));
                            
                            // Set cursor position in the next render cycle
                            setTimeout(() => {
                              if (e.target && typeof cursorPosition === 'number') {
                                e.target.setSelectionRange(cursorPosition, cursorPosition);
                              }
                            }, 0);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // Remove this exemption
                          const updatedExemptions = salary.section10ExemptionsList.filter((_, i) => i !== exemptionIndex);
                          updateIncomeField("salaryIncome", index, "section10ExemptionsList", updatedExemptions);
                          
                          // Calculate total exemptions
                          const totalExemptions = updatedExemptions.reduce((sum, item) => {
                            return sum + (parseFloat((item.amount || "0").replace(/,/g, '')) || 0);
                          }, 0);
                          
                          // Update section10Exemptions total
                          updateIncomeField(
                            "salaryIncome", 
                            index, 
                            "section10Exemptions", 
                            formatCurrency(totalExemptions.toString())
                          );
                          
                          // Calculate net salary
                          const gross = parseFloat((salary.grossSalary || "0").replace(/,/g, '')) || 0;
                          const stdDeduction = parseFloat((salary.standardDeduction || "0").replace(/,/g, '')) || 0;
                          const profTax = parseFloat((salary.professionalTax || "0").replace(/,/g, '')) || 0;
                          const netSalary = Math.max(0, gross - stdDeduction - totalExemptions - profTax);
                          updateIncomeField("salaryIncome", index, "netSalary", formatCurrency(netSalary.toString()));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add new exemption button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const currentExemptions = salary.section10ExemptionsList || [];
                      const updatedExemptions = [...currentExemptions, { type: "", amount: "" }];
                      updateIncomeField("salaryIncome", index, "section10ExemptionsList", updatedExemptions);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Exemption
                  </Button>
                </div>
              </div>
              
              {/* Row 4: Professional Tax */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 font-medium">
                  4. Professional Tax <span className="text-xs text-gray-500">(Sec 16(iii))</span>
                </div>
                <div className="col-span-8 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id={`professionalTax-${index}`}
                    className="pl-7"
                    value={salary.professionalTax}
                    onChange={(e) => {
                      // Store the original cursor position
                      const cursorPosition = e.target.selectionStart;
                      
                      // Format the value
                      const value = formatCurrency(e.target.value);
                      updateIncomeField("salaryIncome", index, "professionalTax", value);
                      
                      // Calculate net salary
                      const gross = parseFloat((salary.grossSalary || "0").replace(/,/g, '')) || 0;
                      const stdDeduction = parseFloat((salary.standardDeduction || "0").replace(/,/g, '')) || 0;
                      const section10 = parseFloat((salary.section10Exemptions || "0").replace(/,/g, '')) || 0;
                      const profTax = parseFloat((value || "0").replace(/,/g, '')) || 0;
                      const netSalary = Math.max(0, gross - stdDeduction - section10 - profTax);
                      updateIncomeField("salaryIncome", index, "netSalary", formatCurrency(netSalary.toString()));
                      
                      // Set cursor position in the next render cycle
                      setTimeout(() => {
                        if (e.target && typeof cursorPosition === 'number') {
                          e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }
                      }, 0);
                    }}
                  />
                </div>
              </div>
              
              {/* Row 5: Net Salary (highlighted) */}
              <div className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-2 rounded">
                <div className="col-span-4 font-medium">5. Net Taxable Salary</div>
                <div className="col-span-8 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input
                    id={`netSalary-${index}`}
                    className="pl-7 bg-gray-50"
                    value={salary.netSalary}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalarySection;
