import React, { useState, useRef } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploadProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  value?: File | null;
  preview?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  error,
  required = false,
  value,
  preview,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log({
    preview
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Generate preview URL for the selected file
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    
    onChange(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      
      // Generate preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Create a synthetic event for onChange
      const syntheticEvent = {
        target: {
          files: files,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
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

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Create a synthetic event with no files
    const syntheticEvent = {
      target: {
        files: null,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  console.log({
    previewUrl
  })

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div 
          className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
            ${dragActive 
              ? 'border-purple-500 bg-purple-100' 
              : selectedFile || previewUrl
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {(selectedFile || previewUrl) ? (
            <div className="space-y-3">
              {/* Image Preview */}
              {previewUrl && (
                <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden border-2 border-green-200">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {selectedFile && (
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Check className="text-green-500" size={20} />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="text-red-500" size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-green-600">
                {selectedFile ? 'File ready to upload. Click to change.' : 'Click to change image.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};