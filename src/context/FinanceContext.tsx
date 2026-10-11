import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  Commitment, 
  Subscription, 
  SavingsGoal, 
  Transaction, 
  LifeShock, 
  SimulationScenario, 
  SimulationDiff, 
  HealthScoreBreakdown, 
  FinancialRisk, 
  DayForecastPoint 
} from '../types/finance';
import { 
  INITIAL_BUDGET, 
  TOTAL_DAYS, 
  INITIAL_COMMITMENTS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_TRANSACTIONS, 
  LIFE_SHOCKS_POOL 
} from '../data/initialData';
import { 
  calculateCurrentBalance, 
  calculateUpcomingMandatory, 
  calculateUpcomingSubscriptions, 
  calculateLockedSavings, 
  calculateTotalSavings, 
  calculateSafeDailyAllowance, 
  calculateHealthScore, 
  calculateFinancialRisk, 
  generate30DayForecast 
} from '../engine/financeEngine';
import { evaluateSimulation } from '../engine/simulationEngine';
import { getRandomLifeShock } from '../engine/lifeEventsEngine';

interface FinanceContextType {
  currentDay: number;
  totalDays: number;
  transactions: Transaction[];
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  activeShock: LifeShock | null;
  activeSimulation: SimulationScenario | null;
  simulationDiff: SimulationDiff | null;
  notification: string | null;

  // Computed state
  currentBalance: number;
  upcomingMandatory: number;
  upcomingSubscriptions: number;
  lockedSavings: number;
  totalSavings: number;
  safeDailyAllowance: number;
  healthScore: HealthScoreBreakdown;
  financialRisk: FinancialRisk;
  forecastPoints: DayForecastPoint[];

  // Actions
  advanceDay: () => void;
  jumpToDay: (day: number) => void;
  addTransaction: (tx: { title: string; amount: number; category: any; isImpulse?: boolean; note?: string; emoji?: string }) => void;
  toggleSubscription: (subId: string) => void;
  payCommitmentEarly: (commId: string) => void;
  toggleLockGoal: (goalId: string) => void;
  allocateToGoal: (goalId: string, amount: number) => void;
  withdrawFromGoal: (goalId: string, amount: number) => void;
  triggerLifeShock: (specificShock?: LifeShock) => void;
  resolveLifeShock: (shock: LifeShock, method: 'liquid' | 'emergency_fund') => void;
  dismissShock: () => void;
  setSimulation: (scenario: SimulationScenario | null) => void;
  applySimulationToReality: (scenario: SimulationScenario) => void;
  resetAll: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [commitments, setCommitments] = useState<Commitment[]>(INITIAL_COMMITMENTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [activeShock, setActiveShock] = useState<LifeShock | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationScenario | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Current liquid balance
  const currentBalance = useMemo(() => {
    return calculateCurrentBalance(transactions);
  }, [transactions]);

  // 2. Upcoming mandatory & subscriptions
  const upcomingMandatory = useMemo(() => {
    return calculateUpcomingMandatory(commitments, currentDay);
  }, [commitments, currentDay]);

  const upcomingSubscriptions = useMemo(() => {
    return calculateUpcomingSubscriptions(subscriptions, currentDay);
  }, [subscriptions, currentDay]);

  // 3. Savings
  const lockedSavings = useMemo(() => {
    return calculateLockedSavings(savingsGoals);
  }, [savingsGoals]);

  const totalSavings = useMemo(() => {
    return calculateTotalSavings(savingsGoals);
  }, [savingsGoals]);

  // 4. Safe-to-Spend Daily Allowance
  const safeDailyAllowance = useMemo(() => {
    return calculateSafeDailyAllowance(
      currentBalance,
      upcomingMandatory + upcomingSubscriptions,
      lockedSavings,
      currentDay
    );
  }, [currentBalance, upcomingMandatory, upcomingSubscriptions, lockedSavings, currentDay]);

  // 5. Recent daily spend (average of last 3 days or today's spend)
  const recentDailySpend = useMemo(() => {
    const todayExpenses = transactions
      .filter(t => t.day === currentDay && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return todayExpenses || 280;
  }, [transactions, currentDay]);

  // 6. Financial Health Score
  const healthScore = useMemo(() => {
    return calculateHealthScore(
      currentBalance,
      currentDay,
      safeDailyAllowance,
      recentDailySpend,
      upcomingMandatory + upcomingSubscriptions,
      savingsGoals
    );
  }, [currentBalance, currentDay, safeDailyAllowance, recentDailySpend, upcomingMandatory, upcomingSubscriptions, savingsGoals]);

  // 7. Financial Risk
  const financialRisk = useMemo(() => {
    return calculateFinancialRisk(
      currentBalance,
      upcomingMandatory + upcomingSubscriptions,
      safeDailyAllowance,
      currentDay
    );
  }, [currentBalance, upcomingMandatory, upcomingSubscriptions, safeDailyAllowance, currentDay]);

  // 8. 30-Day Forecast Points
  const forecastPoints = useMemo(() => {
    return generate30DayForecast(
      currentDay,
      currentBalance,
      commitments,
      subscriptions,
      safeDailyAllowance,
      activeSimulation
    );
  }, [currentDay, currentBalance, commitments, subscriptions, safeDailyAllowance, activeSimulation]);

  // 9. Simulation Diff evaluation
  const simulationDiff = useMemo(() => {
    if (!activeSimulation) return null;
    return evaluateSimulation(
      activeSimulation,
      currentDay,
      currentBalance,
      commitments,
      subscriptions,
      savingsGoals,
      recentDailySpend
    );
  }, [activeSimulation, currentDay, currentBalance, commitments, subscriptions, savingsGoals, recentDailySpend]);

  // Advance Day Handler
  const advanceDay = () => {
    if (currentDay >= TOTAL_DAYS) {
      showNotification('🎉 Month complete! You have reached Day 30.');
      return;
    }

    const nextDay = currentDay + 1;
    setCurrentDay(nextDay);

    // Auto-process mandatory bills due on nextDay
    const dueBills = commitments.filter(c => c.dueDay === nextDay && !c.isPaid);
    const dueSubs = subscriptions.filter(s => s.billingDay === nextDay && s.isActive);

    const newTransactions: Transaction[] = [];

    if (dueBills.length > 0) {
      dueBills.forEach(b => {
        newTransactions.push({
          id: `tx-bill-${b.id}-${nextDay}`,
          title: `[Auto-Debit] ${b.title}`,
          amount: b.amount,
          day: nextDay,
          type: 'commitment',
          category: b.category,
          note: 'Scheduled mandatory bill cleared on due date',
          emoji: '🏛️'
        });
      });

      setCommitments(prev => prev.map(c => 
        c.dueDay === nextDay ? { ...c, isPaid: true, paidOnDay: nextDay } : c
      ));
    }

    if (dueSubs.length > 0) {
      dueSubs.forEach(s => {
        newTransactions.push({
          id: `tx-sub-${s.id}-${nextDay}`,
          title: `[Auto-Debit] ${s.title}`,
          amount: s.amount,
          day: nextDay,
          type: 'subscription',
          category: s.category,
          note: 'Active subscription monthly renewal billed',
          emoji: s.emoji
        });
      });
    }

    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
      showNotification(`⚡ Day ${nextDay}: ${newTransactions.length} scheduled auto-debit(s) processed.`);
    } else {
      showNotification(`🗓️ Advanced to Day ${nextDay}. Safe allowance updated.`);
    }
  };

  const jumpToDay = (targetDay: number) => {
    if (targetDay < 1 || targetDay > TOTAL_DAYS) return;
    setCurrentDay(targetDay);
  };

  const addTransaction = (tx: { title: string; amount: number; category: any; isImpulse?: boolean; note?: string; emoji?: string }) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: tx.title,
      amount: tx.amount,
      day: currentDay,
      type: 'expense',
      category: tx.category,
      isImpulse: tx.isImpulse,
      note: tx.note,
      emoji: tx.emoji || '💸'
    };

    setTransactions(prev => [...prev, newTx]);
    showNotification(`Added expense: ${tx.title} (-₹${tx.amount})`);
  };

  const toggleSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const nextState = !s.isActive;
        showNotification(nextState ? `Re-activated ${s.title}` : `Paused ${s.title} (+₹${s.amount}/mo saved)`);
        return { ...s, isActive: nextState };
      }
      return s;
    }));
  };

  const payCommitmentEarly = (commId: string) => {
    const target = commitments.find(c => c.id === commId);
    if (!target || target.isPaid) return;

    if (currentBalance < target.amount) {
      showNotification(`⚠️ Insufficient liquid balance to pay ₹${target.amount} early.`);
      return;
    }

    setCommitments(prev => prev.map(c => 
      c.id === commId ? { ...c, isPaid: true, paidOnDay: currentDay } : c
    ));

    const newTx: Transaction = {
      id: `tx-early-${commId}`,
      title: `[Early Pay] ${target.title}`,
      amount: target.amount,
      day: currentDay,
      type: 'commitment',
      category: target.category,
      note: 'Paid early to secure commitment ahead of schedule',
      emoji: '✅'
    };

    setTransactions(prev => [...prev, newTx]);
    showNotification(`Cleared ${target.title} early (-₹${target.amount})`);
  };

  const toggleLockGoal = (goalId: string) => {
    setSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextLocked = !g.isLocked;
        showNotification(nextLocked ? `🔒 Locked ${g.title}` : `🔓 Unlocked ${g.title}`);
        return { ...g, isLocked: nextLocked };
      }
      return g;
    }));
  };

  const allocateToGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    if (currentBalance < amount) {
      showNotification(`⚠️ Insufficient balance to allocate ₹${amount}.`);
      return;
    }

    setSavingsGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
    ));

    const targetGoal = savingsGoals.find(g => g.id === goalId);
    const newTx: Transaction = {
      id: `tx-goal-${Date.now()}`,
      title: `Saved to ${targetGoal?.title || 'Goal'}`,
      amount,
      day: currentDay,
      type: 'savings_transfer',
      category: 'savings',
      note: 'Allocated to micro-savings reserve',
      emoji: targetGoal?.emoji || '🎯'
    };

    setTransactions(prev => [...prev, newTx]);
    showNotification(`Allocated ₹${amount} to ${targetGoal?.title}!`);
  };

  const withdrawFromGoal = (goalId: string, amount: number) => {
    const targetGoal = savingsGoals.find(g => g.id === goalId);
    if (!targetGoal) return;
    if (targetGoal.currentAmount < amount) {
      showNotification(`⚠️ Goal only has ₹${targetGoal.currentAmount} available.`);
      return;
    }

    setSavingsGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, currentAmount: g.currentAmount - amount } : g
    ));

    const newTx: Transaction = {
      id: `tx-withdraw-${Date.now()}`,
      title: `Withdrawn from ${targetGoal.title}`,
      amount,
      day: currentDay,
      type: 'income',
      category: 'savings',
      note: 'Emergency withdrawal back to liquid balance',
      emoji: '↩️'
    };

    setTransactions(prev => [...prev, newTx]);
    showNotification(`Withdrew ₹${amount} from ${targetGoal.title} to liquid balance.`);
  };

  const triggerLifeShock = (specificShock?: LifeShock) => {
    const shock = specificShock || getRandomLifeShock();
    setActiveShock(shock);
  };

  const dismissShock = () => {
    setActiveShock(null);
  };

  const resolveLifeShock = (shock: LifeShock, method: 'liquid' | 'emergency_fund') => {
    if (method === 'emergency_fund') {
      const emergencyGoal = savingsGoals.find(g => g.id === 'goal-3');
      const amountFromFund = Math.min(shock.amount, emergencyGoal ? emergencyGoal.currentAmount : 0);
      const remainingLiquid = shock.amount - amountFromFund;

      if (amountFromFund > 0) {
        setSavingsGoals(prev => prev.map(g => 
          g.id === 'goal-3' ? { ...g, currentAmount: Math.max(0, g.currentAmount - amountFromFund) } : g
        ));
      }

      const newTx: Transaction = {
        id: `tx-shock-${Date.now()}`,
        title: `[Life Shock] ${shock.title}`,
        amount: shock.amount,
        day: currentDay,
        type: 'shock',
        category: shock.category,
        note: `Covered with ₹${amountFromFund} from Emergency Cushion & ₹${remainingLiquid} liquid cash.`,
        emoji: shock.emoji
      };
      setTransactions(prev => [...prev, newTx]);
    } else {
      const newTx: Transaction = {
        id: `tx-shock-${Date.now()}`,
        title: `[Life Shock] ${shock.title}`,
        amount: shock.amount,
        day: currentDay,
        type: 'shock',
        category: shock.category,
        note: 'Absorbed directly from operating liquid balance.',
        emoji: shock.emoji
      };
      setTransactions(prev => [...prev, newTx]);
    }

    setActiveShock(null);
    showNotification(`⚡ Life shock handled: ${shock.title} (-₹${shock.amount})`);
  };

  const applySimulationToReality = (scenario: SimulationScenario) => {
    if (scenario.type === 'expense') {
      addTransaction({
        title: scenario.title,
        amount: scenario.amount,
        category: scenario.category,
        note: 'Committed from What-If Simulator',
        emoji: '💡'
      });
    } else if (scenario.type === 'income') {
      const newTx: Transaction = {
        id: `tx-sim-inc-${Date.now()}`,
        title: scenario.title,
        amount: scenario.amount,
        day: currentDay,
        type: 'income',
        category: 'income',
        note: 'Income logged from What-If Simulator',
        emoji: '💸'
      };
      setTransactions(prev => [...prev, newTx]);
    } else if (scenario.type === 'cancel_subscription') {
      // Pause active subscriptions
      setSubscriptions(prev => prev.map(s => ({ ...s, isActive: false })));
      showNotification('Paused subscriptions from simulation plan.');
    }

    setActiveSimulation(null);
    showNotification(`✅ Simulated decision applied to your live finances!`);
  };

  const resetAll = () => {
    setCurrentDay(1);
    setTransactions(INITIAL_TRANSACTIONS);
    setCommitments(INITIAL_COMMITMENTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setActiveShock(null);
    setActiveSimulation(null);
    showNotification('🔄 Reset budget back to Day 1 with fresh ₹10,000 allowance.');
  };

  return (
    <FinanceContext.Provider
      value={{
        currentDay,
        totalDays: TOTAL_DAYS,
        transactions,
        commitments,
        subscriptions,
        savingsGoals,
        activeShock,
        activeSimulation,
        simulationDiff,
        notification,
        currentBalance,
        upcomingMandatory,
        upcomingSubscriptions,
        lockedSavings,
        totalSavings,
        safeDailyAllowance,
        healthScore,
        financialRisk,
        forecastPoints,
        advanceDay,
        jumpToDay,
        addTransaction,
        toggleSubscription,
        payCommitmentEarly,
        toggleLockGoal,
        allocateToGoal,
        withdrawFromGoal,
        triggerLifeShock,
        resolveLifeShock,
        dismissShock,
        setSimulation: setActiveSimulation,
        applySimulationToReality,
        resetAll
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
