import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Home, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";

const HraCalculator = () => {
  const [basicSalary, setBasicSalary] = useState<number>(40000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [rentPaid, setRentPaid] = useState<number>(25000);
  const [cityType, setCityType] = useState<string>("metro");
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [rentExceedsBasic, setRentExceedsBasic] = useState<boolean>(false);
  const [monthlyValues, setMonthlyValues] = useState<boolean>(true);
  const [totalExpected, setTotalExpected] = useState<boolean>(false);
  
  // Conversion factors
  const monthlyToAnnual = 12;
  
  // Calculation Results
  const [actualHra, setActualHra] = useState<number>(0);
  const [basicAnnual, setBasicAnnual] = useState<number>(0);
  const [hraAnnual, setHraAnnual] = useState<number>(0);
  const [rentAnnual, setRentAnnual] = useState<number>(0);
  const [exemption1, setExemption1] = useState<number>(0);
  const [exemption2, setExemption2] = useState<number>(0);
  const [exemption3, setExemption3] = useState<number>(0);
  const [finalExemption, setFinalExemption] = useState<number>(0);
  const [taxableHra, setTaxableHra] = useState<number>(0);
  
  useEffect(() => {
    // Check if rent exceeds 10% of basic
    const rentExceeds = rentPaid > (basicSalary * 0.1);
    setRentExceedsBasic(rentExceeds);
    
    if (isCalculated) {
      calculateHraExemption();
    }
  }, [basicSalary, hraReceived, rentPaid, cityType, monthlyValues, totalExpected]);
  
  const calculateHraExemption = () => {
    // Convert to annual if values are monthly
    const basicForCalc = monthlyValues ? basicSalary * monthlyToAnnual : basicSalary;
    const hraForCalc = monthlyValues ? hraReceived * monthlyToAnnual : hraReceived;
    const rentForCalc = monthlyValues ? rentPaid * monthlyToAnnual : rentPaid;
    
    setBasicAnnual(basicForCalc);
    setHraAnnual(hraForCalc);
    setRentAnnual(rentForCalc);
    
    // Calculate exemptions
    // Exemption 1: Actual HRA received
    const actual = hraForCalc;
    setExemption1(actual);
    
    // Exemption 2: Rent paid in excess of 10% of basic salary
    const excess = rentForCalc - (0.1 * basicForCalc);
    setExemption2(Math.max(0, excess));
    
    // Exemption 3: 50% of basic for metro cities, 40% for non-metro
    const percentageOfBasic = cityType === "metro" ? 0.5 : 0.4;
    const basicPercentage = basicForCalc * percentageOfBasic;
    setExemption3(basicPercentage);
    
    // HRA exemption is minimum of the three
    const exemption = Math.min(actual, Math.max(0, excess), basicPercentage);
    setFinalExemption(exemption);
    
    // Taxable HRA = Actual HRA - Exemption
    const taxable = actual - exemption;
    setTaxableHra(taxable);
    
    setActualHra(actual);
    setIsCalculated(true);
  };
  
  const handleCalculate = () => {
    calculateHraExemption();
  };
  
  const handleReset = () => {
    setBasicSalary(40000);
    setHraReceived(20000);
    setRentPaid(25000);
    setCityType("metro");
    setIsCalculated(false);
    setMonthlyValues(true);
  };

  const displayValue = (value: number): string => {
    if (totalExpected) {
      return formatCurrency(value);
    } else {
      if (monthlyValues) {
        return formatCurrency(value / 12);
      } else {
        return formatCurrency(value);
      }
    }
  };

  const toggleDisplayValues = () => {
    setTotalExpected(!totalExpected);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">HRA Exemption Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your House Rent Allowance (HRA) tax exemption under Section 10(13A) of the Income Tax Act
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Home className="mr-2 h-5 w-5" />
                Input Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthly-switch">Input Values Are</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="monthly-switch" className={!monthlyValues ? "text-primary font-bold" : ""}>Annual</Label>
                  <Switch
                    id="monthly-switch"
                    checked={monthlyValues}
                    onCheckedChange={setMonthlyValues}
                  />
                  <Label htmlFor="monthly-switch" className={monthlyValues ? "text-primary font-bold" : ""}>Monthly</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="basic-salary">Basic Salary</Label>
                <Input
                  id="basic-salary"
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hra-received">HRA Received</Label>
                <Input
                  id="hra-received"
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(Number(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rent-paid">Rent Paid</Label>
                <Input
                  id="rent-paid"
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(Number(e.target.value) || 0)}
                />
                {!rentExceedsBasic && rentPaid > 0 && (
                  <p className="text-xs text-destructive mt-1">
                    Note: Rent paid should exceed 10% of basic salary for HRA exemption.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>City Type</Label>
                <RadioGroup value={cityType} onValueChange={setCityType} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metro" id="metro" />
                    <Label htmlFor="metro">Metro City (Delhi, Mumbai, Kolkata, Chennai)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-metro" id="non-metro" />
                    <Label htmlFor="non-metro">Non-Metro City</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-4 space-x-3">
                <Button 
                  onClick={handleCalculate}
                  className="w-full"
                  size="lg"
                >
                  Calculate Exemption
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
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">HRA Exemption Summary</h3>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="display-switch" className={!totalExpected ? "text-primary font-bold" : ""}>
                          {monthlyValues ? "Monthly" : "Annual"}
                        </Label>
                        <Switch
                          id="display-switch"
                          checked={totalExpected}
                          onCheckedChange={toggleDisplayValues}
                        />
                        <Label htmlFor="display-switch" className={totalExpected ? "text-primary font-bold" : ""}>
                          Annual
                        </Label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm mb-1">Total HRA Received</p>
                        <p className="text-xl font-semibold">{displayValue(actualHra)}</p>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Eligible HRA Exemption</p>
                        <p className="text-xl font-semibold text-primary">{displayValue(finalExemption)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm mb-1">Exemption Utilization</p>
                      <Progress value={(finalExemption / actualHra) * 100} className="h-3" />
                      <p className="text-xs mt-1 text-right">
                        {Math.round((finalExemption / actualHra) * 100)}% of HRA is exempt from tax
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm mb-1">Taxable HRA</p>
                      <p className="text-lg">{displayValue(taxableHra)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculation Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Basic Salary</TableCell>
                        <TableCell className="text-right">{displayValue(basicAnnual)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">HRA Received</TableCell>
                        <TableCell className="text-right">{displayValue(hraAnnual)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rent Paid</TableCell>
                        <TableCell className="text-right">{displayValue(rentAnnual)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">10% of Basic Salary</TableCell>
                        <TableCell className="text-right">{displayValue(basicAnnual * 0.1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Separator className="my-2" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Least of the following three is exempt:
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-6">1. Actual HRA received</TableCell>
                        <TableCell className="text-right">{displayValue(exemption1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-6">2. Rent paid (-) 10% of basic salary</TableCell>
                        <TableCell className="text-right">{displayValue(exemption2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-6">
                          3. {cityType === "metro" ? "50%" : "40%"} of basic salary 
                          ({cityType === "metro" ? "Metro" : "Non-Metro"} city)
                        </TableCell>
                        <TableCell className="text-right">{displayValue(exemption3)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Separator className="my-2" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-bold">
                        <TableCell>Eligible HRA Exemption</TableCell>
                        <TableCell className="text-right text-primary">{displayValue(finalExemption)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Taxable HRA</TableCell>
                        <TableCell className="text-right">{displayValue(taxableHra)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">Important Notes:</h3>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>HRA exemption is available only if you are paying rent.</li>
                    <li>You need to submit rent receipts or landlord details to your employer.</li>
                    <li>For rent exceeding ₹1 lakh per annum, landlord's PAN is mandatory.</li>
                    <li>Metro cities include Mumbai, Delhi, Kolkata, and Chennai.</li>
                    <li>If you own the house you live in, you cannot claim HRA exemption.</li>
                  </ul>
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
                <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">How HRA Exemption Works</h3>
                <p className="text-muted-foreground mb-6">
                  House Rent Allowance (HRA) is an allowance given by employers to employees to meet rental expenses.
                  The Income Tax Act allows for partial or full exemption of HRA from taxable income.
                </p>
                
                <div className="text-left space-y-4">
                  <div>
                    <h4 className="font-semibold">The HRA exemption is the least of:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Actual HRA received from employer</li>
                      <li>Rent paid minus 10% of basic salary</li>
                      <li>50% of basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Example:</h4>
                    <p className="text-muted-foreground pl-5">
                      If your basic salary is ₹40,000 per month, HRA received is ₹20,000 per month, and rent paid is ₹25,000 per month in a metro city, 
                      fill in these details and click "Calculate Exemption" to see your eligible HRA exemption amount.
                    </p>
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

export default HraCalculator;