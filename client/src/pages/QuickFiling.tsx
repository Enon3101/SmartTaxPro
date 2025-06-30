import { motion } from "framer-motion";
import { ArrowLeft, Shield, Clock, Calculator, CreditCard } from "lucide-react";
import { Link } from "wouter";

import QuickFilingSection from "@/components/QuickFilingSection";
import { Button } from "@/components/ui/button";

const QuickFiling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quick Tax Filing</h1>
                <p className="text-sm text-gray-500">Complete your ITR in minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>10 min</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calculator className="h-4 w-4" />
                <span>Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quick Filing Section */}
      <div className="container mx-auto px-4 py-10">
        <QuickFilingSection />
      </div>
    </div>
  );
};

export default QuickFiling; 