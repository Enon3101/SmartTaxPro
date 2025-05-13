import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
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
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";
import { govtTaxWebsites, taxToolsAndCalculators, taxInformationResources } from "@/data/govtResources";
import { 
  taxSlabs2024_25, 
  taxSlabs2025_26, 
  seniorCitizenSlabs, 
  superSeniorCitizenSlabs 
} from "@/data/taxSlabs";
import { currentTaxDeadlines, previousTaxDeadlines } from "@/data/taxDeadlines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatIndianCurrency } from "@/lib/formatters";
import { useTheme } from "@/context/ThemeProvider";

const TaxResources = () => {
  const [selectedTaxYear, setSelectedTaxYear] = useState("2024-25");
  const [selectedRegime, setSelectedRegime] = useState("new");
  const [filterText, setFilterText] = useState("");
  const { theme } = useTheme();

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

  const filteredTaxTools = taxToolsAndCalculators.filter(resource => 
    resource.name.toLowerCase().includes(filterText.toLowerCase()) || 
    resource.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredInfoResources = taxInformationResources.filter(resource => 
    resource.name.toLowerCase().includes(filterText.toLowerCase()) || 
    resource.description.toLowerCase().includes(filterText.toLowerCase())
  );
  
  // Get the tax slabs based on selected year
  const getSelectedTaxSlabs = () => {
    if (selectedTaxYear === "2025-26") {
      return taxSlabs2025_26;
    }
    return taxSlabs2024_25;
  };

  // Get regime based on selected option
  const getTaxRegime = () => {
    const slabs = getSelectedTaxSlabs();
    if (selectedRegime === "new") {
      return slabs.regimes.find(r => r.name === "New Tax Regime");
    } else if (selectedRegime === "old") {
      return slabs.regimes.find(r => r.name === "Old Tax Regime");
    }
    return slabs.regimes[0];
  };

  const selectedTaxRegime = getTaxRegime();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tax Resources</h1>
        <p className="text-muted-foreground">
          Comprehensive tax resources, government websites, and tax slabs information
        </p>
      </div>

      <Tabs defaultValue="govt-websites" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="govt-websites">Government Websites</TabsTrigger>
          <TabsTrigger value="tools-calculators">Tools & Calculators</TabsTrigger>
          <TabsTrigger value="tax-slabs">Tax Slabs</TabsTrigger>
          <TabsTrigger value="tax-deadlines">Tax Deadlines</TabsTrigger>
        </TabsList>

        {/* Government Websites Tab */}
        <TabsContent value="govt-websites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Landmark className="mr-2" /> Official Government Tax Websites
              </CardTitle>
              <CardDescription>
                Authentic sources for tax information, filing, and services provided by the Government of India
              </CardDescription>
              <Input
                placeholder="Search resources..."
                className="max-w-sm mt-4"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Tools & Calculators Tab */}
        <TabsContent value="tools-calculators">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2" /> Tax Tools & Calculators
              </CardTitle>
              <CardDescription>
                Helpful tools, calculators, and utilities for tax planning and compliance
              </CardDescription>
              <Input
                placeholder="Search tools & calculators..."
                className="max-w-sm mt-4"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...filteredTaxTools, ...filteredInfoResources].map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        {resource.icon ? renderIcon(resource.icon) : <Calculator className="mr-2" size={18} />}
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
                          Access Tool <ExternalLink className="ml-2" size={14} />
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
              <CardTitle className="flex items-center">
                <Calculator className="mr-2" /> Income Tax Slabs
              </CardTitle>
              <CardDescription>
                Current income tax slabs and rates for different regimes in India
              </CardDescription>
              <div className="flex flex-wrap gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assessment Year</label>
                  <select 
                    className="p-2 rounded border bg-background"
                    value={selectedTaxYear}
                    onChange={(e) => setSelectedTaxYear(e.target.value)}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Regime</label>
                  <select 
                    className="p-2 rounded border bg-background"
                    value={selectedRegime}
                    onChange={(e) => setSelectedRegime(e.target.value)}
                  >
                    <option value="new">New Tax Regime</option>
                    <option value="old">Old Tax Regime</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTaxRegime && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{selectedTaxRegime.name}</h3>
                    <p className="text-muted-foreground mb-4">{selectedTaxRegime.description}</p>
                    
                    {selectedRegime === "new" && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-4 flex items-start">
                        <Lightbulb className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Default Regime</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            The new tax regime is the default option from FY 2023-24 onwards. You need to specifically opt for the old regime if you want to claim deductions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <Table>
                      <TableCaption>Income Tax Slabs for {selectedTaxRegime.name} (AY {selectedTaxYear})</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Income Range</TableHead>
                          <TableHead>Tax Rate</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTaxRegime.slabs.map((slab, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {formatIndianCurrency(slab.incomeFrom)} - {slab.incomeTo ? formatIndianCurrency(slab.incomeTo) : 'Above'}
                            </TableCell>
                            <TableCell>{slab.taxRate}%</TableCell>
                            <TableCell>{slab.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Surcharge Information */}
                  {selectedTaxRegime.surcharge && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2">Surcharge</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Income Threshold</TableHead>
                            <TableHead>Surcharge Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(selectedTaxRegime.surcharge).map(([threshold, rate], index) => (
                            <TableRow key={index}>
                              <TableCell>
                                Above {formatIndianCurrency(Number(threshold))}
                              </TableCell>
                              <TableCell>{rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Health & Education Cess */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Health & Education Cess</h4>
                    <p>4% on income tax + surcharge (if applicable)</p>
                  </div>

                  {/* Age-based Special Slabs */}
                  {selectedRegime === "old" && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Age-Based Special Slabs (Old Regime Only)</h3>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Senior Citizens (60-80 years)</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Income Range</TableHead>
                              <TableHead>Tax Rate</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {seniorCitizenSlabs.map((slab, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {formatIndianCurrency(slab.incomeFrom)} - {slab.incomeTo ? formatIndianCurrency(slab.incomeTo) : 'Above'}
                                </TableCell>
                                <TableCell>{slab.taxRate}%</TableCell>
                                <TableCell>{slab.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Super Senior Citizens (Above 80 years)</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Income Range</TableHead>
                              <TableHead>Tax Rate</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {superSeniorCitizenSlabs.map((slab, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {formatIndianCurrency(slab.incomeFrom)} - {slab.incomeTo ? formatIndianCurrency(slab.incomeTo) : 'Above'}
                                </TableCell>
                                <TableCell>{slab.taxRate}%</TableCell>
                                <TableCell>{slab.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* Allowed Deductions */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">Allowed Deductions</h3>
                    {selectedTaxRegime.deductions.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-1">
                        {selectedTaxRegime.deductions.map((deduction, index) => (
                          <li key={index}>{deduction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No deductions available in this regime.</p>
                    )}
                  </div>
                </>
              )}
              
              <div className="mt-8">
                <p className="text-sm text-muted-foreground">
                  Note: The above tax slabs are for reference only. For specific tax calculations based on your income, please use our 
                  <Link to="/calculators" className="text-primary font-medium ml-1">
                    Tax Calculators
                  </Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Deadlines Tab */}
        <TabsContent value="tax-deadlines">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" /> Tax Deadlines & Due Dates
              </CardTitle>
              <CardDescription>
                Important tax filing and payment deadlines for the current assessment year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Assessment Year 2025-26 (Financial Year 2024-25)</h3>
                
                <div className="space-y-8">
                  {/* Filing Deadlines */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FileText className="mr-2" size={20} /> Filing Deadlines
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Applicable To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTaxDeadlines
                            .filter(d => d.category === 'filing')
                            .map((deadline, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{deadline.date}</TableCell>
                                <TableCell>{deadline.description}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {deadline.applicableTo.map((item, i) => (
                                      <Badge key={i} variant="outline" className="mr-1">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Payment Deadlines */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <CreditCard className="mr-2" size={20} /> Payment Deadlines
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Applicable To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTaxDeadlines
                            .filter(d => d.category === 'payment')
                            .map((deadline, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{deadline.date}</TableCell>
                                <TableCell>{deadline.description}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {deadline.applicableTo.map((item, i) => (
                                      <Badge key={i} variant="outline" className="mr-1">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Other Important Deadlines */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <HelpCircle className="mr-2" size={20} /> Other Important Deadlines
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Applicable To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTaxDeadlines
                            .filter(d => d.category === 'verification' || d.category === 'other')
                            .map((deadline, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{deadline.date}</TableCell>
                                <TableCell>{deadline.description}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {deadline.applicableTo.map((item, i) => (
                                      <Badge key={i} variant="outline" className="mr-1">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Previous Assessment Year (2024-25)</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Applicable To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previousTaxDeadlines.map((deadline, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{deadline.date}</TableCell>
                          <TableCell>{deadline.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {deadline.applicableTo.map((item, i) => (
                                <Badge key={i} variant="outline" className="mr-1">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <div className="flex items-start">
                  <HelpCircle className="text-yellow-700 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Important Note</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Dates mentioned are subject to change by the Income Tax Department. Always verify the latest deadlines from the 
                      <a 
                        href="https://www.incometaxindia.gov.in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-medium ml-1 hover:underline"
                      >
                        official Income Tax website
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxResources;