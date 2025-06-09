import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { FileUploadForm } from "./FileUploadForm";
import { useFileUpload } from "@/hooks/use-file-upload";
import { v4 as uuidv4 } from "uuid";

interface UploadSectionProps {
  onUploadComplete: (uploadedFiles: { fileId: string; fileName: string }[], batchId: string) => void;
}

export function UploadSection({ onUploadComplete }: UploadSectionProps) {
  // Generate a unique ID for this component instance
  const [uniqueId] = useState(() => uuidv4());
  const { isUploading, uploadSuccess, uploadedFiles, handleUpload } =
    useFileUpload();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message and then transition to next step after 1 second
  useEffect(() => {
    if (uploadSuccess && uploadedFiles) {
      setShowSuccessMessage(true);

      // Set a timer to move to the next step after showing success message
      const timer = setTimeout(() => {
        onUploadComplete(uploadedFiles, uniqueId);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [uploadSuccess, uploadedFiles, onUploadComplete]);

  const handleFileUpload = async (files: File[], uniqueId: string) => {
    if (!files || files.length === 0) return { success: false };

    const result = await handleUpload(files, uniqueId);

    return result;
  };

  return (
    <div className="border-t border-gray-200 px-6 py-8">
      <p className="mb-6 text-gray-600 text-sm sm:text-base">
        Your CSV files will be securely stored in the cloud and not shared with
        anyone.
      </p>

      <FileUploadForm
        onUpload={handleFileUpload}
        isUploading={isUploading}
        uniqueId={uniqueId}
      />

      {showSuccessMessage && (
        <div className="mt-6 flex items-start rounded-md bg-green-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Upload Successful
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Files
              <strong>
                {uploadedFiles.map((file) => (
                  <li key={file.fileName}>{file.fileName}</li>
                ))}
              </strong>
              have been uploaded to Azure Blob
              Storage and are now being processed...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
