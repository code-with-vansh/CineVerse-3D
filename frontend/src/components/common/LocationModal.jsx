import React, { useState } from 'react';
import { MapPin, X, Search, Check, Building2 } from 'lucide-react';
import { CITIES } from '../../data/citiesData';

export const LocationModal = ({ isOpen, onClose, selectedCity, onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const popularCities = CITIES.filter(c => c.popular);
  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0f121a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Select Your City</h2>
              <p className="text-xs text-zinc-400">Discover 3D halls and showtimes in your vicinity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search for your city (e.g., Mumbai, Bengaluru, Hyderabad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Popular Cities Section (Shown when no search query) */}
        {!searchQuery && (
          <div className="px-6 py-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Popular Cities</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              {popularCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500/60 text-white shadow-lg shadow-red-950/20'
                        : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-1.5">
                        {city.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{city.theatresCount} Theatres</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All / Filtered Cities */}
        <div className="p-6 pt-2 max-h-72 overflow-y-auto">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {searchQuery ? `Search Results (${filteredCities.length})` : 'All Available Cities'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {filteredCities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/50 text-white'
                      : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-zinc-500 ml-2">({city.state})</span>
                  </div>
                  <span className="text-xs text-zinc-500">{city.theatresCount} screens</span>
                </button>
              );
            })}
            {filteredCities.length === 0 && (
              <div className="col-span-2 py-8 text-center text-zinc-500 text-sm">
                No cities found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 text-center text-xs text-zinc-500">
          Showing real-time seat availability for selected cinemas in {selectedCity?.name || 'India'}
        </div>
      </div>
    </div>
  );
};
