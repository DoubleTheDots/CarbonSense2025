"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, FileText, CheckCircle, Info } from "lucide-react";

interface FileUploadFormProps {
  onUpload: (
    files: File[],
    uniqueId: string
  ) => Promise<{ success: boolean; files?: { fileId: string; fileName: string }[] }>;
  isUploading: boolean;
  uniqueId: string;
}

export function FileUploadForm({
  onUpload,
  isUploading,
  uniqueId,
}: FileUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, 4); // max 4 files
      setSelectedFiles(files);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles && selectedFiles.length !== 0) {
      try {
        // Call the upload function passed from parent
        const result = await onUpload(selectedFiles, uniqueId);
        // Reset form on success
        if (result.success) {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setSelectedFiles([]);
        }
      } catch (error) {
        console.error("Error in file upload:", error);
      }
    }

  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).slice(0, 4)
      setSelectedFiles(files)
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-16 transition-colors ${isDragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 hover:bg-gray-100 bg-gray-50"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            type="button"
            onClick={handleBrowseClick}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Drop files or click to browse"
          />

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>

            {selectedFiles && selectedFiles.length > 0 ? (
              <>
                <ul className="mb-2 text-sm font-medium text-gray-900 space-y-1">
                  {selectedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500">
                  Total:{" "}
                  {(
                    selectedFiles.reduce((acc, f) => acc + f.size, 0) /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </>
            ) : (
              <>
                <p className="mb-2 text-sm font-medium text-gray-900">
                  Drop your CSV files here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  CSV files only (Max 10MB each)
                </p>
              </>
            )}
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            multiple
          />
        </div>

        <Button
          type="submit"
          disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </>
          )}
        </Button>
      </form>

      {/* File Requirements Section */}
      <div className="">
        <div className="px-1 pb-4 pt-1 flex items-center">
          <h3 className="text-sm font-medium text-gray-900">
            File Requirements
          </h3>
        </div>
        <div className="">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-start rounded-md p-1">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700">
                Files must be in CSV format
              </span>
            </li>
            <li className="flex items-start rounded-md p-1">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700">
                Each row should represent a sample with wavelength data
              </span>
            </li>
            <li className="flex items-start rounded-md p-1">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700">
                Headers should clearly identify wavelength values
              </span>
            </li>
            <li className="flex items-start rounded-md p-1">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700">
                Maximum file size: 10MB
              </span>
            </li>
            <li className="flex items-start rounded-md p-1">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
              <span className="text-sm text-gray-700">
                No more than 4 files (scans) for one sample can be uploaded
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
