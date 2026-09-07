import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Sparkles } from 'lucide-react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    ai: 'bg-purple-500/15 text-purple-300 border-purple-500/30 font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  switch ((severity || '').toLowerCase()) {
    case 'critical':
      return <Badge variant="critical"><AlertTriangle className="w-3 h-3" /> Critical</Badge>;
    case 'high':
      return <Badge variant="high"><AlertCircle className="w-3 h-3" /> High</Badge>;
    case 'medium':
      return <Badge variant="medium"><Info className="w-3 h-3" /> Medium</Badge>;
    case 'low':
      return <Badge variant="low"><CheckCircle2 className="w-3 h-3" /> Low</Badge>;
    default:
      return <Badge variant="default">{severity}</Badge>;
  }
};

export const StatusBadge = ({ status }) => {
  const lower = (status || '').toLowerCase();
  if (lower.includes('completed') || lower.includes('closed') || lower.includes('effective') || lower.includes('approved')) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
  }
  if (lower.includes('progress') || lower.includes('under review') || lower.includes('pending')) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30"><Info className="w-3 h-3" /> {status}</span>;
  }
  if (lower.includes('escalated') || lower.includes('ineffective') || lower.includes('rejected')) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30"><AlertTriangle className="w-3 h-3" /> {status}</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">{status}</span>;
};

export const AIConfidenceBadge = ({ confidence = 0.9, model = 'Gemini 1.5 Pro' }) => {
  const percent = Math.round(confidence * 100);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm">
      <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
      <span>AI Suggested ({percent}% Confidence)</span>
    </span>
  );
};
