import React from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Ticket, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const CartSidebar = ({
  cart,
  booking,
  onAddSnack,
  onRemoveSnack,
  onClearCart,
  onProceed,
  isUpdating = false,
}) => {
  const cartItems = Object.values(cart);
  const totalSnackItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSnackAmount = cartItems.reduce((sum, item) => sum + (item.snack.price * item.quantity), 0);
  const ticketAmount = booking?.totalTicketAmount || 0;
  
  // Preliminary estimated fees
  const convenienceFee = 35.0;
  const taxAmount = Math.round(((convenienceFee * 0.18) + (totalSnackAmount * 0.05)) * 100) / 100;
  const grandTotal = Math.round((ticketAmount + totalSnackAmount + convenienceFee + taxAmount) * 100) / 100;

  return (
    <div className="w-full lg:w-96 shrink-0 bg-[#0c0e17] border border-zinc-800/80 rounded-3xl p-5 flex flex-col shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <ShoppingBag className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Order Summary</h3>
            <span className="text-[11px] text-zinc-400">
              {totalSnackItemsCount} {totalSnackItemsCount === 1 ? 'snack item' : 'snack items'} added
            </span>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-red-400 transition-colors p-1"
            title="Clear all snacks"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Movie Tickets Sub-Card */}
      {booking && (
        <div className="my-4 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Reserved Seats</span>
          </div>
          <div className="flex justify-between items-start text-xs">
            <div>
              <p className="font-bold text-zinc-200 line-clamp-1">{booking.show?.movie?.title || 'Selected Movie'}</p>
              <p className="text-[11px] text-zinc-400">
                {booking.show?.screen?.theatre?.name} • {booking.show?.startTime}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {booking.bookingSeats?.map((bs) => (
                  <span key={bs.id} className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold">
                    {bs.seat?.row}{bs.seat?.seatNumber}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-mono font-bold text-white text-xs">₹{ticketAmount}</span>
          </div>
        </div>
      )}

      {/* Food Items List */}
      <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1 my-1">
        {cartItems.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs flex flex-col items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-zinc-700 mb-2 stroke-[1.5]" />
            <p className="font-semibold text-zinc-400">Your snack cart is empty</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
              Add gourmet popcorn, nachos, or refreshing beverages for your show!
            </p>
          </div>
        ) : (
          cartItems.map(({ snack, quantity }) => (
            <div
              key={snack.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-zinc-800"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{snack.name}</h5>
                  <span className="text-[11px] text-zinc-400">₹{snack.price} × {quantity}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5">
                  <button
                    onClick={() => onRemoveSnack(snack)}
                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-4 text-center text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onAddSnack(snack)}
                    className="w-5 h-5 rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
                <span className="font-mono font-bold text-white text-xs w-14 text-right">
                  ₹{snack.price * quantity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Breakdown */}
      <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2 text-xs">
        <div className="flex justify-between text-zinc-400">
          <span>Tickets Subtotal</span>
          <span className="font-mono text-zinc-200">₹{ticketAmount}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Food & Beverages</span>
          <span className="font-mono text-zinc-200">₹{totalSnackAmount}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Convenience Fee & Taxes</span>
          <span className="font-mono text-zinc-200">₹{(convenienceFee + taxAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-sm font-bold">
          <span className="text-white">Total Amount</span>
          <span className="font-mono text-base font-extrabold text-amber-400">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="mt-5 space-y-2">
        <button
          onClick={onProceed}
          disabled={isUpdating}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          <span>{cartItems.length > 0 ? 'Proceed with Snacks' : 'Skip & Proceed to Checkout'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Server-calculated prices with ACID locking</span>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
