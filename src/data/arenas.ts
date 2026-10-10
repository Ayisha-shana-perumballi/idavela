export interface RoadsideAsset {
  type: 'palm_tree' | 'coconut_palm' | 'avenue_tree' | 'street_lamp' | 'eiffel_lamp' | 'fishing_net' | 'supertree' | 'phone_box';
  color1: string;
  color2: string;
}

export interface ArenaConfig {
  airportCode: string;
  cityName: string;
  countryName: string;
  flag: string;
  title: string;
  terminalSubtitle: string;
  environmentName: string;
  skyColors: [string, string, string]; // [top, mid, horizon]
  sunColor?: string;
  sunPosition?: { xPct: number; yPct: number; radius: number };
  floorColors: [string, string, string]; // [roadFar, roadMid, roadNear]
  shoulderColor: string;
  curbColors: [string, string];
  trackLineColor: string;
  archColor: string;
  fidsTitle: string;
  landmarkType: 'burj_khalifa' | 'jewel_waterfall' | 'lamp_bear' | 'solar_panels_palms' | 'big_ben_clock' | 'petronas_towers' | 'eiffel_tower';
  landmarkName: string;
  roadsideTypeLeft: 'palm_tree' | 'coconut_palm' | 'avenue_tree' | 'street_lamp' | 'fishing_net' | 'supertree' | 'phone_box';
  roadsideTypeRight: 'palm_tree' | 'coconut_palm' | 'avenue_tree' | 'street_lamp' | 'eiffel_lamp' | 'supertree' | 'fishing_net' | 'phone_box';
  snackIcon: string;
  snackName: string;
  snackBoostTitle: string;
  obstacleThemes: {
    lowHurdleName: string;
    overheadSignName: string;
    heavyBarrierName: string;
  };
}

export const ARENA_CONFIGS: Record<string, ArenaConfig> = {
  DXB: {
    airportCode: 'DXB',
    cityName: 'Dubai',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    title: 'Dubai Sheikh Zayed Run',
    terminalSubtitle: 'Burj Khalifa Highway & Terminal 3 Skyway',
    environmentName: 'Dubai Modern Skyline & Desert Highway',
    skyColors: ['#0f172a', '#1e293b', '#d97706'], // midnight blue blending into warm golden desert dusk
    sunColor: '#fbbf24',
    sunPosition: { xPct: 0.72, yPct: 0.32, radius: 24 },
    floorColors: ['#334155', '#1e293b', '#0f172a'],
    shoulderColor: '#d97706', // warm golden desert sand shoulder
    curbColors: ['#f59e0b', '#1e293b'],
    trackLineColor: '#fde047', // bright highway yellow lines
    archColor: '#f59e0b',
    fidsTitle: 'DUBAI HIGHWAY · BURJ KHALIFA EXP · DXB',
    landmarkType: 'burj_khalifa',
    landmarkName: 'Burj Khalifa & Downtown Skyline',
    roadsideTypeLeft: 'palm_tree',
    roadsideTypeRight: 'street_lamp',
    snackIcon: '☕',
    snackName: 'Saffron Karak Chai',
    snackBoostTitle: 'Karak Chai Boost!',
    obstacleThemes: {
      lowHurdleName: 'Desert Highway Barrier',
      overheadSignName: 'E11 Sheikh Zayed Road Sign',
      heavyBarrierName: 'Dubai Police Radar Gate'
    }
  },
  COK: {
    airportCode: 'COK',
    cityName: 'Kochi (Kerala)',
    countryName: 'India',
    flag: '🇮🇳',
    title: 'Kochi Backwaters Coastal Run',
    terminalSubtitle: 'Marine Drive & Chinese Fishing Nets Coast',
    environmentName: 'Kerala Backwaters & Coconut Coast',
    skyColors: ['#064e3b', '#0f766e', '#f97316'], // deep emerald fading into sunset orange backwater
    sunColor: '#ea580c',
    sunPosition: { xPct: 0.28, yPct: 0.34, radius: 26 },
    floorColors: ['#292524', '#1c1917', '#0c0a09'],
    shoulderColor: '#047857', // lush coastal grass & backwater embankment
    curbColors: ['#ffffff', '#dc2626'], // red and white roadside curbs
    trackLineColor: '#ffffff',
    archColor: '#ea580c',
    fidsTitle: 'KOCHI MARINE DRIVE · CHINESE NETS · COK',
    landmarkType: 'solar_panels_palms',
    landmarkName: 'Chinese Fishing Nets & River Palms',
    roadsideTypeLeft: 'coconut_palm',
    roadsideTypeRight: 'fishing_net',
    snackIcon: '🥥',
    snackName: 'Tender Coconut (Karikku)',
    snackBoostTitle: 'Natural Karikku Surge!',
    obstacleThemes: {
      lowHurdleName: 'Wooden Backwater Barrier',
      overheadSignName: 'Marine Drive Walkway Banner',
      heavyBarrierName: 'Kerala Transport Roadblock'
    }
  },
  CDG: {
    airportCode: 'CDG',
    cityName: 'Paris',
    countryName: 'France',
    flag: '🇫🇷',
    title: 'Parisian Boulevard Dash',
    terminalSubtitle: 'Champs-Élysées & Eiffel Tower Vista',
    environmentName: 'Parisian Avenue & Eiffel Tower Boulevard',
    skyColors: ['#1e1b4b', '#312e81', '#ec4899'], // Parisian twilight lavender & rose sunset
    sunColor: '#f472b6',
    sunPosition: { xPct: 0.5, yPct: 0.28, radius: 22 },
    floorColors: ['#374151', '#1f2937', '#111827'],
    shoulderColor: '#6b7280', // stone paved pedestrian sidewalks
    curbColors: ['#e5e7eb', '#374151'],
    trackLineColor: '#f3f4f6',
    archColor: '#38bdf8',
    fidsTitle: 'PARIS BOULEVARD · EIFFEL TOWER EXP · CDG',
    landmarkType: 'eiffel_tower',
    landmarkName: 'Eiffel Tower & Haussmannian Skyline',
    roadsideTypeLeft: 'avenue_tree',
    roadsideTypeRight: 'eiffel_lamp',
    snackIcon: '🥐',
    snackName: 'Warm French Butter Croissant',
    snackBoostTitle: 'Pastry Sugar Rush!',
    obstacleThemes: {
      lowHurdleName: 'Bistro Wooden Barrier',
      overheadSignName: 'Metro Palais Royal Sign',
      heavyBarrierName: 'Paris Police Avenue Barrier'
    }
  },
  SIN: {
    airportCode: 'SIN',
    cityName: 'Singapore',
    countryName: 'Singapore',
    flag: '🇸🇬',
    title: 'Singapore Marina Bay Sprint',
    terminalSubtitle: 'Marina Bay Sands & Gardens by the Bay',
    environmentName: 'Marina Bay Waterfront & Supertree Grove',
    skyColors: ['#064e3b', '#065f46', '#0284c7'],
    sunColor: '#38bdf8',
    sunPosition: { xPct: 0.78, yPct: 0.32, radius: 20 },
    floorColors: ['#0f766e', '#115e59', '#134e4a'],
    shoulderColor: '#059669', // manicured tropical lawns
    curbColors: ['#34d399', '#064e3b'],
    trackLineColor: '#6ee7b7',
    archColor: '#34d399',
    fidsTitle: 'SINGAPORE · MARINA BAY & JEWEL · SIN',
    landmarkType: 'jewel_waterfall',
    landmarkName: 'Marina Bay Sands & Jewel Waterfall',
    roadsideTypeLeft: 'supertree',
    roadsideTypeRight: 'palm_tree',
    snackIcon: '🥪',
    snackName: 'Ya Kun Kaya Toast',
    snackBoostTitle: 'Kaya Sugar Velocity!',
    obstacleThemes: {
      lowHurdleName: 'Marina Bay Boardwalk Rail',
      overheadSignName: 'Gardens by the Bay Sign',
      heavyBarrierName: 'SMRT Transit Barrier'
    }
  },
  LHR: {
    airportCode: 'LHR',
    cityName: 'London',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    title: 'London Westminster River Dash',
    terminalSubtitle: 'Thames Embankment & Big Ben View',
    environmentName: 'Thames Riverside & Big Ben Avenue',
    skyColors: ['#0c4a6e', '#0369a1', '#e0e7ff'],
    sunColor: '#fde047',
    sunPosition: { xPct: 0.25, yPct: 0.3, radius: 22 },
    floorColors: ['#334155', '#1e293b', '#0f172a'],
    shoulderColor: '#475569',
    curbColors: ['#ef4444', '#ffffff'],
    trackLineColor: '#bae6fd',
    archColor: '#ef4444',
    fidsTitle: 'LONDON · THAMES EMBANKMENT · LHR',
    landmarkType: 'big_ben_clock',
    landmarkName: 'Big Ben & London Eye',
    roadsideTypeLeft: 'phone_box',
    roadsideTypeRight: 'street_lamp',
    snackIcon: '🫖',
    snackName: 'British Afternoon Cream Tea',
    snackBoostTitle: 'Royal Earl Grey Sprint!',
    obstacleThemes: {
      lowHurdleName: 'London Underground Stanchion',
      overheadSignName: 'Piccadilly Line Tube Arch',
      heavyBarrierName: 'Metropolitan Police Barrier'
    }
  },
  DOH: {
    airportCode: 'DOH',
    cityName: 'Doha',
    countryName: 'Qatar',
    flag: '🇶🇦',
    title: 'Doha Corniche Coastal Dash',
    terminalSubtitle: 'Doha Corniche & Hamad Concourse',
    environmentName: 'Doha Waterfront Skyline & Desert Coast',
    skyColors: ['#31103f', '#4c1d95', '#f59e0b'],
    sunColor: '#fbbf24',
    sunPosition: { xPct: 0.7, yPct: 0.35, radius: 24 },
    floorColors: ['#3b0764', '#2e1065', '#1e1b4b'],
    shoulderColor: '#b45309',
    curbColors: ['#eab308', '#31103f'],
    trackLineColor: '#c084fc',
    archColor: '#eab308',
    fidsTitle: 'DOHA CORNICHE · HAMAD AIRPORT · DOH',
    landmarkType: 'lamp_bear',
    landmarkName: 'Hamad Lamp Bear & Corniche Towers',
    roadsideTypeLeft: 'palm_tree',
    roadsideTypeRight: 'street_lamp',
    snackIcon: '☕',
    snackName: 'Cardamom Qahwa & Dates',
    snackBoostTitle: 'Cardamom Qahwa Energy!',
    obstacleThemes: {
      lowHurdleName: 'Corniche Marble Barrier',
      overheadSignName: 'Al Corniche Highway Gantry',
      heavyBarrierName: 'Qatar Security Gate'
    }
  },
  KUL: {
    airportCode: 'KUL',
    cityName: 'Kuala Lumpur',
    countryName: 'Malaysia',
    flag: '🇲🇾',
    title: 'KLCC Twin Spire Highway Sprint',
    terminalSubtitle: 'Petronas Towers & Rainforest Skyway',
    environmentName: 'Kuala Lumpur Expressway & Twin Towers',
    skyColors: ['#14532d', '#166534', '#eab308'],
    sunColor: '#facc15',
    sunPosition: { xPct: 0.35, yPct: 0.33, radius: 22 },
    floorColors: ['#3f2c1d', '#271d15', '#1c1917'],
    shoulderColor: '#15803d',
    curbColors: ['#fde047', '#14532d'],
    trackLineColor: '#fde047',
    archColor: '#eab308',
    fidsTitle: 'KUALA LUMPUR · PETRONAS TOWERS · KUL',
    landmarkType: 'petronas_towers',
    landmarkName: 'Petronas Twin Towers Spire',
    roadsideTypeLeft: 'coconut_palm',
    roadsideTypeRight: 'street_lamp',
    snackIcon: '🧋',
    snackName: 'Frothy Pulled Teh Tarik',
    snackBoostTitle: 'Teh Tarik Velocity!',
    obstacleThemes: {
      lowHurdleName: 'Highway Guardrail',
      overheadSignName: 'KLIA Expressway Gantry',
      heavyBarrierName: 'RapidKL Security Gate'
    }
  }
};
