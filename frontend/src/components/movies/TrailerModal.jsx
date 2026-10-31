import React from 'react';
import { X, Film } from 'lucide-react';

export const TrailerModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-black border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{movie.title} — Official Trailer</h3>
              <p className="text-[11px] text-zinc-400">{movie.language} • {movie.genre.join(', ')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {movie.trailerUrl ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={movie.videoPreview}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span>Release Date: {movie.releaseDate}</span>
          <span className="text-zinc-500">Available in IMAX 3D, Dolby Atmos & 4DX</span>
        </div>
      </div>
    </div>
  );
};
