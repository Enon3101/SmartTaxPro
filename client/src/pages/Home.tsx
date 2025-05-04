import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Fill, File and Smile
            </h1>
            <p className="text-xl text-blue-500 font-medium">
              Easy filing wizard
            </p>
            
            <div className="flex justify-center items-center mt-4 mb-2">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <Star 
                  key={index} 
                  className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
                  strokeWidth={index === 4 ? 1 : 2}
                />
              ))}
            </div>
            <p className="text-gray-600">4.7 | 22,500+ Reviews</p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* Salary Income Plan */}
            <Card className="border-gray-200 relative overflow-hidden">
              <div className="absolute -rotate-45 bg-blue-100 text-blue-600 text-xs py-1 px-10 font-semibold -left-10 top-3">
                Most Popular
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-gray-500 text-xl">₹</span>
                  <span className="text-3xl font-bold">799</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Salary Income Plan</h3>
                <p className="text-sm text-gray-500 mb-4">For Salary, Interest, etc</p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Salary</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Bank Interest</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Pension</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>House Property</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-3">
                  Start Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Pay only after seeing your refund
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link href="/assisted-filing">
                    <div className="text-blue-500 text-sm hover:underline cursor-pointer">
                      CA Assisted Filing
                    </div>
                  </Link>
                  <p className="text-xs text-gray-500">starts at ₹ 1,399/- only</p>
                </div>
              </CardContent>
            </Card>
            
            {/* All Income Plan */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-gray-500 text-xl">₹</span>
                  <span className="text-3xl font-bold">999</span>
                  <span className="text-sm text-gray-500">onwards</span>
                </div>
                <h3 className="text-lg font-bold mb-1">All Income Plan</h3>
                <p className="text-sm text-gray-500 mb-4">Simple & Complex Returns</p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Salary, Interest, Pension</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Capital Gains</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Foreign Income</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Everything else</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-3">
                  Start Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Pay only after seeing your refund
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link href="/assisted-filing">
                    <div className="text-blue-500 text-sm hover:underline cursor-pointer">
                      CA Assisted Filing
                    </div>
                  </Link>
                  <p className="text-xs text-gray-500">starts at ₹ 1,399/- only</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Assisted Filing */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-gray-500 text-xl">₹</span>
                  <span className="text-3xl font-bold">1399</span>
                  <span className="text-sm text-gray-500">onwards</span>
                </div>
                <h3 className="text-lg font-bold mb-1">Assisted Filing</h3>
                <p className="text-sm text-gray-500 mb-4">For Complete Satisfaction</p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Salary, Interest, Pension</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Capital Gains</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Foreign Income</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Everything else</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-3">
                  Start Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Notice Protection Included
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link href="/notice-assistance">
                    <div className="text-blue-500 text-sm hover:underline cursor-pointer">
                      Notice Assistance
                    </div>
                  </Link>
                  <p className="text-xs text-gray-500">starts at ₹ 1,999/- only</p>
                </div>
              </CardContent>
            </Card>
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
