import React from 'react';
import { Plus, Minus, Check, Flame } from 'lucide-react';

export const SnackCard = ({ snack, quantity = 0, onAdd, onRemove }) => {
  const isSelected = quantity > 0;

  return (
    <div
      className={`group relative rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-b from-red-950/40 to-zinc-900 border-2 border-red-500/60 shadow-xl shadow-red-950/20'
          : 'bg-[#0e111a]/80 hover:bg-[#131724] border border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Top Image & Category Pill */}
      <div>
        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-900 mb-3.5">
          <img
            src={snack.image}
            alt={snack.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300">
            {snack.category.replace('_', ' ')}
          </span>

          {/* Active selection checkmark */}
          {isSelected && (
            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Price badge overlaid on bottom right */}
          <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white font-extrabold text-sm">
            ₹{snack.price}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
          {snack.name}
        </h4>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed h-8">
          {snack.description}
        </p>
      </div>

      {/* Bottom Action / Quantity Row */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          {isSelected ? (
            <span className="text-red-400 font-semibold">Subtotal: ₹{snack.price * quantity}</span>
          ) : (
            'Crisp & Fresh'
          )}
        </span>

        {quantity === 0 ? (
          <button
            onClick={() => onAdd(snack)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => onRemove(snack)}
              className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-black text-white">
              {quantity}
            </span>
            <button
              onClick={() => onAdd(snack)}
              className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackCard;
