import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Ticket, Clock, Play } from 'lucide-react';
import { FormatBadge } from '../common/Badge';

export const MovieCard = ({ movie, onPlayTrailer }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#0e111a] border border-zinc-800/80 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          width="400"
          height="600"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-transparent to-black/30" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating}</span>
          <span className="text-[10px] text-zinc-400 font-normal">({movie.voteCount})</span>
        </div>

        {/* Certificate Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-zinc-700 text-[10px] font-bold text-zinc-300">
          {movie.certificate}
        </div>

        {/* Quick Trailer Play Button on Hover */}
        {onPlayTrailer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 hover:bg-red-500 shadow-xl shadow-red-950/60"
            aria-label="Play trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        )}

        {/* Format Badges at bottom of poster */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          {movie.formats.slice(0, 3).map((f) => (
            <FormatBadge key={f} format={f} />
          ))}
        </div>
      </div>

      {/* Movie Details Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-bold text-red-500 uppercase tracking-wider">{movie.language}</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3" />
              <span>{movie.duration}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            {movie.genre.join(', ')}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            {movie.theatres?.length ? `${movie.theatres.length} Theatres Available` : 'Coming Soon'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.id}#showtimes`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 group-hover:bg-red-600 text-zinc-300 group-hover:text-white text-xs font-semibold border border-zinc-800 group-hover:border-red-500 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
