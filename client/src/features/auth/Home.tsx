import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload, Phone, Bot, AlertTriangle, Clock, FileCheck } from "lucide-react";
import { useContext } from "react";
import { Link } from "wouter";

import LoginDialog from "@/components/modals/LoginDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { TaxDataContext } from "@/context/TaxDataProvider";
import { Testimonials } from "@/components/Testimonials";
import TrustedBySection from "@/components/TrustedBySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Bulletin Component
const BulletinBanner = () => {
  const announcements = [
    {
      id: 1,
      text: "The Due date for ITR filing has been extended to 15th September 2025",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 2,
      text: "ITR 2 - ITR 3 are yet to be provided by Income Tax Department",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: 3,
      text: "ITR Filing LIVE Now",
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-blue-100 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-8 overflow-hidden">
          {announcements.map((announcement, index) => {
            const IconComponent = announcement.icon;
            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${announcement.bgColor} ${announcement.borderColor} border shadow-sm`}
              >
                <IconComponent className={`h-4 w-4 ${announcement.color}`} />
                <span className={`text-sm font-medium ${announcement.color} whitespace-nowrap`}>
                  {announcement.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { assessmentYear, setAssessmentYear } = useContext(TaxDataContext);
  
  return (
    <div className="bg-background">
      {/* Bulletin Banner */}
      <BulletinBanner />
      
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Fill, File and Smile
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xl text-blue-500 font-medium mb-4"
              >
                Easy filing wizard
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center mb-4"
              >
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 + (index * 0.05) }}
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
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="ml-2 text-muted-foreground"
                >
                  4.7 | 22,500+ Reviews
                </motion.span>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-muted-foreground mb-6"
              >
                Complete your Income Tax Return in as little as 10 minutes. Get maximum refund with our intelligent tax engine.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
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
                transition={{ duration: 0.3, delay: 0.4 }}
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
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md border border-blue-100"
              >
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  {!isAuthenticated && (
                    <LoginDialog buttonText="Login Now" className="w-full md:w-auto" />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Quick Access Navigation */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Everything You Need for Tax Filing
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "ITR Filing",
                description: "Complete ITR filing with step-by-step guidance",
                link: "/start-filing",
                color: "bg-blue-500"
              },
              {
                icon: Calculator,
                title: "Tax Calculators",
                description: "Calculate income tax, HRA, and other deductions",
                link: "/calculators",
                color: "bg-green-500"
              },
              {
                icon: Upload,
                title: "Document Vault",
                description: "Securely store and manage your tax documents",
                link: "/document-vault",
                color: "bg-purple-500"
              },
              {
                icon: Bot,
                title: "Tax Expert",
                description: "Get expert guidance and answers to tax queries",
                link: "/tax-expert",
                color: "bg-orange-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={item.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-center mb-12"
          >
                              Why Choose MyeCA.in?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "100% Accurate",
                description: "Our advanced algorithms ensure maximum accuracy in your tax calculations and filings."
              },
              {
                icon: FileText,
                title: "All ITR Forms",
                description: "Support for all ITR forms including ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, and ITR-7."
              },
              {
                icon: Upload,
                title: "Auto Import",
                description: "Automatically import data from Form 26AS, AIS, and other pre-filled sources."
              },
              {
                icon: Calculator,
                title: "Smart Calculations",
                description: "Real-time tax calculations with automatic optimization for maximum refunds."
              },
              {
                icon: Phone,
                title: "Expert Support",
                description: "Get help from certified tax professionals whenever you need assistance."
              },
              {
                icon: CheckCircle,
                title: "Secure & Safe",
                description: "Bank-level security with 256-bit SSL encryption to protect your sensitive data."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-primary-foreground mb-4"
          >
            Ready to File Your ITR?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
                            Join thousands of satisfied customers who have filed their returns with MyeCA.in's expert eCA assistance. Get started in minutes!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link href="/start-filing">
              <Button size="lg" variant="secondary" className="font-semibold">
                Start Your Free Filing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
