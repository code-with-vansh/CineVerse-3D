import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MovieTrailerHeroCarousel } from '../components/carousel/MovieTrailerHeroCarousel';
import { LanguageFilter } from '../components/movies/LanguageFilter';
import { MovieGrid } from '../components/movies/MovieGrid';
import { TrailerModal } from '../components/movies/TrailerModal';
import { MOVIES as FALLBACK_MOVIES } from '../data/moviesData';
import movieService from '../services/movieService';
import { 
  Box, 
  Eye, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';

export const HomePage = ({ 
  selectedCity, 
  onOpenLocationModal,
  selectedLanguage,
  onSelectLanguage 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [loading, setLoading] = useState(true);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getAllMovies({
        ...(selectedLanguage && selectedLanguage !== 'All' ? { language: selectedLanguage } : {}),
      });
      if (data?.movies && data.movies.length > 0) {
        // Map database movies to ensure frontend compatibility and rich video/banner assets
        const mapped = data.movies.map((m) => {
          const fallback = FALLBACK_MOVIES.find(
            (f) => f.id === m.id || f.title.toLowerCase() === m.title.toLowerCase()
          );
          return {
            ...fallback,
            ...m,
            trailerUrl: m.trailerUrl || fallback?.trailerUrl,
            videoPreview: fallback?.videoPreview,
            banner: m.banner || fallback?.banner,
            poster: m.poster || fallback?.poster,
            availableLanguages: fallback?.availableLanguages || [m.language],
            genre: typeof m.genre === 'string' ? m.genre.split(',').map((g) => g.trim()) : (m.genre || fallback?.genre || ['Action']),
            formats: fallback?.formats || ['IMAX 3D', '3D', 'Dolby Cinema', '2D'],
            tagline: fallback?.tagline || m.description.slice(0, 90) + '...',
            certificate: fallback?.certificate || 'U/A 16+',
            rating: m.rating || fallback?.rating || 8.8,
            duration: m.duration || fallback?.duration || '2h 45m',
            voteCount: fallback?.voteCount || '200K+',
            status: 'now_showing',
          };
        });
        setMovies(mapped);
        setIsFromDatabase(true);
      }
    } catch {
      // Graceful fallback to rich local catalog if backend temporarily unreachable
      setMovies(FALLBACK_MOVIES);
      setIsFromDatabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      {/* Full-Width Cinematic Movie Trailer Carousel Hero */}
      <MovieTrailerHeroCarousel 
        movies={movies} 
        onOpenTrailerModal={(movie) => setActiveTrailerMovie(movie)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* City & Venue Bar Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/20 via-zinc-900/60 to-zinc-900/40 border border-zinc-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400">Current Booking Location</div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{selectedCity?.name || 'Mumbai'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                  {selectedCity?.theatresCount || 68} Theatres
                </span>
                {isFromDatabase && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                    <Database className="w-3 h-3" /> PostgreSQL Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenLocationModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all"
            >
              Change City
            </button>
            <Link
              to="/cinema-hall"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-600/30 transition-all"
            >
              <span>Explore 3D Hall</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3D Hall Innovation Feature Banner */}
        <section id="3d-experience" className="my-12 p-6 sm:p-8 rounded-3xl glass-card border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Core Differentiating Feature</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Interactive <span className="text-red-500">3D Cinema Hall</span>
              </h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Step beyond traditional flat seat maps. Our proprietary WebGL auditorium simulation lets you examine realistic sightlines, explore multi-tier rows, switch camera presets, and handpick your exact 3D seat before booking.
              </p>
            </div>

            <Link
              to="/cinema-hall"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-950/60 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Box className="w-4 h-4" />
              <span>Launch 3D Hall Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Camera Perspectives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">1. Overview View</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Wide-angle view of the entire auditorium, screen, and multi-tier seating layout.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">2. From Stage</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Stand at the front cinema screen and survey the crowd perspective and seating rows.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">3. Balcony View</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Ascend to the upper VIP balcony tiers for premium elevated sightlines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">4. Bird's Eye View</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Complete top-down architectural layout to evaluate distances and exit corridors.
              </p>
            </div>
          </div>

          {/* Camera boundaries safety highlight */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Collision-Free Camera Control:</strong> Intelligent camera movement limits ensure you never clip through auditorium walls or exit the theater hall boundaries.
            </span>
          </div>
        </section>

        {/* Language & Format Filter Bar */}
        <section id="now-showing">
          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onSelectLanguage={onSelectLanguage}
            selectedFormat={selectedFormat}
            onSelectFormat={setSelectedFormat}
          />
        </section>

        {/* Movie Grid Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 text-xs">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span>Loading movies from PostgreSQL database...</span>
          </div>
        ) : (
          <MovieGrid
            movies={movies}
            selectedLanguage={selectedLanguage}
            selectedFormat={selectedFormat}
            onPlayTrailer={(movie) => setActiveTrailerMovie(movie)}
          />
        )}
      </main>

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal
          movie={activeTrailerMovie}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}
    </div>
  );
};
