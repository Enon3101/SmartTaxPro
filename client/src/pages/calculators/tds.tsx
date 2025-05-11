import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

// TDS rate data
const tdsRates = {
  salary: { rate: 0, description: "As per the income tax slab rates" },
  professionalFees: { rate: 10, description: "If payment exceeds ₹30,000 in a financial year" },
  interest: { rate: 10, description: "If interest exceeds ₹40,000 (₹50,000 for senior citizens)" },
  rent: { 
    rates: [
      { type: "individual", rate: 10, threshold: 240000 },
      { type: "company", rate: 10, threshold: 240000 }
    ],
    description: "For rent exceeding ₹20,000 per month (₹2,40,000 per annum)"
  },
  commission: { rate: 5, description: "If payment exceeds ₹15,000 in a financial year" },
  dividend: { rate: 10, description: "If dividend exceeds ₹5,000 in a financial year" },
  contractor: {
    rates: [
      { type: "individual", rate: 1, threshold: 30000, annual: 100000 },
      { type: "company", rate: 2, threshold: 30000, annual: 100000 }
    ],
    description: "For payment exceeding ₹30,000 for a single payment or ₹1,00,000 annually"
  }
};

const TdsCalculator = () => {
  const [paymentType, setPaymentType] = useState<string>("salary");
  const [paymentAmount, setPaymentAmount] = useState<number>(100000);
  const [payeeType, setPayeeType] = useState<string>("individual");
  const [panAvailable, setPanAvailable] = useState<boolean>(true);
  const [periodMonthly, setPeriodMonthly] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Results
  const [tdsAmount, setTdsAmount] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [annualizedAmount, setAnnualizedAmount] = useState<number>(0);
  const [applicableRate, setApplicableRate] = useState<number>(0);
  const [higherRate, setHigherRate] = useState<boolean>(false);
  const [belowThreshold, setBelowThreshold] = useState<boolean>(false);
  
  const calculateTds = () => {
    let tdsRate = 0;
    let isHigherRate = false;
    let isBelowThreshold = false;
    let annualAmount = periodMonthly ? paymentAmount * 12 : paymentAmount;
    
    setAnnualizedAmount(annualAmount);
    
    // Determine TDS rate based on payment type
    switch (paymentType) {
      case "salary": 
        // For salary, we use a simplified estimation since actual calculation is complex
        if (annualAmount <= 250000) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else if (annualAmount <= 500000) {
          tdsRate = 5;
        } else if (annualAmount <= 1000000) {
          tdsRate = 20;
        } else {
          tdsRate = 30;
        }
        break;
        
      case "professionalFees":
        if (annualAmount <= 30000) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else {
          tdsRate = 10;
        }
        break;
        
      case "interest":
        if (annualAmount <= 40000) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else {
          tdsRate = 10;
        }
        break;
        
      case "rent":
        const rentThreshold = tdsRates.rent.rates.find(r => r.type === payeeType)?.threshold || 240000;
        if (annualAmount <= rentThreshold) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else {
          tdsRate = 10;
        }
        break;
        
      case "commission":
        if (annualAmount <= 15000) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else {
          tdsRate = 5;
        }
        break;
        
      case "dividend":
        if (annualAmount <= 5000) {
          tdsRate = 0;
          isBelowThreshold = true;
        } else {
          tdsRate = 10;
        }
        break;
        
      case "contractor":
        const contractorInfo = tdsRates.contractor.rates.find(r => r.type === payeeType);
        if (contractorInfo) {
          if (periodMonthly && paymentAmount <= contractorInfo.threshold) {
            tdsRate = 0;
            isBelowThreshold = true;
          } else if (!periodMonthly && annualAmount <= contractorInfo.annual) {
            tdsRate = 0;
            isBelowThreshold = true;
          } else {
            tdsRate = contractorInfo.rate;
          }
        }
        break;
        
      default:
        tdsRate = 10;
    }
    
    // Higher rate for no PAN (usually 20% or double the original rate, whichever is higher)
    if (!panAvailable) {
      tdsRate = Math.max(20, tdsRate * 2);
      isHigherRate = true;
    }
    
    setApplicableRate(tdsRate);
    setHigherRate(isHigherRate);
    setBelowThreshold(isBelowThreshold);
    
    // Calculate TDS amount
    const calculatedAmount = (paymentAmount * tdsRate) / 100;
    setTdsAmount(calculatedAmount);
    
    // Calculate net amount
    setNetAmount(paymentAmount - calculatedAmount);
    
    // Calculate effective rate
    setEffectiveRate(tdsRate);
    
    setIsCalculated(true);
  };
  
  const handleReset = () => {
    setPaymentType("salary");
    setPaymentAmount(100000);
    setPayeeType("individual");
    setPanAvailable(true);
    setPeriodMonthly(false);
    setIsCalculated(false);
  };
  
  const getPaymentTypeLabel = () => {
    switch (paymentType) {
      case "salary": return "Salary Amount";
      case "professionalFees": return "Professional Fees";
      case "interest": return "Interest Amount";
      case "rent": return "Rent Amount";
      case "commission": return "Commission Amount";
      case "dividend": return "Dividend Amount";
      case "contractor": return "Payment to Contractor";
      default: return "Payment Amount";
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">TDS Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Tax Deducted at Source (TDS) for various payment types under Indian tax laws
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="mr-2 h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-type">Payment Type</Label>
                <Select 
                  value={paymentType} 
                  onValueChange={(value) => {
                    setPaymentType(value);
                    if (value === "rent" || value === "contractor") {
                      setPayeeType("individual");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary Payment (Section 192)</SelectItem>
                    <SelectItem value="professionalFees">Professional Fees (Section 194J)</SelectItem>
                    <SelectItem value="interest">Interest (Section 194A)</SelectItem>
                    <SelectItem value="rent">Rent Payment (Section 194I)</SelectItem>
                    <SelectItem value="commission">Commission (Section 194H)</SelectItem>
                    <SelectItem value="dividend">Dividend (Section 194)</SelectItem>
                    <SelectItem value="contractor">Payment to Contractor (Section 194C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-amount">{getPaymentTypeLabel()}</Label>
                <div className="flex items-center">
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Label htmlFor="period">Payment Period</Label>
                <RadioGroup 
                  value={periodMonthly ? "monthly" : "annual"} 
                  onValueChange={(value) => setPeriodMonthly(value === "monthly")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annual" id="annual" />
                    <Label htmlFor="annual">Annual/One-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(paymentType === "rent" || paymentType === "contractor") && (
                <div className="space-y-2">
                  <Label htmlFor="payee-type">Payee Type</Label>
                  <RadioGroup 
                    value={payeeType} 
                    onValueChange={setPayeeType}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual/HUF</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">Company/Others</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="pan-available">PAN Details</Label>
                <RadioGroup 
                  value={panAvailable ? "yes" : "no"} 
                  onValueChange={(value) => setPanAvailable(value === "yes")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="pan-yes" />
                    <Label htmlFor="pan-yes">PAN Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pan-no" />
                    <Label htmlFor="pan-no">No PAN/Invalid PAN</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-4 space-x-3">
                <Button 
                  onClick={calculateTds}
                  className="w-full"
                  size="lg"
                >
                  Calculate TDS
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">TDS Applicability:</h3>
              <p className="text-sm mb-4">{tdsRates[paymentType as keyof typeof tdsRates].description}</p>
              
              {!panAvailable && (
                <div className="flex items-start space-x-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <p>Higher TDS rate applies when PAN is not furnished or is invalid.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {isCalculated && (
            <>
              <Card className="bg-muted/50 border-primary border shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm">Gross Amount</p>
                      <p className="text-2xl font-semibold">{formatCurrency(paymentAmount)}</p>
                      <p className="text-xs text-muted-foreground">{periodMonthly ? "per month" : "one-time/annual"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm">TDS Amount</p>
                      <p className="text-2xl font-semibold text-primary">{formatCurrency(tdsAmount)}</p>
                      <p className="text-xs text-muted-foreground">{effectiveRate}% of gross amount</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm">Net Payable</p>
                      <p className="text-2xl font-semibold">{formatCurrency(netAmount)}</p>
                      <p className="text-xs text-muted-foreground">After TDS deduction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>TDS Calculation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Payment Type</TableCell>
                        <TableCell>
                          {(() => {
                            switch (paymentType) {
                              case "salary": return "Salary (Section 192)";
                              case "professionalFees": return "Professional Fees (Section 194J)";
                              case "interest": return "Interest (Section 194A)";
                              case "rent": return "Rent (Section 194I)";
                              case "commission": return "Commission (Section 194H)";
                              case "dividend": return "Dividend (Section 194)";
                              case "contractor": return "Contractor Payment (Section 194C)";
                              default: return paymentType;
                            }
                          })()}
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell className="font-medium">Payment Amount</TableCell>
                        <TableCell>
                          {formatCurrency(paymentAmount)}
                          {periodMonthly && ` per month (${formatCurrency(annualizedAmount)} annually)`}
                        </TableCell>
                      </TableRow>
                      
                      {(paymentType === "rent" || paymentType === "contractor") && (
                        <TableRow>
                          <TableCell className="font-medium">Payee Type</TableCell>
                          <TableCell>{payeeType === "individual" ? "Individual/HUF" : "Company/Others"}</TableCell>
                        </TableRow>
                      )}
                      
                      <TableRow>
                        <TableCell className="font-medium">PAN Status</TableCell>
                        <TableCell>{panAvailable ? "Available" : "Not Available/Invalid"}</TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell className="font-medium">TDS Rate</TableCell>
                        <TableCell>
                          {applicableRate}%
                          {higherRate && " (Higher rate due to no PAN)"}
                          {belowThreshold && " (Below threshold, no TDS applicable)"}
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell className="font-medium">TDS Amount</TableCell>
                        <TableCell>{formatCurrency(tdsAmount)}</TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell className="font-medium">Net Amount Payable</TableCell>
                        <TableCell>{formatCurrency(netAmount)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>TDS Rates Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>TDS Rate</TableHead>
                        <TableHead>Threshold for Deduction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Salary (Section 192)</TableCell>
                        <TableCell>As per slab rates</TableCell>
                        <TableCell>Based on tax slabs and exemptions</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Professional Fees (Section 194J)</TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell>₹30,000 per annum</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interest (Section 194A)</TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell>₹40,000 per annum (₹50,000 for senior citizens)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rent (Section 194I)</TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell>₹2,40,000 per annum</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Commission (Section 194H)</TableCell>
                        <TableCell>5%</TableCell>
                        <TableCell>₹15,000 per annum</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividend (Section 194)</TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell>₹5,000 per annum</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Contractor Payment (Section 194C)</TableCell>
                        <TableCell>1% (Individual) / 2% (Others)</TableCell>
                        <TableCell>₹30,000 per transaction or ₹1,00,000 per annum</TableCell>
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
              <CardContent className="p-8 text-center">
                <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">About TDS in India</h3>
                <p className="text-muted-foreground mb-6">
                  Tax Deducted at Source (TDS) is a method of collecting tax at the source of income. 
                  The payer deducts tax when certain specified payments are made to a recipient and 
                  remits the tax to the government.
                </p>
                
                <div className="text-left space-y-4">
                  <div>
                    <h4 className="font-semibold">Common TDS Transactions:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Salary payments to employees (Section 192)</li>
                      <li>Professional or technical service fees (Section 194J)</li>
                      <li>Interest payments from banks, deposits, etc. (Section 194A)</li>
                      <li>Rent payments for property (Section 194I)</li>
                      <li>Commission or brokerage payments (Section 194H)</li>
                      <li>Payments to contractors or sub-contractors (Section 194C)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Important TDS Rules:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Higher TDS rates apply when PAN is not furnished by the payee</li>
                      <li>TDS certificates (Form 16/16A) must be provided to the payee</li>
                      <li>Specific thresholds exist for each payment type below which TDS is not applicable</li>
                      <li>TDS must be deposited with the government by the 7th of the following month</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TdsCalculator;