import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useFileProcessing } from "@/hooks/use-file-processing";

interface ProcessingResultProps {
  batchId: string;
  resetToUpload: () => void;
}

export function ProcessingResult({
  batchId,
  resetToUpload,
}: ProcessingResultProps) {

  const { isProcessing, processingResult, processingError } =
    useFileProcessing(batchId);

  // Don't immediately start a new API call - by this point, the results should already be in cache
  // since we started the processing during the previous step

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Retrieving Results
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Just a moment while we load your analysis results...
        </p>
      </div>
    );
  }

  if (processingError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <title>Error</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              An error occurred during analysis
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{processingError}</p>
            </div>
            <div className="mt-4">
              <Button
                onClick={resetToUpload}
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-4 sm:mb-6">
        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mx-auto" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-2 sm:mt-3">
          Analysis Complete
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Your soil carbon analysis results are ready
        </p>
      </div>

      {processingResult && (
        <div className="relative bg-white rounded-2xl border border-green-600/20 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 mb-6 sm:mb-8 overflow-hidden">
          {/* Decorative circular gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-80 z-0"></div>

          {/* Decorative accent lines */}
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
          <div className="absolute -top-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-emerald-100 opacity-50"></div>
          <div className="absolute -bottom-6 -left-6 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-emerald-100 opacity-50"></div>

          <div className="relative z-10">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
              Carbon Content Analysis
            </h4>

            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl sm:text-6xl md:text-7xl font-bold text-emerald-600 tracking-tight">
                {processingResult.carbonPercentage?.toFixed(2)}
                <span className="text-3xl sm:text-3xl md:text-4xl ml-1">%</span>
              </div>
              <p className="mt-2 sm:mt-3 text-sm md:text-base text-gray-600 max-w-md mx-auto px-2 sm:px-0">
                This result represents the estimated carbon percentage in your
                soil sample, analyzed using near-infrared spectroscopy and our
                calibrated prediction model.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-left w-full sm:w-auto mb-2 sm:mb-0">
                  <div className="text-xs sm:text-sm text-gray-500">
                    <span>Analysis ID:</span>
                    <div className="sm:hidden mt-1"></div>
                    <span className="font-mono ml-0 sm:ml-1">{batchId}</span>
                  </div>
                </div>
                <Button
                  onClick={resetToUpload}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer w-full sm:w-auto text-sm"
                >
                  Analyze Another Sample
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-left">
        <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-2">
          What does this mean?
        </h4>
        <p className="text-sm text-gray-600">
          Soil carbon percentage is a critical indicator of soil health and
          environmental sustainability. Higher carbon content generally
          indicates healthier soil with better structure, water retention, and
          nutrient availability for plants.
        </p>
      </div>
    </div>
  );
}
