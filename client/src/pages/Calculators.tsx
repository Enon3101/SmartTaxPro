import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calculator, 
  CalendarDays, 
  DollarSign,
  Home,
  BarChart3,
  Calendar,
  Coins,
  PiggyBank,
  TrendingUp,
  LineChart,
  Percent,
  Building,
  Landmark
} from "lucide-react";
import { usePreloadCalculator } from "@/hooks/usePreloadCalculator";
import { motion } from "framer-motion";

const Calculators = () => {
  const { 
    preloadTaxRegimeCalculator,
    preloadHraCalculator,
    preloadTdsCalculator,
    preloadCapitalGainsCalculator,
    preloadSipCalculator,
    preloadFdCalculator,
    preloadLoanEmiCalculator
  } = usePreloadCalculator();
  
  // Preload the most commonly used calculators when the page loads
  useEffect(() => {
    // Delay preloading to prioritize rendering the current page first
    const timer = setTimeout(() => {
      // Preload the most popular calculators
      preloadTaxRegimeCalculator();
      preloadSipCalculator();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [preloadTaxRegimeCalculator, preloadSipCalculator]);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
        >
          Financial & Tax Calculators
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Use our comprehensive set of calculators to estimate taxes and plan your finances.
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="tax" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tax">Tax Calculators</TabsTrigger>
            <TabsTrigger value="financial">Financial Calculators</TabsTrigger>
          </TabsList>
        
          <TabsContent value="tax">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "New vs Old Tax Regime Calculator",
                  description: "Compare your tax liability under both tax regimes to make an informed decision.",
                  icon: <Calculator className="text-primary h-16 w-16" />,
                  href: "/calculators/tax-regime",
                  preloadFn: preloadTaxRegimeCalculator
                },
                {
                  title: "TDS Calculator",
                  description: "Calculate Tax Deducted at Source (TDS) for various income types under Indian tax laws.",
                  icon: <DollarSign className="text-primary h-16 w-16" />,
                  href: "/calculators/tds",
                  preloadFn: preloadTdsCalculator
                },
                {
                  title: "HRA Exemption Calculator",
                  description: "Calculate your House Rent Allowance (HRA) exemption based on your salary and rent paid.",
                  icon: <Home className="text-primary h-16 w-16" />,
                  href: "/calculators/hra",
                  preloadFn: preloadHraCalculator
                },
                {
                  title: "Capital Gains Calculator",
                  description: "Calculate tax on short-term and long-term capital gains from stocks, mutual funds, and property.",
                  icon: <BarChart3 className="text-primary h-16 w-16" />,
                  href: "/calculators/capital-gains",
                  preloadFn: preloadCapitalGainsCalculator
                },
                {
                  title: "Income Tax Calculator",
                  description: "Calculate your total income tax liability based on your income, deductions, and tax regime.",
                  icon: <Coins className="text-primary h-16 w-16" />,
                  href: "/calculators/income-tax"
                },
                {
                  title: "Advance Tax Calculator",
                  description: "Calculate your quarterly advance tax installments based on your estimated annual income.",
                  icon: <Calendar className="text-primary h-16 w-16" />,
                  href: "/calculators/advance-tax"
                },
                {
                  title: "Gratuity Calculator",
                  description: "Calculate your gratuity amount based on your salary and years of service.",
                  icon: <PiggyBank className="text-primary h-16 w-16" />,
                  href: "/calculators/gratuity"
                }
              ].map((calculator, index) => (
                <motion.div
                  key={calculator.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="border border-border rounded-md overflow-hidden transition-shadow"
                >
                  <div className="flex justify-center p-6 border-b border-border bg-muted/30">
                    {calculator.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-1">{calculator.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {calculator.description}
                    </p>
                    <motion.div 
                      className="flex justify-center mt-2"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 15,
                        delay: 0.6 
                      }}
                    >
                      <Link href={calculator.href}>
                        <div 
                          className="text-primary font-medium hover:underline text-sm flex items-center transition-all duration-300 transform hover:translate-x-1"
                          onMouseEnter={calculator.preloadFn}
                        >
                          Use Calculator 
                          <motion.span
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="ml-1"
                            >
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                          </motion.span>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "SIP Calculator",
                  description: "Calculate returns on your Systematic Investment Plan (SIP) investments over time.",
                  icon: <TrendingUp className="text-primary h-16 w-16" />,
                  href: "/calculators/sip",
                  preloadFn: preloadSipCalculator
                },
                {
                  title: "Compound Interest Calculator",
                  description: "Calculate how your investments grow over time with compound interest.",
                  icon: <LineChart className="text-primary h-16 w-16" />,
                  href: "/calculators/compound-interest"
                },
                {
                  title: "FD Calculator",
                  description: "Calculate returns on your Fixed Deposit investments with different interest rates and tenures.",
                  icon: <Building className="text-primary h-16 w-16" />,
                  href: "/calculators/fd",
                  preloadFn: preloadFdCalculator
                },
                {
                  title: "Loan EMI Calculator",
                  description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
                  icon: <Landmark className="text-primary h-16 w-16" />,
                  href: "/calculators/loan-emi",
                  preloadFn: preloadLoanEmiCalculator
                },
                {
                  title: "PPF Calculator",
                  description: "Calculate returns on your Public Provident Fund (PPF) investments over 15 years.",
                  icon: <Percent className="text-primary h-16 w-16" />,
                  href: "/calculators/ppf"
                },
                {
                  title: "View All Calculators",
                  description: "Explore our complete range of financial and tax calculators",
                  icon: <Calculator className="text-primary h-16 w-16 opacity-60" />,
                  href: "/calculators",
                  special: true
                }
              ].map((calculator, index) => (
                <motion.div
                  key={calculator.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <Link href={calculator.href}>
                    <div className={`${calculator.special ? 'border border-dashed border-primary' : 'border border-border'} rounded-md overflow-hidden h-full flex flex-col`}>
                      <div className={`flex justify-center p-6 border-b ${calculator.special ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'} flex-grow`}>
                        {calculator.icon}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-medium mb-1">{calculator.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {calculator.description}
                        </p>
                        {!calculator.special && (
                          <motion.div 
                            className="flex justify-center mt-2"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 15,
                              delay: 0.6 
                            }}
                          >
                            <div 
                              className="text-primary font-medium hover:underline text-sm flex items-center transition-all duration-300 transform hover:translate-x-1"
                              onMouseEnter={calculator.preloadFn}
                            >
                              Use Calculator 
                              <motion.span
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="ml-1"
                                >
                                  <path d="M5 12h14"></path>
                                  <path d="m12 5 7 7-7 7"></path>
                                </svg>
                              </motion.span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Tax Deadlines */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 mb-12"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <CalendarDays className="h-6 w-6 text-primary mr-2" />
              <CardTitle>Tax Deadlines</CardTitle>
            </div>
            <CardDescription>Stay on top of important Indian tax dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800"
              >
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-500">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Filing Requirements for AY 2025-26
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Individual with income exceeding ₹2,50,000 (₹3,00,000 for senior citizens)</li>
                  <li>• Company or firm (mandatory regardless of income)</li>
                  <li>• Individual claiming tax refund</li>
                  <li>• Foreign company with income from Indian sources</li>
                </ul>
              </motion.div>
              
              <div className="overflow-hidden rounded-md border">
                <motion.table 
                  className="w-full text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Due Date</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                      <th className="px-4 py-3 text-left font-medium">Days Left</th>
                      <th className="px-4 py-3 text-left font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        date: new Date(2025, 5, 15), // June 15, 2025
                        description: "First installment of advance tax (15%)",
                        priority: "medium"
                      },
                      {
                        date: new Date(2025, 8, 15), // September 15, 2025
                        description: "Second installment of advance tax (45%)",
                        priority: "low"
                      },
                      {
                        date: new Date(2025, 6, 31), // July 31, 2025
                        description: "ITR filing deadline for non-audit cases (AY 2025-26)",
                        priority: "high"
                      },
                      {
                        date: new Date(2025, 9, 31), // October 31, 2025
                        description: "ITR deadline for audit cases",
                        priority: "medium"
                      },
                      {
                        date: new Date(2025, 11, 15), // December 15, 2025
                        description: "Third installment of advance tax (75%)",
                        priority: "low"
                      },
                      {
                        date: new Date(2026, 2, 15), // March 15, 2026
                        description: "Final installment of advance tax (100%)",
                        priority: "low"
                      }
                    ]
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((deadline, index) => {
                      // Calculate days left from today
                      const today = new Date();
                      const daysLeft = Math.ceil((deadline.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isPast = daysLeft < 0;
                      
                      // Format date to display
                      const formattedDate = deadline.date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                      
                      // Determine priority color
                      let priorityColor = '';
                      let bgColor = '';
                      
                      if (deadline.priority === 'high') {
                        priorityColor = isPast ? 'text-gray-500' : 'text-red-600 dark:text-red-400';
                        bgColor = isPast ? 'bg-gray-100' : 'bg-red-50 dark:bg-red-950/20';
                      } else if (deadline.priority === 'medium') {
                        priorityColor = isPast ? 'text-gray-500' : 'text-orange-600 dark:text-orange-400';
                        bgColor = isPast ? 'bg-gray-100' : 'bg-orange-50 dark:bg-orange-950/20';
                      } else {
                        priorityColor = isPast ? 'text-gray-500' : 'text-blue-600 dark:text-blue-400';
                        bgColor = isPast ? 'bg-gray-100' : 'bg-blue-50 dark:bg-blue-950/20';
                      }
                      
                      return (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                          className={`border-b last:border-0 ${bgColor}`}
                        >
                          <td className={`px-4 py-3 font-medium ${priorityColor}`}>{formattedDate}</td>
                          <td className="px-4 py-3">{deadline.description}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {isPast ? (
                                <span className="text-gray-500">Passed</span>
                              ) : (
                                <span>{daysLeft} days</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                              deadline.priority === 'high' 
                                ? isPast ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-800' 
                                : deadline.priority === 'medium' 
                                  ? isPast ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-800' 
                                  : isPast ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </motion.table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-800"
                >
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Penalties for Late Filing
                  </h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• ₹5,000 if filed after due date but before December 31</li>
                    <li>• ₹10,000 if filed after December 31</li>
                    <li>• ₹1,000 fee for income below ₹5 lakh</li>
                    <li>• Additional 1% per month interest on due tax under Section 234A</li>
                    <li>• Potential prosecution in case of significant tax evasion</li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800"
                >
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    ITR Forms Summary
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-blue-100/50 dark:bg-blue-900/50">
                        <tr>
                          <th className="p-1 text-left font-medium">Form</th>
                          <th className="p-1 text-left font-medium">For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-blue-100 dark:border-blue-900/30">
                          <td className="p-1 font-medium">ITR-1</td>
                          <td className="p-1">Individuals with salary/pension income, one house property</td>
                        </tr>
                        <tr className="border-b border-blue-100 dark:border-blue-900/30">
                          <td className="p-1 font-medium">ITR-2</td>
                          <td className="p-1">Individuals with capital gains, foreign income, multiple properties</td>
                        </tr>
                        <tr className="border-b border-blue-100 dark:border-blue-900/30">
                          <td className="p-1 font-medium">ITR-3</td>
                          <td className="p-1">Individuals and HUFs with business/professional income</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-medium">ITR-4</td>
                          <td className="p-1">Presumptive income from business/profession</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Calculators;