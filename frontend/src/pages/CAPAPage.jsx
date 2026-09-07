import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Clock, AlertTriangle, UserCheck, ShieldAlert, Award, FileText } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, Drawer } from '../components/ui/Modal';
import { useData } from '../context/DataContext';

export const CAPAPage = () => {
  const { capas, addCapa } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCapa, setSelectedCapa] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // New CAPA Form State
  const [defectTitle, setDefectTitle] = useState('');
  const [ownerName, setOwnerName] = useState('Marcus Sterling');
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [containmentAction, setContainmentAction] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Verification Form State
  const [effectivenessScore, setEffectivenessScore] = useState(92);
  const [verificationNotes, setVerificationNotes] = useState('Verified log reconciliation following 14-day sample observation period.');

  const filteredCapas = capas.filter(c => {
    if (activeTab === 'open' && c.status === 'Closed') return false;
    if (activeTab === 'closed' && c.status !== 'Closed') return false;
    return true;
  });

  const handleCreateCapa = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await addCapa({
      defectTitle: defectTitle || 'Grade 8 Attendance Log Reconciliation',
      ownerName,
      priority,
      dueDate,
      containmentAction,
      correctiveAction,
      preventiveAction
    });
    setIsSaving(false);
    setCreateModalOpen(false);
    setDefectTitle('');
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!selectedCapa) return;
    selectedCapa.effectivenessScore = effectivenessScore;
    selectedCapa.verificationStatus = effectivenessScore >= 85 ? 'Effective' : 'Ineffective';
    selectedCapa.status = effectivenessScore >= 85 ? 'Closed' : 'Pending Verification';
    setVerifyModalOpen(false);
    alert(`CAPA verified with ${effectivenessScore}% Effectiveness Score! Status updated to ${selectedCapa.status}.`);
  };

  const columns = [
    {
      header: 'CAPA ID',
      key: 'id',
      render: (row) => <span className="font-mono font-bold text-brand-400">{row.id}</span>
    },
    {
      header: 'Defect Action Title & Campus',
      key: 'defectTitle',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-100">{row.defectTitle}</div>
          <div className="text-[11px] text-slate-400">{row.schoolName}</div>
        </div>
      )
    },
    {
      header: 'Owner',
      key: 'ownerName',
      render: (row) => <span className="text-slate-300 font-medium">{row.ownerName}</span>
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => (
        <Badge variant={row.priority === 'High' ? 'high' : 'medium'}>{row.priority}</Badge>
      )
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (row) => <span className="text-slate-400 font-mono">{row.dueDate}</span>
    },
    {
      header: 'Effectiveness',
      key: 'effectivenessScore',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${row.effectivenessScore >= 85 ? 'bg-emerald-500' : row.effectivenessScore > 0 ? 'bg-amber-500' : 'bg-slate-700'}`}
              style={{ width: `${row.effectivenessScore || 0}%` }}
            />
          </div>
          <span className="font-bold text-slate-200">{row.effectivenessScore ? `${row.effectivenessScore}%` : 'Pending'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedCapa(row)}>
          Manage CAPA
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CAPA Management & Closed-Loop Verification"
        subtitle="Corrective and Preventive Action execution. Define containment steps, systemic corrective actions, preventive safeguards, and verify effectiveness."
        breadcrumbs={['CAPA', 'CAPA Workflow']}
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreateModalOpen(true)}>
            Initiate New CAPA Plan
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All CAPAs ({capas.length})
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'open' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Active Open CAPAs ({capas.filter(c => c.status !== 'Closed').length})
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'closed' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Closed & Verified CAPAs ({capas.filter(c => c.status === 'Closed').length})
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCapas}
        searchPlaceholder="Search CAPAs by ID, title, or owner..."
        onRowClick={(row) => setSelectedCapa(row)}
      />

      {/* Initiate CAPA Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Initiate Corrective & Preventive Action Plan (CAPA)"
      >
        <form onSubmit={handleCreateCapa} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Target Defect / Problem Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Grade 8 Attendance Log Reconciliation Defect"
              value={defectTitle}
              onChange={(e) => setDefectTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assign Owner</label>
              <select
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Marcus Sterling">Marcus Sterling (Quality Engineer)</option>
                <option value="Dr. Evelyn Vance">Dr. Evelyn Vance (Quality Manager)</option>
                <option value="Elena Rostova">Elena Rostova (Inspector)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Completion Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-amber-400 mb-1">1. Containment Action (Short Term)</label>
              <textarea
                rows="2"
                required
                placeholder="Immediate action to isolate defect risk within 24 hours..."
                value={containmentAction}
                onChange={(e) => setContainmentAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-400 mb-1">2. Corrective Action (Root Cause Fix)</label>
              <textarea
                rows="2"
                required
                placeholder="Systemic modification to address verified root cause..."
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-400 mb-1">3. Preventive Action (Process Safeguard)</label>
              <textarea
                rows="2"
                required
                placeholder="Long-term procedural change to prevent recurrence across group..."
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSaving}>Submit & Assign CAPA</Button>
          </div>
        </form>
      </Modal>

      {/* CAPA Detail Drawer */}
      <Drawer
        isOpen={!!selectedCapa}
        onClose={() => setSelectedCapa(null)}
        title={`CAPA Action Plan Details: ${selectedCapa?.id || ''}`}
      >
        {selectedCapa && (
          <div className="space-y-6 text-xs">
            <div>
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedCapa.status} />
                <span className="font-mono text-slate-400">{selectedCapa.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-2">{selectedCapa.defectTitle}</h3>
              <p className="text-slate-400 mt-1">Owner: <strong className="text-slate-200">{selectedCapa.ownerName}</strong> • Due: <span className="text-amber-400 font-mono">{selectedCapa.dueDate}</span></p>
            </div>

            {/* Action Breakdown Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                <span className="font-bold text-amber-400 block mb-1">1. Containment Action</span>
                <p className="text-slate-300 leading-relaxed">{selectedCapa.containmentAction}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-brand-500/30">
                <span className="font-bold text-brand-400 block mb-1">2. Systemic Corrective Action</span>
                <p className="text-slate-300 leading-relaxed">{selectedCapa.correctiveAction}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block mb-1">3. Preventive Safeguard Action</span>
                <p className="text-slate-300 leading-relaxed">{selectedCapa.preventiveAction}</p>
              </div>
            </div>

            {/* Verification Sign-Off Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Closed-Loop Verification Status</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedCapa.effectivenessScore ? `${selectedCapa.effectivenessScore}% Score` : 'Unverified'}
                </span>
              </div>

              {selectedCapa.status === 'Closed' ? (
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Verified Effective by Arthur Pendelton (Auditor). CAPA is officially closed.</span>
                </div>
              ) : (
                <Button variant="primary" icon={Award} className="w-full justify-center" onClick={() => setVerifyModalOpen(true)}>
                  Perform Auditor Effectiveness Verification
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Verify Effectiveness Modal */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Auditor CAPA Effectiveness Verification Sign-Off"
      >
        <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Effectiveness Evaluation Score (0 - 100%)</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={effectivenessScore}
              onChange={(e) => setEffectivenessScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Scores ≥ 85% mark CAPA as Effective and automatically Close record.</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Audit Verification Notes & Evidence</label>
            <textarea
              rows="3"
              required
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setVerifyModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Sign Off Verification</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
