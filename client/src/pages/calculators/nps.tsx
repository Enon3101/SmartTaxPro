import { ArrowLeft, Calculator, TrendingUp, PiggyBank, HelpCircle, Percent } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"; // For percentage inputs
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatIndianCurrency } from "@/lib/formatters";

interface ChartDataPoint {
  age: number;
  investedAmount: number;
  corpusValue: number;
}

interface NPSResults {
  totalCorpus: number;
  totalInvestment: number;
  totalReturns: number;
  lumpSumWithdrawal: number;
  annuityCorpus: number;
  expectedMonthlyPension: number;
  chartData: ChartDataPoint[];
}

const calculateNPS = (
  currentAge: number,
  retirementAge: number,
  monthlyContribution: number,
  expectedReturnRate: number,
  percentToAnnuitize: number,
  expectedAnnuityRate: number
): NPSResults => {
  const investmentYears = retirementAge - currentAge;
  const investmentMonths = investmentYears * 12;
  const monthlyRateOfReturn = expectedReturnRate / 100 / 12;
  const monthlyAnnuityRate = expectedAnnuityRate / 100 / 12;

  let totalCorpus = 0;
  if (monthlyRateOfReturn > 0) {
    totalCorpus = monthlyContribution * (((Math.pow(1 + monthlyRateOfReturn, investmentMonths) - 1) / monthlyRateOfReturn) * (1 + monthlyRateOfReturn));
  } else { // Handle 0% return rate (simple accumulation)
    totalCorpus = monthlyContribution * investmentMonths;
  }
  
  const totalInvestment = monthlyContribution * investmentMonths;
  const totalReturns = totalCorpus - totalInvestment;

  const lumpSumWithdrawal = totalCorpus * (1 - percentToAnnuitize / 100);
  const annuityCorpus = totalCorpus * (percentToAnnuitize / 100);
  
  let expectedMonthlyPension = 0;
  if (monthlyAnnuityRate > 0) {
     // Annuity formula: P = (A * r) / (1 - (1 + r)^-n) where P is periodic payment, A is principal, r is rate per period, n is number of periods
     // For simplicity, assuming annuity provides a fixed return on the corpus. A more accurate calculation would involve annuity factors.
     // This is a simplified perpetuity-like calculation for monthly pension.
    expectedMonthlyPension = annuityCorpus * monthlyAnnuityRate;
  } else {
    expectedMonthlyPension = 0; // Or handle as per specific annuity product if rate is 0
  }


  const chartData: ChartDataPoint[] = [];
  let investedAmount = 0;
  let corpusValue = 0;
  for (let year = 1; year <= investmentYears; year++) {
    const currentMonths = year * 12;
    investedAmount = monthlyContribution * currentMonths;
    if (monthlyRateOfReturn > 0) {
      corpusValue = monthlyContribution * (((Math.pow(1 + monthlyRateOfReturn, currentMonths) - 1) / monthlyRateOfReturn) * (1 + monthlyRateOfReturn));
    } else {
      corpusValue = investedAmount;
    }
    chartData.push({
      age: currentAge + year,
      investedAmount: parseFloat(investedAmount.toFixed(0)),
      corpusValue: parseFloat(corpusValue.toFixed(0)),
    });
  }

  return {
    totalCorpus,
    totalInvestment,
    totalReturns,
    lumpSumWithdrawal,
    annuityCorpus,
    expectedMonthlyPension,
    chartData,
  };
};

const NPSCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [retirementAge, setRetirementAge] = useState<number | "">(60);
  const [monthlyContribution, setMonthlyContribution] = useState<number | "">(5000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number | "">(10);
  const [percentToAnnuitize, setPercentToAnnuitize] = useState<number | "">(40); // Allow "" for input
  const [expectedAnnuityRate, setExpectedAnnuityRate] = useState<number | "">(6);

  const [results, setResults] = useState<NPSResults | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculation = useCallback(() => {
    if (
      currentAge !== "" && Number(currentAge) > 0 &&
      retirementAge !== "" && Number(retirementAge) > Number(currentAge) &&
      monthlyContribution !== "" && Number(monthlyContribution) > 0 &&
      expectedReturnRate !== "" && Number(expectedReturnRate) >= 0 &&
      percentToAnnuitize !== "" && Number(percentToAnnuitize) >= 40 && Number(percentToAnnuitize) <= 100 && // NPS rules: min 40% annuitization
      expectedAnnuityRate !== "" && Number(expectedAnnuityRate) >= 0
    ) {
      const calculatedResults = calculateNPS(
        Number(currentAge),
        Number(retirementAge),
        Number(monthlyContribution),
        Number(expectedReturnRate),
        Number(percentToAnnuitize),
        Number(expectedAnnuityRate)
      );
      setResults(calculatedResults);
      setIsCalculated(true);
    } else {
      setResults(null);
      setIsCalculated(false);
    }
  }, [currentAge, retirementAge, monthlyContribution, expectedReturnRate, percentToAnnuitize, expectedAnnuityRate]);

  useEffect(() => {
    handleCalculation();
  }, [handleCalculation]);

  const resetCalculator = () => {
    setCurrentAge(30);
    setRetirementAge(60);
    setMonthlyContribution(5000);
    setExpectedReturnRate(10);
    setPercentToAnnuitize(40);
    setExpectedAnnuityRate(6);
    setIsCalculated(false);
    setResults(null);
  };

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    minVal = 0,
    maxVal?: number
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    let parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      if (parsedValue < minVal) parsedValue = minVal;
      if (maxVal !== undefined && parsedValue > maxVal) parsedValue = maxVal;
      setter(parsedValue);
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
          NPS Calculator (India)
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Estimate your National Pension System corpus and monthly pension.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Investment & Annuity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age (Years)</Label>
                  <Input id="currentAge" type="number" value={currentAge} onChange={(e) => handleNumberInput(e.target.value, setCurrentAge, 18, 59)} placeholder="e.g., 30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age (Years)</Label>
                  <Input id="retirementAge" type="number" value={retirementAge} onChange={(e) => handleNumberInput(e.target.value, setRetirementAge, Number(currentAge) + 1, 75)} placeholder="e.g., 60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                <Input id="monthlyContribution" type="number" value={monthlyContribution} onChange={(e) => handleNumberInput(e.target.value, setMonthlyContribution, 500)} placeholder="e.g., 5000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturnRate">Expected Rate of Return on Investment (% p.a.)</Label>
                <Input id="expectedReturnRate" type="number" value={expectedReturnRate} onChange={(e) => handleNumberInput(e.target.value, setExpectedReturnRate, 0, 20)} placeholder="e.g., 10" step="0.1" />
                <p className="text-xs text-muted-foreground">NPS returns depend on asset allocation and market performance.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="percentToAnnuitize">Percentage of Corpus to Annuitize (%)</Label>
                <div className="flex items-center gap-2">
                    <Slider
                        id="percentToAnnuitize"
                        min={40} max={100} step={5}
                        value={[typeof percentToAnnuitize === 'number' ? percentToAnnuitize : 40]}
                        onValueChange={(value) => setPercentToAnnuitize(value[0])}
                        className="flex-1"
                    />
                    <Input 
                        type="number" 
                        value={percentToAnnuitize} 
                        onChange={(e) => handleNumberInput(e.target.value, setPercentToAnnuitize, 40, 100)}
                        className="w-20 text-center"
                    />
                     <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Minimum 40% must be annuitized for regular pension.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedAnnuityRate">Expected Annuity Rate (% p.a.)</Label>
                <Input id="expectedAnnuityRate" type="number" value={expectedAnnuityRate} onChange={(e) => handleNumberInput(e.target.value, setExpectedAnnuityRate, 0, 15)} placeholder="e.g., 6" step="0.1" />
                <p className="text-xs text-muted-foreground">Rate at which annuity corpus generates pension.</p>
              </div>

              <Button onClick={handleCalculation} className="w-full">Calculate NPS</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          {isCalculated && results ? (
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  NPS Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg mb-4 text-center">
                  <h3 className="text-md font-medium text-muted-foreground mb-1">Total Corpus at Retirement</h3>
                  <div className="text-2xl font-bold text-primary">
                    {formatIndianCurrency(results.totalCorpus)}
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
                        <TableCell>Total Returns Earned</TableCell>
                        <TableCell className="text-right text-green-600">{formatIndianCurrency(results.totalReturns)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lump-sum Withdrawal (Tax-Free up to 60%)</TableCell>
                        <TableCell className="text-right">{formatIndianCurrency(results.lumpSumWithdrawal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Corpus for Annuity Purchase</TableCell>
                        <TableCell className="text-right">{formatIndianCurrency(results.annuityCorpus)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Expected Monthly Pension</TableCell>
                        <TableCell className="text-right font-medium">{formatIndianCurrency(results.expectedMonthlyPension)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                {results.chartData && results.chartData.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Investment Growth Over Time</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={results.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                        <XAxis dataKey="age" unit=" yrs" fontSize={10} />
                        <YAxis 
                          fontSize={10} 
                          tickFormatter={(value) => `${formatIndianCurrency(value, { decimalPlaces: 0 }).replace('₹','')}`}
                          label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10 }}
                        />
                        <Tooltip formatter={(value: number, name: string) => [`${formatIndianCurrency(value)}`, name === "corpusValue" ? "Corpus Value" : "Invested Amount" ]} />
                        <Legend wrapperStyle={{fontSize: "10px"}} />
                        <Line type="monotone" dataKey="investedAmount" name="Total Invested" stroke="#8884d8" strokeWidth={2} dot={{r:2}} />
                        <Line type="monotone" dataKey="corpusValue" name="Corpus Value" stroke="#82ca9d" strokeWidth={2} dot={{r:2}} />
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
                        NPS Projections
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-10">
                     <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                     <p className="text-muted-foreground">Enter your details to estimate NPS corpus and pension.</p>
                </CardContent>
             </Card>
          )}
          <Card className="mt-6">
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="nps-info">
                <AccordionTrigger className="px-6 text-sm">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    About National Pension System (NPS)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">What is NPS?</p>
                    <p>The National Pension System (NPS) is a voluntary, defined contribution retirement savings scheme designed to enable systematic savings during one’s working life. It is regulated by PFRDA.</p>
                    
                    <p className="font-medium mt-2">Key Features:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Two types of accounts: Tier I (mandatory, for retirement savings) and Tier II (voluntary, flexible withdrawals). This calculator focuses on Tier I.</li>
                        <li>Investment choices: Active Choice (choose your asset mix - Equity, Corporate Bonds, Govt. Securities, Alternative Assets) or Auto Choice (lifecycle-based asset allocation).</li>
                        <li>Portability: NPS account can be operated from anywhere in India, even if you change jobs or cities.</li>
                    </ul>
                    
                    <p className="font-medium mt-2">Withdrawal Rules (Tier I):</p>
                     <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>At Retirement (Superannuation - age 60): Minimum 40% of corpus must be used to buy an annuity. Balance up to 60% can be withdrawn as lump sum (tax-free). If corpus is ≤ ₹5 lakh, full withdrawal is allowed.</li>
                        <li>Premature Exit (before age 60, after 3 years): Minimum 80% of corpus must be annuitized. Balance up to 20% can be withdrawn. If corpus is ≤ ₹2.5 lakh, full withdrawal is allowed.</li>
                        <li>Partial Withdrawal: Allowed for specific purposes (e.g., education, medical emergency) up to 25% of self-contribution, after 3 years of account opening. Max 3 partial withdrawals allowed.</li>
                    </ul>

                    <p className="font-medium mt-2">Tax Benefits:</p>
                     <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Contribution: Up to ₹1.5 lakh under Sec 80CCD(1) (within 80C limit). Additional ₹50,000 under Sec 80CCD(1B). Employer contribution up to 10% of salary (Basic + DA) is also deductible under Sec 80CCD(2).</li>
                        <li>Lump-sum Withdrawal: Up to 60% of corpus at retirement is tax-exempt.</li>
                        <li>Annuity: Pension received from annuity is taxable as per income slab.</li>
                     </ul>

                    <p className="font-medium mt-2">Disclaimer:</p>
                    <p>This calculator provides an estimate based on the inputs and simplified assumptions. NPS investments are subject to market risks. Annuity rates vary. Consult a financial advisor and read scheme documents carefully.</p>
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

export default NPSCalculator;
