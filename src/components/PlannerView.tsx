import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIRPORTS, ACTIVITIES } from '../data/airports';
import { BudgetTier, Category, ExplorationMode, Activity } from '../types';
import { MissionCard } from './MissionCard';
import { ItineraryCardModal } from './ItineraryCardModal';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Filter, 
  DollarSign, 
  Info,
  Play,
  RotateCcw,
  Printer,
  CheckCheck,
  Star,
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Award,
  ChevronRight
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const {
    selectedAirportCode,
    setSelectedAirportCode,
    selectedAirport,
    currentPlan,
    generateItinerary,
    userMissions,
    startMission,
    completeMission,
    completedItineraries,
    markItineraryCompleted,
    hasUserReviewedItinerary,
    getAverageRatingForAirport,
    setActiveTab
  } = useApp();

  // Sub-tabs: 'planner' (Form & Itinerary) vs 'explore' (Full Missions Directory)
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'explore'>('planner');
  const [showItineraryModal, setShowItineraryModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Planner Form State
  const [durationHours, setDurationHours] = useState<number>(selectedAirport.defaultLayoverHours);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('500-1500');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['food', 'culture', 'sightseeing']);
  const [explorationMode, setExplorationMode] = useState<ExplorationMode>('airport');
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Explore directory filter states
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [missionStatusFilter, setMissionStatusFilter] = useState<'all' | 'available' | 'active' | 'completed'>('all');
  const [exploreModeFilter, setExploreModeFilter] = useState<'all' | 'airport' | 'outside'>('all');

  // Community review data for this airport
  const airportRatingData = getAverageRatingForAirport(selectedAirportCode);
  const planId = currentPlan 
    ? (currentPlan.id || `itinerary-${currentPlan.airportCode.toLowerCase()}-${currentPlan.durationHours}h-${currentPlan.explorationMode}`)
    : '';
  const isPlanCompleted = completedItineraries.some(ci => ci.id === planId);
  const isPlanReviewed = hasUserReviewedItinerary(planId);

  const budgetOptions: { id: BudgetTier; label: string; maxText: string }[] = [
    { id: 'under500', label: 'Under ₹500', maxText: 'Budget / Student' },
    { id: '500-1500', label: '₹500 – ₹1,500', maxText: 'Comfort Traveler' },
    { id: '1500-3000', label: '₹1,500 – ₹3,000', maxText: 'City Explorer' },
    { id: '3000plus', label: '₹3,000+', maxText: 'Premium Experience' }
  ];

  const categoriesList: { id: Category; label: string; icon: string }[] = [
    { id: 'food', label: 'Food & Drinks', icon: '🍜' },
    { id: 'culture', label: 'Culture & Heritage', icon: '🏛️' },
    { id: 'sightseeing', label: 'Sightseeing', icon: '🗼' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'relaxation', label: 'Relaxation & Spa', icon: '☕' }
  ];

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleCreateAdventure = (e: React.FormEvent) => {
    e.preventDefault();
    generateItinerary({
      airportCode: selectedAirportCode,
      durationHours,
      budgetTier,
      categories: selectedCategories,
      explorationMode
    });
    setHasGenerated(true);
  };

  // Filter explore missions
  const airportActivities = ACTIVITIES.filter(a => a.airportCode === selectedAirportCode);
  
  const filteredActivities = airportActivities.filter(act => {
    // Mode filter
    if (exploreModeFilter === 'airport' && !act.isAirportOnly) return false;
    if (exploreModeFilter === 'outside' && act.isAirportOnly) return false;
    // Category filter
    if (categoryFilter !== 'all' && act.category !== categoryFilter) return false;
    // Status filter
    const status = userMissions[act.id]?.status || 'available';
    if (missionStatusFilter === 'available' && status !== 'available') return false;
    if (missionStatusFilter === 'active' && status !== 'active') return false;
    if (missionStatusFilter === 'completed' && status !== 'completed') return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedAirport.flag}</span>
            <h1 className="text-2xl font-black text-slate-900">
              {selectedAirport.city} ({selectedAirport.code})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedAirport.name} · {selectedAirport.transitCityName}
          </p>
        </div>

        {/* Segmented sub-tab controls */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-2xl w-full sm:w-auto gap-1">
          <button
            onClick={() => setActiveSubTab('planner')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'planner'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-600" />
            <span>Smart Planner</span>
          </button>
          <button
            onClick={() => setActiveSubTab('explore')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'explore'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Explore All Missions ({airportActivities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100/60 cursor-pointer"
            title="Browse verified traveller community reviews"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Community Reviews ({airportRatingData.count})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'planner' ? (
        /* ================= SUB-TAB 1: SMART PLANNER FORM & RESULTS ================= */
        <div className="space-y-8">
          {/* Planner Configuration Form */}
          <form 
            onSubmit={handleCreateAdventure}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Build Your Personalized Layover Itinerary</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculates realistic travel times, buffer margins, and cost limits.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Hub: <span className="text-slate-800 font-bold">{selectedAirport.code}</span>
              </div>
            </div>

            {/* Grid 1: Airport Hub & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Airport Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Transit Airport / City
                </label>
                <select
                  value={selectedAirportCode}
                  onChange={(e) => setSelectedAirportCode(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {AIRPORTS.map((apt) => (
                    <option key={apt.code} value={apt.code}>
                      {apt.flag} {apt.city} ({apt.code}) - {apt.country}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Highlights: {selectedAirport.highlights.slice(0, 2).join(' · ')}
                </span>
              </div>

              {/* Layover Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Available Layover Duration
                  </label>
                  <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                    {durationHours} Hours Available
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={0.5}
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>2h (Quick Transit)</span>
                  <span>5h (Outside Feasible)</span>
                  <span>8h (Half Day)</span>
                  <span>12h (Grand Tour)</span>
                </div>
              </div>
            </div>

            {/* Grid 2: Exploration Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Exploration Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setExplorationMode('airport')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    explorationMode === 'airport'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span>🏢 Airport-Only Adventures</span>
                    {explorationMode === 'airport' && <span className="text-sky-600">✓</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Stay safely inside terminal concourses (lounges, gardens, art, duty-free). Zero immigration stress.
                  </p>
                </div>

                <div
                  onClick={() => setExplorationMode('outside')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    explorationMode === 'outside'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span>🌆 Explore Outside the Airport</span>
                    {explorationMode === 'outside' && <span className="text-sky-600">✓</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Step out into {selectedAirport.city} (metro, souks, iconic towers). Requires minimum {selectedAirport.minOutsideLayoverHours} hours layover.
                  </p>
                </div>
              </div>

              {/* Insufficient time alert */}
              {explorationMode === 'outside' && durationHours < selectedAirport.minOutsideLayoverHours && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Transit Notice:</strong> A {durationHours}-hour layover is too short for outside city excursions at {selectedAirport.code} (immigration + transit + security takes ~2.5h). The planner will safely suggest airport-only activities.
                  </div>
                </div>
              )}
            </div>

            {/* Grid 3: Budget Tiers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Estimated Layover Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {budgetOptions.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudgetTier(b.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      budgetTier === b.id
                        ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{b.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{b.maxText}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 4: Interests (Multi-Select) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Your Interests (Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      {isSelected && <span className="text-sky-600 ml-1">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold px-8 py-3 rounded-2xl text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create My Adventure</span>
              </button>
            </div>
          </form>

          {/* Generated Itinerary Display */}
          {currentPlan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Itinerary Summary Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                      Generated Personalized Plan
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                      {currentPlan.durationHours}h Layover in {selectedAirport.city}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mode: <strong className="text-slate-800 capitalize">{currentPlan.explorationMode === 'airport' ? 'Airport-Only' : 'Outside City'}</strong> · Safety buffer: {Math.round(currentPlan.bufferMinutes / 60)}h
                    </p>
                  </div>

                  {/* Financials / Budget tracking */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">Est. Spend</span>
                      <span className="text-base font-extrabold text-slate-900">₹{currentPlan.totalCostINR}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-emerald-600 font-semibold block uppercase">Remaining</span>
                      <span className="text-base font-extrabold text-emerald-800">₹{currentPlan.remainingBudgetINR}</span>
                    </div>
                  </div>
                </div>

                {/* Feasibility Notice if forced to airport mode */}
                {currentPlan.feasibilityWarning && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Safety Adaptation:</strong> {currentPlan.feasibilityWarning}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Interactive Timeline */}
                <div className="pt-2 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span>Suggested Timeline & Activity Order</span>
                    </h4>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          currentPlan.items.forEach(item => {
                            if (!item.isReturnBuffer && item.activity.id !== 'arrival-step' && userMissions[item.activity.id]?.status !== 'completed') {
                              startMission(item.activity.id);
                            }
                          });
                        }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Enroll all steps as active missions"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Enroll All in Missions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowItineraryModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="View printable itinerary slip"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>Export Pass</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative border-l-2 border-sky-200 ml-4 pl-6 space-y-6">
                    {currentPlan.items.map((item, idx) => {
                      const isBuffer = item.isReturnBuffer;
                      const act = item.activity;
                      const isCompleted = userMissions[act.id]?.status === 'completed';
                      const isActive = userMissions[act.id]?.status === 'active';

                      return (
                        <div key={idx} className="relative group">
                          {/* Timeline node dot */}
                          <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                            isBuffer 
                              ? 'border-amber-500 bg-amber-100' 
                              : isCompleted 
                              ? 'border-emerald-500 bg-emerald-500' 
                              : 'border-sky-500'
                          }`}>
                            {isCompleted && <span className="text-white text-[8px] font-bold">✓</span>}
                          </div>

                          {/* Timeline Content Card */}
                          <div className={`rounded-2xl p-4 border transition-all ${
                            isBuffer
                              ? 'bg-amber-50/60 border-amber-200'
                              : isCompleted
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-extrabold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded">
                                  {item.timeLabel}
                                </span>
                                <span className="text-slate-500 text-[11px]">
                                  ({act.durationMinutes} mins)
                                </span>
                                <span className="font-bold text-slate-700 text-[11px]">
                                  {act.costInINR === 0 ? 'Free' : `₹${act.costInINR}`}
                                </span>
                              </div>

                              {/* Action or status */}
                              {!isBuffer && act.id !== 'arrival-step' && (
                                <div>
                                  {isCompleted ? (
                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                    </span>
                                  ) : isActive ? (
                                    <button
                                      onClick={() => completeMission(act.id)}
                                      className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg"
                                    >
                                      Check In
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => startMission(act.id)}
                                      className="text-[11px] font-bold bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>Start</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <h5 className="text-sm font-bold text-slate-900 mt-2">
                              {act.title}
                            </h5>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{act.locationName}</span>
                              <span className="text-slate-400">({act.terminalOrArea})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Return buffer confirmation notice */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Includes {Math.round(currentPlan.bufferMinutes / 60)}h return gate safety buffer</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Sample estimates only · Check terminal monitors
                  </span>
                </div>

                {/* Layover Completion & Community Review Action Card */}
                <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎉</span>
                      <h5 className="text-xs font-black text-slate-900">
                        {isPlanCompleted ? 'Itinerary Completed!' : 'Ready to embark on this journey?'}
                      </h5>
                      {isPlanCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Verified Complete
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {isPlanCompleted 
                        ? (isPlanReviewed ? 'You have contributed a review for this itinerary.' : 'Mark your layover done and share your story with the community to earn rewards.')
                        : 'Complete this layover route to earn +100 XP and unlock community reviewing.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isPlanCompleted ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentPlan) {
                            markItineraryCompleted(currentPlan);
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Itinerary (+100 XP)</span>
                      </button>
                    ) : isPlanReviewed ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>View Your Review</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Write Community Review (+75 XP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Community Layover Ratings & Traveller Tips on Itinerary Details */}
                <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <span>Community Layover Ratings for {selectedAirport.city} ({selectedAirport.code})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {airportRatingData.average} / 5.0 ⭐
                          </span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Based on {airportRatingData.count} verified traveller transit stories · {airportRatingData.recommendPercentage}% recommend this hub
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>Explore all community reviews</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Common Traveller Tips */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Top Layover Tips from the Community:</span>
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {airportRatingData.commonTips.map((tip, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2 shadow-2xs">
                          <span className="text-amber-500 font-bold shrink-0">#{idx + 1}</span>
                          <span className="line-clamp-3">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= SUB-TAB 2: EXPLORE ALL MISSIONS DIRECTORY ================= */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            {/* Exploration Location Mode filter */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setExploreModeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    exploreModeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All Locations
                </button>
                <button
                  onClick={() => setExploreModeFilter('airport')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    exploreModeFilter === 'airport' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Airport Only
                </button>
                <button
                  onClick={() => setExploreModeFilter('outside')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    exploreModeFilter === 'outside' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Outside City
                </button>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setMissionStatusFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                    missionStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setMissionStatusFilter('active')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                    missionStatusFilter === 'active' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setMissionStatusFilter('completed')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                    missionStatusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  categoryFilter === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    categoryFilter === cat.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <div className="text-4xl">🔍</div>
              <h4 className="text-base font-bold text-slate-800">No matching layover missions found</h4>
              <p className="text-xs text-slate-500">
                Try resetting your filters or switching to "All Locations".
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setExploreModeFilter('all');
                  setMissionStatusFilter('all');
                }}
                className="mt-2 text-xs font-bold text-sky-600 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((act) => (
                <MissionCard
                  key={act.id}
                  activity={act}
                  missionStatus={userMissions[act.id]}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Itinerary Pass Export Modal */}
      <ItineraryCardModal
        plan={currentPlan}
        isOpen={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
      />

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        preSelectedItineraryId={planId}
      />
    </div>
  );
};
