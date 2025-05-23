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
  // FileText, // Added for GST Calculator - This was the duplicate
  Calendar,
  Coins,
  PiggyBank,
  TrendingUp,
  LineChart,
  Percent,
  Building,
  Landmark,
  Wallet
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
                  title: "Take Home Salary Calculator",
                  description: "Calculate your in-hand salary after tax and all deductions based on Indian income tax laws.",
                  icon: <Wallet className="text-primary h-16 w-16" />,
                  href: "/calculators/take-home-salary"
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
                },
                {
                  title: "GST Calculator",
                  description: "Calculate Goods and Services Tax (GST) amount based on price and GST rate.",
                  icon: <FileText className="text-primary h-16 w-16" />,
                  href: "/calculators/gst"
                  // preloadFn: undefined, // No preload function for this new calculator yet
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* ITR Filing Deadlines */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 px-4 py-2 border-b">
                    <h3 className="font-medium text-sm">ITR Filing Deadlines (AY 2025-26)</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Due Date</th>
                        <th className="px-4 py-2 text-left font-medium">Description</th>
                        <th className="px-4 py-2 text-left font-medium">Days Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: new Date(2025, 6, 31), // July 31, 2025
                          description: "ITR filing deadline for non-audit cases"
                        },
                        {
                          date: new Date(2025, 9, 31), // October 31, 2025
                          description: "ITR deadline for audit cases"
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
                        
                        return (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-2 font-medium">{formattedDate}</td>
                            <td className="px-4 py-2">{deadline.description}</td>
                            <td className="px-4 py-2">
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
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
                
                {/* Advance Tax Deadlines */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 px-4 py-2 border-b">
                    <h3 className="font-medium text-sm">Advance Tax Deadlines (FY 2025-26)</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Due Date</th>
                        <th className="px-4 py-2 text-left font-medium">Description</th>
                        <th className="px-4 py-2 text-left font-medium">Days Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: new Date(2025, 5, 15), // June 15, 2025
                          description: "First installment (15%)"
                        },
                        {
                          date: new Date(2025, 8, 15), // September 15, 2025
                          description: "Second installment (45%)"
                        },
                        {
                          date: new Date(2025, 11, 15), // December 15, 2025
                          description: "Third installment (75%)"
                        },
                        {
                          date: new Date(2026, 2, 15), // March 15, 2026
                          description: "Final installment (100%)"
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
                        
                        return (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-2 font-medium">{formattedDate}</td>
                            <td className="px-4 py-2">{deadline.description}</td>
                            <td className="px-4 py-2">
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
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              </div>
              
              {/* GST Filing Deadlines */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="overflow-hidden rounded-md border mb-4"
              >
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 px-4 py-2 border-b">
                  <h3 className="font-medium text-sm">GST Filing Deadlines (FY 2025-26)</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Return Type</th>
                      <th className="px-4 py-2 text-left font-medium">Due Date</th>
                      <th className="px-4 py-2 text-left font-medium">For</th>
                      <th className="px-4 py-2 text-left font-medium">Applicability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: "GSTR-1",
                        date: "11th of next month",
                        period: "Monthly outward supplies",
                        applicability: "Businesses with turnover > ₹5 crore"
                      },
                      {
                        type: "GSTR-1",
                        date: "13th of next quarter",
                        period: "Quarterly outward supplies",
                        applicability: "Businesses with turnover ≤ ₹5 crore"
                      },
                      {
                        type: "GSTR-3B",
                        date: "20th of next month",
                        period: "Monthly summary return",
                        applicability: "Businesses with turnover > ₹5 crore"
                      },
                      {
                        type: "GSTR-3B",
                        date: "22nd/24th of next quarter",
                        period: "Quarterly summary return",
                        applicability: "Businesses with turnover ≤ ₹5 crore (QRMP scheme)"
                      },
                      {
                        type: "CMP-08",
                        date: "18th of month after quarter",
                        period: "Quarterly payment statement",
                        applicability: "Composition dealers"
                      },
                      {
                        type: "GSTR-9",
                        date: "31st December (yearly)",
                        period: "Annual return",
                        applicability: "All regular taxpayers"
                      }
                    ]
                    .map((gst, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-2 font-medium">{gst.type}</td>
                        <td className="px-4 py-2">{gst.date}</td>
                        <td className="px-4 py-2">{gst.period}</td>
                        <td className="px-4 py-2">{gst.applicability}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              
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
