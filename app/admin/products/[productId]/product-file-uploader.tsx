"use client";

import { useState, useRef } from "react";
import { uploadProductFile, deleteProductFile } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText, Loader2, ExternalLink } from "lucide-react";

interface ProductFileUploaderProps {
  productId: string;
  currentFileUrl: string | null;
}

export function ProductFileUploader({
  productId,
  currentFileUrl,
}: ProductFileUploaderProps) {
  const [fileUrl, setFileUrl] = useState(currentFileUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileName = (url: string) => {
    try {
      const pathname = new URL(url).pathname;
      return pathname.split("/").pop() || "Uploaded file";
    } catch {
      return "Uploaded file";
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProductFile(productId, formData);

      if (result.success && result.fileUrl) {
        setFileUrl(result.fileUrl);
      } else {
        setError(result.error || "Failed to upload");
      }
    } catch {
      setError("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this file?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteProductFile(productId);
      if (result.success) {
        setFileUrl(null);
      } else {
        setError(result.error || "Failed to delete");
      }
    } catch {
      setError("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Product File</label>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {fileUrl ? (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-accent"
          >
            <FileText className="h-4 w-4" />
            {getFileName(fileUrl)}
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No file uploaded. Upload a file for customers to download after purchase.
        </p>
      )}

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {fileUrl ? "Replace File" : "Upload File"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
