import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Briefcase, Building, Calculator, Home, LineChart, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IncomeTile } from '@/components/ItrWizard/IncomeTile';
import { StepIndicator } from '@/components/ItrWizard/StepIndicator';
import { DynamicForm } from '@/components/ItrWizard/DynamicForm';
import { useItrWizard } from '@/context/ItrWizardContext';
import { getITRDescription } from '../utils/itrSelector';
import { getAllCompulsoryFields, getCompulsoryFields } from '@/utils/compulsoryFieldsLoader';

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
  const { step, sources, itr, compulsory } = state;
  const [currentSource, setCurrentSource] = useState<string | null>(null);

  // Load source fields when sources change
  useEffect(() => {
    if (sources.length > 0 && step === 2) {
      // If there are selected sources but no current source is selected,
      // set the first source as current
      if (!currentSource || !sources.includes(currentSource)) {
        setCurrentSource(sources[0]);
      }
    }
  }, [sources, step, currentSource]);

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

  // Handle form submission for required fields
  const handleFormSubmit = (data: any) => {
    // Update compulsory fields in state
    const sourceCode = data.sourceCode;
    const newCompulsory = { ...compulsory };
    
    // Initialize the source array if it doesn't exist
    if (!newCompulsory[sourceCode]) {
      newCompulsory[sourceCode] = [];
    }
    
    // Add the form data, removing the sourceCode property
    const { sourceCode: _, ...formData } = data;
    newCompulsory[sourceCode].push(formData);
    
    dispatch({ type: 'SET_COMPULSORY', payload: newCompulsory });
    
    // If this is the last source, move to next step
    const currentIndex = sources.indexOf(sourceCode);
    if (currentIndex < sources.length - 1) {
      setCurrentSource(sources[currentIndex + 1]);
    } else {
      // Move to summary step
      goToNextStep();
    }
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
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-700">No income sources selected</AlertTitle>
                  <AlertDescription className="text-amber-600">
                    Please select at least one source of income to proceed.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Required Details with Dynamic Form */}
          {step === 2 && (
            <div>
              {sources.length > 0 ? (
                <div>
                  <div className="flex mb-6 overflow-x-auto py-2 gap-2">
                    {sources.map((sourceCode) => {
                      const source = incomeSources.find(s => s.code === sourceCode);
                      const isComplete = compulsory[sourceCode]?.length > 0;
                      const isActive = sourceCode === currentSource;
                      
                      return (
                        <div 
                          key={sourceCode}
                          onClick={() => setCurrentSource(sourceCode)}
                          className={`
                            px-4 py-2 border rounded-lg flex items-center cursor-pointer min-w-max
                            ${isComplete ? 'bg-green-50 border-green-300 text-green-700' : ''}
                            ${isActive && !isComplete ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                            ${!isActive && !isComplete ? 'bg-gray-50 border-gray-300 text-gray-700' : ''}
                          `}
                        >
                          <div className="mr-2">
                            {source?.icon}
                          </div>
                          <div>
                            <span className="font-medium">{source?.label}</span>
                            {isComplete && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Complete
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {currentSource && (
                    <div>
                      {(() => {
                        const sourceFields = getCompulsoryFields(currentSource);
                        const source = incomeSources.find(s => s.code === currentSource);
                        
                        if (sourceFields) {
                          return (
                            <DynamicForm
                              sourceCode={currentSource}
                              fields={sourceFields}
                              onSubmit={(data) => handleFormSubmit({...data, sourceCode: currentSource})}
                              title={`${source?.label} Details`}
                              description={sourceFields.description}
                            />
                          );
                        }
                        
                        return (
                          <Alert className="mb-4">
                            <AlertTitle>No form fields found for {source?.label}</AlertTitle>
                            <AlertDescription>
                              Please contact support for assistance.
                            </AlertDescription>
                          </Alert>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-700">No income sources selected</AlertTitle>
                  <AlertDescription className="text-amber-600">
                    Please go back to step 1 and select at least one source of income.
                  </AlertDescription>
                </Alert>
              )}
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Income Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((sourceCode) => {
                    const source = incomeSources.find(s => s.code === sourceCode);
                    return (
                      <Card key={sourceCode} className="bg-white">
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className="mr-2">
                              {source?.icon}
                            </div>
                            <CardTitle className="text-base">{source?.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {compulsory[sourceCode] && compulsory[sourceCode].length > 0 ? (
                            <div>
                              {compulsory[sourceCode].map((entry, index) => (
                                <div key={index} className="text-sm">
                                  {Object.entries(entry).map(([key, value]) => {
                                    // Skip internal keys or empty values
                                    if (!value) return null;
                                    
                                    // Find the field definition to get the label
                                    const sourceFields = getCompulsoryFields(sourceCode);
                                    const fieldDef = sourceFields?.fields.find(f => f.id === key);
                                    
                                    return (
                                      <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="text-gray-600">{fieldDef?.label || key}:</span>
                                        <span className="font-medium">
                                          {/* Format based on field type */}
                                          {fieldDef?.type === 'number' ? 
                                            `₹${Number(value).toLocaleString('en-IN')}` : 
                                            value.toString()}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  
                                  {/* Edit button */}
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => {
                                      dispatch({ type: 'SET_STEP', payload: 2 });
                                      setCurrentSource(sourceCode);
                                    }}
                                  >
                                    Edit Details
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-amber-600 text-sm">No details entered</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <p className="text-gray-600 mb-4">
                  Now that we've identified the appropriate ITR form for you, you can proceed
                  with filling out your tax return with confidence.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => navigate('/start-filing')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Continue to Deductions <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/calculators/income-tax')}
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Calculator className="mr-2 h-4 w-4" /> Calculate My Income Tax
                  </Button>
                </div>
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