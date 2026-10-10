import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityReview, TimingAccuracy } from '../types';
import { AIRPORTS } from '../data/airports';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  DollarSign, 
  Clock, 
  Lightbulb, 
  Sparkles, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  Plus, 
  ArrowUpDown, 
  ChevronRight,
  Plane,
  X,
  Share2,
  Compass,
  Award
} from 'lucide-react';

export const ExploreReviewsView: React.FC = () => {
  const { 
    reviews, 
    toggleHelpfulVote, 
    completedItineraries, 
    hasUserReviewedItinerary,
    setActiveTab,
    setSelectedAirportCode
  } = useApp();

  // Modal state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [selectedItineraryToReview, setSelectedItineraryToReview] = useState<string | undefined>(undefined);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAirportFilter, setSelectedAirportFilter] = useState<string>('ALL');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'under500' | '500-1500' | '1500-3000' | '3000plus'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4plus'>('all');
  const [timingFilter, setTimingFilter] = useState<'all' | TimingAccuracy>('all');
  const [sortBy, setSortBy] = useState<'helpful' | 'rating' | 'recent' | 'budget'>('helpful');

  // Summary statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 5.0, count: 0, recommendPercent: 100, avgSavings: 350 };
    const avg = Number((reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1));
    const recommendCount = reviews.filter(r => r.wouldRecommend).length;
    const recommendPercent = Math.round((recommendCount / total) * 100);
    const savingsList = reviews.map(r => r.estimatedBudgetINR - r.actualSpendingINR).filter(s => s > 0);
    const avgSavings = savingsList.length > 0 
      ? Math.round(savingsList.reduce((a, b) => a + b, 0) / savingsList.length) 
      : 300;

    return { avg, count: total, recommendPercent, avgSavings };
  }, [reviews]);

  // Filtered & sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      // Airport filter
      if (selectedAirportFilter !== 'ALL' && rev.airportCode !== selectedAirportFilter) {
        return false;
      }

      // Budget filter
      if (budgetFilter === 'under500' && rev.actualSpendingINR >= 500) return false;
      if (budgetFilter === '500-1500' && (rev.actualSpendingINR < 500 || rev.actualSpendingINR > 1500)) return false;
      if (budgetFilter === '1500-3000' && (rev.actualSpendingINR < 1500 || rev.actualSpendingINR > 3000)) return false;
      if (budgetFilter === '3000plus' && rev.actualSpendingINR < 3000) return false;

      // Rating filter
      if (ratingFilter === '5' && rev.rating !== 5) return false;
      if (ratingFilter === '4plus' && rev.rating < 4) return false;

      // Timing accuracy filter
      if (timingFilter !== 'all' && rev.timingAccuracy !== timingFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = rev.reviewText.toLowerCase().includes(q);
        const matchesTips = rev.tips.toLowerCase().includes(q);
        const matchesCity = rev.destinationCity.toLowerCase().includes(q);
        const matchesItinerary = rev.itineraryTitle.toLowerCase().includes(q);
        const matchesAuthor = rev.authorName.toLowerCase().includes(q);
        const matchesActivities = rev.favouriteActivities.some(act => act.toLowerCase().includes(q));

        if (!matchesText && !matchesTips && !matchesCity && !matchesItinerary && !matchesAuthor && !matchesActivities) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'budget') return a.actualSpendingINR - b.actualSpendingINR;
      return 0;
    });
  }, [reviews, selectedAirportFilter, budgetFilter, ratingFilter, timingFilter, searchQuery, sortBy]);

  const handleOpenWriteReview = (itineraryId?: string) => {
    setSelectedItineraryToReview(itineraryId);
    setIsWriteModalOpen(true);
  };

  const getTimingBadge = (timing: TimingAccuracy) => {
    switch (timing) {
      case 'ahead_of_time':
        return { label: 'Ahead of Time', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'on_time':
        return { label: 'Right on Time', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'tight_schedule':
        return { label: 'Tight Schedule', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'delayed_rush':
        return { label: 'Delayed Rush', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Paced on Time', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const pendingCompletedItineraries = completedItineraries.filter(ci => !hasUserReviewedItinerary(ci.id));

  return (
    <div className="space-y-8 pb-24 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-slate-900 to-sky-950 text-white p-6 sm:p-8 shadow-xl border border-amber-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Layover Traveller Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              IDAVELA Community Reviews
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real transit tales, honest spending breakdowns, and time-saving secrets from travellers who have completed their layover itineraries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => handleOpenWriteReview()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Review Completed Itinerary</span>
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Plan New Route</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-amber-400 text-base font-extrabold">
              <Star className="w-4 h-4 fill-current" />
              <span>{stats.avg} / 5.0</span>
            </div>
            <span className="text-[11px] text-slate-300 block mt-0.5 font-medium">
              Average Community Rating
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-base font-extrabold text-white block">
              {stats.count} Reviews
            </span>
            <span className="text-[11px] text-slate-300 block mt-0.5 font-medium">
              Verified Transit Reviews
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-base font-extrabold text-emerald-400 block">
              {stats.recommendPercent}%
            </span>
            <span className="text-[11px] text-slate-300 block mt-0.5 font-medium">
              Would Recommend Route
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <span className="text-base font-extrabold text-amber-300 block">
              ₹{stats.avgSavings}
            </span>
            <span className="text-[11px] text-slate-300 block mt-0.5 font-medium">
              Avg. Transit Budget Saved
            </span>
          </div>
        </div>
      </div>

      {/* Completed Itineraries Prompt Banner (if user has pending trips to review) */}
      {pendingCompletedItineraries.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-sky-500/10 to-emerald-500/10 border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow">
                ✍️
              </div>
              <h3 className="text-sm font-black text-slate-900">
                You have {pendingCompletedItineraries.length} completed layover {pendingCompletedItineraries.length === 1 ? 'itinerary' : 'itineraries'} ready to review!
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Earn +75 XP · +35 Coins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingCompletedItineraries.map(ci => (
              <div
                key={ci.id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-bold text-slate-800">{ci.airportCode}</span>
                    <span>· {ci.durationHours}h layover</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {ci.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Est. Budget: ₹{ci.estimatedBudgetINR} · {ci.activityCount} stops
                  </p>
                </div>
                <button
                  onClick={() => handleOpenWriteReview(ci.id)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Write Review</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by destination, tips, highlights, or keywords..."
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
                <option value="recent">Most Recent</option>
                <option value="budget">Lowest Spend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Airport Destination Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Destination / Airport Hub:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedAirportFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedAirportFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Hubs ({reviews.length})
            </button>
            {AIRPORTS.map((apt) => {
              const count = reviews.filter(r => r.airportCode === apt.code).length;
              return (
                <button
                  key={apt.code}
                  onClick={() => setSelectedAirportFilter(apt.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedAirportFilter === apt.code
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{apt.flag}</span>
                  <span>{apt.city} ({apt.code})</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedAirportFilter === apt.code ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Filters: Budget Tier, Rating, Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Budget Tier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Spending Tier</label>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value as any)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Spending Tiers</option>
              <option value="under500">Under ₹500 (Budget)</option>
              <option value="500-1500">₹500 – ₹1,500 (Comfort)</option>
              <option value="1500-3000">₹1,500 – ₹3,000 (Explorer)</option>
              <option value="3000plus">₹3,000+ (Premium)</option>
            </select>
          </div>

          {/* Star Rating */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Star Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as any)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Ratings (1 - 5 Stars)</option>
              <option value="5">5.0 Stars Only ⭐</option>
              <option value="4plus">4.0+ Stars (Recommended)</option>
            </select>
          </div>

          {/* Timing Accuracy */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Timing Accuracy</label>
            <select
              value={timingFilter}
              onChange={(e) => setTimingFilter(e.target.value as any)}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Timing Paces</option>
              <option value="ahead_of_time">Ahead of Time (Relaxed)</option>
              <option value="on_time">Right on Time</option>
              <option value="tight_schedule">Tight Schedule</option>
              <option value="delayed_rush">Delayed Rush</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredReviews.length}</strong> of {reviews.length} community reviews
          </span>
          {(selectedAirportFilter !== 'ALL' || budgetFilter !== 'all' || ratingFilter !== 'all' || timingFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedAirportFilter('ALL');
                setBudgetFilter('all');
                setRatingFilter('all');
                setTimingFilter('all');
                setSearchQuery('');
              }}
              className="text-amber-600 hover:text-amber-700 font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h3 className="text-base font-black text-slate-900">No community reviews found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any reviews matching your current search or filter criteria. Try clearing some filters or write the first review for this destination!
            </p>
            <button
              onClick={() => handleOpenWriteReview()}
              className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Write First Review
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const timing = getTimingBadge(rev.timingAccuracy);
            const savings = rev.estimatedBudgetINR - rev.actualSpendingINR;
            const airport = AIRPORTS.find(a => a.code === rev.airportCode);

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Review Header: Author + Star Rating */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={rev.authorName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">
                          {rev.authorName}
                        </h4>
                        {rev.isDemo && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Demo Review
                          </span>
                        )}
                        {rev.isUserSubmitted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{rev.authorBadge}</span>
                        <span>·</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Recommendation */}
                  <div className="flex items-center gap-3 self-start">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-800 ml-1">
                        {rev.rating}.0
                      </span>
                    </div>

                    {rev.wouldRecommend && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl">
                        <ThumbsUp className="w-3 h-3 text-emerald-600" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Itinerary Link Title & Airport Tag */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-base">{airport?.flag || '✈️'}</span>
                    <span className="font-extrabold text-slate-900">
                      {rev.itineraryTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {rev.durationHours} Hours Layover
                    </span>
                    <button
                      onClick={() => {
                        setSelectedAirportCode(rev.airportCode);
                        setActiveTab('plan');
                      }}
                      className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Explore this route</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown: Actual Spending & Timing Accuracy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Spending comparison card */}
                  <div className="bg-emerald-50/50 border border-emerald-200/80 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                        Actual Spending
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-base font-black text-slate-900">
                          ₹{rev.actualSpendingINR}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          (vs est. ₹{rev.estimatedBudgetINR})
                        </span>
                      </div>
                    </div>
                    {savings > 0 ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
                        Saved ₹{savings}!
                      </span>
                    ) : savings === 0 ? (
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-xl">
                        Exact budget
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2 py-1 rounded-xl">
                        +₹{Math.abs(savings)} splurge
                      </span>
                    )}
                  </div>

                  {/* Timing Accuracy card */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${timing.color}`}>
                    <div>
                      <span className="text-[10px] uppercase font-bold block opacity-80">
                        Timing Accuracy
                      </span>
                      <span className="text-xs font-black block mt-0.5">
                        {timing.label}
                      </span>
                    </div>
                    <Clock className="w-4 h-4 opacity-70" />
                  </div>
                </div>

                {/* Favourite Activities Chips */}
                {rev.favouriteActivities.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Traveller Highlights:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rev.favouriteActivities.map((act, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg"
                        >
                          ⭐ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Narrative */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {rev.reviewText}
                </p>

                {/* Insider Layover Tip Callout Box */}
                {rev.tips && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <strong className="text-amber-950 font-bold block">
                        Insider Transit Tip:
                      </strong>
                      <p className="text-amber-900 leading-relaxed">
                        {rev.tips}
                      </p>
                    </div>
                  </div>
                )}

                {/* Attached Photos Gallery */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Layover Snapshots ({rev.photos.length})</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {rev.photos.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPreviewPhotoUrl(photoUrl)}
                          className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 cursor-pointer group shadow-xs hover:border-amber-400"
                        >
                          <img
                            src={photoUrl}
                            alt="Layover Snapshot"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[11px] font-bold bg-black/60 px-2 py-0.5 rounded-full">
                              Zoom
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Footer: Helpful button & Upvote */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHelpfulVote(rev.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        rev.userVotedHelpful
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${rev.userVotedHelpful ? 'fill-current text-rose-600' : 'text-slate-400'}`} />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {rev.helpfulCount > 0 ? `${rev.helpfulCount} travellers found this useful` : 'Be the first to upvote'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    IDAVELA Verified Layover Story
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Photo Lightbox Modal */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center">
            <img
              src={previewPhotoUrl}
              alt="Enlarged Layover Snapshot"
              className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/10"
            />
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-amber-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      <ReviewSubmissionModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        preSelectedItineraryId={selectedItineraryToReview}
      />
    </div>
  );
};
