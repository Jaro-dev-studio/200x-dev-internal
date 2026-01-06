"use client";

import { useState, useRef } from "react";
import { uploadAttachment, deleteAttachment } from "@/lib/actions/lessons";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText, Loader2 } from "lucide-react";
import type { Attachment } from "@prisma/client";

interface AttachmentManagerProps {
  lessonId: string;
  attachments: Attachment[];
}

export function AttachmentManager({
  lessonId,
  attachments: initialAttachments,
}: AttachmentManagerProps) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAttachment(lessonId, formData);

      if (result.success && result.attachment) {
        setAttachments([...attachments, result.attachment as Attachment]);
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

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Delete this attachment?")) return;

    const result = await deleteAttachment(attachmentId);
    if (result.success) {
      setAttachments(attachments.filter((a) => a.id !== attachmentId));
    } else {
      setError(result.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No attachments yet. Upload PDFs, documents, or other resources.
        </p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-accent"
              >
                <FileText className="h-4 w-4" />
                {attachment.name}
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(attachment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
        />
        <Button
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
              Upload Attachment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
