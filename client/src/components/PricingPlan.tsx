import { 
  Coins, ArrowRight, FileText, Copy, Briefcase, TrendingUp, Globe, Search, CheckCircle, Circle, ChevronUp, ChevronDown 
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface PlanCardProps {
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  isFree?: boolean;
  isPopular?: boolean; // For a potential "Popular" badge later
  buttonText?: string;
  onClick?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  price,
  originalPrice,
  isFree,
  buttonText,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col justify-between h-full">
      <div>
        {isFree && (
          <div className="mb-2">
            <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {t('pricing.free')}
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>}
        
        <div className="mb-4">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through mr-2">
              ₹{originalPrice}
            </span>
          )}
          <span className={`text-3xl font-bold ${isFree ? 'text-green-500' : 'text-primary'}`}>
            {isFree ? price : `₹${price}`}
          </span>
          {!isFree && <span className="text-sm text-muted-foreground ml-1">+ {t('pricing.taxes')}</span>}
        </div>
      </div>
      {buttonText && onClick && (
        <Button onClick={onClick} className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

const PricingPlan: React.FC = () => {
  const { t } = useTranslation();
  const [isEcaPlanOpen, setIsEcaPlanOpen] = useState(true);

  // Data for "File ITR Yourself" plans
  const fileYourselfPlans: PlanCardProps[] = [
    {
      title: t('pricing.fileYourself.income0to10k.title', 'Income 0 - 10K'),
      price: t('pricing.free', 'Free'),
      isFree: true,
      // No button for free plan as per image, button is separate below
    },
    {
      title: t('pricing.fileYourself.basic.title', 'Basic'),
      subtitle: t('pricing.fileYourself.basic.subtitle', 'Income 10K - 1L'),
      originalPrice: '99',
      price: '49',
    },
    {
      title: t('pricing.fileYourself.standard.title', 'Standard'),
      subtitle: t('pricing.fileYourself.standard.subtitle', 'Income 1L - 5L'),
      originalPrice: '449',
      price: '382',
    },
    {
      title: t('pricing.fileYourself.premium.title', 'Premium'),
      subtitle: t('pricing.fileYourself.premium.subtitle', 'Income 10L+'),
      originalPrice: '1499',
      price: '1274',
    },
  ];

  // --- eCA Assisted Plans Data ---
  interface EcaFeature {
    name: string;
    isHeader?: boolean; // Added for category headers
    [planKey: string]: boolean | string | undefined; 
  }

  interface EcaPlan {
    key: string;
    icon: React.ElementType;
    name: string;
    description: string[]; // Changed to string array for multi-line
    basePrice: string;
    price: string;
  }

  const ecaPlans: EcaPlan[] = [
    { 
      key: 'standard', 
      icon: FileText,
      name: t('pricing.ecaAssisted.standard.name', 'eCA Assisted - Standard'),
      description: [
        t('pricing.ecaAssisted.standard.descLine1', 'Salary (1 employer)'),
        t('pricing.ecaAssisted.standard.descLine2', 'Single House Property'),
        t('pricing.ecaAssisted.standard.descLine3', 'Other Sources Income')
      ],
      basePrice: '1499',
      price: '1274'
    },
    {
      key: 'multipleForm16',
      icon: Copy,
      name: t('pricing.ecaAssisted.multipleForm16.name', 'eCA Assisted - Multiple Form 16'),
      description: [
        t('pricing.ecaAssisted.multipleForm16.descLine1', 'All Standard features'),
        t('pricing.ecaAssisted.multipleForm16.descLine2', '+ Salary (Multiple employers)')
      ],
      basePrice: '1999',
      price: '1699'
    },
    {
      key: 'businessIncome',
      icon: Briefcase,
      name: t('pricing.ecaAssisted.businessIncome.name', 'eCA Assisted - Business Income'),
      description: [
        t('pricing.ecaAssisted.businessIncome.descLine1', 'All Multiple Form 16 features'),
        t('pricing.ecaAssisted.businessIncome.descLine2', '+ Multiple House Properties'),
        t('pricing.ecaAssisted.businessIncome.descLine3', '+ Income u/s 44AD/44ADA')
      ],
      basePrice: '3124',
      price: '2655'
    },
    {
      key: 'capitalGain',
      icon: TrendingUp,
      name: t('pricing.ecaAssisted.capitalGain.name', 'eCA Assisted - Capital Gain'),
      description: [
        t('pricing.ecaAssisted.capitalGain.descLine1', 'All Business Income features'),
        t('pricing.ecaAssisted.capitalGain.descLine2', '+ Capital Gains'),
        t('pricing.ecaAssisted.capitalGain.descLine3', '+ Relief u/s 89')
      ],
      basePrice: '4999',
      price: '4249'
    },
    {
      key: 'nri',
      icon: Globe,
      name: t('pricing.ecaAssisted.nri.name', 'eCA Assisted - NRI'),
      description: [
        t('pricing.ecaAssisted.nri.descLine1', 'Max tax benefit'),
        t('pricing.ecaAssisted.nri.descLine2', 'on Indian income (NRI)')
      ],
      basePrice: '9374',
      price: '7968'
    },
    {
      key: 'foreign',
      icon: Search, // Combined with Globe contextually
      name: t('pricing.ecaAssisted.foreign.name', 'eCA Assisted - Foreign'),
      description: [
        t('pricing.ecaAssisted.foreign.descLine1', 'All Foreign Income'),
        t('pricing.ecaAssisted.foreign.descLine2', 'Max benefit under DTAA')
      ],
      basePrice: '12499',
      price: '10624'
    },
  ];

  const ecaFeatures: EcaFeature[] = [
    // Category: Income Types
    { name: t('pricing.featureCategories.incomeTypes', 'Income Types & Sources'), isHeader: true },
    { name: t('pricing.features.salaryIncome.title', 'Salary Income (Overall)'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.salaryIncome.oneEmployer', '1. One employer'), standard: true, multipleForm16: false, businessIncome: false, capitalGain: false, nri: true, foreign: true },
    { name: t('pricing.features.salaryIncome.multipleEmployers', '2. More than one employer'), standard: false, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.houseProperty.title', 'House Property Income (Overall)'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.houseProperty.singleHouse', '1. Single House'), standard: true, multipleForm16: true, businessIncome: false, capitalGain: false, nri: true, foreign: true },
    { name: t('pricing.features.houseProperty.multipleHouses', '2. Multiple House'), standard: false, multipleForm16: false, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.interestOtherSources', 'Interest & Other Sources Income'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.capitalGains', 'Capital Gains'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.digitalVirtualAssets', 'Digital Virtual Assets (cryptocurrencies)'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.section44AD', 'Section 44 AD/44ADA Income (Presumptive)'), standard: false, multipleForm16: false, businessIncome: true, capitalGain: true, nri: false, foreign: false },
    
    // Category: Foreign & NRI Specific
    { name: t('pricing.featureCategories.foreignNri', 'Foreign Income & NRI Specifics'), isHeader: true },
    { name: t('pricing.features.foreignIncome', 'Foreign income reporting'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: false, nri: false, foreign: true },
    { name: t('pricing.features.faSchedule', 'FA schedule (Foreign Assets)'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: false, nri: true, foreign: true },
    { name: t('pricing.features.foreignTaxCredit', 'Foreign Tax Credit (FTC)'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: false, nri: false, foreign: true },
    { name: t('pricing.features.form67', 'Form 67 for FTC'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: false, nri: false, foreign: true },
    { name: t('pricing.features.nonResident', 'Non-resident specific calculations'), standard: false, multipleForm16: false, businessIncome: false, capitalGain: false, nri: true, foreign: true },

    // Category: Filing Assistance & Features
    { name: t('pricing.featureCategories.filingAssistance', 'Filing Assistance & General Features'), isHeader: true },
    { name: t('pricing.features.easyITRPreparation', 'Easy ITR preparation & e-filing'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.suggestionTaxDeductions', 'Suggestion to maximise tax deductions'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.examinationPreviousITR', 'Examination of previous year ITR'), standard: false, multipleForm16: false, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.dataImport26AS', '26AS Data Import'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.taxPaymentAssistance', 'Tax Payment Assistance'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
    { name: t('pricing.features.expandedSelfHelp', 'Expanded set of self-help tools'), standard: true, multipleForm16: true, businessIncome: true, capitalGain: true, nri: true, foreign: true },
  ];
  // --- End eCA Assisted Plans Data ---

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* File ITR Yourself Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center text-center mb-4">
            {/* Using Coins as a placeholder, you might want a more specific icon */}
            <Coins className="h-10 w-10 text-blue-500 mb-2" /> 
            <div>
              <h2 className="text-3xl font-bold">
                {t('pricing.fileYourself.title', 'File ITR Yourself')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto"> {/* Added max-w-2xl and mx-auto for better centering of long text */}
                {t('pricing.fileYourself.description', 'Includes income from Salary, House Property, Capital Gain/Loss, Mutual Funds, Properties, Presumptive Tax u/s 44AD & 44ADA, and Other Sources.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {fileYourselfPlans.map((plan, index) => (
              <PlanCard key={index} {...plan} />
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
              {t('pricing.startFilingNow', 'Start Filing Now')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* eCA Assisted Plans Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t('pricing.ecaAssisted.title', 'eCA Assisted Plans')}
          </h2>

          {isEcaPlanOpen && (
            <div className="overflow-x-auto bg-card shadow-md rounded-lg border border-border">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sticky left-0 bg-muted/50 z-10 min-w-[200px] md:min-w-[250px]">
                      {t('pricing.features.title', 'Features')}
                    </th>
                    {ecaPlans.map((plan) => (
                      <th key={plan.key} scope="col" className="px-6 py-4 text-center min-w-[160px] align-top">
                        <div className="flex flex-col h-full text-center min-h-[450px]"> {/* Flexbox container with min-height */}
                          <plan.icon className="h-8 w-8 text-blue-500 mb-2 mx-auto" />
                          <h4 className="text-sm font-semibold text-foreground mb-1">{plan.name}</h4>
                          <div className="text-xs text-muted-foreground mb-2 w-full px-1 flex-grow self-start min-h-[48px]"> {/* Description with flex-grow */}
                            {plan.description.map((line, idx) => (
                              <React.Fragment key={idx}>
                                {line}
                                {idx < plan.description.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="w-full pt-2 mt-auto"> {/* Price/button block, WITH mt-auto */}
                            <p className="text-xs text-muted-foreground line-through">₹{plan.basePrice}</p>
                            <div className="mb-2">
                              <span className="text-lg font-bold text-primary">₹{plan.price}</span>
                              <span className="text-xs text-muted-foreground ml-1">+ {t('pricing.taxes', 'Taxes')}</span>
                            </div>
                            <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-xs">
                              {t('pricing.fileNow', 'File Now')}
                            </Button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {ecaFeatures.map((feature, featureIndex) => {
                    if (feature.isHeader) {
                      return (
                        <tr key={`header-${featureIndex}`} className="bg-muted/70 dark:bg-muted/40">
                          <td 
                            colSpan={ecaPlans.length + 1} 
                            className="px-4 py-2 text-sm font-semibold text-foreground text-left sticky left-0 z-10 bg-muted/70 dark:bg-muted/40"
                          >
                            {feature.name}
                          </td>
                        </tr>
                      );
                    }
                    // Indent sub-features visually
                    const isSubFeature = feature.name.match(/^\d\.\s/);
                    const featureNameCellStyle = isSubFeature 
                      ? "pl-10 pr-6 py-3" // More padding for sub-features
                      : "px-6 py-3";

                    return (
                      <tr key={featureIndex} className={isSubFeature ? "bg-background dark:bg-gray-800" : "bg-card hover:bg-muted/30 dark:hover:bg-gray-700/30"}>
                        <td className={`whitespace-nowrap text-sm font-medium text-foreground sticky left-0 z-10 ${isSubFeature ? "bg-background dark:bg-gray-800" : "bg-card group-hover:bg-muted/30 dark:group-hover:bg-gray-700/30"} ${featureNameCellStyle}`}>
                          {isSubFeature ? feature.name.substring(feature.name.indexOf(' ') + 1) : feature.name}
                        </td>
                        {ecaPlans.map((plan) => (
                          <td key={`${plan.key}-${featureIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {feature[plan.key] ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setIsEcaPlanOpen(!isEcaPlanOpen)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              {isEcaPlanOpen ? t('pricing.closePlan', 'Close Pricing Plan') : t('pricing.viewPlan', 'View Full Pricing Plan')}
              {isEcaPlanOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
           <p className="text-center text-xs text-muted-foreground mt-4">
            {t('pricing.securityExpertise', 'Security & Expertise is built into everything we do Happy Filing!')}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {t('pricing.welcomeOffer', 'Discounted prices are a part of Welcome Offer, available only for a limited period of time.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlan;
