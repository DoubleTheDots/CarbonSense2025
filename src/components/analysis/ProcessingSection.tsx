"use client";

import { useEffect, useState, useCallback } from "react";
import { useFileProcessing } from "@/hooks/use-file-processing";

export interface ProcessingSectionProps {
  batchId: string;
  onProcessingComplete: (batchId: string) => void;
}

export function ProcessingSection({ batchId, onProcessingComplete }: ProcessingSectionProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { isProcessing, processingResult, processingError, processBatch } =
    useFileProcessing();

  // Start the actual API processing as soon as the component mounts
  useEffect(() => {
    if (!batchId) return;

    // Immediately start the actual processing
    const startProcessing = async () => {
      await processBatch(batchId);
    };

    startProcessing();
  }, [batchId, processBatch]);

  // Handle visual progress simulation
  useEffect(() => {
    if (!batchId) return;

    // Total time for processing animation (minimum time to show progress)
    const totalTime = 2000; // 2 seconds
    const intervalTime = 150; // Update every 150ms for smoother animation
    const steps = totalTime / intervalTime;
    const increment = 100 / steps;

    // Track when we get API results
    const startTime = Date.now();
    let apiResponseReceived = false;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Check if results or error came in
        if (!apiResponseReceived && (processingResult || processingError)) {
          apiResponseReceived = true;

          // Calculate how much time has passed since we started
          const elapsedTime = Date.now() - startTime;

          // If the API was super fast (less than 1 second), continue the animation
          // but speed it up to complete in another second
          if (elapsedTime < 1000) {
            // Don't immediately jump to 100%
            const remainingProgress = 100 - prevProgress;
            const newIncrement = remainingProgress / (1000 / intervalTime);
            return prevProgress + newIncrement;
          }

          // If we're already at 75% or more, speed up but don't jump
          if (prevProgress >= 75) {
            return prevProgress + increment * 2;
          }

          // Otherwise, jump to 75% and continue from there
          return Math.max(prevProgress, 75);
        }

        // Calculate the new progress
        const newProgress = prevProgress + increment;

        // If we've reached (or exceeded) 100%, clear the interval and set complete
        if (newProgress >= 100) {
          clearInterval(interval);
          // Only set complete if we've reached 100% naturally
          if (!processingResult && !processingError) {
            setIsComplete(true);
          }
          return 100;
        }

        return Math.min(newProgress, 100);
      });
    }, intervalTime);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [batchId, processingResult, processingError]);

  // Handle completion and transition to next step
  useEffect(() => {
    // If we have results or an error (real API results) OR our visual progress is complete
    if (
      (processingResult || processingError || isComplete) &&
      progress >= 100
    ) {
      // Wait for a moment at 100% for visual confirmation
      const timer = setTimeout(() => {
        onProcessingComplete(batchId);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [
    processingResult,
    processingError,
    isComplete,
    progress,
    batchId,
    onProcessingComplete,
  ]);

  return (
    <div className="border-t border-gray-200 px-6 py-8">
      <p className="mb-6 text-gray-600 text-sm sm:text-base">
        Your files are being processed. This typically takes about 3 seconds.
        Please do not close this window.
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-emerald-600 h-2.5 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 text-center">
        {Math.round(progress)}% complete
        {progress >= 100 && " - Processing complete!"}
      </p>
    </div>
  );
}
