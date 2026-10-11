import { 
  Commitment, 
  Subscription, 
  SavingsGoal, 
  SimulationScenario, 
  SimulationDiff, 
  FinancialRisk 
} from '../types/finance';
import { 
  calculateSafeDailyAllowance, 
  calculateHealthScore, 
  calculateFinancialRisk, 
  calculateUpcomingMandatory, 
  calculateUpcomingSubscriptions, 
  calculateLockedSavings 
} from './financeEngine';
import { TOTAL_DAYS } from '../data/initialData';

/**
 * Runs a complete "What-If" sandbox simulation against the current state
 * and returns precise deltas, impact metrics, and Gen Z financial coaching verdicts.
 */
export function evaluateSimulation(
  scenario: SimulationScenario,
  currentDay: number,
  currentBalance: number,
  commitments: Commitment[],
  subscriptions: Subscription[],
  goals: SavingsGoal[],
  recentDailySpend: number
): SimulationDiff {
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);

  // 1. Baseline Calculations
  const baselineMandatory = calculateUpcomingMandatory(commitments, currentDay);
  const baselineSubscriptions = calculateUpcomingSubscriptions(subscriptions, currentDay);
  const baselineObligations = baselineMandatory + baselineSubscriptions;
  const baselineLockedSavings = calculateLockedSavings(goals);

  const baselineDailyAllowance = calculateSafeDailyAllowance(
    currentBalance,
    baselineObligations,
    baselineLockedSavings,
    currentDay
  );

  const baselineHealth = calculateHealthScore(
    currentBalance,
    currentDay,
    baselineDailyAllowance,
    recentDailySpend,
    baselineObligations,
    goals
  );

  const baselineRisk = calculateFinancialRisk(
    currentBalance,
    baselineObligations,
    baselineDailyAllowance,
    currentDay
  );

  // Baseline projected Day 30 balance
  const baselineDay30Balance = Math.max(
    0,
    currentBalance - baselineObligations - (baselineDailyAllowance * (daysRemaining - 1))
  );

  // 2. Simulated State Calculations
  let simulatedBalance = currentBalance;
  let simulatedSubscriptions = [...subscriptions];
  let simulatedObligations = baselineObligations;
  let simulatedLockedSavings = baselineLockedSavings;
  let simulatedGoals = [...goals];

  if (scenario.type === 'expense') {
    simulatedBalance -= scenario.amount;
  } else if (scenario.type === 'income') {
    simulatedBalance += scenario.amount;
  } else if (scenario.type === 'cancel_subscription') {
    // Treat as either immediate saved recurring cost or refund
    simulatedSubscriptions = simulatedSubscriptions.map(s => 
      s.id === scenario.targetSubscriptionId ? { ...s, isActive: false } : s
    );
    simulatedObligations = calculateUpcomingMandatory(commitments, currentDay) + 
      calculateUpcomingSubscriptions(simulatedSubscriptions, currentDay);
    simulatedBalance += scenario.amount; // immediate saved cash flow
  } else if (scenario.type === 'reallocate_savings') {
    simulatedLockedSavings = Math.max(0, simulatedLockedSavings - scenario.amount);
  }

  const simulatedDailyAllowance = calculateSafeDailyAllowance(
    simulatedBalance,
    simulatedObligations,
    simulatedLockedSavings,
    currentDay
  );

  const simulatedHealth = calculateHealthScore(
    simulatedBalance,
    currentDay,
    simulatedDailyAllowance,
    recentDailySpend,
    simulatedObligations,
    simulatedGoals
  );

  const simulatedRisk = calculateFinancialRisk(
    simulatedBalance,
    simulatedObligations,
    simulatedDailyAllowance,
    currentDay
  );

  const simulatedDay30Balance = simulatedBalance - simulatedObligations - (simulatedDailyAllowance * (daysRemaining - 1));

  // 3. Deltas
  const balanceDelta = simulatedDay30Balance - baselineDay30Balance;
  const dailyAllowanceDelta = simulatedDailyAllowance - baselineDailyAllowance;
  const healthScoreDelta = simulatedHealth.totalScore - baselineHealth.totalScore;

  // 4. Goal Impact Analysis
  let goalImpactText = 'No direct impact on your locked savings funds.';
  if (scenario.type === 'expense') {
    if (simulatedDailyAllowance < 80) {
      goalImpactText = '⚠️ May force you to break open your Goa Trip lock fund to cover Week 4 food.';
    } else if (simulatedBalance < baselineObligations) {
      goalImpactText = '🚨 Emergency: Savings buffer wiped out to prevent rent default!';
    } else {
      goalImpactText = '✅ Safe: Goa Trip and Earbuds savings remain untouched.';
    }
  } else if (scenario.type === 'income') {
    goalImpactText = `🚀 You can immediately fund ₹${Math.min(scenario.amount, 1000)} into your Goa Trip fund!`;
  } else if (scenario.type === 'cancel_subscription') {
    goalImpactText = `💡 Reclaims ₹${scenario.amount} per month towards emergency buffer.`;
  }

  // 5. Gen Z Fintech Verdict Engine
  const verdict = generateGenZVerdict(
    scenario,
    simulatedBalance,
    simulatedObligations,
    dailyAllowanceDelta,
    simulatedDailyAllowance,
    healthScoreDelta,
    simulatedRisk.level,
    baselineRisk.level
  );

  return {
    scenario,
    baselineDay30Balance,
    simulatedDay30Balance,
    balanceDelta,
    baselineDailyAllowance,
    simulatedDailyAllowance,
    dailyAllowanceDelta,
    baselineHealthScore: baselineHealth.totalScore,
    simulatedHealthScore: simulatedHealth.totalScore,
    healthScoreDelta,
    baselineRiskLevel: baselineRisk.level,
    simulatedRiskLevel: simulatedRisk.level,
    insolvencyDayChange: {
      baseline: baselineRisk.projectedInsolvencyDay,
      simulated: simulatedRisk.projectedInsolvencyDay
    },
    goalImpactText,
    verdict
  };
}

function generateGenZVerdict(
  scenario: SimulationScenario,
  simulatedBalance: number,
  upcomingObligations: number,
  dailyAllowanceDelta: number,
  newDailyAllowance: number,
  healthScoreDelta: number,
  newRisk: FinancialRisk['level'],
  oldRisk: FinancialRisk['level']
): SimulationDiff['verdict'] {
  // Threat to rent or mandatory bills
  if (simulatedBalance < upcomingObligations) {
    return {
      rating: 'INSTANT_REGRET',
      title: '🚨 Financial Red Alert: Rent in Danger',
      advice: `Dropping ₹${scenario.amount} right now cannibalizes your mandatory bills (₹${upcomingObligations} upcoming). Your landlord will be knocking by Day ${scenario.day}. Do NOT commit this!`,
      badgeEmoji: '💀',
      pillClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };
  }

  // Positive income or savings cut
  if (scenario.type === 'income') {
    return {
      rating: 'GOAT_MOVE',
      title: '👑 Legendary Side-Hustle Flex',
      advice: `Injecting +₹${scenario.amount} boosts your daily allowance by +₹${dailyAllowanceDelta}/day and ramps up your financial health score by +${healthScoreDelta} pts. Massive W.`,
      badgeEmoji: '⚡',
      pillClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
  }

  if (scenario.type === 'cancel_subscription') {
    return {
      rating: 'GOAT_MOVE',
      title: '🧠 Galaxy Brain Cashflow Hack',
      advice: `Cutting inactive subscriptions reclaims ₹${scenario.amount} straight back into your liquid runway. Adds +₹${dailyAllowanceDelta}/day to your guilt-free spending.`,
      badgeEmoji: '✂️',
      pillClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
  }

  // Heavy daily allowance drop
  if (newDailyAllowance < 80) {
    return {
      rating: 'PROCEED_WITH_CAUTION',
      title: '⚠️ Instant Noodles Alert: Brutal Squeeze',
      advice: `This swipe will compress your daily safe-to-spend allowance from normal down to a suffocating ₹${newDailyAllowance}/day. You will have to survive on hostel canteen chai & paratha.`,
      badgeEmoji: '🍜',
      pillClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
  }

  // Moderate dip but still solvent
  if (healthScoreDelta <= -10) {
    return {
      rating: 'PROCEED_WITH_CAUTION',
      title: '🧐 Heavy Impulse Toll (-' + Math.abs(healthScoreDelta) + ' Health Pts)',
      advice: `You can technically afford it without defaulting, but it eats ₹${scenario.amount} of buffer. Try waiting 48 hours to see if you still crave it, or split the cost with a friend.`,
      badgeEmoji: '⚠️',
      pillClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
  }

  // Safe splurge
  return {
    rating: 'SAFE_FLEX',
    title: '✨ Guilt-Free Verified Flex',
    advice: `Your cashflow absorbs this easily! Safe daily allowance remains at ₹${newDailyAllowance}/day and upcoming bills stay 100% funded. Treat yourself.`,
    badgeEmoji: '💅',
    pillClass: 'bg-violet-500/20 text-violet-400 border-violet-500/30'
  };
}
