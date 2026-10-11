import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, RotateCcw, AlertTriangle, Zap } from 'lucide-react';

interface TopNavProps {
  onOpenSimulator: () => void;
  onOpenAddExpense: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSimulator, onOpenAddExpense }) => {
  const { currentDay, totalDays, resetAll, triggerLifeShock, notification } = useFinance();

  const progressPercent = Math.round((currentDay / totalDays) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080C14] rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">₹</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  RupeeFlow <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Gen Z OS</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                ₹10,000 Budget • 30-Day Financial Autopilot
              </p>
            </div>
          </div>

          {/* Mobile quick actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSimulator}
              className="p-2 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulate
            </button>
          </div>
        </div>

        {/* Center: 30-Day Timeline Indicator */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-1.5 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              Day <span className="text-emerald-400 text-sm font-extrabold">{currentDay}</span> of {totalDays}
            </span>
          </div>

          <div className="w-24 md:w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 font-semibold">
            {totalDays - currentDay + 1}d left
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerLifeShock()}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Trigger an unexpected life expense to test resilience"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Test Resilience</span>
            <span className="sm:hidden">Shock</span>
          </button>

          <button
            onClick={onOpenAddExpense}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            + Spend
          </button>

          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            What-If Simulator
          </button>

          <button
            onClick={resetAll}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-all"
            title="Reset month back to Day 1 with ₹10,000"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 animate-bounce transition-all">
          <div className="bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-xl">
            <span>{notification}</span>
          </div>
        </div>
      )}
    </header>
  );
};
