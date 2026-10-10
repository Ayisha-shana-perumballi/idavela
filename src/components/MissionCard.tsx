import React, { useState } from 'react';
import { Activity, UserMission } from '../types';
import { useApp } from '../context/AppContext';
import { MissionCheckInModal } from './MissionCheckInModal';
import { 
  CheckCircle2, 
  Play, 
  MapPin, 
  Clock, 
  Tag, 
  Sparkles, 
  HelpCircle,
  XCircle,
  Check
} from 'lucide-react';

interface Props {
  activity: Activity;
  missionStatus?: UserMission;
  onSelect?: () => void;
}

export const MissionCard: React.FC<Props> = ({ activity, missionStatus }) => {
  const { startMission, completeMission, abandonMission } = useApp();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const status = missionStatus?.status || 'available';

  const categoryIcons: Record<string, string> = {
    food: '🍜',
    culture: '🏛️',
    sightseeing: '🗼',
    shopping: '🛍️',
    relaxation: '☕'
  };

  return (
    <div className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white shadow-sm hover:shadow-md ${
      status === 'completed'
        ? 'border-emerald-200 bg-emerald-50/20'
        : status === 'active'
        ? 'border-sky-300 ring-2 ring-sky-100'
        : 'border-slate-200'
    }`}>
      <div className="p-5 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="capitalize font-semibold text-sky-700 flex items-center gap-1">
                <span>{categoryIcons[activity.category] || '📍'}</span>
                <span>{activity.category}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{activity.durationMinutes} min</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">
                {activity.costInINR === 0 ? 'Free' : `₹${activity.costInINR}`}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">
                {activity.isAirportOnly ? 'Airport Only' : 'Outside City'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {activity.title}
            </h3>

            {activity.localName && (
              <p className="text-xs text-amber-700 font-medium font-['Noto_Sans_Malayalam',sans-serif]">
                {activity.localName}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {status === 'completed' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" /> Done
              </span>
            ) : status === 'active' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full animate-pulse">
                Active Mission
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Available
              </span>
            )}
          </div>
        </div>

        {/* Location / Area */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">{activity.locationName}</span>
          <span className="text-slate-400">({activity.terminalOrArea})</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed">
          {activity.description}
        </p>

        {/* Tips expander */}
        {activity.tips && (
          <div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showTips ? 'Hide Traveller Tip' : 'View Traveller Tip'}</span>
            </button>
            {showTips && (
              <div className="mt-1.5 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                💡 <strong>Tip:</strong> {activity.tips}
              </div>
            )}
          </div>
        )}

        {/* User reflection / completed note if available */}
        {missionStatus?.userNote && status === 'completed' && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 italic">
            📝 &ldquo;{missionStatus.userNote}&rdquo;
          </div>
        )}

        {/* Footer: Rewards & Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {/* Rewards Pill */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
              🪙 +{activity.coinsReward}
            </span>
            <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/50">
              ⭐ +{activity.xpReward} XP
            </span>
            {activity.stampRewardId && (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/50 text-[10px]">
                🛂 Stamp Reward
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {status === 'active' ? (
              <>
                <button
                  onClick={() => abandonMission(activity.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Abandon Mission"
                >
                  <XCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Check-In</span>
                </button>
              </>
            ) : status === 'completed' ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
              </span>
            ) : (
              <button
                onClick={() => startMission(activity.id)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Mission</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      <MissionCheckInModal
        activity={activity}
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onConfirm={(note) => {
          completeMission(activity.id, note);
        }}
      />
    </div>
  );
};
