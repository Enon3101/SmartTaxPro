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

// Define the schema for W-2 form
const w2FormSchema = z.object({
  employerName: z.string().min(1, "Employer name is required"),
  employerEIN: z.string().min(1, "Employer EIN is required"),
  wages: z.string().min(1, "Wages are required"),
  federalTaxWithheld: z.string().min(1, "Federal tax withheld is required"),
  socialSecurityWages: z.string().min(1, "Social security wages are required"),
  socialSecurityTaxWithheld: z.string().min(1, "Social security tax withheld is required"),
  medicareWages: z.string().min(1, "Medicare wages are required"),
  medicareTaxWithheld: z.string().min(1, "Medicare tax withheld is required"),
});

// Define schema for additional income
const additionalIncomeSchema = z.object({
  has1099Income: z.boolean().default(false),
  hasInvestmentIncome: z.boolean().default(false),
  hasRentalIncome: z.boolean().default(false),
  hasRetirementIncome: z.boolean().default(false),
  hasUnemploymentIncome: z.boolean().default(false),
  hasOtherIncome: z.boolean().default(false),
  dividendIncome: z.string().optional(),
  interestIncome: z.string().optional(),
  capitalGainsIncome: z.string().optional(),
  capitalLosses: z.string().optional(),
});

// Combine schemas
const incomeFormSchema = z.object({
  w2Forms: z.array(w2FormSchema),
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
  const [w2Count, setW2Count] = useState(1);

  // Query to fetch existing tax form data if available
  const { data: taxFormData } = useQuery({
    queryKey: [`/api/tax-forms/${taxFormId}`],
    enabled: !!taxFormId,
  });

  // Initialize form with default values or existing data
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: taxFormData?.incomeData || {
      w2Forms: [
        {
          employerName: "",
          employerEIN: "",
          wages: "",
          federalTaxWithheld: "",
          socialSecurityWages: "",
          socialSecurityTaxWithheld: "",
          medicareWages: "",
          medicareTaxWithheld: "",
        },
      ],
      additionalIncome: {
        has1099Income: false,
        hasInvestmentIncome: false,
        hasRentalIncome: false,
        hasRetirementIncome: false,
        hasUnemploymentIncome: false,
        hasOtherIncome: false,
        dividendIncome: "",
        interestIncome: "",
        capitalGainsIncome: "",
        capitalLosses: "",
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
      w2Forms: data.w2Forms.map(form => ({
        ...form,
        wages: form.wages.replace(/,/g, ""),
        federalTaxWithheld: form.federalTaxWithheld.replace(/,/g, ""),
        socialSecurityWages: form.socialSecurityWages.replace(/,/g, ""),
        socialSecurityTaxWithheld: form.socialSecurityTaxWithheld.replace(/,/g, ""),
        medicareWages: form.medicareWages.replace(/,/g, ""),
        medicareTaxWithheld: form.medicareTaxWithheld.replace(/,/g, ""),
      })),
      additionalIncome: {
        ...data.additionalIncome,
        dividendIncome: data.additionalIncome.dividendIncome?.replace(/,/g, "") || "",
        interestIncome: data.additionalIncome.interestIncome?.replace(/,/g, "") || "",
        capitalGainsIncome: data.additionalIncome.capitalGainsIncome?.replace(/,/g, "") || "",
        capitalLosses: data.additionalIncome.capitalLosses?.replace(/,/g, "") || "",
      }
    };
    
    updateIncome(formattedData);
    saveMutation.mutate(formattedData);
  };

  const handleAddW2 = () => {
    const currentW2Forms = form.getValues("w2Forms");
    form.setValue("w2Forms", [
      ...currentW2Forms,
      {
        employerName: "",
        employerEIN: "",
        wages: "",
        federalTaxWithheld: "",
        socialSecurityWages: "",
        socialSecurityTaxWithheld: "",
        medicareWages: "",
        medicareTaxWithheld: "",
      },
    ]);
    setW2Count(w2Count + 1);
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
      title: "Income",
      description: "Your earnings",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      number: 3,
      title: "Deductions",
      description: "Your expenses",
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      number: 4,
      title: "Credits",
      description: "Tax benefits",
      completed: currentStep > 4,
      active: currentStep === 4,
    },
    {
      number: 5,
      title: "Review & File",
      description: "Submit return",
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
          File Your 2023 Tax Return
        </h1>
        <p className="text-[#ADB5BD]">
          Complete your tax return in a few simple steps.
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
                  {/* W-2 Employment Income */}
                  {Array.from({ length: w2Count }).map((_, index) => (
                    <div key={index} className="mb-8">
                      <h3 className="text-lg font-medium mb-4">
                        W-2 Employment Income {w2Count > 1 ? `#${index + 1}` : ""}
                      </h3>

                      {/* Employer Information */}
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <FormField
                          control={form.control}
                          name={`w2Forms.${index}.employerName`}
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
                          name={`w2Forms.${index}.employerEIN`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employer EIN</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="XX-XXXXXXX"
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
                          name={`w2Forms.${index}.wages`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Wages, Tips, and Compensation (Box 1)
                              </FormLabel>
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
                          name={`w2Forms.${index}.federalTaxWithheld`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Federal Income Tax Withheld (Box 2)
                              </FormLabel>
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

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <FormField
                          control={form.control}
                          name={`w2Forms.${index}.socialSecurityWages`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Social Security Wages (Box 3)
                              </FormLabel>
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
                          name={`w2Forms.${index}.socialSecurityTaxWithheld`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Social Security Tax Withheld (Box 4)
                              </FormLabel>
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

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <FormField
                          control={form.control}
                          name={`w2Forms.${index}.medicareWages`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medicare Wages (Box 5)</FormLabel>
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
                          name={`w2Forms.${index}.medicareTaxWithheld`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Medicare Tax Withheld (Box 6)
                              </FormLabel>
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

                      {/* Document Upload */}
                      <FileUpload 
                        documentType={`W-2 ${w2Count > 1 ? `#${index + 1}` : ""}`}
                        taxFormId={taxFormId}
                      />
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mb-8"
                      onClick={handleAddW2}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Another W-2
                    </Button>
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
