import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./use-toast";

interface UploadBatchResult {
  success: boolean;
  files?: { fileId: string; fileName: string }[];
  error?: string;
}

export function useFileUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileId: string; fileName: string }[]>([]);

  const handleUpload = useCallback(async (files: File[], uniqueId: string = uuidv4()): Promise<UploadBatchResult> => {
    if (!files || files.length === 0) {
      return { success: false, error: "No files provided" };
    }

    if (files.length > 4) {
      return { success: false, error: "Maximum 4 files allowed" };
    }

    // Reset states
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      const formData = new FormData();
      const tempUploadedFiles: { fileId: string; fileName: string }[] = [];

      formData.append("batchId", uniqueId);

      files.forEach((file, index) => {
        // Use the original file but generate a new filename with the uuid
        const fileExtension = file.name.split(".").pop() || "csv";
        const newFileId = `${uniqueId}-${index}`
        const newFileName = `${newFileId}.${fileExtension}`;
        // Add the original file with the new name
        const renamedFile = new File([file], newFileName, { type: file.type });
        formData.append("files", renamedFile);
        tempUploadedFiles.push({
          fileId: newFileId,
          fileName: newFileName,
        });

      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Upload failed");
      }

      // Mark upload as successful
      setUploadSuccess(true);
      setUploadedFiles(tempUploadedFiles)

      return {
        success: true,
        files: uploadedFiles
      };
    } catch (error) {
      // Reset state on error
      console.error("Upload error:", error);
      setUploadSuccess(false);

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const resetUpload = useCallback(() => {
    setUploadedFiles([])
    setUploadSuccess(false);
  }, []);

  return {
    isUploading,
    uploadSuccess,
    uploadedFiles,
    handleUpload,
    resetUpload
  };
} 