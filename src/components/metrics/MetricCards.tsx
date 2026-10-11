import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Wallet, Flame, Activity, ShieldAlert, ArrowUpRight, Lock, Info } from 'lucide-react';

interface MetricCardsProps {
  onOpenHealthModal: () => void;
  onOpenSimulator: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ onOpenHealthModal, onOpenSimulator }) => {
  const { 
    currentBalance, 
    upcomingMandatory, 
    upcomingSubscriptions, 
    lockedSavings, 
    safeDailyAllowance, 
    healthScore, 
    financialRisk,
    currentDay,
    totalDays
  } = useFinance();

  const daysLeft = totalDays - currentDay + 1;
  const totalReserved = upcomingMandatory + upcomingSubscriptions + lockedSavings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Liquid Operating Balance */}
      <div className="relative group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 shadow-lg backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            Liquid Balance
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
            ₹10k Baseline
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
            ₹{currentBalance.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
          <span>Reserved: <strong className="text-slate-300">₹{totalReserved.toLocaleString('en-IN')}</strong> for bills & goals</span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Uncommitted Buffer:</span>
          <span className="font-semibold text-emerald-400 font-mono">
            ₹{Math.max(0, currentBalance - totalReserved).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 2. Safe-to-Spend Daily Allowance */}
      <div className="relative group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 shadow-lg backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Safe-to-Spend Daily
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
            safeDailyAllowance >= 180 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : safeDailyAllowance >= 90
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {safeDailyAllowance >= 180 ? 'Comfortable' : safeDailyAllowance >= 90 ? 'Balanced' : 'Tight Squeeze'}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
            ₹{safeDailyAllowance}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ day</span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Guaranteed burn rate across next <strong className="text-slate-300">{daysLeft} days</strong>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Impulse Tolerance:</span>
          <button 
            onClick={onOpenSimulator}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 transition-colors"
          >
            Simulate Spend <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Financial Health Score */}
      <div 
        onClick={onOpenHealthModal}
        className="relative group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            Health Score
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-0.5 group-hover:text-violet-300 transition-colors">
            Breakdown <Info className="w-3 h-3" />
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span 
            className="text-3xl font-extrabold tracking-tight font-sans"
            style={{ color: healthScore.themeColor }}
          >
            {healthScore.totalScore}
          </span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: healthScore.themeColor }}>
          <span>{healthScore.badgeEmoji}</span>
          <span>{healthScore.badgeTitle}</span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${healthScore.totalScore}%`, backgroundColor: healthScore.themeColor }}
            />
          </div>
        </div>
      </div>

      {/* 4. Financial Risk Matrix */}
      <div className="relative group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 shadow-lg backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Financial Risk
          </span>
          <span 
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
            style={{ 
              backgroundColor: `${financialRisk.color}20`, 
              color: financialRisk.color,
              borderColor: `${financialRisk.color}40`
            }}
          >
            {financialRisk.level} RISK
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
            ₹{financialRisk.maxShockAbsorbable.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Shock Buffer</span>
        </div>

        <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
          {financialRisk.summary}
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Insolvency Status:</span>
          <span className="font-semibold text-slate-300">
            {financialRisk.projectedInsolvencyDay ? `Day ${financialRisk.projectedInsolvencyDay} ⚠️` : 'Solvent through Day 30 ✅'}
          </span>
        </div>
      </div>
    </div>
  );
};
