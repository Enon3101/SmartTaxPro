import { Coins, PiggyBank, Lightbulb, HelpCircle } from 'lucide-react';
import React from 'react';

const GuideSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ElementType }> = ({ title, children, icon: Icon }) => (
  <section className="mb-8 p-6 bg-card rounded-lg shadow">
    <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
      {Icon && <Icon className="mr-3 h-7 w-7" />}
      {title}
    </h2>
    <div className="space-y-4 text-card-foreground">
      {children}
    </div>
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-3 text-primary/90">{title}</h3>
    <div className="space-y-3 pl-2 border-l-2 border-primary/20">
      {children}
    </div>
  </div>
);

const TaxSaverTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg my-4">
    <div className="flex items-start">
      <Lightbulb className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-green-700 mb-1">Tax Saver Tip</h4>
        <p className="text-sm text-foreground">{children}</p>
      </div>
    </div>
  </div>
);

const IncomeAndDeductionsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <GuideSection title="The Five Heads of Income" icon={Coins}>
        <p>
          In India, income is categorized under five main heads for taxation purposes. Understanding these is key to correctly calculating your Gross Total Income (GTI).
        </p>

        <SubSection title="1. Income from Salary">
          <p>This includes all remuneration received by an employee from an employer. Key components are:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Basic Salary:</strong> The fixed component of your salary.</li>
            <li><strong>Allowances:</strong> Such as House Rent Allowance (HRA), Leave Travel Allowance (LTA), Dearness Allowance (DA), etc. Some allowances are partially or fully exempt.</li>
            <li><strong>Perquisites:</strong> Non-cash benefits like company car, rent-free accommodation, stock options (ESOPs).</li>
            <li><strong>Profits in lieu of Salary:</strong> Payments like gratuity, pension, leave encashment.</li>
            <li><strong>Standard Deduction:</strong> A flat deduction available to salaried individuals and pensioners (currently ₹50,000 under both regimes).</li>
          </ul>
        </SubSection>

        <SubSection title="2. Income from House Property">
          <p>This refers to income earned from owning a property, which could be a house, building, or land appurtenant thereto. It includes:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Rental Income:</strong> From a let-out property.</li>
            <li><strong>Annual Value:</strong> For a self-occupied property (usually taken as nil, but limited to two properties).</li>
            <li><strong>Deductions:</strong>
              <ul className="list-circle list-inside pl-6 mt-1">
                <li>Standard Deduction of 30% of Net Annual Value (NAV).</li>
                <li>Interest paid on home loan (u/s 24(b)).</li>
                <li>Principal repayment of home loan (covered under Section 80C).</li>
              </ul>
            </li>
          </ul>
        </SubSection>

        <SubSection title="3. Profits and Gains from Business or Profession (PGBP)">
          <p>This includes income earned from any business or profession carried on by the taxpayer. It covers:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Profits from a manufacturing or trading business.</li>
            <li>Income of professionals like doctors, lawyers, chartered accountants, consultants.</li>
            <li>Various expenses incurred wholly and exclusively for the business/profession are allowed as deductions.</li>
          </ul>
        </SubSection>

        <SubSection title="4. Capital Gains">
          <p>This is profit or gain arising from the transfer of a capital asset (e.g., property, shares, mutual funds, gold). Capital gains are classified as:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Short-Term Capital Gains (STCG):</strong> From assets held for a shorter duration (e.g., listed shares held for up to 12 months).</li>
            <li><strong>Long-Term Capital Gains (LTCG):</strong> From assets held for a longer duration. LTCG often benefits from indexation (adjusting purchase price for inflation).</li>
            <li>Tax rates for STCG and LTCG vary depending on the asset type and holding period.</li>
          </ul>
        </SubSection>

        <SubSection title="5. Income from Other Sources">
          <p>Any income that does not fall under the above four heads is taxed under this category. Common examples include:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Interest from savings bank accounts, fixed deposits (FDs), recurring deposits (RDs).</li>
            <li>Dividend income from shares and mutual funds.</li>
            <li>Family pension.</li>
            <li>Gifts received (subject to certain conditions and limits).</li>
            <li>Winnings from lotteries, game shows, horse races.</li>
          </ul>
        </SubSection>
      </GuideSection>

      <GuideSection title="Popular Deductions under Chapter VI-A" icon={PiggyBank}>
        <p>
          Chapter VI-A of the Income Tax Act allows for various deductions from your Gross Total Income (GTI) if you opt for the Old Tax Regime. These help reduce your taxable income. Some key deductions include:
        </p>
        <ul className="list-disc list-inside space-y-3 pl-4">
          <li>
            <strong>Section 80C (up to ₹1.5 lakh):</strong>
            Popular investments like Public Provident Fund (PPF), Employees' Provident Fund (EPF), Equity Linked Savings Scheme (ELSS), National Savings Certificate (NSC), Sukanya Samriddhi Yojana, 5-year tax-saving FDs, life insurance premiums, home loan principal repayment, children's tuition fees.
          </li>
          <li><strong>Section 80CCC & 80CCD(1B) (NPS):</strong> Contribution to annuity plans of LIC or other insurers (80CCC) and National Pension System (NPS) (additional ₹50,000 under 80CCD(1B) over and above 80C limit).</li>
          <li><strong>Section 80D (Health Insurance):</strong> Premium paid for health insurance for self, spouse, children, and parents. Limits vary based on age.</li>
          <li><strong>Section 80DD:</strong> Expenses for medical treatment/maintenance of a disabled dependent.</li>
          <li><strong>Section 80DDB:</strong> Expenses for medical treatment of specified diseases for self or dependent.</li>
          <li><strong>Section 80E:</strong> Interest paid on education loan for higher studies (for self, spouse, children, or student for whom you are a legal guardian). No upper limit on the amount of interest.</li>
          <li><strong>Section 80G:</strong> Donations made to specified charitable institutions and funds. Deduction percentage varies.</li>
          <li><strong>Section 80TTA (up to ₹10,000):</strong> Interest income from savings bank accounts (for individuals other than senior citizens).</li>
          <li><strong>Section 80TTB (up to ₹50,000):</strong> Interest income from deposits for senior citizens.</li>
        </ul>
        <TaxSaverTip>
          Always keep proofs of investments and expenditures claimed as deductions. The New Tax Regime offers fewer deductions, so choose your regime wisely after comparing tax outgo.
        </TaxSaverTip>
      </GuideSection>

      <GuideSection title="Exemptions vs. Deductions vs. Rebates" icon={HelpCircle}>
        <p>It's important to understand the difference between these terms:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Exemptions:</strong> These are specific types of income that are not included in your Gross Total Income at all. For example, House Rent Allowance (HRA) up to a certain limit, Leave Travel Allowance (LTA), or agricultural income.
          </li>
          <li>
            <strong>Deductions:</strong> These are amounts that are subtracted from your Gross Total Income to arrive at your Net Taxable Income. Examples include deductions under Section 80C, 80D, etc.
          </li>
          <li>
            <strong>Rebate (Section 87A):</strong> This is a direct reduction from your calculated tax liability. It is available to resident individuals whose net taxable income is below a certain threshold (currently ₹7 lakh under the New Regime, effectively making income up to this level tax-free, and ₹5 lakh under the Old Regime).
          </li>
        </ul>
      </GuideSection>
    </div>
  );
};

export default IncomeAndDeductionsGuide;
