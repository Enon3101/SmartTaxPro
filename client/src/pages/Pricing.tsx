import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

const Pricing = () => {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing Plans
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best suits your tax filing needs. All plans include our accuracy guarantee and expert support.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main pricing section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">Basic Filer</h2>
                  <div className="mt-4 mb-4">
                    <span className="text-gray-500 text-xl">₹</span>
                    <span className="text-4xl font-bold">799</span>
                  </div>
                  <p className="text-gray-500 text-sm">For simple tax situations</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Salary/Pension upto ₹ 10,00,000</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>House Property (Single)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Standard Deductions</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>TDS from Salary</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Other Source (Bank Interest)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>TDS from Bank (upto ₹ 10,000)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Self Assessment Tax</span>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-gray-300 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-400">Multiple House Properties</span>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-gray-300 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-400">Capital Gains</span>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Start Now
                </Button>
              </CardContent>
            </Card>
            
            {/* Deluxe Plan */}
            <Card className="border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs py-1 px-3 rounded-bl-lg font-semibold">
                MOST POPULAR
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">Deluxe Filer</h2>
                  <div className="mt-4 mb-4">
                    <span className="text-gray-500 text-xl">₹</span>
                    <span className="text-4xl font-bold">999</span>
                  </div>
                  <p className="text-gray-500 text-sm">For investors and homeowners</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Salary/Pension upto ₹ 20,00,000</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>House Property (more than 1 property)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Capital Gain (upto 50 transactions)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Agriculture Income</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Exempt Income</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Relief u/s 89</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Special Rate Income</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Losses</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Advance Tax</span>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Start Now
                </Button>
              </CardContent>
            </Card>
            
            {/* Premier Plan */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">Premier Filer</h2>
                  <div className="mt-4 mb-4">
                    <span className="text-gray-500 text-xl">₹</span>
                    <span className="text-4xl font-bold">1399</span>
                  </div>
                  <p className="text-gray-500 text-sm">For complex tax situations</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Salary/Pension more than ₹ 20,00,000</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Foreign Income</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>House Property (more than 1 property)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Income from Firms</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Capital Gain (51 records and above)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Foreign Assets</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Relief u/s 90 / 91</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>All features from Deluxe Plan</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                    <span>Priority Support</span>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Start Now
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional services */}
          <div className="bg-blue-50 rounded-lg p-8 mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Additional Services</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      <h3 className="text-xl font-bold">Income Tax Assistance</h3>
                      <p className="text-gray-500 mt-2">Expert help when you need it</p>
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <p className="text-gray-600 mb-4">
                        Get assistance from our certified tax experts who can guide you through complex tax situations, review your return, and provide personalized advice.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-gray-500">Starting at</span>
                          <div>
                            <span className="text-2xl font-bold">₹1,999</span>
                          </div>
                        </div>
                        <Link href="/tax-assistance">
                          <div className="inline-block">
                            <Button>
                              Learn More <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3 mb-4 md:mb-0">
                      <h3 className="text-xl font-bold">Notice Assistance</h3>
                      <p className="text-gray-500 mt-2">Peace of mind for tax notices</p>
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <p className="text-gray-600 mb-4">
                        Our experts will help you respond to notices from the Income Tax Department, including defective returns, demand determinations, and information requests.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-gray-500">Starting at</span>
                          <div>
                            <span className="text-2xl font-bold">₹2,499</span>
                          </div>
                        </div>
                        <Link href="/notice-assistance">
                          <div className="inline-block">
                            <Button>
                              Learn More <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Do I need to pay upfront?</h3>
              <p className="text-gray-600">
                No, you can complete your entire tax return before paying. You only pay when you're satisfied with your refund calculation and ready to file.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">What if I need help during filing?</h3>
              <p className="text-gray-600">
                All plans include access to our help resources and community. For personalized assistance, you can upgrade to our tax expert service at any time.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Which plan is right for me?</h3>
              <p className="text-gray-600">
                Choose based on your income sources. Basic for simple salary income, Deluxe for investments and property, Premier for high income or foreign income.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes, we use bank-level security encryption and follow strict privacy policies. Your data is never shared with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to File Your Taxes?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join over 30 lakh satisfied users who trust us for accurate and hassle-free tax filing. Get started today and file your return in minutes.
          </p>
          <Link href="/start-filing">
            <div className="inline-block">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Start Your Tax Return <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;