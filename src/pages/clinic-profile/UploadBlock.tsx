import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'

function UploadBlock({
  id,
  label,
  description,
  file,
  preview,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="block font-medium text-sm text-gray-700 mb-1">
        {label}
      </Label>
      <p className="text-xs text-gray-500 mb-2">{description}</p>

      <div className="flex flex-col gap-2 items-center border border-dashed border-gray-300 p-3 rounded-md bg-gray-50">
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            className="w-full h-32 object-contain rounded bg-white border"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400 text-sm bg-white rounded border">
            No file selected
          </div>
        )}
        <Input
          type="file"
          id={id}
          accept="image/*"
          onChange={onChange}
          className="cursor-pointer text-sm"
        />
      </div>
    </div>
  );
}
export default UploadBlock;