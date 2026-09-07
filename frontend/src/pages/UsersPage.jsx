import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, Lock, Key } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const UsersPage = () => {
  const [activeView, setActiveView] = useState('users'); // users | matrix

  const usersList = [
    { id: 'usr-1', name: 'Dr. Evelyn Vance', email: 'evelyn.vance@k12quality.edu', role: 'Manager', schoolName: 'Greenfield International', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'usr-2', name: 'Marcus Sterling', email: 'marcus.sterling@k12quality.edu', role: 'Quality Engineer', schoolName: 'Oakridge Academy', status: 'Active', lastLogin: '1 day ago' },
    { id: 'usr-3', name: 'Sophia Chen', email: 'sophia.chen@k12quality.edu', role: 'Inspector', schoolName: 'Riverside Public School', status: 'Active', lastLogin: '3 hours ago' },
    { id: 'usr-4', name: 'Arthur Pendelton', email: 'arthur.p@k12quality.edu', role: 'Auditor', schoolName: 'Sunrise International', status: 'Active', lastLogin: '5 hours ago' },
    { id: 'usr-5', name: 'Elena Rostova', email: 'elena.rostova@k12quality.edu', role: 'Inspector', schoolName: 'Heritage High School', status: 'Active', lastLogin: 'Yesterday' }
  ];

  const permissionMatrix = [
    { feature: 'View Quality Dashboard', Manager: true, QualityEngineer: true, Inspector: true, Auditor: true },
    { feature: 'Execute Digital Inspections', Manager: true, QualityEngineer: true, Inspector: true, Auditor: false },
    { feature: 'Approve / Override AI Classification', Manager: true, QualityEngineer: true, Inspector: false, Auditor: false },
    { feature: 'Initiate CAPA Plans', Manager: true, QualityEngineer: true, Inspector: false, Auditor: false },
    { feature: 'Sign Off Auditor Verification', Manager: true, QualityEngineer: false, Inspector: false, Auditor: true },
    { feature: 'Modify System Settings & AI Thresholds', Manager: true, QualityEngineer: false, Inspector: false, Auditor: false }
  ];

  const columns = [
    {
      header: 'User Name',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/40 text-brand-400 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-100">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => (
        <Badge variant={row.role === 'Manager' ? 'brand' : row.role === 'Quality Engineer' ? 'ai' : 'default'}>
          {row.role}
        </Badge>
      )
    },
    {
      header: 'Campus Assignment',
      key: 'schoolName',
      render: (row) => <span className="text-slate-300">{row.schoolName}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {row.status}
        </span>
      )
    },
    {
      header: 'Last Login',
      key: 'lastLogin',
      render: (row) => <span className="text-slate-400 text-xs font-mono">{row.lastLogin}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Role Access Management"
        subtitle="Manage platform users, assign operational roles, and enforce strict Role-Based Access Control (RBAC) permissions."
        breadcrumbs={['Users', 'Users & Roles']}
        actions={
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('users')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'users' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              User Directory
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'matrix' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Permission Matrix
            </button>
          </div>
        }
      />

      {activeView === 'users' ? (
        <DataTable
          columns={columns}
          data={usersList}
          searchPlaceholder="Search users by name, email, or role..."
        />
      ) : (
        <Card title="Role-Based Access Control (RBAC) Matrix" subtitle="Detailed breakdown of permissions granted to each organizational role.">
          <div className="overflow-x-auto mt-2 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3.5 px-4">System Feature / Action</th>
                  <th className="py-3.5 px-4 text-center">Manager</th>
                  <th className="py-3.5 px-4 text-center">Quality Engineer</th>
                  <th className="py-3.5 px-4 text-center">Inspector</th>
                  <th className="py-3.5 px-4 text-center">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {permissionMatrix.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{p.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      <CheckCircle2 className={`w-4 h-4 mx-auto ${p.Manager ? 'text-emerald-400' : 'text-slate-700'}`} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CheckCircle2 className={`w-4 h-4 mx-auto ${p.QualityEngineer ? 'text-emerald-400' : 'text-slate-700'}`} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CheckCircle2 className={`w-4 h-4 mx-auto ${p.Inspector ? 'text-emerald-400' : 'text-slate-700'}`} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CheckCircle2 className={`w-4 h-4 mx-auto ${p.Auditor ? 'text-emerald-400' : 'text-slate-700'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
