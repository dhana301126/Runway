export type ExpenseCategory = 
  | 'food' 
  | 'entertainment' 
  | 'transport' 
  | 'shopping' 
  | 'commitments' 
  | 'subscriptions' 
  | 'emergency' 
  | 'income'
  | 'savings';

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueDay: number;
  isMandatory: boolean;
  isPaid: boolean;
  paidOnDay?: number;
  category: ExpenseCategory;
  description: string;
}

export interface Subscription {
  id: string;
  title: string;
  amount: number;
  billingDay: number;
  isActive: boolean;
  category: ExpenseCategory;
  emoji: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  isLocked: boolean;
  emoji: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  day: number;
  type: 'expense' | 'income' | 'shock' | 'commitment' | 'subscription' | 'savings_transfer';
  category: ExpenseCategory;
  isImpulse?: boolean;
  note?: string;
  emoji?: string;
}

export interface LifeShock {
  id: string;
  title: string;
  description: string;
  amount: number;
  severity: 'mild' | 'moderate' | 'severe';
  emoji: string;
  category: ExpenseCategory;
}

export interface HealthScoreBreakdown {
  burnRateScore: number;         // Max 30: actual spend pacing vs allowance
  commitmentCoverageScore: number; // Max 25: ability to cover upcoming mandatory bills
  runwayScore: number;            // Max 25: projected end of month balance
  savingsScore: number;           // Max 20: savings ratio & preservation
  totalScore: number;             // Max 100
  tier: 'GOD_TIER' | 'VIBING' | 'EDGE' | 'DANGER';
  badgeTitle: string;
  badgeEmoji: string;
  themeColor: string;
  verdict: string;
}

export interface FinancialRisk {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  color: string;
  projectedInsolvencyDay: number | null; // null if survives 30 days
  maxShockAbsorbable: number;
  burnPacing: 'FRUGAL' | 'ON_TRACK' | 'OVERHEATED' | 'BURNING_CASH';
  summary: string;
}

export interface DayForecastPoint {
  day: number;
  baselineBalance: number;
  simulatedBalance?: number;
  mandatoryBillsDue: number;
  subscriptionsDue: number;
  safeDailyAllowance: number;
}

export interface SimulationScenario {
  id: string;
  title: string;
  type: 'expense' | 'income' | 'cancel_subscription' | 'reallocate_savings';
  amount: number;
  day: number;
  category: ExpenseCategory;
  description: string;
  targetSubscriptionId?: string;
  targetGoalId?: string;
}

export interface SimulationDiff {
  scenario: SimulationScenario;
  baselineDay30Balance: number;
  simulatedDay30Balance: number;
  balanceDelta: number;
  
  baselineDailyAllowance: number;
  simulatedDailyAllowance: number;
  dailyAllowanceDelta: number;

  baselineHealthScore: number;
  simulatedHealthScore: number;
  healthScoreDelta: number;

  baselineRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  simulatedRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

  insolvencyDayChange: {
    baseline: number | null;
    simulated: number | null;
  };

  goalImpactText: string;
  verdict: {
    rating: 'GOAT_MOVE' | 'SAFE_FLEX' | 'PROCEED_WITH_CAUTION' | 'INSTANT_REGRET';
    title: string;
    advice: string;
    badgeEmoji: string;
    pillClass: string;
  };
}
