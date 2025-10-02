// Type definitions
export interface ImageUpload {
  id: string;
  file: File | null;
  preview: string;
  name: string;
  lastUpdated: Date;
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
  background: string | null;
}

export type AIActionType = 'title' | 'description' | 'background';

export interface ModernCreateProps {
  errors?: FormErrors;
}