import React from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/pricing': 'Pricing',
  '/start-filing': 'Start Filing',
  '/calculators': 'Calculators',
  '/tax-resources': 'Tax Resources',
  '/calculators/income-tax': 'Income Tax Calculator',
  '/calculators/hra': 'HRA Calculator',
  '/tax-resources/slabs': 'Tax Slabs',
  '/tax-resources/deductions': 'Deductions',
};

export function Breadcrumb() {
  const [location] = useLocation();
  
  const pathSegments = location.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });
  
  if (breadcrumbs.length <= 1) return null;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://yourdomain.com${item.href}` : undefined
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {index === 0 ? (
              <Link href={item.href!} className="flex items-center hover:text-foreground">
                <Home className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href!} className="hover:text-foreground">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}
