import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { TextInputProps, FormInputProps } from '@/Types/input.type';


const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref,
) {
  const localRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={
        'w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white text-gray-900 placeholder-gray-400 ' +
        className
      }
      ref={localRef}
    />
  );
});



const FormInput: React.FC<FormInputProps> = ({ 
  label,
  error, 
  icon: Icon, 
  required = false,
  className = '',
  ...inputProps
}) => {
  const hasIcon = !!Icon;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {!required && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Icon size={18} />
          </div>
        )}
        <TextInput
          {...inputProps}
          className={`${hasIcon ? 'pl-[2rem]' : 'pl-4'} ${error ? 'border-red-300 focus:ring-red-500' : ''} ${className}`}
        />
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

export { TextInput, FormInput };