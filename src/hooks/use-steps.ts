import { useState } from "react";

export type StepStatus = "complete" | "current" | "upcoming";

export interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
}

export function useSteps(initialStep = 1, totalSteps = 3) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Function to generate steps with proper status
  const getSteps = (): Step[] => {
    return Array.from({ length: totalSteps }, (_, index) => {
      const stepNumber = index + 1;
      const status: StepStatus =
        stepNumber === currentStep
          ? "current"
          : stepNumber < currentStep
            ? "complete"
            : "upcoming";

      return {
        id: `Step ${stepNumber}`,
        name: getStepName(stepNumber),
        description: getStepDescription(stepNumber),
        status,
      };
    });
  };

  // Get step name based on step number
  const getStepName = (step: number): string => {
    switch (step) {
      case 1:
        return "Upload Data";
      case 2:
        return "Processing";
      case 3:
        return "Results";
      default:
        return `Step ${step}`;
    }
  };

  // Get step description based on step number
  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1:
        return "Upload your NIR spectral data file";
      case 2:
        return "System is analyzing your spectral data";
      case 3:
        return "View your soil carbon analysis results";
      default:
        return "";
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const resetSteps = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    steps: getSteps(),
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetSteps,
  };
}
