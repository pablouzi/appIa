
import React from 'react';
import { MagicWandIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full shadow-lg mb-4">
          <MagicWandIcon />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Gemini Image Editor
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Bring your creative ideas to life. Describe the changes, and let AI do the magic.
        </p>
    </header>
  );
};
