# Indian Tax Calculator Specifications

This document outlines the specifications for a suite of Indian tax-related calculators, designed to assist users with various tax computation and planning needs in compliance with Indian tax laws.

## 1. Income Tax Calculator (Old/New Regime)

### 1.1. Name
Income Tax Calculator (Supporting Old and New Regimes)

### 1.2. Purpose
To calculate an individual's income tax liability under both the old and new tax regimes for a given financial year (e.g., FY 2023-24 / AY 2024-25, FY 2024-25 / AY 2025-26). This allows users to compare and choose the more financially beneficial tax regime.

### 1.3. Intended Functionality
*   Allows users to select the Assessment Year (AY).
*   The New Tax Regime (u/s 115BAC) is the default regime from AY 2024-25. Users can opt for the Old Regime.
*   Accepts inputs for various income sources: Salary, House Property, Capital Gains, Other Sources.
*   Accepts inputs for eligible deductions under both regimes.
*   Calculates Gross Total Income (GTI).
*   Applies relevant deductions based on the chosen regime and AY.
*   Calculates Net Taxable Income (NTI).
*   Applies applicable tax slabs and rates for both regimes, considering age for the Old Regime.
*   Calculates income tax, surcharge (if applicable), and Health & Education Cess.
*   Displays total tax payable under both regimes.
*   Provides a clear comparison, highlighting the regime with lower tax liability.

### 1.4. Required Inputs
*   **Assessment Year**: Dropdown (e.g., AY 2024-25, AY 2025-26).
*   **Taxpayer Category**: Dropdown (e.g., Individual, HUF - initially focus on Individual).
*   **Residential Status**: Dropdown (Resident, Non-Resident, Not Ordinarily Resident).
*   **Age (for Old Regime)**: Number (used for different slab rates for senior/super senior citizens).
*   **Income Details (Annualized, INR)**:
    *   Gross Salary (before deductions like professional tax, standard deduction)
    *   Exempt Allowances (e.g., HRA if calculated separately)
    *   Income from House Property (Let-out or Self-occupied; can be negative)
    *   Short-Term Capital Gains (STCG) (Specify if u/s 111A or other)
    *   Long-Term Capital Gains (LTCG) (Specify if u/s 112A or other)
    *   Income from Other Sources (e.g., savings bank interest, FD interest, dividends)
*   **Deductions (Annualized, INR)**:
    *   *For Old Regime (and limited for New Regime where applicable)*:
    *   Standard Deduction (from Salary/Pension - auto-applied: Rs. 50,000 for both regimes from AY 2024-25).
    *   Professional Tax.
    *   Section 80C (LIC, PPF, EPF, ELSS, Tuition Fees, Home Loan Principal, etc. - Max limit as per law).
    *   Section 80CCD(1B) (NPS self-contribution - Max Rs. 50,000).
    *   Section 80D (Medical Insurance Premium - limits vary by age).
    *   Section 80DD (Maintenance/medical treatment of disabled dependent).
    *   Section 80DDB (Medical expenditure on self or dependent for specified diseases).
    *   Section 80E (Interest on Education Loan).
    *   Section 80EEA/80EE (Interest on Home Loan for affordable housing - specific conditions).
    *   Section 80G (Donations - with qualifying limits).
    *   Section 80TTA (Interest on Savings Account - Max Rs. 10,000 for non-senior citizens).
    *   Section 80TTB (Interest income for Senior Citizens - Max Rs. 50,000).
    *   Section 24(b) (Interest on Housing Loan - for self-occupied/let-out property).
    *   Other applicable deductions with fields for amount and section.
    *   *For New Regime (AY 2024-25 onwards)*: Primarily Standard Deduction, employer's NPS contribution (80CCD(2)), deduction for family pension (Sec 57(iia)), Agniveer Corpus Fund (80CCH).

### 1.5. Expected Outputs
*   Gross Total Income (INR).
*   Total Deductions (Old Regime) (INR).
*   Total Deductions (New Regime) (INR).
*   Net Taxable Income (Old Regime) (INR).
*   Net Taxable Income (New Regime) (INR).
*   Income Tax (Old Regime) (INR).
*   Income Tax (New Regime) (INR).
*   Surcharge (Old Regime, if applicable) (INR).
*   Surcharge (New Regime, if applicable) (INR).
*   Health & Education Cess (Old Regime) (INR).
*   Health & Education Cess (New Regime) (INR).
*   Total Tax Payable (Old Regime) (INR).
*   Total Tax Payable (New Regime) (INR).
*   Rebate u/s 87A (Old Regime, if applicable) (INR).
*   Rebate u/s 87A (New Regime, if applicable - tax liability becomes nil if NTI up to Rs. 7 Lakhs for AY 2024-25) (INR).
*   Effective Tax Rate (Old/New) (%).
*   Recommendation: "New Regime offers lower tax of Rs. X" or "Old Regime offers lower tax of Rs. Y".

### 1.6. Core Calculation Logic & Tax Rules
*   **Assessment Year Specific Rules**: Tax slabs, deduction limits, surcharge rates, and rebate provisions are specific to the chosen AY.
*   **Old Regime**:
    *   Tax Slabs: Based on age (Below 60, 60-79, 80+).
    *   Deductions: As per Chapter VI-A, Standard Deduction, HRA, LTA, Home Loan Interest (Sec 24b), etc.
    *   Rebate u/s 87A: If NTI <= Rs. 5 Lakhs, rebate is tax amount or Rs. 12,500, whichever is less.
*   **New Regime (u/s 115BAC - Default from AY 2024-25)**:
    *   Tax Slabs (AY 2024-25): 0-3L: Nil; 3-6L: 5%; 6-9L: 10%; 9-12L: 15%; 12-15L: 20%; >15L: 30%.
    *   Deductions: Standard Deduction (Rs. 50,000 from salary/pension), employer's NPS contribution (80CCD(2)), family pension deduction (57(iia)), Agniveer Corpus Fund (80CCH).
    *   Rebate u/s 87A (AY 2024-25): If NTI <= Rs. 7 Lakhs, tax liability is nil. Marginal relief may apply slightly above Rs. 7 Lakhs.
*   **GTI**: Sum of incomes under all heads.
*   **NTI**: GTI - Applicable Deductions.
*   **Surcharge**: Applicable if NTI exceeds specified thresholds (e.g., Rs. 50L, 1Cr, 2Cr, 5Cr). Rates vary. Marginal relief applies. For AY 2024-25 (New Regime), highest surcharge is 25% (vs 37% in Old Regime).
*   **Health & Education Cess**: 4% on (Income Tax + Surcharge).
*   **References**: Income Tax Act, 1961; Annual Finance Acts; CBDT Circulars.

## 2. House Rent Allowance (HRA) Exemption Calculator

### 2.1. Name
House Rent Allowance (HRA) Exemption Calculator

### 2.2. Purpose
To calculate the portion of House Rent Allowance (HRA) received from an employer that is exempt from income tax under Section 10(13A) of the Income Tax Act, 1961.

### 2.3. Intended Functionality
*   Accepts inputs for basic salary, dearness allowance (DA) forming part of retirement benefits, HRA received, actual rent paid, and city type (metro/non-metro).
*   Calculates HRA exemption based on the three conditions specified in Rule 2A of Income Tax Rules.
*   Displays the exempt HRA amount and the taxable HRA amount.

### 2.4. Required Inputs
*   **Basic Salary**: (INR, Number) - Specify period (e.g., monthly, annually).
*   **Dearness Allowance (DA)** (forming part of salary for retirement benefits): (INR, Number) - Specify period.
*   **Commission** (as a fixed percentage of turnover achieved by the employee): (INR, Number) - Specify period.
*   **HRA Received from Employer**: (INR, Number) - Specify period.
*   **Actual Rent Paid by Employee**: (INR, Number) - Specify period.
*   **City of Residence**: Dropdown (Metro: Delhi, Mumbai, Kolkata, Chennai / Non-Metro).
*   **Period for which HRA is claimed**: (Number of months).

### 2.5. Expected Outputs
*   Salary for HRA Calculation (Basic + DA forming part + Commission as % of turnover) (INR).
*   HRA Exemption Condition 1: Actual HRA Received (INR).
*   HRA Exemption Condition 2: Rent Paid minus 10% of Salary (INR).
*   HRA Exemption Condition 3: 50% of Salary (Metro) or 40% of Salary (Non-Metro) (INR).
*   Exempt HRA Amount (Least of the three conditions above, for the relevant period) (INR).
*   Taxable HRA Amount (Actual HRA Received - Exempt HRA Amount) (INR).

### 2.6. Core Calculation Logic & Tax Rules
*   **Section 10(13A) of the Income Tax Act, 1961, read with Rule 2A of the Income Tax Rules.**
*   **Salary for HRA**: Basic Salary + Dearness Allowance (if it forms part of salary for computing retirement benefits) + Commission (if paid as a fixed percentage of turnover).
*   HRA exemption is the **minimum** of:
    1.  Actual HRA received.
    2.  Actual rent paid less 10% of salary.
    3.  50% of salary (for metro cities) or 40% of salary (for non-metro cities).
*   Calculation should be for the period during which rental accommodation was occupied and rent was paid. If any input parameters (salary, HRA, rent) change during the year, the calculation should be done on a pro-rata basis (e.g. monthly).

## 3. Capital Gains Tax Calculator

### 3.1. Name
Capital Gains Tax Calculator

### 3.2. Purpose
To calculate tax liability from the sale of capital assets (e.g., property, shares, mutual funds, gold), distinguishing between Short-Term Capital Gains (STCG) and Long-Term Capital Gains (LTCG) and applying relevant tax rates and indexation benefits.

### 3.3. Intended Functionality
*   Select asset type (e.g., Equity Shares (Listed/Unlisted), Equity MFs, Debt MFs, Property, Gold).
*   Input date of acquisition, date of sale, sale consideration, cost of acquisition, cost of improvement, and transfer expenses.
*   For listed shares/equity MFs, consider STT paid status.
*   Determine STCG/LTCG based on asset-specific holding periods.
*   Apply indexation (using Cost Inflation Index - CII) for LTCG where applicable.
*   Calculate STCG/LTCG and applicable tax.
*   Consider exemptions (e.g., Sec 54, 54F, 54EC) with input fields for reinvestments.

### 3.4. Required Inputs
*   **Type of Asset**: Dropdown (e.g., Listed Equity Shares (STT Paid), Unlisted Shares, Equity Oriented MFs (STT Paid), Debt MFs, Immovable Property, Gold, Other).
*   **Date of Acquisition**: (Date).
*   **Date of Sale**: (Date).
*   **Sale Consideration (Full Value)**: (INR, Number).
*   **Cost of Acquisition**: (INR, Number).
*   **Cost of Improvement (if any)**: (INR, Number).
*   **Expenses on Transfer (e.g., brokerage)**: (INR, Number).
*   **For LTCG on listed equity/equity MFs (Sec 112A)**: Fair Market Value as on Jan 31, 2018 (if acquired before Feb 1, 2018) (INR, Number).
*   **CII Data**: System should have updated CII table.
*   **Exemption Details**: (e.g., Amount invested u/s 54, 54F, 54EC).

### 3.5. Expected Outputs
*   Holding Period (Years, Months, Days).
*   Nature of Gain (STCG / LTCG).
*   Indexed Cost of Acquisition (for LTCG) (INR).
*   Indexed Cost of Improvement (for LTCG) (INR).
*   Gross Capital Gain (STCG or LTCG) (INR).
*   Exemptions Claimed (if any) (INR).
*   Net Taxable Capital Gain (INR).
*   Applicable Tax Rate (%).
*   Capital Gains Tax Payable (INR).

### 3.6. Core Calculation Logic & Tax Rules
*   **Holding Period for LTCG**:
    *   Listed Shares/Equity MFs (STT paid): >12 months.
    *   Unlisted Shares, Immovable Property: >24 months.
    *   Debt MFs:
        *   Units acquired **before April 1, 2023**: Holding period >36 months for LTCG (indexation available).
        *   Units acquired **on or after April 1, 2023**:
            *   If the mutual fund invests **not more than 35%** of its total proceeds in equity shares of domestic companies: Gains are treated as Short-Term Capital Gains (STCG) and taxed at applicable slab rates, irrespective of the holding period. No indexation benefit is available.
            *   If the mutual fund invests **more than 35%** (but typically less than 65% for it to remain debt-oriented) in equity shares of domestic companies: The holding period of >36 months for LTCG with indexation benefit may still apply (this needs careful checking based on fund type).
    *   Gold, Other Assets: >36 months.
*   **Indexation (Sec 48)**: `Cost * (CII of year of sale / CII of year of acquisition/improvement)`. Not for STCG, Sec 112A gains, or bonds (except capital indexed bonds by RBI), or for debt MFs specified above taxed at slab rates.
*   **STCG Tax Rates**:
    *   Sec 111A: 15% (+cess, surcharge) for STCG on STT-paid listed equity/equity MFs.
    *   Other STCG: Added to income, taxed at slab rates.
*   **LTCG Tax Rates**:
    *   Sec 112A: 10% (+cess, surcharge) on LTCG > Rs. 1 lakh from STT-paid listed equity/equity MFs (no indexation). Grandfathering for pre-Feb 1, 2018 acquisitions.
    *   Sec 112:
        *   20% (+cess, surcharge) with indexation for property, gold, unlisted shares, eligible debt MFs (units acquired before April 1, 2023).
        *   10% without indexation for certain listed securities (if not under 112A and beneficial).
*   **Exemptions**: Sec 54, 54B, 54EC, 54F, etc., subject to conditions.
    *   **Important Note (Finance Act 2023, applicable from AY 2024-25):** For capital gains arising from the transfer of a residential house (Sec 54) or any long-term capital asset other than a residential house (Sec 54F) on or after April 1, 2023, if the cost of the new asset (residential house) purchased/constructed for claiming exemption is more than Rs. 10 crore, the cost for the purpose of such exemption will be deemed to be Rs. 10 crore.
*   **References**: Income Tax Act, 1961 (Sec 2(14), 2(29A), 2(42A), 45, 48, 49, 54 series, 111A, 112, 112A), CII Notifications, Finance Acts.

## 4. Goods and Services Tax (GST) Calculator

### 4.1. Name
Goods and Services Tax (GST) Calculator

### 4.2. Purpose
To calculate GST amount (CGST, SGST/UTGST, IGST) and the final price of goods/services, or to derive the base price from a GST-inclusive price (reverse GST).

### 4.3. Intended Functionality
*   Option for "Add GST" (calculate GST on base price) or "Remove GST" (extract GST from gross price).
*   Input base amount (for Add GST) or gross amount (for Remove GST).
*   Input GST rate (e.g., 0%, 5%, 12%, 18%, 28%).
*   Distinguish between Intra-State (CGST + SGST/UTGST) and Inter-State (IGST) transactions.
*   Display GST components and net/gross price.

### 4.4. Required Inputs
*   **Calculation Type**: Radio/Dropdown (Add GST / Remove GST).
*   **Amount**: (INR, Number) - Base Amount for "Add GST", Gross Amount for "Remove GST".
*   **GST Rate (%)**: Dropdown/Input (0, 3, 5, 12, 18, 28, or custom).
*   **Transaction Type (Optional)**: Dropdown (Intra-State / Inter-State). Default to Intra-State.

### 4.5. Expected Outputs
*   **If "Add GST"**:
    *   Base Amount (INR).
    *   GST Rate (%).
    *   CGST Amount (INR) (if Intra-State).
    *   SGST/UTGST Amount (INR) (if Intra-State).
    *   IGST Amount (INR) (if Inter-State).
    *   Total GST Amount (INR).
    *   Gross Price (Base Amount + Total GST) (INR).
*   **If "Remove GST"**:
    *   Gross Amount (INR).
    *   GST Rate (%).
    *   Base Price (Net Price) (INR).
    *   CGST Amount (INR) (if Intra-State).
    *   SGST/UTGST Amount (INR) (if Intra-State).
    *   IGST Amount (INR) (if Inter-State).
    *   Total GST Amount (INR).

### 4.6. Core Calculation Logic & Tax Rules
*   **GST Rates**: As per GST Council notifications.
*   **Add GST**:
    *   `Total_GST_Amount = Base_Amount * (GST_Rate / 100)`
    *   `Gross_Price = Base_Amount + Total_GST_Amount`
    *   Intra-State: `CGST = Total_GST_Amount / 2`, `SGST/UTGST = Total_GST_Amount / 2`
    *   Inter-State: `IGST = Total_GST_Amount`
*   **Remove GST**:
    *   `Base_Price = Gross_Amount / (1 + (GST_Rate / 100))`
    *   `Total_GST_Amount = Gross_Amount - Base_Price`
    *   Intra-State: `CGST = Total_GST_Amount / 2`, `SGST/UTGST = Total_GST_Amount / 2`
    *   Inter-State: `IGST = Total_GST_Amount`
*   **References**: CGST Act, SGST/UTGST Act, IGST Act.

## 5. Advance Tax Calculator

### 5.1. Name
Advance Tax Calculator

### 5.2. Purpose
To help taxpayers estimate their annual income tax liability and calculate advance tax installments due during the financial year, thereby avoiding interest under sections 234B and 234C of the Income Tax Act.

### 5.3. Intended Functionality
*   Select Assessment Year and Taxpayer Category (initially Individual).
*   Input estimated annual income from all sources and eligible deductions.
*   Choose tax regime (Old/New).
*   Calculate estimated annual tax liability (including surcharge, cess).
*   Subtract TDS/TCS already deducted/collected.
*   Determine net advance tax payable and display installment amounts with due dates.
*   Optionally, calculate interest u/s 234B & 234C for short/deferred payments.

### 5.4. Required Inputs
*   **Assessment Year**: Dropdown.
*   **Taxpayer Category**: Dropdown (Individual, HUF, etc.).
*   **Age (if Old Regime)**: Number.
*   **Estimated Annual Income (INR, Number)**:
    *   Salary (after standard deduction).
    *   House Property Income.
    *   Business/Profession Income (PGBP).
    *   Capital Gains (STCG, LTCG - can be a consolidated estimate).
    *   Other Sources Income.
    *   Agricultural Income (for rate purposes).
*   **Estimated Deductions (Chapter VI-A)**: (INR, Number).
*   **Tax Regime**: Dropdown (Old / New).
*   **TDS/TCS already deducted/collected**: (INR, Number).
*   **(Optional for interest calculation)** Advance tax paid for each installment (Q1-Q4 amounts).

### 5.5. Expected Outputs
*   Estimated Gross Total Income (INR).
*   Estimated Total Deductions (INR).
*   Estimated Net Taxable Income (INR).
*   Estimated Annual Income Tax (incl. surcharge, cess) (INR).
*   Less: TDS/TCS (INR).
*   Net Advance Tax Payable (INR).
*   **Advance Tax Installments (for Individuals/HUFs not under presumptive tax)**:
    *   1st (by June 15): Amount (>= 15% of advance tax) (INR).
    *   2nd (by Sept 15): Amount (>= 45% cumulative) (INR).
    *   3rd (by Dec 15): Amount (>= 75% cumulative) (INR).
    *   4th (by Mar 15): Amount (100% cumulative) (INR).
*   **(Optional)** Interest u/s 234B (short/non-payment) (INR).
*   **(Optional)** Interest u/s 234C (deferment of installments) (INR).

### 5.6. Core Calculation Logic & Tax Rules
*   **Applicability (Sec 208)**: If estimated tax liability >= Rs. 10,000. Senior citizens (60+) without PGBP income are exempt (Sec 207).
*   **Income Estimation & Tax Calculation**: As per Income Tax Calculator logic for chosen regime.
*   **Net Advance Tax**: Estimated Annual Tax - TDS/TCS.
*   **Installment Percentages (Sec 211) - Payment Liability**:
    *   Non-presumptive taxpayers: By June 15 (>=15% of total advance tax), by Sep 15 (>=45% cumulative), by Dec 15 (>=75% cumulative), by Mar 15 (100% cumulative).
    *   Presumptive (44AD/44ADA): 100% by Mar 15.
*   **Interest u/s 234B**: @1% p.m. or part thereof if advance tax paid is less than 90% of assessed tax.
*   **Interest u/s 234C**: @1% p.m. for shortfall in installment payments.
    *   Interest applies if tax paid by June 15 is < 12% of total advance tax (for 3 months).
    *   Interest applies if tax paid by Sep 15 is < 36% of total advance tax (cumulative, for 3 months on shortfall).
    *   Interest applies if tax paid by Dec 15 is < 75% of total advance tax (cumulative, for 3 months on shortfall).
    *   Interest applies if tax paid by Mar 15 is < 100% of total advance tax (cumulative, for 1 month on shortfall).
    *   (Note: Shortfall is calculated based on the difference from 15%, 45%, 75%, 100% respectively for payment, but interest trigger points are 12% and 36% for the first two installments).
*   **References**: Income Tax Act, 1961 (Sec 207-211, 234B, 234C).

## 6. Tax Deducted at Source (TDS) Calculator

### 6.1. Name
Tax Deducted at Source (TDS) Calculator

### 6.2. Purpose
To calculate the amount of Tax Deducted at Source (TDS) applicable on various types of payments as per the Income Tax Act, 1961. This helps both deductors and deductees understand TDS obligations.

### 6.3. Intended Functionality
*   User selects the nature of payment (e.g., Salary, Interest from Banks, Rent, Professional Fees, Commission, etc.).
*   User inputs the total payment amount and specifies if PAN is furnished by the deductee.
*   The calculator determines the applicable TDS section, threshold limit, and TDS rate.
*   Calculates the TDS amount.
*   Considers lower/nil deduction certificates if applicable.

### 6.4. Required Inputs
*   **Assessment Year**: Dropdown (e.g., AY 2024-25, AY 2025-26).
*   **Nature of Payment**: Dropdown (e.g., Salary (Sec 192), Interest on Securities (Sec 193), Dividends (Sec 194), Interest other than Interest on Securities (Sec 194A), Winnings from Lottery (Sec 194B), Winnings from Horse Race (Sec 194BB), Payments to Contractors (Sec 194C), Insurance Commission (Sec 194D), Rent (Sec 194-I), Fees for Professional or Technical Services (Sec 194J), Compensation on acquisition of Immovable Property (Sec 194LA), Payment of accumulated balance of PF (Sec 192A), Purchase of Goods (Sec 194Q), Benefit/Perquisite from Business/Profession (Sec 194R), Payment on transfer of Virtual Digital Asset (Sec 194S), etc.).
*   **Payment Amount**: (INR, Number).
*   **PAN Status of Deductee**: Dropdown (PAN Available / PAN Not Available).
*   **Is Deductee a 'Specified Person' u/s 206AB?** (Non-filer of ITR with prior high TDS/TCS): Yes/No.
*   **Residential Status of Deductee**: Dropdown (Resident / Non-Resident - for some sections).
*   **Is Lower/Nil Deduction Certificate (Sec 197) applicable?**: Yes/No.
    *   If Yes: **Prescribed TDS Rate**: (%, Number).

### 6.5. Expected Outputs
*   Applicable TDS Section.
*   Threshold Limit for the selected payment type (INR).
*   Applicable TDS Rate (%).
*   Calculated TDS Amount (INR).
*   Note on higher TDS rate if PAN is not available (Sec 206AA).
*   Note on TDS rate for non-residents if applicable.

### 6.6. Core Calculation Logic & Tax Rules
*   **TDS Sections & Rates**: Based on Chapter XVII-B of the Income Tax Act, 1961. Rates are subject to change by Finance Acts.
    *   Sec 192 (Salary): Calculated based on estimated income and tax liability of the employee for the year.
    *   Sec 194A (Interest other than "Interest on securities"): 10%. Thresholds: Rs. 40,000 for banks/co-op banks/post offices (Rs. 50,000 for senior citizens); Rs. 5,000 for other interest.
    *   Sec 194C (Contractors): 1% (Ind/HUF), 2% (Others). Thresholds: Single transaction > Rs. 30,000 or aggregate > Rs. 1,00,000 p.a.
    *   Sec 194H (Commission/Brokerage): 5%. Threshold Rs. 15,000 p.a.
    *   Sec 194-I (Rent): Plant & Machinery/Equipment - 2%; Land/Building/Furniture/Fittings - 10%. Threshold Rs. 2,40,000 p.a.
    *   Sec 194J (Fees for Professional or Technical Services):
        *   Fees for Technical Services (FTS) (not being professional services), Royalty for sale/distribution/exhibition of cinematographic films, payment to Call Centers: 2%.
        *   Fees for Professional Services (FPS), other Royalty: 10%.
        *   Threshold: Rs. 30,000 p.a. separately for FTS, FPS, royalty, non-compete fees.
    *   Sec 194Q (Purchase of Goods): 0.1%. Applicable if buyer's turnover > Rs. 10 Cr in preceding FY and purchases from a resident seller > Rs. 50 lakhs in a FY. (Effective July 1, 2021).
    *   Sec 194R (Benefit or Perquisite from Business/Profession): 10%. Threshold: Aggregate value > Rs. 20,000 in a FY. (Effective July 1, 2022).
    *   Sec 194S (Payment on transfer of Virtual Digital Asset - VDA): 1%. Thresholds: Rs. 50,000 p.a. (for specified persons like Ind/HUF with certain turnover/receipts) or Rs. 10,000 p.a. (for others). (Effective July 1, 2022).
*   **PAN Not Available (Sec 206AA)**: TDS at the higher of: (a) rate specified in the relevant provision; or (b) rates in force; or (c) 20%.
*   **Higher TDS for Non-Filers of ITR (Sec 206AB)**: If deductee is a 'specified person' (has not filed ITR for relevant AY and aggregate TDS/TCS >= Rs. 50,000), TDS rate is higher of: (a) twice the rate in Act; (b) twice the rate in force; or (c) 5%. Sec 206AB overrides Sec 206AA if both apply. (Not applicable if TDS is u/s 192, 192A, 194B, 194BB, 194LBC, 194N).
*   **Lower/Nil Deduction (Sec 197)**: If certificate is obtained, TDS at the rate specified in the certificate.
*   **Surcharge/Cess on TDS**: Generally not applicable on TDS for domestic transactions with residents, unless specified (e.g., salary TDS includes these). For non-residents, surcharge and cess may apply on the TDS amount.
*   **References**: Income Tax Act, 1961 (Chapter XVII-B, Sec 206AA, Sec 206AB, Sec 197), CBDT Circulars, Finance Acts.

## 7. Provident Fund (PF/EPF) Calculator

### 7.1. Name
Employees' Provident Fund (EPF) Calculator

### 7.2. Purpose
To estimate the EPF corpus accumulated at the time of retirement or withdrawal, considering employee and employer contributions and accrued interest.

### 7.3. Intended Functionality
*   Accepts current age, retirement age, basic salary + dearness allowance (DA), employee & employer contribution rates, current EPF balance, and expected annual salary increase.
*   Projects year-on-year contributions and interest accumulation.
*   Displays the estimated total EPF corpus at retirement.
*   Option to show breakdown of employee contribution, employer contribution, and total interest earned.

### 7.4. Required Inputs
*   **Current Age**: (Years, Number).
*   **Retirement Age**: (Years, Number).
*   **Basic Salary + Dearness Allowance (DA) per month**: (INR, Number).
*   **Employee's EPF Contribution Rate**: (%, Number, Default 12%).
*   **Employer's EPF Contribution Rate**: (%, Number, Default 12% - system to handle EPS split).
*   **Current EPF Balance (Optional)**: (INR, Number).
*   **Expected Annual Salary Increase Rate**: (%, Number).
*   **Current EPF Interest Rate**: (%, Number - system should have latest rate, allow override).

### 7.5. Expected Outputs
*   Total Years of Contribution.
*   Total Employee Contribution (INR).
*   Total Employer Contribution (to EPF, excluding EPS) (INR).
*   Total Interest Earned (INR).
*   Estimated EPF Corpus at Retirement (INR).
*   Year-wise projection table (Optional).

### 7.6. Core Calculation Logic & Tax Rules
*   **Contribution**:
    *   Employee: Typically 12% of Basic + DA.
    *   Employer: 12% of Basic + DA.
*   **EPS Diversion**: From employer's share, 8.33% of salary (capped at Rs. 15,000/month, so max EPS contribution is Rs. 1,250/month) goes to Employees' Pension Scheme (EPS). The remaining part of the employer's contribution goes to EPF.
    *   If Basic+DA <= Rs. 15,000: Employer EPS = 8.33% * (Basic+DA). Employer EPF = (12% - 8.33%) * (Basic+DA).
    *   If Basic+DA > Rs. 15,000: Employer EPS = Rs. 1,250. Employer EPF = (12% * (Basic+DA)) - Rs. 1,250.
*   **Interest**: Compounded annually. Calculated on monthly running balance. For simplicity, calculator can use average annual balance or opening balance + half of year's contribution. Official EPF interest is declared by EPFO annually.
*   **Salary Growth**: Applied annually to Basic + DA.
*   **Taxability**:
    *   Employee's contribution: Eligible for Sec 80C deduction.
    *   Employer's contribution to EPF: Exempt up to 12% of salary. Excess is taxable. (Note: Aggregate limit of Rs. 7.5 lakh p.a. for employer contribution to NPS, superannuation fund and EPF, and any accrued interest/dividend on such excess contribution is taxable - Sec 17(2)(vii) & 17(2)(viia)).
    *   Interest: Exempt if certain conditions met (e.g., 5 years continuous service, or specific reasons for withdrawal). Interest on employee's contribution exceeding Rs. 2.5 lakh (Rs. 5 lakh for govt employees/no employer contribution) p.a. is taxable.
*   **References**: Employees' Provident Funds and Miscellaneous Provisions Act, 1952; Income Tax Act, 1961 (Sec 80C, Sec 10(11), 10(12), 17(2)).

## 8. Public Provident Fund (PPF) Calculator

### 8.1. Name
Public Provident Fund (PPF) Calculator

### 8.2. Purpose
To estimate the maturity value of a PPF account and the interest earned over the investment tenure.

### 8.3. Intended Functionality
*   Accepts annual or monthly investment amount, current PPF interest rate, and investment duration.
*   Calculates year-wise interest and closing balance.
*   Displays total investment, total interest earned, and maturity value.
*   Handles initial 15-year lock-in and extensions in blocks of 5 years.

### 8.4. Required Inputs
*   **Investment Amount per Year**: (INR, Number). (Or monthly, then convert to annual).
*   **Current PPF Interest Rate**: (%, Number - system should have latest rate, allow override).
*   **Investment Frequency**: Dropdown (Annual / Monthly).
*   **Start Year/Age (Optional for timeline)**.
*   **Duration of Investment**: (Years, Number - Default 15, allow extension in blocks of 5).
*   **Current PPF Balance (if existing account)**: (INR, Number).

### 8.5. Expected Outputs
*   Total Principal Invested (INR).
*   Total Interest Earned (INR).
*   Maturity Value (INR).
*   Year-wise projection table showing opening balance, investment, interest, closing balance (Optional).

### 8.6. Core Calculation Logic & Tax Rules
*   **Investment Limits**: Min Rs. 500 p.a., Max Rs. 1,50,000 p.a.
*   **Interest Calculation**: Compounded annually. Calculated on the lowest balance in the account between the close of the 5th day and the last day of every month. For annual calculation simplicity, interest can be calculated on the previous year's closing balance + current year's full contribution (if made at start of year) or appropriately weighted.
*   **Interest Rate**: Set by Government quarterly.
*   **Tenure**: 15 years. Can be extended in blocks of 5 years indefinitely.
*   **Taxability**:
    *   Contribution: Eligible for Sec 80C deduction (up to Rs. 1.5 lakh).
    *   Interest Earned: Fully exempt from tax (EEE - Exempt, Exempt, Exempt status).
    *   Maturity Amount: Fully exempt from tax.
*   **References**: Public Provident Fund Scheme, 1968 (now Public Provident Fund Scheme, 2019); Income Tax Act, 1961 (Sec 80C, Sec 10(11)).

## 9. Gratuity Calculator

### 9.1. Name
Gratuity Calculator

### 9.2. Purpose
To calculate the amount of gratuity payable to an employee upon retirement, resignation, death, or disablement, as per the Payment of Gratuity Act, 1972 or employer's policy.

### 9.3. Intended Functionality
*   Accepts last drawn basic salary + dearness allowance (DA), and total years of service.
*   Option to specify if the employee is covered under the Payment of Gratuity Act, 1972.
*   Calculates gratuity amount based on the applicable formula.
*   Highlights the tax-exempt portion of gratuity.

### 9.4. Required Inputs
*   **Last Drawn Basic Salary (per month)**: (INR, Number).
*   **Last Drawn Dearness Allowance (DA) (per month)**: (INR, Number).
*   **Number of Years of Service**: (Years, Number - e.g., 10.7 for 10 years and 7 months).
*   **Is the employee covered under the Payment of Gratuity Act, 1972?**: Dropdown (Yes / No).

### 9.5. Expected Outputs
*   Calculated Gratuity Amount (INR).
*   Tax-Exempt Gratuity Amount (INR).
*   Taxable Gratuity Amount (INR).

### 9.6. Core Calculation Logic & Tax Rules
*   **Eligibility**: Generally after 5 years of continuous service (not applicable in case of death/disablement).
*   **Calculation Formula**:
    *   **If covered under Payment of Gratuity Act, 1972**:
        *   Gratuity = `(Last Drawn Basic + DA) * (15/26) * Number of Years of Service`
        *   "Number of Years of Service": Rounded off to the nearest full year (e.g., 6 months or more is rounded to next year, less than 6 months is ignored for the last year of service, but full completed years are always counted). For example, 10 years and 7 months = 11 years. 10 years and 5 months = 10 years.
    *   **If NOT covered under Payment of Gratuity Act, 1972**:
        *   Gratuity = `(Average Salary for last 10 months (Basic + DA)) * (15/30) * Number of Completed Years of Service`
        *   "Number of Completed Years of Service": Only full completed years are considered. Fractions are ignored.
*   **Tax Exemption (Sec 10(10))**: Least of the following is exempt:
    1.  Statutory limit: Rs. 20,00,000 (This limit was increased from Rs. 10 lakhs).
    2.  Actual gratuity received.
    3.  Gratuity calculated as per the formula (15/26 or 15/30 method as applicable).
*   **For Government Employees**: Gratuity received is fully exempt.
*   **References**: Payment of Gratuity Act, 1972; Income Tax Act, 1961 (Sec 10(10)).
