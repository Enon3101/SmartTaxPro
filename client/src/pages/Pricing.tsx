import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Download, 
  Building, 
  LineChart, 
  Globe, 
  Home,
  Shield, 
  Clock, 
  Mail
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Pricing = () => {
  const [activePlanIndex, setActivePlanIndex] = useState(1); // Default to middle plan
  
  // Pricing data
  const prices = {
    basic: 799,
    deluxe: 999,
    premier: 1399
  };
  
  return (
    <div className="bg-background">
      {/* Hero section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-10 md:py-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Transparent Pricing Plans
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best suits your tax filing needs. All plans include our accuracy guarantee and expert support.
            </p>
          </div>
        </div>
      </motion.section>
      
      {/* Main pricing section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActivePlanIndex(0)}
              className="h-full"
            >
              <Card className={`border-border h-full overflow-hidden transition-all duration-300 ${activePlanIndex === 0 ? 'shadow-lg dark:shadow-primary/20 border-primary/30' : 'shadow-md'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                <CardContent className="p-8 pt-12">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 mb-6 mx-auto flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Basic Filer</h2>
                    <div className="mt-4 mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-xl mr-1">₹</span>
                      <span className="text-4xl font-bold">{prices.basic}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      For simple tax situations
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Salary/Pension upto ₹ 10,00,000</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>House Property (Single)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Standard Deductions</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>TDS from Salary</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Other Source (Bank Interest)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>TDS from Bank (upto ₹ 10,000)</span>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mr-3 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Multiple House Properties</span>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mr-3 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Capital Gains</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90 transition-all group">
                    <span>Start Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Deluxe Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActivePlanIndex(1)}
              className="h-full"
            >
              <Card className={`border-primary/30 h-full relative overflow-hidden transition-all duration-500 ${activePlanIndex === 1 ? 'shadow-xl dark:shadow-primary/30 scale-105 z-10' : 'shadow-md'}`}>
                <div className="absolute top-0 right-0 bg-primary text-white text-xs py-1 px-3 rounded-bl-lg font-semibold">
                  MOST POPULAR
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent transform transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70"></div>
                <CardContent className="p-8 pt-12">
                  <div className="rounded-full bg-primary/20 dark:bg-primary/30 p-3 w-12 h-12 mb-6 mx-auto flex items-center justify-center">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Deluxe Filer</h2>
                    <div className="mt-4 mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-xl mr-1">₹</span>
                      <span className="text-4xl font-bold">{prices.deluxe}</span>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30">
                      For investors and homeowners
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Salary/Pension upto ₹ 20,00,000</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>House Property (more than 1 property)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Capital Gain (upto 50 transactions)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Agriculture Income</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Relief u/s 89</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Special Rate Income</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Losses & Advance Tax</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button className="w-full transition-all group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md">
                    <span>Start Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Premier Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActivePlanIndex(2)}
              className="h-full"
            >
              <Card className={`border-border h-full overflow-hidden transition-all duration-300 ${activePlanIndex === 2 ? 'shadow-lg dark:shadow-primary/20 border-primary/30' : 'shadow-md'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                <CardContent className="p-8 pt-12">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 mb-6 mx-auto flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Premier Filer</h2>
                    <div className="mt-4 mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-xl mr-1">₹</span>
                      <span className="text-4xl font-bold">{prices.premier}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      For complex tax situations
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Salary/Pension more than ₹ 20,00,000</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Foreign Income</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>House Property (more than 1 property)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Income from Firms</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Capital Gain (unlimited transactions)</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Foreign Assets</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 shrink-0 mt-0.5" />
                      <span>Priority Expert Support 24/7</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90 transition-all group">
                    <span>Start Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          {/* Feature Comparison Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 overflow-hidden rounded-lg border border-border shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-4 text-base font-semibold">Feature Comparison</th>
                    <th className="px-6 py-4 text-center text-base font-semibold">Basic Filer</th>
                    <th className="px-6 py-4 text-center text-base font-semibold bg-primary/5">
                      <div className="relative">
                        Deluxe Filer
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs py-0.5 px-1.5 rounded-sm">POPULAR</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-base font-semibold">Premier Filer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Salary/Pension Income</td>
                    <td className="px-6 py-4 text-center">Up to ₹10L</td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">Up to ₹20L</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">House Property</td>
                    <td className="px-6 py-4 text-center">Single</td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">Multiple</td>
                    <td className="px-6 py-4 text-center">Multiple</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Capital Gains</td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">Up to 50 transactions</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Foreign Income/Assets</td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Exempt Income</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Specialized Income Types</td>
                    <td className="px-6 py-4 text-center">Basic</td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">Advanced</td>
                    <td className="px-6 py-4 text-center">All Types</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">Support Level</td>
                    <td className="px-6 py-4 text-center">Standard</td>
                    <td className="px-6 py-4 text-center bg-primary/[0.02]">Enhanced</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary text-white rounded">Premium</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">Price</td>
                    <td className="px-6 py-4 text-center font-medium">
                      ₹{prices.basic}
                    </td>
                    <td className="px-6 py-4 text-center font-medium bg-primary/[0.02]">
                      ₹{prices.deluxe}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      ₹{prices.premier}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Additional services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-primary/5 dark:bg-primary/10 rounded-lg p-8 mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Additional Premium Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-1/3 mb-4 md:mb-0">
                        <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 w-12 h-12 mb-4 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Income Tax Assistance</h3>
                        <p className="text-muted-foreground mt-2">Expert help when you need it</p>
                      </div>
                      <div className="md:w-2/3 md:pl-6">
                        <p className="text-muted-foreground mb-4">
                          Get assistance from our certified tax experts who can guide you through complex tax situations, review your return, and provide personalized advice.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-muted-foreground">Starting at</span>
                            <div>
                              <span className="text-2xl font-bold">₹1,999</span>
                            </div>
                          </div>
                          <Link href="/tax-assistance">
                            <div className="inline-block">
                              <Button className="bg-primary hover:bg-primary/90 transition-all group">
                                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
                              </Button>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-1/3 mb-4 md:mb-0">
                        <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 w-12 h-12 mb-4 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Notice Assistance</h3>
                        <p className="text-muted-foreground mt-2">Peace of mind for tax notices</p>
                      </div>
                      <div className="md:w-2/3 md:pl-6">
                        <p className="text-muted-foreground mb-4">
                          Our experts will help you respond to notices from the Income Tax Department, including defective returns, demand determinations, and information requests.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-muted-foreground">Starting at</span>
                            <div>
                              <span className="text-2xl font-bold">₹2,499</span>
                            </div>
                          </div>
                          <Link href="/notice-assistance">
                            <div className="inline-block">
                              <Button className="bg-primary hover:bg-primary/90 transition-all group">
                                Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1" />
                              </Button>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="py-12 bg-background"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  Do I need to pay upfront?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  No, you can complete your entire tax return before paying. You only pay when you're satisfied with your refund calculation and ready to file. We believe in transparency, so you'll know exactly what you're paying for.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  What if I need help during filing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  All plans include access to our help resources and community. For personalized assistance, you can upgrade to our tax expert service at any time. Our support team is available 7 days a week to answer your questions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  Which plan is right for me?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Choose based on your income sources and complexity:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><span className="font-medium">Basic</span>: For simple salary income up to ₹10,00,000 with single house property.</li>
                    <li><span className="font-medium">Deluxe</span>: For investments, multiple properties, and salary up to ₹20,00,000.</li>
                    <li><span className="font-medium">Premier</span>: For high income, foreign assets, or complex tax situations.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  Is my data secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes, we use bank-level security encryption and follow strict privacy policies. Your data is never shared with third parties without your consent. We employ 256-bit encryption and regular security audits to ensure your information remains protected.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  Can I switch plans after I start?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes, you can upgrade your plan at any time during the tax filing process. If your tax situation is more complex than you initially thought, you can easily upgrade to a more suitable plan without losing any of your information.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b border-border">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors">
                  What if I'm not satisfied with the service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  We offer a satisfaction guarantee. If you're not completely satisfied with our service, contact our customer support team within 30 days of purchase, and we'll work to resolve your concerns or provide a refund if necessary.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </motion.section>
      
      {/* CTA section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="py-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 hidden md:block"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 hidden md:block"></div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Ready to File Your Taxes?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Join over 30 lakh satisfied users who trust us for accurate and hassle-free tax filing. Get started today and file your return in minutes.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/start-filing">
                <div className="inline-block">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all group px-6 py-6">
                    <span className="mr-2">Start Your Tax Return</span>
                    <ArrowRight className="h-5 w-5 transition-transform transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Link>
            </motion.div>
            
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                <span>File in 15 Minutes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                <span>Accuracy Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Pricing;