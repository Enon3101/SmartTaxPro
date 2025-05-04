import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload, Phone } from "lucide-react";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Fill, File and Smile
              </h1>
              <p className="text-xl text-blue-500 font-medium mb-4">
                Easy filing wizard
              </p>
              
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <Star 
                    key={index} 
                    className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
                    strokeWidth={index === 4 ? 1 : 2}
                  />
                ))}
                <span className="ml-2 text-gray-600">4.7 | 22,500+ Reviews</span>
              </div>
              
              <p className="text-gray-600 mb-6">
                Complete your Income Tax Return in as little as 10 minutes. Get maximum refund with our intelligent tax engine.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/start-filing">
                  <div className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                      Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
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
              <div className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">ITR Filing Made Easy</h2>
                <div className="space-y-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Enter Your Details</h3>
                      <p className="text-sm text-gray-600">Simple step-by-step wizard to collect your information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Review Your Information</h3>
                      <p className="text-sm text-gray-600">Verify your details and calculate your refund</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Pay & Submit</h3>
                      <p className="text-sm text-gray-600">Make payment and file your return securely</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">e-Verify Your Return</h3>
                      <p className="text-sm text-gray-600">Complete the process with digital verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/start-filing">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col justify-between cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">File Your ITR</h3>
                  <p className="text-sm text-gray-600">Start filing your tax return for AY 2024-25</p>
                </div>
              </div>
            </Link>
            
            <Link href="/pricing">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col justify-between cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Pricing Plans</h3>
                  <p className="text-sm text-gray-600">View our affordable plans and services</p>
                </div>
              </div>
            </Link>
            
            <Link href="/tax-resources">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col justify-between cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Tax Resources</h3>
                  <p className="text-sm text-gray-600">Access guides and ITR forms</p>
                </div>
              </div>
            </Link>
            
            <Link href="/support">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col justify-between cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Get Support</h3>
                  <p className="text-sm text-gray-600">Contact our tax experts for help</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Easy ways to file section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">4 easy ways to file your tax return</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Quick Import from ITD</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Fetch your tax data directly from Government records and get a pre-filled form. Just review and file.
                </p>
                <Link href="/start-filing">
                  <div className="text-blue-500 hover:underline flex items-center cursor-pointer">
                    Start Now <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Form-16 Upload</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upload Form-16 for automatic data extraction and swift processing.
                </p>
                <Link href="/form-16-upload">
                  <div className="text-blue-500 hover:underline flex items-center cursor-pointer">
                    Start Now <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Easy Q&A Filing</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Simple, guided Q&A format that breaks down complex forms into easy, answerable questions.
                </p>
                <Link href="/start-filing">
                  <div className="text-blue-500 hover:underline flex items-center cursor-pointer">
                    Start Now <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  <CalendarDays className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Expert Assistance</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get expert help from our CA professionals who will take care of your entire tax filing process.
                </p>
                <Link href="/assisted-filing">
                  <div className="text-blue-500 hover:underline flex items-center cursor-pointer">
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits of filing */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Benefits of Filing with Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the most comprehensive and user-friendly tax filing service in India. Our platform is designed to simplify your tax filing experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold mb-3">Maximum Tax Refund</h3>
                <p className="text-gray-600">
                  Our intelligent tax engine identifies all eligible deductions and exemptions to maximize your tax refund and minimize your tax liability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3">Secure & Confidential</h3>
                <p className="text-gray-600">
                  Bank-level security with 256-bit encryption protects your personal and financial information. Your data is never shared with third parties.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-3">Quick & Easy</h3>
                <p className="text-gray-600">
                  Complete your tax return in as little as 10 minutes with our step-by-step guidance. No tax expertise required.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3">Expert Support</h3>
                <p className="text-gray-600">
                  Get access to our tax experts who can answer your questions and guide you through any complex tax situations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-3">Automatic Data Import</h3>
                <p className="text-gray-600">
                  Import your Form 16, capital gains data, and other tax information automatically to save time and reduce errors.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3">Accuracy Guarantee</h3>
                <p className="text-gray-600">
                  Our platform performs over 100 error checks to ensure your return is accurate and compliant with the latest tax laws.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Trust badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Government Authorised Tax Return Preparer</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Winner of Aatmanirbhar App Challenge</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">4.70 out of 5 starts from our reviews</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <p className="text-sm text-gray-600">Over 30 lakh users and counting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your ITR for AY 2024-25?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              It takes just 10 minutes to file your tax return with our simple step-by-step process.
              FREE filing available for income below ₹2.5 lakhs.
            </p>
            <Link href="/start-filing">
              <div className="inline-block">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  Start Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
