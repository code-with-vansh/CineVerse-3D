import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  MapPin, 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  Box, 
  Ticket,
  Sparkles,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ 
  selectedCity, 
  onOpenLocationModal, 
  onOpenSearchModal,
  selectedLanguage,
  onSelectLanguage 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, setAuthModalOpen, setMyBookingsModalOpen } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'CV';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent flex items-center gap-1.5">
                    CINEVERSE <span className="text-red-500 font-black">3D</span>
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-500 -mt-1">
                    Next-Gen Cinema
                  </span>
                </div>
              </Link>

              {/* Location Selector */}
              <button
                onClick={onOpenLocationModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-all group"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-white">{selectedCity?.name || 'Mumbai'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <Link to="/" className="text-white hover:text-red-400 transition-colors flex items-center gap-1.5">
                <Film className="w-4 h-4 text-red-500" />
                Movies
              </Link>
              <Link 
                to="/cinema-hall" 
                className="hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <Box className="w-4 h-4 text-red-500" />
                3D Auditorium
              </Link>
              <a 
                href="/#now-showing" 
                className="hover:text-red-400 transition-colors"
              >
                Now Showing
              </a>
              <a 
                href="/#upcoming" 
                className="hover:text-red-400 transition-colors"
              >
                Upcoming
              </a>
            </nav>

            {/* Action Bar (Search, 3D Badge, Profile, Mobile Menu) */}
            <div className="flex items-center gap-3">
              {/* Search Trigger */}
              <button
                onClick={onOpenSearchModal}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-all shadow-inner"
              >
                <Search className="w-4 h-4 text-zinc-400" />
                <span className="hidden md:inline">Search movies, 3D halls...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                  Ctrl+K
                </kbd>
              </button>

              {/* 3D Hall Badge Direct link */}
              <Link
                to="/cinema-hall"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/10 via-rose-600/10 to-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:border-red-500/60 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>3D Hall</span>
              </Link>

              {/* User Account / Profile Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white text-[11px] font-black">
                      {getInitials(user.name)}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="hidden sm:inline w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 p-3 bg-[#11141e] border border-zinc-800 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-3 p-2 border-b border-zinc-800 pb-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(user.name)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-bold text-white truncate">{user.name}</div>
                          <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                          {user.role === 'ADMIN' && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60 font-semibold mt-1">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-zinc-300">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setMyBookingsModalOpen(true);
                          }}
                          className="w-full p-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2.5 text-left transition-colors"
                        >
                          <Ticket className="w-4 h-4 text-red-400" />
                          <span>My 3D Bookings</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenLocationModal();
                          }}
                          className="w-full p-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2.5 text-left transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          <span>City: {selectedCity?.name}</span>
                        </button>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full p-2 rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2.5 text-xs text-left transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-950/40 hover:scale-105"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 border-t border-zinc-800 bg-[#0d0f17] space-y-4 animate-in slide-in-from-top-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Selected City: <strong className="text-white">{selectedCity?.name}</strong></span>
              </div>
              <span className="text-xs text-red-400 font-medium">Change</span>
            </button>

            <nav className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 flex items-center gap-2.5"
              >
                <Film className="w-4 h-4 text-red-500" />
                Movies Catalog
              </Link>
              <Link 
                to="/cinema-hall" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-zinc-900 flex items-center gap-2.5"
              >
                <Box className="w-4 h-4 text-red-500" />
                3D Cinema Hall Simulator
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMyBookingsModalOpen(true);
                  }}
                  className="w-full p-3 rounded-xl hover:bg-zinc-900 flex items-center gap-2.5 text-left text-zinc-300"
                >
                  <Ticket className="w-4 h-4 text-red-400" />
                  <span>My 3D Bookings</span>
                </button>
              )}
            </nav>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm text-center"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 text-red-400 font-bold text-sm text-center border border-zinc-800"
              >
                Sign Out ({user.name})
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
