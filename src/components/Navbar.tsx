import React from 'react';
import { useApp } from '../context/AppContext';
import { AIRPORTS } from '../data/airports';
import { Compass, Gamepad2, BookOpen, Volume2, VolumeX, RotateCcw, Sparkles, CreditCard, Star } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userStats,
    selectedAirportCode,
    setSelectedAirportCode,
    soundEnabled,
    toggleSound,
    resetDemoData,
    stamps,
    reviews
  } = useApp();

  const unlockedStampsCount = stamps.filter(s => s.dateUnlocked).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-amber-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-bold text-sky-600 text-lg">
              ✈
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl">
                IDAVELA
              </span>
              <span className="text-amber-600 font-semibold text-sm font-['Noto_Sans_Malayalam',sans-serif]">
                (ഇടവേള)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block leading-none -mt-0.5">
              Your layover. Your little adventure.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('play')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'play'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Play Dash
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'plan'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Plan & Explore
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Travel Wallet
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Passport ({unlockedStampsCount})
          </button>
        </nav>

        {/* Player Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Airport Selector dropdown */}
          <div className="relative">
            <select
              value={selectedAirportCode}
              onChange={(e) => setSelectedAirportCode(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border-none rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500 transition-colors appearance-none"
              title="Change Layover Hub"
            >
              {AIRPORTS.map((apt) => (
                <option key={apt.code} value={apt.code}>
                  {apt.flag} {apt.code} · {apt.city}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </span>
          </div>

          {/* Coins Counter */}
          <div 
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            title="Shared Virtual Coins (Click to open Wallet)"
          >
            <span className="text-amber-500 text-sm">🪙</span>
            <span className="text-xs font-bold text-amber-800">{userStats.coins}</span>
          </div>

          {/* Travel Credits Counter */}
          <div 
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            title="Demo Travel Credits (Click to open Wallet)"
          >
            <CreditCard className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-800">₹{userStats.travelCredits || 0}</span>
          </div>

          {/* Level / XP */}
          <div 
            onClick={() => setActiveTab('passport')}
            className="hidden sm:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            title="Current Level & XP"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-slate-800">
              Lv.{userStats.level}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Reset Demo State */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo coins, missions, and stamps to original state?')) {
                resetDemoData();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reset Demo Data"
            aria-label="Reset Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
