
import React, {  InputHTMLAttributes} from 'react';
import { LucideIcon } from 'lucide-react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
  }

export interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
}


export interface FileUploadProps {
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}


export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: LucideIcon
  required?: boolean
  type?: string
}

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  icon?: LucideIcon
  required?: boolean
}



export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  loading?: boolean
}
