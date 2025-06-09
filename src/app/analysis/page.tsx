"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileUp, FileText, Loader2 } from "lucide-react";
import { Header } from "@/components/homepage/Header";
import { PageHeader } from "@/components/analysis/PageHeader";
import { StepsComponent } from "@/components/analysis/StepsComponent";
import { SectionHeader } from "@/components/analysis/SectionHeader";
import { UploadSection } from "@/components/analysis/UploadSection";
import { ProcessingSection } from "@/components/analysis/ProcessingSection";
import { ProcessingResult } from "@/components/analysis/ProcessingResult";
import { useSteps } from "@/hooks/use-steps";

export default function AnalysisPage() {
  const router = useRouter();

  // Initialize steps from step 1
  const { currentStep, steps, goToStep } = useSteps(1);

  // State for tracking the current batch being processed
  const [filesData, setFilesData] = useState<Array<{ fileId: string; fileName: string }>>([]);
  const [batchId, setBatchId] = useState("");

  // Handler for when upload is complete
  const handleUploadComplete = useCallback(
    (newFiles: { fileId: string; fileName: string }[], batchId: string) => {
      setFilesData(newFiles);
      setBatchId(batchId)

      goToStep(2); // Move to processing step - processing starts immediately when ProcessingSection mounts
    },
    [goToStep]
  )

  // Handler for when processing visualization is complete
  // (the actual API call starts when ProcessingSection mounts)
  const handleProcessingComplete = useCallback(
    (batchId: string) => {
      // Just update the step without changing the URL
      goToStep(3); // Move to results step - show the already-fetched results
    },
    [goToStep]
  );

  // Handler to reset the flow
  const resetToUpload = useCallback(() => {
    setFilesData([]);
    goToStep(1);
  }, [goToStep]);

  // Determine the page title based on current step
  const pageTitle =
    currentStep === 3 ? "Analysis Results" : "Spectral Data Analysis";

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <PageHeader title={pageTitle} />

        {/* Steps Component */}
        <StepsComponent steps={steps} />

        {/* Main Content */}
        <div className="mb-16">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200">
            {currentStep === 1 && (
              // Step 1: Upload UI
              <>
                <SectionHeader
                  icon={FileUp}
                  title="File Upload"
                  description="Upload your NIR spectral data in CSV format for soil carbon analysis"
                />
                <UploadSection onUploadComplete={handleUploadComplete} />
              </>
            )}

            {currentStep === 2 && (
              // Step 2: Processing UI - This component now starts the real processing immediately
              <>
                <SectionHeader
                  icon={Loader2}
                  title="Data Analysis"
                  description="Your files are being analyzed for soil carbon content"
                  isSpinning={true}
                />

                <ProcessingSection
                  batchId={batchId}
                  onProcessingComplete={handleProcessingComplete}
                />

              </>
            )}

            {currentStep === 3 && (
              // Step 3: Results UI - Should already have results from the ProcessingSection's API call
              <>
                <SectionHeader
                  icon={FileText}
                  title="Analysis Results"
                  description={
                    filesData.length > 1
                      ? `${filesData.length} files have been analyzed for soil carbon content`
                      : `${filesData[0]?.fileName || "Your file"} has been analyzed for soil carbon content`
                  }
                />
                <div className="border-t border-gray-200 px-6 py-8">
                  <ProcessingResult
                    batchId={batchId}  // pass batchId from first file
                    resetToUpload={resetToUpload}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
