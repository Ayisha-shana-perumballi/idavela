import { CommunityReview, CompletedItinerary } from '../types';

export const INITIAL_COMPLETED_ITINERARIES: CompletedItinerary[] = [
  {
    id: 'itinerary-dxb-zen-tour',
    title: 'Dubai 4h Terminal 3 Zen Garden & Arabic Coffee Tour',
    airportCode: 'DXB',
    destinationCity: 'Dubai',
    durationHours: 4,
    explorationMode: 'airport',
    estimatedBudgetINR: 1200,
    completedAt: '2026-10-08T14:30:00Z',
    activityCount: 3,
    activityTitles: [
      'Zen Gardens Terminal 3 Concourse B',
      'Arabic Gahwa & Medjool Dates Tasting',
      'Dubai Duty Free Gold Souk Walk'
    ]
  },
  {
    id: 'itinerary-cok-solar-heritage',
    title: 'Kochi 5h Solar Green Canopy & Malabar Chai Trail',
    airportCode: 'COK',
    destinationCity: 'Kochi',
    durationHours: 5,
    explorationMode: 'airport',
    estimatedBudgetINR: 800,
    completedAt: '2026-10-06T11:00:00Z',
    activityCount: 3,
    activityTitles: [
      'CIAL 100% Solar Farm Observation Deck',
      'Traditional Pazham Pori & Sulaimani Chai',
      'Kerala Spices & Cashew Emporium'
    ]
  },
  {
    id: 'itinerary-sin-jewel-canopy',
    title: 'Singapore 5h Jewel Rain Vortex & Forest Valley Quest',
    airportCode: 'SIN',
    destinationCity: 'Singapore',
    durationHours: 5,
    explorationMode: 'airport',
    estimatedBudgetINR: 1500,
    completedAt: '2026-10-04T18:15:00Z',
    activityCount: 4,
    activityTitles: [
      'HSBC Rain Vortex 40m Waterfall',
      'Shiseido Forest Valley Walking Trails',
      'Ya Kun Kaya Toast & Onsen Egg Breakfast',
      'Canopy Bridge Glass Skywalk'
    ]
  }
];

export const INITIAL_COMMUNITY_REVIEWS: CommunityReview[] = [
  {
    id: 'rev-dxb-01',
    itineraryId: 'itinerary-dxb-zen-tour',
    itineraryTitle: 'Dubai 4h Terminal 3 Zen Garden & Arabic Coffee Tour',
    airportCode: 'DXB',
    destinationCity: 'Dubai',
    authorName: 'Rohan Mehra',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Level 4 Sky Voyager',
    rating: 5,
    actualSpendingINR: 850,
    estimatedBudgetINR: 1200,
    durationHours: 4,
    timingAccuracy: 'ahead_of_time',
    favouriteActivities: ['Zen Gardens Terminal 3 Concourse B', 'Arabic Gahwa & Medjool Dates'],
    tips: 'Terminal 3 is massive! If your arrival gate is in Concourse A, hop directly on the automated people mover (train) to Concourse B. The Zen Garden pond is right between gates B7 and B9. It was quiet enough for a 30-min nap on the ergonomic loungers.',
    reviewText: 'Turned a dreaded 4-hour layover into the highlight of my trip to Frankfurt. Having the IDAVELA timeline gave me confidence I would never miss my connecting flight. Saved ₹350 on food by picking the local dates platter instead of expensive burger joints.',
    photos: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-09T08:20:00Z',
    helpfulCount: 34,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  },
  {
    id: 'rev-dxb-02',
    itineraryId: 'itinerary-dxb-burj-metro',
    itineraryTitle: 'Dubai 6h Downtown Burj Khalifa & Dubai Mall Metro Dash',
    airportCode: 'DXB',
    destinationCity: 'Dubai',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Verified Transit Pioneer',
    rating: 5,
    actualSpendingINR: 2400,
    estimatedBudgetINR: 2800,
    durationHours: 6,
    timingAccuracy: 'on_time',
    favouriteActivities: ['Burj Khalifa Lake Boardwalk', 'Dubai Mall Fountain Show', 'Red Line Metro Express'],
    tips: 'Buy a Red Nol card (Zone 2 ticket) straight at Terminal 3 arrivals metro station. Trains run every 4 minutes. Do NOT take taxis at rush hour (5 PM to 7 PM)—traffic on Sheikh Zayed Road is unpredictable, but the metro never jams!',
    reviewText: 'Stepping outside and seeing the Burj Khalifa lit up against the twilight sky with the dancing fountains was magical! We were back at Terminal 3 security with a solid 1h 45m buffer to spare before boarding gate call. Highly recommended if you have 6+ hours.',
    photos: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-07T16:45:00Z',
    helpfulCount: 52,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  },
  {
    id: 'rev-cok-01',
    itineraryId: 'itinerary-cok-solar-heritage',
    itineraryTitle: 'Kochi 5h Solar Green Canopy & Malabar Chai Trail',
    airportCode: 'COK',
    destinationCity: 'Kochi',
    authorName: 'Anand Varma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Kerala Heritage Guide',
    rating: 5,
    actualSpendingINR: 420,
    estimatedBudgetINR: 800,
    durationHours: 5,
    timingAccuracy: 'ahead_of_time',
    favouriteActivities: ['Traditional Pazham Pori & Sulaimani Chai', 'CIAL Solar Farm Deck'],
    tips: 'The airport canopy is 100% solar powered and has an open traditional Kerala timber court. Head to the Kerala Tourism lounge on the mezzanine for free hot cardamom water and authentic banana chips freshly fried in coconut oil.',
    reviewText: 'Best ₹420 I spent all year. The hot Pazham Pori (crispy sweet banana fritters) with black sulaimani tea while watching the sun reflect on 46,000 solar panels was unforgettable. Calming and zero transit stress.',
    photos: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-06T19:30:00Z',
    helpfulCount: 29,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  },
  {
    id: 'rev-sin-01',
    itineraryId: 'itinerary-sin-jewel-canopy',
    itineraryTitle: 'Singapore 5h Jewel Rain Vortex & Forest Valley Quest',
    airportCode: 'SIN',
    destinationCity: 'Singapore',
    authorName: 'Li Wei Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Changi Connoisseur',
    rating: 5,
    actualSpendingINR: 1100,
    estimatedBudgetINR: 1500,
    durationHours: 5,
    timingAccuracy: 'ahead_of_time',
    favouriteActivities: ['HSBC Rain Vortex 40m Waterfall', 'Ya Kun Kaya Toast', 'Canopy Park Sky Net'],
    tips: 'Jewel is landside (outside immigration). Clear passport control (takes only 5 minutes with the automated biometric lanes for most passports) and head to Terminal 1 link bridge. Leave your carry-on roller at the Baggage Storage on Level 1 for SGD $5.',
    reviewText: 'No photo does the Rain Vortex justice. Standing on the Forest Valley trail feeling the mist from the 40-meter indoor waterfall with lush tropical palms all around is jaw-dropping. The Kaya toast set with soft boiled eggs is pure comfort.',
    photos: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-05T12:10:00Z',
    helpfulCount: 68,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  },
  {
    id: 'rev-doh-01',
    itineraryId: 'itinerary-doh-lamp-bear',
    itineraryTitle: 'Doha 4h Lamp Bear & Souq Waqif Cultural Stroll',
    airportCode: 'DOH',
    destinationCity: 'Doha',
    authorName: 'Fatima Al-Mansoor',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Desert Transit Nomad',
    rating: 5,
    actualSpendingINR: 1250,
    estimatedBudgetINR: 1500,
    durationHours: 4,
    timingAccuracy: 'on_time',
    favouriteActivities: ['Giant Lamp Bear Central Node', 'The Orchard Indoor Garden', 'Qatari Karak Tea'],
    tips: 'Try the spicy saffron karak tea from the kiosk next to the yellow Urs Fischer bear. If taking the Gold Line metro to Souq Waqif, check the train timing on the Hamad Airport app—the direct metro station is inside the terminal.',
    reviewText: 'Hamad Airport feels like a museum of contemporary art. Even with just 4 hours, doing the indoor Orchard garden and having cardamom karak was super relaxing. Felt rejuvenated for my connecting 8-hour flight to New York.',
    photos: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-03T21:00:00Z',
    helpfulCount: 41,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  },
  {
    id: 'rev-lhr-01',
    itineraryId: 'itinerary-lhr-windsor-taste',
    itineraryTitle: 'London 6h Heathrow & Windsor Castle Heritage Express',
    airportCode: 'LHR',
    destinationCity: 'London',
    authorName: 'Oliver Twist-Smith',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Global Commuter',
    rating: 4,
    actualSpendingINR: 2850,
    estimatedBudgetINR: 3100,
    durationHours: 6,
    timingAccuracy: 'tight_schedule',
    favouriteActivities: ['Windsor Castle Courtyard', 'Traditional Fish & Chips at Prince of Wales'],
    tips: 'Windsor is only 15 minutes by Uber or bus 8 from Terminal 5! Do not take the train into central London if you have under 7 hours. Windsor is closer, historic, and has virtually zero traffic delays compared to central Piccadilly.',
    reviewText: 'Saw the changing of the guard, ate crispy golden haddock with tartar sauce at a 300-year-old cobblestone pub, and strolled the Long Walk. Tight on the security re-entry line at Terminal 2, but totally worth the adventure!',
    photos: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80'
    ],
    wouldRecommend: true,
    createdAt: '2026-10-02T15:20:00Z',
    helpfulCount: 38,
    userVotedHelpful: false,
    isUserSubmitted: false,
    isDemo: true
  }
];

export const DEMO_PRESET_PHOTOS: { label: string; url: string; city: string }[] = [
  {
    label: 'Dubai Skyline & Burj Khalifa',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    city: 'Dubai'
  },
  {
    label: 'Dubai Zen Garden Lounge',
    url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    city: 'Dubai'
  },
  {
    label: 'Kochi Chinese Fishing Nets & Sunset',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    city: 'Kochi'
  },
  {
    label: 'Kerala Backwaters & Greenery',
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
    city: 'Kochi'
  },
  {
    label: 'Singapore Jewel Rain Vortex',
    url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
    city: 'Singapore'
  },
  {
    label: 'Singapore Canopy Forest Valley',
    url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80',
    city: 'Singapore'
  },
  {
    label: 'Doha Souq Waqif Heritage Alleys',
    url: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&q=80',
    city: 'Doha'
  },
  {
    label: 'London Windsor Castle & Heritage',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    city: 'London'
  }
];
