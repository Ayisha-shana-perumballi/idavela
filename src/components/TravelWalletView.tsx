import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WALLET_OFFERS } from '../data/walletOffers';
import { TravelOffer, RedeemedVoucher, OfferCategory } from '../types';
import { VoucherPassModal } from './VoucherPassModal';
import { 
  Coins, 
  CreditCard, 
  ArrowRightLeft, 
  Sparkles, 
  Ticket, 
  History, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle2, 
  Gamepad2, 
  AlertCircle, 
  ChevronRight, 
  Copy, 
  Check, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Coffee,
  Utensils,
  Armchair,
  Compass
} from 'lucide-react';

export const TravelWalletView: React.FC = () => {
  const {
    userStats,
    convertCoinsToCredits,
    redeemOffer,
    markVoucherUsed,
    walletTransactions,
    redeemedVouchers,
    selectedAirport,
    selectedAirportCode,
    setSelectedAirportCode,
    setActiveTab,
    currentPlan
  } = useApp();

  // Converter state
  const [coinsToConvert, setCoinsToConvert] = useState<number>(100);
  const [converterMessage, setConverterMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Offers filters
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>('all');
  const [airportFilter, setAirportFilter] = useState<'current' | 'all'>('current');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected voucher for inspection modal
  const [activeInspectVoucher, setActiveInspectVoucher] = useState<RedeemedVoucher | null>(null);

  // Confirm redemption modal state
  const [confirmOffer, setConfirmOffer] = useState<TravelOffer | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Vouchers tab: all | active | used
  const [voucherFilter, setVoucherFilter] = useState<'all' | 'active' | 'used'>('all');

  // History filter: all | convert | redeem
  const [historyFilter, setHistoryFilter] = useState<'all' | 'convert' | 'redeem'>('all');

  // Calculations for conversion preview
  const maxPossibleConvert = Math.floor(userStats.coins / 100) * 100;
  const creditsPreview = Math.floor(coinsToConvert / 100) * 10;
  const remainingCoinsPreview = Math.max(0, userStats.coins - coinsToConvert);

  // Handle conversion action
  const handleConvert = (amount: number) => {
    if (userStats.coins < amount) {
      setConverterMessage({
        text: `You have ${userStats.coins} coins. Sprint in Dubai Dash to earn more!`,
        type: 'error'
      });
      return;
    }
    const result = convertCoinsToCredits(amount);
    if (result.success) {
      setConverterMessage({
        text: `Converted ${amount} coins to ₹${result.creditsGained} Travel Credits!`,
        type: 'success'
      });
      setTimeout(() => setConverterMessage(null), 3500);
    } else {
      setConverterMessage({ text: result.message, type: 'error' });
    }
  };

  // Handle redemption confirmation
  const handleConfirmRedeem = () => {
    if (!confirmOffer) return;
    const result = redeemOffer(confirmOffer.id);
    if (result.success && result.voucher) {
      setConfirmOffer(null);
      // Auto open voucher pass
      setActiveInspectVoucher(result.voucher);
    } else {
      alert(result.message);
    }
  };

  const handleCopyCode = (voucher: RedeemedVoucher) => {
    navigator.clipboard.writeText(voucher.voucherCode).catch(() => {});
    setCopiedCodeId(voucher.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return WALLET_OFFERS.filter(offer => {
      // Category match
      if (selectedCategory !== 'all' && offer.category !== selectedCategory) {
        return false;
      }
      // Airport filter
      if (airportFilter === 'current' && offer.airportCode !== selectedAirportCode) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = offer.partnerName.toLowerCase().includes(query);
        const matchesTitle = offer.title.toLowerCase().includes(query);
        const matchesLoc = offer.location.toLowerCase().includes(query);
        return matchesName || matchesTitle || matchesLoc;
      }
      return true;
    });
  }, [selectedCategory, airportFilter, selectedAirportCode, searchQuery]);

  // Filtered vouchers
  const filteredVouchers = useMemo(() => {
    return redeemedVouchers.filter(v => {
      if (voucherFilter === 'active') return v.status === 'active';
      if (voucherFilter === 'used') return v.status === 'used';
      return true;
    });
  }, [redeemedVouchers, voucherFilter]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return walletTransactions.filter(tx => {
      if (historyFilter === 'convert') return tx.type === 'convert';
      if (historyFilter === 'redeem') return tx.type === 'redeem';
      return true;
    });
  }, [walletTransactions, historyFilter]);

  // Real trip budget reference
  const tripBudgetINR = currentPlan?.totalCostINR || 2400;

  return (
    <div className="space-y-8 pb-24 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-4 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-3 opacity-10 text-8xl font-black select-none pointer-events-none">
          💳
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Travel Wallet
            </span>
            <span className="text-sky-300 text-xs font-semibold">
              • Connected to Dubai Dash Run
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Layover Credits & Concourse Rewards
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-medium">
            Turn your game sprints into real savings! Convert your virtual Dubai Dash coins into demo travel credits (100 coins = ₹10), and redeem discounts across transit cafés, boutiques, and lounges.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('play')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-slate-950" />
              <span>Sprint for Coins in Play Dash</span>
            </button>
            <a
              href="#converter"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl backdrop-blur-sm border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
              <span>Convert Coins</span>
            </a>
            <a
              href="#offers"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl backdrop-blur-sm border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-sky-300" />
              <span>Explore Concourse Offers</span>
            </a>
          </div>
        </div>
      </div>

      {/* Triple Balance Metric Display & Separation Notice */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Virtual Game Coins */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                VIRTUAL GAME COINS
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">
                Earned in Runner
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {userStats.coins}
              </span>
              <span className="text-amber-500 text-xl font-bold">🪙</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Arcade coins collected in Dubai Dash and mission quests. Convertible at 100 coins = ₹10 credits.
            </p>
          </div>

          {/* 2. Demo Travel Credits */}
          <div className="bg-gradient-to-br from-sky-500/10 via-white to-sky-50 rounded-2xl p-4 border border-sky-300 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-sky-800 mb-1">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-sky-600" />
                DEMO TRAVEL CREDITS
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-extrabold">
                Spendable in Wallet
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-sky-900 tracking-tight">
                ₹{userStats.travelCredits || 0}
              </span>
              <span className="text-xs font-bold text-sky-600 uppercase">Credits</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Simulation credits ready to unlock sample café coffees, duty free perks, and transit lounge passes.
            </p>
          </div>

          {/* 3. Real Trip Budget (Kept strictly separate) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-500" />
                TRIP BUDGET (PLANNED)
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-extrabold">
                Planner Estimate
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{tripBudgetINR.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-600">INR</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Your real planned itinerary expenses from Smart Planner. Always kept 100% separate from game credits.
            </p>
          </div>
        </div>

        {/* Clear Balance Separation Notice */}
        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 block text-[11px]">
              Balance Separation Notice
            </span>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Virtual game coins (🪙) and demo travel credits (₹) are in-app simulation assets for gaming motivation. They do not represent real fiat money or banking currency, and never modify your actual credit cards or real trip budget.
            </p>
          </div>
        </div>
      </div>

      {/* COIN TO CREDIT CONVERTER */}
      <section id="converter" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                🪙
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Coin-to-Credit Currency Exchange
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Fixed Conversion Rate: <span className="font-black text-amber-700">100 Game Coins = ₹10 Demo Travel Credits</span>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2">
            <span className="text-slate-600">Current Balance:</span>
            <span className="font-extrabold text-amber-800 flex items-center gap-1">
              🪙 {userStats.coins} Coins
            </span>
          </div>
        </div>

        {converterMessage && (
          <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150 ${
            converterMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {converterMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{converterMessage.text}</span>
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Amount to Convert
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[100, 200, 500].map(amount => {
              const canAfford = userStats.coins >= amount;
              const isSelected = coinsToConvert === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  disabled={!canAfford}
                  onClick={() => setCoinsToConvert(amount)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/80 shadow-sm ring-2 ring-sky-500/20'
                      : canAfford
                      ? 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      : 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                    <span>{amount} Coins</span>
                    <span className="text-amber-500">🪙</span>
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 mt-1">
                    Get ₹{(amount / 100) * 10} Credits
                  </div>
                </button>
              );
            })}

            {/* Convert All Available */}
            <button
              type="button"
              disabled={maxPossibleConvert < 100}
              onClick={() => setCoinsToConvert(maxPossibleConvert)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                coinsToConvert === maxPossibleConvert && maxPossibleConvert >= 100
                  ? 'border-amber-500 bg-amber-50/80 shadow-sm ring-2 ring-amber-500/20'
                  : maxPossibleConvert >= 100
                  ? 'border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30'
                  : 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                <span>Max Available</span>
                <span className="text-amber-500">⚡</span>
              </div>
              <div className="text-[11px] font-bold text-amber-700 mt-1">
                {maxPossibleConvert >= 100 ? `${maxPossibleConvert} Coins (₹${(maxPossibleConvert / 100) * 10})` : 'Need 100+'}
              </div>
            </button>
          </div>
        </div>

        {/* Live Conversion Preview Card */}
        <div className="bg-gradient-to-r from-slate-50 to-sky-50/60 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto justify-around sm:justify-start">
            <div>
              <span className="text-[10px] text-slate-600 uppercase font-bold block">You Spend</span>
              <span className="text-lg font-black text-slate-900">
                {coinsToConvert} 🪙
              </span>
            </div>

            <ArrowRightLeft className="w-4 h-4 text-slate-400" />

            <div>
              <span className="text-[10px] text-slate-600 uppercase font-bold block">You Receive</span>
              <span className="text-lg font-black text-sky-700">
                +₹{creditsPreview} Credits
              </span>
            </div>

            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-600 uppercase font-bold block">Remaining Coins</span>
              <span className="text-xs font-bold text-slate-700">
                {remainingCoinsPreview} 🪙
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              disabled={userStats.coins < coinsToConvert || coinsToConvert < 100}
              onClick={() => handleConvert(coinsToConvert)}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                userStats.coins >= coinsToConvert && coinsToConvert >= 100
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Convert Now (₹{creditsPreview} Credits)</span>
            </button>
          </div>
        </div>

        {userStats.coins < 100 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You need at least 100 coins to make a conversion.</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('play')}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 cursor-pointer"
            >
              Play Dash & Earn Coins
            </button>
          </div>
        )}
      </section>

      {/* MY REDEEMED VOUCHERS SECTION */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                🎟️
              </span>
              <h2 className="text-lg font-black text-slate-900">
                My Redemptions
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Active voucher codes, digital boarding passes, and redeemed perks
            </p>
          </div>

          {/* Vouchers Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setVoucherFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                voucherFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({redeemedVouchers.length})
            </button>
            <button
              type="button"
              onClick={() => setVoucherFilter('active')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                voucherFilter === 'active' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({redeemedVouchers.filter(v => v.status === 'active').length})
            </button>
            <button
              type="button"
              onClick={() => setVoucherFilter('used')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                voucherFilter === 'used' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Used ({redeemedVouchers.filter(v => v.status === 'used').length})
            </button>
          </div>
        </div>

        {/* Voucher Cards Grid */}
        {filteredVouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVouchers.map(voucher => {
              const isCopied = copiedCodeId === voucher.id;
              const isActive = voucher.status === 'active';
              return (
                <div
                  key={voucher.id}
                  className={`rounded-2xl border p-4 space-y-3 transition-all relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-br from-white to-sky-50/40 border-sky-200 shadow-sm hover:shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          {voucher.airportCode}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {voucher.partnerName}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                        {voucher.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isActive ? 'Active' : 'Used'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {voucher.discountDescription}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{voucher.location}</span>
                  </div>

                  {/* Code and Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl">
                      <span className="font-mono text-xs font-extrabold text-slate-900">
                        {voucher.voucherCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(voucher)}
                        className="text-slate-500 hover:text-slate-900 p-0.5 rounded cursor-pointer"
                        title="Copy code"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveInspectVoucher(voucher)}
                        className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>View Pass</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Ticket className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-800">
              No {voucherFilter === 'all' ? '' : voucherFilter} vouchers yet
            </h3>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Convert your game coins into travel credits, then redeem sample discounts from the concourse catalog below!
            </p>
          </div>
        )}
      </section>

      {/* AVAILABLE CONCOURSE OFFERS SECTION */}
      <section id="offers" className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                🛍️
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Available Concourse Offers
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Curated discounts at recommended airport cafés, dining spots, duty-free shops, and rest lounges
            </p>
          </div>

          {/* Airport Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold hidden sm:inline">Layover Hub:</span>
            <select
              value={airportFilter === 'current' ? selectedAirportCode : 'all'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setAirportFilter('all');
                } else {
                  setAirportFilter('current');
                  setSelectedAirportCode(e.target.value);
                }
              }}
              className="font-bold text-slate-800 bg-slate-100 border-none rounded-xl px-3 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="DXB">🇦🇪 DXB · Dubai International</option>
              <option value="COK">🇮🇳 COK · Cochin International</option>
              <option value="SIN">🇸🇬 SIN · Singapore Changi</option>
              <option value="DOH">🇶🇦 DOH · Doha Hamad</option>
              <option value="LHR">🇬🇧 LHR · London Heathrow</option>
              <option value="all">🌍 All Transit Destinations</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
            {[
              { id: 'all', label: 'All Offers', icon: '✨' },
              { id: 'cafe', label: 'Cafés', icon: '☕' },
              { id: 'dining', label: 'Dining', icon: '🍽️' },
              { id: 'shopping', label: 'Shopping', icon: '🎁' },
              { id: 'lounge', label: 'Lounges', icon: '🛋️' },
              { id: 'attraction', label: 'Attractions', icon: '🎡' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as OfferCategory)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search partner, outlet..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.map(offer => {
            const hasEnoughCredits = (userStats.travelCredits || 0) >= offer.creditsRequired;
            const coinsEquivalent = offer.creditsRequired * 10;
            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                        {offer.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">
                          {offer.airportCode} · {offer.category}
                        </span>
                        <h3 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                          {offer.partnerName}
                        </h3>
                      </div>
                    </div>

                    {offer.badgeText && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md uppercase">
                        {offer.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 pt-1">
                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {offer.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {offer.discountDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{offer.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">Cost</span>
                      <span className="font-black text-sky-800 text-sm">
                        ₹{offer.creditsRequired} Credits
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-600 uppercase font-bold block">Equivalent</span>
                      <span className="text-xs font-bold text-amber-800">
                        {coinsEquivalent} Coins 🪙
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmOffer(offer)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      hasEnoughCredits
                        ? 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {hasEnoughCredits ? (
                      <>
                        <Ticket className="w-3.5 h-3.5 text-amber-300" />
                        <span>Redeem Voucher (₹{offer.creditsRequired})</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>Need ₹{offer.creditsRequired - (userStats.travelCredits || 0)} More (Convert Coins)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRANSACTION HISTORY SECTION */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                <History className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Wallet Transaction History
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Audit log of all conversions, redemptions, and bonus credits
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setHistoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                historyFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('convert')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                historyFilter === 'convert' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conversions
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('redeem')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                historyFilter === 'redeem' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Redemptions
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
          {filteredTransactions.map(tx => {
            const isConvert = tx.type === 'convert';
            const isRedeem = tx.type === 'redeem';
            const dateStr = new Date(tx.timestamp).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isConvert
                      ? 'bg-sky-100 text-sky-700'
                      : isRedeem
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isConvert ? '🔄' : isRedeem ? '🎟️' : '🎁'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      {tx.description}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {dateStr}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-mono font-black text-xs block ${
                    tx.creditsDelta > 0 ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.creditsDelta > 0 ? `+₹${tx.creditsDelta}` : `-₹${Math.abs(tx.creditsDelta)}`} Credits
                  </span>
                  {tx.coinsDelta && (
                    <span className="text-[10px] text-amber-600 font-bold block">
                      {tx.coinsDelta} Coins
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONFIRMATION MODAL BEFORE REDEEMING */}
      {confirmOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-2xl">
                {confirmOffer.icon}
              </div>
              <h3 className="text-base font-black text-slate-900">
                Confirm Voucher Redemption
              </h3>
              <p className="text-xs text-slate-600">
                Redeem <span className="font-bold text-slate-900">{confirmOffer.title}</span> at {confirmOffer.partnerName}?
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-bold text-slate-800">{confirmOffer.location}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Credits Required:</span>
                <span className="font-black text-sky-700">₹{confirmOffer.creditsRequired}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Remaining Credits:</span>
                <span className="font-bold text-slate-800">
                  ₹{Math.max(0, (userStats.travelCredits || 0) - confirmOffer.creditsRequired)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmOffer(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Confirm & Get Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER INSPECTION MODAL */}
      <VoucherPassModal
        voucher={activeInspectVoucher}
        isOpen={Boolean(activeInspectVoucher)}
        onClose={() => setActiveInspectVoucher(null)}
        onMarkUsed={(id) => {
          markVoucherUsed(id);
          setActiveInspectVoucher(prev => prev ? { ...prev, status: 'used' } : null);
        }}
      />
    </div>
  );
};
