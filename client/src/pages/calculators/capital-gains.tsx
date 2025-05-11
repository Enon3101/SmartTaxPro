import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BarChart2, Calculator, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

// Define types for tax rate configurations
type ShortTermConfig = {
  rate: number | 'slab';
  surcharge: boolean;
  cess: boolean;
};

type LongTermEquityConfig = {
  rate: number;
  exemptionLimit: number;
  surcharge: boolean;
  cess: boolean;
};

type LongTermOtherConfig = {
  rate: number;
  indexation: boolean;
  surcharge: boolean;
  cess: boolean;
};

// Tax rates for different asset types
const taxRates: {
  equity: { shortTerm: ShortTermConfig; longTerm: LongTermEquityConfig };
  debt: { shortTerm: ShortTermConfig; longTerm: LongTermOtherConfig };
  property: { shortTerm: ShortTermConfig; longTerm: LongTermOtherConfig };
  gold: { shortTerm: ShortTermConfig; longTerm: LongTermOtherConfig };
} = {
  equity: {
    shortTerm: { rate: 15, surcharge: true, cess: true },
    longTerm: { rate: 10, exemptionLimit: 100000, surcharge: true, cess: true }
  },
  debt: {
    shortTerm: { rate: 'slab', surcharge: true, cess: true },
    longTerm: { rate: 20, indexation: true, surcharge: true, cess: true }
  },
  property: {
    shortTerm: { rate: 'slab', surcharge: true, cess: true },
    longTerm: { rate: 20, indexation: true, surcharge: true, cess: true }
  },
  gold: {
    shortTerm: { rate: 'slab', surcharge: true, cess: true },
    longTerm: { rate: 20, indexation: true, surcharge: true, cess: true }
  }
};

// Cost Inflation Index (CII) values
const ciiValues = {
  '2001-02': 100,
  '2002-03': 105,
  '2003-04': 109,
  '2004-05': 113,
  '2005-06': 117,
  '2006-07': 122,
  '2007-08': 129,
  '2008-09': 137,
  '2009-10': 148,
  '2010-11': 167,
  '2011-12': 184,
  '2012-13': 200,
  '2013-14': 220,
  '2014-15': 240,
  '2015-16': 254,
  '2016-17': 264,
  '2017-18': 272,
  '2018-19': 280,
  '2019-20': 289,
  '2020-21': 301,
  '2021-22': 317,
  '2022-23': 331,
  '2023-24': 348,
  '2024-25': 364
};

// Personal tax slabs
const incomeTaxSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 }
];

// Surcharge slabs
const surchargeSlab = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000000, max: 10000000, rate: 10 },
  { min: 10000000, max: 20000000, rate: 15 },
  { min: 20000000, max: 50000000, rate: 25 },
  { min: 50000000, max: Infinity, rate: 37 }
];

// Education cess rate
const EDUCATION_CESS = 4;

const CapitalGainsCalculator = () => {
  const [activeTab, setActiveTab] = useState<string>("equity");
  const [purchaseDate, setPurchaseDate] = useState<string>("2023-04-01");
  const [saleDate, setSaleDate] = useState<string>("2024-03-31");
  const [purchasePrice, setPurchasePrice] = useState<number>(100000);
  const [salePrice, setSalePrice] = useState<number>(150000);
  const [expenses, setExpenses] = useState<number>(1000);
  const [purchaseFY, setPurchaseFY] = useState<string>("2023-24");
  const [saleFY, setSaleFY] = useState<string>("2023-24");
  const [otherIncome, setOtherIncome] = useState<number>(500000);
  const [includeOtherIncome, setIncludeOtherIncome] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Results
  const [capitalGain, setCapitalGain] = useState<number>(0);
  const [gainType, setGainType] = useState<string>("short");
  const [indexedCost, setIndexedCost] = useState<number>(0);
  const [taxableGain, setTaxableGain] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [surcharge, setSurcharge] = useState<number>(0);
  const [cess, setCess] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  
  // Calculate holding period in days
  const calculateHoldingPeriod = () => {
    const purchase = new Date(purchaseDate);
    const sale = new Date(saleDate);
    const diffTime = Math.abs(sale.getTime() - purchase.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Determine if gain is long-term or short-term
  const determineGainType = (assetType: string, days: number) => {
    switch (assetType) {
      case "equity":
        return days > 365 ? "long" : "short";
      case "debt":
        return days > 1095 ? "long" : "short"; // 3 years for debt
      case "property":
        return days > 730 ? "long" : "short"; // 2 years for property
      case "gold":
        return days > 1095 ? "long" : "short"; // 3 years for gold
      default:
        return days > 365 ? "long" : "short";
    }
  };
  
  // Calculate tax from slabs
  const calculateTaxFromSlabs = (income: number, slabs: any[]) => {
    let tax = 0;
    for (const slab of slabs) {
      if (income > slab.min) {
        const taxableInThisSlab = Math.min(income - slab.min, slab.max - slab.min);
        tax += (taxableInThisSlab * slab.rate) / 100;
      }
    }
    return tax;
  };
  
  // Calculate tax amount
  const calculateTaxAmount = (gain: number, type: string, assetType: string, includeIncome: boolean, income: number) => {
    let rate = 0;
    let taxableGain = gain;
    let totalIncome = 0;
    let tax = 0;
    
    // Get tax rate config
    const rateConfig = taxRates[assetType as keyof typeof taxRates][type === "long" ? "longTerm" : "shortTerm"];
    
    // Apply LTCG exemption for equity (first 1 lakh exempt)
    if (assetType === "equity" && type === "long") {
      // We know this is the equity long-term config, so we can safely cast it
      const equityLongTermConfig = rateConfig as LongTermEquityConfig;
      taxableGain = Math.max(0, gain - (equityLongTermConfig.exemptionLimit || 0));
    }
    
    // Calculate tax based on type
    if (rateConfig.rate === 'slab') {
      // For short-term gains taxed as per slab
      if (includeIncome) {
        totalIncome = income + taxableGain;
        // Tax on total income
        tax = calculateTaxFromSlabs(totalIncome, incomeTaxSlabs);
        // Tax on income without gain
        const taxOnIncomeOnly = calculateTaxFromSlabs(income, incomeTaxSlabs);
        // Tax attributable to gain
        tax = tax - taxOnIncomeOnly;
      } else {
        // Assume gain is taxed at marginal rate
        const slabRate = findMarginalRate(income);
        tax = (taxableGain * slabRate) / 100;
        rate = slabRate;
      }
    } else {
      // For fixed rate taxation
      rate = rateConfig.rate as number;
      tax = (taxableGain * rate) / 100;
    }
    
    setTaxAmount(tax);
    setTaxRate(rate);
    setTaxableGain(taxableGain);
    
    // Calculate surcharge if applicable
    let surchargeAmount = 0;
    if (rateConfig.surcharge) {
      const totalIncomeForSurcharge = includeIncome ? income + taxableGain : taxableGain;
      
      for (const slab of surchargeSlab) {
        if (totalIncomeForSurcharge > slab.min && totalIncomeForSurcharge <= slab.max) {
          surchargeAmount = (tax * slab.rate) / 100;
          break;
        }
      }
    }
    setSurcharge(surchargeAmount);
    
    // Calculate education cess
    const cessAmount = ((tax + surchargeAmount) * EDUCATION_CESS) / 100;
    setCess(cessAmount);
    
    // Total tax
    const total = tax + surchargeAmount + cessAmount;
    setTotalTax(total);
    
    return {
      taxableGain,
      rate,
      tax,
      surcharge: surchargeAmount,
      cess: cessAmount,
      totalTax: total
    };
  };
  
  // Find marginal tax rate based on income
  const findMarginalRate = (income: number) => {
    for (let i = incomeTaxSlabs.length - 1; i >= 0; i--) {
      if (income > incomeTaxSlabs[i].min) {
        return incomeTaxSlabs[i].rate;
      }
    }
    return 0;
  };
  
  // Calculate indexed cost of acquisition
  const calculateIndexedCost = (cost: number, purchaseFY: string, saleFY: string) => {
    const purchaseIndex = ciiValues[purchaseFY as keyof typeof ciiValues] || 100;
    const saleIndex = ciiValues[saleFY as keyof typeof ciiValues] || 100;
    return Math.round((cost * saleIndex) / purchaseIndex);
  };
  
  // Main calculation function
  const calculateCapitalGains = () => {
    const holdingPeriod = calculateHoldingPeriod();
    const type = determineGainType(activeTab, holdingPeriod);
    setGainType(type);
    
    let cost = purchasePrice;
    let gain = 0;
    
    // Apply indexation for long-term gains in applicable assets
    if (type === "long" && 
        (activeTab === "debt" || activeTab === "property" || activeTab === "gold")) {
      const indexed = calculateIndexedCost(purchasePrice, purchaseFY, saleFY);
      setIndexedCost(indexed);
      cost = indexed;
    } else {
      setIndexedCost(purchasePrice);
    }
    
    // Calculate capital gain
    gain = Math.max(0, salePrice - cost - expenses);
    setCapitalGain(gain);
    
    // Calculate tax
    calculateTaxAmount(gain, type, activeTab, includeOtherIncome, otherIncome);
    
    setIsCalculated(true);
  };
  
  const handleReset = () => {
    setPurchaseDate("2023-04-01");
    setSaleDate("2024-03-31");
    setPurchasePrice(100000);
    setSalePrice(150000);
    setExpenses(1000);
    setPurchaseFY("2023-24");
    setSaleFY("2023-24");
    setOtherIncome(500000);
    setIncludeOtherIncome(false);
    setIsCalculated(false);
  };
  
  const assetLabels = {
    equity: "Equity Shares/Mutual Funds",
    debt: "Debt Funds/Bonds",
    property: "Real Estate Property",
    gold: "Gold/Precious Metals"
  };
  
  const generateFinancialYearOptions = () => {
    const options = [];
    for (const year in ciiValues) {
      options.push(
        <SelectItem key={year} value={year}>
          FY {year}
        </SelectItem>
      );
    }
    return options;
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Capital Gains Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your short-term and long-term capital gains tax on various assets
        </p>
      </div>
      
      <Tabs defaultValue="equity" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="equity">Equity</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  {assetLabels[activeTab as keyof typeof assetLabels]} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="purchase-date">Purchase Date</Label>
                  <Input
                    id="purchase-date"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase-fy">Purchase Financial Year</Label>
                  <Select value={purchaseFY} onValueChange={setPurchaseFY}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financial year" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateFinancialYearOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase-price">Purchase Price</Label>
                  <Input
                    id="purchase-price"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sale-date">Sale Date</Label>
                  <Input
                    id="sale-date"
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sale-fy">Sale Financial Year</Label>
                  <Select value={saleFY} onValueChange={setSaleFY}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financial year" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateFinancialYearOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sale-price">Sale Price</Label>
                  <Input
                    id="sale-price"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expenses">Expenses (Brokerage, STT, etc.)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value) || 0)}
                  />
                </div>
                
                {(activeTab === "debt" || activeTab === "property" || activeTab === "gold") && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="other-income"
                        checked={includeOtherIncome}
                        onCheckedChange={setIncludeOtherIncome}
                      />
                      <Label htmlFor="other-income">Include other income for slab calculation</Label>
                    </div>
                    
                    {includeOtherIncome && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="other-income-amount">Other Income Amount</Label>
                        <Input
                          id="other-income-amount"
                          type="number"
                          value={otherIncome}
                          onChange={(e) => setOtherIncome(Number(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-4 space-x-3">
                  <Button 
                    onClick={calculateCapitalGains}
                    className="w-full"
                    size="lg"
                  >
                    Calculate Capital Gains
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {isCalculated && (
              <>
                <Card className="bg-muted/50 border-primary border shadow-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm">Capital Gain</p>
                        <p className="text-2xl font-semibold">{formatCurrency(capitalGain)}</p>
                        <p className="text-xs text-muted-foreground">
                          {gainType === "long" ? "Long-term" : "Short-term"} capital gain
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm">Tax Rate</p>
                        <p className="text-2xl font-semibold">
                          {taxRate === 0 ? "As per slab" : `${taxRate}%`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applicable tax rate
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm">Total Tax Liability</p>
                        <p className="text-2xl font-semibold text-primary">{formatCurrency(totalTax)}</p>
                        <p className="text-xs text-muted-foreground">
                          Including surcharge & cess
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Calculator className="mr-2 h-5 w-5" />
                      Capital Gains Calculation Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Asset Type</TableCell>
                          <TableCell>{assetLabels[activeTab as keyof typeof assetLabels]}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Holding Period</TableCell>
                          <TableCell>
                            {calculateHoldingPeriod()} days
                            <span className="ml-2 text-xs px-2 py-1 rounded bg-muted">
                              {gainType === "long" ? "Long-term" : "Short-term"}
                            </span>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Sale Consideration</TableCell>
                          <TableCell>{formatCurrency(salePrice)}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">
                            {gainType === "long" && 
                            (activeTab === "debt" || activeTab === "property" || activeTab === "gold") 
                            ? "Indexed Cost of Acquisition" : "Cost of Acquisition"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(indexedCost)}
                            {gainType === "long" && 
                             (activeTab === "debt" || activeTab === "property" || activeTab === "gold") && 
                             indexedCost !== purchasePrice && (
                              <span className="text-xs ml-2 text-muted-foreground">
                                (Original: {formatCurrency(purchasePrice)})
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Transfer Expenses</TableCell>
                          <TableCell>{formatCurrency(expenses)}</TableCell>
                        </TableRow>
                        
                        <TableRow className="font-semibold">
                          <TableCell>Total Capital Gains</TableCell>
                          <TableCell>{formatCurrency(capitalGain)}</TableCell>
                        </TableRow>
                        
                        {activeTab === "equity" && gainType === "long" && (
                          <TableRow>
                            <TableCell className="font-medium">Exemption (up to ₹1 Lakh)</TableCell>
                            <TableCell>
                              {formatCurrency(Math.min(100000, capitalGain))}
                            </TableCell>
                          </TableRow>
                        )}
                        
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Separator className="my-2" />
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Taxable Capital Gains</TableCell>
                          <TableCell>{formatCurrency(taxableGain)}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Tax Rate</TableCell>
                          <TableCell>
                            {taxRate === 0 ? "As per income tax slab" : `${taxRate}%`}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Income Tax</TableCell>
                          <TableCell>{formatCurrency(taxAmount)}</TableCell>
                        </TableRow>
                        
                        {surcharge > 0 && (
                          <TableRow>
                            <TableCell className="font-medium">Surcharge</TableCell>
                            <TableCell>{formatCurrency(surcharge)}</TableCell>
                          </TableRow>
                        )}
                        
                        <TableRow>
                          <TableCell className="font-medium">Health & Education Cess (4%)</TableCell>
                          <TableCell>{formatCurrency(cess)}</TableCell>
                        </TableRow>
                        
                        <TableRow className="font-bold">
                          <TableCell>Total Tax Liability</TableCell>
                          <TableCell className="text-lg text-primary">{formatCurrency(totalTax)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      Time Period Rules & Tax Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-semibold" colSpan={2}>
                            Asset Classification Period
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Equity Shares/Equity-oriented Mutual Funds</TableCell>
                          <TableCell>Long-term if held for more than 12 months</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Debt Funds/Bonds</TableCell>
                          <TableCell>Long-term if held for more than 36 months</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Real Estate Property</TableCell>
                          <TableCell>Long-term if held for more than 24 months</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Gold/Precious Metals</TableCell>
                          <TableCell>Long-term if held for more than 36 months</TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Separator className="my-3" />
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-semibold" colSpan={2}>
                            Capital Gains Tax Rates
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Short-term Capital Gains (Equity)</TableCell>
                          <TableCell>15% (plus surcharge and cess)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Long-term Capital Gains (Equity)</TableCell>
                          <TableCell>10% on gains above ₹1 lakh (plus surcharge and cess)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Short-term Capital Gains (Others)</TableCell>
                          <TableCell>Taxed as per income tax slab rates</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Long-term Capital Gains (Others)</TableCell>
                          <TableCell>20% with indexation benefit (plus surcharge and cess)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleReset}>
                    Reset Calculator
                  </Button>
                </div>
              </>
            )}
            
            {!isCalculated && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Understanding Capital Gains Tax in India</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">What are Capital Gains?</h4>
                      <p className="text-muted-foreground">
                        Capital gains are profits from the sale of assets such as stocks, mutual funds, property, or gold. 
                        These gains are categorized as either short-term or long-term based on the holding period of the asset.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Holding Period Classification</h4>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li><span className="font-medium">Equity Shares & Equity Mutual Funds:</span> Long-term if held for more than 12 months</li>
                        <li><span className="font-medium">Debt Funds & Bonds:</span> Long-term if held for more than 36 months</li>
                        <li><span className="font-medium">Real Estate:</span> Long-term if held for more than 24 months</li>
                        <li><span className="font-medium">Gold & Other Assets:</span> Long-term if held for more than 36 months</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Indexation Benefit</h4>
                      <p className="text-muted-foreground">
                        For long-term capital gains on assets other than equity, indexation allows you to adjust 
                        the purchase price considering inflation. This reduces your taxable gain. 
                        The Cost Inflation Index (CII) is announced annually by the government.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Tax Rates</h4>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li><span className="font-medium">STCG on Equity:</span> 15% (plus applicable surcharge and cess)</li>
                        <li><span className="font-medium">LTCG on Equity:</span> 10% on gains exceeding ₹1 lakh (plus surcharge and cess)</li>
                        <li><span className="font-medium">STCG on other assets:</span> Taxed as per your income tax slab rates</li>
                        <li><span className="font-medium">LTCG on other assets:</span> 20% with indexation benefit (plus surcharge and cess)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CapitalGainsCalculator;