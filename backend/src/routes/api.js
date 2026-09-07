const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/aiService');
const {
  SCHOOLS,
  USERS,
  INSPECTIONS,
  DEFECTS,
  ROOT_CAUSES,
  CAPAS,
  AI_INSIGHTS,
  MODEL_HEALTH,
  PARETO_DATA,
  NOTIFICATIONS,
  AUDIT_LOGS,
  SETTINGS
} = require('../data/mockData');

// In-Memory Mutable State Store
let state = {
  schools: [...SCHOOLS],
  users: [...USERS],
  inspections: [...INSPECTIONS],
  defects: [...DEFECTS],
  rootCauses: [...ROOT_CAUSES],
  capas: [...CAPAS],
  aiInsights: [...AI_INSIGHTS],
  notifications: [...NOTIFICATIONS],
  auditLogs: [...AUDIT_LOGS],
  settings: { ...SETTINGS }
};

// Helper: Log audit trail
function logAuditEvent({ user = 'System User', role = 'Manager', action, entity, entityId, outcome = 'SUCCESS', details }) {
  const newLog = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    role,
    action,
    entity,
    entityId,
    outcome,
    details
  };
  state.auditLogs.unshift(newLog);
  return newLog;
}

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
router.get('/health', (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ----------------------------------------------------
// Authentication API
// ----------------------------------------------------
router.post('/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Find matching user or fallback to standard demo user for specified role
  let user = state.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user && role) {
    user = state.users.find(u => u.role === role) || state.users[0];
  }
  if (!user) {
    user = state.users[0];
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId },
    process.env.JWT_SECRET || 'k12_secret_key',
    { expiresIn: '24h' }
  );

  logAuditEvent({
    user: user.name,
    role: user.role,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    details: `User authenticated as ${user.role}`
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      avatar: user.avatar
    }
  });
});

// ----------------------------------------------------
// Dashboard & Analytics Overview API
// ----------------------------------------------------
router.get('/dashboard', (req, res) => {
  const { schoolId, dateRange } = req.query;

  let filteredInspections = state.inspections;
  let filteredDefects = state.defects;
  let filteredCapas = state.capas;

  if (schoolId && schoolId !== 'all') {
    filteredInspections = filteredInspections.filter(i => i.schoolId === schoolId);
    filteredDefects = filteredDefects.filter(d => d.schoolId === schoolId);
  }

  const totalInspections = filteredInspections.length;
  const defectsDetected = filteredDefects.length;
  const criticalIssues = filteredDefects.filter(d => d.severity === 'Critical').length;
  const recurringIssues = filteredDefects.filter(d => d.recurrenceCount > 1).length;
  const openCapas = filteredCapas.filter(c => c.status !== 'Closed').length;
  
  const effectiveCapas = filteredCapas.filter(c => c.effectivenessScore >= 85).length;
  const capaEffectiveness = filteredCapas.length > 0 
    ? Math.round((effectiveCapas / filteredCapas.length) * 100) 
    : 92;

  const kpis = {
    totalInspections: { value: totalInspections || 48, change: '+12.4%', trend: 'up', sparkline: [32, 38, 41, 45, 48] },
    defectsDetected: { value: defectsDetected || 14, change: '-8.1%', trend: 'down', sparkline: [19, 18, 16, 15, 14] },
    criticalIssues: { value: criticalIssues || 2, change: '0.0%', trend: 'flat', sparkline: [2, 3, 2, 2, 2] },
    recurringIssues: { value: recurringIssues || 4, change: '-15.0%', trend: 'down', sparkline: [7, 6, 5, 4, 4] },
    openCapas: { value: openCapas || 3, change: '-25.0%', trend: 'down', sparkline: [6, 5, 4, 4, 3] },
    capaEffectiveness: { value: `${capaEffectiveness}%`, change: '+4.2%', trend: 'up', sparkline: [86, 88, 90, 91, 92] },
    aiAccuracy: { value: `${MODEL_HEALTH.overallAccuracy}%`, change: '+1.4%', trend: 'up', sparkline: [92, 93, 93.5, 94, 94.2] },
    qualityScore: { value: '91.8/100', change: '+2.1%', trend: 'up', sparkline: [88, 89, 90, 91, 91.8] }
  };

  const trendData = [
    { month: 'Apr', inspections: 38, defects: 19, capas: 8 },
    { month: 'May', inspections: 42, defects: 16, capas: 7 },
    { month: 'Jun', inspections: 45, defects: 15, capas: 6 },
    { month: 'Jul', inspections: 44, defects: 13, capas: 5 },
    { month: 'Aug', inspections: 48, defects: 14, capas: 4 }
  ];

  const defectsByCategory = [
    { name: 'Attendance gaps', count: 48, fill: '#ef4444' },
    { name: 'Communication failures', count: 34, fill: '#f59e0b' },
    { name: 'Incomplete assessments', count: 24, fill: '#3b82f6' },
    { name: 'Timetable conflicts', count: 18, fill: '#8b5cf6' },
    { name: 'Safeguarding incidents', count: 7, fill: '#ec4899' },
    { name: 'Learning decline', count: 4, fill: '#10b981' }
  ];

  const severityDistribution = [
    { name: 'Critical', value: 2, color: '#ef4444' },
    { name: 'High', value: 5, color: '#f97316' },
    { name: 'Medium', value: 4, color: '#f59e0b' },
    { name: 'Low', value: 3, color: '#10b981' }
  ];

  const schoolComparison = state.schools.map(s => ({
    name: s.name.split(' ')[0],
    fullName: s.name,
    inspections: Math.floor(Math.random() * 10) + 8,
    defects: Math.floor(Math.random() * 5) + 2,
    score: Math.floor(Math.random() * 15) + 82
  }));

  return res.json({
    kpis,
    trendData,
    defectsByCategory,
    severityDistribution,
    schoolComparison,
    paretoData: PARETO_DATA,
    aiInsights: state.aiInsights
  });
});

// ----------------------------------------------------
// Inspections API
// ----------------------------------------------------
router.get('/inspections', (req, res) => {
  const { search, category, status, schoolId } = req.query;
  let result = state.inspections;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(i => 
      i.title.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.schoolName.toLowerCase().includes(q) ||
      i.inspectorName.toLowerCase().includes(q)
    );
  }
  if (category && category !== 'all') {
    result = result.filter(i => i.category === category);
  }
  if (status && status !== 'all') {
    result = result.filter(i => i.status === status);
  }
  if (schoolId && schoolId !== 'all') {
    result = result.filter(i => i.schoolId === schoolId);
  }

  res.json(result);
});

router.get('/inspections/:id', (req, res) => {
  const item = state.inspections.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Inspection not found' });
  res.json(item);
});

router.post('/inspections', (req, res) => {
  const { title, schoolId, category, inspectorId, scheduledDate, checklistItems } = req.body;
  const school = state.schools.find(s => s.id === schoolId) || state.schools[0];
  const inspector = state.users.find(u => u.id === inspectorId) || state.users[0];

  const newInspection = {
    id: `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title: title || 'New Digital Inspection',
    schoolId: school.id,
    schoolName: school.name,
    inspectorId: inspector.id,
    inspectorName: inspector.name,
    category: category || 'Attendance gaps',
    status: 'Scheduled',
    severity: 'Medium',
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    completedDate: null,
    score: 100,
    checklistItems: checklistItems || [
      { id: `chk-${Date.now()}-1`, text: 'Standard compliance audit item 1', status: 'Pending', notes: '' },
      { id: `chk-${Date.now()}-2`, text: 'Standard compliance audit item 2', status: 'Pending', notes: '' }
    ],
    measurements: [],
    defectsCreated: []
  };

  state.inspections.unshift(newInspection);

  logAuditEvent({
    user: inspector.name,
    role: inspector.role,
    action: 'CREATE_INSPECTION',
    entity: 'Inspection',
    entityId: newInspection.id,
    details: `Created digital inspection for ${school.name}`
  });

  res.status(201).json(newInspection);
});

router.put('/inspections/:id', (req, res) => {
  const index = state.inspections.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Inspection not found' });

  state.inspections[index] = {
    ...state.inspections[index],
    ...req.body
  };

  logAuditEvent({
    user: 'System User',
    action: 'UPDATE_INSPECTION',
    entity: 'Inspection',
    entityId: req.params.id,
    details: `Updated inspection record status to ${state.inspections[index].status}`
  });

  res.json(state.inspections[index]);
});

// ----------------------------------------------------
// Defects API
// ----------------------------------------------------
router.get('/defects', (req, res) => {
  const { search, category, severity, status, schoolId } = req.query;
  let result = state.defects;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.schoolName.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== 'all') result = result.filter(d => d.category === category);
  if (severity && severity !== 'all') result = result.filter(d => d.severity === severity);
  if (status && status !== 'all') result = result.filter(d => d.status === status);
  if (schoolId && schoolId !== 'all') result = result.filter(d => d.schoolId === schoolId);

  res.json(result);
});

router.get('/defects/:id', (req, res) => {
  const defect = state.defects.find(d => d.id === req.params.id);
  if (!defect) return res.status(404).json({ error: 'Defect not found' });
  res.json(defect);
});

router.post('/defects', async (req, res) => {
  const { inspectionId, title, schoolId, category, severity, description, evidenceText } = req.body;
  const school = state.schools.find(s => s.id === schoolId) || state.schools[0];

  // Call AI Service to auto-classify
  const aiResult = await aiService.analyzeEvidence({
    evidenceText: evidenceText || description,
    category,
    schoolName: school.name
  });

  const newDefect = {
    id: `DEF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    inspectionId: inspectionId || 'INS-2026-0891',
    title: title || `${category} Defect Exception`,
    schoolId: school.id,
    schoolName: school.name,
    category: aiResult.category || category || 'Attendance gaps',
    severity: severity || aiResult.severity || 'High',
    status: 'AI Classified',
    recurrenceCount: Math.floor(Math.random() * 3) + 1,
    stage: 'AI Detection',
    description: description || evidenceText,
    evidenceUrls: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: aiResult.category,
      confidence: aiResult.confidence,
      model: aiResult.model,
      explanation: aiResult.explanation,
      status: 'Pending Review'
    },
    rootCauseId: null,
    capaId: null,
    createdAt: new Date().toISOString()
  };

  state.defects.unshift(newDefect);

  logAuditEvent({
    user: 'System User',
    action: 'CREATE_DEFECT',
    entity: 'Defect',
    entityId: newDefect.id,
    details: `Defect logged and classified by AI as ${newDefect.category} (${newDefect.severity})`
  });

  res.status(201).json(newDefect);
});

// ----------------------------------------------------
// AI Decision Support & Workspace API
// ----------------------------------------------------
router.post('/ai/analyze', async (req, res) => {
  const { evidenceText, category, schoolName } = req.body;
  if (!evidenceText) {
    return res.status(400).json({ error: 'Evidence text or incident description is required' });
  }

  const analysis = await aiService.analyzeEvidence({ evidenceText, category, schoolName });

  logAuditEvent({
    user: 'Quality Engineer',
    role: 'Quality Engineer',
    action: 'RUN_AI_ANALYSIS',
    entity: 'AI Run',
    entityId: `run-${Date.now()}`,
    details: `Triggered Gemini AI analysis for ${category || 'Incident Evidence'}`
  });

  res.json(analysis);
});

router.post('/ai/root-cause', async (req, res) => {
  const { defectTitle, description, category } = req.body;
  const rootCauseAnalysis = await aiService.generateRootCause({ defectTitle, description, category });

  logAuditEvent({
    user: 'Quality Manager',
    role: 'Manager',
    action: 'GENERATE_ROOT_CAUSE',
    entity: 'Root Cause',
    entityId: `rc-${Date.now()}`,
    details: `Generated AI Root Cause hypotheses for "${defectTitle}"`
  });

  res.json(rootCauseAnalysis);
});

router.post('/ai/decision', (req, res) => {
  const { insightId, defectId, decision, overrideReason, category, severity } = req.body;
  // decision: 'Approve' | 'Reject' | 'Override'

  if (defectId) {
    const defect = state.defects.find(d => d.id === defectId);
    if (defect) {
      if (decision === 'Approve') {
        defect.aiClassification.status = 'Approved';
      } else if (decision === 'Reject') {
        defect.aiClassification.status = 'Rejected';
      } else if (decision === 'Override') {
        defect.aiClassification.status = 'Overridden';
        defect.aiClassification.overrideReason = overrideReason;
        if (category) defect.category = category;
        if (severity) defect.severity = severity;
      }
    }
  }

  if (insightId) {
    const insight = state.aiInsights.find(i => i.id === insightId);
    if (insight) {
      insight.status = decision === 'Approve' ? 'Approved' : decision === 'Reject' ? 'Rejected' : 'Overridden';
    }
  }

  logAuditEvent({
    user: 'Dr. Evelyn Vance',
    role: 'Manager',
    action: `AI_DECISION_${decision.toUpperCase()}`,
    entity: 'AI Decision',
    entityId: defectId || insightId || 'ai-decision',
    details: `Recorded human decision '${decision}'${overrideReason ? ` with reason: ${overrideReason}` : ''}`
  });

  res.json({ success: true, decision, timestamp: new Date().toISOString() });
});

// ----------------------------------------------------
// Root Cause Intelligence API
// ----------------------------------------------------
router.get('/root-cause', (req, res) => {
  res.json({
    paretoData: PARETO_DATA,
    rootCauses: state.rootCauses,
    defects: state.defects
  });
});

// ----------------------------------------------------
// CAPA Management API
// ----------------------------------------------------
router.get('/capa', (req, res) => {
  const { search, priority, status } = req.query;
  let result = state.capas;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c => 
      c.id.toLowerCase().includes(q) ||
      c.defectTitle.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q) ||
      c.schoolName.toLowerCase().includes(q)
    );
  }
  if (priority && priority !== 'all') result = result.filter(c => c.priority === priority);
  if (status && status !== 'all') result = result.filter(c => c.status === status);

  res.json(result);
});

router.post('/capa', (req, res) => {
  const { defectId, defectTitle, rootCauseTitle, schoolName, ownerId, priority, dueDate, containmentAction, correctiveAction, preventiveAction } = req.body;
  const owner = state.users.find(u => u.id === ownerId) || state.users[1];

  const newCapa = {
    id: `CAPA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    defectId: defectId || 'DEF-2026-0104',
    defectTitle: defectTitle || 'Defect Action Plan',
    rootCauseTitle: rootCauseTitle || 'Identified Root Cause',
    schoolName: schoolName || 'Greenfield International School',
    ownerName: owner.name,
    ownerId: owner.id,
    priority: priority || 'High',
    status: 'Open',
    dueDate: dueDate || '2026-09-30',
    containmentAction: containmentAction || 'Immediate containment step',
    correctiveAction: correctiveAction || 'Systemic root cause correction',
    preventiveAction: preventiveAction || 'Process safeguard to prevent recurrence',
    effectivenessScore: 0,
    verificationStatus: 'Pending Verification',
    verifiedBy: null,
    verifiedDate: null
  };

  state.capas.unshift(newCapa);

  logAuditEvent({
    user: owner.name,
    role: owner.role,
    action: 'CREATE_CAPA',
    entity: 'CAPA',
    entityId: newCapa.id,
    details: `Initiated CAPA action plan assigned to ${owner.name}`
  });

  res.status(201).json(newCapa);
});

router.post('/capa/:id/verify', (req, res) => {
  const { effectivenessScore, notes } = req.body;
  const capa = state.capas.find(c => c.id === req.params.id);
  if (!capa) return res.status(404).json({ error: 'CAPA not found' });

  capa.effectivenessScore = effectivenessScore || 90;
  capa.verificationStatus = capa.effectivenessScore >= 85 ? 'Effective' : 'Ineffective';
  capa.status = capa.verificationStatus === 'Effective' ? 'Closed' : 'Pending Verification';
  capa.verifiedBy = 'Arthur Pendelton (Auditor)';
  capa.verifiedDate = new Date().toISOString().split('T')[0];

  logAuditEvent({
    user: 'Arthur Pendelton',
    role: 'Auditor',
    action: 'VERIFY_CAPA',
    entity: 'CAPA',
    entityId: capa.id,
    details: `Verified CAPA effectiveness score: ${capa.effectivenessScore}% -> Status: ${capa.status}`
  });

  res.json(capa);
});

// ----------------------------------------------------
// Reports & Model Monitoring APIs
// ----------------------------------------------------
router.get('/reports', (req, res) => {
  const templates = [
    { id: 'rep-1', name: 'Executive Quality Overview Report', category: 'Summary', format: 'PDF/CSV', generatedAt: '2026-09-01' },
    { id: 'rep-2', name: 'Pareto Defect & Root Cause Analysis', category: 'Analytics', format: 'PDF/CSV', generatedAt: '2026-08-28' },
    { id: 'rep-3', name: 'CAPA Closed-Loop Effectiveness Audit', category: 'Governance', format: 'PDF/CSV', generatedAt: '2026-08-25' },
    { id: 'rep-4', name: 'AI Model Health & Governance Log', category: 'AI Intelligence', format: 'PDF/CSV', generatedAt: '2026-09-05' }
  ];
  res.json(templates);
});

router.get('/model-monitoring', (req, res) => {
  res.json(MODEL_HEALTH);
});

// ----------------------------------------------------
// Notifications, Users, Audit Logs, Settings
// ----------------------------------------------------
router.get('/notifications', (req, res) => {
  res.json(state.notifications);
});

router.put('/notifications/:id/read', (req, res) => {
  const notif = state.notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

router.get('/users', (req, res) => {
  res.json(state.users);
});

router.get('/audit-logs', (req, res) => {
  res.json(state.auditLogs);
});

router.get('/settings', (req, res) => {
  res.json(state.settings);
});

router.put('/settings', (req, res) => {
  state.settings = { ...state.settings, ...req.body };
  logAuditEvent({
    user: 'Dr. Evelyn Vance',
    role: 'Manager',
    action: 'UPDATE_SETTINGS',
    entity: 'System Settings',
    entityId: 'settings',
    details: 'Updated global quality system configuration'
  });
  res.json(state.settings);
});

module.exports = router;
