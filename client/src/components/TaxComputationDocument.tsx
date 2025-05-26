import { 
  Download, 
  FileText, 
  Printer, 
  ArrowDownRight, 
  CreditCard, 
  Home, 
  TrendingUp, 
  CircleDollarSign, 
  Calculator, 
  Receipt, 
  IndianRupee 
} from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatIndianCurrency } from "@/lib/formatters";
import { TaxSummary } from "@/lib/taxCalculations";

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
    // Create a formatted version of the document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Tax Computation - ${getFormattedAssessmentYear()}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
              line-height: 1.5;
            }
            .header {
              border-bottom: 3px solid #0066CC;
              padding-bottom: 15px;
              margin-bottom: 25px;
              position: relative;
            }
            .logo-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #0066CC;
            }
            .assessment-year {
              background-color: #f1f5f9;
              border: 1px solid #e2e8f0;
              padding: 5px 15px;
              border-radius: 30px;
              font-size: 14px;
              font-weight: 600;
            }
            .document-title {
              font-size: 24px;
              font-weight: bold;
              margin: 15px 0 5px;
              color: #333;
            }
            .tagline {
              color: #666;
              font-size: 16px;
            }
            .personal-info {
              background-color: #f8fafc;
              border-radius: 10px;
              padding: 15px 20px;
              margin-bottom: 30px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
            }
            .info-item {
              flex: 1;
              min-width: 200px;
              margin-bottom: 10px;
            }
            .info-label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 3px;
            }
            .info-value {
              font-weight: 600;
              font-size: 16px;
            }
            .summary-cards {
              display: flex;
              flex-wrap: wrap;
              margin-bottom: 30px;
              gap: 20px;
            }
            .summary-card {
              flex: 1;
              min-width: 200px;
              padding: 15px;
              border-radius: 10px;
              background-color: #f8fafc;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .summary-label {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              color: #0066CC;
              margin-bottom: 5px;
            }
            .summary-subtitle {
              font-size: 12px;
              color: #64748b;
            }
            .summary-value.refund {
              color: #00A878;
            }
            .summary-value.payable {
              color: #e11d48;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0066CC;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
              display: flex;
              align-items: center;
            }
            .section-title:before {
              content: "";
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #0066CC;
              margin-right: 10px;
              border-radius: 50%;
            }
            .line-items {
              padding: 0 10px;
            }
            .line-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #e2e8f0;
              page-break-inside: avoid;
            }
            .line-item:last-child {
              border-bottom: none;
            }
            .line-label {
              font-weight: 400;
            }
            .line-value {
              font-weight: 600;
              text-align: right;
            }
            .line-item.income-from-salary .line-indicator {
              background-color: #3b82f6;
            }
            .line-item.house-property .line-indicator {
              background-color: #10b981;
            }
            .line-item.capital-gains .line-indicator {
              background-color: #f59e0b;
            }
            .line-item.other-sources .line-indicator {
              background-color: #8b5cf6;
            }
            .line-indicator {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              display: inline-block;
              margin-right: 8px;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              padding: 12px 10px;
              margin-top: 5px;
              font-weight: 700;
              border-top: 2px solid #e2e8f0;
              page-break-inside: avoid;
            }
            .tax-status {
              margin: 30px 0;
              padding: 20px;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              border-radius: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              page-break-inside: avoid;
            }
            .tax-status.refund {
              background-color: #ecfdf5;
              color: #00A878;
              border: 1px solid #a7f3d0;
            }
            .tax-status.payable {
              background-color: #fef2f2;
              color: #e11d48;
              border: 1px solid #fecaca;
            }
            .tax-status.neutral {
              background-color: #f8fafc;
              color: #475569;
              border: 1px solid #e2e8f0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 12px;
              color: #64748b;
              text-align: center;
              page-break-inside: avoid;
            }
            .notes {
              font-size: 12px;
              margin: 30px 0;
              padding: 15px;
              background-color: #f8fafc;
              border-radius: 10px;
              border: 1px solid #e2e8f0;
              color: #475569;
              page-break-inside: avoid;
            }
            .page-break {
              page-break-after: always;
            }
            @media print {
              .header {
                position: fixed;
                top: 0;
                width: 100%;
                background-color: white;
              }
              .content {
                margin-top: 180px;
              }
              body {
                padding: 20px 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <div class="logo">TaxEasy India</div>
              <div class="assessment-year">AY ${getFormattedAssessmentYear()}</div>
            </div>
            <div class="document-title">Computation of Income</div>
            <div class="tagline">File, File and Smile</div>
          </div>
          
          <div class="content">
            <div class="personal-info">
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${personalInfo?.name || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">PAN</div>
                <div class="info-value">${personalInfo?.pan || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Filing as</div>
                <div class="info-value">${personalInfo?.filingType || "Individual"}</div>
              </div>
            </div>
            
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-label">Gross Income</div>
                <div class="summary-value">${formatIndianCurrency(taxSummary.totalIncome)}</div>
                <div class="summary-subtitle">Before deductions</div>
              </div>
              
              <div class="summary-card">
                <div class="summary-label">Net Taxable Income</div>
                <div class="summary-value">${formatIndianCurrency(taxSummary.taxableIncome)}</div>
                <div class="summary-subtitle">After deductions of ₹${formatIndianCurrency(taxSummary.totalDeductions, false)}</div>
              </div>
              
              <div class="summary-card">
                <div class="summary-label">${taxSummary.refundDue > 0 ? "Refund Due" : "Tax Payable"}</div>
                <div class="summary-value ${
                  taxSummary.refundDue > 0 ? "refund" : 
                  taxSummary.taxPayable > 0 ? "payable" : ""
                }">${
                  taxSummary.refundDue > 0 
                    ? formatIndianCurrency(taxSummary.refundDue)
                    : formatIndianCurrency(taxSummary.taxPayable)
                }</div>
                <div class="summary-subtitle">
                  ${taxSummary.refundDue > 0 
                    ? "Will be credited to your bank account" 
                    : taxSummary.taxPayable > 0 
                    ? "Due before filing" 
                    : "No tax payable or refund"}
                </div>
              </div>
            </div>
            
            <!-- Income Section -->
            <div class="section">
              <div class="section-title">Income from Various Sources</div>
              <div class="line-items">
                ${shouldDisplay(taxSummary.salaryIncome) ? `
                  <div class="line-item income-from-salary">
                    <div class="line-label"><span class="line-indicator"></span>Income from Salary</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.salaryIncome)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.housePropertyIncome) ? `
                  <div class="line-item house-property">
                    <div class="line-label"><span class="line-indicator"></span>Income from House Property</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.housePropertyIncome)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.capitalGainsIncome) ? `
                  <div class="line-item capital-gains">
                    <div class="line-label"><span class="line-indicator"></span>Capital Gains</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.capitalGainsIncome)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.otherIncome) ? `
                  <div class="line-item other-sources">
                    <div class="line-label"><span class="line-indicator"></span>Income from Other Sources</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.otherIncome)}</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="total-line">
                <div>Gross Total Income</div>
                <div>${formatIndianCurrency(taxSummary.totalIncome)}</div>
              </div>
            </div>
            
            <!-- Deductions Section -->
            <div class="section">
              <div class="section-title">Deductions</div>
              <div class="line-items">
                ${shouldDisplay(taxSummary.standardDeduction) ? `
                  <div class="line-item">
                    <div class="line-label">Standard Deduction</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.standardDeduction)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.deductions80C) ? `
                  <div class="line-item">
                    <div class="line-label">Deductions Under Section 80C</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.deductions80C)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.deductions80D) ? `
                  <div class="line-item">
                    <div class="line-label">Deductions Under Section 80D</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.deductions80D)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.otherDeductions) ? `
                  <div class="line-item">
                    <div class="line-label">Other Deductions</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.otherDeductions)}</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="total-line">
                <div>Total Deductions</div>
                <div>${formatIndianCurrency(taxSummary.totalDeductions)}</div>
              </div>
            </div>
            
            <!-- Tax Computation Section -->
            <div class="section">
              <div class="section-title">Tax Computation</div>
              <div class="line-items">
                <div class="line-item">
                  <div class="line-label">Net Taxable Income</div>
                  <div class="line-value">${formatIndianCurrency(taxSummary.taxableIncome)}</div>
                </div>
                
                ${shouldDisplay(taxSummary.estimatedTax) ? `
                  <div class="line-item">
                    <div class="line-label">Income Tax</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.estimatedTax)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.surchargeAmount) ? `
                  <div class="line-item">
                    <div class="line-label">Surcharge</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.surchargeAmount)}</div>
                  </div>
                ` : ''}
                
                ${shouldDisplay(taxSummary.cessAmount) ? `
                  <div class="line-item">
                    <div class="line-label">Health & Education Cess (4%)</div>
                    <div class="line-value">${formatIndianCurrency(taxSummary.cessAmount)}</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="total-line">
                <div>Total Tax Liability</div>
                <div>${formatIndianCurrency(taxLiability)}</div>
              </div>
            </div>
            
            <!-- Taxes Paid Section -->
            ${(shouldDisplay(taxSummary.tdsAmount) || shouldDisplay(taxSummary.advanceTaxPaid) || shouldDisplay(taxSummary.selfAssessmentTaxPaid)) ? `
              <div class="section">
                <div class="section-title">Taxes Paid</div>
                <div class="line-items">
                  ${shouldDisplay(taxSummary.tdsAmount) ? `
                    <div class="line-item">
                      <div class="line-label">TDS</div>
                      <div class="line-value">${formatIndianCurrency(taxSummary.tdsAmount)}</div>
                    </div>
                  ` : ''}
                  
                  ${shouldDisplay(taxSummary.advanceTaxPaid) ? `
                    <div class="line-item">
                      <div class="line-label">Advance Tax Paid</div>
                      <div class="line-value">${formatIndianCurrency(taxSummary.advanceTaxPaid)}</div>
                    </div>
                  ` : ''}
                  
                  ${shouldDisplay(taxSummary.selfAssessmentTaxPaid) ? `
                    <div class="line-item">
                      <div class="line-label">Self-Assessment Tax Paid</div>
                      <div class="line-value">${formatIndianCurrency(taxSummary.selfAssessmentTaxPaid)}</div>
                    </div>
                  ` : ''}
                </div>
                
                <div class="total-line">
                  <div>Total Taxes Paid</div>
                  <div>${formatIndianCurrency(taxSummary.totalTaxPaid)}</div>
                </div>
              </div>
            ` : ''}
            
            <!-- Final Tax Status -->
            <div class="tax-status ${
              taxSummary.refundDue > 0 ? "refund" : 
              taxSummary.taxPayable > 0 ? "payable" : "neutral"
            }">
              <div>${
                taxSummary.refundDue > 0 ? "REFUND DUE:" : 
                taxSummary.taxPayable > 0 ? "TAX PAYABLE:" : 
                "TAX STATUS:"
              }</div>
              <div>${
                taxSummary.refundDue > 0 ? formatIndianCurrency(taxSummary.refundDue) : 
                taxSummary.taxPayable > 0 ? formatIndianCurrency(taxSummary.taxPayable) : 
                "NO TAX PAYABLE OR REFUND"
              }</div>
            </div>
            
            <div class="notes">
              <strong>Note:</strong> This computation is based on information provided and is subject to verification by tax authorities. Figures are rounded to the nearest 10 rupees per Income Tax Act, 1961.
            </div>
            
            <div class="footer">
              <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>TaxEasy India - Making tax filing simple and easy</p>
            </div>
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

    // Add the modernized document content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Tax Computation - ${getFormattedAssessmentYear()}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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

  // Helper function to determine if a value should be displayed
  const shouldDisplay = (value: number): boolean => {
    return value !== 0;
  };

  // Function to get assessment year in a cleaner format
  const getFormattedAssessmentYear = () => {
    const years = assessmentYear.split('-');
    if (years.length === 2) {
      return `${years[0]}-${years[1]}`;
    }
    return assessmentYear;
  };

  // Get tax liability
  const taxLiability = taxSummary.estimatedTax + taxSummary.surchargeAmount + taxSummary.cessAmount;

  return (
    <Card className="w-full shadow-lg overflow-hidden" id="tax-computation">
      <CardHeader className="bg-primary/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Computation of Income
          </CardTitle>
          <Badge variant="outline" className="text-sm font-medium px-3">
            AY {getFormattedAssessmentYear()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Taxpayer Information */}
        <div className="bg-muted/20 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Name</span>
              <span className="font-medium">{personalInfo?.name || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">PAN</span>
              <span className="font-medium">{personalInfo?.pan || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Filing as</span>
              <span className="font-medium">{personalInfo?.filingType || "Individual"}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b">
          <div className="p-4 flex flex-col border-r">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                <IndianRupee className="h-4 w-4 mr-1 text-primary" />
                Gross Income
              </h3>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatIndianCurrency(taxSummary.totalIncome)}
            </div>
            <div className="text-xs text-muted-foreground">Before deductions</div>
          </div>
          
          <div className="p-4 flex flex-col border-r">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                <Calculator className="h-4 w-4 mr-1 text-primary" />
                Net Taxable Income
              </h3>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatIndianCurrency(taxSummary.taxableIncome)}
            </div>
            <div className="text-xs text-muted-foreground">After deductions of ₹{formatIndianCurrency(taxSummary.totalDeductions, false)}</div>
          </div>
          
          <div className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-sm font-semibold text-muted-foreground flex items-center`}>
                <Receipt className="h-4 w-4 mr-1 text-primary" />
                {taxSummary.refundDue > 0 ? "Refund Due" : "Tax Payable"}
              </h3>
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              taxSummary.refundDue > 0 ? "text-green-600" : 
              taxSummary.taxPayable > 0 ? "text-red-600" : "text-primary"
            }`}>
              {taxSummary.refundDue > 0 
                ? formatIndianCurrency(taxSummary.refundDue)
                : formatIndianCurrency(taxSummary.taxPayable)
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {taxSummary.refundDue > 0 
                ? "Will be credited to your bank account" 
                : taxSummary.taxPayable > 0 
                ? "Due before filing" 
                : "No tax payable or refund"}
            </div>
          </div>
        </div>

        <div className="divide-y">
          {/* Income Section */}
          <div className="p-5">
            <h3 className="text-base font-semibold text-primary flex items-center mb-3">
              <CreditCard className="h-4 w-4 mr-2" />
              Income from Various Sources
            </h3>
            
            <div className="space-y-2">
              {shouldDisplay(taxSummary.salaryIncome) && (
                <div className="flex items-center justify-between py-1.5 px-1">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm">Income from Salary</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.salaryIncome)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.housePropertyIncome) && (
                <div className="flex items-center justify-between py-1.5 px-1">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-sm">Income from House Property</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.housePropertyIncome)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.capitalGainsIncome) && (
                <div className="flex items-center justify-between py-1.5 px-1">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-3"></div>
                    <span className="text-sm">Capital Gains</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.capitalGainsIncome)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.otherIncome) && (
                <div className="flex items-center justify-between py-1.5 px-1">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-sm">Income from Other Sources</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.otherIncome)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold border-t border-dashed pt-2 mt-2">
                <span className="text-sm">Gross Total Income</span>
                <span className="text-sm">
                  {formatIndianCurrency(taxSummary.totalIncome)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="p-5">
            <h3 className="text-base font-semibold text-primary flex items-center mb-3">
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Deductions
            </h3>
            
            <div className="space-y-2">
              {shouldDisplay(taxSummary.standardDeduction) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Standard Deduction</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.standardDeduction)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.deductions80C) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Deductions Under Section 80C</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.deductions80C)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.deductions80D) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Deductions Under Section 80D</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.deductions80D)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.otherDeductions) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Other Deductions</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.otherDeductions)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold border-t border-dashed pt-2 mt-2">
                <span className="text-sm">Total Deductions</span>
                <span className="text-sm">
                  {formatIndianCurrency(taxSummary.totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Computation Section */}
          <div className="p-5">
            <h3 className="text-base font-semibold text-primary flex items-center mb-3">
              <Calculator className="h-4 w-4 mr-2" />
              Tax Computation
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 px-1">
                <span className="text-sm">Net Taxable Income</span>
                <span className="text-sm font-medium">
                  {formatIndianCurrency(taxSummary.taxableIncome)}
                </span>
              </div>
              
              {shouldDisplay(taxSummary.estimatedTax) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Income Tax</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.estimatedTax)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.surchargeAmount) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Surcharge</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.surchargeAmount)}
                  </span>
                </div>
              )}
              
              {shouldDisplay(taxSummary.cessAmount) && (
                <div className="flex justify-between py-1.5 px-1">
                  <span className="text-sm">Health & Education Cess (4%)</span>
                  <span className="text-sm font-medium">
                    {formatIndianCurrency(taxSummary.cessAmount)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold border-t border-dashed pt-2 mt-2">
                <span className="text-sm">Total Tax Liability</span>
                <span className="text-sm">
                  {formatIndianCurrency(taxLiability)}
                </span>
              </div>
            </div>
          </div>

          {/* Taxes Paid Section */}
          {(shouldDisplay(taxSummary.tdsAmount) || shouldDisplay(taxSummary.advanceTaxPaid) || shouldDisplay(taxSummary.selfAssessmentTaxPaid)) && (
            <div className="p-5">
              <h3 className="text-base font-semibold text-primary flex items-center mb-3">
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Taxes Paid
              </h3>
              
              <div className="space-y-2">
                {shouldDisplay(taxSummary.tdsAmount) && (
                  <div className="flex justify-between py-1.5 px-1">
                    <span className="text-sm">TDS</span>
                    <span className="text-sm font-medium">
                      {formatIndianCurrency(taxSummary.tdsAmount)}
                    </span>
                  </div>
                )}
                
                {shouldDisplay(taxSummary.advanceTaxPaid) && (
                  <div className="flex justify-between py-1.5 px-1">
                    <span className="text-sm">Advance Tax Paid</span>
                    <span className="text-sm font-medium">
                      {formatIndianCurrency(taxSummary.advanceTaxPaid)}
                    </span>
                  </div>
                )}
                
                {shouldDisplay(taxSummary.selfAssessmentTaxPaid) && (
                  <div className="flex justify-between py-1.5 px-1">
                    <span className="text-sm">Self-Assessment Tax Paid</span>
                    <span className="text-sm font-medium">
                      {formatIndianCurrency(taxSummary.selfAssessmentTaxPaid)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold border-t border-dashed pt-2 mt-2">
                  <span className="text-sm">Total Taxes Paid</span>
                  <span className="text-sm">
                    {formatIndianCurrency(taxSummary.totalTaxPaid)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Final Tax Status */}
        <div className={`mx-5 my-6 p-4 rounded-lg font-medium ${
          taxSummary.refundDue > 0 
            ? "bg-green-50 text-green-600 border border-green-200" 
            : taxSummary.taxPayable > 0
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-gray-50 text-gray-600 border border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {taxSummary.refundDue > 0 ? (
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              ) : taxSummary.taxPayable > 0 ? (
                <ArrowDownRight className="h-5 w-5 mr-2 text-red-600" />
              ) : (
                <IndianRupee className="h-5 w-5 mr-2 text-gray-600" />
              )}
              <span>
                {taxSummary.refundDue > 0 
                  ? "REFUND DUE:" 
                  : taxSummary.taxPayable > 0
                  ? "TAX PAYABLE:"
                  : "TAX STATUS:"}
              </span>
            </div>
            <span className="text-lg">
              {taxSummary.refundDue > 0 
                ? formatIndianCurrency(taxSummary.refundDue)
                : taxSummary.taxPayable > 0
                ? formatIndianCurrency(taxSummary.taxPayable)
                : "NO TAX PAYABLE OR REFUND"}
            </span>
          </div>
        </div>

        <div className="mx-5 mb-5 text-xs text-muted-foreground bg-secondary/20 p-3 rounded-md">
          <p><strong>Note:</strong> This computation is based on information provided and is subject to verification by tax authorities. Figures are rounded to the nearest 10 rupees per Income Tax Act, 1961.</p>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t flex justify-between p-4">
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