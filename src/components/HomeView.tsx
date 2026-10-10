import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACTIVITIES } from '../data/airports';
import { getLevelInfo } from '../data/stampsAndBadges';
import { FlightEditModal } from './FlightEditModal';
import { 
  Plane, 
  Clock, 
  MapPin, 
  Gamepad2, 
  Compass, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  AlertCircle,
  Play,
  CheckCircle2,
  Sliders,
  Award,
  Edit3,
  CreditCard,
  Ticket,
  Star,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    selectedAirport,
    demoFlight,
    updateDemoCountdown,
    userStats,
    stamps,
    userMissions,
    startMission,
    completeMission,
    convertCoinsToCredits,
    redeemedVouchers,
    reviews,
    getAverageRatingForAirport
  } = useApp();

  const [showCountdownAdjuster, setShowCountdownAdjuster] = useState(false);
  const [showFlightEditModal, setShowFlightEditModal] = useState(false);
  const [quickConvertMsg, setQuickConvertMsg] = useState<string | null>(null);

  const hubRatings = getAverageRatingForAirport(selectedAirport.code);
  const hubReviews = reviews.filter(r => r.airportCode === selectedAirport.code).slice(0, 2);

  const handleQuickConvert = () => {
    if (userStats.coins < 100) {
      setQuickConvertMsg(`Need 100 coins (you have ${userStats.coins}). Play Dubai Dash!`);
      setTimeout(() => setQuickConvertMsg(null), 3000);
      return;
    }
    const res = convertCoinsToCredits(100);
    if (res.success) {
      setQuickConvertMsg('Converted 100 Coins to ₹10 Travel Credits!');
      setTimeout(() => setQuickConvertMsg(null), 3000);
    }
  };

  // Compute stats
  const levelInfo = getLevelInfo(userStats.xp);
  const unlockedStamps = stamps.filter(s => s.dateUnlocked);
  const completedMissionsCount = Object.values(userMissions).filter(m => m.status === 'completed').length;
  const activeMissionsCount = Object.values(userMissions).filter(m => m.status === 'active').length;

  // Filter activities for current airport
  const airportActivities = ACTIVITIES.filter(a => a.airportCode === selectedAirport.code);
  
  // Recommend a mission (pick an active one first, or a high-reward uncompleted one)
  const activeMissionObj = airportActivities.find(a => userMissions[a.id]?.status === 'active');
  const recommendedActivity = activeMissionObj || airportActivities.find(a => userMissions[a.id]?.status !== 'completed') || airportActivities[0];

  // Daily missions list (3 items)
  const dailyMissions = airportActivities.slice(0, 3);
  const dailyCompletedCount = dailyMissions.filter(m => userMissions[m.id]?.status === 'completed').length;

  // Format countdown
  const hours = Math.floor(demoFlight.minutesRemaining / 60);
  const mins = demoFlight.minutesRemaining % 60;
  const formattedCountdown = `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white p-6 sm:p-8 shadow-lg">
        {/* Subtle decorative background airplane pattern */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-72 h-72 bg-white/5 rounded-full pointer-events-none blur-2xl"></div>
        <div className="absolute right-12 bottom-4 opacity-10 text-9xl font-extrabold select-none pointer-events-none">
          ✈
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-amber-300 font-semibold text-xs tracking-wider uppercase bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Gamified Layover Adventure
            </span>
            <span className="text-sky-200 text-xs">
              • Turn transit time into mini-quests
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              IDAVELA
            </h1>
            <span className="text-amber-300 font-semibold text-xl sm:text-2xl font-['Noto_Sans_Malayalam',sans-serif]">
              ഇടവേള
            </span>
          </div>

          <p className="text-sky-100 text-sm sm:text-base font-medium mb-6">
            Your layover. Your little adventure. Explore world transit hubs, collect digital stamps, and sprint through airport concourses!
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('plan')}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-slate-900" />
              <span>Explore My Layover</span>
            </button>
            <button
              onClick={() => setActiveTab('play')}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-2.5 rounded-xl text-sm backdrop-blur-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Play Dubai Dash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Boarding Pass / DEMO Layover Countdown Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Header of Ticket */}
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-amber-400 rotate-45" />
            <span className="font-bold tracking-wide">DEMO TRANSIT BOARDING PASS</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <button
              onClick={() => setShowFlightEditModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition-colors border border-white/10 cursor-pointer"
              title="Customize Flight Connection"
            >
              <Edit3 className="w-3 h-3 text-amber-300" />
              <span>Customize Flight</span>
            </button>
            <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide">
              DEMO DATA ONLY
            </span>
            <span className="hidden sm:inline">• Simulated Flight Connection</span>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Flight Route Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Origin</span>
                  <span className="text-xl font-black text-slate-900">{demoFlight.originCode}</span>
                  <span className="text-xs text-slate-500 block">{demoFlight.origin}</span>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 mb-1">
                    <span>Flight {demoFlight.flightNumber}</span>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="h-0.5 flex-1 bg-slate-200"></div>
                    <div className="px-2 text-sky-500 font-bold text-xs">✈</div>
                    <div className="h-0.5 flex-1 bg-slate-200"></div>
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Layover: {selectedAirport.city} ({selectedAirport.code})
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Connecting To</span>
                  <span className="text-xl font-black text-slate-900">{demoFlight.destinationCode}</span>
                  <span className="text-xs text-slate-500 block">{demoFlight.destination}</span>
                </div>
              </div>

              {/* Transit gate metadata */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-600 block font-medium">Terminal</span>
                  <span className="font-bold text-slate-800">{demoFlight.terminal}</span>
                </div>
                <div>
                  <span className="text-slate-600 block font-medium">Departing Gate</span>
                  <span className="font-bold text-slate-800">{demoFlight.gate}</span>
                </div>
                <div>
                  <span className="text-slate-600 block font-medium">Next Flight</span>
                  <span className="font-bold text-slate-800">{demoFlight.nextFlightNumber}</span>
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-4 rounded-2xl border border-sky-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold mb-1">
                <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>BOARDING COUNTDOWN</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight my-1">
                {formattedCountdown}
              </div>
              <div className="text-[11px] text-slate-500 mb-3">
                {demoFlight.minutesRemaining > 45 ? 'Safe time for an adventure!' : 'Head toward gate area soon!'}
              </div>

              {/* Adjust demo countdown buttons */}
              <button
                onClick={() => setShowCountdownAdjuster(!showCountdownAdjuster)}
                className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-sky-200 transition-colors"
              >
                <Sliders className="w-3 h-3" />
                <span>{showCountdownAdjuster ? 'Hide Timer Controls' : 'Adjust Demo Timer'}</span>
              </button>

              {showCountdownAdjuster && (
                <div className="mt-3 pt-2 border-t border-sky-200/60 w-full flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateDemoCountdown(-30)}
                    className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                    title="Subtract 30 minutes"
                  >
                    -30m
                  </button>
                  <button
                    onClick={() => updateDemoCountdown(-15)}
                    className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                    title="Subtract 15 minutes"
                  >
                    -15m
                  </button>
                  <button
                    onClick={() => updateDemoCountdown(+30)}
                    className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                    title="Add 30 minutes"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => updateDemoCountdown(+60)}
                    className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                    title="Add 1 hour"
                  >
                    +1h
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transparent disclaimer banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.2" />
            <span>
              <strong>Notice:</strong> This countdown and itinerary are interactive demo estimations designed to help plan transit hours. IDAVELA is not connected to live flight radar systems. Always verify gate screens inside the airport.
            </span>
          </div>
        </div>
      </div>

      {/* Gamification Progress Bar & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Coins */}
        <div 
          onClick={() => setActiveTab('passport')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Virtual Coins</span>
            <span className="text-amber-500 group-hover:scale-110 transition-transform">🪙</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userStats.coins}
          </div>
          <span className="text-[10px] text-slate-600 block mt-1">
            Earned from runs & quests
          </span>
        </div>

        {/* Level & XP */}
        <div 
          onClick={() => setActiveTab('passport')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-sky-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Level {userStats.level}</span>
            <Sparkles className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-base font-extrabold text-slate-900 truncate">
            {userStats.levelTitle}
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-600 block mt-1">
            {userStats.xp} / {levelInfo.nextLevelXP} XP
          </span>
        </div>

        {/* Passport Stamps */}
        <div 
          onClick={() => setActiveTab('passport')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Passport Stamps</span>
            <span className="text-emerald-500 group-hover:scale-110 transition-transform">🛂</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {unlockedStamps.length} <span className="text-xs font-normal text-slate-600">/ {stamps.length}</span>
          </div>
          <span className="text-[10px] text-slate-600 block mt-1">
            Digital travel collection
          </span>
        </div>

        {/* Dubai Dash High Score */}
        <div 
          onClick={() => setActiveTab('play')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-orange-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Dash Record</span>
            <span className="text-orange-500 group-hover:scale-110 transition-transform">⚡</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userStats.highScoreDubaiDash} <span className="text-xs font-normal text-slate-600">m</span>
          </div>
          <span className="text-[10px] text-slate-600 block mt-1">
            Terminal endless runner
          </span>
        </div>
      </div>

      {/* Travel Wallet Spotlight & Fast Convert Card */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-sky-800/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Travel Wallet Connected
              </span>
              <span className="text-sky-300 text-xs font-semibold">
                • 100 Game Coins = ₹10 Credits
              </span>
            </div>

            <h3 className="text-lg font-black text-white">
              Turn Dubai Dash Runs into Real Transit Discounts
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              You have <span className="font-black text-amber-300">🪙 {userStats.coins} Coins</span> and <span className="font-black text-sky-300">₹{userStats.travelCredits || 0} Demo Travel Credits</span>. Redeem vouchers for Paul Bakery, Costa Coffee, Duty Free fragrances, and transit lounges.
            </p>

            {quickConvertMsg && (
              <div className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-xl inline-block animate-in fade-in">
                {quickConvertMsg}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleQuickConvert}
              className="flex-1 md:flex-none bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Convert 100 🪙 → ₹10</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className="flex-1 md:flex-none bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-sky-300" />
              <span>Open Travel Wallet ({redeemedVouchers.length} Vouchers)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Reviews Spotlight */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Community Reviews & Insider Tips
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  ⭐ 4.9 Average
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Browse real spending breakdowns, timing accuracy, and tips from fellow transit explorers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('reviews')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <span>Explore All {reviews.length} Reviews</span>
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* 2 Featured Review Snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {reviews.slice(0, 2).map((rev) => (
            <div
              key={rev.id}
              onClick={() => setActiveTab('reviews')}
              className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rev.authorName}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({rev.destinationCity})</span>
                </div>
                <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                &quot;{rev.reviewText}&quot;
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                <span className="font-semibold text-emerald-700">
                  Spent ₹{rev.actualSpendingINR} (Saved ₹{Math.max(0, rev.estimatedBudgetINR - rev.actualSpendingINR)})
                </span>
                <span className="text-sky-600 font-bold group-hover:underline">
                  Read Tip →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recommended Mission & Daily Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Mission (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-600" />
              <span>Recommended Mission for {selectedAirport.city}</span>
            </h2>
            <button
              onClick={() => setActiveTab('plan')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recommendedActivity && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="capitalize font-semibold text-sky-600">
                      {recommendedActivity.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{recommendedActivity.durationMinutes} mins</span>
                    <span aria-hidden="true">·</span>
                    <span>{recommendedActivity.costInINR === 0 ? 'Free Entry' : `₹${recommendedActivity.costInINR}`}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 font-medium">
                      {recommendedActivity.isAirportOnly ? 'Airport Transit' : 'City Venture'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 pt-1">
                    {recommendedActivity.title}
                  </h3>

                  {recommendedActivity.localName && (
                    <p className="text-xs text-amber-700 font-medium font-['Noto_Sans_Malayalam',sans-serif]">
                      {recommendedActivity.localName}
                    </p>
                  )}
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {userMissions[recommendedActivity.id]?.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : userMissions[recommendedActivity.id]?.status === 'active' ? (
                    <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                      Ready to Start
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {recommendedActivity.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    🪙 +{recommendedActivity.coinsReward} Coins
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                    ⭐ +{recommendedActivity.xpReward} XP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {userMissions[recommendedActivity.id]?.status === 'active' ? (
                    <button
                      onClick={() => completeMission(recommendedActivity.id)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Check-in & Complete</span>
                    </button>
                  ) : userMissions[recommendedActivity.id]?.status !== 'completed' ? (
                    <button
                      onClick={() => startMission(recommendedActivity.id)}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Mission</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('plan')}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl"
                    >
                      Explore More Missions
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Runner Promo Card */}
          <div 
            onClick={() => setActiveTab('play')}
            className="rounded-3xl p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full text-white">
                Mini-Game
              </span>
              <h3 className="text-xl font-black">
                Play Dubai Dash Run
              </h3>
              <p className="text-xs text-amber-100 max-w-md">
                Sprint through Terminal 3 concourse, leap over luggage carts, slide under flight signs, and collect shared virtual coins!
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              ⚡
            </div>
          </div>
        </div>

        {/* Daily Missions & Quick Hub Links (1 column) */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Daily Layover Quests</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {dailyCompletedCount} / {dailyMissions.length}
              </span>
            </div>

            {/* Daily progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(dailyCompletedCount / dailyMissions.length) * 100}%` }}
              ></div>
            </div>

            {/* Quest items */}
            <div className="space-y-2.5">
              {dailyMissions.map((mission, idx) => {
                const isCompleted = userMissions[mission.id]?.status === 'completed';
                const isActive = userMissions[mission.id]?.status === 'active';

                return (
                  <div 
                    key={mission.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 line-clamp-1">
                        {idx + 1}. {mission.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        +{mission.coinsReward} Coins · +{mission.xpReward} XP
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <button
                          onClick={() => completeMission(mission.id)}
                          className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded"
                        >
                          Check In
                        </button>
                      ) : (
                        <button
                          onClick={() => startMission(mission.id)}
                          className="text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Transit Adventure Hub
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have a layover in Singapore, Doha, Cochin or London? Switch hubs anytime or create custom adventure timelines in the smart planner.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setActiveTab('plan')}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors text-center"
              >
                Open Smart Planner
              </button>
              <button
                onClick={() => setActiveTab('passport')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors text-center"
              >
                View Stamps ({unlockedStamps.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Reviews Spotlight */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Community Itinerary Stories
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {hubRatings.average} / 5.0 at {selectedAirport.city}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Real Layover Ratings & Tips from Travellers
            </h3>
            <p className="text-xs text-slate-500">
              Browse actual transit spending, timetable accuracy, and favourite stops before you step out.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('reviews')}
            className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Explore All {reviews.length} Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured reviews for currently selected airport or latest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(hubReviews.length > 0 ? hubReviews : reviews.slice(0, 2)).map((rev) => (
            <div
              key={rev.id}
              onClick={() => setActiveTab('reviews')}
              className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{rev.authorName}</span>
                      {rev.isDemo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          Demo
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {rev.itineraryTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800">{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                &quot;{rev.reviewText}&quot;
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span className="text-emerald-700 font-semibold">
                  Spent ₹{rev.actualSpendingINR.toLocaleString('en-IN')}
                </span>
                <span className="text-sky-700 font-bold hover:underline flex items-center gap-1">
                  Read story <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Route Customizer Modal */}
      <FlightEditModal
        isOpen={showFlightEditModal}
        onClose={() => setShowFlightEditModal(false)}
      />
    </div>
  );
};
