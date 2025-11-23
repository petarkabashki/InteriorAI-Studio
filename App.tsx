import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { editImageWithGemini } from './services/geminiService';
import { ImageFile, ProcessingState } from './types';
import { Wand2, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });

  const handleImageSelected = (image: ImageFile) => {
    setCurrentImage(image);
    setGeneratedImage(null);
    setProcessingState({ status: 'idle' });
  };

  const handleGenerate = async () => {
    if (!currentImage || !prompt.trim()) return;

    setProcessingState({ status: 'processing', message: 'Analyzing your space...' });
    
    try {
      // Small delay to show analyzing state before switching to generating
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingState({ status: 'processing', message: 'Applying design changes...' });

      const resultBase64 = await editImageWithGemini(
        currentImage.data,
        currentImage.mimeType,
        prompt
      );

      // Construct proper data URL
      const resultDataUrl = `data:image/png;base64,${resultBase64}`;
      setGeneratedImage(resultDataUrl);
      setProcessingState({ status: 'success' });
    } catch (error) {
      console.error(error);
      setProcessingState({ 
        status: 'error', 
        message: 'Failed to generate design. Please try again or refine your prompt.' 
      });
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setProcessingState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              Reimagine Your Space
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Upload a photo of your room and use AI to redesign it. 
              Change the style, colors, or furniture instantly with simple text descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Input */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-stone-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-sm font-bold text-stone-600">1</span>
                    Upload Photo
                  </h2>
                  {currentImage && (
                    <button 
                        onClick={handleReset}
                        className="text-xs font-medium text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                        <RefreshCw size={12} /> Reset
                    </button>
                  )}
                </div>
                
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={currentImage?.preview || null}
                  disabled={processingState.status === 'processing'}
                />
              </div>

              {/* Prompt Input */}
              <div className={`bg-white p-6 rounded-2xl shadow-sm border border-stone-200 transition-opacity ${!currentImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="mb-4">
                    <h2 className="font-medium text-stone-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-sm font-bold text-stone-600">2</span>
                        Describe Changes
                    </h2>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'Make the walls sage green and add a mid-century modern leather sofa' or 'Remove the chair in the corner'"
                    className="w-full min-h-[120px] p-4 rounded-xl border border-stone-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none text-stone-800 placeholder-stone-400 text-base transition-shadow"
                    disabled={processingState.status === 'processing'}
                  />
                  
                  <button
                    onClick={handleGenerate}
                    disabled={!currentImage || !prompt.trim() || processingState.status === 'processing'}
                    className={`
                      w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg shadow-primary-500/20
                      flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                      ${(!currentImage || !prompt.trim() || processingState.status === 'processing') 
                        ? 'bg-stone-300 shadow-none cursor-not-allowed text-stone-500' 
                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
                      }
                    `}
                  >
                    {processingState.status === 'processing' ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {processingState.message}
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Generate Design
                      </>
                    )}
                  </button>
                  
                  {processingState.status === 'error' && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{processingState.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:sticky lg:top-24 space-y-6">
                 {generatedImage ? (
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 animate-in fade-in duration-500">
                        <ResultViewer 
                            originalImage={currentImage?.preview || ''}
                            generatedImage={generatedImage}
                        />
                     </div>
                 ) : (
                     <div className="bg-stone-100 rounded-2xl border-2 border-dashed border-stone-200 h-[400px] lg:h-[600px] flex flex-col items-center justify-center text-stone-400 p-8 text-center">
                        {processingState.status === 'processing' ? (
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                                <p className="font-medium text-stone-600 animate-pulse">Dreaming up your new room...</p>
                             </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-2xl bg-stone-200 flex items-center justify-center mb-4">
                                    <SparklesIcon className="text-stone-400" />
                                </div>
                                <h3 className="text-lg font-medium text-stone-500 mb-2">Ready to Design</h3>
                                <p className="text-sm max-w-xs mx-auto">
                                    Your generated interior design visualization will appear here.
                                </p>
                            </>
                        )}
                     </div>
                 )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 bg-white border-t border-stone-200 mt-12">
        <div className="container mx-auto px-4 text-center text-stone-400 text-sm">
          <p>© {new Date().getFullYear()} InteriorAI Studio. Built with React, Tailwind & Gemini 2.5.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper icon component for empty state
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
        width="32"
        height="32"
    >
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
);

export default App;