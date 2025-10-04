
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptControls } from './components/PromptControls';
import { editImage } from './services/geminiService';
import { urlToInlineData } from './utils/fileUtils';
import { InfoIcon, LightbulbIcon } from './components/Icons';

const INITIAL_IMAGE_URL = 'https://storage.googleapis.com/static.a-shared-cache.net/31336a10-c466-4c45-8869-74d39360824b/original.webp';
const INITIAL_PROMPT = "Ella sonrie y bebe de su trago";

type InlineData = {
  mimeType: string;
  data: string;
};

export default function App() {
  const [prompt, setPrompt] = useState<string>(INITIAL_PROMPT);
  const [originalImage, setOriginalImage] = useState<InlineData | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseText, setApiResponseText] = useState<string>('');

  useEffect(() => {
    const loadInitialImage = async () => {
      try {
        setError(null);
        setLoading(true);
        const inlineData = await urlToInlineData(INITIAL_IMAGE_URL);
        setOriginalImage(inlineData);
      } catch (err) {
        setError('Failed to load initial image. Please try refreshing the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialImage();
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt || !originalImage) {
      setError('Please enter a prompt and ensure the original image is loaded.');
      return;
    }

    setLoading(true);
    setError(null);
    setEditedImage(null);
    setApiResponseText('');

    try {
      const result = await editImage(originalImage.data, originalImage.mimeType, prompt);
      if (result.image) {
        setEditedImage(`data:image/jpeg;base64,${result.image}`);
      } else {
        setError('The AI did not return an image. It might have refused the request.');
      }
      setApiResponseText(result.text || 'No text response from the AI.');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [prompt, originalImage]);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        setLoading(true);
        setError(null);
        setEditedImage(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setOriginalImage({ mimeType: file.type, data: base64String });
            setLoading(false);
        };
        reader.onerror = () => {
            setError('Failed to read the uploaded file.');
            setLoading(false);
        };
        reader.readAsDataURL(file);
    } catch (err) {
        setError('An error occurred while processing the file upload.');
        console.error(err);
        setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-300">1. Source Image</h2>
            <ImageDisplay 
              label="Original" 
              imageSrc={originalImage ? `data:${originalImage.mimeType};base64,${originalImage.data}` : undefined} 
              isLoading={!originalImage && loading} 
            />
             <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-700 file:text-white hover:file:bg-violet-600 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-300">2. Describe Your Edit</h2>
             <PromptControls
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleGenerate}
              isLoading={loading}
            />
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><LightbulbIcon/> Prompt Ideas</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>"Change the background to a futuristic cityscape at night."</li>
                    <li>"Make her hair vibrant blue."</li>
                    <li>"Add a pair of sunglasses."</li>
                    <li>"Turn this into a fantasy-style portrait."</li>
                </ul>
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-300">3. Result</h2>
             {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <ImageDisplay 
              label="Edited" 
              imageSrc={editedImage || undefined}
              isLoading={loading && !editedImage}
              placeholderText="The generated image will appear here."
            />
             {apiResponseText && !loading && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><InfoIcon /> AI Response</h3>
                <p className="text-gray-400 italic">{apiResponseText}</p>
              </div>
            )}
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto text-center py-6 text-gray-500 text-sm">
        Powered by Gemini API.
      </footer>
    </div>
  );
}
