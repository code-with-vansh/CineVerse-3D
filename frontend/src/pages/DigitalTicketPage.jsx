import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import ticketService from '../services/ticketService';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Film, 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket, 
  Popcorn, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const DigitalTicketPage = () => {
  const { ticketCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNewBooking = searchParams.get('success') === 'true';

  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const ticketRef = useRef(null);

  useEffect(() => {
    if (!ticketCode) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await ticketService.verifyTicket(ticketCode);
        if (!res.success || !res.isValid) {
          throw new Error(res.message || 'Ticket verification failed or ticket not found.');
        }
        setTicketData(res.data);
      } catch (err) {
        setErrorMessage(err.message || 'Unable to load digital cinema ticket.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketCode]);

  const handleCopyReference = () => {
    if (!ticketData?.bookingReference) return;
    navigator.clipboard.writeText(ticketData.bookingReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm font-semibold text-zinc-400">Retrieving digital cinema ticket...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !ticketData) {
    return (
      <div className="min-h-screen bg-[#06070a] text-white pt-32 px-4 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-zinc-900/80 border border-red-500/40">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Digital Ticket Not Found</h2>
          <p className="text-xs text-zinc-400 mb-6">{errorMessage || 'The requested ticket code does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const { movie, theatre, show, seats, snacks, payment } = ticketData;
  const verificationUrl = `${window.location.origin}/verify-ticket/${ticketData.ticketCode}`;

  return (
    <div className="min-h-screen bg-[#06070a] text-white pt-24 pb-24 selection:bg-red-600 print:bg-white print:text-black print:p-0">
      {/* Print-specific style */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-ticket { 
            box-shadow: none !important; 
            border: 2px solid #222 !important; 
            background: white !important; 
            color: black !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          .print-ticket * { color: black !important; text-shadow: none !important; }
          .print-pill { background: #eee !important; border: 1px solid #ccc !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* New Booking Celebration Banner (screen-only) */}
        {isNewBooking && (
          <div className="no-print mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 border border-emerald-500/60 text-white flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-emerald-300">Booking Successfully Confirmed!</p>
                <p className="text-xs text-zinc-300">Your seats are permanently locked and your digital ticket is ready.</p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 hidden sm:block" />
          </div>
        )}

        {/* Action Bar (Download/Print, Copy) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Digital Movie Ticket</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Present this ticket at the cinema usher gate for entry.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-zinc-300" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleCopyReference}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              title="Copy Booking Reference"
            >
              {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedRef ? 'Copied' : 'Copy Ref'}</span>
            </button>
          </div>
        </div>

        {/* MAIN CINEMA TICKET CONTAINER */}
        <div 
          ref={ticketRef}
          className="print-ticket relative rounded-3xl bg-[#0e111a] border border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Top Decorative Cinema Strip */}
          <div className="h-3 bg-gradient-to-r from-red-600 via-amber-500 to-rose-600" />

          {/* Ticket Body */}
          <div className="p-6 sm:p-8">
            {/* Header: CineVerse Branding & Status */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base">
                  C
                </div>
                <div>
                  <h3 className="text-base font-black tracking-wider text-white">CINEVERSE 3D</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">IMAX & 3D Cinema Pass</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="print-pill px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CONFIRMED</span>
                </span>
              </div>
            </div>

            {/* Movie Poster & Basic Show Details */}
            <div className="py-6 flex flex-col sm:flex-row gap-6 border-b border-zinc-800/80">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-28 sm:w-32 h-40 rounded-2xl object-cover shrink-0 border border-zinc-800 shadow-xl"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-block print-pill px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {movie.language} • {theatre.screenType?.replace('_', ' ') || 'IMAX 3D'}
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">{movie.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{movie.duration} • Certified Cinema Release</p>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800/60 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Cinema Hall</span>
                    <p className="font-bold text-white text-xs leading-snug">{theatre.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{theatre.city} • {theatre.screenName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Date & Time</span>
                    <p className="font-bold text-red-400 text-xs">{show.showDate}</p>
                    <p className="text-[11px] font-bold text-zinc-300">{show.startTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Seats & Concessions */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-zinc-800/80">
              {/* Seats */}
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-2">
                  Confirmed Seats ({seats.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {seats.map((seat, idx) => (
                    <div
                      key={idx}
                      className="print-pill px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-black text-xs flex items-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{seat.label}</span>
                      <span className="text-[9px] text-zinc-400 font-sans font-semibold">({seat.category})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concessions */}
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-2">
                  Food & Beverages ({snacks.length})
                </span>
                {snacks.length > 0 ? (
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    {snacks.map((snack, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Popcorn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium text-white">{snack.name}</span>
                        <span className="text-zinc-400 font-mono text-[11px]">× {snack.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No food items attached</p>
                )}
              </div>
            </div>

            {/* Perforated Divider Styling */}
            <div className="relative my-4 flex items-center justify-between">
              <div className="w-6 h-6 rounded-full bg-[#06070a] -ml-9 border border-zinc-800" />
              <div className="flex-1 border-t-2 border-dashed border-zinc-800 mx-2" />
              <div className="w-6 h-6 rounded-full bg-[#06070a] -mr-9 border border-zinc-800" />
            </div>

            {/* Bottom Section: QR Code & Verification Data */}
            <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-xs text-left w-full sm:w-auto">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Unique Ticket Code</span>
                  <span className="font-mono font-black text-amber-400 text-sm">{ticketData.ticketCode}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Booking Reference</span>
                  <span className="font-mono font-bold text-white text-xs">{ticketData.bookingReference}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Amount Paid (Demo)</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    ₹{payment?.amount?.toFixed(2)} ({payment?.paymentMethod})
                  </span>
                </div>
              </div>

              {/* Real QR Code */}
              <div className="flex flex-col items-center bg-white p-3 rounded-2xl shrink-0 shadow-lg border border-zinc-200">
                <QRCodeSVG
                  value={verificationUrl}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[9px] font-bold text-black uppercase tracking-wider mt-1.5 font-mono">
                  Scan to Verify
                </span>
              </div>
            </div>

            {/* Usher Instruction Note */}
            <div className="mt-4 pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>Gate entry opens 20 minutes prior to showtime.</span>
              <span className="font-mono text-zinc-400">Verifiable via /verify-ticket</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons (screen-only) */}
        <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to={`/verify-ticket/${ticketData.ticketCode}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Ticket Verification Page</span>
          </Link>

          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Explore More Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DigitalTicketPage;
