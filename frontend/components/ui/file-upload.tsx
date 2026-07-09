"use client"

import { useState, useRef } from 'react'
import { Upload, File } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FileUploadProps {
  className?: string
  onFileSelect?: (file: File) => void
  accept?: string
}

export function FileUpload({ className, onFileSelect, accept = '.xlsx,.xls,.csv' }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
    selectedFiles.forEach(file => onFileSelect?.(file))
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50 transition-colors hover:border-primary hover:bg-secondary"
      >
        <Upload className="mb-2 size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">点击或拖拽上传文件</p>
        <p className="mt-1 text-xs text-muted-foreground">支持 .xlsx .xls .csv 格式</p>
      </button>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <File className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                移除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}