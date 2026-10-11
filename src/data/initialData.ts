import { Commitment, Subscription, SavingsGoal, LifeShock, SimulationScenario, Transaction } from '../types/finance';

export const INITIAL_BUDGET = 10000;
export const TOTAL_DAYS = 30;

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'comm-1',
    title: 'PG Rent & Maintenance',
    amount: 3200,
    dueDay: 5,
    isMandatory: true,
    isPaid: false,
    category: 'commitments',
    description: 'Non-negotiable accommodation share. Landlord sends reminder on Day 3.'
  },
  {
    id: 'comm-2',
    title: 'High-Speed Wi-Fi & Power Share',
    amount: 600,
    dueDay: 10,
    isMandatory: true,
    isPaid: false,
    category: 'commitments',
    description: 'Broadband connection for remote college classes & project submissions.'
  },
  {
    id: 'comm-3',
    title: '5G Mobile Unlimited Data Plan',
    amount: 399,
    dueDay: 16,
    isMandatory: true,
    isPaid: false,
    category: 'commitments',
    description: 'Monthly telecom recharge with 2GB/day data buffer.'
  },
  {
    id: 'comm-4',
    title: 'College Mess / Tiffin Cook Bill',
    amount: 1500,
    dueDay: 22,
    isMandatory: true,
    isPaid: false,
    category: 'commitments',
    description: 'Lunch & dinner subscription package for the entire month.'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    title: 'Spotify Premium Student',
    amount: 119,
    billingDay: 8,
    isActive: true,
    category: 'subscriptions',
    emoji: '🎵'
  },
  {
    id: 'sub-2',
    title: 'Netflix 4K Shared Screen',
    amount: 199,
    billingDay: 14,
    isActive: true,
    category: 'subscriptions',
    emoji: '🎬'
  },
  {
    id: 'sub-3',
    title: 'Local Gym & Fitness Pass',
    amount: 500,
    billingDay: 19,
    isActive: true,
    category: 'subscriptions',
    emoji: '💪'
  },
  {
    id: 'sub-4',
    title: 'Amazon Prime Student',
    amount: 179,
    billingDay: 26,
    isActive: true,
    category: 'subscriptions',
    emoji: '📦'
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Goa Weekend Roadtrip',
    targetAmount: 2000,
    currentAmount: 600,
    isLocked: true,
    emoji: '🌴',
    color: '#8B5CF6'
  },
  {
    id: 'goal-2',
    title: 'ANC Bluetooth Earbuds',
    targetAmount: 1200,
    currentAmount: 300,
    isLocked: false,
    emoji: '🎧',
    color: '#06B6D4'
  },
  {
    id: 'goal-3',
    title: 'Safety Net Buffer',
    targetAmount: 1500,
    currentAmount: 500,
    isLocked: true,
    emoji: '🛡️',
    color: '#10B981'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-0',
    title: 'Monthly Pocket Allowance Inflow',
    amount: 10000,
    day: 1,
    type: 'income',
    category: 'income',
    note: 'Initial ₹10,000 monthly allowance transferred',
    emoji: '💰'
  },
  {
    id: 'tx-1',
    title: 'Hostel Grocery Run & Snacks',
    amount: 280,
    day: 1,
    type: 'expense',
    category: 'food',
    note: 'Eggs, bread, oats, and maggi packets for study nights',
    emoji: '🛒'
  }
];

export const LIFE_SHOCKS_POOL: LifeShock[] = [
  {
    id: 'shock-screen',
    title: 'Phone Screen Shattered!',
    description: 'Slipped out of your hoodie pocket while rushing to morning lecture.',
    amount: 1450,
    severity: 'severe',
    emoji: '📱',
    category: 'emergency'
  },
  {
    id: 'shock-bday',
    title: "Bestie's Birthday Party Contribution",
    description: 'Group dinner at the craft brewery and surprise birthday cake split.',
    amount: 750,
    severity: 'moderate',
    emoji: '🎂',
    category: 'entertainment'
  },
  {
    id: 'shock-puncture',
    title: 'Scooter Puncture & Brake Pad',
    description: 'Flat tyre near highway plus worn-out brake shoes replacement.',
    amount: 450,
    severity: 'mild',
    emoji: '🛵',
    category: 'transport'
  },
  {
    id: 'shock-fever',
    title: 'Sudden Viral Fever & Meds',
    description: 'Doctor consultation fee plus antibiotic strips and hydration electrolytes.',
    amount: 680,
    severity: 'moderate',
    emoji: '💊',
    category: 'emergency'
  },
  {
    id: 'shock-idcard',
    title: 'Lost University ID & Library Card',
    description: 'Re-issue penalty charged by admin block before mid-sem exams.',
    amount: 300,
    severity: 'mild',
    emoji: '🪪',
    category: 'commitments'
  },
  {
    id: 'shock-charger',
    title: 'Laptop Charger Cable Chewed by Cat',
    description: 'Need replacement 65W Type-C fast brick immediately for assignments.',
    amount: 850,
    severity: 'moderate',
    emoji: '🔌',
    category: 'shopping'
  }
];

export const PRESET_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-concert',
    title: '🔥 VIP Concert Ticket Grab',
    type: 'expense',
    amount: 2400,
    day: 12,
    category: 'entertainment',
    description: 'Favorite artist dropped tour tickets; everyone in your group is booking.'
  },
  {
    id: 'sim-swiggy',
    title: '🍔 Late-Night Gourmet Delivery Feast',
    type: 'expense',
    amount: 580,
    day: 7,
    category: 'food',
    description: 'Midnight smash burgers + loaded cheese fries with hostel mates.'
  },
  {
    id: 'sim-freelance',
    title: '⚡ Weekend Figma Freelance Gig',
    type: 'income',
    amount: 1750,
    day: 15,
    category: 'income',
    description: 'Quick landing page design audit for a campus startup.'
  },
  {
    id: 'sim-cancel-ott',
    title: '✂️ Pause Netflix & Gym Passes',
    type: 'cancel_subscription',
    amount: 699,
    day: 14,
    category: 'subscriptions',
    description: 'Temporarily freeze non-essential digital & fitness memberships.'
  },
  {
    id: 'sim-sneakers',
    title: '👟 Flash Sale Hype Sneakers',
    type: 'expense',
    amount: 1999,
    day: 18,
    category: 'shopping',
    description: 'Limited 60% drop on your wishlist kicks, expires in 2 hours.'
  },
  {
    id: 'sim-thrift',
    title: '👕 Weekend Street Thrift Haul',
    type: 'expense',
    amount: 450,
    day: 9,
    category: 'shopping',
    description: 'Vintage oversized jackets & tees from Sunday flea market.'
  }
];
