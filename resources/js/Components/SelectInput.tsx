import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  icon?: React.ComponentType<{ size?: number }>;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ 
  label,
  error, 
  icon: Icon, 
  required = false,
  options,
  placeholder = 'Select an option',
  className = '',
  ...selectProps
}) => {
  const hasIcon = !!Icon;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800 dark:text-white">
        {label} {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <select
          {...selectProps}
          value={selectProps.value} // ✅ ensure value is explicitly passed here
          onChange={selectProps.onChange} // ✅ ensure controlled input
          className={`
            w-full
            ${hasIcon ? 'pl-10' : 'pl-4'}
            pr-10
            py-2.5
            text-sm
            text-gray-900
            dark:text-white
           bg-gray-100
            dark:bg-gray-800
            border
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'}
            rounded-lg
            focus:outline-none
            focus:ring-2
            transition-colors
            appearance-none
            cursor-pointer
            ${selectProps.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            ${className}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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