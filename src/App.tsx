import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { TopNav } from './components/header/TopNav';
import { DayControls } from './components/header/DayControls';
import { MetricCards } from './components/metrics/MetricCards';
import { HealthScoreModal } from './components/metrics/HealthScoreModal';
import { ForecastChart } from './components/forecast/ForecastChart';
import { DecisionSimulator } from './components/simulator/DecisionSimulator';
import { CommitmentsManager } from './components/commitments/CommitmentsManager';
import { SavingsGoalsCard } from './components/savings/SavingsGoalsCard';
import { TransactionFeed } from './components/transactions/TransactionFeed';
import { AddExpenseModal } from './components/transactions/AddExpenseModal';
import { GenZAdvisorCard } from './components/advisor/GenZAdvisorCard';
import { LifeHappensModal } from './components/shocks/LifeHappensModal';

const MainDashboard: React.FC = () => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <TopNav 
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5">
        {/* Day Progression Controls & Bill Alerts */}
        <DayControls />

        {/* 4 Core Financial Metrics */}
        <MetricCards 
          onOpenHealthModal={() => setIsHealthModalOpen(true)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Dynamic Gen Z Advisor Coaching Banner */}
        <GenZAdvisorCard 
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 30-Day Liquidity & Solvency Forecast Graph */}
        <ForecastChart />

        {/* Interconnected Commitments & Micro-Savings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CommitmentsManager />
          <SavingsGoalsCard />
        </div>

        {/* Transaction Activity Feed */}
        <TransactionFeed 
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 px-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-400">RupeeFlow</span> • Gen Z ₹10,000 Budget Operating System • 
          <span className="text-emerald-400">Interconnected Decision Architecture</span>
        </p>
      </footer>

      {/* Modals & Drawers */}
      <DecisionSimulator 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)} 
      />

      <HealthScoreModal 
        isOpen={isHealthModalOpen} 
        onClose={() => setIsHealthModalOpen(false)} 
      />

      <AddExpenseModal 
        isOpen={isAddExpenseOpen} 
        onClose={() => setIsAddExpenseOpen(false)} 
      />

      <LifeHappensModal />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <MainDashboard />
    </FinanceProvider>
  );
}

export default App;
