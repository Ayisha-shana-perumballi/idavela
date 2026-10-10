export type Category = 'food' | 'culture' | 'sightseeing' | 'shopping' | 'relaxation';

export type BudgetTier = 'under500' | '500-1500' | '1500-3000' | '3000plus';

export type ExplorationMode = 'airport' | 'outside';

export interface Activity {
  id: string;
  airportCode: string;
  title: string;
  localName?: string;
  category: Category;
  isAirportOnly: boolean;
  durationMinutes: number;
  costInINR: number;
  xpReward: number;
  coinsReward: number;
  locationName: string;
  terminalOrArea: string;
  description: string;
  tips: string;
  recommendedOrder: number;
  stampRewardId?: string;
  iconName?: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  heroColor: string;
  description: string;
  defaultLayoverHours: number;
  minOutsideLayoverHours: number; // usually 5 hours
  transitCityName: string;
  currency: string;
  exchangeRateToINR: number; // 1 unit in INR
  highlights: string[];
}

export interface ItineraryItem {
  timeLabel: string;
  activity: Activity;
  notes: string;
  isReturnBuffer?: boolean;
}

export interface ItineraryPlan {
  id?: string;
  title?: string;
  airportCode: string;
  durationHours: number;
  budgetTier: BudgetTier;
  selectedCategories: Category[];
  explorationMode: ExplorationMode;
  items: ItineraryItem[];
  totalCostINR: number;
  remainingBudgetINR: number;
  totalTimeMinutes: number;
  bufferMinutes: number;
  isOutsideFeasible: boolean;
  feasibilityWarning?: string;
}

export type TimingAccuracy = 'ahead_of_time' | 'on_time' | 'tight_schedule' | 'delayed_rush';

export interface CommunityReview {
  id: string;
  itineraryId: string;
  itineraryTitle: string;
  airportCode: string;
  destinationCity: string;
  authorName: string;
  authorAvatar?: string;
  authorBadge?: string;
  rating: number; // 1 to 5
  actualSpendingINR: number;
  estimatedBudgetINR: number;
  durationHours: number;
  timingAccuracy: TimingAccuracy;
  favouriteActivities: string[];
  tips: string;
  reviewText: string;
  photos?: string[];
  wouldRecommend: boolean;
  createdAt: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
  isUserSubmitted?: boolean;
  isDemo?: boolean;
}

export interface CompletedItinerary {
  id: string;
  title: string;
  airportCode: string;
  destinationCity: string;
  durationHours: number;
  explorationMode: ExplorationMode;
  estimatedBudgetINR: number;
  completedAt: string;
  activityCount: number;
  activityTitles: string[];
}

export type MissionStatus = 'available' | 'active' | 'completed' | 'abandoned';

export interface UserMission {
  activityId: string;
  status: MissionStatus;
  startedAt?: string;
  completedAt?: string;
  userNote?: string;
  verifiedInDemo?: boolean;
}

export interface Stamp {
  id: string;
  code: string;
  title: string;
  city: string;
  country: string;
  dateUnlocked?: string;
  description: string;
  inkColor: string; // hex or tailwind class
  icon: string;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rewardXP: number;
  rewardCoins: number;
  currentProgress: number;
  maxProgress: number;
}

export interface DemoFlight {
  origin: string;
  originCode: string;
  layoverAirportCode: string;
  destination: string;
  destinationCode: string;
  flightNumber: string;
  nextFlightNumber: string;
  terminal: string;
  gate: string;
  layoverDurationMinutes: number;
  minutesRemaining: number; // demo countdown
  boardingStatus: 'Relax' | 'Explore' | 'Final Call' | 'Boarding Soon';
}

export interface RunnerSkin {
  id: string;
  name: string;
  priceCoins: number;
  description: string;
  icon: string;
  jacketColor: string;
  pantsColor: string;
  bagColor: string;
  hatColor: string;
}

export interface UserStats {
  coins: number;
  travelCredits: number; // Demo travel credits in ₹ (100 coins = ₹10 credits)
  xp: number;
  level: number;
  levelTitle: string;
  highScoreDubaiDash: number;
  totalMetersRun: number;
  dubaiDashRunsCount: number;
  selectedSkinId?: string;
  unlockedSkinIds?: string[];
}

export type OfferCategory = 'all' | 'cafe' | 'dining' | 'shopping' | 'lounge' | 'attraction';

export interface TravelOffer {
  id: string;
  partnerName: string;
  category: 'cafe' | 'dining' | 'shopping' | 'lounge' | 'attraction';
  airportCode: string; // 'DXB', 'COK', 'SIN', 'DOH', 'LHR', or 'ALL'
  location: string;
  title: string;
  discountDescription: string;
  creditsRequired: number; // e.g. 10 (which is 100 coins)
  originalValueINR: number;
  expiryHours: number;
  badgeText?: string;
  icon: string;
  terms: string;
}

export interface RedeemedVoucher {
  id: string;
  offerId: string;
  voucherCode: string;
  partnerName: string;
  title: string;
  discountDescription: string;
  airportCode: string;
  location: string;
  creditsSpent: number;
  redeemedAt: string;
  expiresAt: string;
  status: 'active' | 'used';
  barcode: string;
  category: 'cafe' | 'dining' | 'shopping' | 'lounge' | 'attraction';
}

export interface WalletTransaction {
  id: string;
  type: 'convert' | 'redeem' | 'bonus';
  coinsDelta?: number; // e.g. -100
  creditsDelta: number; // e.g. +10 or -25
  description: string;
  timestamp: string;
  partnerName?: string;
}
