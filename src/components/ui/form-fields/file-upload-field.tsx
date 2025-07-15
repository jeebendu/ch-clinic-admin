import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";

interface FileUploadFieldProps {
  id: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileChange?: (files: FileList | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FileUploadField({
  id,
  label,
  accept,
  multiple = false,
  maxSize = 10,
  onFileChange,
  error,
  required,
  className,
  disabled
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    onFileChange?.(files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
      htmlFor={id}
    >
      <div className="space-y-2">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border",
            error ? "border-destructive" : "",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drop files here or click to browse
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground mt-1">
              Max file size: {maxSize}MB
            </p>
          )}
        </div>

        <Input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseField>
  );
}