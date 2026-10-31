import React, { useState } from 'react';
import { MovieCard } from './MovieCard';
import { Film, Calendar, Layers } from 'lucide-react';

export const MovieGrid = ({ 
  movies, 
  selectedLanguage, 
  selectedFormat,
  onPlayTrailer 
}) => {
  const [activeTab, setActiveTab] = useState('now_showing'); // 'now_showing' | 'upcoming' | '3d_specials'

  // Filter movies based on tab, language, format
  const filteredMovies = movies.filter((movie) => {
    // Tab filter
    if (activeTab === 'now_showing' && movie.status !== 'now_showing') return false;
    if (activeTab === 'upcoming' && movie.status !== 'upcoming') return false;
    if (activeTab === '3d_specials' && !movie.formats.some(f => f.includes('3D') || f.includes('IMAX'))) return false;

    // Language filter
    if (selectedLanguage && selectedLanguage !== 'All') {
      const matchPrimary = movie.language.toLowerCase() === selectedLanguage.toLowerCase();
      const matchAvailable = movie.availableLanguages.some(
        l => l.toLowerCase() === selectedLanguage.toLowerCase()
      );
      if (!matchPrimary && !matchAvailable) return false;
    }

    // Format filter
    if (selectedFormat && selectedFormat !== 'All Formats') {
      if (!movie.formats.includes(selectedFormat)) return false;
    }

    return true;
  });

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <button
            onClick={() => setActiveTab('now_showing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'now_showing'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Now Showing</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Releases</span>
          </button>

          <button
            onClick={() => setActiveTab('3d_specials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === '3d_specials'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">3D & IMAX Showcase</span>
            <span className="sm:hidden">3D Specials</span>
          </button>
        </div>

        {/* Counter */}
        <div className="text-xs text-zinc-500 font-medium">
          Showing <span className="text-white font-semibold">{filteredMovies.length}</span> movies
        </div>
      </div>

      {/* Grid of Movie Cards */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onPlayTrailer={onPlayTrailer} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-8">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
            No movies match language "{selectedLanguage}" in this category. Try switching the language filter or exploring other categories.
          </p>
        </div>
      )}
    </div>
  );
};
