import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { analyzeShockAbsorption } from '../../engine/lifeEventsEngine';
import { AlertTriangle, ShieldCheck, Wallet, X } from 'lucide-react';

export const LifeHappensModal: React.FC = () => {
  const { 
    activeShock, 
    dismissShock, 
    resolveLifeShock, 
    currentBalance, 
    upcomingMandatory, 
    upcomingSubscriptions, 
    savingsGoals, 
    safeDailyAllowance 
  } = useFinance();

  if (!activeShock) return null;

  const totalObligations = upcomingMandatory + upcomingSubscriptions;
  const liquidUncommitted = Math.max(0, currentBalance - totalObligations);
  
  const analysis = analyzeShockAbsorption(activeShock, liquidUncommitted, savingsGoals);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0D1322] border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Life Happens! Unexpected Shock
            </span>
          </div>
          <button
            onClick={dismissShock}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shock Card Details */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4 flex items-start gap-3.5">
          <div className="text-3xl shrink-0 p-2 rounded-2xl bg-slate-800 border border-slate-700/80">
            {activeShock.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">{activeShock.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                activeShock.severity === 'severe'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {activeShock.severity}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeShock.description}</p>
            <div className="mt-2 text-lg font-mono font-extrabold text-rose-400">
              Cost: ₹{activeShock.amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Resilience Diagnostic Callout */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 mb-5 text-xs">
          <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Financial Resilience Diagnostic:
          </h4>
          <p className="text-slate-300 leading-relaxed font-medium">
            {analysis.strategyExplanation}
          </p>
        </div>

        {/* Decision Handling Options */}
        <div className="space-y-2.5">
          {/* Option A: Liquid */}
          <button
            onClick={() => resolveLifeShock(activeShock, 'liquid')}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-white">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Absorb from Operating Balance</h5>
                <p className="text-[11px] text-slate-400">
                  Protects savings goals. Future daily allowance compresses.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">-₹{activeShock.amount}</span>
          </button>

          {/* Option B: Emergency Fund */}
          <button
            onClick={() => resolveLifeShock(activeShock, 'emergency_fund')}
            disabled={analysis.emergencyFundBalance <= 0}
            className="w-full p-3.5 rounded-2xl bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/30 hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-300">Use Locked Emergency Cushion</h5>
                <p className="text-[11px] text-slate-400">
                  Withdraws up to ₹{analysis.emergencyFundBalance} from cushion to keep daily meals safe.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400">Recommended</span>
          </button>
        </div>
      </div>
    </div>
  );
};
