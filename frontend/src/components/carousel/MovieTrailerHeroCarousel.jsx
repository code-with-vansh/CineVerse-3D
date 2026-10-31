import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Info, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Star, 
  Sparkles,
  Calendar,
  Clock,
  Film
} from 'lucide-react';
import { FormatBadge } from '../common/Badge';

// Helper to extract clean YouTube ID from embed or watch URLs
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/|\/embed\/|shorts\/)([^?&"'>]+)/);
  return match ? match[1] : null;
}

export const MovieTrailerHeroCarousel = ({ 
  movies = [], 
  onOpenTrailerModal 
}) => {
  const navigate = useNavigate();

  // Guard: Ensure we have movies to display
  const featuredMovies = movies.length > 0 ? movies.slice(0, 8) : [];
  const totalSlides = featuredMovies.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward (slide left), -1 = backward (slide right)
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const iframeRef = useRef(null);
  const timerRef = useRef(null);

  // Active movie data
  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const youtubeId = getYouTubeId(currentMovie?.trailerUrl);

  // Next slide handler
  const handleNext = useCallback(() => {
    setDirection(1);
    setVideoLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Previous slide handler
  const handlePrev = useCallback(() => {
    setDirection(-1);
    setVideoLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Jump directly to specific index
  const handleGoToSlide = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setVideoLoaded(false);
    setCurrentIndex(index);
  };

  // Automatic 5-second slide progression timer
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, totalSlides, isPaused, currentIndex]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Send postMessage command to YouTube iframe if available
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextMuted ? 'mute' : 'unMute',
            args: '',
          }),
          '*'
        );
      }
    } catch {
      // Ignored if cross-origin policy prevents command
    }
  };

  // Horizontal slide animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.02,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 28 },
        opacity: { duration: 0.45 },
        scale: { duration: 0.6 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 28 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  if (!currentMovie) return null;

  return (
    <section 
      className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] bg-[#06070a] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-label="Featured Movie Trailer Carousel"
    >
      {/* Horizontal Sliding Trailer & Background Container */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentMovie.id || currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* 1. High-Resolution Fallback Poster/Banner (Always visible immediately - NO BLACK SCREEN) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            <img
              src={currentMovie.banner || currentMovie.poster}
              alt={currentMovie.title}
              className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 transition-transform duration-7000 ease-out"
              fetchpriority="high"
            />
          </div>

          {/* 2. Embedded Video Trailer (Plays automatically, muted by default) */}
          {youtubeId ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                title={`${currentMovie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] min-w-full min-h-full object-cover transition-opacity duration-700 ${
                  videoLoaded ? 'opacity-90' : 'opacity-0'
                }`}
                onLoad={() => setVideoLoaded(true)}
              />
            </div>
          ) : currentMovie.videoPreview ? (
            <video
              src={currentMovie.videoPreview}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onCanPlay={() => setVideoLoaded(true)}
            />
          ) : null}

          {/* 3. Multi-Layer Cinematic Gradient Overlays (Ensures text readability & smooth page integration) */}
          {/* Left-to-right reading gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06070a]/95 via-[#06070a]/75 sm:via-[#06070a]/50 to-transparent w-full md:w-3/4 pointer-events-none z-10" />

          {/* Bottom blending gradient */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#08090d] via-[#08090d]/80 to-transparent pointer-events-none z-10" />

          {/* Top subtle navbar shadow */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#06070a]/90 via-[#06070a]/40 to-transparent pointer-events-none z-10" />

          {/* Vignette border glow */}
          <div className="absolute inset-0 shadow-inner pointer-events-none z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Synchronized Overlaid Movie Information Content (Left Aligned) */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <motion.div
          key={`content-${currentMovie.id || currentIndex}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="max-w-2xl"
        >
          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-lg shadow-red-950/60">
              {currentMovie.language}
            </span>

            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-700/80 text-zinc-300 font-bold text-[11px] tracking-wide">
              {currentMovie.certificate || 'U/A 16+'}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-black/70 border border-white/10 backdrop-blur-md text-amber-400 font-extrabold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{currentMovie.rating || 9.0}</span>
            </div>

            <span className="text-zinc-400 text-xs font-semibold hidden sm:inline">
              {currentMovie.duration}
            </span>

            {/* Cinema formats */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              {(currentMovie.formats || ['IMAX 3D', '3D', 'Dolby Cinema']).slice(0, 3).map((f) => (
                <FormatBadge key={f} format={f} />
              ))}
            </div>
          </div>

          {/* Large Movie Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-2xl mb-3">
            {currentMovie.title}
          </h1>

          {/* Movie Description / Tagline */}
          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-medium line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow mb-6 max-w-xl">
            {currentMovie.tagline ? `${currentMovie.tagline} ` : ''}
            {currentMovie.description}
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Book Tickets Button */}
            <button
              onClick={() => navigate(`/cinema-hall?movieId=${currentMovie.id}`)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-950/60 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-white" />
              <span>Book Tickets</span>
            </button>

            {/* 2. View Details Button */}
            <button
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="px-5 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>View Details</span>
            </button>

            {/* 3. Watch Full Trailer in Modal */}
            {onOpenTrailerModal && (
              <button
                onClick={() => onOpenTrailerModal(currentMovie)}
                className="px-4 py-3.5 rounded-2xl bg-black/60 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white font-semibold text-xs backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
                title="Watch full trailer in cinematic theater modal"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Trailer Modal</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Audio Mute / Unmute Control (Top Right) */}
      <div className="absolute top-20 right-4 sm:right-8 z-30">
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/20 text-white text-xs font-bold backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title={isMuted ? 'Click to unmute trailer audio' : 'Click to mute trailer audio'}
          aria-label="Toggle trailer audio"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="text-[11px] font-mono text-zinc-300 hidden sm:inline">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">Sound ON</span>
            </>
          )}
        </button>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/50 hover:bg-red-600/90 border border-white/10 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Previous movie trailer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/50 hover:bg-red-600/90 border border-white/10 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Next movie trailer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Horizontal Carousel Indicators & Progress Track */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        <span className="text-[10px] font-mono font-bold text-zinc-400 mr-1 hidden sm:inline">
          {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {totalSlides < 10 ? `0${totalSlides}` : totalSlides}
        </span>

        {featuredMovies.map((movie, idx) => (
          <button
            key={movie.id || idx}
            onClick={() => handleGoToSlide(idx)}
            className="group relative py-1 focus:outline-none cursor-pointer"
            aria-label={`Go to slide ${idx + 1}: ${movie.title}`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 sm:w-10 bg-red-600 shadow-md shadow-red-600/50'
                  : 'w-2 sm:w-2.5 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          </button>
        ))}

        {isPaused && (
          <span className="text-[9px] font-mono text-amber-400 font-bold ml-1.5 uppercase hidden sm:inline">
            Paused
          </span>
        )}
      </div>
    </section>
  );
};

export default MovieTrailerHeroCarousel;
