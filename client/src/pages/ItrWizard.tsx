import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Briefcase, Building, Calculator, Home, LineChart, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IncomeTile } from '@/components/ItrWizard/IncomeTile';
import { StepIndicator } from '@/components/ItrWizard/StepIndicator';
import { useItrWizard } from '@/context/ItrWizardContext';
import { getITRDescription } from '@/utils/itrSelector';

// Define wizard steps
const wizardSteps = [
  {
    number: 1, 
    title: 'Income Sources',
    description: 'Select your income sources'
  },
  {
    number: 2,
    title: 'Required Details',
    description: 'Provide required information'
  },
  {
    number: 3,
    title: 'Summary',
    description: 'Review and confirm'
  }
];

// Define income source options
const incomeSources = [
  {
    code: 'S',
    label: 'Salary Income',
    description: 'Income from employment or pension',
    icon: <Briefcase className="h-5 w-5 text-blue-500" />
  },
  {
    code: 'H',
    label: 'House Property',
    description: 'Rental income or interest on housing loan',
    icon: <Home className="h-5 w-5 text-blue-500" />
  },
  {
    code: 'G',
    label: 'Capital Gains',
    description: 'Profit from sale of assets, shares, or property',
    icon: <LineChart className="h-5 w-5 text-blue-500" />
  },
  {
    code: 'B',
    label: 'Business Income',
    description: 'Income from business with books of accounts',
    icon: <Building className="h-5 w-5 text-blue-500" />
  },
  {
    code: 'P',
    label: 'Presumptive Business',
    description: 'Business income under sections 44AD, 44ADA, 44AE',
    icon: <Calculator className="h-5 w-5 text-blue-500" />
  },
  {
    code: 'I',
    label: 'Interest Income',
    description: 'Interest from savings, deposits, or bonds',
    icon: <PiggyBank className="h-5 w-5 text-blue-500" />
  }
];

export default function ItrWizard() {
  const [location, navigate] = useLocation();
  const { state, dispatch } = useItrWizard();
  const { step, sources, itr } = state;

  // Toggle a source code in the selected sources array
  const toggleSource = (code: string) => {
    const newSources = sources.includes(code)
      ? sources.filter(s => s !== code)
      : [...sources, code];
    
    dispatch({ type: 'SET_SOURCES', payload: newSources });
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (step < wizardSteps.length) {
      dispatch({ type: 'SET_STEP', payload: step + 1 });
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (step > 1) {
      dispatch({ type: 'SET_STEP', payload: step - 1 });
    }
  };

  // Reset the wizard
  const resetWizard = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ITR Form Selector</h1>
        <p className="text-gray-600">
          Select your income sources to automatically determine the correct ITR form for you.
        </p>
      </div>

      <StepIndicator steps={wizardSteps} currentStep={step} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select Your Income Sources"}
            {step === 2 && "Provide Required Information"}
            {step === 3 && "Review Your Selection"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose all sources of income that apply to you for the assessment year 2025-26"}
            {step === 2 && "Fill in the details required for your selected income sources"}
            {step === 3 && "Review and confirm your selections and suggested ITR form"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Select Income Sources */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {incomeSources.map((source) => (
                  <IncomeTile
                    key={source.code}
                    code={source.code}
                    label={source.label}
                    description={source.description}
                    icon={source.icon}
                    selected={sources.includes(source.code)}
                    onClick={toggleSource}
                  />
                ))}
              </div>

              {sources.length === 0 && (
                <Alert variant="warning" className="mb-4">
                  <AlertTitle>No income sources selected</AlertTitle>
                  <AlertDescription>
                    Please select at least one source of income to proceed.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Required Details (placeholder for now) */}
          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-4">
                Based on your selected income sources, we need some additional information.
                This section will be customized based on your selections.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  This is where we would dynamically generate forms based on the compulsory fields
                  for your selected income sources. For now, you can proceed to the summary.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  Suggested ITR Form: {itr}
                </h2>
                <p className="text-blue-700 mb-4">
                  {getITRDescription(itr || '')}
                </p>
                <div className="mb-4">
                  <h3 className="font-medium text-blue-800 mb-2">Selected Income Sources:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {sources.map((code) => {
                      const source = incomeSources.find(s => s.code === code);
                      return (
                        <li key={code} className="text-blue-700">
                          {source?.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <p className="text-gray-600 mb-4">
                  Now that we've identified the appropriate ITR form for you, you can proceed
                  with filling out your tax return with confidence.
                </p>
                <Button 
                  onClick={() => navigate('/start-filing')}
                  className="mr-2"
                >
                  Start Filing Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Home
          </Button>
        )}

        <div>
          <Button 
            variant="ghost" 
            onClick={resetWizard} 
            className="mr-2"
          >
            Reset
          </Button>
          
          {step < wizardSteps.length ? (
            <Button 
              onClick={goToNextStep}
              disabled={step === 1 && sources.length === 0}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/start-filing')}>
              Start Filing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}