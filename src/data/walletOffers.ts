import { TravelOffer } from '../types';

export const WALLET_OFFERS: TravelOffer[] = [
  // --- DUBAI (DXB) OFFERS ---
  {
    id: 'offer-dxb-costa',
    partnerName: 'Costa Coffee Express',
    category: 'cafe',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse B (Near Gate B18)',
    title: '₹20 OFF Barista Coffee & Croissant',
    discountDescription: 'Enjoy ₹20 off any signature handcrafted coffee, cold latte, or freshly baked butter croissant.',
    creditsRequired: 10, // 100 game coins
    originalValueINR: 50,
    expiryHours: 24,
    badgeText: 'BESTSELLER',
    icon: '☕',
    terms: 'Valid at DXB Concourse B & C branches. Show barcode at billing. Cannot be combined with airline vouchers.'
  },
  {
    id: 'offer-dxb-karak',
    partnerName: 'Karak House Concourse',
    category: 'cafe',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse A (Arrivals & Departures)',
    title: 'Free Cardamom Bun with Saffron Chai',
    discountDescription: 'Redeem complimentary warm cardamom glazed bun when ordering aromatic Saffron Karak Tea.',
    creditsRequired: 10, // 100 game coins
    originalValueINR: 45,
    expiryHours: 24,
    badgeText: 'LOCAL FAVORITE',
    icon: '🫖',
    terms: 'Valid at Terminal 3 Karak House counter. Sample partner demonstration voucher.'
  },
  {
    id: 'offer-dxb-paul',
    partnerName: 'Paul French Bakery & Café',
    category: 'dining',
    airportCode: 'DXB',
    location: 'Terminal 3, Departures Level 2',
    title: '₹50 OFF Artisan Sandwich & Soup Combo',
    discountDescription: 'Save ₹50 on freshly prepared French baguette sandwiches, quiches, or soup de jour sets.',
    creditsRequired: 25, // 250 game coins
    originalValueINR: 120,
    expiryHours: 24,
    badgeText: 'GOURMET',
    icon: '🥖',
    terms: 'Valid on orders over ₹300 equivalent. One voucher per party per transit session.'
  },
  {
    id: 'offer-dxb-shakeshack',
    partnerName: 'Shake Shack Concourse',
    category: 'dining',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse A Food Pavilion',
    title: 'Complimentary Crinkle-Cut Fries',
    discountDescription: 'Get a free side of crispy crinkle-cut fries with any ShackBurger or SmokeShack combo.',
    creditsRequired: 20, // 200 game coins
    originalValueINR: 80,
    expiryHours: 24,
    badgeText: 'CRISPY PERK',
    icon: '🍟',
    terms: 'Present digital coupon code to cashier prior to payment.'
  },
  {
    id: 'offer-dxb-dutyfree',
    partnerName: 'Dubai Duty Free Perfumes & Gifts',
    category: 'shopping',
    airportCode: 'DXB',
    location: 'Terminal 1 & 3, Central Duty Free Plaza',
    title: '₹100 OFF Fragrances & Arabian Oudh',
    discountDescription: 'Save ₹100 on designer perfumes, travel miniatures, Arabian oudh oils, and luxury confectionery.',
    creditsRequired: 50, // 500 game coins
    originalValueINR: 250,
    expiryHours: 36,
    badgeText: 'BIG SAVINGS',
    icon: '🎁',
    terms: 'Valid on purchases above ₹1,000 equivalent. Excludes select luxury tobacco and electronics.'
  },
  {
    id: 'offer-dxb-tech',
    partnerName: 'Tech On The Go & Gadgets',
    category: 'shopping',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse B Central Corridor',
    title: '₹30 OFF Universal Travel Adapters',
    discountDescription: 'Get ₹30 off high-speed multi-country travel plugs, braided charging cables, or noise-reduction earplugs.',
    creditsRequired: 15, // 150 game coins
    originalValueINR: 70,
    expiryHours: 24,
    badgeText: 'TECH ESSENTIAL',
    icon: '🔌',
    terms: 'Valid on travel accessories & electronics above ₹250.'
  },
  {
    id: 'offer-dxb-marhaba',
    partnerName: 'Marhaba Transit Lounge Pass',
    category: 'lounge',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse B (Opposite Gate B21)',
    title: '₹150 OFF 3-Hour Lounge Entry with Buffet',
    discountDescription: 'Save ₹150 on full access to quiet relaxation zones, hot gourmet buffet, high-speed Wi-Fi, and hot showers.',
    creditsRequired: 75, // 750 game coins
    originalValueINR: 450,
    expiryHours: 48,
    badgeText: 'PREMIUM COMFORT',
    icon: '🛋️',
    terms: 'Subject to lounge capacity during peak hours (02:00-06:00). Valid for single traveller entrance.'
  },
  {
    id: 'offer-dxb-sleepnfly',
    partnerName: "Sleep 'n Fly Sleep Pods",
    category: 'lounge',
    airportCode: 'DXB',
    location: 'Terminal 3, Concourse A & C',
    title: '₹80 OFF 2-Hour Nap Pod Rental',
    discountDescription: 'Get ₹80 off soundproof Igloo or YAWN cabin nap pods complete with clean fleece blankets and charging ports.',
    creditsRequired: 40, // 400 game coins
    originalValueINR: 200,
    expiryHours: 24,
    badgeText: 'REFRESH & SLEEP',
    icon: '🛏️',
    terms: 'Reservation subject to availability at check-in desk.'
  },
  {
    id: 'offer-dxb-frame',
    partnerName: 'Dubai Frame Layover Fast-Track',
    category: 'attraction',
    airportCode: 'DXB',
    location: 'Zabeel Park, Dubai (25 mins from DXB)',
    title: '₹60 OFF Glass Skydeck Ticket Voucher',
    discountDescription: 'Save ₹60 on skip-the-line entrance to the iconic 150m Dubai Frame panoramic glass skydeck.',
    creditsRequired: 30, // 300 game coins
    originalValueINR: 150,
    expiryHours: 48,
    badgeText: 'CITY ADVENTURE',
    icon: '🖼️',
    terms: 'Only recommended for layovers longer than 5 hours with outside immigration clearance.'
  },

  // --- KOCHI (COK) OFFERS ---
  {
    id: 'offer-cok-coffee',
    partnerName: 'Indian Coffee House Transit',
    category: 'cafe',
    airportCode: 'COK',
    location: 'Domestic & Intl Departure Food Court',
    title: '₹20 OFF Kerala Roast Coffee & Pazham Pori',
    discountDescription: 'Get ₹20 off authentic filter coffee paired with sweet golden banana fritters (Pazham Pori).',
    creditsRequired: 10,
    originalValueINR: 40,
    expiryHours: 24,
    badgeText: 'KERALA FLAVOUR',
    icon: '☕',
    terms: 'Valid at CIAL Terminal 1 & Terminal 3 outlets.'
  },
  {
    id: 'offer-cok-spices',
    partnerName: 'Malabar Heritage Spices & Cashews',
    category: 'shopping',
    airportCode: 'COK',
    location: 'Terminal 3, Concourse Duty Paid Area',
    title: '₹50 OFF Cardamom & Pepper Gift Boxes',
    discountDescription: 'Save ₹50 on certified organic Wayanad pepper, Idukki green cardamom, and honey-roasted cashews.',
    creditsRequired: 25,
    originalValueINR: 100,
    expiryHours: 48,
    badgeText: 'HANDPICKED',
    icon: '🌿',
    terms: 'Valid on purchases above ₹400.'
  },
  {
    id: 'offer-cok-earthlounge',
    partnerName: 'Earth Lounge CIAL',
    category: 'lounge',
    airportCode: 'COK',
    location: 'Terminal 3, Level 2 Intl Departures',
    title: '₹100 OFF Kerala Buffet & Lounge Access',
    discountDescription: 'Save ₹100 on buffet pass with Malabar Biryani, Appam, fresh juices, and serene airstrip vistas.',
    creditsRequired: 50,
    originalValueINR: 250,
    expiryHours: 24,
    badgeText: 'SOLAR AIRPORT',
    icon: '☀️',
    terms: 'Valid for transit passengers at Cochin International Airport.'
  },

  // --- SINGAPORE CHANGI (SIN) OFFERS ---
  {
    id: 'offer-sin-toast',
    partnerName: 'Ya Kun Kaya Toast',
    category: 'cafe',
    airportCode: 'SIN',
    location: 'Terminal 3 & Jewel Changi B2',
    title: '₹25 OFF Signature Kaya Toast & Kopi Set',
    discountDescription: 'Save ₹25 on traditional butter kaya charcoal toast with soft-boiled eggs and fragrant Singapore kopi.',
    creditsRequired: 12,
    originalValueINR: 55,
    expiryHours: 24,
    badgeText: 'HERITAGE TASTE',
    icon: '🍞',
    terms: 'Valid at Changi Terminal 3 departure transit and Jewel outlets.'
  },
  {
    id: 'offer-sin-jewel',
    partnerName: 'Jewel Canopy Park & Sky Bridge',
    category: 'attraction',
    airportCode: 'SIN',
    location: 'Jewel Changi Airport, Level 5',
    title: '₹50 OFF Canopy Bridge Glass Walk Entry',
    discountDescription: 'Get ₹50 off entry to walk across the suspended glass bridge with direct views of the HSBC Rain Vortex.',
    creditsRequired: 25,
    originalValueINR: 120,
    expiryHours: 36,
    badgeText: 'ICONIC JEWEL',
    icon: '🌊',
    terms: 'Valid on Canopy Park individual attraction tickets.'
  },
  {
    id: 'offer-sin-ambassador',
    partnerName: 'Ambassador Transit Lounge',
    category: 'lounge',
    airportCode: 'SIN',
    location: 'Terminal 2 & 3, Mezzanine Level',
    title: '₹120 OFF Transit Nap & Shower Pass',
    discountDescription: 'Save ₹120 on 3-hour lounge amenities including rainfall showers, massage chairs, and Asian noodle bar.',
    creditsRequired: 60,
    originalValueINR: 300,
    expiryHours: 48,
    badgeText: 'AIRSIDE OASIS',
    icon: '🚿',
    terms: 'Located airside. No need to clear immigration.'
  },

  // --- DOHA HAMAD (DOH) OFFERS ---
  {
    id: 'offer-doh-dates',
    partnerName: 'Souq Al Matar Medjool Dates & Sweets',
    category: 'shopping',
    airportCode: 'DOH',
    location: 'Hamad Intl Central Concourse (Near Lamp Bear)',
    title: '₹60 OFF Gourmet Stuffed Dates & Baklava',
    discountDescription: 'Enjoy ₹60 off luxury gift boxes of almond-stuffed Medjool dates and Syrian pistachio baklava.',
    creditsRequired: 30,
    originalValueINR: 140,
    expiryHours: 24,
    badgeText: 'AUTHENTIC QATAR',
    icon: '🌴',
    terms: 'Valid at Hamad Duty Free traditional confectionery boutique.'
  },
  {
    id: 'offer-doh-vitality',
    partnerName: 'Vitality Wellbeing & Fitness Centre',
    category: 'attraction',
    airportCode: 'DOH',
    location: 'Hamad Intl Airport Hotel, South Node',
    title: '₹100 OFF 25m Swimming Pool & Hydrotherapy',
    discountDescription: 'Save ₹100 on admission to the indoor temperature-controlled 25m lap pool, hydrotherapy tub, and gym.',
    creditsRequired: 50,
    originalValueINR: 280,
    expiryHours: 24,
    badgeText: 'WELLNESS RETREAT',
    icon: '🏊',
    terms: 'Complimentary towel and locker included.'
  },

  // --- LONDON HEATHROW (LHR) OFFERS ---
  {
    id: 'offer-lhr-pret',
    partnerName: 'Pret A Manger Heathrow',
    category: 'cafe',
    airportCode: 'LHR',
    location: 'Terminal 2 & 5 Airside Concourse',
    title: '₹30 OFF Organic Flat White & Pret Croissant',
    discountDescription: 'Get ₹30 off organic barista coffee and fresh all-butter French croissant or warm toastie.',
    creditsRequired: 15,
    originalValueINR: 65,
    expiryHours: 24,
    badgeText: 'BRITISH CLASSIC',
    icon: '☕',
    terms: 'Valid across LHR airside Pret locations.'
  },
  {
    id: 'offer-lhr-harrods',
    partnerName: 'Harrods Signature Transit Boutique',
    category: 'shopping',
    airportCode: 'LHR',
    location: 'Terminal 5 Central Departures',
    title: '₹100 OFF English Afternoon Tea & Shortbread',
    discountDescription: 'Save ₹100 on iconic green Harrods loose leaf tea tins, royal blend teas, and butter shortbread biscuits.',
    creditsRequired: 50,
    originalValueINR: 220,
    expiryHours: 36,
    badgeText: 'ROYAL HERITAGE',
    icon: '👑',
    terms: 'Valid on Harrods branded pantry and gift items.'
  }
];

export const INITIAL_WALLET_TRANSACTIONS = [
  {
    id: 'tx-welcome-01',
    type: 'bonus' as const,
    coinsDelta: 0,
    creditsDelta: 10,
    description: 'Welcome Layover Explorer Bonus (+₹10 Demo Credits)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    partnerName: 'IDAVELA Welcome Perk'
  }
];
