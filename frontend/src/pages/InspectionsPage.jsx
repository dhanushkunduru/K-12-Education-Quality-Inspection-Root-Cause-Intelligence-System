import React, { useState } from 'react';
import { ClipboardCheck, Plus, CheckCircle2, XCircle, AlertCircle, FileText, Upload, ShieldAlert, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge, SeverityBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, Drawer } from '../components/ui/Modal';
import { useData } from '../context/DataContext';

export const InspectionsPage = () => {
  const { inspections, schools, addInspection, addDefect } = useData();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeInspectionDrawer, setActiveInspectionDrawer] = useState(null);

  // New Inspection Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSchoolId, setNewSchoolId] = useState('sch-1');
  const [newCategory, setNewCategory] = useState('Attendance gaps');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Defect Creation Drawer state
  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [defectTitle, setDefectTitle] = useState('');
  const [defectCategory, setDefectCategory] = useState('Attendance gaps');
  const [defectSeverity, setDefectSeverity] = useState('High');
  const [defectDescription, setDefectDescription] = useState('');

  const filteredInspections = inspections.filter(i => {
    if (selectedStatusFilter !== 'all' && i.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await addInspection({
      title: newTitle || 'Digital Quality Audit',
      schoolId: newSchoolId,
      category: newCategory,
      scheduledDate: newDate,
      checklistItems: [
        { id: `chk-${Date.now()}-1`, text: 'Verify attendance reconciliations against parent portal', status: 'Pending', notes: '' },
        { id: `chk-${Date.now()}-2`, text: 'Validate assessment rubric publication', status: 'Pending', notes: '' },
        { id: `chk-${Date.now()}-3`, text: 'Audit safeguarding incident response SLA (< 24h)', status: 'Pending', notes: '' }
      ]
    });
    setIsSaving(false);
    setCreateModalOpen(false);
    setNewTitle('');
  };

  const handleToggleChecklistStatus = (checkId, newStatus) => {
    if (!activeInspectionDrawer) return;
    const updatedItems = activeInspectionDrawer.checklistItems.map(item => {
      if (item.id === checkId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    const updatedInspection = {
      ...activeInspectionDrawer,
      checklistItems: updatedItems
    };

    setActiveInspectionDrawer(updatedInspection);

    // If fail, open defect creation modal preset
    if (newStatus === 'Fail') {
      const failedItem = updatedItems.find(i => i.id === checkId);
      setDefectTitle(`Defect: ${failedItem?.text || 'Inspection Checklist Failure'}`);
      setDefectCategory(activeInspectionDrawer.category);
      setDefectDescription(failedItem?.notes || 'Checklist verification failed during digital inspection.');
      setDefectModalOpen(true);
    }
  };

  const handleSaveDefect = async (e) => {
    e.preventDefault();
    if (!activeInspectionDrawer) return;
    await addDefect({
      inspectionId: activeInspectionDrawer.id,
      title: defectTitle,
      schoolId: activeInspectionDrawer.schoolId,
      category: defectCategory,
      severity: defectSeverity,
      description: defectDescription,
      evidenceText: defectDescription
    });
    setDefectModalOpen(false);
    alert('Defect created & Gemini AI classification initiated!');
  };

  const columns = [
    {
      header: 'Inspection ID',
      key: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-brand-400">{row.id}</span>
      )
    },
    {
      header: 'Inspection Title & Campus',
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
      header: 'Inspector',
      key: 'inspectorName',
      render: (row) => <span className="text-slate-300">{row.inspectorName || 'Sophia Chen'}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Severity',
      key: 'severity',
      render: (row) => <SeverityBadge severity={row.severity} />
    },
    {
      header: 'Score',
      key: 'score',
      render: (row) => (
        <span className={`font-bold ${row.score >= 90 ? 'text-emerald-400' : row.score >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
          {row.score ? `${row.score}%` : 'N/A'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); setActiveInspectionDrawer(row); }}
        >
          Execute / View
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Quality Inspections"
        subtitle="Manage scheduled inspection plans, execute digital sampling checklists, record measurements, and log defect evidence."
        breadcrumbs={['Inspections', 'Digital Inspections']}
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreateModalOpen(true)}>
            Schedule New Inspection
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap text-xs">
        {['all', 'Scheduled', 'In Progress', 'Pending Review', 'Completed', 'Escalated'].map(st => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedStatusFilter === st
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st === 'all' ? 'All Statuses' : st}
          </button>
        ))}
      </div>

      {/* Main Inspection Table */}
      <DataTable
        columns={columns}
        data={filteredInspections}
        searchPlaceholder="Search inspections by ID, school, inspector, or title..."
        onRowClick={(row) => setActiveInspectionDrawer(row)}
      />

      {/* Schedule Inspection Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule Digital Quality Inspection"
      >
        <form onSubmit={handleCreateInspection} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Inspection Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Parent Communication & SLA Review"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">School / Campus</label>
              <select
                value={newSchoolId}
                onChange={(e) => setNewSchoolId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Inspection Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Attendance gaps">Attendance gaps</option>
                <option value="Incomplete assessments">Incomplete assessments</option>
                <option value="Timetable conflicts">Timetable conflicts</option>
                <option value="Safeguarding incidents">Safeguarding incidents</option>
                <option value="Communication failures">Communication failures</option>
                <option value="Learning decline">Learning decline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSaving}>Schedule Inspection</Button>
          </div>
        </form>
      </Modal>

      {/* Digital Inspection Execution Drawer (Section 14) */}
      <Drawer
        isOpen={!!activeInspectionDrawer}
        onClose={() => setActiveInspectionDrawer(null)}
        title={`Inspection Execution: ${activeInspectionDrawer?.id || ''}`}
      >
        {activeInspectionDrawer && (
          <div className="space-y-6 text-xs">
            {/* Header info card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{activeInspectionDrawer.title}</h4>
                <StatusBadge status={activeInspectionDrawer.status} />
              </div>
              <p className="text-slate-400 mt-1">{activeInspectionDrawer.schoolName} • Category: <span className="text-brand-400 font-semibold">{activeInspectionDrawer.category}</span></p>
            </div>

            {/* Checklist Execution runner */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Digital Inspection Sampling Checklist
              </h4>
              <div className="space-y-3">
                {activeInspectionDrawer.checklistItems?.map((chk) => (
                  <div key={chk.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-200 leading-snug">{chk.text}</div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleChecklistStatus(chk.id, 'Pass')}
                          className={`p-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                            chk.status === 'Pass'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                        </button>
                        <button
                          onClick={() => handleToggleChecklistStatus(chk.id, 'Fail')}
                          className={`p-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                            chk.status === 'Fail'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Fail
                        </button>
                      </div>
                    </div>
                    {chk.notes && (
                      <div className="p-2 rounded bg-slate-900 text-[11px] text-amber-300 border border-amber-500/20">
                        Finding Note: {chk.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Measurements */}
            {activeInspectionDrawer.measurements?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Quantitative Quality Measurements
                </h4>
                <div className="space-y-2">
                  {activeInspectionDrawer.measurements.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="font-medium text-slate-300">{m.metric}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">Target: {m.target}</span>
                        <span className={`font-bold ${m.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                          Actual: {m.actual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Uploader Simulator */}
            <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center">
              <Upload className="w-6 h-6 text-brand-400 mx-auto mb-1" />
              <div className="font-semibold text-slate-200">Upload Evidence Document or Photo</div>
              <div className="text-[11px] text-slate-500">PNG, JPG, PDF up to 10MB</div>
              <Button size="sm" variant="outline" className="mt-3">Select Evidence File</Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Log Defect Modal */}
      <Modal
        isOpen={defectModalOpen}
        onClose={() => setDefectModalOpen(false)}
        title="Log Quality Defect Exception"
      >
        <form onSubmit={handleSaveDefect} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Defect Title</label>
            <input
              type="text"
              required
              value={defectTitle}
              onChange={(e) => setDefectTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={defectCategory}
                onChange={(e) => setDefectCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Attendance gaps">Attendance gaps</option>
                <option value="Incomplete assessments">Incomplete assessments</option>
                <option value="Timetable conflicts">Timetable conflicts</option>
                <option value="Safeguarding incidents">Safeguarding incidents</option>
                <option value="Communication failures">Communication failures</option>
                <option value="Learning decline">Learning decline</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Severity</label>
              <select
                value={defectSeverity}
                onChange={(e) => setDefectSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Detailed Finding Description</label>
            <textarea
              rows="3"
              required
              value={defectDescription}
              onChange={(e) => setDefectDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-purple-400 animate-pulse" />
            <span>Gemini AI will automatically run root cause prediction & severity scoring upon logging.</span>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setDefectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" type="submit">Log Defect & Trigger AI</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
