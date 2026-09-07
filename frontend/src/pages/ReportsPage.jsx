import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, CheckCircle2, Loader2, Sparkles, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export const ReportsPage = () => {
  const { schools } = useData();
  const [selectedTemplate, setSelectedTemplate] = useState('rep-1');
  const [dateRange, setDateRange] = useState('30d');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generationState, setGenerationState] = useState('idle'); // idle | generating | ready

  const reportTemplates = [
    { id: 'rep-1', title: 'Executive Quality Overview Report', category: 'Executive Summary', description: 'Comprehensive quality health index, KPI summary, and high-level defect rates across all campuses.' },
    { id: 'rep-2', title: 'Pareto Defect & Root Cause Analysis', category: 'Analytics', description: '80/20 Pareto category breakdown, empirical contributing factor rankings, and hypothesis evidence logs.' },
    { id: 'rep-3', title: 'CAPA Closed-Loop Effectiveness Audit', category: 'Governance', description: 'Detailed action plan status, auditor verification scores, containment actions, and closed-loop velocity.' },
    { id: 'rep-4', title: 'AI Model Health & Governance Log', category: 'AI Intelligence', description: 'Gemini classification accuracy, human override reasons, precision/recall metrics, and model drift data.' },
    { id: 'rep-5', title: 'School Group Comparative Quality Matrix', category: 'Campus Comparison', description: 'Cross-campus benchmark matrix comparing inspection compliance scores, unexcused absence rates, and parent SLA compliance.' }
  ];

  const handleGenerateReport = async () => {
    setGenerationState('generating');
    await new Promise(res => setTimeout(res, 1200));
    setGenerationState('ready');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Inspection ID,School,Category,Severity,Status,Score\nINS-2026-0891,Greenfield International,Attendance gaps,High,Completed,84.5\nINS-2026-0892,Oakridge Academy,Incomplete assessments,Medium,Pending Review,79.0";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `K12_Quality_Report_${selectedTemplate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Reports & Analytics Generator"
        subtitle="Generate executive summary reports, export CSV raw datasets, and print compliance documentation for school leadership and auditors."
        breadcrumbs={['Reports', 'Report Generator']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Template Selection & Filters */}
        <div className="space-y-4">
          <Card title="1. Select Report Template" subtitle="Choose from standard quality intelligence templates.">
            <div className="space-y-2 mt-2">
              {reportTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => { setSelectedTemplate(tpl.id); setGenerationState('idle'); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === tpl.id
                      ? 'bg-brand-600/15 border-brand-500/50 text-slate-100 font-semibold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-100">{tpl.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-brand-400 border border-slate-700">{tpl.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">{tpl.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="2. Report Scope & Filters" subtitle="Refine report parameters.">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="ytd">Year to Date (2026)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Campus Group Filter</label>
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="all">All Schools (Group Wide)</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full justify-center mt-2"
                icon={FileText}
                loading={generationState === 'generating'}
                onClick={handleGenerateReport}
              >
                Generate Report Dataset
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Report Preview & Export Actions */}
        <div className="lg:col-span-2 space-y-4">
          {generationState === 'generating' ? (
            <Card title="Generating Report PDF/CSV Dataset..." hoverEffect={false}>
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
                <p className="font-semibold text-slate-200 text-sm">Synthesizing Quality Intelligence Metrics...</p>
                <p className="text-xs text-slate-500">Querying inspection results, defects, and CAPA effectiveness scores</p>
              </div>
            </Card>
          ) : generationState === 'ready' ? (
            <div className="space-y-4 animate-fade-in">
              {/* Header Action Bar */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Report Ready for Export & Print
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" icon={FileSpreadsheet} onClick={handleExportCSV}>
                    Export CSV Data
                  </Button>
                  <Button size="sm" variant="primary" icon={Printer} onClick={() => window.print()}>
                    Print / Export PDF
                  </Button>
                </div>
              </div>

              {/* Printable Document Preview Paper */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 text-xs text-slate-200 font-sans shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{reportTemplates.find(t => t.id === selectedTemplate)?.title}</h2>
                    <p className="text-slate-400 mt-0.5">K-12 Operational Quality Inspection & Intelligence System</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>Generated: <strong className="text-slate-200">2026-09-07</strong></div>
                    <div>Scope: <strong className="text-brand-400">School Group Wide</strong></div>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-100 text-sm">Executive Key Performance Indicator Summary</h4>
                  <div className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Inspections</span>
                      <span className="text-slate-100 font-bold text-sm">48</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Defects</span>
                      <span className="text-red-400 font-bold text-sm">14</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Effective CAPAs</span>
                      <span className="text-emerald-400 font-bold text-sm">94.8%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">AI Accuracy</span>
                      <span className="text-purple-400 font-bold text-sm">94.2%</span>
                    </div>
                  </div>
                </div>

                {/* Finding Details */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-100 text-sm">Operational Defects & CAPA Audit Trail</h4>
                  <table className="w-full text-left border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-semibold text-[11px]">
                        <th className="p-2 border border-slate-800">Defect ID</th>
                        <th className="p-2 border border-slate-800">School</th>
                        <th className="p-2 border border-slate-800">Category</th>
                        <th className="p-2 border border-slate-800">Severity</th>
                        <th className="p-2 border border-slate-800">CAPA Owner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[11px]">
                      <tr>
                        <td className="p-2 border border-slate-800 font-mono text-red-400">DEF-2026-0104</td>
                        <td className="p-2 border border-slate-800">Greenfield International</td>
                        <td className="p-2 border border-slate-800">Attendance gaps</td>
                        <td className="p-2 border border-slate-800 font-bold text-orange-400">High</td>
                        <td className="p-2 border border-slate-800">Marcus Sterling</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-800 font-mono text-red-400">DEF-2026-0105</td>
                        <td className="p-2 border border-slate-800">Oakridge Academy</td>
                        <td className="p-2 border border-slate-800">Incomplete assessments</td>
                        <td className="p-2 border border-slate-800 font-bold text-amber-400">Medium</td>
                        <td className="p-2 border border-slate-800">Dr. Evelyn Vance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <Card title="Report Document Canvas" hoverEffect={false}>
              <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                <FileText className="w-10 h-10 text-brand-500/40 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">Select template & click 'Generate Report Dataset'</p>
                <p className="text-slate-500">Live report document preview will compile here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
