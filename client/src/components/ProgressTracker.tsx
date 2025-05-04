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
                className={`w-8 h-8 ${
                  step.completed || step.active
                    ? "bg-primary text-white"
                    : "bg-[#E9ECEF] text-[#ADB5BD]"
                } rounded-full flex items-center justify-center font-medium text-sm`}
              >
                {step.number}
              </div>
              <div
                className={`h-1 flex-1 ${
                  step.completed ? "bg-primary" : "bg-[#E9ECEF]"
                }`}
              ></div>
            </div>
            <div className="mt-2">
              <p
                className={`font-medium ${
                  step.completed || step.active ? "text-primary" : ""
                }`}
              >
                {step.title}
              </p>
              <p className="text-sm text-[#ADB5BD]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
