import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface StepProps {
  steps: {
    id: string;
    name: string;
    description: string;
    status: "complete" | "current" | "upcoming";
  }[];
}

export function StepsComponent({ steps }: StepProps) {
  return (
    <nav aria-label="Progress" className="-mb-4 mx-4">
      <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8 shadow-lg border border-gray-200 bg-white rounded-xl px-6 pt-5 pb-10">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 ${
                step.status === "complete"
                  ? "border-emerald-600"
                  : step.status === "current"
                  ? "border-emerald-600"
                  : "border-gray-200"
              }`}
            >
              <span className="flex items-center text-sm font-medium">
                <span className="text-emerald-600">{step.id}</span>
                <span className="mx-2 text-gray-400">-</span>
                <span className="text-gray-800">{step.name}</span>
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
