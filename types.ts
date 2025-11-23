export interface GeneratedImage {
  id: string;
  originalImage: string; // Base64
  editedImage: string;   // Base64
  prompt: string;
  timestamp: number;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
}

export interface ImageFile {
  data: string;     // Base64 string
  mimeType: string; // Mime type (image/png, image/jpeg, etc.)
  preview: string;  // Data URL for display
}