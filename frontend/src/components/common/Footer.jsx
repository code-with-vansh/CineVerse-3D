import React from 'react';
import { Box, Shield, Sparkles, Heart } from 'lucide-react';
import { LANGUAGES } from '../../data/moviesData';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#07080c] border-t border-zinc-800/80 pt-16 pb-12 mt-20 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-950/40">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                CINEVERSE <span className="text-red-500">3D</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              The premier interactive 3D cinema booking platform. Explore realistic auditorium environments, examine seat perspectives in real-time 3D, and book the ultimate movie experience.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> 100% Secure Checkout
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> WebGL Accelerated
              </span>
            </div>
          </div>

          {/* Languages Supported */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Supported Languages
            </h4>
            <ul className="space-y-2 text-xs">
              {LANGUAGES.filter(l => l !== 'All').map((lang) => (
                <li key={lang} className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                  <span>{lang} Cinema</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cinematic Formats */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Cinema Formats
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition-colors">Laser IMAX 3D</li>
              <li className="hover:text-orange-400 transition-colors">4DX Motion & Effects</li>
              <li className="hover:text-purple-400 transition-colors">Dolby Cinema & Atmos</li>
              <li className="hover:text-emerald-400 transition-colors">Gold Class VIP Lounge</li>
              <li className="hover:text-zinc-300 transition-colors">RealD 3D & 2D</li>
            </ul>
          </div>

          {/* 3D Hall Innovation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              3D Innovation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Interactive 3D Seating</li>
              <li>4 Camera Angles View</li>
              <li>Wall Collision Prevention</li>
              <li>Real-time Seat Locking</li>
              <li>Snacks Pre-ordering</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 CineVerse 3D. College Software Engineering Project. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>Architected with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>using Three.js, React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
