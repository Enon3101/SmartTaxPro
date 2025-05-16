import React from 'react';
import ITRFormsGuide from '@/components/ItrFormsGuide';
import { PageHeader } from '@/components/PageHeader';

const ITRFormsGuidePage = () => {
  return (
    <div>
      <PageHeader
        title="Income Tax Return (ITR) Forms Guide"
        description="Find the right ITR form for your income sources and filing situation"
        size="sm"
      />
      <ITRFormsGuide />
    </div>
  );
};

export default ITRFormsGuidePage;