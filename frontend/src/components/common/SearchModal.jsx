import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Film, Sparkles, Database } from 'lucide-react';
import { MOVIES as FALLBACK_MOVIES } from '../../data/moviesData';
import movieService from '../../services/movieService';
import { FormatBadge } from './Badge';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [dbResults, setDbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setDbResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const movies = await movieService.searchMovies(query);
        if (movies && movies.length > 0) {
          setDbResults(movies);
        } else {
          setDbResults([]);
        }
      } catch {
        setDbResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  // Local filtered fallback
  const localFiltered = query.trim() === '' ? [] : FALLBACK_MOVIES.filter((movie) => {
    const q = query.toLowerCase();
    const matchTitle = movie.title.toLowerCase().includes(q);
    const matchLang = movie.language.toLowerCase().includes(q) || movie.availableLanguages?.some((l) => l.toLowerCase().includes(q));
    const matchGenre = Array.isArray(movie.genre) ? movie.genre.some((g) => g.toLowerCase().includes(q)) : movie.genre?.toLowerCase().includes(q);
    return matchTitle || matchLang || matchGenre;
  });

  const displayedMovies = dbResults.length > 0 ? dbResults : localFiltered;

  const handleSelectMovie = (movieId) => {
    setQuery('');
    onClose();
    navigate(`/movie/${movieId}`);
  };

  const quickPills = ['Kalki 2898 AD', 'Tamil Movies', 'Sci-Fi', 'IMAX 3D', 'Malayalam', 'Jawan'];

  return (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0f121a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-zinc-800 bg-zinc-950/60">
          <Search className="w-5 h-5 text-red-500 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search movies, languages (Hindi, Telugu, Tamil...), actors, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          {isSearching && (
            <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions (when query is empty) */}
        {query.trim() === '' ? (
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setQuery(pill)}
                  className="px-3 py-1.5 rounded-full text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-red-500/50 hover:text-white transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Popular in Theatres Now
            </div>
            <div className="space-y-2">
              {FALLBACK_MOVIES.slice(0, 3).map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {movie.language} • {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mr-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-2 mb-2 font-medium">
              <span>Found {displayedMovies.length} matching movies</span>
              {dbResults.length > 0 && (
                <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <Database className="w-3 h-3" /> Database Search
                </span>
              )}
            </div>

            {displayedMovies.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-sm">
                <Film className="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-400" />
                <p>No movies found matching "{query}"</p>
                <p className="text-xs text-zinc-600 mt-1">Try searching by language (e.g. Tamil, Telugu, Hindi) or title.</p>
              </div>
            ) : (
              displayedMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-red-500/40 hover:bg-zinc-800/60 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-lg shrink-0 shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-2">
                        <span>{movie.title}</span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        <span className="text-red-400 font-semibold">{movie.language}</span> • {typeof movie.genre === 'string' ? movie.genre : movie.genre?.join(', ')} • {movie.duration}
                      </p>
                      {movie.director && (
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Directed by {movie.director}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
