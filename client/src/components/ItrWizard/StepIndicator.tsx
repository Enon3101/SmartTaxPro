import { Check } from 'lucide-react';
import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isClickable = isCompleted;
          return (
            <React.Fragment key={step.number}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-blue-500 border-blue-500 text-white hover:opacity-80'
                      : isActive
                      ? 'border-blue-500 text-blue-500'
                      : 'border-gray-300 text-gray-300 cursor-default'
                  }`}
                  onClick={() => isClickable && onStepClick && onStepClick(step.number)}
                  style={isClickable ? { pointerEvents: 'auto' } : { pointerEvents: 'none' }}
                  title={isClickable ? 'Go to this step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div className="text-center mt-2">
                  <div
                    className={`text-sm font-medium ${
                      isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden md:block">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}