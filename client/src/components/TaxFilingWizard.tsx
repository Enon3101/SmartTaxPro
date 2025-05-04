import { useState } from "react";
import ProgressTracker from "./ProgressTracker";
import TaxSummaryCard from "./TaxSummaryCard";
import HelpResourcesCard from "./HelpResourcesCard";
import { useTaxFiling } from "@/hooks/useTaxFiling";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ChevronLeft, ChevronRight, Plus, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FileUpload from "./FileUpload";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

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

// Define schema for additional income sources in India
const additionalIncomeSchema = z.object({
  hasRentalIncome: z.boolean().default(false),
  hasCapitalGains: z.boolean().default(false), 
  hasBusinessIncome: z.boolean().default(false),
  hasInterestIncome: z.boolean().default(false),
  hasDividendIncome: z.boolean().default(false),
  hasOtherIncome: z.boolean().default(false),
  // Income amounts
  rentalIncome: z.string().optional(),
  shortTermCapitalGains: z.string().optional(),
  longTermCapitalGains: z.string().optional(),
  businessIncome: z.string().optional(),
  interestIncome: z.string().optional(),
  dividendIncome: z.string().optional(),
  otherSources: z.string().optional(),
  // House property details
  housePropertyType: z.enum(["self-occupied", "let-out", "deemed-let-out"]).optional(),
  annualRentReceived: z.string().optional(),
  municipalTaxes: z.string().optional(),
  homeLoanInterest: z.string().optional(),
});

// Combine schemas for Indian income
const incomeFormSchema = z.object({
  form16: form16Schema,
  additionalIncome: additionalIncomeSchema,
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

const TaxFilingWizard = () => {
  const { 
    currentStep, 
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
    defaultValues: taxFormData?.incomeData || {
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
        interestIncome: "",
        dividendIncome: "",
        otherSources: "",
        housePropertyType: "self-occupied",
        annualRentReceived: "",
        municipalTaxes: "",
        homeLoanInterest: "",
      },
    },
  });

  // Set up the mutation to save form data
  const saveMutation = useMutation({
    mutationFn: async (data: IncomeFormValues) => {
      const response = await apiRequest(
        "POST",
        `/api/tax-forms/${taxFormId}/income`,
        data
      );
      return await response.json();
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
    // Format numeric fields (remove commas, etc.)
    const formattedData = {
      ...data,
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

  const steps = [
    {
      number: 1,
      title: "Personal Info",
      description: "About you",
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      number: 2,
      title: "Income Sources",
      description: "From all sources",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      number: 3,
      title: "Deductions",
      description: "Section 80C & 80D",
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      number: 4,
      title: "Tax Paid",
      description: "TDS & Advance Tax",
      completed: currentStep > 4,
      active: currentStep === 4,
    },
    {
      number: 5,
      title: "Review & Submit",
      description: "File your ITR",
      completed: currentStep > 5,
      active: currentStep === 5,
    },
  ];

  const hasInvestmentIncome = form.watch("additionalIncome.hasInvestmentIncome");

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
        <p className="text-[#ADB5BD]">
          Complete your Income Tax Return filing in a few simple steps.
        </p>
      </div>

      <ProgressTracker steps={steps} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Income Sources</CardTitle>
                <CardDescription>Step 2 of 5</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Form 16 Employment Income Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">
                      Form 16 - Salary Income Details
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
                    <h3 className="text-lg font-medium mb-4">
                      Additional Income Sources
                    </h3>

                    {/* Income Checkboxes */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      <FormField
                        control={form.control}
                        name="additionalIncome.has1099Income"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="income_1099"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Self-Employment (1099-NEC/MISC)
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalIncome.hasInvestmentIncome"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="income_investment"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Investment Income
                            </FormLabel>
                          </FormItem>
                        )}
                      />
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
                              Rental Income
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalIncome.hasRetirementIncome"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="income_retirement"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Retirement Distributions
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalIncome.hasUnemploymentIncome"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="income_unemployment"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Unemployment Benefits
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

                    {/* Investment Income Form */}
                    {hasInvestmentIncome && (
                      <div className="mb-6 p-5 bg-background rounded-lg border border-[#E9ECEF]">
                        <h4 className="font-medium mb-3">Investment Income</h4>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name="additionalIncome.dividendIncome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dividends</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      $
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
                            name="additionalIncome.interestIncome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interest</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      $
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

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name="additionalIncome.capitalGainsIncome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Capital Gains</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      $
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
                            name="additionalIncome.capitalLosses"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center mb-2">
                                  <FormLabel className="mb-0">Capital Losses</FormLabel>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="ml-2 cursor-help">
                                          <HelpCircle className="h-4 w-4 text-[#ADB5BD]" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-[250px] text-xs">
                                        Capital losses can offset capital gains and up to $3,000 of
                                        other income
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ADB5BD]">
                                      $
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

                        {/* Document Upload for Investment Income */}
                        <FileUpload 
                          documentType="1099-DIV/INT/B"
                          taxFormId={taxFormId}
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Navigation */}
                  <div className="flex justify-between pt-6 border-t border-[#E9ECEF]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={saveMutation.isPending}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                      {saveMutation.isPending && (
                        <span className="ml-2 animate-spin">&#8230;</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-1">
          <TaxSummaryCard />
          <HelpResourcesCard />
        </div>
      </div>
    </div>
  );
};

export default TaxFilingWizard;
