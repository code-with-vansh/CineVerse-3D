import React from 'react';

export const FormatBadge = ({ format }) => {
  const getBadgeStyle = () => {
    switch (format) {
      case 'IMAX 3D':
      case 'IMAX 2D':
        return 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 text-cyan-300 border-cyan-500/40';
      case '4DX 3D':
      case '4DX':
        return 'bg-gradient-to-r from-red-950/70 to-orange-950/70 text-orange-300 border-orange-500/40';
      case 'Dolby Cinema':
      case 'Dolby Atmos':
        return 'bg-gradient-to-r from-purple-950/70 to-indigo-950/70 text-purple-300 border-purple-500/40';
      case '3D':
        return 'bg-gradient-to-r from-emerald-950/70 to-teal-950/70 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase border backdrop-blur-sm ${getBadgeStyle()}`}>
      {format}
    </span>
  );
};

export const RatingBadge = ({ rating, votes, size = 'sm' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 backdrop-blur-md ${size === 'lg' ? 'px-3 py-1.5 text-base' : 'px-2 py-0.5 text-xs'}`}>
      <span className="text-amber-400">★</span>
      <span>{rating}</span>
      {votes && <span className="text-zinc-400 font-normal text-[10px]">({votes})</span>}
    </div>
  );
};
