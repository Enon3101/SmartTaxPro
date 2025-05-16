import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload, Phone, Bot } from "lucide-react";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";
import { useContext } from "react";
import { TaxDataContext } from "@/context/TaxDataProvider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import TrustedBySection from "@/components/TrustedBySection";

// Performance-optimized home page without heavy animations
const HomeSimplified = () => {
  const { isAuthenticated, user } = useAuth();
  const { assessmentYear, setAssessmentYear } = useContext(TaxDataContext);
  
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Fill, File and Smile
              </h1>
              <p className="text-xl text-blue-500 font-medium mb-4">
                Easy filing wizard
              </p>
              
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div key={index}>
                    <Star 
                      className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
                      strokeWidth={index === 4 ? 1 : 2}
                    />
                  </div>
                ))}
                <span className="ml-2 text-muted-foreground">
                  4.7 | 22,500+ Reviews
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Complete your Income Tax Return in as little as 10 minutes. Get maximum refund with our intelligent tax engine.
              </p>
              
              <div className="mb-6">
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
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start">
                <Link href="/start-filing">
                  <div className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                      Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </Link>
                <Link href="/filing-requirements">
                  <div className="inline-block">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Who Should File ITR?
                    </Button>
                  </div>
                </Link>
                <Link href="/pricing">
                  <div className="inline-block">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      View Pricing
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
            
            <div>
              <div className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md border border-blue-100">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  ITR Filing Made Easy
                </h2>
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
                    <div key={index} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-semibold">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-8 bg-muted">
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
              <div key={index}>
                <Link href={card.href}>
                  <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border h-full flex flex-col justify-between cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Trusted by section - using the optimized component */}
      <TrustedBySection />
      
      {/* Easy ways to file section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Easy Ways to File Your ITR
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-10 w-10 text-blue-500" />,
                title: "Upload Form 16",
                description: "Simply upload your Form 16 and we'll auto-fill most of your ITR details"
              },
              {
                icon: <Calculator className="h-10 w-10 text-blue-500" />,
                title: "Expert-Assisted",
                description: "Connect with our tax experts who will guide you through the entire process"
              },
              {
                icon: <Bot className="h-10 w-10 text-blue-500" />,
                title: "AI Assistant",
                description: "Our AI-powered TaxGuru can answer your questions 24/7"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tax Expert Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-blue-500" />
                <span className="text-blue-600 font-medium">AI-POWERED ASSISTANT</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Get Instant Tax Answers with TaxGuru AI</h2>
              <p className="text-muted-foreground mb-6">
                Our AI tax expert can answer your tax-related questions instantly. Whether you're confused about deductions, 
                tax slabs, or ITR forms, TaxGuru has got you covered.
              </p>
              <div className="flex space-x-4">
                <Link href="/tax-expert">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Ask TaxGuru <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-md">
                <div className="flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800">What deductions can I claim under Section 80C?</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-800">Under Section 80C, you can claim deductions up to ₹1,50,000 for investments/expenses like:</p>
                        <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm">
                          <li>EPF (Employee Provident Fund) contributions</li>
                          <li>PPF (Public Provident Fund) deposits</li>
                          <li>Life insurance premiums</li>
                          <li>ELSS (Equity Linked Saving Scheme) investments</li>
                          <li>Home loan principal repayment</li>
                          <li>Tuition fees for children's education (max 2 children)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of filing */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why File Your ITR with Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make the complex process of filing income tax returns simple, accurate, and fast.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="h-10 w-10 text-green-500" />,
                title: "100% Accuracy",
                description: "Our intelligent tax engine ensures your return is error-free"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-blue-500">
                    <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6"></path>
                    <path d="M13 18a3 3 0 0 1 6 0v.5"></path>
                    <path d="M6 10v8a3 3 0 0 0 3 3h6"></path>
                    <path d="m10 15 3-3 3 3"></path>
                  </svg>
                ),
                title: "Maximum Refund",
                description: "We help you claim all eligible deductions and exemptions"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-orange-500">
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M22 22H2"></path>
                    <path d="m8 22 4-10 4 10"></path>
                  </svg>
                ),
                title: "Fast Processing",
                description: "Complete your ITR in minutes, not hours"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-red-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <line x1="12" x2="12" y1="8" y2="16"></line>
                    <line x1="8" x2="16" y1="12" y2="12"></line>
                  </svg>
                ),
                title: "Expert Support",
                description: "Get help from certified tax professionals whenever needed"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-14 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to file your ITR?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of Indians who trust us for easy and accurate tax filing. Our step-by-step process makes ITR filing simple for everyone.
            </p>
            <Link href="/start-filing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSimplified;