import { Commitment, Subscription, SavingsGoal, Transaction, HealthScoreBreakdown, FinancialRisk, DayForecastPoint, SimulationScenario } from '../types/finance';
import { TOTAL_DAYS } from '../data/initialData';

/**
 * Computes live balance from transaction ledger.
 */
export function calculateCurrentBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, tx) => {
    if (tx.type === 'income') {
      return acc + tx.amount;
    }
    return acc - tx.amount;
  }, 0);
}

/**
 * Computes upcoming commitments due between currentDay and Day 30 that are not yet paid.
 */
export function calculateUpcomingMandatory(commitments: Commitment[], currentDay: number): number {
  return commitments
    .filter(c => !c.isPaid && c.dueDay >= currentDay && c.isMandatory)
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Computes active subscriptions billed between currentDay and Day 30.
 */
export function calculateUpcomingSubscriptions(subscriptions: Subscription[], currentDay: number): number {
  return subscriptions
    .filter(s => s.isActive && s.billingDay >= currentDay)
    .reduce((sum, s) => sum + s.amount, 0);
}

/**
 * Total locked savings that cannot be freely touched.
 */
export function calculateLockedSavings(goals: SavingsGoal[]): number {
  return goals
    .filter(g => g.isLocked)
    .reduce((sum, g) => sum + g.currentAmount, 0);
}

export function calculateTotalSavings(goals: SavingsGoal[]): number {
  return goals.reduce((sum, g) => sum + g.currentAmount, 0);
}

/**
 * Dynamic Safe-to-Spend Daily Allowance:
 * Protects upcoming commitments & locked emergency funds so the user never spends rent money early.
 */
export function calculateSafeDailyAllowance(
  currentBalance: number,
  upcomingCommitments: number,
  lockedSavings: number,
  currentDay: number
): number {
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);
  const uncommittedBuffer = currentBalance - upcomingCommitments - lockedSavings;
  
  if (uncommittedBuffer <= 0) return 0;
  return Math.floor(uncommittedBuffer / daysRemaining);
}

/**
 * Multi-Factor Financial Health Score (0 - 100)
 */
export function calculateHealthScore(
  balance: number,
  currentDay: number,
  safeAllowance: number,
  recentDailySpend: number,
  upcomingObligations: number,
  goals: SavingsGoal[]
): HealthScoreBreakdown {
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);

  // 1. Burn Rate Score (0 - 30 pts)
  let burnRateScore = 30;
  if (safeAllowance > 0) {
    const burnRatio = recentDailySpend / safeAllowance;
    if (burnRatio <= 0.8) {
      burnRateScore = 30;
    } else if (burnRatio <= 1.0) {
      burnRateScore = 26;
    } else if (burnRatio <= 1.3) {
      burnRateScore = 18;
    } else if (burnRatio <= 1.8) {
      burnRateScore = 10;
    } else {
      burnRateScore = 3;
    }
  } else {
    burnRateScore = balance > 0 ? 8 : 0;
  }

  // 2. Commitment Coverage Score (0 - 25 pts)
  let commitmentCoverageScore = 25;
  if (upcomingObligations > 0) {
    const coverageRatio = balance / upcomingObligations;
    if (coverageRatio >= 1.5) {
      commitmentCoverageScore = 25;
    } else if (coverageRatio >= 1.1) {
      commitmentCoverageScore = 21;
    } else if (coverageRatio >= 1.0) {
      commitmentCoverageScore = 16;
    } else if (coverageRatio >= 0.7) {
      commitmentCoverageScore = 9;
    } else {
      commitmentCoverageScore = 2; // high default risk!
    }
  } else {
    commitmentCoverageScore = 25; // All paid
  }

  // 3. Runway & Solvency Score (0 - 25 pts)
  let runwayScore = 25;
  const projectedSpend = safeAllowance * daysRemaining;
  const projectedRemaining = balance - upcomingObligations - projectedSpend;
  
  if (balance < upcomingObligations) {
    runwayScore = 3;
  } else if (projectedRemaining < 0) {
    runwayScore = 8;
  } else if (projectedRemaining < 400) {
    runwayScore = 15;
  } else if (projectedRemaining < 1000) {
    runwayScore = 20;
  } else {
    runwayScore = 25;
  }

  // 4. Savings Resilience Score (0 - 20 pts)
  const totalSaved = calculateTotalSavings(goals);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0) || 1;
  const savingsRatio = totalSaved / totalTarget;
  let savingsScore = Math.min(20, Math.round(savingsRatio * 20));
  // Bonus for locked emergency fund
  const emergencyGoal = goals.find(g => g.id === 'goal-3');
  if (emergencyGoal && emergencyGoal.currentAmount >= 400 && emergencyGoal.isLocked) {
    savingsScore = Math.min(20, savingsScore + 3);
  }

  const totalScore = Math.min(100, Math.max(0, burnRateScore + commitmentCoverageScore + runwayScore + savingsScore));

  let tier: HealthScoreBreakdown['tier'] = 'GOD_TIER';
  let badgeTitle = '👑 God Tier Saver';
  let badgeEmoji = '👑';
  let themeColor = '#10B981'; // emerald
  let verdict = 'Top 5% financial discipline! Smooth sailing to Day 30 with reserves.';

  if (totalScore >= 80) {
    tier = 'GOD_TIER';
    badgeTitle = '👑 God Tier Saver';
    badgeEmoji = '👑';
    themeColor = '#10B981';
    verdict = 'Flawless pacing! Your upcoming rent and bills are fully secured.';
  } else if (totalScore >= 65) {
    tier = 'VIBING';
    badgeTitle = '⚡ Financially Vibing';
    badgeEmoji = '⚡';
    themeColor = '#8B5CF6'; // violet
    verdict = 'Solid cashflow with comfortable headroom. Keep impulse buys in check.';
  } else if (totalScore >= 45) {
    tier = 'EDGE';
    badgeTitle = '⚠️ Living on the Edge';
    badgeEmoji = '⚠️';
    themeColor = '#F59E0B'; // amber
    verdict = 'Tight liquidity! A single sudden bill or Swiggy splurge will jeopardize rent.';
  } else {
    tier = 'DANGER';
    badgeTitle = '💀 Instant Noodles Era';
    badgeEmoji = '💀';
    themeColor = '#F43F5E'; // rose
    verdict = 'High insolvency risk! Upcoming obligations exceed safe cash. Cut non-essentials now.';
  }

  return {
    burnRateScore,
    commitmentCoverageScore,
    runwayScore,
    savingsScore,
    totalScore,
    tier,
    badgeTitle,
    badgeEmoji,
    themeColor,
    verdict
  };
}

/**
 * Calculates Financial Risk Level, Insolvency Day, and Shock Absorption
 */
export function calculateFinancialRisk(
  balance: number,
  upcomingObligations: number,
  safeDailyAllowance: number,
  currentDay: number
): FinancialRisk {
  const maxShockAbsorbable = Math.max(0, balance - upcomingObligations);
  
  // Forecast step-by-step from currentDay to Day 30 to detect insolvency day
  let projectedInsolvencyDay: number | null = null;
  let simulatedCash = balance;
  const daysLeft = TOTAL_DAYS - currentDay + 1;

  // If already underwater against upcoming mandatory commitments
  if (balance < upcomingObligations) {
    projectedInsolvencyDay = currentDay;
  }

  let level: FinancialRisk['level'] = 'LOW';
  let color = '#10B981';
  let summary = 'Safe & solvent through Day 30 with sufficient emergency cushion.';

  if (balance < upcomingObligations) {
    level = 'CRITICAL';
    color = '#F43F5E';
    summary = `Immediate threat: Current liquid balance (₹${balance}) cannot cover upcoming bills (₹${upcomingObligations}).`;
  } else if (maxShockAbsorbable < 300) {
    level = 'HIGH';
    color = '#F59E0B';
    summary = `High fragility: You can only absorb an unexpected expense of ₹${maxShockAbsorbable} without defaulting.`;
  } else if (safeDailyAllowance < 100) {
    level = 'MODERATE';
    color = '#06B6D4';
    summary = `Narrow daily allowance of ₹${safeDailyAllowance}/day. Needs mindful spending to reach Day 30 intact.`;
  } else {
    level = 'LOW';
    color = '#10B981';
    summary = `Healthy buffer: Can easily absorb a surprise ₹${maxShockAbsorbable} expense.`;
  }

  return {
    level,
    color,
    projectedInsolvencyDay,
    maxShockAbsorbable,
    burnPacing: safeDailyAllowance > 180 ? 'FRUGAL' : safeDailyAllowance > 90 ? 'ON_TRACK' : 'OVERHEATED',
    summary
  };
}

/**
 * Generates 30-day forecast curves: Baseline vs Simulated Scenario.
 */
export function generate30DayForecast(
  currentDay: number,
  currentBalance: number,
  commitments: Commitment[],
  subscriptions: Subscription[],
  safeDailyAllowance: number,
  simulatedScenario?: SimulationScenario | null
): DayForecastPoint[] {
  const points: DayForecastPoint[] = [];

  let runningBaselineBalance = currentBalance;
  let runningSimulatedBalance = currentBalance;

  // Calculate forward projections from current day
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    // Scheduled bills on this specific day
    const dayMandatory = commitments
      .filter(c => c.dueDay === day && (day >= currentDay ? !c.isPaid : true))
      .reduce((s, c) => s + c.amount, 0);

    const daySubscriptions = subscriptions
      .filter(s => s.billingDay === day && s.isActive)
      .reduce((s, c) => s + c.amount, 0);

    if (day < currentDay) {
      // Historical approximation up to current day
      points.push({
        day,
        baselineBalance: Math.max(0, currentBalance + (currentDay - day) * 120),
        mandatoryBillsDue: dayMandatory,
        subscriptionsDue: daySubscriptions,
        safeDailyAllowance
      });
    } else if (day === currentDay) {
      points.push({
        day,
        baselineBalance: runningBaselineBalance,
        simulatedBalance: simulatedScenario ? runningSimulatedBalance : undefined,
        mandatoryBillsDue: dayMandatory,
        subscriptionsDue: daySubscriptions,
        safeDailyAllowance
      });
    } else {
      // Future day baseline: deduct daily safe burn + scheduled bills on that day
      runningBaselineBalance -= (safeDailyAllowance + dayMandatory + daySubscriptions);
      
      // Future day simulated:
      if (simulatedScenario) {
        let simAdjustment = 0;
        if (simulatedScenario.day === day) {
          if (simulatedScenario.type === 'income') {
            simAdjustment += simulatedScenario.amount;
          } else if (simulatedScenario.type === 'expense') {
            simAdjustment -= simulatedScenario.amount;
          } else if (simulatedScenario.type === 'cancel_subscription') {
            simAdjustment += simulatedScenario.amount;
          }
        }
        runningSimulatedBalance = runningSimulatedBalance - (safeDailyAllowance + dayMandatory + daySubscriptions) + simAdjustment;
      }

      points.push({
        day,
        baselineBalance: Math.round(runningBaselineBalance),
        simulatedBalance: simulatedScenario ? Math.round(runningSimulatedBalance) : undefined,
        mandatoryBillsDue: dayMandatory,
        subscriptionsDue: daySubscriptions,
        safeDailyAllowance
      });
    }
  }

  return points;
}
