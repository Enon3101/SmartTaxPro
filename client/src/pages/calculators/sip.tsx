import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, IndianRupee, Clock, BarChart3, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";
import { formatIndianCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Sector
} from "recharts";

// Component to show tooltip on hover
const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative cursor-help">
    <div className="flex items-center text-sm text-muted-foreground underline decoration-dotted underline-offset-2">
      {children}
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 rounded bg-popover px-3 py-2 text-xs opacity-0 shadow transition-opacity group-hover:opacity-100 z-50">
      The future value of your investment will depend on the expected rate of return. Higher returns come with higher risks.
    </div>
  </div>
);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Results
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Debounce calculation to improve performance
  useEffect(() => {
    // Use a debounce timer to avoid excessive calculations on rapid changes
    const debounceTimer = setTimeout(() => {
      calculateSipReturns();
    }, 300); // 300ms debounce delay
    
    // Cleanup timer on every change
    return () => clearTimeout(debounceTimer);
  }, [monthlyInvestment, years, expectedReturn]);
  
  // Calculate SIP returns with optimizations
  const calculateSipReturns = () => {
    // Performance optimization: Validate inputs first to prevent unnecessary calculations
    if (monthlyInvestment <= 0 || years <= 0 || expectedReturn <= 0) {
      return;
    }
    
    // Calculate total investment
    const totalMonths = years * 12;
    const totalInvested = monthlyInvestment * totalMonths;
    setTotalInvestment(totalInvested);
    
    // Calculate future value using SIP formula
    // M × {((1 + r)^n - 1) / r} × (1 + r)
    // Where:
    // M = Monthly investment
    // r = Rate of interest per month (annual rate / 12 / 100)
    // n = Total number of payments (years * 12)
    
    const monthlyRate = expectedReturn / 12 / 100;
    // Use a more efficient calculation method with fewer operations
    const power = Math.pow(1 + monthlyRate, totalMonths);
    const futureValueCalculated = monthlyInvestment * 
      (((power - 1) / monthlyRate) * (1 + monthlyRate));
    
    setFutureValue(futureValueCalculated);
    setEstimatedReturns(futureValueCalculated - totalInvested);
    
    // Optimization: Only generate yearly breakdown when needed (when calculation is complete)
    // and limit the size of the breakdown for very long time periods
    const breakdown = [];
    let runningInvestment = 0;
    let runningValue = 0;
    
    // If years is very large, calculate fewer data points to improve performance
    const yearStep = years > 20 ? 2 : 1; // Use 2-year intervals for long periods
    
    for (let year = yearStep; year <= years; year += yearStep) {
      const investmentThisYear = monthlyInvestment * 12 * (year === yearStep ? year : yearStep);
      runningInvestment += investmentThisYear;
      
      // Calculate future value at the end of this year
      const monthsCompleted = year * 12;
      // Reuse the same formula but with calculated year
      const yearPower = Math.pow(1 + monthlyRate, monthsCompleted);
      const futureValueAtYear = monthlyInvestment * 
        (((yearPower - 1) / monthlyRate) * (1 + monthlyRate));
      
      runningValue = futureValueAtYear;
      const returnsThisYear = runningValue - runningInvestment;
      
      breakdown.push({
        year,
        investedAmount: runningInvestment,
        estimatedValue: runningValue,
        returns: returnsThisYear
      });
    }
    
    setYearlyBreakdown(breakdown);
    setIsCalculated(true);
  };
  
  // Optimized slider change handler with type safety
  const handleSliderChange = (field: "investment" | "years" | "return", value: number[]) => {
    // Only update if the value has actually changed
    const newValue = value[0];
    
    switch (field) {
      case "investment":
        if (newValue !== monthlyInvestment) {
          setMonthlyInvestment(newValue);
        }
        break;
      case "years":
        if (newValue !== years) {
          setYears(newValue);
        }
        break;
      case "return":
        if (newValue !== expectedReturn) {
          setExpectedReturn(newValue);
        }
        break;
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">SIP Calculator</h1>
        <p className="text-muted-foreground">
          Calculate potential returns on your Systematic Investment Plan (SIP) investments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-2 h-5 w-5" />
                SIP Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                  <span className="text-sm font-medium">{formatIndianCurrency(monthlyInvestment)}</span>
                </div>
                <Slider
                  id="monthly-investment"
                  min={500}
                  max={100000}
                  step={500}
                  value={[monthlyInvestment]}
                  onValueChange={(value) => handleSliderChange("investment", value)}
                  className="w-full"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="text"
                    value={monthlyInvestment.toLocaleString('en-IN')}
                    onChange={(e) => {
                      // Remove all non-numeric characters and convert to number
                      const rawValue = e.target.value.replace(/[^0-9]/g, '');
                      setMonthlyInvestment(Number(rawValue) || 0);
                    }}
                    className="pl-8 mt-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="investment-period">Investment Period (Years)</Label>
                  <span className="text-sm font-medium">{years} years</span>
                </div>
                <Slider
                  id="investment-period"
                  min={1}
                  max={30}
                  step={1}
                  value={[years]}
                  onValueChange={(value) => handleSliderChange("years", value)}
                  className="w-full"
                />
                <div className="relative">
                  <Input
                    type="text"
                    value={years.toString()}
                    onChange={(e) => {
                      // Remove all non-numeric characters and convert to number
                      const rawValue = e.target.value.replace(/[^0-9]/g, '');
                      setYears(Number(rawValue) || 0);
                    }}
                    className="mt-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">years</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="expected-return" className="flex items-center">
                    <span className="mr-1">Expected Annual Return (%)</span>
                    <InfoTooltip>ⓘ</InfoTooltip>
                  </Label>
                  <span className="text-sm font-medium">{expectedReturn}%</span>
                </div>
                <Slider
                  id="expected-return"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[expectedReturn]}
                  onValueChange={(value) => handleSliderChange("return", value)}
                  className="w-full"
                />
                <div className="relative">
                  <Input
                    type="text"
                    value={expectedReturn.toString()}
                    onChange={(e) => {
                      // Remove all non-numeric characters (except decimal point) and convert to number
                      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                      setExpectedReturn(Number(rawValue) || 0);
                    }}
                    className="mt-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">About SIP</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. 
                It helps in wealth creation through the power of compounding and rupee cost averaging.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <IndianRupee className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Rupee Cost Averaging:</span> Helps you buy more units when prices are low and fewer when prices are high.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Power of Compounding:</span> Your returns generate additional returns over time.
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">Disciplined Approach:</span> Regular investments build a habit of saving and investing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-primary/50 border shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="space-y-1"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p className="text-sm">Total Investment</p>
                    <p className="text-2xl font-semibold relative">
                      <span className="absolute -left-4 top-1 text-blue-500/30 text-sm">₹</span>
                      {formatIndianCurrency(totalInvestment, false)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(monthlyInvestment)} per month for {years} years
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-1"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <p className="text-sm">Estimated Returns</p>
                    <p className="text-2xl font-semibold text-primary relative">
                      <span className="absolute -left-4 top-1 text-primary/30 text-sm">₹</span>
                      {formatIndianCurrency(estimatedReturns, false)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      At {expectedReturn}% annual returns
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-1"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <p className="text-sm">Future Value</p>
                    <p className="text-2xl font-semibold relative">
                      <span className="absolute -left-4 top-1 text-green-500/30 text-sm">₹</span>
                      {formatCurrency(futureValue).substring(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total corpus after {years} years
                    </p>
                  </motion.div>
                </div>
                
                <div className="mt-8">
                  <div className="flex justify-between mb-2 text-sm items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-sm bg-blue-600 mr-2"></div>
                      <span>Total Investment</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                      <span>Estimated Returns</span>
                    </div>
                  </div>
                  
                  <div className="h-6 bg-muted overflow-hidden rounded-full flex">
                    <motion.div
                      className="h-full bg-blue-600 rounded-l-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalInvestment / futureValue) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                    </motion.div>
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(estimatedReturns / futureValue) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    >
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs">
                    <span>{Math.round((totalInvestment / futureValue) * 100)}%</span>
                    <span>{Math.round((estimatedReturns / futureValue) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  SIP Growth Visualization
                </CardTitle>
                <Tabs defaultValue="area" className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="area">Area</TabsTrigger>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="area" className="mt-0">
                    <div className="h-[350px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={yearlyBreakdown}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(value) => `Year ${value}`}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="investedAmount" 
                            name="Investment" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#colorInvestment)" 
                            stackId="1"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="returns" 
                            name="Returns" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorReturns)" 
                            stackId="1"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bar" className="mt-0">
                    <div className="h-[350px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={yearlyBreakdown}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(value) => `Year ${value}`}
                          />
                          <Legend />
                          <Bar 
                            dataKey="investedAmount" 
                            name="Investment" 
                            stackId="a" 
                            fill="#3b82f6" 
                            animationDuration={1500}
                          />
                          <Bar 
                            dataKey="returns" 
                            name="Returns" 
                            stackId="a" 
                            fill="#10b981" 
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="table" className="mt-0">
                    <div className="overflow-x-auto mt-2">
                      <Table>
                        <TableBody>
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-medium">Year</TableCell>
                            <TableCell className="font-medium">Invested Amount</TableCell>
                            <TableCell className="font-medium">Estimated Returns</TableCell>
                            <TableCell className="font-medium">Expected Corpus</TableCell>
                          </TableRow>
                          
                          {yearlyBreakdown.map((item, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                              <TableCell>{item.year}</TableCell>
                              <TableCell>{formatCurrency(item.investedAmount)}</TableCell>
                              <TableCell className="text-green-600 dark:text-green-500">{formatCurrency(item.returns)}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(item.estimatedValue)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mt-2">
                  <p>This visualization shows how your investment grows over time, combining both your principal investment and the returns generated.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-primary" />
                    Investment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Total Investment', value: totalInvestment },
                            { name: 'Estimated Returns', value: estimatedReturns }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          animationBegin={200}
                          animationDuration={1500}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4 space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                      <span className="text-sm">Investment ({Math.round((totalInvestment / futureValue) * 100)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                      <span className="text-sm">Returns ({Math.round((estimatedReturns / futureValue) * 100)}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 border-muted h-full">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-primary" />
                    Things to Note
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      'The calculated results are for illustrative purposes only.',
                      'The actual returns will depend on the performance of the chosen fund.',
                      'Past performance is not a guarantee of future returns.',
                      'The power of compounding works better over longer investment periods.',
                      'Increasing your SIP amount periodically can significantly boost your wealth creation.',
                      'SIP investments in equity mutual funds are subject to market risks.'
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;