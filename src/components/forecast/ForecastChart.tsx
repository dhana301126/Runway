import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingDown, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { DayForecastPoint } from '../../types/finance';

export const ForecastChart: React.FC = () => {
  const { forecastPoints, currentDay, activeSimulation, simulationDiff } = useFinance();
  const [hoveredPoint, setHoveredPoint] = useState<DayForecastPoint | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max for Y scale (with padding)
  const allBalances = forecastPoints.flatMap(p => [
    p.baselineBalance,
    ...(p.simulatedBalance !== undefined ? [p.simulatedBalance] : [])
  ]);
  const minVal = Math.min(0, ...allBalances);
  const maxVal = Math.max(10500, ...allBalances);

  const getX = (day: number) => padding.left + ((day - 1) / 29) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Build baseline path
  const baselinePoints = forecastPoints.map(p => `${getX(p.day)},${getY(p.baselineBalance)}`).join(' ');
  const baselineArea = `${getX(1)},${getY(0)} ` + baselinePoints + ` ${getX(30)},${getY(0)}`;

  // Build simulated path if active
  const hasSim = !!activeSimulation && forecastPoints.some(p => p.simulatedBalance !== undefined);
  const simulatedPoints = hasSim
    ? forecastPoints.filter(p => p.simulatedBalance !== undefined).map(p => `${getX(p.day)},${getY(p.simulatedBalance!)}`).join(' ')
    : '';

  // Zero-line Y
  const zeroY = getY(0);

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              30-Day Liquidity & Solvency Forecast
            </h3>
            {hasSim && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Simulating: {activeSimulation.title}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Real-time projection factoring daily burn and scheduled obligations
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 bg-emerald-400 rounded-full" />
            <span className="text-slate-300">Baseline Trajectory</span>
          </div>
          {hasSim && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 bg-violet-400 rounded-full shadow-sm shadow-violet-500/50" />
              <span className="text-violet-300">What-If Simulation</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">Bill Drop</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="simulatedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (Y axis) */}
          {[10000, 7500, 5000, 2500, 0].map(val => (
            <g key={val}>
              <line 
                x1={padding.left} 
                y1={getY(val)} 
                x2={width - padding.right} 
                y2={getY(val)} 
                stroke={val === 0 ? '#EF4444' : '#1E293B'} 
                strokeWidth={val === 0 ? '1.5' : '1'}
                strokeDasharray={val === 0 ? '4 4' : 'none'}
              />
              <text 
                x={padding.left - 10} 
                y={getY(val) + 4} 
                fill={val === 0 ? '#EF4444' : '#64748B'} 
                fontSize="10" 
                textAnchor="end" 
                fontFamily="JetBrains Mono, monospace"
              >
                ₹{val >= 1000 ? `${val / 1000}k` : val}
              </text>
            </g>
          ))}

          {/* Grid lines & Day ticks (X axis) */}
          {[1, 5, 10, 15, 20, 25, 30].map(day => (
            <g key={day}>
              <line 
                x1={getX(day)} 
                y1={padding.top} 
                x2={getX(day)} 
                y2={height - padding.bottom} 
                stroke="#1E293B" 
                strokeWidth="1" 
                strokeDasharray="2 4"
              />
              <text 
                x={getX(day)} 
                y={height - padding.bottom + 18} 
                fill={day === currentDay ? '#10B981' : '#64748B'} 
                fontSize="11" 
                fontWeight={day === currentDay ? 'bold' : 'normal'}
                textAnchor="middle" 
                fontFamily="JetBrains Mono, monospace"
              >
                D{day}
              </text>
            </g>
          ))}

          {/* Baseline Area fill */}
          <polygon points={baselineArea} fill="url(#baselineGradient)" />

          {/* Baseline curve */}
          <polyline 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            points={baselinePoints} 
          />

          {/* Simulated curve */}
          {hasSim && (
            <polyline 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2.5" 
              strokeDasharray="4 2"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              points={simulatedPoints} 
            />
          )}

          {/* Bill drop indicator dots */}
          {forecastPoints.map(p => {
            const hasBill = p.mandatoryBillsDue > 0 || p.subscriptionsDue > 0;
            if (!hasBill) return null;
            return (
              <g key={`bill-${p.day}`}>
                <circle 
                  cx={getX(p.day)} 
                  cy={getY(p.baselineBalance)} 
                  r="4.5" 
                  fill="#F59E0B" 
                  stroke="#080C14" 
                  strokeWidth="2" 
                />
              </g>
            );
          })}

          {/* Current Day vertical line & cursor */}
          <line 
            x1={getX(currentDay)} 
            y1={padding.top} 
            x2={getX(currentDay)} 
            y2={height - padding.bottom} 
            stroke="#10B981" 
            strokeWidth="2" 
            strokeDasharray="3 3"
          />
          <circle 
            cx={getX(currentDay)} 
            cy={getY(forecastPoints.find(p => p.day === currentDay)?.baselineBalance || 0)} 
            r="6" 
            fill="#10B981" 
            stroke="#080C14" 
            strokeWidth="2.5" 
          />

          {/* Interactive invisible hover rectangles */}
          {forecastPoints.map(p => (
            <rect
              key={`hover-${p.day}`}
              x={getX(p.day) - (chartWidth / 30) / 2}
              y={padding.top}
              width={chartWidth / 30}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-xs z-20 flex items-center gap-4"
          >
            <div>
              <span className="font-bold text-emerald-400">Day {hoveredPoint.day}</span>
              <div className="font-mono text-white text-sm font-bold">
                ₹{hoveredPoint.baselineBalance.toLocaleString('en-IN')}
              </div>
            </div>

            {hasSim && hoveredPoint.simulatedBalance !== undefined && (
              <div className="border-l border-slate-800 pl-3">
                <span className="font-bold text-violet-400">Simulated</span>
                <div className="font-mono text-violet-300 text-sm font-bold">
                  ₹{hoveredPoint.simulatedBalance.toLocaleString('en-IN')}
                  <span className={`text-[10px] ml-1 ${hoveredPoint.simulatedBalance >= hoveredPoint.baselineBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({hoveredPoint.simulatedBalance - hoveredPoint.baselineBalance >= 0 ? '+' : ''}₹{hoveredPoint.simulatedBalance - hoveredPoint.baselineBalance})
                  </span>
                </div>
              </div>
            )}

            {(hoveredPoint.mandatoryBillsDue > 0 || hoveredPoint.subscriptionsDue > 0) && (
              <div className="border-l border-slate-800 pl-3 text-amber-300">
                <span className="font-semibold text-[10px] uppercase">Bills Due:</span>
                <div className="font-mono font-bold">
                  ₹{hoveredPoint.mandatoryBillsDue + hoveredPoint.subscriptionsDue}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delta alert bar when simulation is active */}
      {simulationDiff && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-violet-400">Simulated Impact:</span>
            <span className="text-slate-300">
              Day 30 Balance shifts by{' '}
              <strong className={simulationDiff.balanceDelta >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                {simulationDiff.balanceDelta >= 0 ? '+₹' : '-₹'}
                {Math.abs(simulationDiff.balanceDelta).toLocaleString('en-IN')}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Safe Daily:{' '}
              <strong className="text-slate-200 font-mono">
                ₹{simulationDiff.simulatedDailyAllowance}/day ({simulationDiff.dailyAllowanceDelta >= 0 ? '+' : ''}₹{simulationDiff.dailyAllowanceDelta})
              </strong>
            </span>
            <span className="text-slate-400">
              Health Score:{' '}
              <strong className={simulationDiff.healthScoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {simulationDiff.healthScoreDelta >= 0 ? '+' : ''}{simulationDiff.healthScoreDelta} pts
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
