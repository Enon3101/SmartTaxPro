import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PricingPlan from '@/components/PricingPlan'; // Import the new component

const PricingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen">
      <Helmet>
        <title>{t('pricingPage.title', 'Our Pricing Plans - SmartTaxPro')}</title>
        <meta 
          name="description" 
          content={t('pricingPage.description', 'Explore SmartTaxPro’s transparent pricing plans. Choose the best ITR filing plan that suits your needs, from DIY to expert-assisted services.')} 
        />
        {/* Add other relevant meta tags like OG, Twitter cards if needed */}
      </Helmet>
      
      {/* You can add a PageHeader component here if you have one, similar to other pages */}
      {/* For example: <PageHeader title={t('pricingPage.header', 'Our Pricing Plans')} subtitle={t('pricingPage.subheader', 'Find the perfect plan for your tax filing needs.')} /> */}

      <PricingPlan /> 
    </div>
  );
};

export default PricingPage;
