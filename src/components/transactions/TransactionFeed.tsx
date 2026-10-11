import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ListFilter, Plus, Zap, AlertTriangle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionFeedProps {
  onOpenAddExpense: () => void;
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ onOpenAddExpense }) => {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<'all' | 'expense' | 'commitment' | 'shock' | 'income'>('all');

  const filtered = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'expense') return t.type === 'expense';
    if (filter === 'commitment') return t.type === 'commitment' || t.type === 'subscription';
    if (filter === 'shock') return t.type === 'shock';
    if (filter === 'income') return t.type === 'income' || t.type === 'savings_transfer';
    return true;
  }).slice().reverse(); // most recent on top

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-emerald-400" />
            Live Financial Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Chronological audit of debits, auto-pays, side-gigs, and life shocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800 text-[11px]">
            {(['all', 'expense', 'commitment', 'shock'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                  filter === f
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f === 'commitment' ? 'Bills' : f}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddExpense}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-colors"
            title="Add Expense"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No transactions found for this filter.
          </div>
        ) : (
          filtered.map(t => {
            const isIncome = t.type === 'income';
            const isShock = t.type === 'shock';
            const isBill = t.type === 'commitment' || t.type === 'subscription';

            return (
              <div 
                key={t.id}
                className="p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/70 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                    isIncome
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isShock
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isBill
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {t.emoji || '💸'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{t.title}</h4>
                      {t.isImpulse && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Impulse
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono text-slate-300 font-semibold">Day {t.day}</span>
                      <span>•</span>
                      <span className="capitalize">{t.category}</span>
                      {t.note && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1 italic text-slate-500">{t.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-mono font-bold ${
                    isIncome 
                      ? 'text-emerald-400' 
                      : isShock
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}>
                    {isIncome ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
