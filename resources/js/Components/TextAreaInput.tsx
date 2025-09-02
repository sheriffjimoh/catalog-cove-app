import React from 'react';
import { FormTextareaProps } from '@/Types/input.type';


export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  label, 
  value, 
  onChange, 
  error, 
  icon: Icon, 
  placeholder, 
  required = false, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
            bg-gray-50 hover:bg-white focus:bg-white text-gray-900 placeholder-gray-400 resize-none
            ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>}
    </div>
  )
}