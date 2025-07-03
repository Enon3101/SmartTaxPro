export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyeCA.in",
  "url": "https://myeca.in",
  "logo": "https://myeca.in/logo.svg",
  "description": "India's leading online income tax filing platform",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/MyeCAin",
    "https://twitter.com/MyeCAin",
    "https://linkedin.com/company/myeca-in"
  ]
});

export const createCalculatorSchema = (name: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": name,
  "description": description,
  "url": url,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "provider": {
    "@type": "Organization",
    "name": "MyeCA.in"
  }
});

export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});