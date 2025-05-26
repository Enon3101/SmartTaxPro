import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Info,
  Lightbulb,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DueDates = () => {
  const [dueDatesYear, setDueDatesYear] = useState('2025-26');
  const [dueDateFilter, setDueDateFilter] = useState('all');
  
  // Current tax deadlines for AY 2025-26
  const taxDeadlines2025_26 = [
    {
      date: '2025-06-15',
      deadline: 'June 15, 2025',
      description: 'Due date for first installment of advance tax (15% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2025-07-31',
      deadline: 'July 31, 2025',
      description: 'Due date for filing Income Tax Return for individuals and non-audit cases',
      category: 'filing',
      applies_to: ['Individuals', 'HUFs'],
      penalty: 'Late filing fees under Section 234F (₹5,000 or ₹1,000 for small taxpayers)',
      upcoming: true
    },
    {
      date: '2025-09-15',
      deadline: 'September 15, 2025',
      description: 'Due date for second installment of advance tax (45% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2025-09-30',
      deadline: 'September 30, 2025',
      description: 'Due date for filing Tax Audit Report under Section 44AB',
      category: 'audit',
      applies_to: ['Individuals with business income', 'Companies', 'Firms'],
      penalty: 'Penalty of 0.5% of turnover or ₹1.5 lakhs, whichever is less',
      upcoming: true
    },
    {
      date: '2025-10-31',
      deadline: 'October 31, 2025',
      description: 'Due date for filing ITR for taxpayers requiring audit',
      category: 'filing',
      applies_to: ['Individuals with business income', 'Companies', 'Firms'],
      penalty: 'Late filing fees under Section 234F (₹5,000 or ₹1,000 for small taxpayers)',
      upcoming: true
    },
    {
      date: '2025-11-30',
      deadline: 'November 30, 2025',
      description: 'Due date for filing ITR for taxpayers with international transactions',
      category: 'filing',
      applies_to: ['Entities with international transactions'],
      penalty: 'Late filing fees under Section 234F plus additional penalties for transfer pricing violations',
      upcoming: true
    },
    {
      date: '2025-12-15',
      deadline: 'December 15, 2025',
      description: 'Due date for third installment of advance tax (75% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2025-12-31',
      deadline: 'December 31, 2025',
      description: 'Last date for filing belated ITR with penalty',
      category: 'filing',
      applies_to: ['All taxpayers'],
      penalty: 'Late filing fees of ₹5,000 (₹1,000 for small taxpayers)',
      upcoming: true
    },
    {
      date: '2026-03-15',
      deadline: 'March 15, 2026',
      description: 'Due date for final installment of advance tax (100% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2026-03-31',
      deadline: 'March 31, 2026',
      description: 'Absolute final date for filing belated or revised returns for AY 2025-26',
      category: 'filing',
      applies_to: ['All taxpayers'],
      penalty: 'Late filing fees of ₹10,000 (₹1,000 for small taxpayers)',
      upcoming: true
    }
  ];
  
  // Current tax deadlines for AY 2024-25
  const taxDeadlines2024_25 = [
    {
      date: '2024-06-15',
      deadline: 'June 15, 2024',
      description: 'Due date for first installment of advance tax (15% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: false
    },
    {
      date: '2024-07-31',
      deadline: 'July 31, 2024',
      description: 'Due date for filing Income Tax Return for individuals and non-audit cases',
      category: 'filing',
      applies_to: ['Individuals', 'HUFs'],
      penalty: 'Late filing fees under Section 234F (₹5,000 or ₹1,000 for small taxpayers)',
      upcoming: false
    },
    {
      date: '2024-09-15',
      deadline: 'September 15, 2024',
      description: 'Due date for second installment of advance tax (45% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: false
    },
    {
      date: '2024-09-30',
      deadline: 'September 30, 2024',
      description: 'Due date for filing Tax Audit Report under Section 44AB',
      category: 'audit',
      applies_to: ['Individuals with business income', 'Companies', 'Firms'],
      penalty: 'Penalty of 0.5% of turnover or ₹1.5 lakhs, whichever is less',
      upcoming: false
    },
    {
      date: '2024-10-31',
      deadline: 'October 31, 2024',
      description: 'Due date for filing ITR for taxpayers requiring audit',
      category: 'filing',
      applies_to: ['Individuals with business income', 'Companies', 'Firms'],
      penalty: 'Late filing fees under Section 234F (₹5,000 or ₹1,000 for small taxpayers)',
      upcoming: true
    },
    {
      date: '2024-11-30',
      deadline: 'November 30, 2024',
      description: 'Due date for filing ITR for taxpayers with international transactions',
      category: 'filing',
      applies_to: ['Entities with international transactions'],
      penalty: 'Late filing fees under Section 234F plus additional penalties for transfer pricing violations',
      upcoming: true
    },
    {
      date: '2024-12-15',
      deadline: 'December 15, 2024',
      description: 'Due date for third installment of advance tax (75% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2024-12-31',
      deadline: 'December 31, 2024',
      description: 'Last date for filing belated ITR with penalty',
      category: 'filing',
      applies_to: ['All taxpayers'],
      penalty: 'Late filing fees of ₹5,000 (₹1,000 for small taxpayers)',
      upcoming: true
    },
    {
      date: '2025-03-15',
      deadline: 'March 15, 2025',
      description: 'Due date for final installment of advance tax (100% of estimated tax)',
      category: 'payment',
      applies_to: ['Individuals', 'Businesses'],
      penalty: 'Interest under Section 234C at 1% per month on the shortfall amount',
      upcoming: true
    },
    {
      date: '2025-03-31',
      deadline: 'March 31, 2025',
      description: 'Absolute final date for filing belated or revised returns for AY 2024-25',
      category: 'filing',
      applies_to: ['All taxpayers'],
      penalty: 'Late filing fees of ₹10,000 (₹1,000 for small taxpayers)',
      upcoming: true
    }
  ];
  
  // Get tax deadlines based on the selected year and filter
  const getFilteredDeadlines = () => {
    const selectedDeadlines = dueDatesYear === '2025-26' ? taxDeadlines2025_26 : taxDeadlines2024_25;
    
    if (dueDateFilter === 'all') {
      return selectedDeadlines;
    } else if (dueDateFilter === 'upcoming') {
      return selectedDeadlines.filter(deadline => deadline.upcoming);
    } else {
      return selectedDeadlines.filter(deadline => deadline.category === dueDateFilter);
    }
  };
  
  const filteredDeadlines = getFilteredDeadlines();
  
  // Calculate days remaining for upcoming deadlines
  const calculateDaysRemaining = (dateStr: string) => {
    const currentDate = new Date();
    const deadlineDate = new Date(dateStr);
    
    // Calculate time difference in milliseconds
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    
    // Convert to days
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysRemaining > 0 ? daysRemaining : 0;
  };
  
  // Generate badge color based on days remaining
  const getBadgeVariant = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "destructive";
    if (daysRemaining <= 7) return "destructive";
    if (daysRemaining <= 30) return "warning";
    return "outline";
  };
  
  // Regular tax compliance requirements
  const regularCompliance = [
    {
      title: "TDS Payment",
      frequency: "Monthly",
      deadline: "7th of the following month",
      applicability: "Employers, businesses deducting TDS",
      penalty: "Interest at 1.5% per month plus penalty of ₹200 per day (maximum to tax amount)"
    },
    {
      title: "TDS Return (Form 24Q/26Q)",
      frequency: "Quarterly",
      deadline: "31st July, 31st Oct, 31st Jan, 31st May",
      applicability: "All TDS deductors",
      penalty: "₹200 per day until filed, subject to TDS amount"
    },
    {
      title: "GST Return (GSTR-1)",
      frequency: "Monthly/Quarterly",
      deadline: "11th/13th of the following month/quarter",
      applicability: "GST registered businesses",
      penalty: "₹50 per day (maximum ₹10,000)"
    },
    {
      title: "GST Return (GSTR-3B)",
      frequency: "Monthly/Quarterly",
      deadline: "20th of the following month",
      applicability: "GST registered businesses",
      penalty: "Interest at 18% per annum on tax amount"
    },
    {
      title: "PF/ESI Payment",
      frequency: "Monthly",
      deadline: "15th of the following month",
      applicability: "Employers with PF/ESI registration",
      penalty: "Interest at 12% per annum plus damages up to 27% per year"
    },
    {
      title: "Professional Tax",
      frequency: "Monthly/Quarterly",
      deadline: "Varies by state",
      applicability: "Employers in states with professional tax",
      penalty: "Interest at 1-2% per month plus penalties"
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tax-resources">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tax Resources
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Updated for AY 2025-26</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Income Tax Due Dates & Deadlines
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive calendar of tax filing, payment, and compliance deadlines for Assessment Year 2025-26
          </p>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assessment Year</label>
                <Select value={dueDatesYear} onValueChange={setDueDatesYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-26">2025-26 (FY 2024-25)</SelectItem>
                    <SelectItem value="2024-25">2024-25 (FY 2023-24)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Deadlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deadlines</SelectItem>
                    <SelectItem value="upcoming">Upcoming Deadlines</SelectItem>
                    <SelectItem value="filing">Filing Deadlines</SelectItem>
                    <SelectItem value="payment">Payment Deadlines</SelectItem>
                    <SelectItem value="audit">Audit Deadlines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button asChild>
                <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Start Filing Your Return
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="calendar">Tax Calendar</TabsTrigger>
            <TabsTrigger value="compliance">Regular Compliance</TabsTrigger>
            <TabsTrigger value="penalties">Penalties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Income Tax Deadlines for AY {dueDatesYear}
              </h2>
              
              {filteredDeadlines.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <HelpCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No deadlines match the selected filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[130px]">Due Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[180px]">Applies To</TableHead>
                        <TableHead className="w-[150px] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeadlines.map((deadline, index) => {
                        const daysRemaining = calculateDaysRemaining(deadline.date);
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {deadline.deadline}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{deadline.description}</span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  Category: {deadline.category === 'filing' ? 'ITR Filing' : 
                                             deadline.category === 'payment' ? 'Tax Payment' : 
                                             deadline.category === 'audit' ? 'Tax Audit' : 'Other'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {deadline.applies_to.map((entity, i) => (
                                  <Badge variant="outline" key={i} className="text-xs">
                                    {entity}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {daysRemaining > 0 ? (
                                <Badge variant={getBadgeVariant(daysRemaining)} className="ml-auto">
                                  {daysRemaining} days remaining
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-slate-200 text-slate-700 ml-auto">
                                  Passed
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Extensions & Changes</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The Income Tax Department may extend certain deadlines through notifications. Always check the official Income Tax portal for the latest updates on due dates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Tax Compliance Timeline</h2>
              <p className="text-muted-foreground">Key dates throughout the financial year for comprehensive tax compliance</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">April - June</CardTitle>
                      <Badge>Q1</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">April 30, 2025</span>
                          <p className="text-xs text-muted-foreground">Due date for employers to issue Form 16 to employees</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">May 31, 2025</span>
                          <p className="text-xs text-muted-foreground">Due date for filing TDS return for Q4 of previous FY</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">June 15, 2025</span>
                          <p className="text-xs text-muted-foreground">First installment of advance tax (15%)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">June 30, 2025</span>
                          <p className="text-xs text-muted-foreground">Link Aadhaar with PAN (if not already done)</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">July - September</CardTitle>
                      <Badge>Q2</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">July 31, 2025</span>
                          <p className="text-xs text-muted-foreground">ITR filing for non-audit cases & TDS return for Q1</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">September 15, 2025</span>
                          <p className="text-xs text-muted-foreground">Second installment of advance tax (45%)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">September 30, 2025</span>
                          <p className="text-xs text-muted-foreground">Due date for tax audit report filing</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">October - December</CardTitle>
                      <Badge>Q3</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">October 31, 2025</span>
                          <p className="text-xs text-muted-foreground">ITR filing for audit cases & TDS return for Q2</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">November 30, 2025</span>
                          <p className="text-xs text-muted-foreground">ITR filing for international transactions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">December 15, 2025</span>
                          <p className="text-xs text-muted-foreground">Third installment of advance tax (75%)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">December 31, 2025</span>
                          <p className="text-xs text-muted-foreground">Last date for belated ITR with penalty</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">January - March</CardTitle>
                      <Badge>Q4</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">January 31, 2026</span>
                          <p className="text-xs text-muted-foreground">TDS return for Q3</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">March 15, 2026</span>
                          <p className="text-xs text-muted-foreground">Final installment of advance tax (100%)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">March 31, 2026</span>
                          <p className="text-xs text-muted-foreground">Absolute final date for belated or revised returns</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">March 31, 2026</span>
                          <p className="text-xs text-muted-foreground">Last date for tax-saving investments for FY 2025-26</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mt-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Importance of Timely Compliance</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Missing tax deadlines can result in penalties, interest charges, and increased scrutiny from the tax department. 
                      Set reminders for these key dates and begin preparations well in advance to ensure timely compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Regular Tax Compliance Requirements
              </h2>
              <p className="text-muted-foreground">
                Beyond annual ITR filing, businesses and certain individuals must comply with various periodic tax requirements
              </p>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[130px]">Compliance Type</TableHead>
                      <TableHead className="min-w-[100px]">Frequency</TableHead>
                      <TableHead className="min-w-[180px]">Due Date</TableHead>
                      <TableHead className="min-w-[150px]">Applies To</TableHead>
                      <TableHead className="min-w-[200px]">Penalty for Non-Compliance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regularCompliance.map((compliance, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {compliance.title}
                        </TableCell>
                        <TableCell>
                          {compliance.frequency}
                        </TableCell>
                        <TableCell>
                          {compliance.deadline}
                        </TableCell>
                        <TableCell>
                          {compliance.applicability}
                        </TableCell>
                        <TableCell className="text-sm">
                          {compliance.penalty}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      For Employers/Businesses
                    </CardTitle>
                    <CardDescription>
                      Key compliance requirements for business entities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium">TDS Compliance</h4>
                      <ul className="space-y-1 text-sm list-disc ml-5">
                        <li>Deduct TDS at the time of payment or credit, whichever is earlier</li>
                        <li>Deposit TDS by 7th of the next month (30th for March)</li>
                        <li>Issue TDS certificates (Form 16/16A) within prescribed time limits</li>
                        <li>File quarterly TDS returns (24Q, 26Q, etc.) by due dates</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-medium">GST Compliance</h4>
                      <ul className="space-y-1 text-sm list-disc ml-5">
                        <li>File GSTR-1 (outward supplies) by 11th/13th of following month/quarter</li>
                        <li>File GSTR-3B (summary return) by 20th of following month</li>
                        <li>Maintain proper GST records for at least 72 months</li>
                        <li>Reconcile ITC claims with vendor details regularly</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Compliance Best Practices
                    </CardTitle>
                    <CardDescription>
                      Strategies to ensure timely tax compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium">Calendar Management</h4>
                      <ul className="space-y-1 text-sm list-disc ml-5">
                        <li>Create a tax compliance calendar with all due dates</li>
                        <li>Set reminders at least 7-10 days before deadlines</li>
                        <li>Assign responsibilities for each compliance task</li>
                        <li>Review compliance status weekly/monthly</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-medium">Documentation & Systems</h4>
                      <ul className="space-y-1 text-sm list-disc ml-5">
                        <li>Maintain organized record-keeping systems</li>
                        <li>Implement proper accounting software for tax calculation</li>
                        <li>Conduct regular internal audits of tax compliance</li>
                        <li>Consider using automated compliance tools or services</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-2">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Professional Assistance</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      For businesses with complex tax obligations, engaging a professional tax consultant or chartered accountant 
                      is advisable to ensure full compliance with all applicable tax laws and regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="penalties" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Penalties for Non-Compliance
              </h2>
              <p className="text-muted-foreground">
                Understand the consequences of missing tax deadlines and non-compliance with tax regulations
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      ITR Filing Penalties
                    </CardTitle>
                    <CardDescription>Consequences of late filing or non-filing of returns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Late Filing Fee (Section 234F)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">₹5,000</span>
                            <p className="text-muted-foreground">If filed after due date but before December 31, 2025</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">₹10,000</span>
                            <p className="text-muted-foreground">If filed after December 31, 2025 but before March 31, 2026</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">₹1,000</span>
                            <p className="text-muted-foreground">For small taxpayers with income up to ₹5 lakhs</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Interest on Late Filing (Section 234A)</h3>
                      <p className="text-sm text-muted-foreground">
                        Interest at 1% per month or part thereof on the tax due, calculated from the due date 
                        to the actual date of filing.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Other Consequences</h3>
                      <ul className="space-y-1 text-sm list-disc ml-5">
                        <li>Cannot carry forward certain losses (except house property loss)</li>
                        <li>Notices and potential scrutiny from tax department</li>
                        <li>Difficulty in obtaining loans, visas, etc.</li>
                        <li>For persistent defaulters, prosecution under Section 276CC</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Tax Payment Penalties
                    </CardTitle>
                    <CardDescription>Consequences of delayed or non-payment of taxes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Interest on Delayed Payment (Section 234B)</h3>
                      <p className="text-sm text-muted-foreground">
                        Interest at 1% per month or part thereof on the tax due, when advance tax paid is 
                        less than 90% of the assessed tax.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Interest on Advance Tax Shortfall (Section 234C)</h3>
                      <p className="text-sm text-muted-foreground">
                        Interest at 1% per month for defaults in advance tax installments.
                      </p>
                      <ul className="space-y-1 text-xs list-disc ml-5 mt-1">
                        <li>For 1st installment (15%): 3 months interest if shortfall</li>
                        <li>For 2nd installment (45%): 3 months interest if shortfall</li>
                        <li>For 3rd installment (75%): 3 months interest if shortfall</li>
                        <li>For 4th installment (100%): 1 month interest if shortfall</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Penalty for Concealment (Section 270A)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">50% penalty</span>
                            <p className="text-muted-foreground">For under-reporting of income</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">200% penalty</span>
                            <p className="text-muted-foreground">For misreporting of income</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      TDS & Other Compliance Penalties
                    </CardTitle>
                    <CardDescription>Consequences of non-compliance with TDS and other tax provisions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">TDS Default Penalties</h3>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Interest @ 1.5% per month</span>
                              <p className="text-xs text-muted-foreground">For late deposit of TDS</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">₹200 per day</span>
                              <p className="text-xs text-muted-foreground">For late filing of TDS returns</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Disallowance of expense</span>
                              <p className="text-xs text-muted-foreground">30% of expense if TDS not deducted</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">GST Non-Compliance</h3>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Interest @ 18% per annum</span>
                              <p className="text-xs text-muted-foreground">For delayed tax payment</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Late fee (GSTR-1 & 3B)</span>
                              <p className="text-xs text-muted-foreground">₹50 per day (max ₹10,000)</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Penalty for tax evasion</span>
                              <p className="text-xs text-muted-foreground">100% of tax amount evaded</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Other Penalties</h3>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Tax Audit (44AB)</span>
                              <p className="text-xs text-muted-foreground">0.5% of turnover or ₹1.5 lakhs</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Transfer Pricing (92E)</span>
                              <p className="text-xs text-muted-foreground">₹1 lakh for non-compliance</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <XCircle className="h-2 w-2 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">Prosecution provisions</span>
                              <p className="text-xs text-muted-foreground">For severe non-compliance cases</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mt-4">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Prosecution in Extreme Cases</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            For severe tax defaults or evasion, the Income Tax Act provides for prosecution with imprisonment 
                            ranging from 3 months to 7 years, depending on the severity of the offense.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-4">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Voluntary Compliance Advisory</h4>
                    <p className="text-sm text-green-700 mt-1">
                      The best approach is to maintain voluntary compliance with all tax laws and regulations. 
                      This not only avoids penalties and interest but also prevents unwanted scrutiny from tax authorities. 
                      When in doubt, consult a tax professional or use our <Link href="/tax-expert" className="text-green-600 underline">Tax Expert Service</Link> 
                      to ensure full compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/tax-filing/itr-wizard" className="flex items-center gap-2">
              Start Filing Your Return <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DueDates;