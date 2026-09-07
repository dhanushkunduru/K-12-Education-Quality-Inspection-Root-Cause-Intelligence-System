import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GitMerge, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Award } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { AIConfidenceBadge, Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export const RootCausePage = () => {
  const { defects } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Attendance gaps');

  const paretoData = [
    { category: 'Attendance gaps', count: 48, cumulative: 35.5 },
    { category: 'Communication failures', count: 34, cumulative: 60.7 },
    { category: 'Incomplete assessments', count: 24, cumulative: 78.5 },
    { category: 'Timetable conflicts', count: 18, cumulative: 91.8 },
    { category: 'Safeguarding incidents', count: 7, cumulative: 97.0 },
    { category: 'Learning decline', count: 4, cumulative: 100.0 }
  ];

  const hypothesesList = [
    {
      id: 'hyp-1',
      statement: 'Inconsistent staff homeroom roll-call logging during Period 1 floating class assignments',
      weight: 0.84,
      evidence: '84% of late attendance submissions originate from floating teachers moving between classrooms.',
      status: 'Approved',
      approvedBy: 'Dr. Evelyn Vance (Manager)'
    },
    {
      id: 'hyp-2',
      statement: 'Mobile attendance portal API latency spike during morning registration window (08:00 - 08:30)',
      weight: 0.65,
      evidence: 'Server network logs reveal 4.8s latency spike during morning roll-call rush hour.',
      status: 'Approved',
      approvedBy: 'Marcus Sterling (Quality Engineer)'
    },
    {
      id: 'hyp-3',
      statement: 'Absence of automated SMS webhook fallback to guardians for unexcused 3-day gaps',
      weight: 0.52,
      evidence: 'Current manual email notification workflow relies on batch end-of-day administrative triggers.',
      status: 'AI Suggested',
      approvedBy: null
    }
  ];

  const contributingFactors = [
    { factor: 'Teacher Workload & Floating Room Assignments', impact: 'High', correlation: '0.84' },
    { factor: 'LMS Platform Timezone & Server Lock Misconfiguration', impact: 'High', correlation: '0.78' },
    { factor: 'Mobile App Offline Sync Queue Latency', impact: 'Medium', correlation: '0.65' },
    { factor: 'Departmental SLA Reminder Triggers', impact: 'Medium', correlation: '0.59' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Root Cause Intelligence & Pareto Analytics"
        subtitle="Analyze underlying systemic drivers behind recurring quality defects. Distinguish between AI-suggested hypotheses and human-approved decisions."
        breadcrumbs={['Root Cause', 'Empirical Root Cause Analysis']}
      />

      {/* Visual Workflow Stepper Overview */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-100 shrink-0">
          <Layers className="w-4 h-4 text-brand-400" />
          <span>Root Cause Chain:</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">Defect Exception</span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">Recurring Pattern</span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">Contributing Factors</span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">Root Cause Hypothesis</span>
          <span className="text-slate-600">→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">CAPA Solution</span>
        </div>
      </div>

      {/* Main Charts & Hypotheses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pareto Chart & Contributing Factors */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Pareto Defect Distribution (80/20 Rule)" subtitle="Statistical breakdown of defect categories causing 80% of quality loss.">
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickFormatter={(val) => val.split(' ')[0]} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#8b5cf6" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar yAxisId="left" dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Defect Volume" />
                  <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} name="Cumulative %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Factor Ranking Matrix */}
          <Card title="Empirical Contributing Factor Ranking" subtitle="Ranked operational drivers correlated with quality variance.">
            <div className="space-y-3 mt-2 text-xs">
              {contributingFactors.map((fac, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200">{fac.factor}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Correlation: <strong className="text-brand-400">{fac.correlation}</strong></span>
                    <Badge variant={fac.impact === 'High' ? 'high' : 'medium'}>{fac.impact} Impact</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Root Cause Hypotheses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-brand-400" />
              <span>Root Cause Hypotheses</span>
            </h3>
            <AIConfidenceBadge confidence={0.91} />
          </div>

          <div className="space-y-4 text-xs">
            {hypothesesList.map(hyp => (
              <div
                key={hyp.id}
                className={`p-4 rounded-xl border transition-all ${
                  hyp.status === 'Approved'
                    ? 'bg-slate-900 border-slate-700/80 shadow-md'
                    : 'bg-purple-950/20 border-purple-500/30 ai-card-glow'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    hyp.status === 'Approved'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {hyp.status === 'Approved' ? 'Approved Human Decision' : 'AI Suggested Hypothesis'}
                  </span>
                  <span className="font-bold text-brand-400">Weight: {Math.round(hyp.weight * 100)}%</span>
                </div>

                <p className="font-semibold text-slate-100 leading-snug">{hyp.statement}</p>

                <div className="mt-2.5 p-2.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                  <strong className="text-slate-200">Supporting Evidence: </strong>
                  {hyp.evidence}
                </div>

                {hyp.status === 'Approved' ? (
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approved by {hyp.approvedBy}</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button size="sm" variant="ai" icon={CheckCircle2} onClick={() => alert('Hypothesis approved and converted to active root cause')}>
                      Approve Hypothesis
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
