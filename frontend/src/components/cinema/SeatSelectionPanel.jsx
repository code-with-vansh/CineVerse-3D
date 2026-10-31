import React from 'react';
import { 
  Compass, 
  Eye, 
  Layers, 
  Box, 
  Ticket, 
  RotateCcw, 
  ArrowRight
} from 'lucide-react';
import { SEAT_PRICING } from '../../data/cinemaHallData';

export const SeatSelectionPanel = ({
  movie,
  theatreName,
  screenName = 'Laser IMAX 3D',
  date,
  time,
  selectedSeats,
  onClearSelection,
  onContinue,
  activeCameraPreset,
  onChangeCameraPreset,
  is2DView,
  onToggle2DView,
  isHolding = false
}) => {
  // Compute pricing totals
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const cameraButtons = [
    { id: 'overview', name: 'Overview', icon: Compass },
    { id: 'stage', name: 'From Stage', icon: Eye },
    { id: 'balcony', name: 'Balcony', icon: Layers },
    { id: 'birdseye', name: "Bird's Eye", icon: Box }
  ];

  return (
    <>
      {/* Top Floating Control Bar (Camera Presets & 2D/3D Switcher) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Movie & Showtime Chip */}
        <div className="pointer-events-auto flex items-center gap-3 p-2.5 rounded-2xl glass-panel border border-zinc-800 shadow-xl">
          <img
            src={movie?.poster}
            alt={movie?.title}
            className="w-10 h-14 object-cover rounded-lg shadow hidden sm:block"
          />
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>{movie?.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 font-bold border border-red-500/30">
                {movie?.certificate || 'U/A'}
              </span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
              <span className="text-zinc-300 font-semibold">{theatreName}</span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[10px]">{screenName}</span>
              <span>•</span>
              <span className="text-red-400 font-semibold">{time}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* Right: Camera Presets & 2D/3D Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-zinc-800 shadow-xl">
          {/* 3D Camera Presets (Visible only in 3D mode) */}
          {!is2DView && (
            <div className="hidden sm:flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
              {cameraButtons.map((cam) => {
                const IconComponent = cam.icon;
                const isActive = activeCameraPreset === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => onChangeCameraPreset(cam.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50 scale-105'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                    }`}
                    title={cam.name}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{cam.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2D / 3D Toggle Button */}
          <button
            onClick={onToggle2DView}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              is2DView
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/40'
                : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is2DView ? 'Switch to 3D Hall' : '2D Map View'}</span>
          </button>
        </div>
      </div>

      {/* Floating Instructions Pill (3D mode) */}
      {!is2DView && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:block">
          <div className="px-4 py-1.5 rounded-full bg-black/60 border border-zinc-800/80 text-[11px] text-zinc-400 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Drag to rotate • Pinch / Scroll to zoom • Click any seat to select</span>
          </div>
        </div>
      )}

      {/* Mobile Camera Bar (Shown on small screens below top bar) */}
      {!is2DView && (
        <div className="absolute top-20 left-4 right-4 z-20 flex sm:hidden items-center justify-center gap-1 p-1 rounded-xl glass-panel border border-zinc-800">
          {cameraButtons.map((cam) => {
            const Icon = cam.icon;
            const isActive = activeCameraPreset === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => onChangeCameraPreset(cam.id)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 ${
                  isActive ? 'bg-red-600 text-white' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cam.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Floating Booking HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 max-w-5xl mx-auto pointer-events-auto">
        <div className="p-4 sm:p-5 rounded-3xl glass-card border border-zinc-800/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Seat Status Legend & Category Rates */}
          <div className="w-full md:w-auto">
            {/* Status Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm shadow-red-600/50" />
                <span>Occupied</span>
              </div>
            </div>

            {/* Category Tier Rates */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">Silver: ₹{SEAT_PRICING.SILVER.price}</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">Gold: ₹{SEAT_PRICING.GOLD.price}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Premium Balcony: ₹{SEAT_PRICING.PREMIUM.price}</span>
            </div>
          </div>

          {/* Center: Selected Seats List */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto border-t md:border-t-0 md:border-x border-zinc-800/80 pt-3 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-400 font-medium">Selected Seats ({selectedSeats.length}/8):</span>
              {selectedSeats.length > 0 && (
                <button
                  onClick={onClearSelection}
                  className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 underline"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40"
                  >
                    {seat.label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-zinc-500 italic">No seats selected yet. Click any green seat.</span>
            )}
          </div>

          {/* Right: Total Price & Continue Action Button */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-zinc-800/80 pt-3 md:pt-0">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Total Price</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                ₹{totalAmount}
              </span>
            </div>

            <button
              disabled={selectedSeats.length === 0 || isHolding}
              onClick={onContinue}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl transition-all ${
                selectedSeats.length > 0 && !isHolding
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed opacity-60'
              }`}
            >
              {isHolding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Locking Seats...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Continue ({selectedSeats.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
