import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCreds = (type) => {
    setError(null);
    if (type === 'admin') {
      setEmail('admin@cineverse.com');
      setPassword('Admin@123');
      setIsRegister(false);
    } else {
      setEmail('user@cineverse.com');
      setPassword('User@123');
      setIsRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#0e111a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">
            CineVerse 3D Account
          </span>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-white mt-1">
          {isRegister ? 'Create Your Account' : 'Welcome Back'}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 mb-6">
          {isRegister
            ? 'Sign up to reserve 3D cinema seats and unlock booking history.'
            : 'Sign in to access your held reservations and digital cinema passes.'}
        </p>

        {/* Quick Dev Credential Fill Buttons */}
        <div className="flex items-center gap-2 mb-5 p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs">
          <span className="text-zinc-500 font-semibold pl-1">Quick Demo:</span>
          <button
            type="button"
            onClick={() => fillQuickCreds('user')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
          >
            User Demo
          </button>
          <button
            type="button"
            onClick={() => fillQuickCreds('admin')}
            className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 hover:bg-red-900/60 font-medium transition-colors flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            Admin Demo
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@cineverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Complete Registration' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch tab */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="text-red-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="text-red-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
