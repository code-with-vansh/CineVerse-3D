import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import snackService from '../services/snackService';
import bookingService from '../services/bookingService';
import { SnackCard } from '../components/snacks/SnackCard';
import { CartSidebar } from '../components/snacks/CartSidebar';
import { 
  Popcorn, 
  Coffee, 
  UtensilsCrossed, 
  Flame, 
  Sparkles, 
  Timer, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Film
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Concessions', icon: Sparkles },
  { id: 'POPCORN', label: 'Popcorn', icon: Popcorn },
  { id: 'NACHOS', label: 'Nachos', icon: Flame },
  { id: 'BURGERS_PIZZA', label: 'Burgers & Pizza', icon: UtensilsCrossed },
  { id: 'BEVERAGES', label: 'Beverages', icon: Coffee },
  { id: 'COMBOS', label: 'Value Combos', icon: Film },
];

export const SnacksPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('bookingRef');

  const [booking, setBooking] = useState(null);
  const [snacks, setSnacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [holdTimer, setHoldTimer] = useState(300);

  // Load booking and snacks
  useEffect(() => {
    let timerId = null;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Snacks Catalog
        const snacksData = await snackService.getSnacks();
        setSnacks(snacksData || []);

        // 2. Fetch Booking if ref exists
        if (bookingRef) {
          const summary = await bookingService.getBookingSummary(bookingRef);
          if (summary?.booking) {
            setBooking(summary.booking);
            setHoldTimer(summary.remainingHoldSeconds || 300);

            // Pre-populate cart if booking already had saved snacks
            if (summary.booking.bookingSnacks?.length > 0) {
              const initialCart = {};
              summary.booking.bookingSnacks.forEach((bs) => {
                initialCart[bs.snackId] = {
                  snack: bs.snack,
                  quantity: bs.quantity,
                };
              });
              setCart(initialCart);
            }
          }
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load cinema concessions.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [bookingRef]);

  // Hold Countdown
  useEffect(() => {
    if (!holdTimer || holdTimer <= 0) return;

    const interval = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('Your 5-minute seat reservation has expired. Please select seats again.');
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

  // Cart operations
  const handleAddSnack = (snack) => {
    setCart((prev) => {
      const currentQty = prev[snack.id]?.quantity || 0;
      if (currentQty >= 20) return prev;
      return {
        ...prev,
        [snack.id]: {
          snack,
          quantity: currentQty + 1,
        },
      };
    });
  };

  const handleRemoveSnack = (snack) => {
    setCart((prev) => {
      const currentQty = prev[snack.id]?.quantity || 0;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[snack.id];
        return copy;
      }
      return {
        ...prev,
        [snack.id]: {
          snack,
          quantity: currentQty - 1,
        },
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Filter snacks
  const filteredSnacks = useMemo(() => {
    if (selectedCategory === 'ALL') return snacks;
    return snacks.filter((s) => s.category === selectedCategory);
  }, [snacks, selectedCategory]);

  // Proceed to Checkout
  const handleProceedToCheckout = async () => {
    if (!bookingRef) {
      navigate('/');
      return;
    }

    if (holdTimer <= 0) {
      setErrorMessage('Your seat hold has expired. Please return to auditorium.');
      return;
    }

    setIsUpdatingCart(true);
    try {
      const items = Object.values(cart).map((item) => ({
        snackId: item.snack.id,
        quantity: item.quantity,
      }));

      // Update backend order atomically
      await bookingService.updateBookingSnacks(bookingRef, items);
      navigate(`/checkout?bookingRef=${bookingRef}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update snacks cart. Please retry.');
    } finally {
      setIsUpdatingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm font-semibold text-zinc-400">Loading cinema concessions & snacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white pt-24 pb-20 selection:bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Countdown Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Seat Map</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>Gourmet Cinema Concessions</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-widest font-bold">
                Phase 4
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Elevate your movie experience with warm popcorn, loaded nachos, and chilled beverages.
            </p>
          </div>

          {/* Seat Hold Status Badge */}
          {booking && (
            <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-2.5 shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${holdTimer < 60 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
                <span className="text-xs text-zinc-300 font-semibold">Seat Lock:</span>
              </div>
              <span className={`font-mono text-sm font-black ${holdTimer < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                {formatTimer(holdTimer)}
              </span>
            </div>
          )}
        </div>

        {/* Error Notification */}
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

        {/* Main Concession Interface Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Category Pills & Snack Products Grid */}
          <div className="flex-1 w-full">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 scale-[1.02]'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Snack Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredSnacks.map((snack) => (
                <SnackCard
                  key={snack.id}
                  snack={snack}
                  quantity={cart[snack.id]?.quantity || 0}
                  onAdd={handleAddSnack}
                  onRemove={handleRemoveSnack}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Persistent Live Food Cart Sidebar */}
          <CartSidebar
            cart={cart}
            booking={booking}
            onAddSnack={handleAddSnack}
            onRemoveSnack={handleRemoveSnack}
            onClearCart={handleClearCart}
            onProceed={handleProceedToCheckout}
            isUpdating={isUpdatingCart}
          />
        </div>
      </div>
    </div>
  );
};

export default SnacksPage;
