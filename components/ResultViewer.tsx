import React, { useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface ResultViewerProps {
  originalImage: string;
  generatedImage: string;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ originalImage, generatedImage }) => {
  const [viewMode, setViewMode] = useState<'split' | 'compare'>('split');

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `interior-ai-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* View Controls */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif text-xl font-medium text-stone-800">Design Result</h3>
        <div className="flex gap-2">
            <button 
                onClick={downloadImage}
                className="p-2 text-stone-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Download Result"
            >
                <Download size={20} />
            </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative w-full aspect-square md:aspect-auto md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
        <img 
            src={generatedImage} 
            alt="Generated Design" 
            className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4">
            <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide">
                GENERATED
            </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-stone-500">
            Tip: Be specific with your next prompt to refine details.
        </p>
      </div>
    </div>
  );
};