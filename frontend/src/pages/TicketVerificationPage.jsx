import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Search, 
  Ticket, 
  Film, 
  Calendar, 
  MapPin, 
  Clock, 
  Popcorn, 
  Loader2,
  ArrowRight
} from 'lucide-react';

export const TicketVerificationPage = () => {
  const { ticketCode: urlTicketCode } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(urlTicketCode || '');
  const [activeCode, setActiveCode] = useState(urlTicketCode || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performVerification = async (code) => {
    if (!code || !code.trim()) return;

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const res = await ticketService.verifyTicket(code.trim());
      setVerificationResult(res);
    } catch (err) {
      setError(err.message || 'Ticket verification failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlTicketCode) {
      performVerification(urlTicketCode);
    }
  }, [urlTicketCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim());
      navigate(`/verify-ticket/${inputCode.trim()}`);
      performVerification(inputCode.trim());
    }
  };

  const ticket = verificationResult?.data;

  return (
    <div className="min-h-screen bg-[#06070a] text-white pt-24 pb-24 selection:bg-red-600">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-500/30">
            <ShieldCheck className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Cinema Ticket Verification</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
            Official CineVerse 3D usher gate verification. Validate opaque ticket tokens against the database.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Ticket Code (e.g. CV3D-TKT-XXXXXX)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0e111a] border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:border-red-500 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Verify
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400 font-semibold">Querying PostgreSQL database...</p>
          </div>
        )}

        {/* VALID TICKET DISPLAY */}
        {!loading && verificationResult?.isValid && ticket && (
          <div className="rounded-3xl bg-[#0e111a] border-2 border-emerald-500/60 p-6 sm:p-8 shadow-2xl relative animate-in fade-in">
            {/* Authenticated Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                  Official Verification Status
                </span>
                <h3 className="text-lg font-black text-white">Genuine & Valid Cinema Ticket</h3>
              </div>
            </div>

            {/* Movie Info */}
            <div className="py-5 flex gap-4 border-b border-zinc-800/80">
              <img
                src={ticket.movie.poster}
                alt={ticket.movie.title}
                className="w-16 h-24 rounded-xl object-cover border border-zinc-800"
              />
              <div className="flex-1">
                <h4 className="text-base font-bold text-white">{ticket.movie.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{ticket.movie.language} • {ticket.movie.duration}</p>
                <div className="mt-2 text-xs text-zinc-300">
                  <p className="font-semibold">{ticket.theatre.name} ({ticket.theatre.screenName})</p>
                  <p className="text-zinc-400">{ticket.show.showDate} • {ticket.show.startTime}</p>
                </div>
              </div>
            </div>

            {/* Seats & Snacks */}
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Seats ({ticket.seats.length}):</span>
                <div className="flex flex-wrap gap-1">
                  {ticket.seats.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold font-mono">
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              {ticket.snacks.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Food Items:</span>
                  <span className="text-white font-medium">
                    {ticket.snacks.map(s => `${s.name} (×${s.quantity})`).join(', ')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Ticket Code:</span>
                <span className="font-mono font-bold text-amber-400 text-xs">{ticket.ticketCode}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Booking Reference:</span>
                <span className="font-mono text-zinc-300 text-xs">{ticket.bookingReference}</span>
              </div>
            </div>

            {/* Verification Timestamp */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Verified at {new Date().toLocaleTimeString()}</span>
              <span className="text-emerald-400 font-bold">Entry Granted</span>
            </div>
          </div>
        )}

        {/* INVALID TICKET DISPLAY */}
        {!loading && (error || (verificationResult && !verificationResult.isValid)) && (
          <div className="rounded-3xl bg-[#0e111a] border-2 border-red-500/60 p-6 sm:p-8 shadow-2xl text-center animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-500/40">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">Invalid or Unconfirmed Ticket</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              {error || verificationResult?.message || 'No confirmed ticket was found matching this code.'}
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
              Verification Failed • Gate Entry Denied
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketVerificationPage;
