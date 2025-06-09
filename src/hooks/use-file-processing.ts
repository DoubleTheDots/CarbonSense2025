import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "./use-toast";

interface ProcessingResultData {
  carbonPercentage: number;
}

// Cache for storing processing results by batchId
const resultsCache: Record<string, ProcessingResultData | null> = {};
const errorCache: Record<string, string | null> = {};
const processingStatus: Record<string, boolean> = {};

export function useFileProcessing(batchId?: string | null) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(!!batchId && !resultsCache[batchId as string]);
  const [processingResult, setProcessingResult] = useState<ProcessingResultData | null>(
    batchId ? resultsCache[batchId] || null : null
  );

  const [processingError, setProcessingError] = useState<string | null>(
    batchId ? errorCache[batchId as string] || null : null
  );
  const isMountedRef = useRef(true);

  // Reset states when batchId changes
  useEffect(() => {
    if (batchId && resultsCache[batchId]) {
      setProcessingResult(resultsCache[batchId]);
      setProcessingError(errorCache[batchId] || null);
      setIsProcessing(false);
    } else if (batchId && errorCache[batchId]) {
      setProcessingResult(null);
      setProcessingError(errorCache[batchId]);
      setIsProcessing(false);
    } else if (batchId && processingStatus[batchId]) {
      setIsProcessing(true);
    } else if (batchId) {
      setIsProcessing(true);
      setProcessingResult(null);
      setProcessingError(null);
    } else {
      setIsProcessing(false);
      setProcessingResult(null);
      setProcessingError(null);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [batchId]);

  const processBatch = useCallback(async (id: string) => {


    if (!id) return null;

    // If we already have results for this batch, return them immediately
    if (resultsCache[id]) {
      return resultsCache[id];
    }

    // If we already have an error for this batch, return it immediately
    if (errorCache[id]) {
      return null;
    }

    // If this batch is already being processed, don't start another request
    if (processingStatus[id]) {
      return null;
    }

    setIsProcessing(true);
    setProcessingError(null);
    processingStatus[id] = true;

    try {
      const response = await fetch(`/api/process?batchId=${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Processing failed");
      }
      const data = await response.json();

      // Save to cache
      resultsCache[id] = data;
      errorCache[id] = null;

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setProcessingResult(data);
      }
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      // Save error to cache
      errorCache[id] = errorMessage;
      resultsCache[id] = null;

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setProcessingError(errorMessage);
        toast({
          title: "Processing failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      return null;
    } finally {
      processingStatus[id] = false;

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [toast]);

  // Only automatically start processing if the batchId changes and we don't have cached results
  useEffect(() => {
    if (batchId && !resultsCache[batchId] && !errorCache[batchId] && !processingStatus[batchId]) {
      processBatch(batchId);
    }
  }, [batchId, processBatch]);

  const resetProcessing = useCallback(() => {
    if (batchId) {
      delete resultsCache[batchId];
      delete errorCache[batchId];
      delete processingStatus[batchId];
    }
    setProcessingResult(null);
    setProcessingError(null);
    setIsProcessing(false);
  }, [batchId]);

  return {
    isProcessing,
    processingResult,
    processingError,
    processBatch,
    resetProcessing
  };
}