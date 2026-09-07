import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line
} from 'recharts';
import {
  ClipboardCheck,
  AlertTriangle,
  Flame,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Activity,
  Award,
  Filter,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { AIInsightCard } from '../components/ui/AIInsightCard';
import { useData } from '../context/DataContext';
import { api } from '../services/api';

export const DashboardPage = () => {
  const { inspections, defects, capas, selectedSchoolFilter, setSelectedSchoolFilter, schools, handleAIDecision } = useData();
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await api.getDashboard({ schoolId: selectedSchoolFilter, dateRange });
      setDashboardData(data);
    };
    fetchDashboard();
  }, [selectedSchoolFilter, dateRange]);

  // Derived filter calculations
  const filteredDefects = defects.filter(d => {
    if (selectedSchoolFilter !== 'all' && d.schoolId !== selectedSchoolFilter) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && d.severity !== severityFilter) return false;
    return true;
  });

  const totalInspectionsVal = inspections.length;
  const defectsCountVal = filteredDefects.length;
  const criticalCountVal = filteredDefects.filter(d => d.severity === 'Critical').length;
  const recurringCountVal = filteredDefects.filter(d => d.recurrenceCount > 1).length;
  const openCapasVal = capas.filter(c => c.status !== 'Closed').length;

  const trendData = dashboardData?.trendData || [
    { month: 'Apr', inspections: 38, defects: 19, capas: 8 },
    { month: 'May', inspections: 42, defects: 16, capas: 7 },
    { month: 'Jun', inspections: 45, defects: 15, capas: 6 },
    { month: 'Jul', inspections: 44, defects: 13, capas: 5 },
    { month: 'Aug', inspections: 48, defects: 14, capas: 4 }
  ];

  const defectsByCategory = dashboardData?.defectsByCategory || [
    { name: 'Attendance gaps', count: 48, fill: '#ef4444' },
    { name: 'Communication failures', count: 34, fill: '#f59e0b' },
    { name: 'Incomplete assessments', count: 24, fill: '#3b82f6' },
    { name: 'Timetable conflicts', count: 18, fill: '#8b5cf6' },
    { name: 'Safeguarding incidents', count: 7, fill: '#ec4899' },
    { name: 'Learning decline', count: 4, fill: '#10b981' }
  ];

  const severityDistribution = dashboardData?.severityDistribution || [
    { name: 'Critical', value: criticalCountVal || 2, color: '#ef4444' },
    { name: 'High', value: 5, color: '#f97316' },
    { name: 'Medium', value: 4, color: '#f59e0b' },
    { name: 'Low', value: 3, color: '#10b981' }
  ];

  const paretoData = dashboardData?.paretoData || [
    { category: 'Attendance gaps', count: 48, cumulative: 35.5 },
    { category: 'Communication failures', count: 34, cumulative: 60.7 },
    { category: 'Incomplete assessments', count: 24, cumulative: 78.5 },
    { category: 'Timetable conflicts', count: 18, cumulative: 91.8 },
    { category: 'Safeguarding incidents', count: 7, cumulative: 97.0 },
    { category: 'Learning decline', count: 4, cumulative: 100.0 }
  ];

  const schoolComparison = dashboardData?.schoolComparison || schools.map(s => ({
    name: s.name.split(' ')[0],
    fullName: s.name,
    inspections: 12,
    defects: 3,
    score: 92
  }));

  const aiInsightsList = dashboardData?.aiInsights || [
    {
      id: 'ai-ins-1',
      title: 'Attendance Gaps Escalation Pattern',
      summary: 'Attendance gaps increased 14.2% across Grade 8 classrooms in 3 campuses during August monthly reporting.',
      confidence: 0.94,
      evidence: 'Cross-analysis of 1,420 attendance sheets and parent portal response logs from Greenfield and Riverside campuses.',
      recommendedAction: 'Mandate automated 09:30 AM parent SMS notification webhook and issue v3.2 app patch.',
      model: 'Gemini 1.5 Pro',
      timestamp: '2 hours ago',
      status: 'Pending Review'
    },
    {
      id: 'ai-ins-2',
      title: 'Recurring Assessment Completeness Driver',
      summary: 'Assessment completion defects recur most frequently when STEM lab deadlines coincide with progress report freezes.',
      confidence: 0.88,
      evidence: 'System lock timer configured to UTC causing 5-hour cutoff mismatch for science faculty.',
      recommendedAction: 'Re-configure LMS portal lock timezone to EST and issue deadline reminder banners.',
      model: 'Gemini 1.5 Pro',
      timestamp: '5 hours ago',
      status: 'Approved'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Quality Intelligence Overview"
        subtitle="Monitor quality performance, emerging risk patterns, and corrective actions across the school group."
        breadcrumbs={['Overview', 'Quality Overview']}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>
        }
      />

      {/* Interactive Global Filter Bar */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <Filter className="w-4 h-4 text-brand-400" />
          <span>Active Filters:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="text-slate-500 mr-1.5 font-medium">Campus:</label>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-slate-200"
            >
              <option value="all">All Schools (5)</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-slate-500 mr-1.5 font-medium">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-slate-200"
            >
              <option value="all">All Categories</option>
              <option value="Attendance gaps">Attendance gaps</option>
              <option value="Incomplete assessments">Incomplete assessments</option>
              <option value="Timetable conflicts">Timetable conflicts</option>
              <option value="Safeguarding incidents">Safeguarding incidents</option>
              <option value="Communication failures">Communication failures</option>
              <option value="Learning decline">Learning decline</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 mr-1.5 font-medium">Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-md px-2.5 py-1 text-slate-200"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            onClick={() => { setSelectedSchoolFilter('all'); setCategoryFilter('all'); setSeverityFilter('all'); }}
            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 ml-2"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Inspections"
          value={totalInspectionsVal}
          change="+12.4%"
          trend="up"
          sparkline={[32, 38, 41, 45, totalInspectionsVal]}
          icon={ClipboardCheck}
        />
        <KPICard
          title="Defects Detected"
          value={defectsCountVal}
          change="-8.1%"
          trend="down"
          sparkline={[19, 18, 16, 15, defectsCountVal]}
          icon={AlertTriangle}
        />
        <KPICard
          title="Critical Issues"
          value={criticalCountVal}
          change="0.0%"
          trend="flat"
          sparkline={[2, 3, 2, 2, criticalCountVal]}
          icon={Flame}
        />
        <KPICard
          title="Recurring Issues"
          value={recurringCountVal}
          change="-15.0%"
          trend="down"
          sparkline={[7, 6, 5, 4, recurringCountVal]}
          icon={RotateCcw}
        />
        <KPICard
          title="Open CAPAs"
          value={openCapasVal}
          change="-25.0%"
          trend="down"
          sparkline={[6, 5, 4, 4, openCapasVal]}
          icon={ShieldCheck}
        />
        <KPICard
          title="CAPA Effectiveness"
          value="94.8%"
          change="+4.2%"
          trend="up"
          sparkline={[86, 88, 90, 92, 94.8]}
          icon={CheckCircle}
        />
        <KPICard
          title="AI Detection Accuracy"
          value="94.2%"
          change="+1.4%"
          trend="up"
          sparkline={[91, 92.5, 93.8, 94, 94.2]}
          icon={Sparkles}
        />
        <KPICard
          title="Quality Health Index"
          value="91.8/100"
          change="+2.1%"
          trend="up"
          sparkline={[88, 89, 90, 91, 91.8]}
          icon={Award}
        />
      </div>

      {/* Main Charts & Intelligence Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Data Visualization Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Quality Trend Over Time */}
          <Card title="Quality Inspection & Defect Trend Over Time" subtitle="30-day trailing volume of digital inspections vs defects detected and CAPAs resolved.">
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDefects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="inspections" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInspections)" name="Inspections" />
                  <Area type="monotone" dataKey="defects" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDefects)" name="Defects" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart Grid: Defects by Category & Severity Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 2: Defects by Category */}
            <Card title="Defects by Category" subtitle="Defect volume broken down by operational domain.">
              <div className="h-60 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defectsByCategory} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={110} tickFormatter={(val) => val.split(' ')[0]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {defectsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 3: Severity Distribution */}
            <Card title="Severity Distribution" subtitle="Risk classification ratio of active defects.">
              <div className="h-60 w-full mt-2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Chart 4: Pareto Chart (80/20 Rule Analysis) */}
          <Card title="Pareto Defect Impact Analysis" subtitle="Identify vital 20% root cause categories producing 80% of total quality defects.">
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#8b5cf6" fontSize={10} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Defect Count" />
                  <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} name="Cumulative %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: AI Quality Intelligence Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Decision Support Feed</span>
            </h3>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Gemini 1.5 Pro
            </span>
          </div>

          <div className="space-y-4">
            {aiInsightsList.map(insight => (
              <AIInsightCard
                key={insight.id}
                id={insight.id}
                title={insight.title}
                summary={insight.summary}
                confidence={insight.confidence}
                evidence={insight.evidence}
                recommendedAction={insight.recommendedAction}
                model={insight.model}
                timestamp={insight.timestamp}
                status={insight.status}
                onDecision={(payload) => handleAIDecision({ insightId: insight.id, ...payload })}
              />
            ))}
          </div>

          {/* School Performance Ranking */}
          <Card title="Campus Quality Scores" subtitle="Comparative audit health score across schools.">
            <div className="space-y-3 mt-2 text-xs">
              {schoolComparison.map((sch, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">{sch.fullName}</div>
                    <div className="text-[10px] text-slate-400">{sch.inspections} Inspections • {sch.defects} Defects</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-100 text-sm">{sch.score}/100</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Compliant</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
