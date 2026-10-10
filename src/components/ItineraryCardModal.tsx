import React from 'react';
import { ItineraryPlan } from '../types';
import { AIRPORTS } from '../data/airports';
import { useApp } from '../context/AppContext';
import { X, Printer, Plane, Clock, ShieldCheck, MapPin, Sparkles, Star, Lightbulb } from 'lucide-react';

interface Props {
  plan: ItineraryPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItineraryCardModal: React.FC<Props> = ({ plan, isOpen, onClose }) => {
  const { getAverageRatingForAirport } = useApp();
  if (!isOpen || !plan) return null;

  const airport = AIRPORTS.find(a => a.code === plan.airportCode) || AIRPORTS[0];
  const ratingData = getAverageRatingForAirport(plan.airportCode);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{airport.flag}</span>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Official Layover Itinerary Pass
              </h3>
              <p className="text-xs text-slate-500">
                IDAVELA · {airport.city} ({airport.code}) · {plan.durationHours} Hours Adventure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Boarding Slip Design */}
        <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-slate-50">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400 rotate-45" />
              <span>TRANSIT EXPLORATION PASS</span>
            </div>
            <span className="text-amber-400 font-mono tracking-widest">{airport.code}-PASS</span>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* Metadata Bar */}
            <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Layover</span>
                <span className="font-bold text-slate-900">{plan.durationHours} Hours</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Mode</span>
                <span className="font-bold text-slate-900 capitalize">{plan.explorationMode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Est. Spend</span>
                <span className="font-bold text-emerald-700">₹{plan.totalCostINR}</span>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                Scheduled Adventure Steps:
              </span>
              {plan.items.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sky-700 font-mono text-[11px] bg-sky-50 px-1.5 py-0.5 rounded">
                        {item.timeLabel}
                      </span>
                      <span className="font-bold text-slate-900">{item.activity.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.activity.locationName}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-700 block text-[11px]">
                      {item.activity.costInINR === 0 ? 'Free' : `₹${item.activity.costInINR}`}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {item.activity.durationMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Security buffer reminder */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Includes {Math.round(plan.bufferMinutes / 60)}h departure safety margin for baggage and gate checks.</span>
            </div>

            {/* Community Rating & Tips */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Community Rating: {ratingData.average} / 5.0</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {ratingData.recommendPercentage}% Recommend ({ratingData.count} reviews)
                </span>
              </div>
              {ratingData.commonTips.length > 0 && (
                <div className="pt-1 border-t border-slate-100 text-[10.5px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-700">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span>Key Layover Advice:</span>
                  </div>
                  <p className="italic text-slate-600 pl-4">
                    &quot;{ratingData.commonTips[0]}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print / Save Itinerary Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
