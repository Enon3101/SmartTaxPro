import { FileText, CheckSquare, ListChecks, AlertTriangle, CalendarClock, ExternalLink } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

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

const DontForget: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg my-4">
    <div className="flex items-start">
      <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-amber-600 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-amber-700 mb-1">Don't Forget!</h4>
        <p className="text-sm text-foreground">{children}</p>
      </div>
    </div>
  </div>
);

const ITRFilingProcessGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <GuideSection title="Why is ITR Filing Important?" icon={CheckSquare}>
        <p>Filing your Income Tax Return (ITR) is not just a legal obligation but also offers several benefits:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Legal Compliance:</strong> Avoids penalties and legal consequences for non-filing or late filing.</li>
          <li><strong>Claiming Refunds:</strong> If excess tax has been deducted (TDS) or paid, filing ITR is necessary to claim a refund.</li>
          <li><strong>Proof of Income:</strong> ITR documents serve as valid proof of income for loan applications, visa processing, and credit card applications.</li>
          <li><strong>Carry Forward Losses:</strong> You can carry forward certain losses (e.g., capital losses, business losses) to set off against future income only if you file your ITR by the due date.</li>
          <li><strong>Applying for High Insurance Cover:</strong> Insurance companies may require ITRs for high-value policies.</li>
        </ul>
      </GuideSection>

      <GuideSection title="Who Should File ITR?" icon={ListChecks}>
        <p>It is mandatory for the following individuals/entities to file an ITR:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Every individual whose gross total income (before deductions under Chapter VI-A) exceeds the basic exemption limit.</li>
          <li>Individuals who have deposited an amount or aggregate of amounts exceeding ₹1 crore in one or more current accounts during the previous year.</li>
          <li>Individuals who have incurred expenditure exceeding ₹2 lakh for themselves or any other person for travel to a foreign country.</li>
          <li>Individuals who have incurred expenditure exceeding ₹1 lakh towards consumption of electricity during the previous year.</li>
          <li>Companies and firms, irrespective of their income or loss.</li>
          <li>Individuals who wish to claim an income tax refund.</li>
          <li>Individuals who want to carry forward a loss under any head of income.</li>
          <li>Residents having any asset (including financial interest in any entity) located outside India or signing authority in any account located outside India.</li>
        </ul>
        <DontForget>
          Even if your income is below the taxable limit, filing a 'Nil Return' can be beneficial for record-keeping and future financial applications.
        </DontForget>
      </GuideSection>

      <GuideSection title="Choosing the Right ITR Form" icon={FileText}>
        <p>Selecting the correct ITR form is crucial. The applicability depends on your sources of income and category:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>ITR-1 (Sahaj):</strong> For resident individuals having total income up to ₹50 lakh from salary, one house property, other sources (interest, etc.), and agricultural income up to ₹5,000. Not for individuals who are directors in a company or have invested in unlisted equity shares.</li>
          <li><strong>ITR-2:</strong> For individuals and HUFs not having income from profits and gains of business or profession (PGBP). Suitable if you have capital gains, more than one house property, or foreign income/assets.</li>
          <li><strong>ITR-3:</strong> For individuals and HUFs having income from PGBP.</li>
          <li><strong>ITR-4 (Sugam):</strong> For individuals, HUFs, and Firms (other than LLP) being a resident having total income up to ₹50 lakh and having income from business and profession which is computed under sections 44AD, 44ADA or 44AE (presumptive income).</li>
        </ul>
        <p className="mt-3">Other forms like ITR-5, ITR-6, ITR-7 are for LLPs, Companies, Trusts, etc.</p>
        <p className="mt-2">
          You can find more details on ITR forms on the official {' '}
          <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            Income Tax Portal <ExternalLink size={14} className="inline ml-1" />
          </a>.
        </p>
      </GuideSection>

      <GuideSection title="Essential Documents for ITR Filing" icon={ListChecks}>
        <p>Keep these documents handy before you start filing your ITR:</p>
        <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pl-4">
          <li>PAN Card</li>
          <li>Aadhaar Card (linking PAN with Aadhaar is mandatory)</li>
          <li>Bank account statements/passbook (for all accounts)</li>
          <li>Form 16 (issued by your employer for TDS on salary)</li>
          <li>Form 16A/16B/16C (for TDS on income other than salary, sale of property, rent)</li>
          <li>Form 26AS (Annual Tax Statement - verify TDS details)</li>
          <li>Annual Information Statement (AIS) & Taxpayer Information Summary (TIS)</li>
          <li>Proofs of investments for deductions (e.g., 80C, 80D receipts)</li>
          <li>Home loan statements (for interest and principal details)</li>
          <li>Capital gains statements (from brokers, for sale of shares/mutual funds)</li>
          <li>Details of foreign assets or income (if applicable)</li>
          <li>Rent receipts (if claiming HRA)</li>
        </ul>
      </GuideSection>

      <GuideSection title="The Online ITR Filing Process (Overview)" icon={CalendarClock}>
        <p>Here is a general outline of the online filing process on the Income Tax portal:</p>
        <ol className="list-decimal list-inside space-y-2 pl-4">
          <li><strong>Register/Login:</strong> Visit the e-filing portal (<a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">incometax.gov.in</a>) and log in with your PAN (User ID) and password. If you are a new user, register first.</li>
          <li><strong>Verify Pre-filled Data:</strong> Download and carefully check your Form 26AS, AIS, and TIS. Much of your ITR will be pre-filled based on this data. Ensure it is accurate.</li>
          <li><strong>Select Filing Mode:</strong> Navigate through the menu: 'e-File', then 'Income Tax Return', then 'File Income Tax Return'.</li>
          <li><strong>Select AY, Mode of Filing:</strong> Choose the Assessment Year (e.g., 2024-25), Mode of Filing ('Online'), and ITR Form applicable to you.</li>
          <li><strong>Fill the Form:</strong>
            <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
              <li>Confirm your personal details.</li>
              <li>Enter/verify income details from salary, house property, capital gains, other sources, etc.</li>
              <li>Declare deductions under Chapter VI-A.</li>
              <li>Enter details of taxes paid (TDS, TCS, Advance Tax, Self-Assessment Tax).</li>
            </ul>
          </li>
          <li><strong>Calculate Tax Liability:</strong> The portal will compute your tax liability or refund based on the information provided.</li>
          <li><strong>Pay Tax (if due):</strong> If there is outstanding tax, pay it using Challan 280 and enter the payment details in the ITR.</li>
          <li><strong>Preview and Submit:</strong> Review your ITR carefully. Once satisfied, submit the return.</li>
          <li><strong>E-Verify Return:</strong> This is a crucial step. Your ITR filing is incomplete without verification. You have 30 days from filing to e-verify.</li>
        </ol>
        <p className="mt-3">
          For a more detailed walkthrough, you can check our specific guides:
        </p>
        <ul className="list-disc list-inside pl-4 mt-2">
            <li><Link href="/tax-resources/how-to-file-itr-online-2023-24" className="text-primary hover:underline">How to File ITR Online (AY 2023-24)</Link> (Archived)</li>
            <li><Link href="/tax-resources/e-filing-guide" className="text-primary hover:underline">General E-Filing Guide</Link></li>
        </ul>
      </GuideSection>

      <GuideSection title="Important ITR Filing Deadlines & Return Types" icon={AlertTriangle}>
        <SubSection title="Key Deadlines">
          <p>Missing ITR filing deadlines can lead to penalties, interest, and loss of certain benefits. Always refer to the "Tax Deadlines" section on this page for the latest dates.</p>
          <p>Generally, for individuals/HUFs/AOPs/BOIs whose accounts are not required to be audited, the due date is <strong>July 31st</strong> of the Assessment Year.</p>
        </SubSection>
        <SubSection title="Types of Returns">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Original Return:</strong> Filed for the first time for an AY.</li>
            <li><strong>Belated Return:</strong> Filed after the due date but before the end of the AY (or before completion of assessment, whichever is earlier). May attract a late filing fee.</li>
            <li><strong>Revised Return:</strong> Filed to correct any mistake or omission in the original return. Can be filed before the end of the AY (or before completion of assessment).</li>
          </ul>
        </SubSection>
        <DontForget>
          E-verification is mandatory for all ITRs. Failure to verify within 30 days of filing will render your ITR invalid.
        </DontForget>
      </GuideSection>
    </div>
  );
};

export default ITRFilingProcessGuide;
