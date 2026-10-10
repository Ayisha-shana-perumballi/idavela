import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Gamepad2, Compass, BookOpen, CreditCard, Star } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, userMissions, stamps, userStats, reviews } = useApp();

  const activeMissionsCount = Object.values(userMissions).filter(m => m.status === 'active').length;
  const unlockedStampsCount = stamps.filter(s => s.dateUnlocked).length;
  const creditsAmount = userStats.travelCredits || 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[9px]">Home</span>
        </button>

        {/* Play Dash */}
        <button
          onClick={() => setActiveTab('play')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeTab === 'play'
              ? 'text-amber-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-[9px]">Play</span>
        </button>

        {/* Plan & Explore */}
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeTab === 'plan'
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5 mb-0.5" />
            {activeMissionsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-[8px] font-bold px-1 rounded-full">
                {activeMissionsCount}
              </span>
            )}
          </div>
          <span className="text-[9px]">Plan</span>
        </button>

        {/* Reviews */}
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeTab === 'reviews'
              ? 'text-amber-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Star className={`w-5 h-5 mb-0.5 ${activeTab === 'reviews' ? 'fill-current text-amber-500' : ''}`} />
            <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
              {reviews.length}
            </span>
          </div>
          <span className="text-[9px]">Reviews</span>
        </button>

        {/* Travel Wallet */}
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeTab === 'wallet'
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <CreditCard className="w-5 h-5 mb-0.5" />
            {creditsAmount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                ₹{creditsAmount}
              </span>
            )}
          </div>
          <span className="text-[9px]">Wallet</span>
        </button>

        {/* Passport */}
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeTab === 'passport'
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-2 bg-slate-500 text-white text-[8px] font-bold px-1 rounded-full">
              {unlockedStampsCount}
            </span>
          </div>
          <span className="text-[9px]">Passport</span>
        </button>
      </div>
    </nav>
  );
};

