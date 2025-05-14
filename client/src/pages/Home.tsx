import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload, Phone, Bot } from "lucide-react";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";
import { useState, useContext } from "react";
import { TaxDataContext } from "@/context/TaxDataProvider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";

// Company logos will be loaded from the public directory

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { assessmentYear, setAssessmentYear } = useContext(TaxDataContext);
  
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
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-left"
            >
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              >
                Fill, File and Smile
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-blue-500 font-medium mb-4"
              >
                Easy filing wizard
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center mb-4"
              >
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  >
                    <Star 
                      className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
                      strokeWidth={index === 4 ? 1 : 2}
                    />
                  </motion.div>
                ))}
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="ml-2 text-muted-foreground"
                >
                  4.7 | 22,500+ Reviews
                </motion.span>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-muted-foreground mb-6"
              >
                Complete your Income Tax Return in as little as 10 minutes. Get maximum refund with our intelligent tax engine.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-700 mr-3">Assessment Year:</span>
                  <Select 
                    value={assessmentYear}
                    onValueChange={setAssessmentYear}
                  >
                    <SelectTrigger className="w-36 bg-white border-blue-300 focus:ring-blue-500">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                      <SelectItem value="2026-27">2026-27</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start"
              >
                <Link href="/start-filing">
                  <div className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                      Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </Link>
                <Link href="/filing-requirements">
                  <div className="inline-block">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto transition-all duration-300 transform hover:-translate-y-1">
                      Who Should File ITR?
                    </Button>
                  </div>
                </Link>
                <Link href="/pricing">
                  <div className="inline-block">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto transition-all duration-300 transform hover:-translate-y-1">
                      View Pricing
                    </Button>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md border border-blue-100"
              >
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl font-bold mb-4 text-center"
                >
                  ITR Filing Made Easy
                </motion.h2>
                <div className="space-y-5">
                  {[
                    {
                      number: 1,
                      title: "Enter Your Details",
                      description: "Simple step-by-step wizard to collect your information"
                    },
                    {
                      number: 2,
                      title: "Review Your Information",
                      description: "Verify your details and calculate your refund"
                    },
                    {
                      number: 3,
                      title: "Pay & Submit",
                      description: "Make payment and file your return securely"
                    },
                    {
                      number: 4,
                      title: "e-Verify Your Return",
                      description: "Complete the process with digital verification"
                    }
                  ].map((step, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                      className="flex items-center"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0"
                      >
                        <span className="font-semibold">{step.number}</span>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Navigation cards */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-8 bg-muted"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                href: "/start-filing",
                icon: <FileText className="h-6 w-6 text-blue-500" />,
                title: "File Your ITR",
                description: "Start filing your tax return for AY 2024-25"
              },
              {
                href: "/pricing",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                ),
                title: "Pricing Plans",
                description: "View our affordable plans and services"
              },
              {
                href: "/tax-resources",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                ),
                title: "Tax Resources",
                description: "Access guides and ITR forms"
              },
              {
                href: "/tax-expert",
                icon: <Bot className="h-6 w-6 text-blue-500" />,
                title: "TaxGuru AI Expert",
                description: "Get instant answers to tax questions"
              },
              {
                href: "/support",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                ),
                title: "Get Support",
                description: "Contact our tax experts for help"
              }
            ].map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <Link href={card.href}>
                  <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border h-full flex flex-col justify-between cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trusted by section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8 bg-primary/5 border-y border-border"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-muted-foreground">As trusted by</h3>
          </div>
          
          <div className="logo-slider">
            <div className="logo-slide-track">
              {/* First set of logos */}
              <div className="logo-slide" style={{ "--i": 1 } as React.CSSProperties}>
                <img src="company-logos/tcs.png" alt="Tata Consultancy Services" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Tata Consultancy Services</span>
              </div>
              <div className="logo-slide" style={{ "--i": 2 } as React.CSSProperties}>
                <img src="company-logos/infosys.png" alt="Infosys" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Infosys</span>
              </div>
              <div className="logo-slide" style={{ "--i": 3 } as React.CSSProperties}>
                <img src="company-logos/reliance.png" alt="Reliance Industries" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Reliance Industries</span>
              </div>
              <div className="logo-slide" style={{ "--i": 4 } as React.CSSProperties}>
                <img src="company-logos/wipro.png" alt="Wipro" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Wipro</span>
              </div>
              <div className="logo-slide" style={{ "--i": 5 } as React.CSSProperties}>
                <img src="company-logos/hdfc.png" alt="HDFC Bank" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">HDFC Bank</span>
              </div>
              <div className="logo-slide" style={{ "--i": 6 } as React.CSSProperties}>
                <img src="company-logos/airtel.png" alt="Bharti Airtel" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Bharti Airtel</span>
              </div>
              <div className="logo-slide" style={{ "--i": 7 } as React.CSSProperties}>
                <img src="company-logos/itc.png" alt="ITC Limited" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">ITC Limited</span>
              </div>
              <div className="logo-slide" style={{ "--i": 8 } as React.CSSProperties}>
                <img src="company-logos/icici.png" alt="ICICI Bank" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">ICICI Bank</span>
              </div>
              <div className="logo-slide" style={{ "--i": 9 } as React.CSSProperties}>
                <img src="company-logos/sbi.png" alt="State Bank of India" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">State Bank of India</span>
              </div>
              
              {/* Duplicate logos for infinite scroll effect */}
              <div className="logo-slide" style={{ "--i": 10 } as React.CSSProperties}>
                <img src="company-logos/tcs.png" alt="Tata Consultancy Services" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Tata Consultancy Services</span>
              </div>
              <div className="logo-slide" style={{ "--i": 11 } as React.CSSProperties}>
                <img src="company-logos/infosys.png" alt="Infosys" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Infosys</span>
              </div>
              <div className="logo-slide" style={{ "--i": 12 } as React.CSSProperties}>
                <img src="company-logos/reliance.png" alt="Reliance Industries" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Reliance Industries</span>
              </div>
              <div className="logo-slide" style={{ "--i": 13 } as React.CSSProperties}>
                <img src="company-logos/wipro.png" alt="Wipro" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Wipro</span>
              </div>
              <div className="logo-slide" style={{ "--i": 14 } as React.CSSProperties}>
                <img src="company-logos/hdfc.png" alt="HDFC Bank" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">HDFC Bank</span>
              </div>
              <div className="logo-slide" style={{ "--i": 15 } as React.CSSProperties}>
                <img src="company-logos/airtel.png" alt="Bharti Airtel" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">Bharti Airtel</span>
              </div>
              <div className="logo-slide" style={{ "--i": 16 } as React.CSSProperties}>
                <img src="company-logos/itc.png" alt="ITC Limited" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">ITC Limited</span>
              </div>
              <div className="logo-slide" style={{ "--i": 17 } as React.CSSProperties}>
                <img src="company-logos/icici.png" alt="ICICI Bank" className="logo-img" />
                <span className="text-xs font-medium text-muted-foreground">ICICI Bank</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Easy ways to file section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-12 bg-muted"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold mb-10 text-center"
          >
            4 easy ways to file your tax return
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText className="h-6 w-6 text-blue-500" />,
                title: "Quick Import from ITD",
                description: "Fetch your tax data directly from Government records and get a pre-filled form. Just review and file.",
                href: "/start-filing",
                linkText: "Start Now"
              },
              {
                icon: <Upload className="h-6 w-6 text-blue-500" />,
                title: "Form-16 Upload",
                description: "Upload Form-16 for automatic data extraction and swift processing.",
                href: "/form-16-upload",
                linkText: "Start Now"
              },
              {
                icon: <Calculator className="h-6 w-6 text-blue-500" />,
                title: "Easy Q&A Filing",
                description: "Simple, guided Q&A format that breaks down complex forms into easy, answerable questions.",
                href: "/start-filing",
                linkText: "Start Now"
              },
              {
                icon: <CalendarDays className="h-6 w-6 text-blue-500" />,
                title: "Expert Assistance",
                description: "Get expert help from our CA professionals who will take care of your entire tax filing process.",
                href: "/assisted-filing",
                linkText: "Get Started"
              }
            ].map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-card border-0 shadow-sm h-full">
                  <CardContent className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {card.description}
                    </p>
                    <Link href={card.href}>
                      <div className="text-blue-500 hover:underline flex items-center cursor-pointer">
                        {card.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* AI Tax Expert Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">NEW FEATURE</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-4">
                Meet <span className="text-blue-600">TaxGuru</span>, Your Personal Tax Expert
              </h2>
              <p className="text-gray-700 mb-6">
                Have questions about Indian tax laws, deductions, or filing requirements? Our AI-powered 
                Tax Expert is here to help you understand complex tax concepts in simple language. Get 
                immediate answers to your tax queries anytime.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Understand tax deductions and exemptions",
                  "Learn about income tax slabs and calculations",
                  "Get guidance on choosing the right ITR form",
                  "Know filing deadlines and requirements",
                  "Explore tax saving investment options"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/tax-expert">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Ask TaxGuru Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-md">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-100">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800">TaxGuru - Indian Tax Expert</h3>
                    <p className="text-sm text-blue-700">Answers all your tax-related questions</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm ml-auto mr-0 max-w-[80%] border border-blue-100">
                    <p className="text-sm">What are the tax slabs for AY 2026-27?</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg shadow-sm max-w-[80%] border border-blue-100">
                    <p className="text-sm">Here are the income tax slabs for AY 2026-27 (FY 2025-26) under the new tax regime:</p>
                    <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                      <li>Up to ₹3,00,000: No tax</li>
                      <li>₹3,00,001 to ₹6,00,000: 5%</li>
                      <li>₹6,00,001 to ₹9,00,000: 10%</li>
                      <li>₹9,00,001 to ₹12,00,000: 15%</li>
                      <li>₹12,00,001 to ₹15,00,000: 20%</li>
                      <li>Above ₹15,00,000: 30%</li>
                    </ul>
                    <p className="text-sm mt-2">Remember, these rates apply only to the new tax regime. The old regime has different slabs with various deductions available.</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link href="/tax-expert">
                    <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                      Try TaxGuru Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits of filing */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-12 bg-gradient-to-r from-blue-50 to-blue-100"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Benefits of Filing with Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the most comprehensive and user-friendly tax filing service in India. Our platform is designed to simplify your tax filing experience.
            </p>
          </motion.div>
          
          {/* Mobile OTP Login Banner */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12 bg-card rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Quick Login with Mobile OTP</h3>
                  <p className="text-muted-foreground mb-4">
                    Use your mobile number to quickly login or register. No need to remember complex passwords!
                  </p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">Secure</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">Fast</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">Convenient</span>
                    </div>
                  </div>
                  <LoginDialog buttonText="Login Now" className="w-full md:w-auto" />
                </div>
                <div className="md:w-1/3 bg-blue-500 p-6 md:p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-card w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Phone className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-white font-medium">Mobile OTP Authentication</p>
                    <p className="text-blue-100 text-sm mt-2">
                      Your phone is your password
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Accurate Calculations",
                description: "Our tax engine ensures 100% accurate tax calculations as per the latest Income Tax rules."
              },
              {
                title: "Secure & Confidential",
                description: "Your data is protected with bank-grade 256-bit encryption and never shared with third parties."
              },
              {
                title: "Auto-Fill from Form 16",
                description: "Upload your Form 16 and get your ITR auto-filled with accurate information."
              },
              {
                title: "Maximize Tax Refunds",
                description: "Our intelligent tax engine helps you claim all eligible deductions to maximize your refund."
              },
              {
                title: "Expert Support",
                description: "Get assistance from our CA experts via chat, email, or phone whenever you need help."
              },
              {
                title: "Easy e-Verification",
                description: "Complete your filing with quick Aadhaar OTP or Net Banking-based e-verification."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-card border-0 shadow-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4 bg-blue-50 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="py-14 bg-blue-600 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-2xl font-bold mb-4"
            >
              Ready to Start Your ITR for AY 2024-25?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-blue-100 max-w-2xl mx-auto mb-8"
            >
              It takes just 10 minutes to file your tax return with our simple step-by-step process.
              FREE filing available for income below ₹2.5 lakhs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/start-filing">
                <div className="inline-block">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                    Start Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;