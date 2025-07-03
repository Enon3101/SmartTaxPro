import { ArrowLeft, Calculator, TrendingUp, DollarSign } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatIndianCurrency } from "@/lib/formatters";

const calculateLumpsum = (
  amount: number,
  expectedReturnRate: number,
  tenureYears: number
) => {
  const futureValue = amount * Math.pow(1 + expectedReturnRate / 100, tenureYears);
  const totalReturns = futureValue - amount;
  
  return {
    futureValue,
    totalReturns,
    initialInvestment: amount
  };
};

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState<number | "">(100000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number | "">(12);
  const [tenureYears, setTenureYears] = useState<number | "">(10);
  
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (
      amount !== "" &&
      expectedReturnRate !== "" &&
      tenureYears !== "" &&
      amount > 0 &&
      expectedReturnRate > 0 &&
      tenureYears > 0
    ) {
      const calculatedResults = calculateLumpsum(
        Number(amount),
        Number(expectedReturnRate),
        Number(tenureYears)
      );
      setResults(calculatedResults);
    } else {
      setResults(null);
    }
  }, [amount, expectedReturnRate, tenureYears]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/calculators">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Calculators
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Lumpsum MF Calculator</h1>
          <p className="text-muted-foreground">
            Calculate returns on your lumpsum mutual fund investment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Enter investment amount"
                  min="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturnRate">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturnRate"
                  type="number"
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Enter expected return rate"
                  min="1"
                  max="30"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenureYears">Investment Period (Years)</Label>
                <Input
                  id="tenureYears"
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Enter investment period"
                  min="1"
                  max="50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Maturity Amount</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatIndianCurrency(results.futureValue)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Initial Investment:</span>
                      <span className="font-medium">{formatIndianCurrency(results.initialInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Returns:</span>
                      <span className="font-medium text-green-600">{formatIndianCurrency(results.totalReturns)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Enter details to calculate returns</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LumpsumCalculator;
