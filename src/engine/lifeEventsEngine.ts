import { LifeShock, SavingsGoal } from '../types/finance';
import { LIFE_SHOCKS_POOL } from '../data/initialData';

export interface ShockAbsorptionAnalysis {
  shock: LifeShock;
  canAbsorbLiquid: boolean;
  canAbsorbWithEmergencyFund: boolean;
  liquidShortfall: number;
  emergencyFundBalance: number;
  suggestedAction: 'ABSORB_LIQUID' | 'USE_EMERGENCY_FUND' | 'PARTIAL_SPLIT_AND_CUT';
  strategyExplanation: string;
}

export function analyzeShockAbsorption(
  shock: LifeShock,
  liquidUncommitted: number,
  goals: SavingsGoal[]
): ShockAbsorptionAnalysis {
  const emergencyGoal = goals.find(g => g.id === 'goal-3');
  const emergencyFundBalance = emergencyGoal ? emergencyGoal.currentAmount : 0;

  const canAbsorbLiquid = liquidUncommitted >= shock.amount;
  const canAbsorbWithEmergencyFund = (liquidUncommitted + emergencyFundBalance) >= shock.amount;
  const liquidShortfall = Math.max(0, shock.amount - liquidUncommitted);

  let suggestedAction: ShockAbsorptionAnalysis['suggestedAction'] = 'ABSORB_LIQUID';
  let strategyExplanation = '';

  if (canAbsorbLiquid) {
    suggestedAction = 'ABSORB_LIQUID';
    strategyExplanation = `You have ₹${liquidUncommitted} uncommitted cash. You can take this hit directly from your operating balance without breaking savings or missing rent.`;
  } else if (canAbsorbWithEmergencyFund) {
    suggestedAction = 'USE_EMERGENCY_FUND';
    strategyExplanation = `Liquid cash is tight (₹${liquidUncommitted}), but your locked Emergency Cushion has ₹${emergencyFundBalance}. Use ₹${shock.amount - liquidUncommitted} from the emergency fund to protect your rent and daily meals!`;
  } else {
    suggestedAction = 'PARTIAL_SPLIT_AND_CUT';
    strategyExplanation = `Total available buffer (liquid + emergency) is only ₹${liquidUncommitted + emergencyFundBalance}, leaving a ₹${shock.amount - (liquidUncommitted + emergencyFundBalance)} deficit. You must pause subscriptions and postpone non-essential spends immediately.`;
  }

  return {
    shock,
    canAbsorbLiquid,
    canAbsorbWithEmergencyFund,
    liquidShortfall,
    emergencyFundBalance,
    suggestedAction,
    strategyExplanation
  };
}

export function getRandomLifeShock(excludeIds: string[] = []): LifeShock {
  const available = LIFE_SHOCKS_POOL.filter(s => !excludeIds.includes(s.id));
  const pool = available.length > 0 ? available : LIFE_SHOCKS_POOL;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
