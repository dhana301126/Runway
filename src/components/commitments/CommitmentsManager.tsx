import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calendar, CheckCircle, Clock, Check, Scissors, AlertCircle } from 'lucide-react';

export const CommitmentsManager: React.FC = () => {
  const { 
    commitments, 
    subscriptions, 
    toggleSubscription, 
    payCommitmentEarly, 
    currentDay, 
    currentBalance 
  } = useFinance();

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            Mandatory Commitments & Subscriptions
          </h3>
          <p className="text-xs text-slate-400">
            Fixed monthly obligations that lock in your liquid cashflow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Mandatory Fixed Bills */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
            <span>Mandatory Bills</span>
            <span className="text-[11px] font-mono text-amber-400">Non-Negotiable</span>
          </div>

          {commitments.map(item => {
            const isDueSoon = !item.isPaid && item.dueDay >= currentDay && item.dueDay <= currentDay + 3;
            const isDueToday = !item.isPaid && item.dueDay === currentDay;

            return (
              <div 
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.isPaid 
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                    : isDueToday
                    ? 'bg-rose-500/10 border-rose-500/50 shadow-md shadow-rose-500/10'
                    : isDueSoon
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {item.title}
                      {item.isPaid && (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Paid D{item.paidOnDay}
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white">₹{item.amount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className={`font-mono text-[10px] ${isDueToday ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                    {item.isPaid ? 'Cleared' : isDueToday ? '🚨 Due Today' : `Due on Day ${item.dueDay}`}
                  </span>

                  {!item.isPaid && (
                    <button
                      onClick={() => payCommitmentEarly(item.id)}
                      disabled={currentBalance < item.amount}
                      className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all disabled:opacity-40"
                    >
                      Pay Early
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Subscriptions Tray */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
            <span>Subscriptions Tray</span>
            <span className="text-[11px] font-mono text-cyan-400">Toggle to Free Cash</span>
          </div>

          {subscriptions.map(sub => (
            <div 
              key={sub.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                sub.isActive 
                  ? 'bg-slate-800/40 border-slate-800' 
                  : 'bg-slate-950/60 border-slate-800/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{sub.emoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {sub.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sub.isActive ? `Auto-debit on Day ${sub.billingDay}` : 'Paused (Zero cost)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold ${sub.isActive ? 'text-white' : 'text-slate-500 line-through'}`}>
                  ₹{sub.amount}
                </span>

                <button
                  onClick={() => toggleSubscription(sub.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                    sub.isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                  }`}
                  title={sub.isActive ? 'Pause subscription to save cash' : 'Resume subscription'}
                >
                  {sub.isActive ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          ))}

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Pausing subscriptions immediately expands your daily safe-to-spend allowance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
