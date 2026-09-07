import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, Edit3, ShieldAlert, Cpu } from 'lucide-react';
import { AIConfidenceBadge } from './Badge';
import { Button } from './Button';

export const AIInsightCard = ({
  id,
  title,
  summary,
  confidence = 0.92,
  evidence,
  recommendedAction,
  model = 'Gemini 1.5 Pro (v2.4.1)',
  timestamp = '2 hours ago',
  status = 'Pending Review',
  onDecision
}) => {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideCategory, setOverrideCategory] = useState('');
  const [overrideSeverity, setOverrideSeverity] = useState('Medium');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (decision) => {
    if (decision === 'Override' && !overrideReason.trim()) {
      alert('Please state a reason for overriding AI recommendation');
      return;
    }

    setIsSubmitting(true);
    if (onDecision) {
      await onDecision({
        id,
        decision,
        overrideReason: decision === 'Override' ? overrideReason : null,
        category: overrideCategory,
        severity: overrideSeverity
      });
    }
    setIsSubmitting(false);
    setShowOverrideModal(false);
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-purple-500/30 bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-900/90 ai-card-glow relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">AI Quality Intelligence</span>
        </div>
        <AIConfidenceBadge confidence={confidence} model={model} />
      </div>

      {/* Main Content */}
      <div className="mt-3">
        <h4 className="text-base font-semibold text-slate-100">{title}</h4>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{summary}</p>
      </div>

      {/* Evidence Section */}
      <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Supporting Empirical Evidence:</span>
        </div>
        <p className="text-slate-300">{evidence}</p>

        {recommendedAction && (
          <div className="mt-2 pt-2 border-t border-slate-800 text-slate-300">
            <span className="font-semibold text-slate-200">Recommended CAPA Action: </span>
            {recommendedAction}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-purple-400" /> {model}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-300">Status: </span>
          <span className={status === 'Approved' ? 'text-emerald-400 font-bold' : status === 'Overridden' ? 'text-amber-400 font-bold' : 'text-blue-400'}>
            {status}
          </span>
        </div>
      </div>

      {/* Decision Buttons */}
      {status === 'Pending Review' && (
        <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={XCircle}
            onClick={() => handleAction('Reject')}
            disabled={isSubmitting}
          >
            Reject
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={Edit3}
            onClick={() => setShowOverrideModal(true)}
            disabled={isSubmitting}
          >
            Override
          </Button>
          <Button
            size="sm"
            variant="ai"
            icon={CheckCircle2}
            onClick={() => handleAction('Approve')}
            loading={isSubmitting}
          >
            Approve AI Recommendation
          </Button>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" /> Override AI Decision
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Human oversight rule: State the operational reason for overriding Gemini AI classification.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjust Category (Optional)</label>
                <select
                  value={overrideCategory}
                  onChange={(e) => setOverrideCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Keep AI Category</option>
                  <option value="Attendance gaps">Attendance gaps</option>
                  <option value="Incomplete assessments">Incomplete assessments</option>
                  <option value="Timetable conflicts">Timetable conflicts</option>
                  <option value="Safeguarding incidents">Safeguarding incidents</option>
                  <option value="Communication failures">Communication failures</option>
                  <option value="Learning decline">Learning decline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjust Severity</label>
                <select
                  value={overrideSeverity}
                  onChange={(e) => setOverrideSeverity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Override (Required)</label>
                <textarea
                  rows="3"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Local school context indicates this is contained to single lab section..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowOverrideModal(false)}>Cancel</Button>
              <Button size="sm" variant="primary" onClick={() => handleAction('Override')} loading={isSubmitting}>
                Save Human Override
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
