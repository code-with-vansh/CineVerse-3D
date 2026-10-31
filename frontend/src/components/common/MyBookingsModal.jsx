import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { 
  X, 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Popcorn,
  ArrowRight
} from 'lucide-react';

export const MyBookingsModal = () => {
  const navigate = useNavigate();
  const { myBookingsModalOpen, setMyBookingsModalOpen, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (myBookingsModalOpen && user) {
      fetchBookings();
    }
  }, [myBookingsModalOpen, user]);

  const handleOpenTicket = (booking) => {
    setMyBookingsModalOpen(false);
    const code = booking.ticketCode || booking.bookingReference;
    navigate(`/ticket/${code}`);
  };

  const handleResumeCheckout = (booking) => {
    setMyBookingsModalOpen(false);
    navigate(`/checkout?bookingRef=${booking.bookingReference}`);
  };

  if (!myBookingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#0e111a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMyBookingsModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">My 3D Cinema Bookings</h3>
              <p className="text-xs text-zinc-400">Database booking history for {user?.name}</p>
            </div>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors mr-10 cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Bookings List Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 text-xs">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span>Fetching bookings from database...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              <Ticket className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
              <p className="text-sm font-semibold text-zinc-400">No Bookings Yet</p>
              <p className="mt-1">Reserve seats in the 3D cinema hall to see your booking records here.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex gap-3.5 items-start">
                  {b.show?.movie?.poster && (
                    <img
                      src={b.show.movie.poster}
                      alt={b.show.movie.title}
                      className="w-14 h-20 rounded-xl object-cover shrink-0 border border-zinc-800 hidden sm:block"
                    />
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-red-400 font-bold">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{b.show?.movie?.title || 'Movie'}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {b.show?.screen?.theatre?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {b.show?.showDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {b.show?.startTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                      <span>Seats: <strong className="text-white font-mono">{b.bookingSeats?.map((s) => `${s.seat?.row}${s.seat?.seatNumber}`).join(', ') || 'N/A'}</strong></span>
                      {b.bookingSnacks?.length > 0 && (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Popcorn className="w-3 h-3" />
                          <span>{b.bookingSnacks.length} snacks</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800 flex sm:flex-col justify-between items-center sm:items-end gap-2">
                  <div className="text-base font-black text-amber-400">
                    ₹{(b.grandTotal || b.totalTicketAmount).toFixed(2)}
                  </div>

                  {b.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleOpenTicket(b)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Ticket</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : b.status === 'PENDING' ? (
                    <button
                      onClick={() => handleResumeCheckout(b)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
