import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Bot, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

interface GenZAdvisorCardProps {
  onOpenSimulator: () => void;
}

export const GenZAdvisorCard: React.FC<GenZAdvisorCardProps> = ({ onOpenSimulator }) => {
  const { 
    currentDay, 
    safeDailyAllowance, 
    upcomingMandatory, 
    currentBalance, 
    subscriptions, 
    savingsGoals, 
    financialRisk 
  } = useFinance();

  // Dynamic coaching logic
  let botMessage = '';
  let botMoodEmoji = '🤖';
  let callToAction = 'Run What-If Simulation';

  const rentCommitment = upcomingMandatory > 0;
  const activeSubsCount = subscriptions.filter(s => s.isActive).length;

  if (currentBalance < upcomingMandatory) {
    botMoodEmoji = '🚨';
    botMessage = `Deficit detected! Your upcoming mandatory bills (₹${upcomingMandatory}) exceed your total balance (₹${currentBalance}). Freeze all discretionary food deliveries and unlock your safety buffer immediately.`;
    callToAction = 'Simulate Emergency Plan';
  } else if (currentDay <= 6 && rentCommitment) {
    botMoodEmoji = '🛡️';
    botMessage = `PG Rent & Bills are due in the next few days. Keep your daily spend strictly capped below ₹${safeDailyAllowance}/day so auto-debit doesn't bounce.`;
    callToAction = 'Simulate Rent Buffer';
  } else if (safeDailyAllowance < 90) {
    botMoodEmoji = '🍜';
    botMessage = `Daily safe-to-spend is squeezed to ₹${safeDailyAllowance}/day. You are entering the 'Hostel Canteen' phase. Pausing 2 digital subscriptions can restore ₹15/day to your daily meals.`;
    callToAction = 'Simulate Pausing Subs';
  } else if (safeDailyAllowance >= 180) {
    botMoodEmoji = '💅';
    botMessage = `Financial discipline is looking solid! You have ₹${safeDailyAllowance}/day headroom. Perfect time to stash an extra ₹300 into your Goa Trip micro-fund before the weekend.`;
    callToAction = 'Simulate Savings Flex';
  } else {
    botMoodEmoji = '⚡';
    botMessage = `Day ${currentDay} pacing is on track. You can absorb unexpected shock expenses up to ₹${financialRisk.maxShockAbsorbable} without defaulting on rent or Wi-Fi.`;
    callToAction = 'Test Resilience';
  }

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/30 border border-indigo-500/30 rounded-2xl p-4.5 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl shrink-0">
            {botMoodEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                FinBot Intelligence <span className="text-[10px] lowercase text-indigo-400 font-normal">@Day {currentDay}</span>
              </h4>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
              {botMessage}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSimulator}
          className="shrink-0 px-3.5 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all self-end sm:self-center"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{callToAction}</span>
        </button>
      </div>
    </div>
  );
};
