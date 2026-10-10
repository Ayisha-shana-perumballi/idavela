import React from 'react';
import { Stamp } from '../types';
import { X, MapPin, Calendar, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  stamp: Stamp | null;
  onClose: () => void;
}

export const StampModal: React.FC<Props> = ({ stamp, onClose }) => {
  if (!stamp) return null;

  const isUnlocked = !!stamp.dateUnlocked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Ink Stamp Art */}
        <div className="pt-2">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 border-dashed flex flex-col items-center justify-center p-2 relative shadow-inner ${
            isUnlocked 
              ? `${stamp.inkColor} bg-amber-50/30 rotate-[-4deg]` 
              : 'border-slate-300 text-slate-400 bg-slate-100/50'
          }`}>
            <span className="text-4xl mb-1">{stamp.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{stamp.code}</span>
            <span className="text-xs font-black uppercase">{stamp.city}</span>

            {isUnlocked ? (
              <div className="absolute -bottom-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </div>
            ) : (
              <div className="absolute -bottom-2 bg-slate-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> LOCKED
              </div>
            )}
          </div>
        </div>

        {/* Title & Location */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900">
            {stamp.title}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{stamp.city}, {stamp.country}</span>
          </div>
        </div>

        {/* Description / Lore */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
          {stamp.description}
        </p>

        {/* Status notice */}
        <div className="text-[11px] text-slate-400">
          {isUnlocked ? (
            <span className="text-emerald-700 font-semibold">
              Officially stamped into your IDAVELA travel passport!
            </span>
          ) : (
            <span>Complete this layover mission or milestone to stamp your passport.</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
        >
          Close Passport Stamp
        </button>
      </div>
    </div>
  );
};
