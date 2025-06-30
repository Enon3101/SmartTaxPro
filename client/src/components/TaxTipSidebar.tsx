import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, TrendingUp, HandCoins, Bookmark, Gift, Award, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


// Array of tax tips for Indian taxpayers
const taxTips = [
  {
    title: "Standard Deduction",
    content: "All salaried employees are eligible for a standard deduction of ₹50,000 from their salary income.",
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "HRA Exemption",
    content: "If you live in a rented house, claim HRA exemption by submitting rent receipts to your employer.",
    icon: <HandCoins className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Section 80C Investments",
    content: "Maximize your tax savings by investing up to ₹1,50,000 in tax-saving instruments under Section 80C.",
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Health Insurance Premium",
    content: "Under Section 80D, claim deduction up to ₹25,000 for health insurance premiums for self and family.",
    icon: <Gift className="h-6 w-6 text-red-500" />,
  },
  {
    title: "Home Loan Interest",
    content: "Claim up to ₹2,00,000 as deduction on interest paid for self-occupied property under Section 24(b).",
    icon: <Bookmark className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "NPS Contribution",
    content: "Additional deduction of up to ₹50,000 is available for contributions to National Pension System.",
    icon: <Award className="h-6 w-6 text-orange-500" />,
  },
  {
    title: "Capital Gains",
    content: "Long-term capital gains on equity shares are exempt up to ₹1,00,000 in a financial year.",
    icon: <TrendingUp className="h-6 w-6 text-indigo-500" />,
  },
  {
    title: "Advance Tax",
    content: "Pay advance tax in installments to avoid interest penalties under Section 234C.",
    icon: <HandCoins className="h-6 w-6 text-teal-500" />,
  },
];

export function TaxTipSidebar() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to get a random tip that's different from the current one
  const getNextTip = () => {
    if (taxTips.length <= 1) return 0;
    
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * taxTips.length);
    } while (nextIndex === currentTipIndex);
    
    setIsAnimating(true);
    setCurrentTipIndex(nextIndex);
  };

  // Auto-rotate tips every 30 seconds
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      getNextTip();
    }, 30000);

    return () => clearInterval(rotationInterval);
  }, [currentTipIndex]);

  // Reset animation state after animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const currentTip = taxTips[currentTipIndex];

  return (
    <div className="sticky top-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tax Tip of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center justify-center rounded-full p-2 bg-blue-50"
                  )}
                >
                  {currentTip.icon}
                </motion.div>
                <h3 className="font-semibold text-lg">{currentTip.title}</h3>
              </div>
              <p className="text-muted-foreground">{currentTip.content}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={getNextTip}
              className="text-blue-600 hover:text-blue-700 p-0 flex items-center"
              disabled={isAnimating}
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", isAnimating && "animate-spin")} />
              Next Tip
            </Button>
            <div className="text-xs text-muted-foreground">
              {currentTipIndex + 1} / {taxTips.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}