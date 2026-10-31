import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Box, 
  X,
  ChevronRight 
} from 'lucide-react';
import { FormatBadge } from '../common/Badge';

export const ShowtimeSelector = ({ movie, selectedCity }) => {
  const navigate = useNavigate();

  // Generate next 7 dates
  const dates = [
    { label: 'TODAY', day: 'SAT', date: '31', month: 'OCT', full: '2026-10-31' },
    { label: 'TOMORROW', day: 'SUN', date: '01', month: 'NOV', full: '2026-11-01' },
    { label: '', day: 'MON', date: '02', month: 'NOV', full: '2026-11-02' },
    { label: '', day: 'TUE', date: '03', month: 'NOV', full: '2026-11-03' },
    { label: '', day: 'WED', date: '04', month: 'NOV', full: '2026-11-04' },
    { label: '', day: 'THU', date: '05', month: 'NOV', full: '2026-11-05' },
    { label: '', day: 'FRI', date: '06', month: 'NOV', full: '2026-11-06' }
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedFormatFilter, setSelectedFormatFilter] = useState('All');
  const [showBookingNotice, setShowBookingNotice] = useState(null);

  const theatres = movie.theatres || [];

  const handleShowtimeClick = (theatre, showtime) => {
    const query = new URLSearchParams({
      movieId: movie.id,
      theatreId: theatre.id,
      date: `${selectedDate.day}, ${selectedDate.date} ${selectedDate.month}`,
      time: showtime.time,
      format: showtime.format
    }).toString();

    navigate(`/cinema-hall?${query}`, {
      state: {
        movie,
        theatre,
        date: selectedDate,
        showtime
      }
    });
  };

  return (
    <div id="showtimes" className="mt-12 pt-8 border-t border-zinc-800">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Showtimes & Theatres</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Book Your Seats in <span className="text-red-500">{selectedCity?.name || 'Mumbai'}</span>
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-zinc-400 bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Filling Fast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Almost Full</span>
          </div>
        </div>
      </div>

      {/* Date Picker Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {dates.map((d, idx) => {
          const isSelected = selectedDate.full === d.full;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(d)}
              className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-3 rounded-2xl border transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-b from-red-600 to-rose-700 text-white border-red-500 shadow-lg shadow-red-950/40 scale-105'
                  : 'bg-zinc-900/70 text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                {d.label || d.day}
              </span>
              <span className="text-xl font-extrabold my-0.5">{d.date}</span>
              <span className="text-[10px] uppercase font-semibold">{d.month}</span>
            </button>
          );
        })}
      </div>

      {/* Format Filter Chips */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2">
          Filter Format:
        </span>
        {['All', 'IMAX 3D', '3D', '4DX 3D', 'Dolby Cinema', '2D'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedFormatFilter(fmt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFormatFilter === fmt
                ? 'bg-zinc-200 text-black shadow'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Theatres and Showtimes List */}
      {theatres.length > 0 ? (
        <div className="space-y-4">
          {theatres.map((theatre) => {
            // Filter showtimes if format selected
            const validShowtimes = selectedFormatFilter === 'All' 
              ? theatre.showtimes 
              : theatre.showtimes.filter(s => s.format === selectedFormatFilter);

            if (validShowtimes.length === 0) return null;

            return (
              <div 
                key={theatre.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0e111a] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Theatre info */}
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors">
                      {theatre.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{theatre.address}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-red-400 font-medium">{theatre.distance}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <FormatBadge format={theatre.screenFormat} />
                    {theatre.cancellationAvailable && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Free Cancellation</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Showtimes Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {validShowtimes.map((st, i) => {
                    const statusColor = 
                      st.status === 'almost_full' ? 'border-rose-500/50 text-rose-400 hover:bg-rose-950/30' :
                      st.status === 'filling_fast' ? 'border-amber-500/50 text-amber-400 hover:bg-amber-950/30' :
                      'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30';

                    return (
                      <button
                        key={i}
                        onClick={() => handleShowtimeClick(theatre, st)}
                        className={`group relative flex flex-col items-center justify-center px-4 py-2.5 rounded-xl bg-zinc-900/90 border ${statusColor} transition-all hover:scale-105 active:scale-95`}
                      >
                        <span className="text-sm font-bold text-white group-hover:text-red-400">
                          {st.time}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                            {st.format}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {st.priceRange}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <h4 className="text-white font-bold">Advance Booking Opening Soon</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Showtimes for this title will be announced shortly.
          </p>
        </div>
      )}

      {/* Phase 2 Interactive Bridge Notice Modal */}
      {showBookingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-[#0f121a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowBookingNotice(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center mb-4">
              <Box className="w-6 h-6 text-red-500" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Step: Phase 2 3D Cinema Hall</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              Selected Showtime Confirmed
            </h3>

            <div className="my-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Movie:</span>
                <span className="font-bold text-white">{showBookingNotice.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cinema:</span>
                <span className="font-bold text-white">{showBookingNotice.theatreName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">City / Date:</span>
                <span className="font-bold text-white">{showBookingNotice.city} • {selectedDate.day}, {selectedDate.date} {selectedDate.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Time & Format:</span>
                <span className="font-bold text-red-400">{showBookingNotice.time} ({showBookingNotice.format})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Ticket Tier:</span>
                <span className="font-bold text-amber-400">{showBookingNotice.price}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              In <strong>Phase 2</strong>, clicking this showtime will launch you into the realistic <strong>3D Cinema Hall</strong> with 4 camera perspectives (Overview, From Stage, Balcony, Bird's Eye), collision boundaries, and interactive 3D seat selection.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowBookingNotice(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Understood (Phase 1 Ready)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
