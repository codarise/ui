import { Upload } from "lucide-react"
import { useCallback, useRef, useState } from "react"

import { IconWrapper } from "../custom/icon-wrapper"
import { cn } from "../lib/utils"

export interface UploadDropzoneProps {
  /** Called with the selected/dropped files */
  onFiles: (files: File[]) => void
  /** File input accept attribute, e.g. '.md' or 'image/*' */
  accept?: string
  /** Allow multiple files (default: true) */
  multiple?: boolean
  /** Visual variant — 'prominent' is larger with centered layout */
  variant?: "compact" | "prominent"
  /** Icon component, defaults to Upload */
  icon?: React.ElementType<{ className?: string }>
  /** Custom label text */
  label?: string
  /** Custom active (dragging) label text */
  activeLabel?: string
  className?: string
}

/**
 * Drag & drop file upload zone with click-to-select.
 * Uses a drag counter to avoid flicker when dragging over child elements.
 * Self-contained — no external hooks required.
 */
export function UploadDropzone({
  onFiles,
  accept,
  multiple = true,
  variant = "compact",
  icon: Icon = Upload,
  label = "Drop files here or click to upload",
  activeLabel = "Drop files here to upload",
  className,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounterRef = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current === 1) setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) onFiles(files)
    },
    [onFiles]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (files.length > 0) onFiles(files)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [onFiles]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (variant === "prominent") {
    return (
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          className
        )}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <IconWrapper
          icon={Icon}
          className={cn(
            "mb-3 h-10 w-10",
            isDragOver ? "text-primary" : "text-muted-foreground"
          )}
        />
        <p className="text-base font-medium">
          {isDragOver ? activeLabel : label}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-5 transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        className
      )}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          isDragOver ? "text-primary" : "text-muted-foreground"
        )}
      />
      <p className="flex-1 text-sm text-muted-foreground">
        {isDragOver ? activeLabel : label}
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}
