/**
 * Government Tax Resources and Official Websites
 * This file contains links to official government tax resources in India
 */

export interface GovtResource {
  name: string;
  url: string;
  description: string;
  category: 'filing' | 'payment' | 'verification' | 'information' | 'tools' | 'other';
  isOfficial: boolean;
  icon?: string; // Icon name from lucide-react
}

export const govtTaxWebsites: GovtResource[] = [
  {
    name: "Income Tax Department of India",
    url: "https://www.incometaxindia.gov.in/",
    description: "Official website of the Income Tax Department, Government of India",
    category: "information",
    isOfficial: true,
    icon: "building"
  },
  {
    name: "Income Tax e-Filing Portal",
    url: "https://www.incometax.gov.in/",
    description: "Official portal for filing Income Tax Returns in India",
    category: "filing",
    isOfficial: true,
    icon: "file-text"
  },
  {
    name: "National Portal of India",
    url: "https://www.india.gov.in/",
    description: "The official portal of the Government of India",
    category: "information",
    isOfficial: true,
    icon: "landmark"
  },
  {
    name: "Central Board of Direct Taxes (CBDT)",
    url: "https://www.incometaxindia.gov.in/Pages/about-us/central-board-of-direct-taxes.aspx",
    description: "CBDT is responsible for administering direct tax laws in India",
    category: "information",
    isOfficial: true,
    icon: "building"
  },
  {
    name: "National Securities Depository Limited (NSDL)",
    url: "https://www.tin-nsdl.com/",
    description: "Portal for TIN services, PAN card application and verification",
    category: "verification",
    isOfficial: true,
    icon: "id-card"
  },
  {
    name: "GST Portal",
    url: "https://www.gst.gov.in/",
    description: "Official Goods and Services Tax Portal of India",
    category: "filing",
    isOfficial: true,
    icon: "receipt"
  },
  {
    name: "TDS Return Preparation Utility",
    url: "https://www.tdscpc.gov.in/",
    description: "Official website for TDS related information and services",
    category: "tools",
    isOfficial: true,
    icon: "calculator"
  },
  {
    name: "e-Pay Tax Portal",
    url: "https://eportal.incometax.gov.in/iec/foservices/#/login",
    description: "Portal for paying income tax online in India",
    category: "payment",
    isOfficial: true,
    icon: "credit-card"
  },
  {
    name: "Ministry of Finance",
    url: "https://finmin.nic.in/",
    description: "Official website of the Ministry of Finance, Government of India",
    category: "information",
    isOfficial: true,
    icon: "building-2"
  },
  {
    name: "Tax Information Network",
    url: "https://www.tin-nsdl.com/",
    description: "Established by the Income Tax Department to modernize tax collection",
    category: "information",
    isOfficial: true,
    icon: "network"
  },
  {
    name: "e-Nivaran Portal",
    url: "https://www.incometaxindia.gov.in/Pages/tax-services/e-nivaran.aspx",
    description: "Online grievance redressal system for income tax related issues",
    category: "other",
    isOfficial: true,
    icon: "help-circle"
  },
  {
    name: "Digilocker",
    url: "https://www.digilocker.gov.in/",
    description: "Digital platform for issuance and verification of documents & certificates",
    category: "verification",
    isOfficial: true,
    icon: "folder"
  }
];

export const taxToolsAndCalculators: GovtResource[] = [
  {
    name: "Income Tax Calculator",
    url: "https://www.incometax.gov.in/iec/foportal/help/tax-calculator",
    description: "Official Income Tax Department calculator to estimate your tax liability",
    category: "tools",
    isOfficial: true,
    icon: "calculator"
  },
  {
    name: "Advance Tax Calculator",
    url: "https://cleartax.in/s/advance-tax-calculator",
    description: "Calculate your advance tax installments",
    category: "tools",
    isOfficial: false,
    icon: "calculator"
  },
  {
    name: "TDS Rate Finder",
    url: "https://www.tdscpc.gov.in/app/tds-rate.html",
    description: "Find the correct TDS rates for various types of payments",
    category: "tools",
    isOfficial: true,
    icon: "percent"
  },
  {
    name: "Form 26AS (Tax Credit Statement)",
    url: "https://www.incometax.gov.in/",
    description: "View and download your tax credit statement",
    category: "verification",
    isOfficial: true,
    icon: "file-text"
  },
  {
    name: "PAN Verification",
    url: "https://www.tin-nsdl.com/services/pan/pan-index.html",
    description: "Verify PAN details and status",
    category: "verification",
    isOfficial: true,
    icon: "check-circle"
  }
];

export const taxInformationResources: GovtResource[] = [
  {
    name: "Income Tax Acts & Rules",
    url: "https://www.incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
    description: "Complete Income Tax Acts and Rules of India",
    category: "information",
    isOfficial: true,
    icon: "book"
  },
  {
    name: "Tax Guides & FAQs",
    url: "https://www.incometaxindia.gov.in/Pages/faqs.aspx",
    description: "Frequently Asked Questions on taxation topics",
    category: "information",
    isOfficial: true,
    icon: "help-circle"
  },
  {
    name: "Latest Notifications",
    url: "https://www.incometaxindia.gov.in/Pages/communications/notifications.aspx",
    description: "Recent notifications by the Income Tax Department",
    category: "information",
    isOfficial: true,
    icon: "bell"
  },
  {
    name: "Income Tax Circulars",
    url: "https://www.incometaxindia.gov.in/Pages/communications/circulars.aspx",
    description: "Circulars issued by the Income Tax Department",
    category: "information",
    isOfficial: true,
    icon: "file-text"
  },
  {
    name: "Budget and Economic Survey",
    url: "https://www.indiabudget.gov.in/",
    description: "Official Budget of India portal",
    category: "information",
    isOfficial: true,
    icon: "file-bar-chart"
  }
];

// Function to get resources by category
export function getResourcesByCategory(category: GovtResource['category']) {
  return govtTaxWebsites.filter(resource => resource.category === category);
}

// Function to get only official resources
export function getOfficialResources() {
  return govtTaxWebsites.filter(resource => resource.isOfficial);
}

// Function to get all tools and calculators
export function getAllToolsAndCalculators() {
  return [
    ...govtTaxWebsites.filter(resource => resource.category === 'tools'),
    ...taxToolsAndCalculators
  ];
}