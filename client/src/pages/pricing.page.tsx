import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import PricingPlan from '@/components/PricingPlan';

const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Pricing Plans - MyeCA.in | Expert eCA Services & Tax Filing Solutions</title>
        <meta 
          name="description" 
          content="Explore MyeCA.in's transparent pricing plans. Choose from DIY filing to expert eCA-assisted services. Get maximum refund with our intelligent tax engine." 
        />
        <meta name="keywords" content="ITR filing pricing, tax filing cost, income tax return price, eCA assisted filing, MyeCA.in" />
        <meta property="og:title" content="Pricing Plans - MyeCA.in" />
        <meta property="og:description" content="Transparent pricing for all your tax filing needs. From free basic filing to expert eCA-assisted services." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing Plans - MyeCA.in" />
        <meta name="twitter:description" content="Transparent pricing for all your tax filing needs with expert eCA assistance." />
      </Helmet>
      
      <PricingPlan />
    </>
  );
};

export default PricingPage;
