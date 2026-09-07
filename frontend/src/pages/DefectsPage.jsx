import React, { useState } from 'react';
import { AlertTriangle, LayoutGrid, List, RotateCcw, GitMerge, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { SeverityBadge, StatusBadge, AIConfidenceBadge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export const DefectsPage = () => {
  const { defects } = useData();
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'table'
  const [selectedDefect, setSelectedDefect] = useState(null);

  const workflowStages = [
    'Evidence Capture',
    'AI Detection',
    'Classification',
    'Severity Scoring',
    'Root Cause',
    'CAPA',
    'Verification',
    'Closure'
  ];

  const columns = [
    {
      header: 'Defect ID',
      key: 'id',
      render: (row) => <span className="font-mono font-bold text-red-400">{row.id}</span>
    },
    {
      header: 'Defect Summary & School',
      key: 'title',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-100">{row.title}</div>
          <div className="text-[11px] text-slate-400">{row.schoolName}</div>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
          {row.category}
        </span>
      )
    },
    {
      header: 'Severity',
      key: 'severity',
      render: (row) => <SeverityBadge severity={row.severity} />
    },
    {
      header: 'Recurrence',
      key: 'recurrenceCount',
      render: (row) => (
        <span className="flex items-center gap-1 font-semibold text-amber-400">
          <RotateCcw className="w-3 h-3" /> {row.recurrenceCount}x
        </span>
      )
    },
    {
      header: 'Stage Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedDefect(row)}>
          Inspect Workflow
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Defect Review & Workflow Tracker"
        subtitle="Review identified non-conformances across school group operations and follow end-to-end CAPA closure progression."
        breadcrumbs={['Defects', 'Defect Review']}
        actions={
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'gallery' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Gallery View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table View
            </button>
          </div>
        }
      />

      {viewMode === 'gallery' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defects.map(def => (
            <div
              key={def.id}
              onClick={() => setSelectedDefect(def)}
              className="glass-panel rounded-xl border border-slate-800 hover:border-brand-500/40 glass-card-hover p-5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-red-400">{def.id}</span>
                  <SeverityBadge severity={def.severity} />
                </div>

                <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-2">{def.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{def.schoolName}</p>
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">{def.description}</p>

                {/* Evidence Image Thumbnail */}
                {def.evidenceUrls?.[0] && (
                  <div className="mt-3 h-28 rounded-lg overflow-hidden border border-slate-800">
                    <img src={def.evidenceUrls[0]} alt="Defect Evidence" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-amber-400">
                  <RotateCcw className="w-3.5 h-3.5" /> Recurred {def.recurrenceCount}x
                </span>
                <StatusBadge status={def.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={defects}
          searchPlaceholder="Search defects by ID, school, or category..."
          onRowClick={(row) => setSelectedDefect(row)}
        />
      )}

      {/* Defect Workflow Stepper Drawer */}
      <Drawer
        isOpen={!!selectedDefect}
        onClose={() => setSelectedDefect(null)}
        title={`Defect Workflow Lifecycle: ${selectedDefect?.id || ''}`}
      >
        {selectedDefect && (
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <SeverityBadge severity={selectedDefect.severity} />
                <span className="font-mono text-slate-400">{selectedDefect.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-2">{selectedDefect.title}</h3>
              <p className="text-slate-400 mt-1">{selectedDefect.schoolName} • Category: <span className="text-brand-400 font-semibold">{selectedDefect.category}</span></p>
            </div>

            {/* Workflow Stage Stepper Progression (Section 15) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quality Resolution Pipeline
              </h4>
              <div className="space-y-2">
                {workflowStages.map((stageName, idx) => {
                  const currentStageIdx = 4; // Mock progression
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                        isCurrent
                          ? 'bg-brand-600/15 border-brand-500/50 text-slate-100 font-semibold'
                          : isCompleted
                          ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span>{stageName}</span>
                      </div>
                      {isCurrent && <span className="text-[10px] text-brand-400 font-bold uppercase">Active Stage</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Classification Evidence Box */}
            {selectedDefect.aiClassification && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Gemini AI Classification
                  </span>
                  <AIConfidenceBadge confidence={selectedDefect.aiClassification.confidence || 0.94} />
                </div>
                <p className="text-slate-300 leading-relaxed">{selectedDefect.aiClassification.explanation}</p>
                <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Model: {selectedDefect.aiClassification.model}</span>
                  <span className="font-bold text-emerald-400">Status: {selectedDefect.aiClassification.status}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
