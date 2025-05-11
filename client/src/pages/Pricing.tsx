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
  const [selectedPlan, setSelectedPlan] = useState<string>("deluxe"); // Default to the popular plan
  
  // Pricing data
  const plans = [
    {
      id: "basic",
      name: "Basic Filer",
      price: 799,
      description: "For simple tax situations",
      icon: <Building className="h-6 w-6" />,
      features: {
        "Salary Income": true,
        "TDS from Salary": true,
        "House Property Income": true,
        "Multiple House Properties": false,
        "Interest & Other Sources Income": true,
        "Capital Gains": false,
        "Foreign Income": false,
        "Section 80C Deductions": true,
        "All other Deductions": false,
        "Easy ITR preparation & Filing": true,
        "TDS Schedule": false,
        "Foreign Tax Credit": false,
        "Form 67": false
      }
    },
    {
      id: "deluxe",
      name: "Deluxe Filer",
      price: 999,
      description: "For investors and homeowners",
      icon: <LineChart className="h-6 w-6" />,
      popular: true,
      features: {
        "Salary Income": true,
        "TDS from Salary": true,
        "House Property Income": true,
        "Multiple House Properties": true,
        "Interest & Other Sources Income": true,
        "Capital Gains": true,
        "Foreign Income": false,
        "Section 80C Deductions": true,
        "All other Deductions": true,
        "Easy ITR preparation & Filing": true,
        "TDS Schedule": true,
        "Foreign Tax Credit": false,
        "Form 67": false
      }
    },
    {
      id: "premier",
      name: "Premier Filer",
      price: 1399,
      description: "For complex tax situations",
      icon: <Globe className="h-6 w-6" />,
      features: {
        "Salary Income": true,
        "TDS from Salary": true,
        "House Property Income": true,
        "Multiple House Properties": true,
        "Interest & Other Sources Income": true,
        "Capital Gains": true,
        "Foreign Income": true,
        "Section 80C Deductions": true,
        "All other Deductions": true,
        "Easy ITR preparation & Filing": true,
        "TDS Schedule": true,
        "Foreign Tax Credit": true,
        "Form 67": true
      }
    }
  ];
  
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
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Income Tax Return Filing Pricing Plans
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
              Select The Product That's Right For You
            </p>
            
            {/* Pricing plan cards - horizontal layout */}
            <div className="mb-10">
              <div className="flex justify-center flex-wrap md:flex-nowrap gap-4">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className={`relative cursor-pointer flex-1 ${selectedPlan === plan.id ? 'ring-2 ring-green-500 scale-105 z-10' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <Card className={`h-full overflow-hidden transition-all duration-300 ${activePlanIndex === index ? 'shadow-lg' : 'shadow-md'}`}>
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] py-0.5 px-2 rounded-bl-md font-medium z-10">
                          RECOMMENDED
                        </div>
                      )}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/70 to-primary transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                      
                      <CardContent className="p-4 text-center">
                        <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-4 w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                          <div className="text-primary w-10 h-10">
                            {plan.icon}
                          </div>
                        </div>
                        
                        <h3 className="font-semibold mb-1">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                        
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground">From Price</p>
                          <div className="flex items-center justify-center">
                            <span className="text-muted-foreground text-sm mr-1">₹</span>
                            <span className="text-2xl font-bold">{plan.price}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">+ Taxes</p>
                        </div>
                        
                        <Button
                          size="sm" 
                          className={`w-full text-xs ${plan.popular ? 'bg-primary' : 'bg-primary/90'} hover:bg-primary/80 transition-all group`}
                        >
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Features comparison table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-3 px-4 text-left text-sm font-semibold border-r border-border">Features</th>
                    {plans.map((plan) => (
                      <th 
                        key={`header-${plan.id}`}
                        className={`py-3 px-4 text-center text-sm font-semibold ${selectedPlan === plan.id ? 'bg-green-50 dark:bg-green-900/10' : plan.popular ? 'bg-primary/5' : ''}`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(plans[0].features).map((feature, index) => (
                    <tr 
                      key={feature}
                      className={`${index % 2 === 0 ? 'bg-muted/40' : 'bg-transparent'} hover:bg-muted/60 transition-colors`}
                    >
                      <td className="py-3 px-4 border-r border-border text-sm font-medium">{feature}</td>
                      {plans.map((plan) => (
                        <td 
                          key={`${plan.id}-${feature}`} 
                          className={`py-3 px-4 text-center ${selectedPlan === plan.id ? 'bg-green-50 dark:bg-green-900/10' : plan.popular ? 'bg-primary/5' : ''}`}
                        >
                          {plan.features[feature as keyof typeof plan.features] ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            
            {/* Data Security Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 bg-card rounded-lg border border-border shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 text-center md:text-left">
                    <div className="inline-flex mb-4 p-4 rounded-full bg-green-50 dark:bg-green-900/20">
                      <Shield className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Bank-Level Data Security</h3>
                    <p className="text-muted-foreground">Your sensitive financial information is protected by advanced encryption technology</p>
                  </div>
                  
                  <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">256-bit Encryption</h4>
                        <p className="text-sm text-muted-foreground">All data is secured with bank-grade encryption standards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Secure Data Storage</h4>
                        <p className="text-sm text-muted-foreground">Your information is stored in secure servers with multiple safeguards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Regular Security Audits</h4>
                        <p className="text-sm text-muted-foreground">We conduct rigorous testing to ensure your data remains protected</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Strict Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground">Your data is never shared with third parties without your consent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Additional services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-primary/5 dark:bg-primary/10 rounded-lg p-8 mt-12 max-w-5xl mx-auto"
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
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-1.5 mr-2">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-1.5 mr-2">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span>File in 15 Minutes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex-shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 p-1.5 mr-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
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