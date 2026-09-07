import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  change,
  trend = 'up', // up, down, flat
  sparkline = [30, 40, 35, 50, 49, 60],
  icon: Icon,
  accentColor = 'brand'
}) => {
  const isPositive = trend === 'up' && !title.toLowerCase().includes('defect') && !title.toLowerCase().includes('critical');
  const isNegative = trend === 'up' && (title.toLowerCase().includes('defect') || title.toLowerCase().includes('critical'));

  // Simple SVG sparkline
  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline) || 1;
  const points = sparkline.map((val, idx) => {
    const x = (idx / (sparkline.length - 1)) * 100;
    const y = 30 - ((val - min) / (max - min || 1)) * 24;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800/90 glass-card-hover flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 text-brand-400 border border-slate-700/60">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
          <div className="flex items-center gap-1.5 mt-1">
            {trend === 'up' && <TrendingUp className={`w-3.5 h-3.5 ${isNegative ? 'text-red-400' : 'text-emerald-400'}`} />}
            {trend === 'down' && <TrendingDown className={`w-3.5 h-3.5 ${isNegative ? 'text-emerald-400' : 'text-red-400'}`} />}
            {trend === 'flat' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={`text-xs font-semibold ${isNegative ? 'text-red-400' : isPositive ? 'text-emerald-400' : 'text-slate-300'}`}>
              {change}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">vs prev 30d</span>
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="w-20 h-9">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
            <polyline
              fill="none"
              stroke={isNegative ? '#ef4444' : '#2563eb'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
