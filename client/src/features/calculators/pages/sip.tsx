import { ArrowLeft, Calculator, TrendingUp, PiggyBank, HelpCircle } from "lucide-react"; // Removed Info
import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "wouter";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardDescription
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider"; // Slider not used in current UI for SIP
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatIndianCurrency } from "@/lib/formatters";


// Define interface for chart data points
interface ChartDataPoint {
  year: string;
  investedAmount: number;
  futureValue: number;
}

// Define interface for calculation results
interface SIPResults {
  futureValue: number;
  totalInvestment: number;
  estimatedReturns: number;
  months: number;
  monthlyRate: number;
  chartData: ChartDataPoint[];
}

// Calculate SIP returns
const calculateSIP = (
  monthlyInvestment: number,
  expectedReturnRate: number,
  tenureYears: number
) => {
  const months = tenureYears * 12;
  const annualRate = expectedReturnRate / 100;
  const monthlyRate = annualRate / 12;
  
  // SIP Future Value formula
  const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  const totalInvestment = monthlyInvestment * months;
  const estimatedReturns = futureValue - totalInvestment;
  
  // Chart data generation
  const chartData: ChartDataPoint[] = [];
  let cumulativeInvestment = 0;
  let currentValue = 0;
  for (let year = 1; year <= tenureYears; year++) {
    const yearMonths = year * 12;
    cumulativeInvestment = monthlyInvestment * yearMonths;
    currentValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    chartData.push({
      year: `Year ${year}`,
      investedAmount: parseFloat(cumulativeInvestment.toFixed(0)),
      futureValue: parseFloat(currentValue.toFixed(0)),
    });
  }

  return {
    futureValue,
    totalInvestment,
    estimatedReturns,
    months,
    monthlyRate,
    chartData
  };
};

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number | "">(12);
  const [tenureYears, setTenureYears] = useState<number | "">(10);
  
  const [results, setResults] = useState<SIPResults | null>(null); // Use SIPResults type
  const [calculationBreakdown, setCalculationBreakdown] = useState<string[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);


  const handleCalculation = useCallback(() => {
    if (
      monthlyInvestment !== "" &&
      expectedReturnRate !== "" &&
      tenureYears !== "" &&
      Number(monthlyInvestment) > 0 &&
      Number(expectedReturnRate) > 0 &&
      Number(tenureYears) > 0
    ) {
      const calculatedResults = calculateSIP(
        Number(monthlyInvestment),
        Number(expectedReturnRate),
        Number(tenureYears)
      );
      setResults(calculatedResults);
      setIsCalculated(true);

      const breakdown: string[] = [];
      breakdown.push(`Monthly Investment: ${formatIndianCurrency(Number(monthlyInvestment))}`);
      breakdown.push(`Expected Annual Return Rate: ${expectedReturnRate}%`);
      breakdown.push(`Investment Tenure: ${tenureYears} years (${calculatedResults.months} months)`);
      breakdown.push(`Monthly Interest Rate: ${(calculatedResults.monthlyRate * 100).toFixed(4)}%`);
      breakdown.push(`Total Amount Invested: ${formatIndianCurrency(calculatedResults.totalInvestment)}`);
      breakdown.push(`Estimated Wealth Gained: ${formatIndianCurrency(calculatedResults.estimatedReturns)}`);
      breakdown.push(`Expected Maturity Value: ${formatIndianCurrency(calculatedResults.futureValue)}`);
      setCalculationBreakdown(breakdown);
    } else {
      setResults(null);
      setIsCalculated(false);
      setCalculationBreakdown([]);
    }
  }, [monthlyInvestment, expectedReturnRate, tenureYears]);

  useEffect(() => {
    handleCalculation();
  }, [handleCalculation]);

  const resetCalculator = () => {
    setMonthlyInvestment(5000);
    setExpectedReturnRate(12);
    setTenureYears(10);
    setIsCalculated(false); // Reset calculation state
    setResults(null);
    setCalculationBreakdown([]);
  };
  
  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setter(parsedValue);
    } else if (parsedValue < 0) {
      setter(0); // Or handle as an error, prevent negative
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/calculators">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Calculators
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
          <PiggyBank className="mr-2 h-6 w-6 md:h-8 md:w-8 text-primary" />
          SIP Return Calculator
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Calculate returns on your Systematic Investment Plan (SIP)
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => handleNumberInput(e.target.value, setMonthlyInvestment)}
                  placeholder="Enter monthly investment amount"
                  min="500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturnRate">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturnRate"
                  type="number"
                  value={expectedReturnRate}
                  onChange={(e) => handleNumberInput(e.target.value, setExpectedReturnRate)}
                  placeholder="Enter expected return rate"
                  min="1"
                  max="30"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">E.g., 12 for 12%. Historical equity returns range 10-15% p.a.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenureYears">Investment Period (Years)</Label>
                <Input
                  id="tenureYears"
                  type="number"
                  value={tenureYears}
                  onChange={(e) => handleNumberInput(e.target.value, setTenureYears)}
                  placeholder="Enter investment period"
                  min="1"
                  max="50"
                />
              </div>
              <Button onClick={handleCalculation} className="w-full">Calculate SIP</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          {isCalculated && results ? (
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Projected Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg mb-4 text-center">
                  <h3 className="text-md font-medium text-muted-foreground mb-1">Expected Maturity Value</h3>
                  <div className="text-2xl font-bold text-primary">
                    {formatIndianCurrency(results.futureValue)}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-md font-semibold">Summary:</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Amount Invested</TableCell>
                        <TableCell className="text-right">{formatIndianCurrency(results.totalInvestment)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estimated Wealth Gained</TableCell>
                        <TableCell className="text-right text-green-600">{formatIndianCurrency(results.estimatedReturns)}</TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell>Investment Period</TableCell>
                        <TableCell className="text-right">{results.months} months ({tenureYears} years)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  {calculationBreakdown.length > 0 && (
                    <>
                      <h5 className="text-sm font-semibold mt-3">Calculation Breakdown:</h5>
                      <ul className="text-xs space-y-1 list-disc pl-4 text-muted-foreground">
                        {calculationBreakdown.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {results.chartData && results.chartData.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Investment Growth Over Time</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={results.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                        <XAxis dataKey="year" fontSize={10} />
                        <YAxis 
                          fontSize={10} 
                          tickFormatter={(value) => `${formatIndianCurrency(value, { decimalPlaces: 0 }).replace('₹','')}`}
                          label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10 }}
                        />
                        <Tooltip formatter={(value: number) => formatIndianCurrency(value)} />
                        <Legend wrapperStyle={{fontSize: "10px"}} />
                        <Line type="monotone" dataKey="investedAmount" name="Total Invested" stroke="#8884d8" strokeWidth={2} dot={{r:2}} />
                        <Line type="monotone" dataKey="futureValue" name="Maturity Value" stroke="#82ca9d" strokeWidth={2} dot={{r:2}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                 <Button onClick={resetCalculator} variant="outline" className="w-full mt-6">Reset Calculator</Button>
              </CardContent>
            </Card>
          ) : (
             <Card className="sticky top-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Projected Returns
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-10">
                     <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                     <p className="text-muted-foreground">Enter your SIP details to see projected returns and growth.</p>
                </CardContent>
             </Card>
          )}
          <Card className="mt-6">
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sip-info">
                <AccordionTrigger className="px-6 text-sm">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Understanding SIPs & Returns
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">What is a SIP?</p>
                    <p>A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly (usually monthly) into mutual funds. It helps in disciplined investing and rupee cost averaging.</p>
                    
                    <p className="font-medium mt-2">Power of Compounding:</p>
                    <p>Compounding means earning returns on your initial investment as well as on the returns accumulated over time. The longer you stay invested, the more significant the compounding effect.</p>
                    
                    <p className="font-medium mt-2">Expected Returns:</p>
                    <p>The return rate used in the calculator is an assumption. Actual market returns can vary based on fund performance, market conditions, and economic factors. Equity SIPs historically have offered returns in the range of 10-15% p.a. over long periods, but this is not guaranteed.</p>

                    <p className="font-medium mt-2">Rupee Cost Averaging:</p>
                    <p>With SIPs, you buy more units when the market is low and fewer units when the market is high. This averages out your purchase cost over time, potentially reducing the impact of market volatility.</p>

                    <p className="font-medium mt-2">Disclaimer:</p>
                    <p>This calculator provides an estimate based on the inputs. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
