import { 
  AlertCircle,
  Building, 
  Calculator, 
  Calendar, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  Landmark,
  Network,
  CreditCard,
  Percent,
  CheckCircle,
  Book,
  Bell,
  FileBarChart,
  Receipt,
  Folder,
  Building2,
  IdCard,
  BookOpenCheck 
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "wouter";

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useTheme } from "@/context/ThemeProvider"; // Removed unused import
import { govtTaxWebsites } from "@/data/govtResources"; // Removed unused taxToolsAndCalculators, taxInformationResources
import { currentTaxDeadlines, previousTaxDeadlines } from "@/data/taxDeadlines";
import { 
  taxSlabs2024_25, 
  taxSlabs2025_26, 
  // seniorCitizenSlabs, // Removed unused import
  // superSeniorCitizenSlabs // Removed unused import
} from "@/data/taxSlabs";
import { formatIndianCurrency } from "@/lib/formatters";
// import BasicsOfIncomeTaxGuide from "@/pages/tax-resources/guides/BasicsOfIncomeTaxGuide"; // Removed unused import
import IncomeAndDeductionsGuide from "@/pages/tax-resources/guides/IncomeAndDeductionsGuide";
import ITRFilingProcessGuide from "@/pages/tax-resources/guides/ITRFilingProcessGuide";
import PostFilingEssentialsGuide from "@/pages/tax-resources/guides/PostFilingEssentialsGuide";

interface TaxSlab {
  incomeFrom: number;
  incomeTo: number | null;
  taxRate: number;
  description: string;
}

// interface TaxRegime { // Removed unused interface, selectedTaxRegime will infer its type
//   name: string;
//   description: string;
//   slabs: TaxSlab[];
//   cess: number;
//   surcharge?: { [key: string]: number };
//   deductions?: string[];
// }

const TaxResources = () => {
  const [selectedTaxYear, setSelectedTaxYear] = useState("2024-25");
  const [selectedRegime, setSelectedRegime] = useState("new");
  const [selectedPersonType, setSelectedPersonType] = useState("individual");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("below60");
  const [selectedDeadlineCategory, setSelectedDeadlineCategory] = useState("all");
  const [filterText, setFilterText] = useState("");
  // const { theme } = useTheme(); // Removed unused variable

  // Function to render icon based on icon name
  const renderIcon = (iconName: string) => {
    const iconProps = { size: 18, className: "mr-2" };
    switch (iconName) {
      case "building": return <Building {...iconProps} />;
      case "file-text": return <FileText {...iconProps} />;
      case "landmark": return <Landmark {...iconProps} />;
      case "calculator": return <Calculator {...iconProps} />;
      case "network": return <Network {...iconProps} />;
      case "credit-card": return <CreditCard {...iconProps} />;
      case "help-circle": return <HelpCircle {...iconProps} />;
      case "percent": return <Percent {...iconProps} />;
      case "check-circle": return <CheckCircle {...iconProps} />;
      case "book": return <Book {...iconProps} />;
      case "bell": return <Bell {...iconProps} />;
      case "file-bar-chart": return <FileBarChart {...iconProps} />;
      case "receipt": return <Receipt {...iconProps} />;
      case "folder": return <Folder {...iconProps} />;
      case "building-2": return <Building2 {...iconProps} />;
      case "id-card": return <IdCard {...iconProps} />;
      default: return <ExternalLink {...iconProps} />;
    }
  };

  // Filter resources based on search text
  const filteredGovtWebsites = govtTaxWebsites.filter(resource => 
    resource.name.toLowerCase().includes(filterText.toLowerCase()) || 
    resource.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // const filteredTaxTools = taxToolsAndCalculators.filter(resource => 
  //   resource.name.toLowerCase().includes(filterText.toLowerCase()) || 
  //   resource.description.toLowerCase().includes(filterText.toLowerCase())
  // ); // Removed unused variable

  // const filteredInfoResources = taxInformationResources.filter(resource => 
  //   resource.name.toLowerCase().includes(filterText.toLowerCase()) || 
  //   resource.description.toLowerCase().includes(filterText.toLowerCase())
  // ); // Removed unused variable
  
  // Get the tax slabs based on selected year
  const getSelectedTaxSlabs = () => {
    if (selectedTaxYear === "2025-26") {
      return taxSlabs2025_26;
    }
    return taxSlabs2024_25;
  };

  // Define tax slabs for different person types for AY 2025-26
  const companySlabs = [
    { incomeFrom: 0, incomeTo: null, taxRate: 30, description: "Flat rate for domestic companies (turnover > ₹400 crore)" },
    { incomeFrom: 0, incomeTo: null, taxRate: 25, description: "For domestic companies with turnover ≤ ₹400 crore in FY 2022-23" },
    { incomeFrom: 0, incomeTo: null, taxRate: 22, description: "Optional rate under section 115BAA (plus 10% surcharge and 4% cess)" },
    { incomeFrom: 0, incomeTo: null, taxRate: 15, description: "For new manufacturing companies under section 115BAB (plus 10% surcharge and 4% cess)" }
  ];

  const foreignCompanySlabs = [
    { incomeFrom: 0, incomeTo: null, taxRate: 40, description: "Flat rate for all foreign companies (plus surcharge up to 5% and 4% cess)" }
  ];

  const firmSlabs = [
    { incomeFrom: 0, incomeTo: null, taxRate: 30, description: "Flat rate for firms and LLPs (plus 12% surcharge if income exceeds ₹1 crore and 4% cess)" }
  ];

  const aopSlabs = [
    { incomeFrom: 0, incomeTo: null, taxRate: 30, description: "Flat rate for Association of Persons (AOP) and Body of Individuals (BOI) (plus applicable surcharge and 4% cess)" }
  ];

  // Get regime based on selected option
  const getTaxRegime = () => {
    const slabs = getSelectedTaxSlabs();
    let regime;
    
    if (selectedRegime === "new") {
      regime = slabs.regimes.find(r => r.name === "New Tax Regime");
    } else if (selectedRegime === "old") {
      regime = slabs.regimes.find(r => r.name === "Old Tax Regime");
    } else {
      regime = slabs.regimes[0];
    }
    
    // Create a deep copy of the selected regime
    const customRegime = JSON.parse(JSON.stringify(regime));
    
    // Override slabs based on person type
    if (selectedPersonType !== 'individual' && selectedPersonType !== 'huf') {
      if (selectedPersonType === 'company') {
        customRegime.slabs = companySlabs;
        customRegime.name = "Domestic Company Tax Rates";
        customRegime.description = "Tax rates applicable to domestic companies based on their turnover and other criteria.";
      } else if (selectedPersonType === 'foreign') {
        customRegime.slabs = foreignCompanySlabs;
        customRegime.name = "Foreign Company Tax Rates";
        customRegime.description = "Tax rates applicable to foreign companies operating in India.";
      } else if (selectedPersonType === 'firm') {
        customRegime.slabs = firmSlabs;
        customRegime.name = "Firm/LLP Tax Rates";
        customRegime.description = "Tax rates applicable to partnership firms and Limited Liability Partnerships (LLPs).";
      } else if (selectedPersonType === 'aop') {
        customRegime.slabs = aopSlabs;
        customRegime.name = "AOP/BOI Tax Rates";
        customRegime.description = "Tax rates applicable to Association of Persons (AOP) and Body of Individuals (BOI).";
      }
    } else if (selectedPersonType === 'huf') {
      // HUF follows the same tax slabs as individuals
      customRegime.name = "HUF Tax Rates";
      customRegime.description = "Tax rates applicable to Hindu Undivided Family (HUF), which follow the same slabs as individuals.";
    }
    
    return customRegime;
  };

  const selectedTaxRegime = getTaxRegime();

  // Filter tax deadlines based on selected category
  const getFilteredDeadlines = () => {
    const allDeadlines = [...currentTaxDeadlines, ...previousTaxDeadlines];
    
    if (selectedDeadlineCategory === 'all') {
      return allDeadlines;
    } else if (selectedDeadlineCategory === 'upcoming') {
      // Filter for upcoming deadlines (based on current date)
      const currentDate = new Date();
      return currentTaxDeadlines.filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        return deadlineDate > currentDate;
      });
    } else {
      // Filter by category (filing, payment, verification)
      return allDeadlines.filter(deadline => 
        deadline.category === selectedDeadlineCategory
      );
    }
  };

  const filteredDeadlines = getFilteredDeadlines();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tax Resources</h1>
        <p className="text-muted-foreground">
          Comprehensive tax resources, government websites, and tax slabs information
        </p>
      </div>

      {/* Mobile Accordion - Shown only on mobile */}
      <div className="md:hidden mb-8">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="govt-websites">
            <AccordionTrigger className="text-base font-medium">
              <Landmark className="mr-2 h-5 w-5" /> Government Websites
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader className="py-4">
                  <Input
                    placeholder="Search resources..."
                    className="w-full"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Card for the new AY 2023-24 Guide */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <FileText className="mr-2" size={18} />
                          <span className="flex-1">How to File ITR Online (AY 2023-24)</span>
                        </CardTitle>
                        <div className="flex justify-between items-center">
                          <Badge variant="default">Guide</Badge>
                          <Badge variant="secondary">Archived</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">A guide to filing your Income Tax Return online for the Assessment Year 2023-24.</p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="/tax-resources/how-to-file-itr-online-2023-24">
                            View Guide <ExternalLink className="ml-2" size={14} />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {filteredGovtWebsites.map((resource, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            {resource.icon ? renderIcon(resource.icon) : <ExternalLink className="mr-2" size={18} />}
                            <span className="flex-1">{resource.name}</span>
                          </CardTitle>
                          <div className="flex justify-between items-center">
                            <Badge variant={resource.isOfficial ? "default" : "outline"}>
                              {resource.isOfficial ? "Official" : "Unofficial"}
                            </Badge>
                            <Badge variant="secondary">{resource.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Visit Website <ExternalLink className="ml-2" size={14} />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>



          <AccordionItem value="tax-slabs">
            <AccordionTrigger className="text-base font-medium">
              <Calculator className="mr-2 h-5 w-5" /> Tax Slabs
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Assessment Year</label>
                      <select 
                        className="p-2 rounded border bg-background shadow-sm"
                        value={selectedTaxYear}
                        onChange={(e) => setSelectedTaxYear(e.target.value)}
                      >
                        <option value="2024-25">2024-25</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2026-27">2026-27</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tax Regime</label>
                      <select 
                        className="p-2 rounded border bg-background shadow-sm"
                        value={selectedRegime}
                        onChange={(e) => setSelectedRegime(e.target.value)}
                      >
                        <option value="new">New Tax Regime</option>
                        <option value="old">Old Tax Regime</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Person Type</label>
                      <select 
                        className="p-2 rounded border bg-background shadow-sm"
                        value={selectedPersonType}
                        onChange={(e) => setSelectedPersonType(e.target.value)}
                      >
                        <option value="individual">Individual</option>
                        <option value="huf">HUF (Hindu Undivided Family)</option>
                        <option value="company">Domestic Company</option>
                        <option value="foreign">Foreign Company</option>
                        <option value="firm">Firm/LLP</option>
                        <option value="aop">AOP/BOI</option>
                      </select>
                    </div>
                    {selectedPersonType === 'individual' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Age Group</label>
                        <select 
                          className="p-2 rounded border bg-background shadow-sm"
                          value={selectedAgeGroup}
                          onChange={(e) => setSelectedAgeGroup(e.target.value)}
                          disabled={selectedRegime === 'new'}
                        >
                          <option value="below60">Below 60 years</option>
                          <option value="60to80">60 to 80 years</option>
                          <option value="above80">Above 80 years</option>
                        </select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table className="mt-4">
                    <TableCaption>Tax slabs for Assessment Year {selectedTaxYear}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/5">Income Range</TableHead>
                        <TableHead className="w-1/5">Tax Rate</TableHead>
                        <TableHead className="w-3/5">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTaxRegime.slabs.map((slab: TaxSlab, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-semibold">
                            {slab.incomeFrom === 0 
                              ? (slab.incomeTo === null ? 'Any income' : `Up to ${formatIndianCurrency(slab.incomeTo)}`) 
                              : (slab.incomeTo === null 
                                  ? `Above ${formatIndianCurrency(slab.incomeFrom)}` 
                                  : `${formatIndianCurrency(slab.incomeFrom)} - ${formatIndianCurrency(slab.incomeTo)}`
                                )
                            }
                          </TableCell>
                          <TableCell className="font-semibold">{slab.taxRate}%</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{slab.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Additional info for the regime */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{selectedTaxRegime.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedTaxRegime.description}</p>
                    </div>
                    
                    {selectedTaxRegime.cess > 0 && (
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                          <h4 className="font-semibold">Health and Education Cess</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          A {selectedTaxRegime.cess}% health and education cess is applicable on the amount of income tax.
                        </p>
                      </div>
                    )}
                    
                    {selectedTaxRegime.surcharge && Object.keys(selectedTaxRegime.surcharge).length > 0 && (
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                          <h4 className="font-semibold">Surcharge</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Surcharge is applicable at the following rates based on income:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {(selectedTaxRegime.surcharge ? Object.entries(selectedTaxRegime.surcharge) : []).map(([threshold, rateValue], index: number) => {
                            const rate = rateValue as number; // Ensure rate is treated as a number
                            return (
                              <li key={index}>
                                {rate}% for income above ₹{parseInt(threshold).toLocaleString('en-IN')}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {selectedTaxRegime.deductions && selectedTaxRegime.deductions.length > 0 && (
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                          <h4 className="font-semibold">Allowed Deductions</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                          {selectedTaxRegime.deductions.map((deduction: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              {deduction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tax-deadlines">
            <AccordionTrigger className="text-base font-medium">
              <Calendar className="mr-2 h-5 w-5" /> Tax Deadlines
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <Select
                    value={selectedDeadlineCategory}
                    onValueChange={setSelectedDeadlineCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Deadlines</SelectItem>
                      <SelectItem value="upcoming">Upcoming Deadlines</SelectItem>
                      <SelectItem value="filing">Filing Deadlines</SelectItem>
                      <SelectItem value="payment">Payment Deadlines</SelectItem>
                      <SelectItem value="verification">Verification Deadlines</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDeadlines.map((deadline, index) => (
                      <Card key={index} className={`border-l-4 ${deadline.isHighPriority ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{deadline.title}</CardTitle>
                            <Badge className={deadline.isHighPriority ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                              {deadline.isHighPriority ? 'High Priority' : deadline.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{deadline.date}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{deadline.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {deadline.applicableTo.map((entity, i) => (
                              <Badge key={i} variant="outline">{entity}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tax-guide">
            <AccordionTrigger className="text-base font-medium">
              <BookOpenCheck className="mr-2 h-5 w-5" /> Tax Guide
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="basics-of-income-tax">
                      <AccordionTrigger>Basics of Income Tax</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-red-500 font-bold text-lg p-4">DEBUG MESSAGE: Mobile View - Basics of Income Tax Accordion Content</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="income-and-deductions">
                      <AccordionTrigger>Understanding Your Income & Deductions</AccordionTrigger>
                      <AccordionContent>
                        <IncomeAndDeductionsGuide />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="itr-filing-process">
                      <AccordionTrigger>The ITR Filing Process</AccordionTrigger>
                      <AccordionContent>
                        <ITRFilingProcessGuide />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="post-filing-essentials">
                      <AccordionTrigger>Post-Filing Essentials</AccordionTrigger>
                      <AccordionContent>
                        <PostFilingEssentialsGuide />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop Tabs - Hidden on Mobile */}
      <div className="hidden md:block">
        <Tabs defaultValue="govt-websites" className="mb-8">
          <TabsList className="w-full">
            <TabsTrigger value="govt-websites">Government Websites</TabsTrigger>
            <TabsTrigger value="tax-slabs">Tax Slabs</TabsTrigger>
            <TabsTrigger value="tax-deadlines">Tax Deadlines</TabsTrigger>
            <TabsTrigger value="tax-guide">Tax Guide</TabsTrigger>
          </TabsList>
          
          {/* Government Websites Tab */}
          <TabsContent value="govt-websites">
            <Card>
              <CardHeader className="py-4">
                <Input
                  placeholder="Search resources..."
                  className="w-full"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card for the new AY 2023-24 Guide */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="mr-2" size={18} />
                        <span className="flex-1">How to File ITR Online (AY 2023-24)</span>
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <Badge variant="default">Guide</Badge>
                        <Badge variant="secondary">Archived</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">A guide to filing your Income Tax Return online for the Assessment Year 2023-24.</p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/tax-resources/how-to-file-itr-online-2023-24">
                          View Guide <ExternalLink className="ml-2" size={14} />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {filteredGovtWebsites.map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          {resource.icon ? renderIcon(resource.icon) : <ExternalLink className="mr-2" size={18} />}
                          <span className="flex-1">{resource.name}</span>
                        </CardTitle>
                        <div className="flex justify-between items-center">
                          <Badge variant={resource.isOfficial ? "default" : "outline"}>
                            {resource.isOfficial ? "Official" : "Unofficial"}
                          </Badge>
                          <Badge variant="secondary">{resource.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Visit Website <ExternalLink className="ml-2" size={14} />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Tax Slabs Tab */}
          <TabsContent value="tax-slabs">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assessment Year</label>
                    <select 
                      className="p-2 rounded border bg-background shadow-sm"
                      value={selectedTaxYear}
                      onChange={(e) => setSelectedTaxYear(e.target.value)}
                    >
                      <option value="2024-25">2024-25</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2026-27">2026-27</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax Regime</label>
                    <select 
                      className="p-2 rounded border bg-background shadow-sm"
                      value={selectedRegime}
                      onChange={(e) => setSelectedRegime(e.target.value)}
                    >
                      <option value="new">New Tax Regime</option>
                      <option value="old">Old Tax Regime</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Person Type</label>
                    <select 
                      className="p-2 rounded border bg-background shadow-sm"
                      value={selectedPersonType}
                      onChange={(e) => setSelectedPersonType(e.target.value)}
                    >
                      <option value="individual">Individual</option>
                      <option value="huf">HUF (Hindu Undivided Family)</option>
                      <option value="company">Domestic Company</option>
                      <option value="foreign">Foreign Company</option>
                      <option value="firm">Firm/LLP</option>
                      <option value="aop">AOP/BOI</option>
                    </select>
                  </div>
                  {selectedPersonType === 'individual' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Age Group</label>
                      <select 
                        className="p-2 rounded border bg-background shadow-sm"
                        value={selectedAgeGroup}
                        onChange={(e) => setSelectedAgeGroup(e.target.value)}
                        disabled={selectedRegime === 'new'}
                      >
                        <option value="below60">Below 60 years</option>
                        <option value="60to80">60 to 80 years</option>
                        <option value="above80">Above 80 years</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table className="mt-4">
                  <TableCaption>Tax slabs for Assessment Year {selectedTaxYear}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Income Range</TableHead>
                      <TableHead className="w-1/5">Tax Rate</TableHead>
                      <TableHead className="w-3/5">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTaxRegime.slabs.map((slab: TaxSlab, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          {slab.incomeFrom === 0 
                            ? (slab.incomeTo === null ? 'Any income' : `Up to ${formatIndianCurrency(slab.incomeTo)}`) 
                            : (slab.incomeTo === null 
                                ? `Above ${formatIndianCurrency(slab.incomeFrom)}` 
                                : `${formatIndianCurrency(slab.incomeFrom)} - ${formatIndianCurrency(slab.incomeTo)}`
                              )
                          }
                        </TableCell>
                        <TableCell className="font-semibold">{slab.taxRate}%</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{slab.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Additional info for the regime */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedTaxRegime.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTaxRegime.description}</p>
                  </div>
                  
                  {selectedTaxRegime.cess > 0 && (
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                        <h4 className="font-semibold">Health and Education Cess</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A {selectedTaxRegime.cess}% health and education cess is applicable on the amount of income tax.
                      </p>
                    </div>
                  )}
                  
                  {selectedTaxRegime.surcharge && Object.keys(selectedTaxRegime.surcharge).length > 0 && (
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                        <h4 className="font-semibold">Surcharge</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Surcharge is applicable at the following rates based on income:
                      </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {(selectedTaxRegime.surcharge ? Object.entries(selectedTaxRegime.surcharge) : []).map(([threshold, rateValue], index: number) => {
                            const rate = rateValue as number; // Ensure rate is treated as a number
                            return (
                              <li key={index}>
                                {rate}% for income above ₹{parseInt(threshold).toLocaleString('en-IN')}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {selectedTaxRegime.deductions && selectedTaxRegime.deductions.length > 0 && (
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                          <h4 className="font-semibold">Allowed Deductions</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                          {selectedTaxRegime.deductions.map((deduction: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              {deduction}
                            </li>
                          ))}
                        </ul>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Deadlines Tab */}
          <TabsContent value="tax-deadlines">
            <Card>
              <CardHeader>
                <Select
                  value={selectedDeadlineCategory}
                  onValueChange={setSelectedDeadlineCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deadlines</SelectItem>
                    <SelectItem value="upcoming">Upcoming Deadlines</SelectItem>
                    <SelectItem value="filing">Filing Deadlines</SelectItem>
                    <SelectItem value="payment">Payment Deadlines</SelectItem>
                    <SelectItem value="verification">Verification Deadlines</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDeadlines.map((deadline, index) => (
                    <Card key={index} className={`border-l-4 ${deadline.isHighPriority ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{deadline.title}</CardTitle>
                          <Badge className={deadline.isHighPriority ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                            {deadline.isHighPriority ? 'High Priority' : deadline.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{deadline.date}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{deadline.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {deadline.applicableTo.map((entity, i) => (
                            <Badge key={i} variant="outline">{entity}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Guide Tab */}
          <TabsContent value="tax-guide">
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="basics-of-income-tax">
                    <AccordionTrigger>Basics of Income Tax</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-red-500 font-bold text-lg p-4">DEBUG MESSAGE: Desktop View - Basics of Income Tax Accordion Content</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="income-and-deductions">
                    <AccordionTrigger>Understanding Your Income & Deductions</AccordionTrigger>
                    <AccordionContent>
                      <IncomeAndDeductionsGuide />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itr-filing-process">
                    <AccordionTrigger>The ITR Filing Process</AccordionTrigger>
                    <AccordionContent>
                      <ITRFilingProcessGuide />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="post-filing-essentials">
                    <AccordionTrigger>Post-Filing Essentials</AccordionTrigger>
                    <AccordionContent>
                      <PostFilingEssentialsGuide />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxResources;
