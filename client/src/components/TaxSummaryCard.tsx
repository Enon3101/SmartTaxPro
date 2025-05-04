import { useTaxFiling } from "@/hooks/useTaxFiling";
import { formatCurrency } from "@/lib/taxCalculations";
import { LightbulbIcon } from "lucide-react";

interface TaxSummaryCardProps {
  className?: string;
}

const TaxSummaryCard = ({ className = "" }: TaxSummaryCardProps) => {
  const { taxSummary } = useTaxFiling();

  const {
    totalIncome,
    adjustments,
    standardDeduction,
    taxableIncome,
    estimatedTax,
    taxCredits,
    taxPaid,
    estimatedRefund,
  } = taxSummary;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4">Tax Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm">Total Income</span>
          <span className="font-medium">
            {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Adjustments</span>
          <span className="font-medium">
            {formatCurrency(adjustments)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Standard Deduction</span>
          <span className="font-medium">
            {formatCurrency(standardDeduction)}
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
          <span className="text-sm">Estimated Tax</span>
          <span className="font-medium">
            {formatCurrency(estimatedTax)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Tax Credits</span>
          <span className="font-medium">
            {formatCurrency(taxCredits)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Tax Already Paid</span>
          <span className="font-medium">
            {formatCurrency(taxPaid)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-[#E9ECEF]">
          <span className="font-medium">Estimated Refund</span>
          <span className="text-lg font-bold text-secondary">
            {formatCurrency(estimatedRefund)}
          </span>
        </div>
      </div>

      <div className="bg-background rounded-md p-4">
        <div className="flex items-start">
          <LightbulbIcon className="h-5 w-5 text-accent mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium mb-1">Tax Insight</h3>
            <p className="text-sm text-[#ADB5BD]">
              Check if you qualify for the Retirement Savings Contribution Credit
              to potentially increase your refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummaryCard;
