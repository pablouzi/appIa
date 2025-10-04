
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageIcon } from './Icons';

interface ImageDisplayProps {
  label: string;
  imageSrc?: string;
  isLoading: boolean;
  placeholderText?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageSrc, isLoading, placeholderText = "Image will be displayed here." }) => {
  return (
    <div className="w-full aspect-square bg-gray-800 rounded-xl border-2 border-dashed border-gray-700 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-all duration-300">
      <span className="absolute top-2 left-3 bg-gray-900/70 text-gray-300 px-3 py-1 text-sm font-semibold rounded-full backdrop-blur-sm">
        {label}
      </span>
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <LoadingSpinner />
          <p>Processing...</p>
        </div>
      ) : imageSrc ? (
        <img 
          src={imageSrc} 
          alt={label} 
          className="w-full h-full object-contain rounded-md"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-gray-500 text-center">
            <ImageIcon />
            <p>{placeholderText}</p>
        </div>
      )}
    </div>
  );
};
