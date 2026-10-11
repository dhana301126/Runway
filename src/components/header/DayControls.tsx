import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ChevronRight, FastForward, Calendar, AlertCircle } from 'lucide-react';

export const DayControls: React.FC = () => {
  const { currentDay, totalDays, advanceDay, jumpToDay, commitments, subscriptions } = useFinance();

  // Find next upcoming bill
  const nextCommitment = commitments.find(c => !c.isPaid && c.dueDay >= currentDay);
  const nextSubscription = subscriptions.find(s => s.isActive && s.billingDay >= currentDay);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Day Advance Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={advanceDay}
            disabled={currentDay >= totalDays}
            className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Advance to Day {Math.min(totalDays, currentDay + 1)}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => jumpToDay(Math.min(totalDays, currentDay + 3))}
              disabled={currentDay + 3 > totalDays}
              className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700/60 transition-all disabled:opacity-30"
              title="Fast forward 3 days"
            >
              <FastForward className="w-3 h-3 text-emerald-400" />
              +3d
            </button>
            <button
              onClick={() => jumpToDay(Math.min(totalDays, currentDay + 7))}
              disabled={currentDay + 7 > totalDays}
              className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700/60 transition-all disabled:opacity-30"
              title="Fast forward 7 days"
            >
              <FastForward className="w-3 h-3 text-indigo-400" />
              +7d
            </button>
          </div>
        </div>

        {/* Center: Dynamic upcoming obligation warning */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/40 border border-slate-800 rounded-xl px-3.5 py-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          {nextCommitment ? (
            <div>
              <span className="text-slate-400">Next Mandatory: </span>
              <span className="font-semibold text-amber-300">{nextCommitment.title} (₹{nextCommitment.amount})</span>
              <span className="text-slate-400"> due on Day {nextCommitment.dueDay}</span>
              {nextCommitment.dueDay === currentDay && <span className="ml-1.5 text-rose-400 font-bold uppercase text-[10px]">⚠️ DUE TODAY</span>}
            </div>
          ) : nextSubscription ? (
            <div>
              <span className="text-slate-400">Next Auto-debit: </span>
              <span className="font-semibold text-cyan-300">{nextSubscription.title} (₹{nextSubscription.amount})</span>
              <span className="text-slate-400"> on Day {nextSubscription.billingDay}</span>
            </div>
          ) : (
            <span className="text-emerald-400 font-semibold">🎉 All mandatory bills cleared for the rest of the month!</span>
          )}
        </div>

        {/* Right: Quick Day Stepper Grid */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full scrollbar-thin">
          {[1, 5, 10, 15, 20, 25, 30].map(d => {
            const isCurrent = d === currentDay;
            const isPast = d < currentDay;
            return (
              <button
                key={d}
                onClick={() => jumpToDay(d)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  isCurrent 
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30' 
                    : isPast
                    ? 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                }`}
              >
                D{d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
