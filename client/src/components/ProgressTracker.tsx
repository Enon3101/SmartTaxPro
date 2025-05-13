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
    <div className="mb-10 overflow-x-auto">
      <div className="flex min-w-max pb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="step-item flex-1 min-w-[150px]">
            <div className="flex items-center">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 
                  ${step.completed 
                    ? "bg-primary shadow-md shadow-primary/20" 
                    : step.active 
                      ? "bg-primary/90 ring-4 ring-primary/20" 
                      : "bg-muted"}
                  ${index === 0 ? "ml-0" : ""}`}
              >
                {step.completed ? (
                  <CheckIcon className="h-5 w-5 text-white" />
                ) : (
                  <span className={`font-semibold text-sm ${step.active ? "text-white" : "text-muted-foreground"}`}>
                    {step.number}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="relative flex-1 mx-2">
                  <div className="h-1 bg-muted">
                    <div
                      className={`h-1 bg-primary transition-all duration-500 ${
                        step.completed ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 px-1">
              <p
                className={`font-medium text-sm ${
                  step.completed 
                    ? "text-primary" 
                    : step.active 
                      ? "text-primary" 
                      : "text-muted-foreground"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
