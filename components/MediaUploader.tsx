import React, { useState, useCallback } from 'react';
import { UploadIcon, PhotoIcon, VideoIcon, AudioIcon } from './icons';

type MediaType = 'image' | 'video' | 'audio';

interface MediaUploaderProps {
  onMediaSelect: (file: File, type: MediaType) => void;
  isAnalyzing: boolean;
  currentMedia: { url: string; type: MediaType } | null;
}

const mediaConfig = {
    image: {
        accept: 'image/png, image/jpeg, image/webp',
        icon: <PhotoIcon className="h-5 w-5 mr-2" />,
        label: 'Image',
        prompt: 'PNG, JPG, or WEBP'
    },
    video: {
        accept: 'video/mp4, video/webm, video/quicktime, video/mov',
        icon: <VideoIcon className="h-5 w-5 mr-2" />,
        label: 'Video',
        prompt: 'MP4, WEBM, or MOV'
    },
    audio: {
        accept: 'audio/mpeg, audio/wav, audio/ogg, audio/mp3',
        icon: <AudioIcon className="h-5 w-5 mr-2" />,
        label: 'Audio',
        prompt: 'MP3, WAV, or OGG'
    }
};

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaSelect, isAnalyzing, currentMedia }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<MediaType>('image');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onMediaSelect(event.target.files[0], activeTab);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onMediaSelect(event.dataTransfer.files[0], activeTab);
    }
  }, [onMediaSelect, activeTab]);

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
  
  const TabButton: React.FC<{type: MediaType}> = ({ type }) => {
      const config = mediaConfig[type];
      const isActive = activeTab === type;
      return (
        <button
            onClick={() => setActiveTab(type)}
            disabled={isAnalyzing}
            className={`flex items-center justify-center w-full px-4 py-3 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-secondary rounded-t-lg ${isActive ? 'bg-brand-primary text-brand-accent border-b-2 border-brand-accent' : 'bg-transparent text-brand-text-secondary hover:bg-brand-primary/50'}`}
        >
            {config.icon}
            {config.label}
        </button>
      )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 border-b border-brand-border mb-6">
        <TabButton type="image" />
        <TabButton type="video" />
        <TabButton type="audio" />
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex justify-center items-center w-full min-h-[16rem] md:min-h-[20rem] rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-brand-accent bg-blue-500/10' : 'border-brand-border bg-brand-primary'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          accept={mediaConfig[activeTab].accept}
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
        
        <div className="absolute inset-0 p-2">
            {currentMedia?.type === 'image' && (
                <img src={currentMedia.url} alt="Uploaded preview" className="object-contain h-full w-full rounded-md" />
            )}
            {currentMedia?.type === 'video' && (
                <video src={currentMedia.url} controls className="object-contain h-full w-full rounded-md" />
            )}
            {currentMedia?.type === 'audio' && (
                <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary">
                    <AudioIcon className="h-20 w-20 mb-4" />
                    <audio src={currentMedia.url} controls className="w-3/4 max-w-sm" />
                </div>
            )}
        </div>
        
        {!currentMedia && (
            <div className="text-center text-brand-text-secondary pointer-events-none">
                <UploadIcon className="mx-auto h-12 w-12" />
                <p className="mt-2 font-semibold">
                    <span className="text-brand-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs">{mediaConfig[activeTab].prompt}</p>
            </div>
        )}

      </div>
    </div>
  );
};
