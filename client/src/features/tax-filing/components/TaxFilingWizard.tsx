import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";



import { toast } from "@/hooks/use-toast";
import { useTaxFiling } from "@/hooks/useTaxFiling";
import { queryClient, apiRequest } from "@/lib/queryClient";
import FileUpload from "@/features/file-management/components/FileUpload";

import HelpResourcesCard from "@/components/cards/HelpResourcesCard";
import ProgressTracker from "@/components/cards/ProgressTracker";
import TaxSummaryCard from "@/components/cards/TaxSummaryCard";
import { TaxTipSidebar } from "@/components/cards/TaxTipSidebar";
import { StepIndicator } from "@/components/ItrWizard/StepIndicator";

// Define the schema for Form 16 (Indian salary income)
const form16Schema = z.object({
  employerName: z.string().min(1, "Employer name is required"),
  employerTAN: z.string().min(1, "Employer TAN is required"),
  employeePAN: z.string().min(1, "PAN is required"),
  grossSalary: z.string().min(1, "Gross salary is required"),
  exemptAllowances: z.string().optional(),
  professionalTax: z.string().optional(),
  tdsDeducted: z.string().min(1, "TDS deducted is required"),
});

// Schema for additional income sources in India
const additionalIncomeSchema = z.object({
  // Income type flags
  hasRentalIncome: z.boolean().default(false),
  hasCapitalGains: z.boolean().default(false),
  hasBusinessIncome: z.boolean().default(false),
  hasInterestIncome: z.boolean().default(false),
  hasDividendIncome: z.boolean().default(false),
  hasOtherIncome: z.boolean().default(false),

  // Property income fields
  housePropertyType: z.string().default("self-occupied"),
  annualRentReceived: z.string().optional(),
  municipalTaxes: z.string().optional(),
  homeLoanInterest: z.string().optional(),
  rentalIncome: z.string().optional(),
  
  // Capital gains fields
  shortTermCapitalGains: z.string().optional(),
  longTermCapitalGains: z.string().optional(),
  
  // Business income fields
  businessType: z.string().default("business"),
  businessIncome: z.string().optional(),
  businessExpenses: z.string().optional(),
  
  // Other income fields
  interestIncome: z.string().optional(),
  dividendIncome: z.string().optional(),
  otherSources: z.string().optional(),
});

// Combined schema for all income data
const incomeFormSchema = z.object({
  form16: form16Schema,
  additionalIncome: additionalIncomeSchema,
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

const TaxFilingWizard = () => {
  const { 
    currentStep, 
    setCurrentStep,
    updateIncome, 
    nextStep, 
    previousStep, 
    taxFormId,
    isLoading
  } = useTaxFiling();
  
  // Query to fetch existing tax form data if available
  const { data: taxFormData } = useQuery({
    queryKey: [`/api/tax-forms/${taxFormId}`],
    enabled: !!taxFormId,
  });

  // Initialize form with default values or existing data for Indian ITR
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: (taxFormData && taxFormData.incomeData) ? taxFormData.incomeData : {
      form16: {
        employerName: "",
        employerTAN: "",
        employeePAN: "",
        grossSalary: "",
        exemptAllowances: "",
        professionalTax: "",
        tdsDeducted: "",
      },
      additionalIncome: {
        hasRentalIncome: false,
        hasCapitalGains: false,
        hasBusinessIncome: false,
        hasInterestIncome: false,
        hasDividendIncome: false,
        hasOtherIncome: false,
        rentalIncome: "",
        shortTermCapitalGains: "",
        longTermCapitalGains: "",
        businessIncome: "",
        businessExpenses: "",
        interestIncome: "",
        dividendIncome: "",
        otherSources: "",
        housePropertyType: "self-occupied",
        annualRentReceived: "",
        municipalTaxes: "",
        homeLoanInterest: "",
        businessType: "business",
      },
    },
  });

  // Set up the mutation to save form data
  const saveMutation = useMutation({
    mutationFn: async (data: IncomeFormValues) => {
      return await apiRequest(
        `/api/tax-forms/${taxFormId}/income`,
        { method: "POST" },
        data
      );
    },
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your income information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tax-forms/${taxFormId}`] });
      nextStep();
    },
    onError: (error) => {
      toast({
        title: "Failed to save",
        description: error.message || "An error occurred while saving your information.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IncomeFormValues) => {
    // Format currency fields for API submission (remove commas)
    const formattedData = {
      form16: {
        ...data.form16,
        grossSalary: data.form16.grossSalary.replace(/,/g, ""),
        exemptAllowances: data.form16.exemptAllowances?.replace(/,/g, "") || "",
        professionalTax: data.form16.professionalTax?.replace(/,/g, "") || "",
        tdsDeducted: data.form16.tdsDeducted.replace(/,/g, ""),
      },
      additionalIncome: {
        ...data.additionalIncome,
        rentalIncome: data.additionalIncome.rentalIncome?.replace(/,/g, "") || "",
        shortTermCapitalGains: data.additionalIncome.shortTermCapitalGains?.replace(/,/g, "") || "",
        longTermCapitalGains: data.additionalIncome.longTermCapitalGains?.replace(/,/g, "") || "",
        businessIncome: data.additionalIncome.businessIncome?.replace(/,/g, "") || "",
        businessExpenses: data.additionalIncome.businessExpenses?.replace(/,/g, "") || "",
        businessType: data.additionalIncome.businessType || "business",
        interestIncome: data.additionalIncome.interestIncome?.replace(/,/g, "") || "",
        dividendIncome: data.additionalIncome.dividendIncome?.replace(/,/g, "") || "",
        otherSources: data.additionalIncome.otherSources?.replace(/,/g, "") || "",
        annualRentReceived: data.additionalIncome.annualRentReceived?.replace(/,/g, "") || "",
        municipalTaxes: data.additionalIncome.municipalTaxes?.replace(/,/g, "") || "",
        homeLoanInterest: data.additionalIncome.homeLoanInterest?.replace(/,/g, "") || "",
      }
    };
    
    updateIncome(formattedData);
    saveMutation.mutate(formattedData);
  };

  // Define your steps array for the wizard
  const steps = [
    { number: 1, title: "Personal Info", description: "Enter your details" },
    { number: 2, title: "Income", description: "Add your income" },
    { number: 3, title: "Deductions", description: "Claim deductions" },
    { number: 4, title: "Tax Paid", description: "Enter taxes paid" },
    { number: 5, title: "Review", description: "Review & submit" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your tax information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          File Your ITR for AY 2024-25
        </h1>
        <p className="text-muted-foreground">
          Complete all steps to file your income tax return.
        </p>
      </div>

      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={(stepNumber) => setCurrentStep(stepNumber)}
      />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <p className="text-muted-foreground mb-6">This step is already complete. Please proceed to the next step.</p>
                      
                      <div className="flex justify-end gap-2 mt-8">
                        <Button
                          type="button"
                          onClick={nextStep}
                        >
                          Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Income Sources */}
                  {currentStep === 2 && (
                    <>
                      {/* Form 16 Employment Income Section */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4">
                          <div className="flex items-center">
                            <span className="mr-2">Form 16 - Salary Income Details</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md p-4">
                                  <h4 className="font-medium mb-2">Form 16 Information</h4>
                                  <ul className="space-y-2 text-sm">
                                    <li><span className="font-medium">Form 16:</span> TDS certificate issued by your employer showing salary details and tax deducted</li>
                                    <li><span className="font-medium">TAN:</span> Tax Deduction and Collection Account Number of your employer</li>
                                    <li><span className="font-medium">Gross Salary:</span> Total salary earned before any deductions</li>
                                    <li><span className="font-medium">Exempt Allowances:</span> HRA, LTA, and other allowances exempt under Section 10</li>
                                    <li><span className="font-medium">Professional Tax:</span> Tax levied by state governments on profession, trade or employment</li>
                                    <li><span className="font-medium">TDS Deducted:</span> Tax deducted at source by your employer from your salary</li>
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </h3>

                        {/* Employer Information */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="form16.employerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employer Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="form16.employerTAN"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employer TAN</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="XXXX-X-XXXX-X"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-1 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="form16.employeePAN"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your PAN Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="XXXXX-XXXX-X"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Income Information */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="form16.grossSalary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Gross Salary
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      ₹
                                    </span>
                                    <Input
                                      {...field}
                                      className="pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="form16.exemptAllowances"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Exempt Allowances (HRA, LTA, etc.)
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      ₹
                                    </span>
                                    <Input
                                      {...field}
                                      className="pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="form16.professionalTax"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Professional Tax
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      ₹
                                    </span>
                                    <Input
                                      {...field}
                                      className="pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="form16.tdsDeducted"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  TDS Deducted
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      ₹
                                    </span>
                                    <Input
                                      {...field}
                                      className="pl-8"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Document Upload */}
                        <FileUpload 
                          documentType="Form 16"
                          taxFormId={taxFormId}
                        />
                      </div>

                      {/* Additional Income Sources */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <h3 className="text-lg font-medium mr-2">
                            Additional Income Sources
                          </h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md p-4">
                                <h4 className="font-medium mb-2">Income Sources Information</h4>
                                <ul className="space-y-2 text-sm">
                                  <li><span className="font-medium">Rental Income:</span> Income from renting out residential or commercial property</li>
                                  <li><span className="font-medium">Capital Gains:</span> Profit from selling assets like shares, property, mutual funds</li>
                                  <li><span className="font-medium">Business Income:</span> Income from running a business or profession</li>
                                  <li><span className="font-medium">Interest Income:</span> Interest earned from savings accounts, deposits, bonds</li>
                                  <li><span className="font-medium">Dividend Income:</span> Income received as dividends from shares or mutual funds</li>
                                  <li><span className="font-medium">Other Sources:</span> Agricultural income, lottery winnings, gifts, etc.</li>
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Income Checkboxes with Indian Income Types */}
                        <div className="grid sm:grid-cols-2 gap-3 mb-6">
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasRentalIncome"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_rental"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Income from House Property
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasBusinessIncome"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_business"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Business Income
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasCapitalGains"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_capital_gains"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Capital Gains
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasInterestIncome"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_interest"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Interest Income
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasDividendIncome"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_dividend"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Dividend Income
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalIncome.hasOtherIncome"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="income_other"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Other Income
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Rental Income Section */}
                        {form.watch("additionalIncome.hasRentalIncome") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Income from House Property</h4>
                            
                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.housePropertyType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a property type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="self-occupied">Self Occupied</SelectItem>
                                        <SelectItem value="let-out">Let Out (Rented)</SelectItem>
                                        <SelectItem value="deemed-let-out">Deemed Let Out</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {form.watch("additionalIncome.housePropertyType") !== "self-occupied" && (
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <FormField
                                  control={form.control}
                                  name="additionalIncome.annualRentReceived"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Annual Rent Received</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                            ₹
                                          </span>
                                          <Input
                                            {...field}
                                            className="pl-8"
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="additionalIncome.municipalTaxes"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Municipal Taxes Paid</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                            ₹
                                          </span>
                                          <Input
                                            {...field}
                                            className="pl-8"
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}

                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.homeLoanInterest"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Home Loan Interest Paid</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Document Upload for Rental Income */}
                            <FileUpload 
                              documentType="Rent Receipts/Agreement"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                        
                        {/* Capital Gains Section */}
                        {form.watch("additionalIncome.hasCapitalGains") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Capital Gains</h4>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.shortTermCapitalGains"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Short Term Capital Gains</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="additionalIncome.longTermCapitalGains"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Long Term Capital Gains</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Document Upload for Capital Gains */}
                            <FileUpload 
                              documentType="Capital Gains Documents"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                        
                        {/* Business Income Section */}
                        {form.watch("additionalIncome.hasBusinessIncome") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Business Income</h4>
                            
                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.businessType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type of Business</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a business type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="business">Business</SelectItem>
                                        <SelectItem value="profession">Profession</SelectItem>
                                        <SelectItem value="freelancing">Freelancing</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.businessIncome"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Gross Business Receipts</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="additionalIncome.businessExpenses"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Total Business Expenses</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Document Upload for Business Income */}
                            <FileUpload 
                              documentType="Business Income Documents"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                        
                        {/* Interest Income Section */}
                        {form.watch("additionalIncome.hasInterestIncome") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Interest Income</h4>

                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.interestIncome"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Interest from Saving Accounts/FDs/Bonds</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Document Upload for Interest Income */}
                            <FileUpload 
                              documentType="Interest Certificates"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                        
                        {/* Dividend Income Section */}
                        {form.watch("additionalIncome.hasDividendIncome") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Dividend Income</h4>

                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.dividendIncome"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dividend Income</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Document Upload for Dividend Income */}
                            <FileUpload 
                              documentType="Dividend Statements"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                        
                        {/* Other Income Section */}
                        {form.watch("additionalIncome.hasOtherIncome") && (
                          <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                            <h4 className="font-medium mb-3">Other Income</h4>

                            <div className="grid md:grid-cols-1 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name="additionalIncome.otherSources"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Income from Other Sources</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                          ₹
                                        </span>
                                        <Input
                                          {...field}
                                          className="pl-8"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            {/* Document Upload for Other Income */}
                            <FileUpload 
                              documentType="Other Income Documents"
                              taxFormId={taxFormId}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Step 3: Deductions */}
                  {currentStep === 3 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Deductions</h3>
                      <p className="text-muted-foreground mb-6">Enter your deductions under section 80C, 80D and others.</p>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF] mb-6">
                        <h4 className="font-medium mb-4">Section 80C Deductions (Max ₹1,50,000)</h4>
                        <p className="text-muted-foreground mb-4">This section will be implemented in the next phase.</p>
                      </div>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF]">
                        <h4 className="font-medium mb-4">Section 80D Deductions (Health Insurance)</h4>
                        <p className="text-muted-foreground mb-4">This section will be implemented in the next phase.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 4: Tax Paid */}
                  {currentStep === 4 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Tax Paid</h3>
                      <p className="text-muted-foreground mb-6">Enter details of tax already paid during the financial year.</p>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF] mb-6">
                        <h4 className="font-medium mb-4">TDS on Salary</h4>
                        <p className="text-muted-foreground mb-4">This information will be automatically imported from your Form 16 details.</p>
                      </div>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF]">
                        <h4 className="font-medium mb-4">Advance Tax / Self-Assessment Tax Paid</h4>
                        <p className="text-muted-foreground mb-4">This section will be implemented in the next phase.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 5: Review & Submit */}
                  {currentStep === 5 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Review & Submit</h3>
                      <p className="text-muted-foreground mb-6">Review your information and submit your tax return.</p>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF] mb-6">
                        <h4 className="font-medium mb-4">Tax Summary</h4>
                        <p className="text-muted-foreground mb-4">A detailed summary of your tax calculation is shown on the right side panel.</p>
                      </div>
                      
                      <div className="p-5 bg-background rounded-lg border border-[#E9ECEF]">
                        <h4 className="font-medium mb-4">Declaration</h4>
                        <p className="mb-4">I hereby declare that all the information provided is true and correct to the best of my knowledge.</p>
                        <Button className="w-full md:w-auto">Submit ITR</Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation buttons - only show for steps 2-4 */}
                  {currentStep >= 2 && currentStep <= 4 && (
                    <div className="flex justify-between pt-6 border-t border-[#E9ECEF]">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={previousStep}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        type={currentStep === 2 ? "submit" : "button"}
                        onClick={currentStep !== 2 ? nextStep : undefined}
                        disabled={saveMutation.isPending}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                        {saveMutation.isPending && (
                          <span className="ml-2 animate-spin">&#8230;</span>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {/* Navigation for step 5 */}
                  {currentStep === 5 && (
                    <div className="flex justify-between pt-6 border-t border-[#E9ECEF]">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={previousStep}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <TaxSummaryCard />
          <TaxTipSidebar />
          <HelpResourcesCard />
        </div>
      </div>
    </div>
  );
};

export default TaxFilingWizard;
