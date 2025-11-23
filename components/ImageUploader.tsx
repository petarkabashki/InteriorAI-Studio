import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageFile) => void;
  currentImage: string | null;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, currentImage, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data and mime type
      // Data URL format: "data:image/jpeg;base64,....."
      const [header, base64Data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';

      onImageSelected({
        data: base64Data,
        mimeType: mimeType,
        preview: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerInput = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm group">
          <img 
            src={currentImage} 
            alt="Original Space" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={triggerInput}
              disabled={disabled}
              className="bg-white text-stone-900 px-4 py-2 rounded-full font-medium hover:bg-stone-100 transition-colors"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex-1 flex flex-col items-center justify-center p-8 
            border-2 border-dashed rounded-xl transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-stone-300 bg-white hover:border-primary-400 hover:bg-stone-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className={`
            p-4 rounded-full mb-4
            ${isDragging ? 'bg-primary-200' : 'bg-stone-100 text-stone-500'}
          `}>
            {isDragging ? <ImageIcon className="text-primary-700" size={32} /> : <Upload size={32} />}
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-1">
            Upload your space
          </h3>
          <p className="text-sm text-stone-500 text-center max-w-xs">
            Drag and drop your room photo here, or click to browse.
          </p>
        </div>
      )}
    </div>
  );
};