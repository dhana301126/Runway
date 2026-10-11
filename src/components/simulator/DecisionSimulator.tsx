import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PRESET_SCENARIOS } from '../../data/initialData';
import { SimulationScenario } from '../../types/finance';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  PlusCircle, 
  Flame 
} from 'lucide-react';

interface DecisionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({ isOpen, onClose }) => {
  const { 
    activeSimulation, 
    simulationDiff, 
    setSimulation, 
    applySimulationToReality, 
    currentDay 
  } = useFinance();

  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customType, setCustomType] = useState<'expense' | 'income'>('expense');
  const [customCategory, setCustomCategory] = useState<any>('entertainment');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: SimulationScenario) => {
    setSimulation(preset);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(customAmount);
    if (!customTitle || isNaN(amountNum) || amountNum <= 0) return;

    const customScenario: SimulationScenario = {
      id: `custom-sim-${Date.now()}`,
      title: customTitle,
      type: customType,
      amount: amountNum,
      day: currentDay,
      category: customCategory,
      description: `Simulated custom ${customType} on Day ${currentDay}`
    };

    setSimulation(customScenario);
    setShowCustomForm(false);
  };

  const handleCommit = () => {
    if (!activeSimulation) return;
    applySimulationToReality(activeSimulation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Glow accent */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-lg shadow-violet-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                What-If Decision Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Test financial moves before spending. Experience consequences with zero real-life risk.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Scenarios Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choose a Gen Z Financial Scenario to Test:
            </label>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {showCustomForm ? 'Close Custom Builder' : '+ Build Custom Scenario'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {PRESET_SCENARIOS.map(preset => {
              const isSelected = activeSimulation?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 shadow-md shadow-violet-600/20'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-white leading-tight">
                      {preset.title}
                    </span>
                    <span className={`text-[11px] font-mono font-bold shrink-0 ${
                      preset.type === 'income' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {preset.type === 'income' ? '+' : '-'}₹{preset.amount}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Scenario Builder Drawer/Form */}
        {showCustomForm && (
          <form 
            onSubmit={handleApplyCustom} 
            className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-violet-500/40 shadow-inner space-y-3"
          >
            <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider">
              Custom Decision Simulator
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Title / Item</label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Roadtrip Split"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 1200"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Action Type</label>
                <select
                  value={customType}
                  onChange={e => setCustomType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="expense">Debit / Expense</option>
                  <option value="income">Side Inflow / Freelance</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-violet-600/30"
              >
                Run Simulation <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Simulation Diff & Impact Analysis */}
        {simulationDiff ? (
          <div className="space-y-4">
            {/* 4 Impact Diff KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Day 30 Balance Delta */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Day 30 Balance
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-mono font-bold text-white">
                    ₹{simulationDiff.simulatedDay30Balance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className={`text-[11px] font-semibold mt-1 flex items-center gap-0.5 ${
                  simulationDiff.balanceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {simulationDiff.balanceDelta >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {simulationDiff.balanceDelta >= 0 ? '+' : ''}₹{simulationDiff.balanceDelta}
                </div>
              </div>

              {/* Daily Allowance Delta */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Daily Safe Burn
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-mono font-bold text-white">
                    ₹{simulationDiff.simulatedDailyAllowance}
                  </span>
                  <span className="text-[10px] text-slate-400">/day</span>
                </div>
                <div className={`text-[11px] font-semibold mt-1 flex items-center gap-0.5 ${
                  simulationDiff.dailyAllowanceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {simulationDiff.dailyAllowanceDelta >= 0 ? '+' : ''}₹{simulationDiff.dailyAllowanceDelta}/day
                </div>
              </div>

              {/* Health Score Delta */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Health Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">
                    {simulationDiff.simulatedHealthScore}
                  </span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
                <div className={`text-[11px] font-semibold mt-1 ${
                  simulationDiff.healthScoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {simulationDiff.healthScoreDelta >= 0 ? '+' : ''}{simulationDiff.healthScoreDelta} pts
                </div>
              </div>

              {/* Risk Shift */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Risk Level
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded border ${
                    simulationDiff.simulatedRiskLevel === 'LOW'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : simulationDiff.simulatedRiskLevel === 'MODERATE'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : simulationDiff.simulatedRiskLevel === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {simulationDiff.simulatedRiskLevel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  from {simulationDiff.baselineRiskLevel}
                </span>
              </div>
            </div>

            {/* Savings Goal Impact Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <span className="text-base">🎯</span>
              <span>{simulationDiff.goalImpactText}</span>
            </div>

            {/* Gen Z FinBot Verdict */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{simulationDiff.verdict.badgeEmoji}</span>
                  <h4 className="text-sm font-extrabold text-white">
                    {simulationDiff.verdict.title}
                  </h4>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${simulationDiff.verdict.pillClass}`}>
                  {simulationDiff.verdict.rating.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                {simulationDiff.verdict.advice}
              </p>

              {/* Buttons: Commit to reality vs Discard */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setSimulation(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Clear Simulation
                </button>

                <button
                  type="button"
                  onClick={handleCommit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Decision to Reality
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-slate-200 mb-1">
              Select or build a scenario above
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Simulate spending ₹2,400 on concert tickets, picking up freelance gigs, or cutting streaming subscriptions to observe how they affect your 30-day runway.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
