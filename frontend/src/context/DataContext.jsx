import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const DataContext = createContext(null);

const INITIAL_SCHOOLS = [
  { id: 'sch-1', name: 'Greenfield International School', code: 'GIS-01', campus: 'North Campus', city: 'Cambridge' },
  { id: 'sch-2', name: 'Oakridge Academy', code: 'ORA-02', campus: 'Central Campus', city: 'Boston' },
  { id: 'sch-3', name: 'Riverside Public School', code: 'RPS-03', campus: 'West Campus', city: 'Chicago' },
  { id: 'sch-4', name: 'Sunrise International Campus', code: 'SIC-04', campus: 'East Campus', city: 'Seattle' },
  { id: 'sch-5', name: 'Heritage High School', code: 'HHS-05', campus: 'South Campus', city: 'Austin' }
];

const INITIAL_INSPECTIONS = [
  {
    id: 'INS-2026-0891',
    title: 'Q3 Learning & Attendance Audit',
    schoolId: 'sch-1',
    schoolName: 'Greenfield International School',
    inspectorName: 'Sophia Chen',
    category: 'Attendance gaps',
    status: 'Completed',
    severity: 'High',
    scheduledDate: '2026-08-15',
    score: 84.5,
    checklistItems: [
      { id: 'chk-1', text: 'Daily homeroom attendance logs reconciled with parent portal', status: 'Fail', notes: 'Unexplained 14% gap in Grade 8 Section B log submissions.' },
      { id: 'chk-2', text: 'Safeguarding escalation logs updated within 24 hours', status: 'Pass', notes: 'All 3 flagged incidents properly documented.' },
      { id: 'chk-3', text: 'Parent contact attempt log verified for 3-day consecutive absences', status: 'Fail', notes: 'Delayed parent notifications exceeding 48h window.' }
    ],
    measurements: [
      { metric: 'Unexcused Absence Rate', target: '< 3.0%', actual: '6.4%', compliant: false },
      { metric: 'Parent Contact SLA Compliance', target: '> 95.0%', actual: '78.2%', compliant: false }
    ]
  },
  {
    id: 'INS-2026-0892',
    title: 'STEM Curriculum Assessment Completeness Review',
    schoolId: 'sch-2',
    schoolName: 'Oakridge Academy',
    inspectorName: 'Marcus Sterling',
    category: 'Incomplete assessments',
    status: 'Pending Review',
    severity: 'Medium',
    scheduledDate: '2026-08-20',
    score: 79.0,
    checklistItems: [
      { id: 'chk-5', text: 'Mid-term practical lab scores uploaded to portal', status: 'Fail', notes: 'Grade 10 Physics lab grades missing for 42 students.' },
      { id: 'chk-6', text: 'Formative rubrics published before assessment date', status: 'Pass', notes: 'All rubrics pre-published.' }
    ],
    measurements: [
      { metric: 'Grade Upload Deadline Compliance', target: '100%', actual: '82.5%', compliant: false }
    ]
  },
  {
    id: 'INS-2026-0893',
    title: 'Master Timetable & Classroom Allocation Verification',
    schoolId: 'sch-3',
    schoolName: 'Riverside Public School',
    inspectorName: 'Elena Rostova',
    category: 'Timetable conflicts',
    status: 'In Progress',
    severity: 'Critical',
    scheduledDate: '2026-08-25',
    score: 68.0,
    checklistItems: [
      { id: 'chk-8', text: 'Double booking check across science labs', status: 'Fail', notes: 'Chemistry Lab 2 double-booked on Tuesday period 4.' },
      { id: 'chk-9', text: 'Teacher workload cap compliance (< 24 periods/week)', status: 'Fail', notes: '3 Senior Math faculty exceed ceiling.' }
    ],
    measurements: [
      { metric: 'Lab Booking Overlap Rate', target: '0%', actual: '4.2%', compliant: false }
    ]
  },
  {
    id: 'INS-2026-0895',
    title: 'Parent-Teacher Communication SLA Audit',
    schoolId: 'sch-5',
    schoolName: 'Heritage High School',
    inspectorName: 'Sophia Chen',
    category: 'Communication failures',
    status: 'Escalated',
    severity: 'High',
    scheduledDate: '2026-08-28',
    score: 72.0,
    checklistItems: [
      { id: 'chk-12', text: 'Parent portal query response within 48 business hours', status: 'Fail', notes: '143 parent inquiries unanswered > 5 school days.' }
    ],
    measurements: [
      { metric: 'Query Backlog (> 5 days)', target: '< 10', actual: '143', compliant: false }
    ]
  }
];

const INITIAL_DEFECTS = [
  {
    id: 'DEF-2026-0104',
    inspectionId: 'INS-2026-0891',
    title: 'Grade 8 Unreconciled Consecutive Absence Gap',
    schoolId: 'sch-1',
    schoolName: 'Greenfield International School',
    category: 'Attendance gaps',
    severity: 'High',
    status: 'CAPA In Progress',
    recurrenceCount: 4,
    stage: 'CAPA',
    description: '14% drop in Grade 8 Section B daily homeroom attendance recording. Parent portal notifications delayed beyond 48-hour mandatory window.',
    evidenceUrls: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: 'Attendance gaps',
      confidence: 0.94,
      model: 'Gemini 1.5 Pro',
      explanation: 'Cross-tabulation of homeroom attendance sheets and parent portal logs confirms systemic reporting delay during monthly reporting cycles.',
      status: 'Approved'
    },
    createdAt: '2026-08-16T10:30:00Z'
  },
  {
    id: 'DEF-2026-0105',
    inspectionId: 'INS-2026-0892',
    title: 'Grade 10 Physics Mid-Term Assessment Omission',
    schoolId: 'sch-2',
    schoolName: 'Oakridge Academy',
    category: 'Incomplete assessments',
    severity: 'Medium',
    status: 'Root Cause Identified',
    recurrenceCount: 2,
    stage: 'Root Cause',
    description: '42 students missing practical lab assessment scores prior to grade card generation deadline.',
    evidenceUrls: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: 'Incomplete assessments',
      confidence: 0.91,
      model: 'Gemini 1.5 Pro',
      explanation: 'Analysis shows grading portal lock out occurring before teacher submission due to timezone misconfiguration.',
      status: 'Approved'
    },
    createdAt: '2026-08-21T14:15:00Z'
  },
  {
    id: 'DEF-2026-0106',
    inspectionId: 'INS-2026-0893',
    title: 'Chemistry Lab Double-Booking & Math Faculty Overload',
    schoolId: 'sch-3',
    schoolName: 'Riverside Public School',
    category: 'Timetable conflicts',
    severity: 'Critical',
    status: 'AI Classified',
    recurrenceCount: 5,
    stage: 'AI Detection',
    description: 'Simultaneous scheduling of Grade 11 AP Chemistry and Grade 9 General Science in Lab 2. 3 Math faculty exceed contract teaching hours.',
    evidenceUrls: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: 'Timetable conflicts',
      confidence: 0.97,
      model: 'Gemini 1.5 Pro',
      explanation: 'Algorithmic conflict detected in automated timetable software generation after mid-year elective additions.',
      status: 'Pending Review'
    },
    createdAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'DEF-2026-0108',
    inspectionId: 'INS-2026-0895',
    title: 'Unresolved Parent Inquiry Backlog (> 5 Days)',
    schoolId: 'sch-5',
    schoolName: 'Heritage High School',
    category: 'Communication failures',
    severity: 'High',
    status: 'Under AI Review',
    recurrenceCount: 6,
    stage: 'Classification',
    description: '143 parent inquiries regarding fee structures and transportation schedules remaining unanswered in central portal ticket queue.',
    evidenceUrls: ['https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: 'Communication failures',
      confidence: 0.95,
      model: 'Gemini 1.5 Pro',
      explanation: 'Ticket auto-routing failed following administrative staff restructuring in early August.',
      status: 'Pending Review'
    },
    createdAt: '2026-08-29T16:20:00Z'
  }
];

const INITIAL_CAPAS = [
  {
    id: 'CAPA-2026-0012',
    defectId: 'DEF-2026-0104',
    defectTitle: 'Grade 8 Unreconciled Consecutive Absence Gap',
    rootCauseTitle: 'Homeroom Mobile App Sync Delay during Morning Roll Call',
    schoolName: 'Greenfield International School',
    ownerName: 'Marcus Sterling',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-09-15',
    containmentAction: 'Mandate backup paper roll call scan upload for floating Period 1 teachers by 09:00 AM daily.',
    correctiveAction: 'Deploy v3.2 mobile attendance app patch with offline queuing and priority bandwidth allocation.',
    preventiveAction: 'Implement automated SMS webhook that triggers immediate SMS alert to guardians at 09:30 AM if student is unexcused.',
    effectivenessScore: 88,
    verificationStatus: 'Pending Verification'
  },
  {
    id: 'CAPA-2026-0013',
    defectId: 'DEF-2026-0105',
    defectTitle: 'Grade 10 Physics Mid-Term Assessment Omission',
    rootCauseTitle: 'Grade Portal Timezone & Cutoff Configuration Misalignment',
    schoolName: 'Oakridge Academy',
    ownerName: 'Dr. Evelyn Vance',
    priority: 'Medium',
    status: 'Pending Verification',
    dueDate: '2026-09-05',
    containmentAction: 'Re-open grade portal lock window for 48 hours to ingest missing lab scores.',
    correctiveAction: 'Update LMS server timezone environment variable to Eastern Standard Time (UTC-5).',
    preventiveAction: 'Enforce automated 24-hour and 6-hour gradebook deadline notification banners for all teaching staff.',
    effectivenessScore: 95,
    verificationStatus: 'Under Review'
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Critical Defect Detected', message: 'Timetable Conflict (DEF-2026-0106) flagged with Critical severity at Riverside Public School.', type: 'Critical', entityId: 'DEF-2026-0106', targetRoute: '/defects', read: false, createdAt: '2026-08-25T09:05:00Z' },
  { id: 'notif-2', title: 'AI Classification Approved', message: 'AI root cause hypothesis for Grade 8 Attendance Gap was approved by Dr. Evelyn Vance.', type: 'AI Result', entityId: 'DEF-2026-0104', targetRoute: '/root-cause', read: false, createdAt: '2026-08-16T12:00:00Z' },
  { id: 'notif-3', title: 'CAPA Verification Due', message: 'CAPA-2026-0013 requires verification sign-off before 2026-09-05.', type: 'CAPA due', entityId: 'CAPA-2026-0013', targetRoute: '/capa', read: true, createdAt: '2026-09-01T08:30:00Z' }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'aud-1', timestamp: new Date().toISOString(), user: 'Dr. Evelyn Vance', role: 'Manager', action: 'APPROVE_AI_CLASSIFICATION', entity: 'Defect', entityId: 'DEF-2026-0104', outcome: 'SUCCESS', details: 'Approved Gemini 1.5 classification for Attendance Gap.' },
  { id: 'aud-2', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Arthur Pendelton', role: 'Auditor', action: 'VERIFY_CAPA', entity: 'CAPA', entityId: 'CAPA-2026-0013', outcome: 'SUCCESS', details: 'Marked CAPA-2026-0013 as Under Review following lab score re-ingestion.' }
];

export const DataProvider = ({ children }) => {
  const [schools] = useState(INITIAL_SCHOOLS);
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [defects, setDefects] = useState(INITIAL_DEFECTS);
  const [capas, setCapas] = useState(INITIAL_CAPAS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('all');

  // Load from API on mount if backend live
  useEffect(() => {
    const fetchData = async () => {
      const apiInspections = await api.getInspections();
      if (apiInspections && Array.isArray(apiInspections) && apiInspections.length > 0) {
        setInspections(apiInspections);
      }
      const apiDefects = await api.getDefects();
      if (apiDefects && Array.isArray(apiDefects) && apiDefects.length > 0) {
        setDefects(apiDefects);
      }
      const apiCapas = await api.getCapas();
      if (apiCapas && Array.isArray(apiCapas) && apiCapas.length > 0) {
        setCapas(apiCapas);
      }
      const apiNotifs = await api.getNotifications();
      if (apiNotifs && Array.isArray(apiNotifs) && apiNotifs.length > 0) {
        setNotifications(apiNotifs);
      }
      const apiLogs = await api.getAuditLogs();
      if (apiLogs && Array.isArray(apiLogs) && apiLogs.length > 0) {
        setAuditLogs(apiLogs);
      }
    };
    fetchData();
  }, []);

  const addInspection = async (data) => {
    const created = await api.createInspection(data);
    setInspections(prev => [created, ...prev]);
    addAuditLog('CREATE_INSPECTION', 'Inspection', created.id, `Created digital inspection for ${created.schoolName}`);
    return created;
  };

  const addDefect = async (data) => {
    const created = await api.createDefect(data);
    setDefects(prev => [created, ...prev]);
    addAuditLog('CREATE_DEFECT', 'Defect', created.id, `Created defect record ${created.title}`);
    return created;
  };

  const addCapa = async (data) => {
    const created = await api.createCapa(data);
    setCapas(prev => [created, ...prev]);
    addAuditLog('CREATE_CAPA', 'CAPA', created.id, `Initiated CAPA plan ${created.id}`);
    return created;
  };

  const handleAIDecision = async ({ defectId, decision, overrideReason, category, severity }) => {
    await api.recordAIDecision({ defectId, decision, overrideReason, category, severity });
    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        const statusMap = { 'Approve': 'Approved', 'Reject': 'Rejected', 'Override': 'Overridden' };
        return {
          ...d,
          category: (decision === 'Override' && category) ? category : d.category,
          severity: (decision === 'Override' && severity) ? severity : d.severity,
          aiClassification: {
            ...d.aiClassification,
            status: statusMap[decision] || 'Approved',
            overrideReason: overrideReason || null
          }
        };
      }
      return d;
    }));
    addAuditLog(`AI_DECISION_${decision.toUpperCase()}`, 'Defect', defectId, `Decision '${decision}' recorded for defect.`);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const addAuditLog = (action, entity, entityId, details) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Dr. Evelyn Vance',
      role: 'Manager',
      action,
      entity,
      entityId,
      outcome: 'SUCCESS',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      schools,
      inspections,
      defects,
      capas,
      notifications,
      auditLogs,
      selectedSchoolFilter,
      setSelectedSchoolFilter,
      addInspection,
      addDefect,
      addCapa,
      handleAIDecision,
      markNotificationRead,
      addAuditLog
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
