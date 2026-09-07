import React from 'react';
import { FileSpreadsheet, ShieldCheck, Lock, Activity } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { useData } from '../context/DataContext';

export const AuditLogsPage = () => {
  const { auditLogs } = useData();

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => <span className="font-mono text-slate-400 text-xs">{row.timestamp}</span>
    },
    {
      header: 'Actor / User',
      key: 'user',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-100">{row.user}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.role}</div>
        </div>
      )
    },
    {
      header: 'System Action',
      key: 'action',
      render: (row) => (
        <span className="font-mono font-bold text-brand-400 text-xs">{row.action}</span>
      )
    },
    {
      header: 'Target Entity',
      key: 'entity',
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
          {row.entity} ({row.entityId})
        </span>
      )
    },
    {
      header: 'Outcome',
      key: 'outcome',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {row.outcome || 'SUCCESS'}
        </span>
      )
    },
    {
      header: 'Event Details',
      key: 'details',
      render: (row) => <span className="text-slate-300 text-xs">{row.details}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable System Audit Logs"
        subtitle="Cryptographically verified immutable audit trail tracking logins, data modifications, AI decision approvals, overrides, and administrative actions."
        breadcrumbs={['Audit Logs', 'Immutable Logs']}
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail Immutable & Read-Only</span>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={auditLogs}
        searchPlaceholder="Search audit logs by user, action, entity, or detail text..."
      />
    </div>
  );
};
