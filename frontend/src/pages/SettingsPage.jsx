import React, { useState } from 'react';
import { Settings, Sparkles, Building, Bell, Shield, Database, Save, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('org'); // org | ai | notif | retention
  const [isSaved, setIsSaved] = useState(false);

  // Settings State
  const [orgName, setOrgName] = useState('Global K-12 Academies Group');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [aiConfidence, setAiConfidence] = useState(85);
  const [aiModel, setAiModel] = useState('gemini-1.5-pro');
  const [requireReason, setRequireReason] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [retentionDays, setRetentionDays] = useState(365);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Configuration & Preferences"
        subtitle="Manage organization parameters, AI confidence thresholds, notification rules, and data retention policies."
        breadcrumbs={['Settings', 'System Settings']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {[
            { id: 'org', label: 'Organization Profile', icon: Building },
            { id: 'ai', label: 'Gemini AI Configuration', icon: Sparkles },
            { id: 'notif', label: 'Notification Rules', icon: Bell },
            { id: 'retention', label: 'Data Retention & Audit', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3">
          <Card title="System Parameters Settings">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {activeTab === 'org' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">School Group Organization Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Current Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Active Google Gemini AI Model</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                      <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Minimum AI Confidence Threshold ({aiConfidence}%)
                    </label>
                    <input
                      type="range"
                      min="70"
                      max="98"
                      value={aiConfidence}
                      onChange={(e) => setAiConfidence(Number(e.target.value))}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Classifications below {aiConfidence}% will automatically trigger manual human review.</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="overrideCheck"
                      checked={requireReason}
                      onChange={(e) => setRequireReason(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500"
                    />
                    <label htmlFor="overrideCheck" className="font-semibold text-slate-200">
                      Mandate written reason for human overrides on AI predictions
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'notif' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="escalateCheck"
                      checked={autoEscalate}
                      onChange={(e) => setAutoEscalate(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500"
                    />
                    <label htmlFor="escalateCheck" className="font-semibold text-slate-200">
                      Automatically escalate Critical defects to Quality Manager via Email & Portal
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'retention' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Audit Log Retention Period (Days)</label>
                    <input
                      type="number"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> System settings updated successfully!
                  </span>
                ) : (
                  <span />
                )}

                <Button type="submit" variant="primary" icon={Save}>
                  Save System Preferences
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
