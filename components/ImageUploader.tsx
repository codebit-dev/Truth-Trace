
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
  currentImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isAnalyzing, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageSelect(event.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="p-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex justify-center items-center w-full h-64 md:h-80 rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-brand-accent bg-blue-500/10' : 'border-brand-border bg-brand-primary'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
        {currentImage && (
            <img src={currentImage} alt="Uploaded preview" className="object-contain h-full w-full rounded-md" />
        )}
        
        {!currentImage && (
            <div className="text-center text-brand-text-secondary">
                <UploadIcon className="mx-auto h-12 w-12" />
                <p className="mt-2 font-semibold">
                    <span className="text-brand-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs">PNG, JPG, or WEBP</p>
            </div>
        )}

      </div>
    </div>
  );
};
