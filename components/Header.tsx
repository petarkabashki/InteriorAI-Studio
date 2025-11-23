import React from 'react';
import { Sparkles, LayoutTemplate } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-600 rounded-lg text-white">
            <LayoutTemplate size={20} />
          </div>
          <span className="text-xl font-serif font-bold text-stone-800 tracking-tight">InteriorAI Studio</span>
        </div>
        <div className="flex items-center gap-4">
           <a 
            href="https://ai.google.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-primary-600 transition-colors"
          >
            <Sparkles size={14} />
            Powered by Gemini
          </a>
        </div>
      </div>
    </header>
  );
};