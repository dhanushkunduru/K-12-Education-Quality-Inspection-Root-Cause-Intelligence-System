import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead } = useData();
  const [filter, setFilter] = useState('all'); // all | unread | read
  const navigate = useNavigate();

  const filtered = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'read' && !n.read) return false;
    return true;
  });

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.targetRoute) {
      navigate(notif.targetRoute);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center & Escalation Alerts"
        subtitle="Real-time system events, critical defect alerts, AI decision approvals, and CAPA deadline reminders."
        breadcrumbs={['Notifications', 'Notification Center']}
      />

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'unread' ? 'bg-brand-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
              !notif.read
                ? 'bg-slate-900 border-brand-500/40 shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl border shrink-0 ${
                notif.type === 'Critical'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : notif.type === 'AI Result'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : 'bg-brand-500/20 text-brand-400 border-brand-500/30'
              }`}>
                {notif.type === 'Critical' ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">{notif.createdAt}</div>
              </div>
            </div>

            <Button size="sm" variant="ghost" icon={ArrowRight}>View Record</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
