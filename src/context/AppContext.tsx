import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Activity,
  ItineraryPlan,
  ItineraryItem,
  UserMission,
  UserStats,
  DemoFlight,
  BudgetTier,
  Category,
  ExplorationMode,
  Stamp,
  Achievement,
  TravelOffer,
  RedeemedVoucher,
  WalletTransaction,
  CommunityReview,
  CompletedItinerary
} from '../types';
import { AIRPORTS, ACTIVITIES, DEMO_FLIGHTS_BY_AIRPORT } from '../data/airports';
import { INITIAL_STAMPS, INITIAL_ACHIEVEMENTS, getLevelInfo } from '../data/stampsAndBadges';
import { RUNNER_SKINS } from '../data/skins';
import { WALLET_OFFERS, INITIAL_WALLET_TRANSACTIONS } from '../data/walletOffers';
import { INITIAL_COMMUNITY_REVIEWS, INITIAL_COMPLETED_ITINERARIES } from '../data/communityReviews';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface NotificationToast {
  id: string;
  type: 'coins' | 'xp' | 'stamp' | 'achievement' | 'mission';
  title: string;
  subtitle: string;
  icon?: string;
  amount?: number;
}

interface AppContextType {
  activeTab: 'home' | 'play' | 'plan' | 'passport' | 'wallet' | 'reviews';
  setActiveTab: (tab: 'home' | 'play' | 'plan' | 'passport' | 'wallet' | 'reviews') => void;
  selectedAirportCode: string;
  setSelectedAirportCode: (code: string) => void;
  selectedAirport: typeof AIRPORTS[0];
  userStats: UserStats;
  stamps: Stamp[];
  achievements: Achievement[];
  userMissions: Record<string, UserMission>;
  demoFlight: DemoFlight;
  currentPlan: ItineraryPlan | null;
  soundEnabled: boolean;
  toggleSound: () => void;
  toast: NotificationToast | null;
  clearToast: () => void;
  walletTransactions: WalletTransaction[];
  redeemedVouchers: RedeemedVoucher[];
  reviews: CommunityReview[];
  completedItineraries: CompletedItinerary[];

  // Actions
  startMission: (activityId: string) => void;
  completeMission: (activityId: string, userNote?: string) => { success: boolean; message: string };
  abandonMission: (activityId: string) => void;
  recordGameRun: (distanceMeters: number, coinsEarned: number) => { isNewHighScore: boolean; coinsAwarded: number; xpAwarded: number };
  generateItinerary: (params: {
    airportCode: string;
    durationHours: number;
    budgetTier: BudgetTier;
    categories: Category[];
    explorationMode: ExplorationMode;
  }) => ItineraryPlan;
  updateDemoCountdown: (deltaMinutes: number) => void;
  updateDemoFlight: (customFlight: Partial<DemoFlight>) => void;
  unlockSkin: (skinId: string) => { success: boolean; message: string };
  selectSkin: (skinId: string) => void;
  convertCoinsToCredits: (coinAmount: number) => { success: boolean; message: string; creditsGained?: number };
  redeemOffer: (offerId: string) => { success: boolean; message: string; voucher?: RedeemedVoucher };
  markVoucherUsed: (voucherId: string) => void;
  addReview: (reviewData: Omit<CommunityReview, 'id' | 'createdAt' | 'helpfulCount' | 'isUserSubmitted'>) => { success: boolean; message: string; review?: CommunityReview };
  toggleHelpfulVote: (reviewId: string) => void;
  markItineraryCompleted: (plan: ItineraryPlan) => { success: boolean; message: string; completedItinerary: CompletedItinerary };
  hasUserReviewedItinerary: (itineraryId: string) => boolean;
  getUserReviewForItinerary: (itineraryId: string) => CommunityReview | undefined;
  getAverageRatingForAirport: (airportCode: string) => { average: number; count: number; recommendPercentage: number; commonTips: string[] };
  resetDemoData: () => void;
}

const STORAGE_KEY = 'idavela_travel_state_v4';

const defaultStats: UserStats = {
  coins: 45,
  travelCredits: 10,
  xp: 120,
  level: 1,
  levelTitle: 'Terminal Rookie',
  highScoreDubaiDash: 0,
  totalMetersRun: 0,
  dubaiDashRunsCount: 0,
  selectedSkinId: 'skin-default',
  unlockedSkinIds: ['skin-default']
};

const defaultFlight: DemoFlight = {
  origin: 'Kochi (COK)',
  originCode: 'COK',
  layoverAirportCode: 'DXB',
  destination: 'London Heathrow (LHR)',
  destinationCode: 'LHR',
  flightNumber: 'EK 531',
  nextFlightNumber: 'EK 003',
  terminal: 'Terminal 3',
  gate: 'B18',
  layoverDurationMinutes: 285, // 4h 45m
  minutesRemaining: 268, // ~4h 28m
  boardingStatus: 'Explore'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'play' | 'plan' | 'passport' | 'wallet' | 'reviews'>('home');
  const [selectedAirportCode, setSelectedAirportCode] = useState<string>('DXB');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<NotificationToast | null>(null);

  // Core State
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [unlockedStampIds, setUnlockedStampIds] = useState<string[]>(['stamp-dxb-falcon']);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [userMissions, setUserMissions] = useState<Record<string, UserMission>>({
    'dxb-zen-garden': {
      activityId: 'dxb-zen-garden',
      status: 'active',
      startedAt: new Date(Date.now() - 25 * 60000).toISOString()
    }
  });
  const [demoFlight, setDemoFlight] = useState<DemoFlight>(defaultFlight);
  const [currentPlan, setCurrentPlan] = useState<ItineraryPlan | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [redeemedVouchers, setRedeemedVouchers] = useState<RedeemedVoucher[]>([]);

  // Community Reviews State with localStorage persistence
  const [reviews, setReviews] = useState<CommunityReview[]>(() => {
    try {
      const saved = localStorage.getItem('idavela_community_reviews_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved reviews:', e);
    }
    return INITIAL_COMMUNITY_REVIEWS;
  });

  const [completedItineraries, setCompletedItineraries] = useState<CompletedItinerary[]>(() => {
    try {
      const saved = localStorage.getItem('idavela_completed_itineraries_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved completed itineraries:', e);
    }
    return INITIAL_COMPLETED_ITINERARIES;
  });

  // Save reviews & completed itineraries
  useEffect(() => {
    try {
      localStorage.setItem('idavela_community_reviews_v1', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('idavela_completed_itineraries_v1', JSON.stringify(completedItineraries));
    } catch (e) {
      console.warn('Failed to save completed itineraries:', e);
    }
  }, [completedItineraries]);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userStats) {
          setUserStats({
            ...defaultStats,
            ...parsed.userStats,
            travelCredits: typeof parsed.userStats.travelCredits === 'number' ? parsed.userStats.travelCredits : 10
          });
        }
        if (parsed.unlockedStampIds) setUnlockedStampIds(parsed.unlockedStampIds);
        if (parsed.unlockedAchievementIds) setUnlockedAchievementIds(parsed.unlockedAchievementIds);
        if (parsed.userMissions) setUserMissions(parsed.userMissions);
        if (parsed.demoFlight) setDemoFlight(parsed.demoFlight);
        if (parsed.selectedAirportCode) setSelectedAirportCode(parsed.selectedAirportCode);
        if (Array.isArray(parsed.walletTransactions)) setWalletTransactions(parsed.walletTransactions);
        if (Array.isArray(parsed.redeemedVouchers)) setRedeemedVouchers(parsed.redeemedVouchers);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          sound.enabled = parsed.soundEnabled;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved IDAVELA state:', e);
    }
  }, []);

  // Save to LocalStorage whenever critical state changes
  useEffect(() => {
    try {
      const stateToSave = {
        userStats,
        unlockedStampIds,
        unlockedAchievementIds,
        userMissions,
        demoFlight,
        selectedAirportCode,
        walletTransactions,
        redeemedVouchers,
        soundEnabled
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save IDAVELA state:', e);
    }
  }, [userStats, unlockedStampIds, unlockedAchievementIds, userMissions, demoFlight, selectedAirportCode, walletTransactions, redeemedVouchers, soundEnabled]);

  // Sync audio enabled state
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      sound.enabled = next;
      return next;
    });
  }, []);

  const triggerToast = useCallback((toastData: Omit<NotificationToast, 'id'>) => {
    const id = Math.random().toString();
    setToast({ ...toastData, id });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4000);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Current airport metadata
  const selectedAirport = AIRPORTS.find(a => a.code === selectedAirportCode) || AIRPORTS[0];

  // Sync demo flight when airport changes
  useEffect(() => {
    const flightPreset = DEMO_FLIGHTS_BY_AIRPORT[selectedAirportCode];
    if (flightPreset) {
      setDemoFlight(prev => ({
        ...prev,
        layoverAirportCode: selectedAirportCode,
        origin: flightPreset.origin,
        originCode: flightPreset.originCode,
        destination: flightPreset.destination,
        destinationCode: flightPreset.destinationCode,
        flightNumber: flightPreset.flightNumber,
        nextFlightNumber: flightPreset.nextFlightNumber,
        terminal: flightPreset.terminal,
        gate: flightPreset.gate,
        layoverDurationMinutes: flightPreset.layoverDurationMinutes,
        minutesRemaining: Math.min(prev.minutesRemaining, flightPreset.layoverDurationMinutes)
      }));
    }
  }, [selectedAirportCode]);

  // Demo Layover Countdown Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoFlight(prev => {
        if (prev.minutesRemaining <= 0) return prev;
        const nextMin = prev.minutesRemaining - 1;
        let boardingStatus = prev.boardingStatus;
        if (nextMin <= 20) boardingStatus = 'Final Call';
        else if (nextMin <= 45) boardingStatus = 'Boarding Soon';
        else boardingStatus = 'Explore';

        return {
          ...prev,
          minutesRemaining: nextMin,
          boardingStatus
        };
      });
    }, 60000); // 1 minute interval

    return () => clearInterval(interval);
  }, []);

  const updateDemoCountdown = useCallback((deltaMinutes: number) => {
    setDemoFlight(prev => {
      const updated = Math.max(5, Math.min(prev.layoverDurationMinutes, prev.minutesRemaining + deltaMinutes));
      return {
        ...prev,
        minutesRemaining: updated
      };
    });
  }, []);

  const updateDemoFlight = useCallback((customFlight: Partial<DemoFlight>) => {
    setDemoFlight(prev => ({
      ...prev,
      ...customFlight
    }));
    sound.playAirportChime();
    triggerToast({
      type: 'mission',
      title: 'Demo Flight Route Updated',
      subtitle: `${customFlight.origin || 'Custom'} → ${customFlight.destination || 'Custom'}`,
      icon: '✈️'
    });
  }, [triggerToast]);

  const unlockSkin = useCallback((skinId: string) => {
    const skin = RUNNER_SKINS.find(s => s.id === skinId);
    if (!skin) return { success: false, message: 'Outfit not found.' };

    if (userStats.unlockedSkinIds?.includes(skinId)) {
      return { success: false, message: 'Outfit already unlocked!' };
    }

    if (userStats.coins < skin.priceCoins) {
      return { success: false, message: `Need ${skin.priceCoins} coins to unlock this outfit.` };
    }

    setUserStats(prev => ({
      ...prev,
      coins: prev.coins - skin.priceCoins,
      unlockedSkinIds: [...(prev.unlockedSkinIds || ['skin-default']), skinId],
      selectedSkinId: skinId
    }));

    sound.playPowerup();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'coins',
      title: 'New Runner Outfit Unlocked!',
      subtitle: `${skin.name} equipped for Dubai Dash!`,
      icon: skin.icon
    });

    return { success: true, message: 'Outfit successfully unlocked!' };
  }, [userStats.coins, userStats.unlockedSkinIds, triggerToast]);

  const selectSkin = useCallback((skinId: string) => {
    setUserStats(prev => ({
      ...prev,
      selectedSkinId: skinId
    }));
    sound.playCoin();
  }, []);

  // Convert 100 game coins to ₹10 demo travel credits
  const convertCoinsToCredits = useCallback((coinAmount: number) => {
    if (coinAmount < 100) {
      return { success: false, message: 'Minimum conversion is 100 coins (₹10 credits).' };
    }

    const validCoins = Math.floor(coinAmount / 100) * 100;
    if (userStats.coins < validCoins) {
      return { success: false, message: `Insufficient coins. You have ${userStats.coins} coins.` };
    }

    const creditsGained = (validCoins / 100) * 10;

    setUserStats(prev => ({
      ...prev,
      coins: prev.coins - validCoins,
      travelCredits: (prev.travelCredits || 0) + creditsGained
    }));

    const newTx: WalletTransaction = {
      id: 'tx-conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: 'convert',
      coinsDelta: -validCoins,
      creditsDelta: creditsGained,
      description: `Converted ${validCoins} Coins to ₹${creditsGained} Demo Travel Credits`,
      timestamp: new Date().toISOString()
    };

    setWalletTransactions(prev => [newTx, ...prev]);

    sound.playCashRegister();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'coins',
      title: 'Coins Converted to Credits!',
      subtitle: `-${validCoins} 🪙 → +₹${creditsGained} Demo Travel Credits`,
      icon: '💳'
    });

    return {
      success: true,
      message: `Successfully converted ${validCoins} coins into ₹${creditsGained} travel credits!`,
      creditsGained
    };
  }, [userStats.coins, triggerToast]);

  // Redeem Offer using travel credits
  const redeemOffer = useCallback((offerId: string) => {
    const offer = WALLET_OFFERS.find(o => o.id === offerId);
    if (!offer) {
      return { success: false, message: 'Offer not found in transit directory.' };
    }

    const currentCredits = userStats.travelCredits || 0;
    if (currentCredits < offer.creditsRequired) {
      return {
        success: false,
        message: `Need ₹${offer.creditsRequired} credits. You currently have ₹${currentCredits}. Convert game coins first!`
      };
    }

    // Deduct credits
    setUserStats(prev => ({
      ...prev,
      travelCredits: (prev.travelCredits || 0) - offer.creditsRequired
    }));

    // Generate realistic unique transit voucher code & barcode
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codeSlug = offer.id.replace('offer-', '').slice(0, 4).toUpperCase();
    const voucherCode = `IDA-${offer.airportCode}-${codeSlug}-${randomSuffix}`;
    const barcode = `IDA${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newVoucher: RedeemedVoucher = {
      id: 'vouch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      offerId: offer.id,
      voucherCode,
      partnerName: offer.partnerName,
      title: offer.title,
      discountDescription: offer.discountDescription,
      airportCode: offer.airportCode,
      location: offer.location,
      creditsSpent: offer.creditsRequired,
      redeemedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + offer.expiryHours * 3600000).toISOString(),
      status: 'active',
      barcode,
      category: offer.category
    };

    setRedeemedVouchers(prev => [newVoucher, ...prev]);

    const newTx: WalletTransaction = {
      id: 'tx-red-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: 'redeem',
      creditsDelta: -offer.creditsRequired,
      description: `Redeemed: ${offer.title} (${offer.partnerName})`,
      timestamp: new Date().toISOString(),
      partnerName: offer.partnerName
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Check Concourse Saver achievement
    setUnlockedAchievementIds(prev => {
      if (!prev.includes('ach-concourse-saver')) {
        sound.playFanfare();
        triggerToast({
          type: 'achievement',
          title: 'Achievement Unlocked: Concourse Saver!',
          subtitle: '+100 XP · +50 Coins awarded!',
          icon: '💳'
        });
        setUserStats(curr => ({
          ...curr,
          xp: curr.xp + 100,
          coins: curr.coins + 50
        }));
        return [...prev, 'ach-concourse-saver'];
      }
      return prev;
    });

    // Check Stamp Unlock for Travel VIP
    setUnlockedStampIds(prev => {
      if (!prev.includes('stamp-wallet-vip')) {
        sound.playStamp();
        triggerToast({
          type: 'stamp',
          title: 'New Stamp: Duty Free Diplomat!',
          subtitle: 'Unlocked exclusive Concourse Perks stamp!',
          icon: '🎟️'
        });
        return [...prev, 'stamp-wallet-vip'];
      }
      return prev;
    });

    sound.playCashRegister();
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.55 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'achievement',
      title: 'Concourse Voucher Claimed!',
      subtitle: `Code: ${voucherCode} for ${offer.partnerName}`,
      icon: '🎟️'
    });

    return {
      success: true,
      message: `Voucher generated! Code: ${voucherCode}`,
      voucher: newVoucher
    };
  }, [userStats.travelCredits, triggerToast]);

  const markVoucherUsed = useCallback((voucherId: string) => {
    setRedeemedVouchers(prev => prev.map(v => {
      if (v.id === voucherId) {
        return { ...v, status: 'used' as const };
      }
      return v;
    }));
    sound.playStamp();
    triggerToast({
      type: 'mission',
      title: 'Voucher Used in Demo',
      subtitle: 'Simulated counter checkout completed',
      icon: '✅'
    });
  }, [triggerToast]);

  // Helper to re-evaluate level and title based on XP
  const applyLevelUpdate = useCallback((newXP: number, currentStats: UserStats): UserStats => {
    const info = getLevelInfo(newXP);
    return {
      ...currentStats,
      xp: newXP,
      level: info.level,
      levelTitle: info.title
    };
  }, []);

  // Check if current user already submitted a review for this itinerary
  const hasUserReviewedItinerary = useCallback((itineraryId: string) => {
    return reviews.some(r => r.itineraryId === itineraryId && r.isUserSubmitted);
  }, [reviews]);

  // Get user's existing review for this itinerary if one exists
  const getUserReviewForItinerary = useCallback((itineraryId: string) => {
    return reviews.find(r => r.itineraryId === itineraryId && r.isUserSubmitted);
  }, [reviews]);

  // Mark an itinerary as completed
  const markItineraryCompleted = useCallback((plan: ItineraryPlan) => {
    const airport = AIRPORTS.find(a => a.code === plan.airportCode) || AIRPORTS[0];
    const itineraryId = plan.id || `itinerary-${plan.airportCode.toLowerCase()}-${plan.durationHours}h-${plan.explorationMode}`;
    const title = plan.title || `${airport.city} ${plan.durationHours}h ${plan.explorationMode === 'airport' ? 'Airport Adventure' : 'City Explorer'}`;

    const existing = completedItineraries.find(ci => ci.id === itineraryId);
    if (existing) {
      return {
        success: false,
        message: 'This itinerary is already marked as completed!',
        completedItinerary: existing
      };
    }

    const activityTitles = plan.items
      .filter(i => !i.isReturnBuffer && i.activity.id !== 'arrival-step')
      .map(i => i.activity.title);

    const newCompleted: CompletedItinerary = {
      id: itineraryId,
      title,
      airportCode: plan.airportCode,
      destinationCity: airport.city,
      durationHours: plan.durationHours,
      explorationMode: plan.explorationMode,
      estimatedBudgetINR: plan.totalCostINR,
      completedAt: new Date().toISOString(),
      activityCount: activityTitles.length,
      activityTitles
    };

    setCompletedItineraries(prev => [newCompleted, ...prev]);

    // Award bonus XP & Coins for completing full itinerary
    const bonusXP = 100;
    const bonusCoins = 40;
    setUserStats(curr => applyLevelUpdate(curr.xp + bonusXP, { ...curr, coins: curr.coins + bonusCoins }));

    sound.playFanfare();
    try {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.55 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'achievement',
      title: 'Itinerary Completed! 🎉',
      subtitle: `+${bonusXP} XP · +${bonusCoins} Coins! Leave a community review`,
      icon: '🗺️'
    });

    return {
      success: true,
      message: 'Itinerary successfully marked as completed!',
      completedItinerary: newCompleted
    };
  }, [completedItineraries, applyLevelUpdate, triggerToast]);

  // Submit a community review for a completed itinerary
  const addReview = useCallback((reviewData: Omit<CommunityReview, 'id' | 'createdAt' | 'helpfulCount' | 'isUserSubmitted'>) => {
    // Prevent duplicate reviews for the same completed itinerary
    if (hasUserReviewedItinerary(reviewData.itineraryId)) {
      return {
        success: false,
        message: 'You have already submitted a review for this itinerary! Duplicate submissions are prevented.'
      };
    }

    const newReview: CommunityReview = {
      ...reviewData,
      id: `rev-user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      userVotedHelpful: false,
      isUserSubmitted: true,
      isDemo: false
    };

    setReviews(prev => [newReview, ...prev]);

    // Reward the traveller for contributing to the community
    const bonusXP = 75;
    const bonusCoins = 35;
    setUserStats(curr => applyLevelUpdate(curr.xp + bonusXP, { ...curr, coins: curr.coins + bonusCoins }));

    sound.playFanfare();
    try {
      confetti({ particleCount: 85, spread: 70, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'achievement',
      title: 'Review Published! ⭐',
      subtitle: `+${bonusXP} XP · +${bonusCoins} Coins for community contribution`,
      icon: '📝'
    });

    return {
      success: true,
      message: 'Your review was published to the IDAVELA Community!',
      review: newReview
    };
  }, [hasUserReviewedItinerary, applyLevelUpdate, triggerToast]);

  // Toggle helpful upvote on any review
  const toggleHelpfulVote = useCallback((reviewId: string) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const currentlyVoted = !!rev.userVotedHelpful;
        const newVoted = !currentlyVoted;
        const newCount = newVoted ? rev.helpfulCount + 1 : Math.max(0, rev.helpfulCount - 1);
        if (newVoted) sound.playCoin();
        return {
          ...rev,
          helpfulCount: newCount,
          userVotedHelpful: newVoted
        };
      }
      return rev;
    }));
  }, []);

  // Compute average rating, total count, recommendation percentage, and common traveller tips for an airport
  const getAverageRatingForAirport = useCallback((airportCode: string) => {
    const airportReviews = reviews.filter(r => r.airportCode === airportCode);
    if (airportReviews.length === 0) {
      return {
        average: 4.9,
        count: 0,
        recommendPercentage: 98,
        commonTips: [
          'Allow at least 90 minutes for security and boarding gate clearance.',
          'Take airport express transit to avoid rush hour road traffic.',
          'Transit lounges offer hot tea, charging docks, and quiet pods.'
        ]
      };
    }

    const total = airportReviews.reduce((sum, r) => sum + r.rating, 0);
    const average = Number((total / airportReviews.length).toFixed(1));
    const recommendCount = airportReviews.filter(r => r.wouldRecommend).length;
    const recommendPercentage = Math.round((recommendCount / airportReviews.length) * 100);

    const tipsList = airportReviews
      .map(r => r.tips)
      .filter(Boolean)
      .slice(0, 3);

    return {
      average,
      count: airportReviews.length,
      recommendPercentage,
      commonTips: tipsList
    };
  }, [reviews]);

  // Check and unlock achievements
  const checkAchievements = useCallback((
    updatedStats: UserStats,
    completedMissionsCount: number,
    completedActivities: Activity[]
  ) => {
    setUnlockedAchievementIds(prevUnlocked => {
      const newUnlocked = [...prevUnlocked];
      let xpBonus = 0;
      let coinBonus = 0;

      INITIAL_ACHIEVEMENTS.forEach(ach => {
        if (newUnlocked.includes(ach.id)) return;

        let shouldUnlock = false;
        if (ach.id === 'ach-first-adventure' && completedMissionsCount >= 1) shouldUnlock = true;
        if (ach.id === 'ach-food-explorer' && completedActivities.some(a => a.category === 'food')) shouldUnlock = true;
        if (ach.id === 'ach-landmark-discoverer' && completedActivities.some(a => a.category === 'culture' || a.category === 'sightseeing')) shouldUnlock = true;
        if (ach.id === 'ach-airport-explorer' && completedActivities.some(a => a.isAirportOnly)) shouldUnlock = true;
        if (ach.id === 'ach-coin-collector' && updatedStats.coins >= 100) shouldUnlock = true;
        if (ach.id === 'ach-dubai-dash-runner' && updatedStats.highScoreDubaiDash >= 500) shouldUnlock = true;
        if (ach.id === 'ach-layover-master' && completedMissionsCount >= 5) shouldUnlock = true;

        if (shouldUnlock) {
          newUnlocked.push(ach.id);
          xpBonus += ach.rewardXP;
          coinBonus += ach.rewardCoins;
          sound.playFanfare();
          triggerToast({
            type: 'achievement',
            title: `Achievement Unlocked: ${ach.title}`,
            subtitle: `+${ach.rewardXP} XP · +${ach.rewardCoins} Coins!`,
            icon: '🏆'
          });
          try {
            confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      });

      if (xpBonus > 0 || coinBonus > 0) {
        setUserStats(curr => applyLevelUpdate(curr.xp + xpBonus, { ...curr, coins: curr.coins + coinBonus }));
      }

      return newUnlocked;
    });
  }, [applyLevelUpdate, triggerToast]);

  // Mission Actions
  const startMission = useCallback((activityId: string) => {
    setUserMissions(prev => ({
      ...prev,
      [activityId]: {
        activityId,
        status: 'active',
        startedAt: new Date().toISOString()
      }
    }));
    sound.playStamp();
    const act = ACTIVITIES.find(a => a.id === activityId);
    triggerToast({
      type: 'mission',
      title: 'Mission Started!',
      subtitle: act ? act.title : 'Good luck on your adventure!',
      icon: '🧭'
    });
  }, [triggerToast]);

  const completeMission = useCallback((activityId: string, userNote?: string) => {
    const existing = userMissions[activityId];
    if (existing?.status === 'completed') {
      return { success: false, message: 'Mission already completed and rewards claimed!' };
    }

    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity) {
      return { success: false, message: 'Activity not found.' };
    }

    // Award rewards
    const xpGained = activity.xpReward;
    const coinsGained = activity.coinsReward;

    setUserMissions(prev => ({
      ...prev,
      [activityId]: {
        activityId,
        status: 'completed',
        completedAt: new Date().toISOString(),
        userNote: userNote || 'Completed during layover',
        verifiedInDemo: true
      }
    }));

    setUserStats(curr => {
      const newCoins = curr.coins + coinsGained;
      const updated = applyLevelUpdate(curr.xp + xpGained, { ...curr, coins: newCoins });

      // Check achievements after stats updated
      const allCompletedIds = Object.keys({ ...userMissions, [activityId]: { status: 'completed' } })
        .filter(id => id === activityId || userMissions[id]?.status === 'completed');
      const completedActs = ACTIVITIES.filter(a => allCompletedIds.includes(a.id));

      setTimeout(() => {
        checkAchievements(updated, allCompletedIds.length, completedActs);
      }, 500);

      return updated;
    });

    // Check Stamp Unlock
    if (activity.stampRewardId) {
      const stampId = activity.stampRewardId;
      setUnlockedStampIds(prev => {
        if (!prev.includes(stampId)) {
          const stampObj = INITIAL_STAMPS.find(s => s.id === stampId);
          setTimeout(() => {
            sound.playStamp();
            triggerToast({
              type: 'stamp',
              title: 'New Passport Stamp Collected!',
              subtitle: stampObj ? `${stampObj.title} (${stampObj.city})` : 'Added to your passport!',
              icon: stampObj?.icon || '✈️'
            });
          }, 800);
          return [...prev, stampId];
        }
        return prev;
      });
    }

    sound.playFanfare();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    triggerToast({
      type: 'coins',
      title: 'Mission Accomplished!',
      subtitle: `+${coinsGained} Coins · +${xpGained} XP awarded`,
      amount: coinsGained
    });

    return { success: true, message: 'Mission successfully completed!' };
  }, [userMissions, applyLevelUpdate, checkAchievements, triggerToast]);

  const abandonMission = useCallback((activityId: string) => {
    setUserMissions(prev => ({
      ...prev,
      [activityId]: {
        activityId,
        status: 'abandoned'
      }
    }));
  }, []);

  // Dubai Dash Game Run Completion
  const recordGameRun = useCallback((distanceMeters: number, coinsEarned: number) => {
    let isNewHighScore = false;
    const xpAwarded = Math.max(10, Math.floor(distanceMeters / 8));

    setUserStats(curr => {
      const isRecord = distanceMeters > curr.highScoreDubaiDash;
      if (isRecord) isNewHighScore = true;

      const newCoins = curr.coins + coinsEarned;
      const updated = applyLevelUpdate(curr.xp + xpAwarded, {
        ...curr,
        coins: newCoins,
        highScoreDubaiDash: Math.max(curr.highScoreDubaiDash, distanceMeters),
        totalMetersRun: curr.totalMetersRun + distanceMeters,
        dubaiDashRunsCount: curr.dubaiDashRunsCount + 1
      });

      // Check special game runner stamp & achievement
      if (distanceMeters >= 350) {
        setUnlockedStampIds(stamps => {
          if (!stamps.includes('stamp-speed-demon')) {
            sound.playStamp();
            triggerToast({
              type: 'stamp',
              title: 'New Stamp: Terminal Sprinter!',
              subtitle: 'Ran over 350m in Dubai Dash!',
              icon: '⚡'
            });
            return [...stamps, 'stamp-speed-demon'];
          }
          return stamps;
        });
      }

      // Check runner achievement
      setTimeout(() => {
        const completedIds = Object.keys(userMissions).filter(id => userMissions[id]?.status === 'completed');
        const completedActs = ACTIVITIES.filter(a => completedIds.includes(a.id));
        checkAchievements(updated, completedIds.length, completedActs);
      }, 500);

      return updated;
    });

    return {
      isNewHighScore,
      coinsAwarded: coinsEarned,
      xpAwarded
    };
  }, [applyLevelUpdate, checkAchievements, triggerToast, userMissions]);

  // Smart Deterministic Itinerary Planner
  const generateItinerary = useCallback((params: {
    airportCode: string;
    durationHours: number;
    budgetTier: BudgetTier;
    categories: Category[];
    explorationMode: ExplorationMode;
  }): ItineraryPlan => {
    const airport = AIRPORTS.find(a => a.code === params.airportCode) || AIRPORTS[0];
    const budgetLimits: Record<BudgetTier, number> = {
      'under500': 500,
      '500-1500': 1500,
      '1500-3000': 3000,
      '3000plus': 7500
    };
    const maxBudget = budgetLimits[params.budgetTier];

    // Check outside feasibility
    let effectiveMode = params.explorationMode;
    let feasibilityWarning: string | undefined;
    const isOutsideFeasible = params.durationHours >= airport.minOutsideLayoverHours;

    if (params.explorationMode === 'outside' && !isOutsideFeasible) {
      effectiveMode = 'airport';
      feasibilityWarning = `Your layover (${params.durationHours} hrs) is too short to safely clear immigration, transit to the city, and return through security buffer. We safely switched to Airport-Only adventures!`;
    }

    // Filter available activities for this airport
    const airportPool = ACTIVITIES.filter(act => {
      if (act.airportCode !== airport.code) return false;
      if (effectiveMode === 'airport' && !act.isAirportOnly) return false;
      return true;
    });

    // Score activities based on user selected categories
    const scoredPool = airportPool.map(act => {
      let score = 10;
      if (params.categories.length === 0 || params.categories.includes(act.category)) {
        score += 50;
      }
      if (act.costInINR <= maxBudget) {
        score += 20;
      }
      return { act, score };
    });

    // Sort by score desc, then recommended order
    scoredPool.sort((a, b) => b.score - a.score || a.act.recommendedOrder - b.act.recommendedOrder);

    // Time budget allocation
    const totalAvailableMinutes = params.durationHours * 60;
    // Buffer: 90 mins for airport only, 150 mins (2.5 hrs) if outside
    const bufferMinutes = effectiveMode === 'outside' ? 150 : 80;
    const activityBudgetMinutes = Math.max(45, totalAvailableMinutes - bufferMinutes);

    const chosenActivities: Activity[] = [];
    let currentCost = 0;
    let currentMinutes = 0;

    for (const item of scoredPool) {
      const act = item.act;
      if (currentMinutes + act.durationMinutes <= activityBudgetMinutes) {
        if (currentCost + act.costInINR <= maxBudget || chosenActivities.length === 0) {
          chosenActivities.push(act);
          currentMinutes += act.durationMinutes;
          currentCost += act.costInINR;
        }
      }
    }

    // Build timeline items
    const timelineItems: ItineraryItem[] = [];
    let clockOffset = 15; // 15 mins after touchdown

    // Arrival step
    timelineItems.push({
      timeLabel: `+${Math.floor(clockOffset / 60)}h ${clockOffset % 60}m`,
      activity: {
        id: 'arrival-step',
        airportCode: airport.code,
        title: `Touchdown & Terminal ${airport.code} Transit Orientation`,
        category: 'relaxation',
        isAirportOnly: true,
        durationMinutes: 15,
        costInINR: 0,
        xpReward: 10,
        coinsReward: 5,
        locationName: airport.name,
        terminalOrArea: 'Arrivals Concourse',
        description: 'Deboard, stretch legs, check connecting flight monitors, and connect to free high-speed airport Wi-Fi.',
        tips: 'Keep your boarding pass and passport handy in your daypack.',
        recommendedOrder: 0
      },
      notes: 'Arrival & transit security check'
    });

    // Activities
    chosenActivities.forEach((act, idx) => {
      clockOffset += 20; // 20m transit/walking between spots
      const hour = Math.floor(clockOffset / 60);
      const min = clockOffset % 60;
      timelineItems.push({
        timeLabel: `+${hour}h ${min < 10 ? '0' : ''}${min}m`,
        activity: act,
        notes: `Step ${idx + 1} of your layover adventure`
      });
      clockOffset += act.durationMinutes;
    });

    // Final Return Buffer step
    const returnHour = Math.floor((totalAvailableMinutes - bufferMinutes) / 60);
    const returnMin = (totalAvailableMinutes - bufferMinutes) % 60;
    timelineItems.push({
      timeLabel: `+${returnHour}h ${returnMin < 10 ? '0' : ''}${returnMin}m`,
      activity: {
        id: 'buffer-step',
        airportCode: airport.code,
        title: `Return to Gate & Departure Buffer (${Math.round(bufferMinutes / 60)}h Safety Margin)`,
        category: 'relaxation',
        isAirportOnly: true,
        durationMinutes: bufferMinutes,
        costInINR: 0,
        xpReward: 30,
        coinsReward: 15,
        locationName: `Gate ${demoFlight.gate || 'Departures'}`,
        terminalOrArea: 'Departure Concourse',
        description: 'Mandatory security buffer: arrive at your departure gate well before final call, grab fresh water, and board with zero rush.',
        tips: 'Boarding closes strictly 20 minutes prior to scheduled departure.',
        recommendedOrder: 99
      },
      notes: 'Final Call & Boarding safety buffer',
      isReturnBuffer: true
    });

    const planId = `itinerary-${airport.code.toLowerCase()}-${params.durationHours}h-${effectiveMode}`;
    const planTitle = `${airport.city} ${params.durationHours}h ${effectiveMode === 'airport' ? 'Airport Adventure' : 'City Explorer'}`;

    const plan: ItineraryPlan = {
      id: planId,
      title: planTitle,
      airportCode: airport.code,
      durationHours: params.durationHours,
      budgetTier: params.budgetTier,
      selectedCategories: params.categories,
      explorationMode: effectiveMode,
      items: timelineItems,
      totalCostINR: currentCost,
      remainingBudgetINR: Math.max(0, maxBudget - currentCost),
      totalTimeMinutes: clockOffset + bufferMinutes,
      bufferMinutes,
      isOutsideFeasible,
      feasibilityWarning
    };

    setCurrentPlan(plan);
    return plan;
  }, [demoFlight.gate]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('idavela_community_reviews_v1');
    localStorage.removeItem('idavela_completed_itineraries_v1');
    setUserStats(defaultStats);
    setUnlockedStampIds(['stamp-dxb-falcon']);
    setUnlockedAchievementIds([]);
    setUserMissions({
      'dxb-zen-garden': {
        activityId: 'dxb-zen-garden',
        status: 'active',
        startedAt: new Date(Date.now() - 25 * 60000).toISOString()
      }
    });
    setDemoFlight(defaultFlight);
    setSelectedAirportCode('DXB');
    setCurrentPlan(null);
    setWalletTransactions(INITIAL_WALLET_TRANSACTIONS);
    setRedeemedVouchers([]);
    setReviews(INITIAL_COMMUNITY_REVIEWS);
    setCompletedItineraries(INITIAL_COMPLETED_ITINERARIES);
    sound.playCoin();
    triggerToast({
      type: 'achievement',
      title: 'Demo State Reset',
      subtitle: 'Restored baseline layover demo experience & reviews',
      icon: '🔄'
    });
  }, [triggerToast]);

  // Compute full stamp list with unlock status
  const stamps: Stamp[] = INITIAL_STAMPS.map(s => ({
    ...s,
    dateUnlocked: unlockedStampIds.includes(s.id) ? 'Active Journey' : undefined
  }));

  // Compute achievements with progress
  const completedCount = Object.keys(userMissions).filter(id => userMissions[id]?.status === 'completed').length;
  const completedActivities = ACTIVITIES.filter(a => userMissions[a.id]?.status === 'completed');

  const achievements: Achievement[] = INITIAL_ACHIEVEMENTS.map(ach => {
    const isUnlocked = unlockedAchievementIds.includes(ach.id);
    let progress = 0;
    if (ach.id === 'ach-first-adventure') progress = Math.min(1, completedCount);
    else if (ach.id === 'ach-food-explorer') progress = completedActivities.some(a => a.category === 'food') ? 1 : 0;
    else if (ach.id === 'ach-landmark-discoverer') progress = completedActivities.some(a => a.category === 'culture' || a.category === 'sightseeing') ? 1 : 0;
    else if (ach.id === 'ach-airport-explorer') progress = completedActivities.some(a => a.isAirportOnly) ? 1 : 0;
    else if (ach.id === 'ach-coin-collector') progress = Math.min(100, userStats.coins);
    else if (ach.id === 'ach-dubai-dash-runner') progress = Math.min(500, userStats.highScoreDubaiDash);
    else if (ach.id === 'ach-layover-master') progress = Math.min(5, completedCount);
    else if (ach.id === 'ach-thrifty-explorer') progress = currentPlan && currentPlan.totalCostINR <= 1500 ? 1 : 0;
    else if (ach.id === 'ach-concourse-saver') progress = redeemedVouchers.length >= 1 ? 1 : 0;

    return {
      ...ach,
      currentProgress: isUnlocked ? ach.maxProgress : progress,
      unlockedAt: isUnlocked ? 'Unlocked' : undefined
    };
  });

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAirportCode,
        setSelectedAirportCode,
        selectedAirport,
        userStats,
        stamps,
        achievements,
        userMissions,
        demoFlight,
        currentPlan,
        soundEnabled,
        toggleSound,
        toast,
        clearToast,
        walletTransactions,
        redeemedVouchers,
        reviews,
        completedItineraries,
        startMission,
        completeMission,
        abandonMission,
        recordGameRun,
        generateItinerary,
        updateDemoCountdown,
        updateDemoFlight,
        unlockSkin,
        selectSkin,
        convertCoinsToCredits,
        redeemOffer,
        markVoucherUsed,
        addReview,
        toggleHelpfulVote,
        markItineraryCompleted,
        hasUserReviewedItinerary,
        getUserReviewForItinerary,
        getAverageRatingForAirport,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
