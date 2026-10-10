import React, { useState } from 'react';
import { Activity } from '../types';
import { Camera, CheckCircle2, X, Sparkles, MapPin, AlertCircle } from 'lucide-react';

interface Props {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userNote: string) => void;
}

export const MissionCheckInModal: React.FC<{
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userNote: string) => void;
}> = ({ activity, isOpen, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePhoto = () => {
    // Simulated transit photo snapshot
    setPhotoTaken(true);
    setPhotoPreview('photo_simulated');
  };

  const handleComplete = () => {
    onConfirm(note || `Verified layover check-in at ${activity.locationName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Real-World Mission Check-In
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {activity.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activity.locationName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Check-In Explanation */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-sky-800">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Simulated Layover Verification</span>
          </div>
          <p>
            Confirm you completed this activity during your transit! Take a demo snapshot or share a quick reflection to earn your XP, Coins, and unlock your digital passport stamp.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-sky-200/50">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo check-in: no invasive GPS tracking required.</span>
          </div>
        </div>

        {/* Photo verification step */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            1. Snap Proof of Visit (Simulated Camera)
          </label>
          {photoTaken ? (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl shadow-sm">
                ✓
              </div>
              <div className="text-xs font-bold text-emerald-800">
                Transit Landmark Photo Captured!
              </div>
              <p className="text-[11px] text-emerald-600">
                Location metadata matched to {activity.terminalOrArea}
              </p>
              <button
                type="button"
                onClick={() => setPhotoTaken(false)}
                className="text-[11px] text-slate-500 underline hover:text-slate-800"
              >
                Retake photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatePhoto}
              className="w-full border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/40 rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-100 group-hover:bg-sky-200 text-sky-600 flex items-center justify-center transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-700 group-hover:text-sky-700">
                Tap to Simulate Photo Check-In
              </div>
              <span className="text-[11px] text-slate-400">
                Snap the concourse view, snack, or landmark
              </span>
            </button>
          )}
        </div>

        {/* Optional note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            2. Traveller Note & Rating (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Delicious saffron tea, very refreshing!"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Rewards preview */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold">
          <span className="text-slate-600">Rewards Unlocking:</span>
          <div className="flex items-center gap-3">
            <span className="text-amber-600">🪙 +{activity.coinsReward} Coins</span>
            <span className="text-sky-700">⭐ +{activity.xpReward} XP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="w-2/3 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Claim Rewards</span>
          </button>
        </div>
      </div>
    </div>
  );
};
