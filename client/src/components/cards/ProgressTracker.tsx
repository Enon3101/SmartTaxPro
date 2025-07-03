import { CheckIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
}

const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
  return (
    <div className="mb-6 sm:mb-8 lg:mb-10 overflow-x-auto scrollbar-hide">
      {/* Mobile - Vertical Layout */}
      <div className="block sm:hidden space-y-3">
        {steps.map((step, index) => (
          <div 
            key={step.number} 
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              step.active 
                ? "bg-primary/5 border border-primary/20" 
                : step.completed 
                  ? "bg-green-50 dark:bg-green-950/20" 
                  : "bg-muted/50"
            }`}
          >
            {/* Step Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0
                ${step.completed 
                  ? "bg-green-500 shadow-md shadow-green-500/20" 
                  : step.active 
                    ? "bg-primary ring-4 ring-primary/20" 
                    : "bg-muted border-2 border-muted-foreground/20"}
              `}
            >
              {step.completed ? (
                <CheckIcon className="h-5 w-5 text-white" />
              ) : (
                <span className={`font-semibold text-sm ${step.active ? "text-white" : "text-muted-foreground"}`}>
                  {step.number}
                </span>
              )}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-sm ${
                  step.completed 
                    ? "text-green-700 dark:text-green-400" 
                    : step.active 
                      ? "text-primary" 
                      : "text-muted-foreground"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                {step.description}
              </p>
            </div>
            
            {/* Progress Indicator */}
            {index < steps.length - 1 && (
              <div className="absolute left-8 mt-12 w-0.5 h-6 bg-muted-foreground/20" />
            )}
          </div>
        ))}
      </div>

      {/* Desktop/Tablet - Horizontal Layout */}
      <div className="hidden sm:flex min-w-max pb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="step-item flex-1 min-w-[140px] lg:min-w-[160px]">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full transition-all duration-200 
                  ${step.completed 
                    ? "bg-green-500 shadow-md shadow-green-500/20" 
                    : step.active 
                      ? "bg-primary ring-4 ring-primary/20" 
                      : "bg-muted border-2 border-muted-foreground/20"}
                  ${index === 0 ? "ml-0" : ""}`}
              >
                {step.completed ? (
                  <CheckIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                ) : (
                  <span className={`font-semibold text-sm lg:text-base ${step.active ? "text-white" : "text-muted-foreground"}`}>
                    {step.number}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="relative flex-1 mx-3 lg:mx-4">
                  <div className="h-1 bg-muted rounded-full">
                    <div
                      className={`h-1 bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500 ${
                        step.completed ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 lg:mt-4 px-1">
              <p
                className={`font-medium text-sm lg:text-base ${
                  step.completed 
                    ? "text-green-700 dark:text-green-400" 
                    : step.active 
                      ? "text-primary" 
                      : "text-muted-foreground"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1 leading-tight">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
