import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, Cpu, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';

export const ModelMonitoringPage = () => {
  const [metrics, setMetrics] = useState({
    overallAccuracy: 94.2,
    precision: 92.8,
    recall: 95.1,
    f1Score: 93.9,
    avgLatencyMs: 1240,
    driftStatus: 'Low / Stable',
    overrideRate: 7.8,
    totalInferences: 3420,
    activeModelVersion: 'Gemini 1.5 Pro (v2.4.1)',
    historicalPerformance: [
      { date: 'Aug 01', accuracy: 91.2, overrideRate: 9.4, latency: 1350 },
      { date: 'Aug 08', accuracy: 92.5, overrideRate: 8.7, latency: 1290 },
      { date: 'Aug 15', accuracy: 93.8, overrideRate: 8.1, latency: 1260 },
      { date: 'Aug 22', accuracy: 94.0, overrideRate: 7.9, latency: 1250 },
      { date: 'Aug 29', accuracy: 94.2, overrideRate: 7.8, latency: 1240 }
    ]
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await api.getModelMonitoring();
      if (data) setMetrics(data);
    };
    fetchMetrics();
  }, []);

  const modelVersions = [
    { version: 'Gemini 1.5 Pro (v2.4.1)', status: 'Active Production', accuracy: '94.2%', avgLatency: '1.24s', overrides: '7.8%', deployedDate: '2026-08-01' },
    { version: 'Gemini 1.5 Flash (v1.2.0)', status: 'Fallback Engine', accuracy: '91.5%', avgLatency: '0.45s', overrides: '11.2%', deployedDate: '2026-07-15' },
    { version: 'K12-Domain-Classifier-v1', status: 'Deprecated', accuracy: '86.4%', avgLatency: '2.10s', overrides: '18.4%', deployedDate: '2026-05-10' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Model Monitoring & Governance"
        subtitle="Monitor Gemini AI classification accuracy, concept drift, API response latency, and human override rates across quality inspections."
        breadcrumbs={['Quality Outcomes', 'Model Monitoring']}
      />

      {/* Model Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Accuracy"
          value={`${metrics.overallAccuracy}%`}
          change="+1.4%"
          trend="up"
          sparkline={[91, 92, 93.5, 94, metrics.overallAccuracy]}
          icon={Sparkles}
        />
        <KPICard
          title="Human Override Rate"
          value={`${metrics.overrideRate}%`}
          change="-1.6%"
          trend="down"
          sparkline={[9.4, 8.7, 8.1, 7.9, metrics.overrideRate]}
          icon={AlertTriangle}
        />
        <KPICard
          title="Avg API Latency"
          value={`${(metrics.avgLatencyMs / 1000).toFixed(2)}s`}
          change="-0.11s"
          trend="down"
          sparkline={[1.35, 1.29, 1.26, 1.25, 1.24]}
          icon={Activity}
        />
        <KPICard
          title="Model Drift Index"
          value={metrics.driftStatus}
          change="Stable"
          trend="flat"
          sparkline={[0.02, 0.02, 0.01, 0.01, 0.01]}
          icon={ShieldCheck}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="AI Accuracy vs. Human Override Rate Trend" subtitle="5-week moving average of classification accuracy and override rate.">
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.historicalPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={3} name="Accuracy %" />
                <Line type="monotone" dataKey="overrideRate" stroke="#f59e0b" strokeWidth={2.5} name="Override Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="API Inference Latency Distribution (ms)" subtitle="Gemini API latency response time across inspection batches.">
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.historicalPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLatency)" name="Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Model Version Management Table */}
      <Card title="Registered AI Model Versions & Performance Log" subtitle="Active production Gemini model deployments and legacy evaluation scores.">
        <div className="overflow-x-auto mt-2 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-4">Model Version</th>
                <th className="py-3 px-4">Deployment Status</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Avg Latency</th>
                <th className="py-3 px-4">Override Rate</th>
                <th className="py-3 px-4">Deployment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {modelVersions.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" /> {m.version}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      m.status === 'Active Production' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-400">{m.accuracy}</td>
                  <td className="py-3.5 px-4 font-mono">{m.avgLatency}</td>
                  <td className="py-3.5 px-4 font-semibold text-amber-400">{m.overrides}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{m.deployedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
