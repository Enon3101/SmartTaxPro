import { MailCheck, SearchCheck, FileBadge, MessageSquareWarning, Archive, AlertTriangle } from 'lucide-react';
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

const ImportantAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg my-4">
    <div className="flex items-start">
      <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-red-700 mb-1">Important Alert!</h4>
        <p className="text-sm text-foreground">{children}</p>
      </div>
    </div>
  </div>
);

const PostFilingEssentialsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <GuideSection title="E-Verification of ITR (Crucial Step)" icon={MailCheck}>
        <p>
          Once you have submitted your Income Tax Return (ITR), the process is not complete until you verify it. E-verification is a mandatory step.
        </p>
        <SubSection title="Importance of E-Verification">
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Your ITR is considered invalid if not verified.</li>
            <li>The Income Tax Department will not process an unverified ITR.</li>
            <li>You cannot claim a refund or other benefits if your ITR is not verified.</li>
          </ul>
        </SubSection>
        <SubSection title="Timeline for Verification">
          <p>
            You must e-verify your ITR within <strong>30 days</strong> of filing it. Earlier, this limit was 120 days, but it has been reduced.
          </p>
          <ImportantAlert>
            Failure to e-verify within 30 days will render your ITR invalid, as if it was never filed. You might need to file a belated return (if the deadline has not passed) and could face penalties.
          </ImportantAlert>
        </SubSection>
        <SubSection title="Methods of E-Verification">
          <p>Several convenient online methods are available:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Aadhaar OTP:</strong> If your PAN is linked with Aadhaar and your mobile number is registered with Aadhaar.</li>
            <li><strong>Net Banking:</strong> Log in to your net banking account and find the income tax e-filing option.</li>
            <li><strong>Bank Account EVC (Electronic Verification Code):</strong> Pre-validate your bank account on the e-filing portal to generate an EVC.</li>
            <li><strong>Demat Account EVC:</strong> Pre-validate your Demat account to generate an EVC.</li>
            <li><strong>Digital Signature Certificate (DSC):</strong> Applicable for taxpayers whose accounts are required to be audited or for companies.</li>
            <li><strong>ITR-V (Acknowledgement):</strong> If online methods are not feasible, you can download the ITR-V, sign it in blue ink, and physically mail it to CPC, Bengaluru, within 30 days. However, e-verification is highly recommended.</li>
          </ul>
        </SubSection>
      </GuideSection>

      <GuideSection title="Checking ITR Status & Refund" icon={SearchCheck}>
        <SubSection title="Tracking ITR Processing Status">
          <p>After e-verification, you can track the status of your ITR processing on the e-filing portal:</p>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Log in to the Income Tax e-filing portal.</li>
            <li>Navigate through the menu: 'e-File', then 'Income Tax Returns', then 'View Filed Returns'.</li>
            <li>You will see the status of your filed returns (e.g., Successfully e-Verified, Processed, Refund Issued).</li>
          </ol>
        </SubSection>
        <SubSection title="Checking Income Tax Refund Status">
          <p>If you are eligible for a refund, you can track its status:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>On the e-filing portal:</strong> Similar to checking ITR status.</li>
            <li><strong>On the NSDL (now Protean) portal:</strong> Visit the TIN-NSDL website and enter your PAN and Assessment Year to check refund status.</li>
          </ul>
          <p className="mt-2">Ensure your bank account is pre-validated on the e-filing portal for seamless refund credit.</p>
        </SubSection>
      </GuideSection>

      <GuideSection title="Understanding Intimation u/s 143(1)" icon={FileBadge}>
        <p>
          After your ITR is processed, the Income Tax Department sends an intimation under Section 143(1) of the Income Tax Act to your registered email ID. This is an important document.
        </p>
        <p>The intimation will show a comparison of income and deductions as declared by you in the ITR versus as computed by the department. It can result in:</p>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li><strong>No Demand, No Refund:</strong> Your calculations match the department's.</li>
          <li><strong>Refund Determined:</strong> The department agrees you are due a refund (which will be processed).</li>
          <li><strong>Demand Determined:</strong> The department finds you have paid less tax and a demand notice is issued. You will need to pay the outstanding amount within the specified time.</li>
        </ul>
        <p className="mt-2">Carefully review this intimation. If you disagree with any adjustments made by the department, you may need to file a rectification request or a revised return (if applicable).</p>
      </GuideSection>

      <GuideSection title="Responding to Tax Notices" icon={MessageSquareWarning}>
        <p>
          You might receive notices from the Income Tax Department for various reasons. It is crucial to respond to them promptly and correctly.
        </p>
        <SubSection title="Common Types of Notices">
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Defective Return Notice (u/s 139(9)):</strong> If your ITR has errors or missing information. You need to correct and resubmit it.</li>
            <li><strong>Scrutiny Notices (u/s 143(2), 142(1)):</strong> If your return is selected for detailed examination. You will need to provide documents and explanations.</li>
            <li><strong>Notice for Outstanding Demand:</strong> If you have unpaid taxes from previous years.</li>
          </ul>
        </SubSection>
        <SubSection title="Key Actions">
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Don't Panic:</strong> Read the notice carefully to understand the issue and the required action.</li>
            <li><strong>Check Authenticity:</strong> Verify the notice on the e-filing portal. Look for a Document Identification Number (DIN).</li>
            <li><strong>Respond Within Time:</strong> Notices usually have a deadline for response. Failure to respond can lead to penalties or ex-parte orders.</li>
            <li><strong>Seek Professional Help:</strong> If you are unsure how to respond, consult a tax professional.</li>
          </ul>
        </SubSection>
      </GuideSection>

      <GuideSection title="Record Keeping" icon={Archive}>
        <p>
          It is essential to maintain proper records of your income, investments, deductions, and tax payments.
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li>Keep copies of your ITRs, Form 16, Form 26AS, AIS, TIS.</li>
          <li>Retain proofs of investments, expenses claimed as deductions (e.g., rent receipts, insurance premium receipts, donation receipts).</li>
          <li>Bank statements, capital gains statements.</li>
          <li>Intimations and notices received from the tax department and your responses.</li>
        </ul>
        <p className="mt-2">
          Generally, tax records should be kept for at least <strong>6-8 years</strong> from the end of the relevant Assessment Year, as the department can reopen assessments for this period under certain conditions.
        </p>
      </GuideSection>
    </div>
  );
};

export default PostFilingEssentialsGuide;
