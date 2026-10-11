import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateCurrentBalance, 
  calculateUpcomingMandatory, 
  calculateUpcomingSubscriptions, 
  calculateLockedSavings, 
  calculateSafeDailyAllowance, 
  calculateHealthScore, 
  calculateFinancialRisk, 
  generate30DayForecast 
} from '../src/engine/financeEngine.ts';
import { evaluateSimulation } from '../src/engine/simulationEngine.ts';
import { analyzeShockAbsorption } from '../src/engine/lifeEventsEngine.ts';
import { 
  INITIAL_COMMITMENTS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_TRANSACTIONS, 
  PRESET_SCENARIOS, 
  LIFE_SHOCKS_POOL 
} from '../src/data/initialData.ts';
import { Transaction } from '../src/types/finance.ts';

test('Financial Engine: Calculates starting liquid balance accurately', () => {
  const balance = calculateCurrentBalance(INITIAL_TRANSACTIONS);
  // ₹10,000 allowance - ₹280 grocery = ₹9,720
  assert.equal(balance, 9720);
});

test('Financial Engine: Dynamic Safe-to-Spend Daily Allowance shields rent and locked savings', () => {
  const balance = 9720;
  const upcomingMandatory = calculateUpcomingMandatory(INITIAL_COMMITMENTS, 1);
  const upcomingSubs = calculateUpcomingSubscriptions(INITIAL_SUBSCRIPTIONS, 1);
  const totalUpcoming = upcomingMandatory + upcomingSubs;
  const lockedSavings = calculateLockedSavings(INITIAL_SAVINGS_GOALS);
  
  // Total obligations = ₹5,699 bills + ₹997 subs = ₹6,696
  // Locked savings = ₹600 Goa + ₹500 Emergency = ₹1,100
  // Liquid uncommitted buffer = ₹9,720 - ₹6,696 - ₹1,100 = ₹1,924
  // 30 days remaining -> ₹1,924 / 30 = ~₹64/day
  const safeAllowance = calculateSafeDailyAllowance(balance, totalUpcoming, lockedSavings, 1);
  assert.ok(safeAllowance > 0, 'Safe allowance should be greater than 0');
  assert.equal(safeAllowance, Math.floor((balance - totalUpcoming - lockedSavings) / 30));
});

test('Financial Engine: Overspending dynamically compresses future daily allowance', () => {
  const upcoming = 5000;
  const locked = 1000;
  const allowanceDay1 = calculateSafeDailyAllowance(10000, upcoming, locked, 1); // (10000-6000)/30 = ₹133/day
  
  // User overspends ₹1,000 on Day 1
  const balanceDay2 = 9000;
  const allowanceDay2 = calculateSafeDailyAllowance(balanceDay2, upcoming, locked, 2); // (9000-6000)/29 = ₹103/day
  assert.ok(allowanceDay2 < allowanceDay1, 'Allowance must compress when overspending');
});

test('Financial Engine: Financial Health Score produces valid multi-factor score (0-100)', () => {
  const score = calculateHealthScore(9720, 1, 100, 200, 6000, INITIAL_SAVINGS_GOALS);
  assert.ok(score.totalScore >= 0 && score.totalScore <= 100, 'Score must be between 0 and 100');
  assert.ok(score.tier, 'Score must assign a tier');
  assert.ok(score.badgeTitle, 'Score must include badge title');
});

test('Financial Engine: Financial Risk detects underwater deficit against mandatory bills', () => {
  // If balance is ₹3,000 but upcoming bills are ₹5,000
  const risk = calculateFinancialRisk(3000, 5000, 0, 10);
  assert.equal(risk.level, 'CRITICAL', 'Underwater balance must trigger CRITICAL risk');
  assert.equal(risk.maxShockAbsorbable, 0, 'Shock capacity should be 0');
});

test('Simulation Engine: What-If Sandbox calculates exact deltas for decisions', () => {
  const concertScenario = PRESET_SCENARIOS[0]; // ₹2,400 concert ticket
  const diff = evaluateSimulation(
    concertScenario,
    1,
    9720,
    INITIAL_COMMITMENTS,
    INITIAL_SUBSCRIPTIONS,
    INITIAL_SAVINGS_GOALS,
    280
  );

  assert.ok(diff.balanceDelta < 0, 'Concert expense must reduce Day 30 balance');
  assert.ok(diff.dailyAllowanceDelta <= 0, 'Discretionary spend must reduce daily allowance');
  assert.ok(diff.verdict, 'Must generate Gen Z verdict');
  assert.ok(diff.verdict.rating, 'Must produce rating badge');
});

test('Life Events Engine: Shock resilience evaluates emergency cushion absorption', () => {
  const screenShock = LIFE_SHOCKS_POOL[0]; // ₹1,450 screen crack
  const analysis = analyzeShockAbsorption(screenShock, 500, INITIAL_SAVINGS_GOALS);
  assert.equal(analysis.shock.id, 'shock-screen');
  assert.ok(analysis.strategyExplanation.length > 0, 'Must provide strategy explanation');
});

test('Forecast Engine: 30-Day trajectory generates 30 continuous projection points', () => {
  const forecast = generate30DayForecast(
    1,
    9720,
    INITIAL_COMMITMENTS,
    INITIAL_SUBSCRIPTIONS,
    100,
    null
  );
  assert.equal(forecast.length, 30, 'Forecast must contain 30 points for all days');
  assert.equal(forecast[0].day, 1);
  assert.equal(forecast[29].day, 30);
});
