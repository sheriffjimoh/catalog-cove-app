

import React from 'react';
import { Upload } from 'lucide-react';  
import { FileUploadProps } from '@/types/input.type';

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  onChange, 
  error, 
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          onChange={onChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center
          hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
          ${error ? 'border-red-300' : ''}`}>
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>}
    </div>
  )
}
