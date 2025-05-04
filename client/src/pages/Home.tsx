import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Shield, FilePlus } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Easy ITR Filing for Indian Taxpayers
              </h1>
              <p className="text-lg mb-8 text-[#ADB5BD]">
                File your Income Tax Return with confidence using our easy-to-use platform. 
                Maximize deductions under Sections 80C, 80D and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/file-taxes">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-96 bg-primary/10 rounded-2xl overflow-hidden">
                  <svg 
                    viewBox="0 0 400 400" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full opacity-30"
                  >
                    <path 
                      d="M40 40h320v320H40z" 
                      fill="#0066CC" 
                      fillOpacity="0.1"
                    />
                    <path 
                      d="M220 120c55.228 0 100 44.772 100 100s-44.772 100-100 100-100-44.772-100-100 44.772-100 100-100z" 
                      fill="#00A878" 
                      fillOpacity="0.2"
                    />
                    <path 
                      d="M140 80c33.137 0 60 26.863 60 60s-26.863 60-60 60-60-26.863-60-60 26.863-60 60-60z" 
                      fill="#FF7043" 
                      fillOpacity="0.3"
                    />
                  </svg>
                </div>
                <div className="absolute top-8 right-8 bg-white p-6 rounded-lg shadow-md w-64">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold">Tax Summary</div>
                    <div className="text-secondary font-bold">$1,240</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Federal Refund</span>
                      <span>$1,240</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>State Refund</span>
                      <span>$0</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 bg-white p-6 rounded-lg shadow-md w-64">
                  <div className="text-lg font-bold mb-3">Filing Progress</div>
                  <div className="w-full bg-[#E9ECEF] rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full w-2/3"></div>
                  </div>
                  <div className="text-sm text-[#ADB5BD]">2 of 3 sections complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EasyTax?</h2>
            <p className="text-[#ADB5BD] max-w-2xl mx-auto">
              Our platform makes tax filing simple, accurate, and stress-free with 
              features designed for every type of taxpayer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">ITR Accuracy Guarantee</h3>
                <p className="text-[#ADB5BD]">
                  Our software double-checks your ITR to help you avoid errors 
                  and maximize your tax savings using all applicable deductions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure ITR Filing</h3>
                <p className="text-[#ADB5BD]">
                  Your PAN, Aadhaar and financial data are protected with industry-leading 
                  encryption and security practices at every step.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <FilePlus className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Form 16 & Documents Upload</h3>
                <p className="text-[#ADB5BD]">
                  Simply upload your Form 16, Form 26AS and other tax documents, and 
                  we'll automatically fill the right information for your ITR.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your ITR for AY 2024-25?</h2>
            <p className="text-[#ADB5BD] max-w-2xl mx-auto mb-8">
              It takes just minutes to get started with our simple step-by-step process.
              Most people complete their Income Tax Return filing in under an hour.
            </p>
            <Link href="/file-taxes">
              <Button size="lg">
                Start ITR Filing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
