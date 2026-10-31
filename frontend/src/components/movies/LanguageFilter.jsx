import React from 'react';
import { LANGUAGES, FORMATS } from '../../data/moviesData';
import { Globe, Layers } from 'lucide-react';

export const LanguageFilter = ({ 
  selectedLanguage, 
  onSelectLanguage,
  selectedFormat,
  onSelectFormat
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-zinc-800/80 bg-zinc-950/30 px-4 rounded-2xl mb-8">
      
      {/* Language Filter */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>Languages:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {LANGUAGES.map((lang) => {
            const isActive = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => onSelectLanguage(lang)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Filter */}
      {onSelectFormat && (
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Format:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {FORMATS.slice(0, 5).map((format) => {
              const isActive = selectedFormat === format;
              return (
                <button
                  key={format}
                  onClick={() => onSelectFormat(format)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-950/40'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                  }`}
                >
                  {format}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
