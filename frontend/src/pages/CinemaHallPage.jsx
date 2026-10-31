import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { MOVIES as FALLBACK_MOVIES } from '../data/moviesData';
import { generateCinemaSeats, getSeatPosition } from '../data/cinemaHallData';
import { AuditoriumCanvas } from '../components/cinema/AuditoriumCanvas';
import { SeatMap2DView } from '../components/cinema/SeatMap2DView';
import { SeatSelectionPanel } from '../components/cinema/SeatSelectionPanel';
import seatService from '../services/seatService';
import showService from '../services/showService';
import movieService from '../services/movieService';
import bookingService from '../services/bookingService';
import { 
  X, 
  Check, 
  Sparkles, 
  Popcorn, 
  AlertCircle,
  Database,
  Timer,
  Lock,
  RefreshCw
} from 'lucide-react';

export const CinemaHallPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract booking details from location.state or query params with safe fallbacks
  const urlMovieId = searchParams.get('movieId') || location.state?.movie?.id || 'kalki-2898-ad';
  const urlTheatreId = searchParams.get('theatreId') || location.state?.theatre?.id || 'inox-megaplex';
  const urlShowId = searchParams.get('showId') || location.state?.showtime?.id || null;
  const selectedDate = searchParams.get('date') || location.state?.date?.full || 'Today, 31 Oct';
  const selectedTime = searchParams.get('time') || location.state?.showtime?.time || '10:30 AM';
  const screenFormat = searchParams.get('format') || location.state?.showtime?.format || 'IMAX 3D';

  const [activeShowId, setActiveShowId] = useState(urlShowId);
  const [movie, setMovie] = useState(() => {
    return FALLBACK_MOVIES.find((m) => m.id === urlMovieId) || FALLBACK_MOVIES[0];
  });
  const [theatre, setTheatre] = useState(() => {
    return {
      name: location.state?.theatre?.name || 'INOX Megaplex: Laser IMAX',
      address: location.state?.theatre?.address || 'Inorbit Mall, Level 4',
      screenFormat: screenFormat,
    };
  });

  // Dynamic API seat state with local fallback
  const [seats, setSeats] = useState(() => generateCinemaSeats(movie.id, selectedTime));
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Selection states
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [activeCameraPreset, setActiveCameraPreset] = useState('overview');
  const [is2DView, setIs2DView] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // Active reservation hold state
  const [heldBooking, setHeldBooking] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(300); // 5 minutes in seconds

  // Fetch real movie, show and seats from database
  const loadShowAndSeats = async () => {
    setLoadingSeats(true);
    try {
      // 1. Resolve Show ID
      let resolvedShowId = activeShowId;

      if (!resolvedShowId) {
        // Find matching show from backend
        try {
          const shows = await showService.getShows({
            ...(urlMovieId ? { movieId: urlMovieId } : {}),
          });
          if (shows && shows.length > 0) {
            resolvedShowId = shows[0].id;
            setActiveShowId(resolvedShowId);
            if (shows[0].movie) {
              setMovie((prev) => ({ ...prev, ...shows[0].movie }));
            }
            if (shows[0].screen?.theatre) {
              setTheatre({
                name: shows[0].screen.theatre.name,
                address: shows[0].screen.theatre.address,
                screenFormat: shows[0].screen.screenType ? `${shows[0].screen.screenType.replace('_', ' ')}` : screenFormat,
              });
            }
          }
        } catch {
          // Continue to fallback
        }
      }

      // 2. Fetch Dynamic Seats if Show ID available
      if (resolvedShowId) {
        const data = await seatService.getShowSeats(resolvedShowId);
        if (data?.seats && data.seats.length > 0) {
          // Map backend seats to 3D spatial coordinates
          const mappedSeats = data.seats.map((s) => {
            const position = getSeatPosition(s.row, s.seatNumber);
            return {
              id: s.id,
              showSeatId: s.showSeatId,
              row: s.row,
              number: s.seatNumber,
              label: `${s.row}${s.seatNumber}`,
              category: s.category,
              price: s.price,
              status: s.status === 'AVAILABLE' ? 'available' : 'occupied',
              position,
            };
          });

          setSeats(mappedSeats);
          setIsFromDatabase(true);

          if (data.movie) {
            setMovie((prev) => ({ ...prev, ...data.movie }));
          }
          if (data.screen?.theatre) {
            setTheatre({
              name: data.screen.theatre.name,
              address: data.screen.theatre.address,
              screenFormat: data.screen.screenType ? `${data.screen.screenType.replace('_', ' ')}` : screenFormat,
            });
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[CinemaHall] Using local seat generator fallback:', err.message);
    } finally {
      setLoadingSeats(false);
    }

    // Fallback local seat matrix if backend is spinning up
    setSeats(generateCinemaSeats(movie.id, selectedTime));
    setIsFromDatabase(false);
  };

  useEffect(() => {
    loadShowAndSeats();
  }, [urlMovieId, urlShowId]);

  // Hold expiration countdown
  useEffect(() => {
    if (!confirmationModalOpen || !heldBooking) return;

    const interval = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setConfirmationModalOpen(false);
          showAlert('Your 5-minute seat hold has expired. Please reselect your seats.');
          setSelectedSeatIds([]);
          setHeldBooking(null);
          loadShowAndSeats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmationModalOpen, heldBooking]);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Toggle seat selection
  const handleToggleSeatSelect = (seat) => {
    if (seat.status === 'occupied') {
      showAlert(`Seat ${seat.label} is currently reserved or held by another moviegoer.`);
      return;
    }

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        showAlert('Maximum 8 seats allowed per booking transaction.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const handleClearSelection = () => {
    setSelectedSeatIds([]);
  };

  // Selected seat objects list
  const selectedSeatsList = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const totalAmount = useMemo(() => {
    return selectedSeatsList.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeatsList]);

  // Proceed to reserve seats (Call backend holdSeats API)
  const handleProceedToHold = async () => {
    if (selectedSeatIds.length === 0) {
      showAlert('Please select at least one seat to proceed.');
      return;
    }

    if (activeShowId && isFromDatabase) {
      setIsHolding(true);
      try {
        const holdData = await bookingService.holdSeats({
          showId: activeShowId,
          seatIds: selectedSeatIds,
        });

        setHeldBooking(holdData);
        setHoldTimer(holdData.expiresInSeconds || 300);
        setConfirmationModalOpen(true);
      } catch (err) {
        showAlert(err.message || 'Unable to hold selected seats. Another user may have just reserved them.');
        // Refresh seats to reflect conflict
        loadShowAndSeats();
      } finally {
        setIsHolding(false);
      }
    } else {
      // Local fallback mode
      setHeldBooking({
        bookingReference: `CV3D-${Date.now().toString(36).toUpperCase()}`,
        totalTicketAmount: totalAmount,
        expiresInSeconds: 300,
      });
      setHoldTimer(300);
      setConfirmationModalOpen(true);
    }
  };

  // Release hold if user modifies seats
  const handleReleaseHold = async () => {
    if (heldBooking?.bookingReference && isFromDatabase) {
      try {
        await bookingService.releaseHold(heldBooking.bookingReference);
      } catch {}
    }
    setHeldBooking(null);
    setConfirmationModalOpen(false);
    loadShowAndSeats();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-[#050609] overflow-hidden flex flex-col select-none">
      {/* Alert Toast Notification */}
      {alertMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-red-950/90 border border-red-500/60 text-white text-xs font-semibold shadow-2xl backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{alertMessage}</span>
            <button
              onClick={() => setAlertMessage(null)}
              className="ml-2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Database Connection Pill */}
      <div className="absolute top-4 left-4 z-30 hidden sm:flex items-center gap-2">
        {isFromDatabase ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-lg">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Dynamic Seats</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Local Seat Simulator</span>
          </div>
        )}

        <button
          onClick={loadShowAndSeats}
          disabled={loadingSeats}
          className="p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all backdrop-blur-md"
          title="Refresh real-time seat availability"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingSeats ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main View Area: 3D Canvas or 2D Map */}
      <div className="relative flex-1 w-full h-full">
        {!is2DView ? (
          <AuditoriumCanvas
            movie={movie}
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeatSelect={handleToggleSeatSelect}
            activeCameraPreset={activeCameraPreset}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto bg-[#07090e] pt-24 pb-36">
            <SeatMap2DView
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeatSelect={handleToggleSeatSelect}
            />
          </div>
        )}

        {/* Floating Top & Bottom Control HUD */}
        <SeatSelectionPanel
          movie={movie}
          theatreName={theatre.name}
          screenName={`${theatre.screenFormat || screenFormat}`}
          date={selectedDate}
          time={selectedTime}
          selectedSeats={selectedSeatsList}
          onClearSelection={handleClearSelection}
          onContinue={handleProceedToHold}
          activeCameraPreset={activeCameraPreset}
          onChangeCameraPreset={setActiveCameraPreset}
          is2DView={is2DView}
          onToggle2DView={() => setIs2DView(!is2DView)}
          isHolding={isHolding}
        />
      </div>

      {/* Concurrency-Safe Seat Hold Confirmation Modal */}
      {confirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-[#0e111a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleReleaseHold}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-0.5">
                  <Lock className="w-3 h-3" />
                  <span>Seats Atomically Locked in PostgreSQL</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Temporary Reservation Active</h3>
              </div>
            </div>

            {/* Hold Expiration Timer Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-amber-950/30 border border-red-900/60 mb-4">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Timer className="w-4 h-4 text-amber-400" />
                <span>Seat Lock Expiration:</span>
              </div>
              <span className="font-mono font-black text-amber-400 text-sm">
                {formatTimer(holdTimer)}
              </span>
            </div>

            {/* Booking Details Summary */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs my-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Booking Reference:</span>
                <span className="font-mono font-bold text-red-400 text-xs">
                  {heldBooking?.bookingReference || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Movie:</span>
                <span className="font-bold text-white text-sm">{movie.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Cinema & Screen:</span>
                <span className="font-semibold text-white">{theatre.name} ({screenFormat})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Date & Showtime:</span>
                <span className="font-semibold text-red-400">{selectedDate} • {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Seats ({selectedSeatsList.length}):</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {selectedSeatsList.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                      {s.label} ({s.category})
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-sm">
                <span className="font-bold text-white">Calculated Ticket Amount:</span>
                <span className="font-black text-amber-400 text-base">
                  ₹{heldBooking?.totalTicketAmount || totalAmount}
                </span>
              </div>
            </div>

            {/* Proceed to Concessions & Food */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed mb-6">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                <Popcorn className="w-4 h-4 text-amber-400" />
                <span>Cinema Concessions (Phase 4):</span>
              </div>
              Your {selectedSeatsList.length} seats are safely locked in PostgreSQL. Proceed to grab hot popcorn, nachos, and cold drinks before checkout!
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReleaseHold}
                className="w-1/3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                Modify Seats
              </button>
              <button
                onClick={() => {
                  setConfirmationModalOpen(false);
                  navigate(`/snacks?bookingRef=${heldBooking?.bookingReference || ''}`);
                }}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all text-center flex items-center justify-center gap-2"
              >
                <Popcorn className="w-4 h-4 text-amber-300" />
                <span>Add Snacks & Concessions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
