"use client"

import React, { useCallback, useState, useRef } from "react"
import { Upload, X, FileText, Shield, Loader2, Check, AlertCircle } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DocumentType, KycDocument } from "@/lib/api/verification"
import { uploadDocument, deleteDocument } from "@/lib/api/verification"
import { showApiErrorToast } from "@/hooks/use-toast"

// ── Types ──────────────────────────────────────────────────────────────────────

interface DocumentUploaderProps {
  userId: string
  documents: KycDocument[]
  authToken?: string
  onDocumentsChange?: (docs: KycDocument[]) => void
}

interface UploadFile {
  file: File
  type: DocumentType
  progress: number
  status: "idle" | "uploading" | "done" | "error"
  documentId?: string
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  id_front: "ID Front",
  id_back: "ID Back",
  passport: "Passport",
  proof_of_address: "Proof of Address",
  selfie: "Selfie / Portrait",
}

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.pdf"
const MAX_SIZE_MB = 10

// ── Component ──────────────────────────────────────────────────────────────────

export function DocumentUploader({
  userId,
  documents,
  authToken,
  onDocumentsChange,
}: DocumentUploaderProps) {
  const [queue, setQueue] = useState<UploadFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (files: FileList | null, type: DocumentType) => {
      if (!files) return
      const newFiles: UploadFile[] = []

      Array.from(files).forEach((file) => {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          sonnerToast.error(`${file.name} exceeds ${MAX_SIZE_MB}MB limit`)
          return
        }
        newFiles.push({ file, type, progress: 0, status: "idle" })
      })

      if (newFiles.length > 0) {
        setQueue((prev) => [...prev, ...newFiles])
      }
    },
    []
  )

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = useCallback(
    async (item: UploadFile, index: number) => {
      setQueue((prev) =>
        prev.map((q, i) => (i === index ? { ...q, status: "uploading" as const } : q))
      )

      try {
        const doc = await uploadDocument({
          userId,
          type: item.type,
          file: item.file,
          encrypt: true,
          authToken,
        })

        setQueue((prev) => prev.filter((_, i) => i !== index))
        onDocumentsChange?.([...documents, doc])
        sonnerToast.success(`${item.file.name} uploaded successfully`)
      } catch (error) {
        setQueue((prev) =>
          prev.map((q, i) => (i === index ? { ...q, status: "error" as const } : q))
        )
        showApiErrorToast(error, "Upload failed")
      }
    },
    [userId, authToken, documents, onDocumentsChange]
  )

  const handleDelete = useCallback(
    async (docId: string) => {
      try {
        await deleteDocument(docId, authToken)
        onDocumentsChange?.(documents.filter((d) => d.id !== docId))
        sonnerToast.success("Document deleted")
      } catch (error) {
        showApiErrorToast(error, "Failed to delete document")
      }
    },
    [authToken, documents, onDocumentsChange]
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files, "id_front")
          }
        }}
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop files here, or{" "}
          <button
            className="text-primary underline-offset-2 hover:underline"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to {MAX_SIZE_MB}MB</p>
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <Shield className="size-3" />
          End-to-end encrypted
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files, "id_front")}
        />
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Pending Uploads</h4>
          {queue.map((item, idx) => (
            <div
              key={`${item.file.name}-${idx}`}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <FileText className="size-5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm">{item.file.name}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {DOCUMENT_TYPE_LABELS[item.type]}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              {item.status === "idle" && (
                <>
                  <Button size="sm" onClick={() => handleUpload(item, idx)}>
                    <Upload className="mr-1 size-3.5" />
                    Upload
                  </Button>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeFromQueue(idx)}>
                    <X className="size-3.5" />
                  </Button>
                </>
              )}

              {item.status === "uploading" && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}

              {item.status === "error" && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3.5" />
                  Failed
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded documents */}
      {documents.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Uploaded Documents</h4>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <FileText className="size-5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm">{doc.filename}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {DOCUMENT_TYPE_LABELS[doc.type]}
                  </Badge>
                  {doc.encrypted && (
                    <Badge variant="secondary" className="h-4 gap-0.5 text-[10px]">
                      <Shield className="size-2.5" />
                      Encrypted
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              <Badge
                variant={
                  doc.status === "approved"
                    ? "default"
                    : doc.status === "rejected"
                    ? "destructive"
                    : doc.status === "pending"
                    ? "secondary"
                    : "outline"
                }
                className="text-[10px]"
              >
                {doc.status}
              </Badge>

              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(doc.id)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
