# Comprehensive Indian Income Tax Calculator Logic (AY 2024–25 to 2026–27)

## Overview of Tax Regimes and Assessee Categories

**Old vs New Regime:** India currently has two parallel tax regimes for individuals and certain non-corporate taxpayers – the traditional Old Regime and the optional New Regime (under Section 115BAC). The Old Regime offers various exemptions and deductions (like HRA, LTA, Chapter VI-A deductions, etc.) with higher tax slab rates. The New Regime features lower slab rates but disallows most exemptions/deductions. Starting AY 2024-25, the New Regime is the default for individuals, HUFs, AOP/BOI (non-cooperative) and artificial juridical persons, though one can opt out to the Old Regime if beneficial. Taxpayers without business income can toggle between regimes each year, whereas those with business/professional income can switch back to Old Regime only once after opting for New Regime, with restrictions on switching again.

**Assessee Types Covered:** The calculator must handle all taxpayer categories:
*   Individuals (Residents and Non-residents, classified by age: below 60, Senior Citizens 60–79, Super Senior 80+)
*   Hindu Undivided Families (HUF)
*   Partnership Firms and LLPs
*   Domestic Companies and Foreign Companies
*   Co-operative Societies
*   Local Authorities
*   Association of Persons (AOP) / Body of Individuals (BOI) and Artificial Juridical Persons (AJP)

Each category has distinct tax rate structures, surcharge thresholds, and applicable deductions, as detailed below.

## Tax Slab Rates by Assessment Year and Regime

### Individuals (Residents & Non-Residents)

#### Old Regime Slabs (for AY 2024-25, 2025-26, 2026-27):
(No changes were made to old regime slabs in recent budgets). Tax rates vary by age group for residents, due to higher basic exemptions for seniors. Non-residents are taxed as per below-60 slabs without higher exemptions.

*   **Individuals < 60 years (and all Non-residents):**
    *   Up to ₹2,50,000: Nil tax
    *   ₹2,50,001 – ₹5,00,000: 5% of income above ₹2,50,000
    *   ₹5,00,001 – ₹10,00,000: 20% of income above ₹5,00,000
    *   Above ₹10,00,000: 30% of income above ₹10,00,000
*   **Senior Citizens (Age 60–79, Resident):** Basic exemption is ₹3,00,000
    *   Up to ₹3,00,000: Nil tax
    *   ₹3,00,001 – ₹5,00,000: 5% of income above ₹3,00,000
    *   ₹5,00,001 – ₹10,00,000: 20% of income above ₹5,00,000
    *   Above ₹10,00,000: 30% of income above ₹10,00,000
*   **Super Senior Citizens (Age 80+, Resident):** Basic exemption is ₹5,00,000
    *   Up to ₹5,00,000: Nil tax
    *   ₹5,00,001 – ₹10,00,000: 20% of income above ₹5,00,000
    *   Above ₹10,00,000: 30% of income above ₹10,00,000

(Standard deduction of ₹50,000 from salary is available in the Old Regime as discussed later. The above slabs apply on taxable income after deductions.)

#### New Regime Slabs:
The New Regime slab rates have undergone changes in recent years to widen income bands and increase the basic exemption limit. The calculator should apply the correct slab set based on the Assessment Year:

*   **AY 2024-25 (FY 2023-24):** New Regime as introduced by Finance Act 2023:
    *   Up to ₹3,00,000: Nil tax
    *   ₹3,00,001 – ₹6,00,000: 5% of income above ₹3,00,000
    *   ₹6,00,001 – ₹9,00,000: 10% of income above ₹6,00,000
    *   ₹9,00,001 – ₹12,00,000: 15% of income above ₹9,00,000
    *   ₹12,00,001 – ₹15,00,000: 20% of income above ₹12,00,000
    *   Above ₹15,00,000: 30% of income above ₹15,00,000
    (This regime has a basic exemption of ₹3L irrespective of age. Note: Although tax is calculated on income above ₹3L, a rebate effectively ensures zero tax on income up to ₹7L – see Section 87A details below.)

*   **AY 2025-26 (FY 2024-25):** Revised New Regime after Budget 2024 changes (effective 1 Apr 2024):
    *   Up to ₹3,00,000: Nil tax
    *   ₹3,00,001 – ₹7,00,000: 5% of income above ₹3,00,000
    *   ₹7,00,001 – ₹10,00,000: 10% of income above ₹7,00,000
    *   ₹10,00,001 – ₹12,00,000: 15% of income above ₹10,00,000
    *   ₹12,00,001 – ₹15,00,000: 20% of income above ₹12,00,000
    *   Above ₹15,00,000: 30% of income above ₹15,00,000
    (These changes widened the 5% slab to ₹7L, aligning with the ₹7L rebate limit. Standard deduction for salary/pension was also increased – discussed later. The basic exemption remains ₹3L.)

*   **AY 2026-27 (FY 2025-26):** Proposed New Regime slabs announced in Budget 2025 (effective 1 Apr 2025):
    *   Up to ₹4,00,000: Nil tax
    *   ₹4,00,001 – ₹8,00,000: 5% of income above ₹4,00,000
    *   ₹8,00,001 – ₹12,00,000: 10% of income above ₹8,00,000
    *   ₹12,00,001 – ₹16,00,000: 15% of income above ₹12,00,000
    *   ₹16,00,001 – ₹20,00,000: 20% of income above ₹16,00,000
    *   ₹20,00,001 – ₹24,00,000: 25% of income above ₹20,00,000
    *   Above ₹24,00,000: 30% of income above ₹24,00,000
    (The basic exemption is proposed to increase to ₹4L. This regime further reduces tax for middle incomes; e.g. zero tax effectively up to ₹12L after rebate. No changes were proposed in Old Regime slabs for FY 2025-26.)

### HUF (Hindu Undivided Family):
An HUF is taxed in the same slab structure as an individual below 60 years. Under Old Regime, ₹2.5L basic exemption applies; under New Regime, ₹3L (or ₹4L from AY 2026-27) basic exemption applies. HUFs can opt for the New Regime similarly with conditions.

### AOP/BOI and Artificial Juridical Person:
By default (Old Regime), if the member shares are determinate and no member has income above the basic exemption, slab rates same as individuals apply. However, maximum marginal rate (MMR) applies in many cases: If any member’s share is indeterminate or any member is taxed at a rate higher than normal (e.g. a corporate member), the AOP/BOI’s entire income may be taxed at 30% plus applicable surcharge and cess. Under New Regime (made available to AOP/BOI/AJP from AY 2024-25), the same new slabs for individuals/HUF apply (with ₹3L basic exemption etc.), but note that an AOP consisting only of corporate members has a surcharge capped at 15% by law.

### Firms, Companies, Co-operatives, and Others
These taxpayers have flat tax rates (no slab system under the regular regime).

*   **Partnership Firms & LLPs:** Taxed at a flat 30% on total taxable income. No basic exemption.
*   **Local Authorities:** Taxed at a flat 30% of taxable income. Surcharge 12% applies if income > ₹1 crore.
*   **Domestic Companies:**
    *   **Standard Rates:** 30% base tax. If turnover in a recent specified year <= ₹400 crore, reduced rate of 25% applies.
    *   **Optional Concessional Rates:**
        *   Section 115BAA (from AY 2020-21): 22% flat tax rate (plus 10% surcharge) if specified exemptions/deductions are foregone.
        *   Section 115BAB (from AY 2020-21): 15% flat tax rate (plus 10% surcharge) for new manufacturing companies incorporated on/after 1 Oct 2019, commencing production by 31 Mar 2024, and meeting conditions.
    If opting for 115BAA or 115BAB, surcharge is fixed 10% irrespective of income. Otherwise, normal corporate surcharge rates (7%/12%) apply.
*   **Foreign Companies:** Taxed at a base rate of 40% on taxable income.
*   **Co-operative Societies:**
    *   **Regular Regime (Old):**
        *   Up to ₹10,000: 10%
        *   ₹10,001 – ₹20,000: 20% (tax on income over ₹10k)
        *   Above ₹20,000: 30% of income above ₹20k
    *   **Optional Regimes:**
        *   Section 115BAD (from AY 2021-22): 22% flat (plus 10% surcharge).
        *   Section 115BAE (from AY 2024-25): New manufacturing co-ops can opt for 15% tax on manufacturing income and 22% on other income, with 10% surcharge.

## Income Heads Calculation Logic

### 1. Salary Income (Including Pension)
*   Sum gross salary.
*   **Old Regime:** Deduct exempt allowances (HRA, LTA, etc.).
*   **New Regime:** Most allowances are taxable.
*   **Standard Deduction:**
    *   AY 2024-25: ₹50,000 (both regimes).
    *   AY 2025-26 onward (New Regime): ₹75,000 for salary/pension. (Old Regime remains ₹50,000).
*   **Professional Tax:** Deduct if paid (Old Regime only).
*   **Family Pension:** Deduction of ₹15,000 or 1/3rd of pension (Old Regime). In New Regime, ₹15,000 deduction as part of standard deduction.

### 2. Income from House Property
*   **Let-Out Property:** Annual Rental Value - Municipal Taxes = Net Annual Value (NAV). Standard Deduction @ 30% of NAV. Deduct full Interest on Housing Loan.
*   **Self-Occupied Property (up to 2):** Annual Value = Nil. Deduct interest on home loan up to ₹2,00,000.
*   Loss from house property can be set off against other heads up to ₹2,00,000.

### 3. Capital Gains
*   Determine Short-Term (STCG) or Long-Term (LTCG) based on asset type and holding period.
*   Gain = Sale Price – Cost of Acquisition (indexed for eligible LTCG) – Expenses.
*   **LTCG Tax Rates:**
    *   Listed Equity Shares/Equity MFs (Sec 112A): 10% on LTCG > ₹1 lakh. (Grandfathering for assets pre-31 Jan 2018).
    *   Other LTCG (Real Estate, Gold, etc.): 20% with indexation.
*   **STCG Tax Rates:**
    *   Equity STCG (Sec 111A): 15% (check for AY-specific changes).
    *   Other STCG: Taxed at normal slab rates.
*   Capital losses set-off rules apply. Section 54/54F exemptions for reinvestment can reduce taxable gain.

### 4. Profits and Gains of Business or Profession
*   Taxable on Net Profit as per tax provisions.
*   Presumptive Taxation (44AD, 44ADA, 44AE) can be applied.
*   **New Regime:** Forgo certain business deductions (Sec 35, 35AD, 10AA).
*   Business loss can be set off against other heads (except salary).

### 5. Income from Other Sources
*   **Interest Income:** Taxable at slab rates.
    *   **Old Regime:** Deduction 80TTA (₹10k for non-seniors on savings interest) or 80TTB (₹50k/₹1L for seniors on bank/PO interest).
    *   **New Regime:** No 80TTA/TTB.
*   **Dividend Income:** Taxable at slab rates.
*   **Winnings from Lottery, Games, etc. (Sec 115BB):** Flat 30% tax. No deductions or 87A rebate on this income. Surcharge capped at 15%.

## Chapter VI-A Deductions (Old Regime)
(Most are disallowed in New Regime, except 80CCD(2) and 80JJAA)
*   **Section 80C, 80CCC, 80CCD(1):** Combined limit ₹1,50,000 (PF, LIC, ELSS, etc.).
*   **Section 80CCD(1B):** Additional ₹50,000 for NPS (self).
*   **Section 80D:** Medical Insurance. Self/family: ₹25k (₹50k if senior). Parents: ₹25k (₹50k if senior).
*   **Section 80G:** Donations (percentage-based, with/without qualifying limits).
*   **Section 80TTA/TTB:** (Covered under Other Sources).
*   **Section 80E:** Interest on Education Loan (full amount).
*   **Section 80DD/80U:** Disability related (flat deductions).
*   **Section 80GG:** Rent paid if no HRA (max ₹60k, conditions apply).

## Tax Computation and Surcharge/Cess
Order: Compute base tax, add surcharge, apply rebate (Sec 87A), then add cess.

### 1. Apply Tax Rates:
*   **Individuals/HUF/AOP:** Use applicable slab rates for chosen regime/AY.
*   **Firms/Local Authority:** Flat 30%.
*   **Companies/Co-ops:** Apply relevant flat rates or slab (for co-op old regime).
*   Compute tax on special rate incomes (LTCG, STCG, Lottery) separately.

### 2. Surcharge:
*   **Individuals/HUF/AOP/BOI (Old Regime):**
    *   > ₹50L: 10%
    *   > ₹1Cr: 15%
    *   > ₹2Cr: 25%
    *   > ₹5Cr: 37%
    (Max surcharge on LTCG 111A/112/112A & dividends capped at 15%).
*   **Individuals/HUF/AOP/BOI (New Regime):**
    *   > ₹50L: 10%
    *   > ₹1Cr: 15%
    *   > ₹2Cr: 25% (Max)
*   **Partnership Firms/LLP & Local Authorities:** 12% if income > ₹1Cr.
*   **Domestic Companies (not 115BAA/BAB):**
    *   > ₹1Cr to ₹10Cr: 7%
    *   > ₹10Cr: 12%
    (If 115BAA/BAB opted: flat 10% surcharge).
*   **Foreign Companies:**
    *   > ₹1Cr to ₹10Cr: 2%
    *   > ₹10Cr: 5%
*   **Co-operative Societies (Regular):**
    *   > ₹1Cr to ₹10Cr: 7%
    *   > ₹10Cr: 12%
    (If 115BAD/BAE opted: flat 10% surcharge).
*   **Marginal Relief:** Applicable if surcharge/loss of rebate causes tax to jump disproportionately.

### 3. Rebate under Section 87A (Resident Individuals):
*   **AY 2024-25:**
    *   Old Regime: Up to ₹12,500 if TI ≤ ₹5L.
    *   New Regime: Up to ₹25,000 if TI ≤ ₹7L.
*   **AY 2025-26:** Same as AY 2024-25.
*   **AY 2026-27 (Proposed):**
    *   New Regime: Up to ₹60,000 if TI ≤ ₹12L.
    *   Old Regime: Presumed ₹12,500 if TI ≤ ₹5L.
*   Marginal relief for rebate cliff in New Regime.

### 4. Health & Education Cess:
*   4% on (tax + surcharge – rebate).

## Example Calculation Flow (Pseudo-Code)
(Refer to the detailed pseudo-code provided in the original user message for a step-by-step flow from input gathering to final tax payable.)

## Extensibility and Maintenance
*   Use configuration objects/tables for slabs, rates, deduction limits per AY.
*   Maintain a dictionary of deductions with limits and applicability.
*   Make surcharge and rebate thresholds config-driven.
*   Modular code structure (functions for each income head, tax step).

This plan aims to cover all critical rules for accurate tax computation for AY 2024-25 to 2026-27 and facilitate software implementation.
