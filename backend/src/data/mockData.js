const { v4: uuidv4 } = require('uuid');

const SCHOOLS = [
  { id: 'sch-1', name: 'Greenfield International School', code: 'GIS-01', campus: 'North Campus', city: 'Cambridge', studentCount: 1420 },
  { id: 'sch-2', name: 'Oakridge Academy', code: 'ORA-02', campus: 'Central Campus', city: 'Boston', studentCount: 980 },
  { id: 'sch-3', name: 'Riverside Public School', code: 'RPS-03', campus: 'West Campus', city: 'Chicago', studentCount: 1650 },
  { id: 'sch-4', name: 'Sunrise International Campus', code: 'SIC-04', campus: 'East Campus', city: 'Seattle', studentCount: 890 },
  { id: 'sch-5', name: 'Heritage High School', code: 'HHS-05', campus: 'South Campus', city: 'Austin', studentCount: 1120 }
];

const USERS = [
  { id: 'usr-1', name: 'Dr. Evelyn Vance', email: 'evelyn.vance@k12quality.edu', role: 'Manager', schoolId: 'sch-1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150', status: 'Active' },
  { id: 'usr-2', name: 'Marcus Sterling', email: 'marcus.sterling@k12quality.edu', role: 'Quality Engineer', schoolId: 'sch-2', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150', status: 'Active' },
  { id: 'usr-3', name: 'Sophia Chen', email: 'sophia.chen@k12quality.edu', role: 'Inspector', schoolId: 'sch-3', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150', status: 'Active' },
  { id: 'usr-4', name: 'Arthur Pendelton', email: 'arthur.p@k12quality.edu', role: 'Auditor', schoolId: 'sch-4', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150', status: 'Active' },
  { id: 'usr-5', name: 'Elena Rostova', email: 'elena.rostova@k12quality.edu', role: 'Inspector', schoolId: 'sch-5', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', status: 'Active' }
];

const INSPECTIONS = [
  {
    id: 'INS-2026-0891',
    title: 'Q3 Learning & Attendance Audit',
    schoolId: 'sch-1',
    schoolName: 'Greenfield International School',
    inspectorId: 'usr-3',
    inspectorName: 'Sophia Chen',
    category: 'Attendance gaps',
    status: 'Completed',
    severity: 'High',
    scheduledDate: '2026-08-15',
    completedDate: '2026-08-16',
    score: 84.5,
    checklistItems: [
      { id: 'chk-1', text: 'Daily homeroom attendance logs reconciled with parent portal', status: 'Fail', notes: 'Unexplained 14% gap in Grade 8 Section B log submissions.' },
      { id: 'chk-2', text: 'Safeguarding escalation logs updated within 24 hours', status: 'Pass', notes: 'All 3 flagged incidents properly documented.' },
      { id: 'chk-3', text: 'Parent contact attempt log verified for 3-day consecutive absences', status: 'Fail', notes: 'Delayed parent notifications exceeding 48h window.' },
      { id: 'chk-4', text: 'Substitute teacher attendance register sign-off', status: 'Pass', notes: 'Verified and complete.' }
    ],
    measurements: [
      { metric: 'Unexcused Absence Rate', target: '< 3.0%', actual: '6.4%', compliant: false },
      { metric: 'Parent Contact SLA Compliance', target: '> 95.0%', actual: '78.2%', compliant: false },
      { metric: 'Homeroom Register Timeliness', target: '> 98.0%', actual: '91.0%', compliant: false }
    ],
    defectsCreated: ['DEF-2026-0104', 'DEF-2026-0107']
  },
  {
    id: 'INS-2026-0892',
    title: 'STEM Curriculum Assessment Completeness Review',
    schoolId: 'sch-2',
    schoolName: 'Oakridge Academy',
    inspectorId: 'usr-2',
    inspectorName: 'Marcus Sterling',
    category: 'Incomplete assessments',
    status: 'Pending Review',
    severity: 'Medium',
    scheduledDate: '2026-08-20',
    completedDate: '2026-08-21',
    score: 79.0,
    checklistItems: [
      { id: 'chk-5', text: 'Mid-term practical lab scores uploaded to portal', status: 'Fail', notes: 'Grade 10 Physics lab grades missing for 42 students.' },
      { id: 'chk-6', text: 'Formative rubrics published before assessment date', status: 'Pass', notes: 'All rubrics pre-published.' },
      { id: 'chk-7', text: 'Special Needs (IEP) testing accommodation audit', status: 'Pass', notes: 'Accommodations logged correctly.' }
    ],
    measurements: [
      { metric: 'Grade Upload Deadline Compliance', target: '100%', actual: '82.5%', compliant: false }
    ],
    defectsCreated: ['DEF-2026-0105']
  },
  {
    id: 'INS-2026-0893',
    title: 'Master Timetable & Classroom Allocation Verification',
    schoolId: 'sch-3',
    schoolName: 'Riverside Public School',
    inspectorId: 'usr-5',
    inspectorName: 'Elena Rostova',
    category: 'Timetable conflicts',
    status: 'In Progress',
    severity: 'Critical',
    scheduledDate: '2026-08-25',
    completedDate: null,
    score: 68.0,
    checklistItems: [
      { id: 'chk-8', text: 'Double booking check across science labs', status: 'Fail', notes: 'Chemistry Lab 2 double-booked on Tuesday period 4.' },
      { id: 'chk-9', text: 'Teacher workload cap compliance (< 24 periods/week)', status: 'Fail', notes: '3 Senior Math faculty exceed ceiling.' }
    ],
    measurements: [
      { metric: 'Lab Booking Overlap Rate', target: '0%', actual: '4.2%', compliant: false }
    ],
    defectsCreated: ['DEF-2026-0106']
  },
  {
    id: 'INS-2026-0894',
    title: 'Safeguarding & Student Welfare Protocol Inspection',
    schoolId: 'sch-4',
    schoolName: 'Sunrise International Campus',
    inspectorId: 'usr-4',
    inspectorName: 'Arthur Pendelton',
    category: 'Safeguarding incidents',
    status: 'Completed',
    severity: 'Low',
    scheduledDate: '2026-08-10',
    completedDate: '2026-08-11',
    score: 96.0,
    checklistItems: [
      { id: 'chk-10', text: 'Physical campus entry log cross-referenced with visitor badges', status: 'Pass', notes: '100% compliant.' },
      { id: 'chk-11', text: 'Counselor incident escalation form SLA (< 12h)', status: 'Pass', notes: 'Average response 3.2 hours.' }
    ],
    measurements: [
      { metric: 'Visitor Verification Rate', target: '100%', actual: '100%', compliant: true }
    ],
    defectsCreated: []
  },
  {
    id: 'INS-2026-0895',
    title: 'Parent-Teacher Communication SLA Audit',
    schoolId: 'sch-5',
    schoolName: 'Heritage High School',
    inspectorId: 'usr-3',
    inspectorName: 'Sophia Chen',
    category: 'Communication failures',
    status: 'Escalated',
    severity: 'High',
    scheduledDate: '2026-08-28',
    completedDate: '2026-08-29',
    score: 72.0,
    checklistItems: [
      { id: 'chk-12', text: 'Parent portal query response within 48 business hours', status: 'Fail', notes: '143 parent inquiries unanswered > 5 school days.' }
    ],
    measurements: [
      { metric: 'Query Backlog (> 5 days)', target: '< 10', actual: '143', compliant: false }
    ],
    defectsCreated: ['DEF-2026-0108']
  }
];

const DEFECTS = [
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
      model: 'Gemini 1.5 Pro (v2.4.1)',
      explanation: 'Cross-tabulation of homeroom attendance sheets and parent portal logs confirms systemic reporting delay during monthly reporting cycles.',
      status: 'Approved'
    },
    rootCauseId: 'RC-2026-0031',
    capaId: 'CAPA-2026-0012',
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
      model: 'Gemini 1.5 Pro (v2.4.1)',
      explanation: 'Analysis shows grading portal lock out occurring before teacher submission due to timezone misconfiguration.',
      status: 'Approved'
    },
    rootCauseId: 'RC-2026-0032',
    capaId: 'CAPA-2026-0013',
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
      model: 'Gemini 1.5 Pro (v2.4.1)',
      explanation: 'Algorithmic conflict detected in automated timetable software generation after mid-year elective additions.',
      status: 'Pending Review'
    },
    rootCauseId: null,
    capaId: null,
    createdAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'DEF-2026-0107',
    inspectionId: 'INS-2026-0891',
    title: 'Special Education Accommodations Log Missing',
    schoolId: 'sch-1',
    schoolName: 'Greenfield International School',
    category: 'Learning decline',
    severity: 'Medium',
    status: 'Closed',
    recurrenceCount: 1,
    stage: 'Closure',
    description: 'IEP testing extra time allocation not reflected in quarterly progress reports for 6 students.',
    evidenceUrls: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'],
    aiClassification: {
      category: 'Learning decline',
      confidence: 0.88,
      model: 'Gemini 1.5 Pro (v2.4.1)',
      explanation: 'Direct link between missing IEP accommodation records and sudden score drops in standardized reading metrics.',
      status: 'Approved'
    },
    rootCauseId: 'RC-2026-0030',
    capaId: 'CAPA-2026-0010',
    createdAt: '2026-08-16T11:45:00Z'
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
      model: 'Gemini 1.5 Pro (v2.4.1)',
      explanation: 'Ticket auto-routing failed following administrative staff restructuring in early August.',
      status: 'Pending Review'
    },
    rootCauseId: null,
    capaId: null,
    createdAt: '2026-08-29T16:20:00Z'
  }
];

const ROOT_CAUSES = [
  {
    id: 'RC-2026-0031',
    defectId: 'DEF-2026-0104',
    title: 'Homeroom Mobile App Sync Delay during Morning Roll Call',
    category: 'Attendance gaps',
    confidence: 0.91,
    status: 'Approved',
    hypotheses: [
      { id: 'hyp-1', statement: 'Inconsistent teacher homeroom attendance workflow during Period 1', weight: 0.81, evidence: '81% of late logs originate from teachers with Period 1 floating room assignments.' },
      { id: 'hyp-2', statement: 'Mobile portal network bandwidth throttle during 08:00 - 08:30 peak window', weight: 0.63, evidence: 'Server logs reveal 4.8s latency spike during morning registration window.' },
      { id: 'hyp-3', statement: 'Lack of automated SMS escalation to parents for unexcused absences', weight: 0.51, evidence: 'Current manual email process requires administrative staff batch trigger at 14:00.' }
    ],
    contributingFactors: [
      { factor: 'Teacher Workload & Floating Classrooms', impact: 'High' },
      { factor: 'Legacy Mobile App Versioning', impact: 'Medium' },
      { factor: 'Batch SMS Gateway Rate Limit', impact: 'High' }
    ]
  },
  {
    id: 'RC-2026-0032',
    defectId: 'DEF-2026-0105',
    title: 'Grade Portal Timezone & Cutoff Configuration Misalignment',
    category: 'Incomplete assessments',
    confidence: 0.89,
    status: 'Approved',
    hypotheses: [
      { id: 'hyp-4', statement: 'Gradebook portal lock timer set to UTC instead of EST local time', weight: 0.88, evidence: 'System locked grade entry 5 hours ahead of published midnight deadline.' },
      { id: 'hyp-5', statement: 'Lack of automated pre-deadline notification alerts to department heads', weight: 0.72, evidence: 'No reminder emails triggered to science faculty prior to system freeze.' }
    ],
    contributingFactors: [
      { factor: 'LMS Platform Configuration Drift', impact: 'High' },
      { factor: 'Communication Gap between IT & Academic Heads', impact: 'Medium' }
    ]
  }
];

const CAPAS = [
  {
    id: 'CAPA-2026-0012',
    defectId: 'DEF-2026-0104',
    defectTitle: 'Grade 8 Unreconciled Consecutive Absence Gap',
    rootCauseTitle: 'Homeroom Mobile App Sync Delay during Morning Roll Call',
    schoolName: 'Greenfield International School',
    ownerName: 'Marcus Sterling',
    ownerId: 'usr-2',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-09-15',
    containmentAction: 'Mandate backup paper roll call scan upload for floating Period 1 teachers by 09:00 AM daily.',
    correctiveAction: 'Deploy v3.2 mobile attendance app patch with offline queuing and priority bandwidth allocation.',
    preventiveAction: 'Implement automated SMS webhook that triggers immediate SMS alert to guardians at 09:30 AM if student is unexcused.',
    effectivenessScore: 88,
    verificationStatus: 'Pending Verification',
    verifiedBy: null,
    verifiedDate: null
  },
  {
    id: 'CAPA-2026-0013',
    defectId: 'DEF-2026-0105',
    defectTitle: 'Grade 10 Physics Mid-Term Assessment Omission',
    rootCauseTitle: 'Grade Portal Timezone & Cutoff Configuration Misalignment',
    schoolName: 'Oakridge Academy',
    ownerName: 'Dr. Evelyn Vance',
    ownerId: 'usr-1',
    priority: 'Medium',
    status: 'Pending Verification',
    dueDate: '2026-09-05',
    containmentAction: 'Re-open grade portal lock window for 48 hours to ingest missing lab scores.',
    correctiveAction: 'Update LMS server timezone environment variable to Eastern Standard Time (UTC-5).',
    preventiveAction: 'Enforce automated 24-hour and 6-hour gradebook deadline notification banners for all teaching staff.',
    effectivenessScore: 95,
    verificationStatus: 'Under Review',
    verifiedBy: 'Arthur Pendelton',
    verifiedDate: '2026-09-06'
  },
  {
    id: 'CAPA-2026-0010',
    defectId: 'DEF-2026-0107',
    defectTitle: 'Special Education Accommodations Log Missing',
    rootCauseTitle: 'IEP Synchronisation Gap',
    schoolName: 'Greenfield International School',
    ownerName: 'Elena Rostova',
    ownerId: 'usr-5',
    priority: 'Low',
    status: 'Closed',
    dueDate: '2026-08-30',
    containmentAction: 'Manually cross-verify all active IEP student profiles against test center rosters.',
    correctiveAction: 'Integrate Special Education DB directly into standard assessment distribution module.',
    preventiveAction: 'Bi-weekly automated compliance check on all modified test arrangements.',
    effectivenessScore: 99,
    verificationStatus: 'Effective',
    verifiedBy: 'Dr. Evelyn Vance',
    verifiedDate: '2026-08-31'
  }
];

const AI_INSIGHTS = [
  {
    id: 'ai-ins-1',
    title: 'Attendance Gaps Escalation Pattern',
    summary: 'Attendance gaps increased by 14.2% across Grade 8 classrooms in 3 campuses during August monthly reporting.',
    impact: 'High',
    confidence: 0.92,
    evidence: 'Cross-analysis of 1,420 attendance logs and parent notification timestamps from GIS, ORA, and RPS.',
    recommendedAction: 'Mandate automated 09:30 AM parent SMS escalation and update mobile attendance roll-call app to v3.2.',
    timestamp: '2 hours ago',
    model: 'Gemini 1.5 Pro (v2.4.1)',
    status: 'Pending Review'
  },
  {
    id: 'ai-ins-2',
    title: 'Recurring Assessment Incompleteness Driver',
    summary: 'Assessment completion defects recur most frequently when lab grade deadlines coincide with monthly teacher progress reports.',
    impact: 'Medium',
    confidence: 0.88,
    evidence: 'Historical correlation between grade portal freeze timestamps and STEM assignment completion spikes.',
    recommendedAction: 'Stagger assessment upload windows by grade level and adjust LMS portal lock time zone.',
    timestamp: '5 hours ago',
    model: 'Gemini 1.5 Pro (v2.4.1)',
    status: 'Approved'
  },
  {
    id: 'ai-ins-3',
    title: 'Communication Failure SLA Correlation',
    summary: 'Unanswered parent inquiries > 5 days show a 78% correlation with recent administrative staff re-allocations.',
    impact: 'High',
    confidence: 0.95,
    evidence: '143 pending ticket IDs matched against HR staff reassignment logs at Heritage High School.',
    recommendedAction: 'Re-assign ticket auto-routing rules to central campus coordinator desk.',
    timestamp: '1 day ago',
    model: 'Gemini 1.5 Pro (v2.4.1)',
    status: 'Pending Review'
  }
];

const MODEL_HEALTH = {
  overallAccuracy: 94.2,
  precision: 92.8,
  recall: 95.1,
  f1Score: 93.9,
  avgLatencyMs: 1240,
  driftStatus: 'Low / Stable',
  overrideRate: 7.8,
  totalInferences: 3420,
  activeModelVersion: 'Gemini 1.5 Pro (v2.4.1)',
  historicalPerformance: [
    { date: 'Aug 01', accuracy: 91.2, overrideRate: 9.4, latency: 1350 },
    { date: 'Aug 08', accuracy: 92.5, overrideRate: 8.7, latency: 1290 },
    { date: 'Aug 15', accuracy: 93.8, overrideRate: 8.1, latency: 1260 },
    { date: 'Aug 22', accuracy: 94.0, overrideRate: 7.9, latency: 1250 },
    { date: 'Aug 29', accuracy: 94.2, overrideRate: 7.8, latency: 1240 }
  ]
};

const PARETO_DATA = [
  { category: 'Attendance gaps', count: 48, percentage: 35.5, cumulative: 35.5 },
  { category: 'Communication failures', count: 34, percentage: 25.2, cumulative: 60.7 },
  { category: 'Incomplete assessments', count: 24, percentage: 17.8, cumulative: 78.5 },
  { category: 'Timetable conflicts', count: 18, percentage: 13.3, cumulative: 91.8 },
  { category: 'Safeguarding incidents', count: 7, percentage: 5.2, cumulative: 97.0 },
  { category: 'Learning decline', count: 4, percentage: 3.0, cumulative: 100.0 }
];

const NOTIFICATIONS = [
  { id: 'notif-1', title: 'Critical Defect Detected', message: 'Timetable Conflict (DEF-2026-0106) flagged with Critical severity at Riverside Public School.', type: 'Critical', entityId: 'DEF-2026-0106', targetRoute: '/defects', read: false, createdAt: '2026-08-25T09:05:00Z' },
  { id: 'notif-2', title: 'AI Classification Approved', message: 'AI root cause hypothesis for Grade 8 Attendance Gap was approved by Dr. Evelyn Vance.', type: 'AI Result', entityId: 'DEF-2026-0104', targetRoute: '/root-cause', read: false, createdAt: '2026-08-16T12:00:00Z' },
  { id: 'notif-3', title: 'CAPA Verification Due', message: 'CAPA-2026-0013 requires verification sign-off before 2026-09-05.', type: 'CAPA due', entityId: 'CAPA-2026-0013', targetRoute: '/capa', read: true, createdAt: '2026-09-01T08:30:00Z' },
  { id: 'notif-4', title: 'New Inspection Assigned', message: 'You have been assigned to conduct Q3 Parent SLA Audit at Heritage High School.', type: 'Assignment', entityId: 'INS-2026-0895', targetRoute: '/inspections', read: true, createdAt: '2026-08-28T07:15:00Z' }
];

const AUDIT_LOGS = [
  { id: 'aud-1', timestamp: '2026-09-07T08:14:22Z', user: 'Dr. Evelyn Vance', role: 'Manager', action: 'APPROVE_AI_CLASSIFICATION', entity: 'Defect', entityId: 'DEF-2026-0104', outcome: 'SUCCESS', details: 'Approved Gemini 1.5 classification for Attendance Gap.' },
  { id: 'aud-2', timestamp: '2026-09-06T14:20:10Z', user: 'Arthur Pendelton', role: 'Auditor', action: 'VERIFY_CAPA', entity: 'CAPA', entityId: 'CAPA-2026-0013', outcome: 'SUCCESS', details: 'Marked CAPA-2026-0013 as Under Review following lab score re-ingestion.' },
  { id: 'aud-3', timestamp: '2026-09-05T11:05:43Z', user: 'Marcus Sterling', role: 'Quality Engineer', action: 'OVERRIDE_AI_SEVERITY', entity: 'Defect', entityId: 'DEF-2026-0105', outcome: 'SUCCESS', details: 'Overrode AI predicted severity from High to Medium with reason: Impact contained to single physics lab section.' },
  { id: 'aud-4', timestamp: '2026-09-04T09:30:00Z', user: 'Sophia Chen', role: 'Inspector', action: 'CREATE_INSPECTION', entity: 'Inspection', entityId: 'INS-2026-0891', outcome: 'SUCCESS', details: 'Created digital inspection Q3 Learning & Attendance Audit.' }
];

const SETTINGS = {
  organizationName: 'Global K-12 Academies Group',
  academicYear: '2026 - 2027',
  aiConfidenceThreshold: 85,
  autoEscalateCritical: true,
  emailNotificationFrequency: 'Immediate',
  auditLogRetentionDays: 365,
  requireOverrideReason: true,
  geminiModel: 'gemini-1.5-pro'
};

module.exports = {
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
};
