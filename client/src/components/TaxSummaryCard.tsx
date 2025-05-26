import { LightbulbIcon } from "lucide-react";

import { useTaxFiling } from "@/hooks/useTaxFiling";
import { formatCurrency } from "@/lib/taxCalculations";

interface TaxSummaryCardProps {
  className?: string;
}

const TaxSummaryCard = ({ className = "" }: TaxSummaryCardProps) => {
  const { taxSummary, taxFormData } = useTaxFiling();

  const {
    totalIncome,
    salaryIncome,
    housePropertyIncome,
    capitalGainsIncome,
    otherIncome,
    standardDeduction,
    totalDeductions,
    deductions80C,
    deductions80D,
    otherDeductions,
    taxableIncome,
    estimatedTax,
    cessAmount,
    surchargeAmount,
    tdsAmount,
    advanceTaxPaid,
    selfAssessmentTaxPaid,
    totalTaxPaid,
    taxPayable,
    refundDue,
  } = taxSummary;

  const assessmentYear = taxFormData?.assessmentYear || "2024-25";
  const formType = taxFormData?.formType || "ITR-1";

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4">Income Tax Summary</h2>
      <div className="text-xs text-[#ADB5BD] mb-4">
        Assessment Year: {assessmentYear} | Form: {formType}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm">Salary Income</span>
          <span className="font-medium">
            {formatCurrency(salaryIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">House Property Income</span>
          <span className="font-medium">
            {formatCurrency(housePropertyIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Capital Gains</span>
          <span className="font-medium">
            {formatCurrency(capitalGainsIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Other Income</span>
          <span className="font-medium">
            {formatCurrency(otherIncome)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E9ECEF]">
          <span className="text-sm font-medium">Total Income</span>
          <span className="font-medium">
            {formatCurrency(totalIncome)}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm">Standard Deduction</span>
          <span className="font-medium">
            {formatCurrency(standardDeduction)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Section 80C Deductions</span>
          <span className="font-medium">
            {formatCurrency(deductions80C)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Section 80D Deductions</span>
          <span className="font-medium">
            {formatCurrency(deductions80D)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Other Deductions</span>
          <span className="font-medium">
            {formatCurrency(otherDeductions)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E9ECEF]">
          <span className="text-sm font-medium">Taxable Income</span>
          <span className="font-medium">
            {formatCurrency(taxableIncome)}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm">Income Tax</span>
          <span className="font-medium">
            {formatCurrency(estimatedTax - cessAmount - surchargeAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Surcharge</span>
          <span className="font-medium">
            {formatCurrency(surchargeAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Health & Education Cess</span>
          <span className="font-medium">
            {formatCurrency(cessAmount)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E9ECEF]">
          <span className="text-sm font-medium">Total Tax Liability</span>
          <span className="font-medium">
            {formatCurrency(estimatedTax)}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm">TDS</span>
          <span className="font-medium">
            {formatCurrency(tdsAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Advance Tax Paid</span>
          <span className="font-medium">
            {formatCurrency(advanceTaxPaid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Self-Assessment Tax</span>
          <span className="font-medium">
            {formatCurrency(selfAssessmentTaxPaid)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E9ECEF]">
          <span className="text-sm font-medium">Total Tax Paid</span>
          <span className="font-medium">
            {formatCurrency(totalTaxPaid)}
          </span>
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t border-[#E9ECEF] mb-6">
        {refundDue > 0 ? (
          <>
            <span className="font-medium">Refund Due</span>
            <span className="text-lg font-bold text-secondary">
              {formatCurrency(refundDue)}
            </span>
          </>
        ) : (
          <>
            <span className="font-medium">Tax Payable</span>
            <span className="text-lg font-bold text-destructive">
              {formatCurrency(taxPayable)}
            </span>
          </>
        )}
      </div>

      <div className="bg-background rounded-md p-4">
        <div className="flex items-start">
          <LightbulbIcon className="h-5 w-5 text-accent mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium mb-1">Tax Insight</h3>
            <p className="text-sm text-[#ADB5BD]">
              You can save up to ₹46,800 in taxes by fully utilizing your Section 80C 
              deduction limit of ₹1,50,000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummaryCard;
