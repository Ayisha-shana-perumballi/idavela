import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompletedItinerary, TimingAccuracy } from '../types';
import { DEMO_PRESET_PHOTOS } from '../data/communityReviews';
import { 
  X, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  DollarSign, 
  Clock, 
  Lightbulb, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Image as ImageIcon,
  Send,
  Plane
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preSelectedItineraryId?: string;
}

export const ReviewSubmissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preSelectedItineraryId
}) => {
  const { 
    completedItineraries, 
    addReview, 
    hasUserReviewedItinerary,
    getUserReviewForItinerary,
    userStats 
  } = useApp();

  // Find preselected or default completed itinerary
  const defaultItinerary = completedItineraries.find(ci => ci.id === preSelectedItineraryId) || completedItineraries[0];
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(
    preSelectedItineraryId || (defaultItinerary ? defaultItinerary.id : '')
  );

  const selectedItinerary = completedItineraries.find(ci => ci.id === selectedItineraryId) || defaultItinerary;
  const isAlreadyReviewed = selectedItinerary ? hasUserReviewedItinerary(selectedItinerary.id) : false;
  const existingReview = selectedItinerary ? getUserReviewForItinerary(selectedItinerary.id) : undefined;

  // Form states
  const [authorName, setAuthorName] = useState<string>('Ayisha S. (Solo Transit)');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [actualSpendingINR, setActualSpendingINR] = useState<number>(
    selectedItinerary ? selectedItinerary.estimatedBudgetINR : 850
  );
  const [timingAccuracy, setTimingAccuracy] = useState<TimingAccuracy>('ahead_of_time');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    selectedItinerary ? selectedItinerary.activityTitles.slice(0, 2) : []
  );
  const [customActivityInput, setCustomActivityInput] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);
  const [selectedPhotoUrls, setSelectedPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleItineraryChange = (itineraryId: string) => {
    setSelectedItineraryId(itineraryId);
    const it = completedItineraries.find(c => c.id === itineraryId);
    if (it) {
      setActualSpendingINR(it.estimatedBudgetINR);
      setSelectedActivities(it.activityTitles.slice(0, 2));
    }
  };

  const toggleActivity = (title: string) => {
    setSelectedActivities(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleAddCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customActivityInput.trim() && !selectedActivities.includes(customActivityInput.trim())) {
      setSelectedActivities(prev => [...prev, customActivityInput.trim()]);
      setCustomActivityInput('');
    }
  };

  const togglePhoto = (url: string) => {
    setSelectedPhotoUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleAddCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPhotoUrl.trim() && !selectedPhotoUrls.includes(customPhotoUrl.trim())) {
      setSelectedPhotoUrls(prev => [...prev, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!selectedItinerary) {
      setErrorNotice('Please select an itinerary to review.');
      return;
    }

    if (hasUserReviewedItinerary(selectedItinerary.id)) {
      setErrorNotice('You have already submitted a review for this itinerary! Duplicate submissions are prevented.');
      return;
    }

    if (!reviewText.trim()) {
      setErrorNotice('Please share a few words about your layover experience.');
      return;
    }

    if (!tips.trim()) {
      setErrorNotice('Please provide at least one layover tip to guide future travellers.');
      return;
    }

    const res = addReview({
      itineraryId: selectedItinerary.id,
      itineraryTitle: selectedItinerary.title,
      airportCode: selectedItinerary.airportCode,
      destinationCity: selectedItinerary.destinationCity,
      authorName: authorName.trim() || 'Anonymous Explorer',
      authorBadge: `${userStats.levelTitle} · Level ${userStats.level}`,
      rating,
      actualSpendingINR: Number(actualSpendingINR) || 0,
      estimatedBudgetINR: selectedItinerary.estimatedBudgetINR,
      durationHours: selectedItinerary.durationHours,
      timingAccuracy,
      favouriteActivities: selectedActivities,
      tips: tips.trim(),
      reviewText: reviewText.trim(),
      photos: selectedPhotoUrls,
      wouldRecommend
    });

    if (res.success) {
      onClose();
    } else {
      setErrorNotice(res.message);
    }
  };

  const budgetDelta = selectedItinerary 
    ? selectedItinerary.estimatedBudgetINR - actualSpendingINR 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 font-bold">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Write a Community Review</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">
                  +75 XP · +35 Coins
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share your verified layover insights to guide fellow transit travellers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorNotice && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Itinerary Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              1. Select Completed Itinerary
            </label>
            {completedItineraries.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                You haven&apos;t marked any layover itineraries as completed yet! Generate an itinerary in the Smart Planner and click &quot;Complete Itinerary&quot; to review it.
              </div>
            ) : (
              <select
                value={selectedItineraryId}
                onChange={(e) => handleItineraryChange(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              >
                {completedItineraries.map(ci => {
                  const reviewed = hasUserReviewedItinerary(ci.id);
                  return (
                    <option key={ci.id} value={ci.id}>
                      {reviewed ? '✓ [Already Reviewed] ' : '✈️ '}
                      {ci.title} ({ci.airportCode} · {ci.durationHours}h)
                    </option>
                  );
                })}
              </select>
            )}

            {/* Warning if already reviewed */}
            {isAlreadyReviewed && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>You have already submitted a review for this itinerary!</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    To maintain trusted community ratings, each traveller can submit one review per itinerary.
                    {existingReview && ` You rated it ${existingReview.rating} stars.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isAlreadyReviewed && selectedItinerary && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    2. Overall Layover Rating
                  </label>
                  <span className="text-xs font-extrabold text-amber-600">
                    {rating === 5 ? '5.0 - Exceptional Experience!' :
                     rating === 4 ? '4.0 - Very Good Adventure' :
                     rating === 3 ? '3.0 - Decent Layover' :
                     rating === 2 ? '2.0 - Room for Improvement' : '1.0 - Challenging'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actual Spending vs Estimated Budget */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>3. Actual Spending (in ₹)</span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    Est. Budget: <strong className="text-slate-800">₹{selectedItinerary.estimatedBudgetINR}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={50000}
                      step={50}
                      value={actualSpendingINR}
                      onChange={(e) => setActualSpendingINR(Number(e.target.value))}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${
                    budgetDelta >= 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {budgetDelta >= 0 ? `Saved ₹${budgetDelta}!` : `Exceeded by ₹${Math.abs(budgetDelta)}`}
                  </div>
                </div>
              </div>

              {/* Timing Accuracy */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>4. Timing Accuracy & Pacing</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'ahead_of_time', label: 'Ahead of Time', desc: 'Relaxed with plenty of gate margin' },
                    { id: 'on_time', label: 'Right on Time', desc: 'Paced exactly as predicted in the plan' },
                    { id: 'tight_schedule', label: 'Tight Schedule', desc: 'Slightly brisk walk to final call gate' },
                    { id: 'delayed_rush', label: 'Delayed Rush', desc: 'Long security queue or transport delay' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimingAccuracy(t.id as TimingAccuracy)}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        timingAccuracy === t.id
                          ? 'border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{t.label}</span>
                        {timingAccuracy === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Favourite Activities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  5. Favourite Activities / Highlights
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedItinerary.activityTitles.map(actTitle => {
                    const isSelected = selectedActivities.includes(actTitle);
                    return (
                      <button
                        key={actTitle}
                        type="button"
                        onClick={() => toggleActivity(actTitle)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {actTitle}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Highlight Tag */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customActivityInput}
                    onChange={(e) => setCustomActivityInput(e.target.value)}
                    placeholder="Add custom highlight (e.g. Free Massage Chairs)..."
                    className="flex-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customActivityInput.trim()) {
                          setSelectedActivities(prev => [...prev, customActivityInput.trim()]);
                          setCustomActivityInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customActivityInput.trim()) {
                        setSelectedActivities(prev => [...prev, customActivityInput.trim()]);
                        setCustomActivityInput('');
                      }
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Insider Tips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>6. Insider Layover Tip for Fellow Travellers</span>
                </label>
                <textarea
                  rows={2}
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  placeholder="e.g. Take the Red line metro zone 2 ticket straight from Terminal 3. Buggy to gate B14 takes 8 mins. Store bags at Level 1 lockers..."
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Full Review Text */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  7. Your Layover Experience Story
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the journey? Did the time feel relaxed or rushed? What made this layover memorable?"
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Photo Attachment (Optional Demo Presets & URLs) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>8. Layover Photos (Optional)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {selectedPhotoUrls.length} selected
                  </span>
                </label>
                
                {/* Presets Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_PRESET_PHOTOS.map((preset, idx) => {
                    const isSelected = selectedPhotoUrls.includes(preset.url);
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePhoto(preset.url)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer border-2 group aspect-video ${
                          isSelected ? 'border-amber-500 shadow-md ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[9px] font-bold text-white line-clamp-1">{preset.label}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5 shadow">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom Photo URL Input */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)..."
                      className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomPhoto}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Attach
                  </button>
                </div>
              </div>

              {/* Recommendation Indicator */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  9. Would you recommend this layover route to other transit travellers?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      wouldRecommend
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes, Highly Recommend!</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      !wouldRecommend
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Needs adjustments</span>
                  </button>
                </div>
              </div>

              {/* Author name & submit button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="text-slate-400">Reviewing as:</span>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="text-xs font-bold text-slate-900 border-b border-dashed border-slate-300 pb-0.5 outline-none focus:border-amber-500 bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/30 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Community Review</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
