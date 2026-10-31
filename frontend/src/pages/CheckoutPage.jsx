import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { 
  Film, 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket, 
  Popcorn, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Timer,
  AlertCircle,
  Loader2,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('bookingRef');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [holdTimer, setHoldTimer] = useState(300);

  useEffect(() => {
    if (!bookingRef) {
      navigate('/');
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingSummary(bookingRef);
        if (!data?.booking) {
          throw new Error('Booking not found.');
        }

        setBooking(data.booking);
        setHoldTimer(data.remainingHoldSeconds || 300);

        if (!data.isHoldActive && data.booking.status === 'PENDING') {
          setErrorMessage('Your seat reservation hold has expired. Please reselect your seats.');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load checkout summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [bookingRef, navigate]);

  // Hold Timer Countdown
  useEffect(() => {
    if (!holdTimer || holdTimer <= 0) return;

    const interval = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('Your 5-minute seat reservation has expired. Please reselect your seats.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProceedToPayment = () => {
    if (holdTimer <= 0) {
      setErrorMessage('Your seat hold has expired. You cannot checkout with expired seats.');
      return;
    }
    navigate(`/payment?bookingRef=${bookingRef}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm font-semibold text-zinc-400">Verifying seat locks & preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#06070a] text-white pt-32 px-4 text-center">
        <h2 className="text-xl font-bold text-red-400">Booking Reservation Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const { show, bookingSeats, bookingSnacks } = booking;
  const movie = show?.movie;
  const screen = show?.screen;
  const theatre = screen?.theatre;

  return (
    <div className="min-h-screen bg-[#06070a] text-white pt-24 pb-24 selection:bg-red-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-8">
          <div>
            <button
              onClick={() => navigate(`/snacks?bookingRef=${bookingRef}`)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Snacks & Concessions</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>Review Your Booking</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Locked in PostgreSQL</span>
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Verify your movie, seats, concessions, and server-validated bill breakdown before simulated payment.
            </p>
          </div>

          {/* Seat Hold Status */}
          <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-2.5 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${holdTimer < 60 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
              <span className="text-xs text-zinc-300 font-semibold">Seat Lock Remaining:</span>
            </div>
            <span className={`font-mono text-sm font-black ${holdTimer < 60 ? 'text-red-400' : 'text-amber-400'}`}>
              {formatTimer(holdTimer)}
            </span>
          </div>
        </div>

        {/* Expiration Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-white flex items-center justify-between text-xs font-semibold shadow-xl">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {holdTimer <= 0 && (
              <button
                onClick={() => navigate('/cinema-hall')}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Reselect Seats
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Movie & Seats + Food Order (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Movie Information Card */}
            <div className="p-6 rounded-3xl bg-[#0d1019] border border-zinc-800/80 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={movie?.poster}
                  alt={movie?.title}
                  className="w-24 sm:w-28 h-36 rounded-2xl object-cover shrink-0 border border-zinc-800 shadow-md"
                />
                <div className="flex-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {movie?.language} • {screen?.screenType?.replace('_', ' ')}
                  </div>
                  <h3 className="text-xl font-black text-white">{movie?.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{movie?.genre} • {movie?.duration}</p>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{theatre?.name}, {theatre?.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{show?.showDate} • {show?.startTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Reserved Seats Details Card */}
            <div className="p-6 rounded-3xl bg-[#0d1019] border border-zinc-800/80 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-sky-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Reserved Seats ({bookingSeats?.length})
                  </h4>
                </div>
                <button
                  onClick={() => navigate('/cinema-hall')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Change Seats
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {bookingSeats?.map((bs) => (
                  <div
                    key={bs.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/30">
                        {bs.seat?.row}{bs.seat?.seatNumber}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          Seat {bs.seat?.row}-{bs.seat?.seatNumber}
                        </p>
                        <p className="text-[10px] text-zinc-400 uppercase font-semibold">
                          {bs.seat?.category} Class
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-xs">₹{bs.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Snacks & Concessions Card */}
            <div className="p-6 rounded-3xl bg-[#0d1019] border border-zinc-800/80 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Popcorn className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Food & Concessions ({bookingSnacks?.length || 0})
                  </h4>
                </div>
                <button
                  onClick={() => navigate(`/snacks?bookingRef=${bookingRef}`)}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  {bookingSnacks?.length > 0 ? 'Edit Food' : '+ Add Snacks'}
                </button>
              </div>

              {bookingSnacks && bookingSnacks.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  {bookingSnacks.map((bs) => (
                    <div
                      key={bs.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bs.snack?.image}
                          alt={bs.snack?.name}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-800"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{bs.snack?.name}</p>
                          <p className="text-[10px] text-zinc-400">
                            ₹{bs.unitPrice} × {bs.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white text-xs">₹{bs.subtotal}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-zinc-500">
                  <p>No cinema snacks added yet.</p>
                  <button
                    onClick={() => navigate(`/snacks?bookingRef=${bookingRef}`)}
                    className="mt-2 text-red-400 hover:underline font-semibold"
                  >
                    Browse gourmet popcorn & beverages
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Server-Calculated Price Breakdown & Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0d1019] border border-zinc-800/80 shadow-2xl relative">
              <h4 className="text-base font-black text-white pb-4 border-b border-zinc-800">
                Payment Summary
              </h4>

              {/* Booking Reference Pill */}
              <div className="my-4 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Booking Reference:</span>
                <span className="font-mono font-black text-red-400 text-xs">
                  {booking.bookingReference}
                </span>
              </div>

              {/* Line Items */}
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Ticket Subtotal ({bookingSeats?.length} seats)</span>
                  <span className="font-mono font-bold text-white">₹{booking.totalTicketAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Food & Concessions Subtotal</span>
                  <span className="font-mono font-bold text-white">₹{booking.totalSnackAmount}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <div className="flex items-center gap-1">
                    <span>Convenience Fee</span>
                    <Info className="w-3 h-3 text-zinc-500" title="Standard cinema booking convenience fee" />
                  </div>
                  <span className="font-mono text-zinc-200">₹{booking.convenienceFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <div className="flex items-center gap-1">
                    <span>Integrated Taxes & GST</span>
                    <Info className="w-3 h-3 text-zinc-500" title="18% GST on convenience fee + 5% GST on concessions" />
                  </div>
                  <span className="font-mono text-zinc-200">₹{booking.taxAmount.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white text-base">Grand Total</span>
                  <span className="font-mono text-xl font-black text-amber-400">
                    ₹{booking.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-3.5 rounded-2xl bg-amber-950/20 border border-amber-600/30 text-amber-300/90 text-xs leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-400">DEMO SIMULATION SYSTEM</span>
                  No real money will be charged. You will experience simulated UPI, Card, or Wallet transactions.
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={holdTimer <= 0}
                className="mt-6 w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span>Proceed to Simulated Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 text-center text-[10px] text-zinc-500">
                Concurrency-safe reservation • Instant digital ticket issuance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
