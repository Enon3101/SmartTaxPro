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
            <div className="space-y-4">
              {[
                {
                  date: "July 31, 2024",
                  description: "ITR filing deadline for non-audit cases (AY 2024-25)"
                },
                {
                  date: "June 15, 2024",
                  description: "First installment of advance tax (15%)"
                },
                {
                  date: "Sept 15, 2024",
                  description: "Second installment of advance tax (45%)"
                },
                {
                  date: "Oct 31, 2024",
                  description: "ITR deadline for audit cases"
                },
                {
                  date: "Dec 15, 2024",
                  description: "Third installment of advance tax (75%)"
                },
                {
                  date: "Mar 15, 2025",
                  description: "Final installment of advance tax (100%)"
                }
              ].map((deadline, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className="flex items-start"
                >
                  <div className="min-w-[100px] font-medium">{deadline.date}</div>
                  <div className="text-sm text-muted-foreground">{deadline.description}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Calculators;