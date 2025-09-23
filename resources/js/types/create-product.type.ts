// Type definitions
export interface ImageUpload {
  id: number;
  file: File;
  preview: string;
  name: string;
}

export interface FormData {
  name: string;
  description: string;
  price: string;
  stock: number;
  images: File[];
}

export interface FormErrors {
  error: any;
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  images?: string;
}

export interface AILoadingState {
  title: boolean;
  description: boolean;
  background: number | null;
}

export type AIActionType = 'title' | 'description' | 'background';

export interface ModernCreateProps {
  errors?: FormErrors;
}