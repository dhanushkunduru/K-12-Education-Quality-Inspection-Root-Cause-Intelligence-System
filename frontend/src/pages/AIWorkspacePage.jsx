import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle2, XCircle, Edit3, Cpu, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIConfidenceBadge, SeverityBadge } from '../components/ui/Badge';
import { api } from '../services/api';
import { useData } from '../context/DataContext';

export const AIWorkspacePage = () => {
  const { schools, handleAIDecision } = useData();
  const [evidenceText, setEvidenceText] = useState(
    'Grade 8 homeroom attendance log submissions show a 14% unaccounted gap across 3 campuses during August monthly reporting. Parent portal auto-notifications were delayed past the 48-hour mandatory window.'
  );
  const [selectedSchool, setSelectedSchool] = useState('Greenfield International School');
  const [selectedCategory, setSelectedCategory] = useState('Attendance gaps');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const stagesList = [
    '1. Ingesting & OCR Document Parsing...',
    '2. Running Gemini 1.5 Pro Semantic Classifier...',
    '3. Calculating Risk Severity & Multi-Campus Impact...',
    '4. Cross-Referencing Historical Pareto Defect Database...',
    '5. Generating CAPA Containment Recommendations...'
  ];

  const handleRunAIAnalysis = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);
    setProcessingStage(0);

    for (let i = 0; i < stagesList.length; i++) {
      setProcessingStage(i);
      await new Promise(res => setTimeout(res, 600));
    }

    const result = await api.analyzeEvidence({
      evidenceText,
      category: selectedCategory,
      schoolName: selectedSchool
    });

    setAnalysisResult(result);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Quality Intelligence Workspace"
        subtitle="Empirical Gemini AI decision-support system. Upload inspection findings or incident text to auto-classify defects, predict severity, and retrieve corrective actions."
        breadcrumbs={['AI Workspace', 'Defect Classifier']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Evidence Input Box */}
        <div className="space-y-4">
          <Card title="Inspection Evidence & Incident Input" subtitle="Paste text evidence or select pre-defined incident templates.">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Campus</label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Domain Category Hint</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                <label className="block font-semibold text-slate-300 mb-1">Evidence Text & Finding Description</label>
                <textarea
                  rows="6"
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Paste observation notes, audit checklist findings, or parent ticket logs..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-brand-500 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Gemini 1.5 Pro • 0.94 Confidence Model</span>
                <Button
                  variant="ai"
                  size="md"
                  icon={Sparkles}
                  loading={isProcessing}
                  onClick={handleRunAIAnalysis}
                >
                  Run Gemini Intelligence Analysis
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Processing State or Results */}
        <div>
          {isProcessing ? (
            <Card title="Gemini AI Analysis In Progress..." hoverEffect={false}>
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center" />
                  <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200">{stagesList[processingStage]}</h4>
                  <p className="text-xs text-slate-400">Processing evidence with Google Gemini AI Engine</p>
                </div>
              </div>
            </Card>
          ) : analysisResult ? (
            <div className="space-y-4 animate-fade-in">
              <div className="glass-panel rounded-xl p-6 border border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 ai-card-glow">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                    <span className="text-sm font-bold text-purple-300">Gemini Classification Result</span>
                  </div>
                  <AIConfidenceBadge confidence={analysisResult.confidence} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Predicted Category</span>
                    <span className="text-slate-100 font-bold text-sm">{analysisResult.category}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Severity Grade</span>
                    <SeverityBadge severity={analysisResult.severity} />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">Evidence-Based Explanation:</div>
                  <p className="text-slate-300 leading-relaxed p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    {analysisResult.explanation}
                  </p>

                  <div className="pt-2">
                    <div className="font-semibold text-slate-200 mb-1">Key Empirical Evidence Points:</div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                      {analysisResult.evidencePoints?.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="font-semibold text-purple-300 mb-1">Recommended CAPA Action:</div>
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 font-medium">
                      {analysisResult.recommendedAction}
                    </div>
                  </div>
                </div>

                {/* Human Governance Approval */}
                <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Human Control Governance Required</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" icon={XCircle} onClick={() => alert('Result rejected by Quality Manager')}>
                      Reject
                    </Button>
                    <Button size="sm" variant="ai" icon={CheckCircle2} onClick={() => alert('Result approved & logged to Audit Trail')}>
                      Approve Result
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card title="AI Intelligence Ready" hoverEffect={false}>
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-10 h-10 text-purple-400/50 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">Run analysis on inspection evidence</p>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Click 'Run Gemini Intelligence Analysis' to process the finding text and generate structured decision support.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
