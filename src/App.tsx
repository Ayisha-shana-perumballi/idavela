import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PlannerView } from './components/PlannerView';
import { DubaiDashGame } from './components/DubaiDashGame';
import { PassportView } from './components/PassportView';
import { TravelWalletView } from './components/TravelWalletView';
import { ExploreReviewsView } from './components/ExploreReviewsView';
import { Sparkles, X, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toast, clearToast, selectedAirport, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      {/* Floating Reward Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-sm">
            <div className="text-2xl shrink-0">
              {toast.icon || '🪙'}
            </div>
            <div className="space-y-0.5 flex-1 pr-1">
              <div className="text-xs font-black text-amber-300">
                {toast.title}
              </div>
              <div className="text-[11px] text-slate-300">
                {toast.subtitle}
              </div>
            </div>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Render */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'play' && <DubaiDashGame />}
        {activeTab === 'plan' && <PlannerView />}
        {activeTab === 'reviews' && <ExploreReviewsView />}
        {activeTab === 'wallet' && <TravelWalletView />}
        {activeTab === 'passport' && <PassportView />}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-slate-900">IDAVELA</span>
            <span className="text-amber-600 font-semibold font-['Noto_Sans_Malayalam',sans-serif]">ഇടവേള</span>
            <span>·</span>
            <span className="text-slate-600">Your layover. Your little adventure.</span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
            Gamified layover travel companion. All times, itineraries, and costs are simulated estimates for planning inspiration. Always monitor live boarding gate screens at the airport.
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-1">
            <button onClick={() => setActiveTab('home')} className="hover:text-slate-900">Home</button>
            <button onClick={() => setActiveTab('play')} className="hover:text-slate-900">Dubai Dash</button>
            <button onClick={() => setActiveTab('plan')} className="hover:text-slate-900">Smart Planner</button>
            <button onClick={() => setActiveTab('wallet')} className="hover:text-slate-900">Travel Wallet</button>
            <button onClick={() => setActiveTab('passport')} className="hover:text-slate-900">Travel Passport</button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
