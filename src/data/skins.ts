import { RunnerSkin } from '../types';

export const RUNNER_SKINS: RunnerSkin[] = [
  {
    id: 'skin-default',
    name: 'Concourse Wayfarer',
    priceCoins: 0,
    description: 'Comfortable sky-blue travel hoodie with durable wheeled carry-on bag.',
    icon: '🏃',
    jacketColor: '#0284c7', // sky blue
    pantsColor: '#1e293b', // slate
    bagColor: '#f59e0b', // amber
    hatColor: '#0f172a'
  },
  {
    id: 'skin-business',
    name: 'First Class Executive',
    priceCoins: 50,
    description: 'Tailored charcoal business blazer and sleek leather trolley briefcase.',
    icon: '💼',
    jacketColor: '#334155', // charcoal
    pantsColor: '#0f172a', // deep navy
    bagColor: '#78350f', // rich leather brown
    hatColor: '#475569'
  },
  {
    id: 'skin-nomad',
    name: 'Backpacker Nomad',
    priceCoins: 75,
    description: 'Adventure cargo vest, trekking shorts, and heavy-duty trail pack.',
    icon: '🎒',
    jacketColor: '#16a34a', // emerald green
    pantsColor: '#854d0e', // khaki
    bagColor: '#dc2626', // red trail pack
    hatColor: '#ca8a04' // safari hat
  },
  {
    id: 'skin-captain',
    name: 'Airline Captain',
    priceCoins: 120,
    description: 'Double-breasted captain blazer with gold braid cuffs and pilot visor.',
    icon: '👨‍✈️',
    jacketColor: '#1e1b4b', // midnight pilot navy
    pantsColor: '#0f172a',
    bagColor: '#1e293b',
    hatColor: '#f59e0b' // gold braided visor
  }
];
