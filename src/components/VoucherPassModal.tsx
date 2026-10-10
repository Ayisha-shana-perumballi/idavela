import React, { useState } from 'react';
import { RedeemedVoucher } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Ticket, 
  Sparkles, 
  CheckCircle2, 
  Store,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  voucher: RedeemedVoucher | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkUsed: (voucherId: string) => void;
}

export const VoucherPassModal: React.FC<Props> = ({
  voucher,
  isOpen,
  onClose,
  onMarkUsed
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !voucher) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.voucherCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedExpires = new Date(voucher.expiresAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = new Date(voucher.expiresAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Pass Top Aviation Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-7xl text-white/5 select-none font-black pointer-events-none">
            PASS
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                🎟️
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase font-bold text-amber-300 block">
                  IDAVELA TRANSIT VOUCHER
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {voucher.airportCode} Layover Partner Pass
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Partner Outlet</span>
              <span className="font-bold text-white text-sm">{voucher.partnerName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Status</span>
              <span className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
                voucher.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {voucher.status === 'active' ? '● Active' : '✓ Used in Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Notch Line */}
        <div className="relative h-4 bg-slate-100 flex items-center justify-between px-2">
          <div className="w-5 h-5 rounded-full bg-slate-950/75 -ml-4"></div>
          <div className="border-b-2 border-dashed border-slate-300 flex-1 mx-2"></div>
          <div className="w-5 h-5 rounded-full bg-slate-950/75 -mr-4"></div>
        </div>

        {/* Voucher Pass Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* Discount title */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {voucher.title}
            </h3>
            <p className="text-xs text-slate-600">
              {voucher.discountDescription}
            </p>
          </div>

          {/* Location info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-600 uppercase font-bold block">Valid Location</span>
              <span className="font-semibold text-slate-800">{voucher.location}</span>
            </div>
          </div>

          {/* Code Box */}
          <div className="border-2 border-dashed border-sky-400 bg-sky-50/60 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-700 block">
              VOUCHER REDEMPTION CODE
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                {voucher.voucherCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm transition-all active:scale-95 flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Copy Coupon Code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[10px] text-slate-600 block">
              Present this code or scan barcode at the concourse counter
            </span>
          </div>

          {/* Realistic SVG Barcode representation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 shadow-inner">
            <div className="w-full flex items-center justify-center gap-[3px] h-14 overflow-hidden px-4">
              {/* Generated vertical barcode stripes */}
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 4, 5, 2, 3, 6, 1, 4, 2, 5, 3, 1, 6, 2, 4, 3, 5].map((thickness, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-900 h-full rounded-[0.5px]"
                  style={{ width: `${thickness * 1.5}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-slate-500 tracking-widest font-semibold">
              *{voucher.barcode}*
            </span>
          </div>

          {/* Validity Notice */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Valid till {formattedDate}, {formattedExpires}</span>
            </div>
            <span className="font-bold text-sky-700">₹{voucher.creditsSpent} Credits Spent</span>
          </div>

          {/* Demo Simulation Action */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {voucher.status === 'active' ? (
              <button
                type="button"
                onClick={() => onMarkUsed(voucher.id)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulate Presenting at Counter (Mark Used)</span>
              </button>
            ) : (
              <div className="w-full bg-slate-100 text-slate-600 font-bold py-2.5 rounded-2xl text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulated Counter Redemption Complete</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 text-center">
              <ShieldCheck className="w-3 h-3 text-sky-600 shrink-0" />
              <span>Demo simulation voucher. Separate from real trip expenses.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
