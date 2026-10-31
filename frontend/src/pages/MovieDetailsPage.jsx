import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOVIES as FALLBACK_MOVIES } from '../data/moviesData';
import { ShowtimeSelector } from '../components/showtimes/ShowtimeSelector';
import { TrailerModal } from '../components/movies/TrailerModal';
import { FormatBadge } from '../components/common/Badge';
import movieService from '../services/movieService';
import theatreService from '../services/theatreService';
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Clock, 
  Calendar, 
  Globe, 
  Bookmark, 
  Ticket,
  Sparkles,
  Clapperboard,
  Music,
  Database
} from 'lucide-react';

export const MovieDetailsPage = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadMovieData = async () => {
      setLoading(true);
      try {
        // Try fetching directly by ID or slug
        const dbMovie = await movieService.getMovieById(id);
        if (dbMovie) {
          // Format cast and genres if string
          const formattedCast = typeof dbMovie.cast === 'string'
            ? dbMovie.cast.split(',').map((name) => ({
                name: name.trim(),
                role: 'Lead Cast',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              }))
            : dbMovie.cast;

          // Fetch theatres/shows for this movie
          let dbTheatres = [];
          try {
            dbTheatres = await theatreService.getTheatresByMovie(dbMovie.id, {
              city: selectedCity?.name,
            });
          } catch {}

          // Format shows for ShowtimeSelector
          const formattedTheatres = (dbTheatres || []).map((t) => ({
            id: t.id,
            name: t.name,
            address: t.address,
            distance: '2.5 km away',
            screenFormat: t.shows?.[0]?.screenType ? `${t.shows[0].screenType.replace('_', ' ')}` : 'IMAX 3D',
            cancellationAvailable: true,
            showtimes: (t.shows || []).map((s) => ({
              id: s.id,
              time: s.startTime,
              format: s.screenType ? `${s.screenType.replace('_', ' ')}` : '3D',
              priceRange: '₹180 - ₹420',
              status: 'available',
            })),
          }));

          setMovie({
            ...dbMovie,
            formats: ['IMAX 3D', '3D', 'Dolby Cinema', '2D'],
            availableLanguages: [dbMovie.language],
            genre: typeof dbMovie.genre === 'string' ? dbMovie.genre.split(',').map((g) => g.trim()) : dbMovie.genre,
            voteCount: '240K+',
            certificate: 'U/A 16+',
            cast: formattedCast,
            theatres: formattedTheatres.length > 0 ? formattedTheatres : undefined,
          });
          setIsFromDatabase(true);
          return;
        }
      } catch {
        // Fallback to local catalog
      }

      // Local fallback lookup
      const fallback = FALLBACK_MOVIES.find(
        (m) => m.id === id || m.title.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(id)
      ) || FALLBACK_MOVIES[0];
      setMovie(fallback);
      setIsFromDatabase(false);
      setLoading(false);
    };

    loadMovieData().finally(() => setLoading(false));
  }, [id, selectedCity]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-zinc-400">Loading movie details from database...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">The requested movie could not be located in our database.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors"
        >
          Return to Cinema Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      {/* Cinematic Hero & Video Section */}
      <section className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] overflow-hidden bg-black">
        <img
          src={movie.banner}
          alt={`${movie.title} Backdrop`}
          width="1920"
          height="1080"
          className="w-full h-full object-cover opacity-45 scale-105"
        />

        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-transparent to-[#08090d]/80" />

        {/* Top Floating Navigation */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-zinc-700/60 text-xs font-semibold text-white backdrop-blur-md transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {isFromDatabase && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                <Database className="w-3.5 h-3.5" /> PostgreSQL
              </span>
            )}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                bookmarked
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-black/60 border-zinc-700/60 text-zinc-300 hover:text-white'
              }`}
              aria-label="Bookmark movie"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Play Trailer Floating Button */}
        {movie.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <button
              onClick={() => setTrailerModalOpen(true)}
              className="pointer-events-auto group flex items-center gap-3 px-5 py-3 rounded-full bg-red-600/90 hover:bg-red-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-2xl shadow-red-950/80 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center pl-0.5 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <span>WATCH OFFICIAL TRAILER</span>
            </button>
          </div>
        )}
      </section>

      {/* Main Details Card */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48 relative z-20 pb-20">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
          {/* Movie Poster Card */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="rounded-3xl overflow-hidden border-2 border-zinc-800/80 shadow-2xl shadow-black relative group">
              <img
                src={movie.poster}
                alt={movie.title}
                width="320"
                height="480"
                className="w-full h-auto object-cover aspect-[2/3] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-800/80 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.rating}/10</span>
                </div>
                <span className="text-[11px] text-zinc-400">{movie.voteCount}</span>
              </div>
            </div>
          </div>

          {/* Movie Metadata Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 mt-2 font-medium italic">
                {movie.tagline || movie.genre}
              </p>
            </div>

            {/* Tags Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase">
                {movie.certificate}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{movie.duration}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{movie.releaseDate}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{movie.language}</span>
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="#showtimes"
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-red-950/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets in 3D</span>
              </a>
              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerModalOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Synopsis & Key Info */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0e111a] border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Synopsis</span>
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              {movie.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800/80 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="p-2 rounded-lg bg-red-600/10 text-red-400">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 block">Director</span>
                  <span className="font-bold text-white text-sm">{movie.director}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="p-2 rounded-lg bg-amber-600/10 text-amber-400">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 block">Music & Background Score</span>
                  <span className="font-bold text-white text-sm">{movie.musicDirector || 'Original Cinematic Score'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Theatres & Showtimes Selector */}
        <ShowtimeSelector 
          movie={movie} 
          selectedCity={selectedCity} 
        />
      </main>

      {/* Trailer Modal */}
      {trailerModalOpen && (
        <TrailerModal
          movie={movie}
          onClose={() => setTrailerModalOpen(false)}
        />
      )}
    </div>
  );
};
