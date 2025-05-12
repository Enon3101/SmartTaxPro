import React from "react";
import { formatIndianCurrency } from "@/lib/formatters";
import { TaxSummary } from "@/lib/taxCalculations";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Printer } from "lucide-react";

interface TaxComputationDocumentProps {
  taxSummary: TaxSummary;
  personalInfo: any;
  assessmentYear: string;
}

const TaxComputationDocument: React.FC<TaxComputationDocumentProps> = ({
  taxSummary,
  personalInfo,
  assessmentYear,
}) => {
  // Function to generate and download PDF
  const downloadPdf = () => {
    const computationHtml = document.getElementById("tax-computation");
    if (!computationHtml) return;

    // Create a printable version in a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download the computation document");
      return;
    }

    // Add the complete content with styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Tax Computation - ${assessmentYear}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0066CC;
              padding-bottom: 10px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0066CC;
              margin-bottom: 5px;
            }
            .tagline {
              font-style: italic;
              color: #666;
              margin-bottom: 15px;
            }
            .document-title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .assessment-year {
              font-size: 16px;
              margin-bottom: 5px;
            }
            .personal-info {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .personal-info-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              width: 120px;
              font-weight: bold;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #0066CC;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .line-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 4px 0;
            }
            .line-item:nth-child(even) {
              background-color: #f8f9fa;
            }
            .line-label {
              font-weight: normal;
            }
            .line-value {
              font-weight: bold;
              text-align: right;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              font-weight: bold;
            }
            .grand-total {
              font-size: 18px;
              color: #0066CC;
              border-top: 2px solid #0066CC;
              padding-top: 10px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .notes {
              font-size: 12px;
              margin-top: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .tax-status {
              margin: 20px 0;
              padding: 15px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              border-radius: 8px;
            }
            .refund {
              background-color: #e6f7f1;
              color: #00A878;
              border: 1px solid #00A878;
            }
            .payable {
              background-color: #fff2f0;
              color: #ff4d4f;
              border: 1px solid #ff4d4f;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TaxEasy India</div>
            <div class="tagline">File, File and Smile</div>
            <div class="document-title">Computation of Income</div>
            <div class="assessment-year">Assessment Year: ${assessmentYear}</div>
          </div>

          <div class="personal-info">
            <div class="personal-info-title">Taxpayer Information</div>
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div>${personalInfo?.name || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">PAN:</div>
              <div>${personalInfo?.pan || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Filing Status:</div>
              <div>${personalInfo?.filingType || "Individual"}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Income from Various Sources</div>
            
            <div class="line-item">
              <div class="line-label">Income from Salary</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.salaryIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income from House Property</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.housePropertyIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Capital Gains</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.capitalGainsIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income from Other Sources</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.otherIncome)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Gross Total Income</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalIncome)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Deductions</div>
            
            <div class="line-item">
              <div class="line-label">Standard Deduction</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.standardDeduction)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Deductions Under Section 80C</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.deductions80C)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Deductions Under Section 80D</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.deductions80D)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Other Deductions</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.otherDeductions)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Deductions</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalDeductions)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Tax Computation</div>
            
            <div class="line-item">
              <div class="line-label">Net Taxable Income</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.taxableIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income Tax</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.estimatedTax)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Surcharge</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.surchargeAmount)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Health & Education Cess (4%)</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.cessAmount)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Tax Liability</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.estimatedTax + taxSummary.surchargeAmount + taxSummary.cessAmount)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Taxes Paid</div>
            
            <div class="line-item">
              <div class="line-label">TDS</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.tdsAmount)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Advance Tax Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.advanceTaxPaid)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Self-Assessment Tax Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.selfAssessmentTaxPaid)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Taxes Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalTaxPaid)}</div>
            </div>
          </div>

          ${
            taxSummary.refundDue > 0 
            ? `<div class="tax-status refund">
                 REFUND DUE: ${formatIndianCurrency(taxSummary.refundDue)}
               </div>`
            : taxSummary.taxPayable > 0
            ? `<div class="tax-status payable">
                 TAX PAYABLE: ${formatIndianCurrency(taxSummary.taxPayable)}
               </div>`
            : `<div class="tax-status">
                 NO TAX PAYABLE OR REFUND
               </div>`
          }

          <div class="notes">
            <strong>Note:</strong> This computation is based on the information provided and is subject to verification by tax authorities. All figures are rounded to the nearest 10 rupees as per Income Tax Act, 1961.
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>TaxEasy India - Making tax filing simple and easy</p>
          </div>
        </body>
      </html>
    `);

    // Trigger print dialog
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Function to print the document directly
  const printDocument = () => {
    const computationHtml = document.getElementById("tax-computation");
    if (!computationHtml) return;

    // Create a printable version in a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the computation document");
      return;
    }

    // Add the same content as the download function
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Tax Computation - ${assessmentYear}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0066CC;
              padding-bottom: 10px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0066CC;
              margin-bottom: 5px;
            }
            .tagline {
              font-style: italic;
              color: #666;
              margin-bottom: 15px;
            }
            .document-title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .assessment-year {
              font-size: 16px;
              margin-bottom: 5px;
            }
            .personal-info {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .personal-info-title {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              width: 120px;
              font-weight: bold;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #0066CC;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .line-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 4px 0;
            }
            .line-item:nth-child(even) {
              background-color: #f8f9fa;
            }
            .line-label {
              font-weight: normal;
            }
            .line-value {
              font-weight: bold;
              text-align: right;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              font-weight: bold;
            }
            .grand-total {
              font-size: 18px;
              color: #0066CC;
              border-top: 2px solid #0066CC;
              padding-top: 10px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .notes {
              font-size: 12px;
              margin-top: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .tax-status {
              margin: 20px 0;
              padding: 15px;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              border-radius: 8px;
            }
            .refund {
              background-color: #e6f7f1;
              color: #00A878;
              border: 1px solid #00A878;
            }
            .payable {
              background-color: #fff2f0;
              color: #ff4d4f;
              border: 1px solid #ff4d4f;
            }
            /* Print-specific styles */
            @media print {
              body {
                padding: 0;
                font-size: 12pt;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TaxEasy India</div>
            <div class="tagline">File, File and Smile</div>
            <div class="document-title">Computation of Income</div>
            <div class="assessment-year">Assessment Year: ${assessmentYear}</div>
          </div>

          <div class="personal-info">
            <div class="personal-info-title">Taxpayer Information</div>
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div>${personalInfo?.name || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">PAN:</div>
              <div>${personalInfo?.pan || "N/A"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Filing Status:</div>
              <div>${personalInfo?.filingType || "Individual"}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Income from Various Sources</div>
            
            <div class="line-item">
              <div class="line-label">Income from Salary</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.salaryIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income from House Property</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.housePropertyIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Capital Gains</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.capitalGainsIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income from Other Sources</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.otherIncome)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Gross Total Income</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalIncome)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Deductions</div>
            
            <div class="line-item">
              <div class="line-label">Standard Deduction</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.standardDeduction)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Deductions Under Section 80C</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.deductions80C)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Deductions Under Section 80D</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.deductions80D)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Other Deductions</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.otherDeductions)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Deductions</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalDeductions)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Tax Computation</div>
            
            <div class="line-item">
              <div class="line-label">Net Taxable Income</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.taxableIncome)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Income Tax</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.estimatedTax)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Surcharge</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.surchargeAmount)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Health & Education Cess (4%)</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.cessAmount)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Tax Liability</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.estimatedTax + taxSummary.surchargeAmount + taxSummary.cessAmount)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Taxes Paid</div>
            
            <div class="line-item">
              <div class="line-label">TDS</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.tdsAmount)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Advance Tax Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.advanceTaxPaid)}</div>
            </div>
            
            <div class="line-item">
              <div class="line-label">Self-Assessment Tax Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.selfAssessmentTaxPaid)}</div>
            </div>
            
            <div class="total-line">
              <div class="line-label">Total Taxes Paid</div>
              <div class="line-value">${formatIndianCurrency(taxSummary.totalTaxPaid)}</div>
            </div>
          </div>

          ${
            taxSummary.refundDue > 0 
            ? `<div class="tax-status refund">
                 REFUND DUE: ${formatIndianCurrency(taxSummary.refundDue)}
               </div>`
            : taxSummary.taxPayable > 0
            ? `<div class="tax-status payable">
                 TAX PAYABLE: ${formatIndianCurrency(taxSummary.taxPayable)}
               </div>`
            : `<div class="tax-status">
                 NO TAX PAYABLE OR REFUND
               </div>`
          }

          <div class="notes">
            <strong>Note:</strong> This computation is based on the information provided and is subject to verification by tax authorities. All figures are rounded to the nearest 10 rupees as per Income Tax Act, 1961.
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>TaxEasy India - Making tax filing simple and easy</p>
          </div>
        </body>
      </html>
    `);

    // Trigger print dialog
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Card className="w-full shadow-lg" id="tax-computation">
      <CardHeader className="bg-primary/10 border-b">
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <FileText size={20} />
          Computation of Income
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Taxpayer Information</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-sm text-muted-foreground">Name:</div>
            <div className="text-sm font-medium">{personalInfo?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">PAN:</div>
            <div className="text-sm font-medium">{personalInfo?.pan || "N/A"}</div>
            <div className="text-sm text-muted-foreground">Assessment Year:</div>
            <div className="text-sm font-medium">{assessmentYear}</div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Income Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary">Income from Various Sources</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span className="text-sm">Income from Salary</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.salaryIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Income from House Property</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.housePropertyIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Capital Gains</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.capitalGainsIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Income from Other Sources</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.otherIncome)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Gross Total Income</span>
              <span className="text-sm">
                {formatIndianCurrency(taxSummary.totalIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary">Deductions</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span className="text-sm">Standard Deduction</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.standardDeduction)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Deductions Under Section 80C</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.deductions80C)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Deductions Under Section 80D</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.deductions80D)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Other Deductions</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.otherDeductions)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Total Deductions</span>
              <span className="text-sm">
                {formatIndianCurrency(taxSummary.totalDeductions)}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Computation Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary">Tax Computation</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span className="text-sm">Net Taxable Income</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.taxableIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Income Tax</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.estimatedTax)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Surcharge</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.surchargeAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Health & Education Cess (4%)</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.cessAmount)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Total Tax Liability</span>
              <span className="text-sm">
                {formatIndianCurrency(taxSummary.estimatedTax + taxSummary.surchargeAmount + taxSummary.cessAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Taxes Paid Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary">Taxes Paid</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span className="text-sm">TDS</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.tdsAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Advance Tax Paid</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.advanceTaxPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Self-Assessment Tax Paid</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(taxSummary.selfAssessmentTaxPaid)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Total Taxes Paid</span>
              <span className="text-sm">
                {formatIndianCurrency(taxSummary.totalTaxPaid)}
              </span>
            </div>
          </div>
        </div>

        {/* Final Tax Status */}
        <div className={`mt-6 p-4 text-center rounded-md font-semibold ${
          taxSummary.refundDue > 0 
            ? "bg-green-50 text-green-600 border border-green-200" 
            : taxSummary.taxPayable > 0
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-gray-50 text-gray-600 border border-gray-200"
        }`}>
          {taxSummary.refundDue > 0 
            ? `REFUND DUE: ${formatIndianCurrency(taxSummary.refundDue)}`
            : taxSummary.taxPayable > 0
            ? `TAX PAYABLE: ${formatIndianCurrency(taxSummary.taxPayable)}`
            : "NO TAX PAYABLE OR REFUND"}
        </div>

        <div className="mt-6 text-xs text-muted-foreground bg-secondary/20 p-3 rounded-md">
          <p><strong>Note:</strong> This computation is based on the information provided and is subject to verification by tax authorities. All figures are rounded to the nearest 10 rupees as per Income Tax Act, 1961.</p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t flex justify-between">
        <p className="text-xs text-muted-foreground">
          Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={printDocument}
          >
            <Printer size={16} />
            Print
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={downloadPdf}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaxComputationDocument;