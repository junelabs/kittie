"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { AssetKind } from "../../types";

interface UploadDropzoneProps {
  kitId: string;
  kind: AssetKind;
  onUploadComplete: () => void;
}

export function UploadDropzone({ kitId, kind, onUploadComplete }: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Get upload URL and create asset record
          const uploadResponse = await fetch("/api/assets/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              kitId,
              kind,
              filename: file.name,
              size: file.size,
              mime: file.type,
            }),
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || "Failed to get upload URL");
          }

          const { uploadUrl } = await uploadResponse.json();

          // Upload file to Supabase Storage
          const uploadResult = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadResult.ok) {
            throw new Error("Failed to upload file");
          }

          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [fileId]: -1 })); // -1 indicates error
        }
      });

      await Promise.all(uploadPromises);
      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [kitId, kind, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    disabled: isUploading,
  });

  const getKindLabel = (kind: AssetKind) => {
    switch (kind) {
      case "logo": return "logos";
      case "image": return "images";
      case "doc": return "documents";
      case "bio": return "bio files";
      default: return "files";
    }
  };

  const getKindIcon = (kind: AssetKind) => {
    switch (kind) {
      case "logo": return "🎨";
      case "image": return "🖼️";
      case "doc": return "📄";
      case "bio": return "👤";
      default: return "📁";
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-4xl">{getKindIcon(kind)}</div>
          <div className="text-lg font-medium">
            {isDragActive
              ? `Drop ${getKindLabel(kind)} here`
              : `Upload ${getKindLabel(kind)}`}
          </div>
          <div className="text-sm text-gray-500">
            Drag and drop files here, or click to select
          </div>
          <div className="text-xs text-gray-400">
            Supports: PNG, JPG, PDF, DOC, TXT and more
          </div>
        </div>
      </div>

      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploading files...</div>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{fileId.split("-").slice(0, -1).join("-")}</span>
                <span className="text-gray-500">
                  {progress === -1 ? (
                    <span className="text-red-500 flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      Failed
                    </span>
                  ) : (
                    `${progress}%`
                  )}
                </span>
              </div>
              {progress !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
