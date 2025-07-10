
import React from "react";
import { Check } from "lucide-react";

interface CombinedStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick: (stepNumber: number) => void;
  validateCurrentStep: () => boolean;
}

export function CombinedStepIndicator({ 
  currentStep, 
  totalSteps, 
  stepLabels,
  onStepClick, 
  validateCurrentStep 
}: CombinedStepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                } cursor-pointer shadow-sm hover:shadow-md transition-all`}
                onClick={() => currentStep > step - 1 || (validateCurrentStep() && currentStep > step - 2) ? onStepClick(step) : null}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              <span className={`text-xs mt-1 ${currentStep === step ? "text-primary font-medium" : "text-gray-500"}`}>
                {stepLabels[index]}
              </span>
            </div>
            
            {index < totalSteps - 1 && (
              <div className={`h-1 flex-grow ${currentStep > step ? "bg-primary" : "bg-gray-200"}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
