import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Plus, AlertCircle, ShoppingBag, Utensils, Zap } from 'lucide-react';
import { ExpenseCategory } from '../../types/finance';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, safeDailyAllowance, currentBalance } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [isImpulse, setIsImpulse] = useState(false);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title || isNaN(numAmount) || numAmount <= 0) return;

    let emoji = '💸';
    if (category === 'food') emoji = '🍔';
    else if (category === 'entertainment') emoji = '🎟️';
    else if (category === 'shopping') emoji = '👟';
    else if (category === 'transport') emoji = '🛵';

    addTransaction({
      title,
      amount: numAmount,
      category,
      isImpulse,
      note,
      emoji
    });

    onClose();
    setTitle('');
    setAmount('');
    setNote('');
    setIsImpulse(false);
  };

  const parsedAmount = parseFloat(amount) || 0;
  const exceedsDailyAllowance = parsedAmount > safeDailyAllowance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Real Expense</h2>
              <p className="text-xs text-slate-400">Deducts immediately from liquid balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Expense Title</label>
            <input
              type="text"
              placeholder="e.g., Midnight Biryani or Metro Card"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="250"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="food">🍔 Food & Drinks</option>
                <option value="shopping">👟 Shopping & Clothes</option>
                <option value="entertainment">🎟️ Entertainment</option>
                <option value="transport">🛵 Commute & Travel</option>
                <option value="emergency">🚨 Emergency</option>
              </select>
            </div>
          </div>

          {/* Warning banner if amount exceeds daily safe burn */}
          {exceedsDailyAllowance && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                ₹{parsedAmount} exceeds today's safe allowance (₹{safeDailyAllowance}/day). Your future daily budget will compress by ~₹{Math.round(parsedAmount / 25)}/day.
              </span>
            </div>
          )}

          {/* Impulse checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <input
              type="checkbox"
              id="impulse-check"
              checked={isImpulse}
              onChange={e => setIsImpulse(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-0"
            />
            <label htmlFor="impulse-check" className="text-xs text-slate-300 cursor-pointer">
              Tag as <strong>"Impulse / Unplanned Want"</strong> (affects discipline metrics)
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
            >
              Log Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
