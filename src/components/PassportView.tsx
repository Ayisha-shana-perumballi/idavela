import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACTIVITIES } from '../data/airports';
import { Stamp, Achievement } from '../types';
import { getLevelInfo } from '../data/stampsAndBadges';
import { StampModal } from './StampModal';
import { DutyFreeShopModal } from './DutyFreeShopModal';
import { 
  BookOpen, 
  Award, 
  Coins, 
  Sparkles, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Share2, 
  MapPin, 
  Plane,
  Compass,
  Footprints,
  UtensilsCrossed,
  Landmark,
  PlaneTakeoff,
  ShoppingBag,
  CreditCard,
  Ticket
} from 'lucide-react';

export const PassportView: React.FC = () => {
  const { userStats, stamps, achievements, userMissions, demoFlight, setActiveTab, redeemedVouchers } = useApp();
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showDutyFreeModal, setShowDutyFreeModal] = useState(false);

  const levelInfo = getLevelInfo(userStats.xp);
  const unlockedStamps = stamps.filter(s => s.dateUnlocked);
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);

  // Completed missions
  const completedMissionEntries = Object.entries(userMissions)
    .filter(([_, m]) => m.status === 'completed')
    .map(([activityId, m]) => {
      const activity = ACTIVITIES.find(a => a.id === activityId);
      return { activity, mission: m };
    })
    .filter(item => item.activity !== undefined);

  // Icon mapping for achievement badges
  const renderAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff className="w-5 h-5" />;
      case 'Coins':
        return <Coins className="w-5 h-5" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSharePassport = () => {
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 3500);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Passport Book Cover Header / Traveller Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border-4 border-amber-500/40">
        {/* Gold Foil Pattern Border Effect */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Traveller ID Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black tracking-widest text-xs uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                Official Travel Passport
              </span>
              <span className="text-slate-400 text-xs">
                IDAVELA · ഇടവേള
              </span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Global Transit Adventurer
              </h1>
              <p className="text-amber-300 font-bold text-sm">
                Rank: {userStats.levelTitle} (Level {userStats.level})
              </p>
            </div>

            {/* Level & XP progress bar */}
            <div className="space-y-1.5 max-w-md pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>XP Progress</span>
                <span className="text-amber-400">{userStats.xp} / {levelInfo.nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stat Badges in Passport */}
          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-4 gap-2.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-sm text-center">
            {/* Coins */}
            <div className="space-y-0.5">
              <span className="text-[9px] text-amber-300 font-bold block uppercase">Game Coins</span>
              <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-0.5">
                <span>🪙</span>
                <span>{userStats.coins}</span>
              </span>
              <span className="text-[9px] text-slate-400 block">Runner Vault</span>
            </div>

            {/* Travel Credits */}
            <div 
              onClick={() => setActiveTab('wallet')}
              className="space-y-0.5 border-l border-white/10 pl-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
            >
              <span className="text-[9px] text-sky-300 font-bold block uppercase">Credits</span>
              <span className="text-xl font-black text-sky-300 flex items-center justify-center gap-0.5">
                <span>₹{userStats.travelCredits || 0}</span>
              </span>
              <span className="text-[9px] text-slate-400 block">Concourse Perks</span>
            </div>

            {/* Stamps */}
            <div className="space-y-0.5 border-l border-white/10 pl-2">
              <span className="text-[9px] text-emerald-300 font-bold block uppercase">Stamps</span>
              <span className="text-xl font-black text-white">
                {unlockedStamps.length}
              </span>
              <span className="text-[9px] text-slate-400 block">Collected</span>
            </div>

            {/* Dubai Dash High Score */}
            <div className="space-y-0.5 border-l border-white/10 pl-2">
              <span className="text-[9px] text-orange-300 font-bold block uppercase">Dash Best</span>
              <span className="text-xl font-black text-orange-400">
                {userStats.highScoreDubaiDash}m
              </span>
              <span className="text-[9px] text-slate-400 block">Run Record</span>
            </div>
          </div>
        </div>

        {/* Share Button / Notification */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Registered Flight Layover: <strong className="text-white">{demoFlight.originCode} → {demoFlight.layoverAirportCode} → {demoFlight.destinationCode}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('wallet')}
              className="bg-sky-500 hover:bg-sky-400 text-white font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-white" />
              <span>Travel Wallet ({redeemedVouchers.length} Vouchers)</span>
            </button>

            <button
              onClick={() => setShowDutyFreeModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-900" />
              <span>Wardrobe</span>
            </button>

            <button
              onClick={handleSharePassport}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-1.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Share toast popup */}
        {showShareNotification && (
          <div className="mt-3 p-3 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold text-center animate-in slide-in-from-top-2">
            🎉 Passport Summary copied: Level {userStats.level} ({userStats.levelTitle}) · {unlockedStamps.length} Stamps · {userStats.coins} Coins!
          </div>
        )}
      </div>

      {/* SECTION 1: DIGITAL PASSPORT STAMPS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Collected Destination Stamps ({unlockedStamps.length} / {stamps.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any stamp to view location lore, verification status, and ink details.
            </p>
          </div>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stamps.map((stamp) => {
            const isUnlocked = !!stamp.dateUnlocked;

            return (
              <div
                key={stamp.id}
                onClick={() => setSelectedStamp(stamp)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between group relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-amber-50/20 border-amber-300 hover:shadow-md hover:scale-[1.02]'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 opacity-60'
                }`}
              >
                {/* Stamp Outer Border Design */}
                <div className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 mb-2 transition-transform group-hover:rotate-[-3deg] ${
                  isUnlocked
                    ? `${stamp.inkColor} bg-white shadow-sm`
                    : 'border-slate-300 text-slate-400 bg-white/40'
                }`}>
                  <span className="text-2xl mb-0.5">{stamp.icon}</span>
                  <span className="text-[9px] font-black tracking-widest uppercase">{stamp.code}</span>
                  <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{stamp.city}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {stamp.title}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {stamp.city}, {stamp.country}
                  </div>
                </div>

                {/* Status banner */}
                <div className="mt-2">
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Stamped
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ACHIEVEMENTS & MILESTONES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Achievement Badges ({unlockedAchievements.length} / {achievements.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Badges unlocked by real activities, food tastings, and flight runner scores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-amber-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {renderAchievementIcon(ach.icon)}
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        {ach.currentProgress} / {ach.maxProgress}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Reward:</span>
                  <span className="font-bold text-slate-700">
                    +{ach.rewardXP} XP · +{ach.rewardCoins} 🪙
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: COMPLETED MISSIONS LOG & ADVENTURE HISTORY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>Completed Missions Log ({completedMissionEntries.length})</span>
          </h2>

          <button
            onClick={() => setActiveTab('plan')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800"
          >
            Explore More Missions →
          </button>
        </div>

        {completedMissionEntries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-3xl">🧭</span>
            <div className="text-sm font-bold text-slate-800">No completed missions yet</div>
            <p className="text-xs text-slate-500">
              Pick a layover mission in the planner and check-in to record your history!
            </p>
            <button
              onClick={() => setActiveTab('plan')}
              className="mt-2 bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              Start First Mission
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {completedMissionEntries.map(({ activity, mission }) => {
              if (!activity) return null;

              return (
                <div
                  key={activity.id}
                  className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {activity.title}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        ✓ Verified Check-In
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activity.locationName}</span>
                      <span>·</span>
                      <span>{activity.airportCode} Transit Hub</span>
                    </div>

                    {mission.userNote && (
                      <p className="text-slate-600 italic pt-0.5">
                        &ldquo;{mission.userNote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      🪙 +{activity.coinsReward}
                    </span>
                    <span className="font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/60">
                      ⭐ +{activity.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stamp Inspection Modal */}
      <StampModal
        stamp={selectedStamp}
        onClose={() => setSelectedStamp(null)}
      />

      {/* Duty Free Wardrobe Modal */}
      <DutyFreeShopModal
        isOpen={showDutyFreeModal}
        onClose={() => setShowDutyFreeModal(false)}
      />
    </div>
  );
};
