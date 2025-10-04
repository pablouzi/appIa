
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SparklesIcon } from './Icons';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, onPromptChange, onSubmit, isLoading }) => {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g., 'Change the background to a sunset over the ocean'"
        className="w-full h-28 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-200 placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 h-12"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Generating...</span>
          </>
        ) : (
          <>
            <SparklesIcon />
            <span className="ml-2">Generate</span>
          </>
        )}
      </button>
    </div>
  );
};
