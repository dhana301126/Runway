import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Target, Lock, Unlock, Plus, ArrowDownLeft } from 'lucide-react';

export const SavingsGoalsCard: React.FC = () => {
  const { 
    savingsGoals, 
    toggleLockGoal, 
    allocateToGoal, 
    withdrawFromGoal, 
    currentBalance 
  } = useFinance();

  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('200');

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Target className="w-4 h-4 text-violet-400" />
            Gen Z Micro-Savings Pots
          </h3>
          <p className="text-xs text-slate-400">
            Locked funds are protected from daily impulse spending calculations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {savingsGoals.map(goal => {
          const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <div 
              key={goal.id}
              className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all relative overflow-hidden"
            >
              {/* Top Row: Emoji, Title, Lock Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{goal.emoji}</span>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {goal.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleLockGoal(goal.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      goal.isLocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                    title={goal.isLocked ? 'Locked (safe from daily burn)' : 'Unlocked (flexible)'}
                  >
                    {goal.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Amount and Target */}
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-lg font-mono font-extrabold text-white">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%`, backgroundColor: goal.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-3">
                  <span>{progressPercent}% Funded</span>
                  <span className={goal.isLocked ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    {goal.isLocked ? '🔒 Protected from burn' : '🔓 Liquid'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => allocateToGoal(goal.id, 100)}
                    disabled={currentBalance < 100}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold border border-slate-700 transition-all disabled:opacity-40"
                  >
                    +₹100
                  </button>
                  <button
                    onClick={() => allocateToGoal(goal.id, 500)}
                    disabled={currentBalance < 500}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold border border-slate-700 transition-all disabled:opacity-40"
                  >
                    +₹500
                  </button>
                </div>

                {goal.currentAmount > 0 && (
                  <button
                    onClick={() => withdrawFromGoal(goal.id, Math.min(200, goal.currentAmount))}
                    className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-semibold border border-rose-500/20 flex items-center gap-0.5 transition-all"
                    title="Withdraw back into operating balance"
                  >
                    <ArrowDownLeft className="w-3 h-3" />
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
