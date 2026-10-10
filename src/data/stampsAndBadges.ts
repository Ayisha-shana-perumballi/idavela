import { Stamp, Achievement } from '../types';

export const INITIAL_STAMPS: Stamp[] = [
  {
    id: 'stamp-dxb-falcon',
    code: 'DXB-01',
    title: 'Dubai Falcon Explorer',
    city: 'Dubai',
    country: 'UAE',
    description: 'Awarded for embarking on an adventure at Dubai International (DXB) or Downtown.',
    inkColor: 'text-amber-600 border-amber-600',
    icon: '🦅',
    category: 'City'
  },
  {
    id: 'stamp-sin-jewel',
    code: 'SIN-01',
    title: 'Changi Rain Vortex',
    city: 'Singapore',
    country: 'Singapore',
    description: 'Awarded for exploring Singapore Changi Jewel waterfall and transit forest.',
    inkColor: 'text-emerald-600 border-emerald-600',
    icon: '🌊',
    category: 'City'
  },
  {
    id: 'stamp-doh-bear',
    code: 'DOH-01',
    title: 'Hamad Lamp Bear',
    city: 'Doha',
    country: 'Qatar',
    description: 'Awarded for locating Hamad’s world-famous Urs Fischer canary yellow giant bear.',
    inkColor: 'text-yellow-600 border-yellow-600',
    icon: '🧸',
    category: 'City'
  },
  {
    id: 'stamp-cok-solar',
    code: 'COK-01',
    title: 'Cochin Solar Heritage',
    city: 'Kochi',
    country: 'India',
    description: 'Awarded for visiting Cochin International, the world’s pioneer 100% solar green airport.',
    inkColor: 'text-green-700 border-green-700',
    icon: '☀️',
    category: 'City'
  },
  {
    id: 'stamp-lhr-clock',
    code: 'LHR-01',
    title: 'Heathrow Big Ben Transit',
    city: 'London',
    country: 'UK',
    description: 'Awarded for an adventure through London Heathrow or the Westminster tube line.',
    inkColor: 'text-sky-700 border-sky-700',
    icon: '🕰️',
    category: 'City'
  },
  {
    id: 'stamp-kul-towers',
    code: 'KUL-01',
    title: 'Kuala Lumpur Twin Spire',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    description: 'Awarded for dashing through KLIA rainforest satellite or Petronas Skyline.',
    inkColor: 'text-orange-600 border-orange-600',
    icon: '🏙️',
    category: 'City'
  },
  {
    id: 'stamp-speed-demon',
    code: 'GAME-01',
    title: 'Terminal Sprinter',
    city: 'Virtual Transit',
    country: 'IDAVELA Games',
    description: 'Earned by sprinting 350+ meters in Dubai Dash Run mini-game.',
    inkColor: 'text-red-600 border-red-600',
    icon: '⚡',
    category: 'Special'
  },
  {
    id: 'stamp-foodie',
    code: 'FOOD-01',
    title: 'Transit Gourmet',
    city: 'Global Transit',
    country: 'Flavors',
    description: 'Earned by savoring local delicacies during a flight layover.',
    inkColor: 'text-amber-700 border-amber-700',
    icon: '☕',
    category: 'Culinary'
  },
  {
    id: 'stamp-wallet-vip',
    code: 'PERK-01',
    title: 'Duty Free Diplomat',
    city: 'Concourse Lounge',
    country: 'IDAVELA Perks',
    description: 'Earned by converting Dubai Dash coins to concourse travel credits and claiming transit savings.',
    inkColor: 'text-emerald-600 border-emerald-600',
    icon: '🎟️',
    category: 'Special'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-adventure',
    title: 'First Adventure',
    description: 'Complete your very first layover mission.',
    icon: 'Compass',
    rewardXP: 100,
    rewardCoins: 50,
    currentProgress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-food-explorer',
    title: 'Local Food Explorer',
    description: 'Taste a signature local snack, tea, or meal during a layover.',
    icon: 'UtensilsCrossed',
    rewardXP: 80,
    rewardCoins: 40,
    currentProgress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-landmark-discoverer',
    title: 'Landmark Discoverer',
    description: 'Complete any cultural or sightseeing layover mission.',
    icon: 'Landmark',
    rewardXP: 120,
    rewardCoins: 60,
    currentProgress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-airport-explorer',
    title: 'Airport Explorer',
    description: 'Complete an airport-only relaxation or transit mission.',
    icon: 'PlaneTakeoff',
    rewardXP: 75,
    rewardCoins: 35,
    currentProgress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-coin-collector',
    title: 'Coin Collector',
    description: 'Accumulate a balance of 100 or more virtual travel coins.',
    icon: 'Coins',
    rewardXP: 150,
    rewardCoins: 50,
    currentProgress: 0,
    maxProgress: 100
  },
  {
    id: 'ach-dubai-dash-runner',
    title: 'Dubai Dash Runner',
    description: 'Run 500 meters or more in a single Dubai Dash session.',
    icon: 'Footprints',
    rewardXP: 150,
    rewardCoins: 75,
    currentProgress: 0,
    maxProgress: 500
  },
  {
    id: 'ach-layover-master',
    title: 'Master of Layovers',
    description: 'Successfully complete 5 real-world layover missions.',
    icon: 'Award',
    rewardXP: 250,
    rewardCoins: 120,
    currentProgress: 0,
    maxProgress: 5
  },
  {
    id: 'ach-thrifty-explorer',
    title: 'Thrifty Explorer',
    description: 'Plan and embark on a budget layover itinerary under ₹1,500.',
    icon: 'Sparkles',
    rewardXP: 90,
    rewardCoins: 45,
    currentProgress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-concourse-saver',
    title: 'Concourse Saver',
    description: 'Convert game coins and redeem your first demo discount voucher in Travel Wallet.',
    icon: 'CreditCard',
    rewardXP: 100,
    rewardCoins: 50,
    currentProgress: 0,
    maxProgress: 1
  }
];

export function getLevelInfo(xp: number): { level: number; title: string; nextLevelXP: number; progressPercent: number } {
  const levels = [
    { level: 1, title: 'Terminal Rookie', xp: 0 },
    { level: 2, title: 'Transit Nomad', xp: 150 },
    { level: 3, title: 'Concourse Jetsetter', xp: 350 },
    { level: 4, title: 'Layover Specialist', xp: 650 },
    { level: 5, title: 'Globetrotter Legend', xp: 1100 },
    { level: 6, title: 'Sky Maestro', xp: 1800 }
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      current = levels[i];
      next = levels[i + 1] || { level: levels[i].level + 1, title: 'Ultimate Wayfarer', xp: levels[i].xp + 1000 };
    }
  }

  const range = next.xp - current.xp;
  const inLevel = Math.max(0, xp - current.xp);
  const progressPercent = Math.min(100, Math.round((inLevel / range) * 100));

  return {
    level: current.level,
    title: current.title,
    nextLevelXP: next.xp,
    progressPercent
  };
}
