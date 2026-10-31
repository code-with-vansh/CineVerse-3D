import React from 'react';
import { SEAT_PRICING } from '../../data/cinemaHallData';

export const SeatMap2DView = ({ 
  seats, 
  selectedSeatIds, 
  onToggleSeatSelect 
}) => {
  // Group seats by category and then by row
  const silverRows = ['A', 'B', 'C'];
  const goldRows = ['D', 'E', 'F', 'G', 'H'];
  const premiumRows = ['J', 'K', 'L'];

  const renderRow = (rowLetter) => {
    const rowSeats = seats.filter(s => s.row === rowLetter);
    const leftWing = rowSeats.filter(s => s.number <= 4);
    const centerWing = rowSeats.filter(s => s.number >= 5 && s.number <= 10);
    const rightWing = rowSeats.filter(s => s.number >= 11);

    const renderSeatBtn = (seat) => {
      const isSelected = selectedSeatIds.includes(seat.id);
      const isOccupied = seat.status === 'occupied';

      let btnClass = 'bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-500/50';
      if (isSelected) {
        btnClass = 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/50 scale-110 z-10';
      } else if (isOccupied) {
        btnClass = 'bg-zinc-800 text-zinc-600 border-zinc-800/80 cursor-not-allowed';
      }

      return (
        <button
          key={seat.id}
          disabled={isOccupied}
          onClick={() => onToggleSeatSelect(seat)}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${btnClass}`}
          title={`${seat.label} • ${seat.category} (₹${seat.price})`}
        >
          {seat.number}
        </button>
      );
    };

    return (
      <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-4 my-1.5">
        {/* Row Label Left */}
        <span className="w-5 text-xs font-bold text-zinc-400 text-right shrink-0">
          {rowLetter}
        </span>

        {/* Left Wing */}
        <div className="flex gap-1 sm:gap-1.5">
          {leftWing.map(renderSeatBtn)}
        </div>

        {/* Walkway Aisle */}
        <div className="w-4 sm:w-8 text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
          
        </div>

        {/* Center Wing */}
        <div className="flex gap-1 sm:gap-1.5">
          {centerWing.map(renderSeatBtn)}
        </div>

        {/* Walkway Aisle */}
        <div className="w-4 sm:w-8 text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
          
        </div>

        {/* Right Wing */}
        <div className="flex gap-1 sm:gap-1.5">
          {rightWing.map(renderSeatBtn)}
        </div>

        {/* Row Label Right */}
        <span className="w-5 text-xs font-bold text-zinc-400 text-left shrink-0">
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 overflow-x-auto">
      {/* Curved Screen Banner */}
      <div className="mb-10 text-center">
        <div className="w-full max-w-xl mx-auto h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full shadow-lg shadow-cyan-500/50" />
        <div className="text-[11px] font-bold tracking-widest uppercase text-cyan-400 mt-2">
          All Eyes This Way • Cinema Screen
        </div>
      </div>

      {/* Silver Tier */}
      <div className="mb-6 p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{SEAT_PRICING.SILVER.name}</span>
          </div>
          <span>₹{SEAT_PRICING.SILVER.price}</span>
        </div>
        {silverRows.map(renderRow)}
      </div>

      {/* Gold Tier */}
      <div className="mb-6 p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
        <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>{SEAT_PRICING.GOLD.name}</span>
          </div>
          <span>₹{SEAT_PRICING.GOLD.price}</span>
        </div>
        {goldRows.map(renderRow)}
      </div>

      {/* Balcony / Premium Tier */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/20 to-zinc-950/40 border border-amber-500/20">
        <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{SEAT_PRICING.PREMIUM.name} (VIP Balcony)</span>
          </div>
          <span>₹{SEAT_PRICING.PREMIUM.price}</span>
        </div>
        {premiumRows.map(renderRow)}
      </div>
    </div>
  );
};
