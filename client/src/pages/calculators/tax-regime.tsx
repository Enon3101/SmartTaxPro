import { Calculator, ArrowRightLeft, PiggyBank } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/taxCalculations";

// Tax rates for Old Regime (AY 2024-25)
const oldRegimeTaxSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 }
];

// Tax rates for New Regime (AY 2024-25)
const newRegimeTaxSlabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 }
];

// Standard deduction amount (same for both regimes)
const STANDARD_DEDUCTION = 50000;

// Surcharge rates
const surchargeSlab = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 10 },
  { min: 10000000, max: 20000000, rate: 15 },
  { min: 20000000, max: 50000000, rate: 25 },
  { min: 50000000, max: Infinity, rate: 37 }
];

// Education cess rate
const EDUCATION_CESS = 4;

// Add to the top of each calculator component
import { SEO } from '@/components/SEO';

const TaxRegimeCalculator = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tax Regime Calculator",
    "description": "Compare old vs new tax regime to maximize your tax savings",
    "url": "https://smarttaxpro.com/calculators/tax-regime",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      <SEO 
        title="Old vs New Tax Regime Calculator 2024-25"
        description="Compare old and new tax regime to save maximum tax. Free online calculator for AY 2024-25. Get instant results and tax-saving recommendations."
        keywords="tax regime calculator, old vs new tax regime, income tax calculator 2024, tax saving calculator"
        canonicalUrl="/calculators/tax-regime"
        structuredData={structuredData}
      />
      {/* Rest of component */}
    </>
  );
};

export default TaxRegimeCalculator;