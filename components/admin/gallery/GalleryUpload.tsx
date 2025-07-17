"use client";

import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadToBlob } from "@/lib/utils/blob-upload";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  FileImage,
  Loader2,
} from "lucide-react";
import NextImage from "next/image";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  result?: {
    url: string;
    pathname: string;
    size: number;
    contentType: string;
  };
}

interface GalleryUploadProps {
  onUploadComplete: (files: UploadFile[]) => void;
  onClose: () => void;
  className?: string;
}

/**
 * Gallery upload component with drag-and-drop support
 * Integrates with existing blob upload service
 */
export function GalleryUpload({
  onUploadComplete,
  onClose,
  className,
}: GalleryUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Accepted file types (matching blob upload service)
  const acceptedTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ file, errors }) => ({
          fileName: file.name,
          errors: errors.map((e) => e.message),
        }));
        console.error("Rejected files:", errors);
      }

      // Process accepted files
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize: 5 * 1024 * 1024, // 5MB - matching blob upload service
    multiple: true,
  });

  // Remove file
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      const removedFile = prev.find((f) => f.id === id);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  // Upload single file
  const uploadSingleFile = async (
    uploadFile: UploadFile
  ): Promise<UploadFile> => {
    return new Promise((resolve) => {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "uploading" as const, progress: 10 }
            : f
        )
      );

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      // Upload to blob storage
      uploadToBlob(uploadFile.file, {
        folder: "gallery", // Use gallery folder instead of blog
        contentType: uploadFile.file.type,
      })
        .then((result) => {
          clearInterval(progressInterval);
          const updatedFile: UploadFile = {
            ...uploadFile,
            status: "success",
            progress: 100,
            result,
          };

          setFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? updatedFile : f))
          );

          resolve(updatedFile);
        })
        .catch((error) => {
          clearInterval(progressInterval);
          const updatedFile: UploadFile = {
            ...uploadFile,
            status: "error",
            progress: 0,
            error: error instanceof Error ? error.message : "Upload failed",
          };

          setFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? updatedFile : f))
          );

          resolve(updatedFile);
        });
    });
  };

  // Upload all files
  const uploadAllFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const pendingFiles = files.filter((f) => f.status === "pending");
      const uploadPromises = pendingFiles.map(uploadSingleFile);

      await Promise.all(uploadPromises);

      // Get successful uploads
      const successfulFiles = files.filter((f) => f.status === "success");
      if (successfulFiles.length > 0) {
        onUploadComplete(successfulFiles);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  };

  // Get upload statistics
  const stats = {
    total: files.length,
    pending: files.filter((f) => f.status === "pending").length,
    uploading: files.filter((f) => f.status === "uploading").length,
    success: files.filter((f) => f.status === "success").length,
    error: files.filter((f) => f.status === "error").length,
  };

  const canUpload = stats.pending > 0 && !isUploading;
  const allComplete =
    stats.total > 0 && stats.pending === 0 && stats.uploading === 0;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Upload Images</h3>
              <p className="text-sm text-muted-foreground">
                Add new images to your gallery
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25"
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? "Drop images here"
                    : "Drag & drop images here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>JPEG, PNG, WebP, GIF</span>
                <span>•</span>
                <span>Max 5MB per file</span>
                <span>•</span>
                <span>Multiple files supported</span>
              </div>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-4">
              {/* Upload stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{stats.total} files</span>
                  {stats.success > 0 && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-700"
                    >
                      {stats.success} uploaded
                    </Badge>
                  )}
                  {stats.error > 0 && (
                    <Badge variant="destructive">{stats.error} failed</Badge>
                  )}
                  {stats.uploading > 0 && (
                    <Badge variant="secondary">
                      {stats.uploading} uploading
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearAllFiles}>
                    Clear all
                  </Button>
                  {canUpload && (
                    <Button size="sm" onClick={uploadAllFiles}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {stats.pending} files
                    </Button>
                  )}
                </div>
              </div>

              {/* Files grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <Card className="overflow-hidden">
                        {/* Image preview */}
                        <div className="relative aspect-video bg-muted">
                          <NextImage
                            src={file.preview}
                            alt={file.file.name}
                            fill
                            className="object-cover"
                          />

                          {/* Status overlay */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            {file.status === "pending" && (
                              <FileImage className="w-8 h-8 text-white" />
                            )}
                            {file.status === "uploading" && (
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            )}
                            {file.status === "success" && (
                              <div className="bg-green-500 rounded-full p-2">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {file.status === "error" && (
                              <div className="bg-red-500 rounded-full p-2">
                                <AlertCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* File info */}
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium truncate">
                              {file.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.file.size)}
                            </p>

                            {/* Progress bar */}
                            {file.status === "uploading" && (
                              <Progress value={file.progress} className="h-1" />
                            )}

                            {/* Error message */}
                            {file.status === "error" && file.error && (
                              <Alert variant="destructive" className="p-2">
                                <AlertCircle className="h-3 w-3" />
                                <AlertDescription className="text-xs">
                                  {file.error}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Footer actions */}
          {allComplete && stats.success > 0 && (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {stats.success} file{stats.success !== 1 ? "s" : ""} uploaded
                  successfully
                </span>
              </div>
              <Button onClick={onClose} size="sm">
                Continue to Gallery
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
