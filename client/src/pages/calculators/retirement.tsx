import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Clock, 
  Coins, 
  Heart,
  User, 
  Calculator, 
  ArrowRight,
  AlertCircle,
  TrendingUp,
  BadgeIndianRupee
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

// Calculate retirement corpus needed
const calculateRetirementCorpus = (
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentMonthlyExpenses: number,
  inflationRate: number,
  returnRatePreRetirement: number,
  returnRatePostRetirement: number,
  existingSavings: number,
  monthlyInvestment: number
) => {
  if (
    currentAge >= retirementAge || 
    retirementAge >= lifeExpectancy ||
    currentMonthlyExpenses <= 0 ||
    inflationRate < 0 ||
    returnRatePreRetirement < 0 ||
    returnRatePostRetirement < 0
  ) {
    return {
      requiredCorpus: 0,
      monthlyPensionAtRetirement: 0,
      projectedCorpus: 0,
      shortfall: 0,
      additionalMonthlyInvestment: 0,
      yearWiseProjections: []
    };
  }

  // Convert rates to decimals
  const inflationRateDecimal = inflationRate / 100;
  const preReturnRateDecimal = returnRatePreRetirement / 100;
  const postReturnRateDecimal = returnRatePostRetirement / 100;
  
  // Calculate years to retirement and years in retirement
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Calculate monthly expenses at retirement (adjusted for inflation)
  const monthlyExpensesAtRetirement = currentMonthlyExpenses * 
    Math.pow(1 + inflationRateDecimal, yearsToRetirement);
  
  // Calculate annual expenses at retirement
  const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
  
  // Calculate required corpus at retirement using the formula:
  // P = PMT * [1 - (1 + r)^-n] / r
  // Where: P = corpus, PMT = annual expenses, r = post-retirement return rate, n = years in retirement
  
  // First, handle special case where post-retirement return equals inflation
  let requiredCorpus;
  if (Math.abs(postReturnRateDecimal - inflationRateDecimal) < 0.0001) {
    requiredCorpus = annualExpensesAtRetirement * yearsInRetirement;
  } else {
    const realReturnRate = (1 + postReturnRateDecimal) / (1 + inflationRateDecimal) - 1;
    requiredCorpus = annualExpensesAtRetirement * 
      ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate);
  }
  
  // Calculate projected corpus based on current savings and monthly investments
  let projectedCorpus = existingSavings * Math.pow(1 + preReturnRateDecimal, yearsToRetirement);
  
  // Add effect of monthly investments
  if (preReturnRateDecimal > 0) {
    // Formula for future value of monthly payments:
    // FV = PMT * [(1 + r)^n - 1] / r
    projectedCorpus += monthlyInvestment * 
      (Math.pow(1 + preReturnRateDecimal / 12, yearsToRetirement * 12) - 1) * 
      (1 + preReturnRateDecimal / 12) / (preReturnRateDecimal / 12);
  } else {
    projectedCorpus += monthlyInvestment * yearsToRetirement * 12;
  }
  
  // Calculate shortfall or surplus
  const shortfall = requiredCorpus - projectedCorpus;
  
  // Calculate additional monthly investment needed to cover shortfall
  let additionalMonthlyInvestment = 0;
  if (shortfall > 0 && yearsToRetirement > 0) {
    // Using the formula for present value of an annuity:
    // PMT = PV * r / [(1 + r)^n - 1]
    additionalMonthlyInvestment = shortfall / 
      ((Math.pow(1 + preReturnRateDecimal / 12, yearsToRetirement * 12) - 1) / 
      (preReturnRateDecimal / 12));
  }
  
  // Generate year-wise projections
  const yearWiseProjections = [];
  let currentSavings = existingSavings;
  let currentMonthlyExpense = currentMonthlyExpenses;
  
  for (let year = 1; year <= yearsToRetirement + Math.min(yearsInRetirement, 30); year++) {
    // Update savings with annual return
    currentSavings *= (1 + preReturnRateDecimal);
    
    // Add monthly investments if still in accumulation phase
    if (year <= yearsToRetirement) {
      currentSavings += monthlyInvestment * 12;
      
      // Update monthly expenses with inflation
      currentMonthlyExpense *= (1 + inflationRateDecimal);
      
      yearWiseProjections.push({
        year: currentAge + year,
        phase: "Accumulation",
        savingsBalance: currentSavings,
        monthlyExpense: currentMonthlyExpense,
        annualExpense: currentMonthlyExpense * 12,
        yearlyContribution: monthlyInvestment * 12
      });
    } else {
      // Withdrawal phase
      const withdrawalYear = year - yearsToRetirement;
      const adjustedMonthlyExpense = monthlyExpensesAtRetirement * 
        Math.pow(1 + inflationRateDecimal, withdrawalYear);
      const annualWithdrawal = adjustedMonthlyExpense * 12;
      
      // Deduct annual withdrawal
      currentSavings -= annualWithdrawal;
      
      // Update savings with post-retirement return rate
      currentSavings *= (1 + postReturnRateDecimal);
      
      // Ensure balance doesn't go negative in projections
      if (currentSavings < 0) currentSavings = 0;
      
      yearWiseProjections.push({
        year: currentAge + year,
        phase: "Withdrawal",
        savingsBalance: currentSavings,
        monthlyExpense: adjustedMonthlyExpense,
        annualExpense: annualWithdrawal,
        yearlyWithdrawal: annualWithdrawal
      });
      
      // Stop if funds depleted
      if (currentSavings <= 0) break;
    }
  }
  
  return {
    requiredCorpus,
    monthlyPensionAtRetirement: monthlyExpensesAtRetirement,
    projectedCorpus,
    shortfall,
    additionalMonthlyInvestment,
    yearWiseProjections
  };
};

// Main Calculator Component
const RetirementCalculator = () => {
  // State for form inputs
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [retirementAge, setRetirementAge] = useState<number | "">(60);
  const [lifeExpectancy, setLifeExpectancy] = useState<number | "">(85);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState<number | "">(50000);
  const [inflationRate, setInflationRate] = useState<number | "">(6);
  const [returnRatePreRetirement, setReturnRatePreRetirement] = useState<number | "">(12);
  const [returnRatePostRetirement, setReturnRatePostRetirement] = useState<number | "">(7);
  const [existingSavings, setExistingSavings] = useState<number | "">(1000000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(25000);
  const [showAllYears, setShowAllYears] = useState(false);

  // Results state
  const [requiredCorpus, setRequiredCorpus] = useState<number>(0);
  const [monthlyPensionAtRetirement, setMonthlyPensionAtRetirement] = useState<number>(0);
  const [projectedCorpus, setProjectedCorpus] = useState<number>(0);
  const [shortfall, setShortfall] = useState<number>(0);
  const [additionalMonthlyInvestment, setAdditionalMonthlyInvestment] = useState<number>(0);
  const [yearWiseProjections, setYearWiseProjections] = useState<any[]>([]);

  // Calculate projection on input change
  useEffect(() => {
    if (
      currentAge === "" ||
      retirementAge === "" ||
      lifeExpectancy === "" ||
      currentMonthlyExpenses === "" ||
      inflationRate === "" ||
      returnRatePreRetirement === "" ||
      returnRatePostRetirement === "" ||
      existingSavings === "" ||
      monthlyInvestment === ""
    ) {
      return;
    }

    const results = calculateRetirementCorpus(
      Number(currentAge),
      Number(retirementAge),
      Number(lifeExpectancy),
      Number(currentMonthlyExpenses),
      Number(inflationRate),
      Number(returnRatePreRetirement),
      Number(returnRatePostRetirement),
      Number(existingSavings),
      Number(monthlyInvestment)
    );

    setRequiredCorpus(results.requiredCorpus);
    setMonthlyPensionAtRetirement(results.monthlyPensionAtRetirement);
    setProjectedCorpus(results.projectedCorpus);
    setShortfall(results.shortfall);
    setAdditionalMonthlyInvestment(results.additionalMonthlyInvestment);
    setYearWiseProjections(results.yearWiseProjections);
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    inflationRate,
    returnRatePreRetirement,
    returnRatePostRetirement,
    existingSavings,
    monthlyInvestment
  ]);

  // Format currency values
  const formatCurrency = (value: number) => formatIndianCurrency(Math.round(value));

  // Handle input changes as numbers
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    
    if (value === "") {
      setter(value);
    } else if (!isNaN(value) && value >= min && value <= max) {
      setter(value);
    }
  };

  // Get the years to display
  const getVisibleYears = () => {
    if (showAllYears || yearWiseProjections.length <= 10) {
      return yearWiseProjections;
    } else {
      // Pick strategic years to show
      const importantYears = [
        ...yearWiseProjections.slice(0, 3), // First 3 years
        yearWiseProjections[Math.floor(yearWiseProjections.length * 0.25) - 1], // 25% mark
        yearWiseProjections[Math.floor(yearWiseProjections.length * 0.5) - 1], // 50% mark
        yearWiseProjections[Math.floor(yearWiseProjections.length * 0.75) - 1], // 75% mark
        ...yearWiseProjections.slice(-3) // Last 3 years
      ];
      
      return importantYears.filter((year, index, self) => 
        self.findIndex(y => y.year === year.year) === index); // Remove duplicates
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
        <Brain className="mr-2 h-6 w-6 md:h-8 md:w-8" /> 
        Retirement Calculator
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
        Plan your retirement by calculating the corpus required for your desired lifestyle
      </p>
      
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your details to calculate retirement needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentAge" className="flex items-center justify-between">
                    <span>Current Age (years)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={currentAge !== "" ? [Number(currentAge)] : [30]}
                      onValueChange={(values) => setCurrentAge(values[0])}
                      max={100}
                      min={18}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => handleNumberInput(e, setCurrentAge, 18, 100)}
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="retirementAge" className="flex items-center justify-between">
                    <span>Retirement Age (years)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={retirementAge !== "" ? [Number(retirementAge)] : [60]}
                      onValueChange={(values) => setRetirementAge(values[0])}
                      max={100}
                      min={currentAge !== "" ? Number(currentAge) + 1 : 30}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => handleNumberInput(e, setRetirementAge, currentAge !== "" ? Number(currentAge) + 1 : 30, 100)}
                      placeholder="60"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="lifeExpectancy" className="flex items-center justify-between">
                    <span>Life Expectancy (years)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={lifeExpectancy !== "" ? [Number(lifeExpectancy)] : [85]}
                      onValueChange={(values) => setLifeExpectancy(values[0])}
                      max={110}
                      min={retirementAge !== "" ? Number(retirementAge) + 1 : 60}
                      step={1}
                    />
                  </div>
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lifeExpectancy"
                      type="number"
                      value={lifeExpectancy}
                      onChange={(e) => handleNumberInput(e, setLifeExpectancy, retirementAge !== "" ? Number(retirementAge) + 1 : 60, 110)}
                      placeholder="85"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currentMonthlyExpenses">Current Monthly Expenses (₹)</Label>
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentMonthlyExpenses"
                      type="number"
                      value={currentMonthlyExpenses}
                      onChange={(e) => handleNumberInput(e, setCurrentMonthlyExpenses, 1000)}
                      placeholder="50000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="existingSavings">Existing Retirement Savings (₹)</Label>
                  <div className="flex items-center">
                    <BadgeIndianRupee className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="existingSavings"
                      type="number"
                      value={existingSavings}
                      onChange={(e) => handleNumberInput(e, setExistingSavings, 0)}
                      placeholder="1000000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                  <div className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthlyInvestment"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => handleNumberInput(e, setMonthlyInvestment, 0)}
                      placeholder="25000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="inflationRate" className="flex items-center justify-between">
                    <span>Inflation Rate (% per annum)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={inflationRate !== "" ? [Number(inflationRate)] : [6]}
                      onValueChange={(values) => setInflationRate(values[0])}
                      max={15}
                      min={0}
                      step={0.1}
                    />
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="inflationRate"
                      type="number"
                      value={inflationRate}
                      onChange={(e) => handleNumberInput(e, setInflationRate, 0, 50)}
                      placeholder="6"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="returnRatePreRetirement" className="flex items-center justify-between">
                    <span>Pre-Retirement Return Rate (% per annum)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={returnRatePreRetirement !== "" ? [Number(returnRatePreRetirement)] : [12]}
                      onValueChange={(values) => setReturnRatePreRetirement(values[0])}
                      max={20}
                      min={0}
                      step={0.1}
                    />
                  </div>
                  <div className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="returnRatePreRetirement"
                      type="number"
                      value={returnRatePreRetirement}
                      onChange={(e) => handleNumberInput(e, setReturnRatePreRetirement, 0, 50)}
                      placeholder="12"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="returnRatePostRetirement" className="flex items-center justify-between">
                    <span>Post-Retirement Return Rate (% per annum)</span>
                  </Label>
                  <div className="mb-2">
                    <Slider
                      value={returnRatePostRetirement !== "" ? [Number(returnRatePostRetirement)] : [7]}
                      onValueChange={(values) => setReturnRatePostRetirement(values[0])}
                      max={15}
                      min={0}
                      step={0.1}
                    />
                  </div>
                  <div className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="returnRatePostRetirement"
                      type="number"
                      value={returnRatePostRetirement}
                      onChange={(e) => handleNumberInput(e, setReturnRatePostRetirement, 0, 30)}
                      placeholder="7"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Projection</CardTitle>
              <CardDescription>
                Analysis of your retirement needs and financial projection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                  <CardContent className="p-4">
                    <h3 className="text-xs md:text-sm font-semibold mb-2 flex items-center">
                      <AlertCircle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
                      Required Corpus at Retirement
                    </h3>
                    <p className="text-xl md:text-2xl font-bold">{formatCurrency(requiredCorpus)}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      Monthly pension: {formatCurrency(monthlyPensionAtRetirement)} at age {retirementAge}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`${shortfall > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : 'bg-green-50 dark:bg-green-900/20 border-green-200'}`}>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center">
                      <AlertCircle className={`mr-2 h-4 w-4 ${shortfall > 0 ? 'text-red-600' : 'text-green-600'}`} />
                      {shortfall > 0 ? 'Projected Shortfall' : 'Projected Surplus'}
                    </h3>
                    <p className="text-2xl font-bold">{shortfall > 0 ? '-' : '+'}{formatCurrency(Math.abs(shortfall))}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your projected corpus: {formatCurrency(projectedCorpus)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {shortfall > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md mb-6 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Calculator className="h-4 w-4 mr-2 text-amber-600" />
                    Additional Monthly Investment Needed
                  </h3>
                  <p className="text-xl font-semibold text-amber-700 dark:text-amber-400">+₹{Math.round(additionalMonthlyInvestment).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    To reach your retirement goal, you need to invest this additional amount monthly until retirement.
                  </p>
                </div>
              )}
              
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-sm font-medium mb-3">Year-by-Year Projection</h3>
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Age</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Monthly Expense</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getVisibleYears().map((projection) => (
                      <TableRow key={projection.year}>
                        <TableCell className="font-medium whitespace-nowrap">{projection.year}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            projection.phase === "Accumulation" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}>
                            {projection.phase}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(projection.monthlyExpense)}</TableCell>
                        <TableCell className={`font-semibold whitespace-nowrap ${
                          projection.savingsBalance === 0 
                            ? "text-red-600 dark:text-red-400" 
                            : ""
                        }`}>
                          {formatCurrency(projection.savingsBalance)}
                          {projection.phase === "Withdrawal" && projection.savingsBalance === 0 && 
                            " (Depleted)"}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {yearWiseProjections.length > 10 && !showAllYears && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllYears(true)}
                            className="text-xs"
                          >
                            Show all {yearWiseProjections.length} years
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {showAllYears && yearWiseProjections.length > 10 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAllYears(false)}
                            className="text-xs"
                          >
                            Show fewer years
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="assumptions">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" /> 
                      Calculation Assumptions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">Constant Inflation:</span> The calculator assumes a constant inflation rate throughout your lifetime. In reality, inflation fluctuates.</p>
                      <p><span className="font-medium">Consistent Returns:</span> The calculator assumes consistent returns on investments, whereas actual market returns can be volatile.</p>
                      <p><span className="font-medium">No Major Life Events:</span> The model doesn't account for major life events like health emergencies or unplanned expenses.</p>
                      <p><span className="font-medium">Longevity Risk:</span> The calculation is based on a fixed life expectancy. If you live longer, you may outlive your savings.</p>
                      <p><span className="font-medium">No Tax Considerations:</span> The calculator does not factor in taxes on withdrawals or investment gains.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="retirement-strategies">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-primary" /> 
                      Retirement Planning Strategies
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium">National Pension System (NPS):</span> Consider investing in NPS for tax benefits under Section 80CCD and long-term retirement savings.</p>
                      <p><span className="font-medium">Employee Provident Fund (EPF):</span> Maximize your EPF contributions for a secure retirement corpus with guaranteed returns.</p>
                      <p><span className="font-medium">Public Provident Fund (PPF):</span> Leverage PPF for tax-free returns and a sovereign guaranteed investment option.</p>
                      <p><span className="font-medium">Equity Mutual Funds:</span> Consider systematic investment plans (SIPs) in equity funds for long-term wealth creation and inflation-beating returns.</p>
                      <p><span className="font-medium">Senior Citizen Saving Scheme (SCSS):</span> Look into SCSS post-retirement for higher interest rates and regular income.</p>
                      <p><span className="font-medium">Pradhan Mantri Vaya Vandana Yojana (PMVVY):</span> A government-backed pension scheme offering guaranteed returns for senior citizens.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;