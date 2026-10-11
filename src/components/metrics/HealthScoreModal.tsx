import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Award, CheckCircle2, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({ isOpen, onClose }) => {
  const { healthScore, safeDailyAllowance, upcomingMandatory, currentBalance } = useFinance();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glowing backdrop circle */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: healthScore.themeColor }}
        />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80">
              <Award className="w-5 h-5" style={{ color: healthScore.themeColor }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Financial Health Breakdown</h2>
              <p className="text-xs text-slate-400">Gen Z Multi-Factor Health Algorithm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Header Hero */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Overall Health Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight" style={{ color: healthScore.themeColor }}>
                {healthScore.totalScore}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
            <div className="text-xs font-semibold mt-1" style={{ color: healthScore.themeColor }}>
              {healthScore.badgeEmoji} {healthScore.badgeTitle}
            </div>
          </div>

          <div className="text-right max-w-[200px]">
            <p className="text-xs text-slate-300 font-medium italic">
              "{healthScore.verdict}"
            </p>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="space-y-3.5 mb-6">
          {/* Pillar 1 */}
          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                1. Burn Rate Discipline (Max 30)
              </span>
              <span className="font-mono font-bold text-amber-400">{healthScore.burnRateScore} / 30 pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all" 
                style={{ width: `${(healthScore.burnRateScore / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluates actual spending velocity vs your daily safe allowance of ₹{safeDailyAllowance}/day.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                2. Commitment Coverage (Max 25)
              </span>
              <span className="font-mono font-bold text-emerald-400">{healthScore.commitmentCoverageScore} / 25 pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all" 
                style={{ width: `${(healthScore.commitmentCoverageScore / 25) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Coverage ratio of current balance (₹{currentBalance}) against remaining mandatory bills (₹{upcomingMandatory}).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                3. Cash Runway & Solvency (Max 25)
              </span>
              <span className="font-mono font-bold text-indigo-400">{healthScore.runwayScore} / 25 pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
              <div 
                className="bg-indigo-400 h-full rounded-full transition-all" 
                style={{ width: `${(healthScore.runwayScore / 25) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Projected end-of-month cash buffer on Day 30 after clearing all scheduled debits.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-violet-400" />
                4. Savings Resilience (Max 20)
              </span>
              <span className="font-mono font-bold text-violet-400">{healthScore.savingsScore} / 20 pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
              <div 
                className="bg-violet-400 h-full rounded-full transition-all" 
                style={{ width: `${(healthScore.savingsScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Micro-savings locked into Emergency Cushion and Goa trip funds without raiding reserves.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
};
