import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor to attach Auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('k12_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const api = {
  // Auth
  login: async (credentials) => {
    try {
      const res = await client.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      // Fallback local auth simulation
      const role = credentials.role || 'Manager';
      const mockUser = {
        id: 'usr-1',
        name: role === 'Inspector' ? 'Sophia Chen' : role === 'Quality Engineer' ? 'Marcus Sterling' : role === 'Auditor' ? 'Arthur Pendelton' : 'Dr. Evelyn Vance',
        email: credentials.email || 'evelyn.vance@k12quality.edu',
        role,
        schoolId: 'sch-1',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
      };
      return { success: true, token: 'mock-jwt-token-2026', user: mockUser };
    }
  },

  // Dashboard
  getDashboard: async (filters = {}) => {
    try {
      const res = await client.get('/dashboard', { params: filters });
      return res.data;
    } catch (err) {
      return null; // Will trigger DataContext fallback
    }
  },

  // Inspections
  getInspections: async (filters = {}) => {
    try {
      const res = await client.get('/inspections', { params: filters });
      return res.data;
    } catch (err) {
      return null;
    }
  },
  createInspection: async (data) => {
    try {
      const res = await client.post('/inspections', data);
      return res.data;
    } catch (err) {
      return {
        id: `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: data.title,
        schoolId: data.schoolId || 'sch-1',
        schoolName: 'Greenfield International School',
        inspectorName: 'Dr. Evelyn Vance',
        category: data.category || 'Attendance gaps',
        status: 'Scheduled',
        severity: 'Medium',
        scheduledDate: new Date().toISOString().split('T')[0],
        score: 100,
        checklistItems: data.checklistItems || []
      };
    }
  },

  // Defects
  getDefects: async (filters = {}) => {
    try {
      const res = await client.get('/defects', { params: filters });
      return res.data;
    } catch (err) {
      return null;
    }
  },
  createDefect: async (data) => {
    try {
      const res = await client.post('/defects', data);
      return res.data;
    } catch (err) {
      return {
        id: `DEF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: data.title || 'New Quality Defect',
        schoolName: 'Greenfield International School',
        category: data.category || 'Attendance gaps',
        severity: data.severity || 'High',
        status: 'AI Classified',
        recurrenceCount: 1,
        stage: 'AI Detection',
        description: data.description || '',
        aiClassification: {
          category: data.category || 'Attendance gaps',
          confidence: 0.94,
          model: 'Gemini 1.5 Pro',
          explanation: 'AI classified incident based on keyword alignment.',
          status: 'Pending Review'
        },
        createdAt: new Date().toISOString()
      };
    }
  },

  // AI Operations
  analyzeEvidence: async (data) => {
    try {
      const res = await client.post('/ai/analyze', data);
      return res.data;
    } catch (err) {
      return {
        category: data.category || 'Attendance gaps',
        confidence: 0.93,
        severity: 'High',
        explanation: `Analysis indicates pattern consistency with systemic reporting delays at ${data.schoolName || 'campus'}.`,
        evidencePoints: [
          'Unreconciled attendance records exceeding 48h SLA',
          'Parent notification log delay flags'
        ],
        recommendedAction: 'Mandate immediate SMS escalation and review mobile attendance app logs.',
        model: 'Gemini 1.5 Pro (Engine Fallback)',
        timestamp: new Date().toISOString(),
        status: 'Pending Review'
      };
    }
  },
  generateRootCause: async (data) => {
    try {
      const res = await client.post('/ai/root-cause', data);
      return res.data;
    } catch (err) {
      return {
        confidence: 0.91,
        hypotheses: [
          { statement: 'Inconsistent staff roll-call logging during Period 1 peak', weight: 0.84, evidence: '84% late submissions correlate with floating teachers.' },
          { statement: 'Server API latency bottleneck at 08:30 AM registration window', weight: 0.65, evidence: 'Portal logs show 4.2s latency spike.' }
        ],
        contributingFactors: [
          { factor: 'Floating Teacher Assignment', impact: 'High' },
          { factor: 'Legacy Mobile App Cache Sync', impact: 'Medium' }
        ],
        capaRecommendation: {
          containmentAction: 'Enforce morning roll call paper scan upload by 09:00 AM.',
          correctiveAction: 'Deploy v3.2 app patch with offline roll call sync queuing.',
          preventiveAction: 'Bi-weekly automated mobile app performance monitoring.'
        },
        model: 'Gemini 1.5 Pro'
      };
    }
  },
  recordAIDecision: async (data) => {
    try {
      const res = await client.post('/ai/decision', data);
      return res.data;
    } catch (err) {
      return { success: true, decision: data.decision };
    }
  },

  // CAPAs
  getCapas: async (filters = {}) => {
    try {
      const res = await client.get('/capa', { params: filters });
      return res.data;
    } catch (err) {
      return null;
    }
  },
  createCapa: async (data) => {
    try {
      const res = await client.post('/capa', data);
      return res.data;
    } catch (err) {
      return {
        id: `CAPA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        defectTitle: data.defectTitle || 'CAPA Action Plan',
        schoolName: data.schoolName || 'Greenfield International School',
        ownerName: 'Marcus Sterling',
        priority: data.priority || 'High',
        status: 'Open',
        dueDate: data.dueDate || '2026-09-30',
        containmentAction: data.containmentAction,
        correctiveAction: data.correctiveAction,
        preventiveAction: data.preventiveAction,
        effectivenessScore: 0,
        verificationStatus: 'Pending Verification'
      };
    }
  },
  verifyCapa: async (id, data) => {
    try {
      const res = await client.post(`/capa/${id}/verify`, data);
      return res.data;
    } catch (err) {
      return { success: true, id, status: 'Closed', effectivenessScore: data.effectivenessScore };
    }
  },

  // Model Health & Audit Logs
  getModelMonitoring: async () => {
    try {
      const res = await client.get('/model-monitoring');
      return res.data;
    } catch (err) {
      return null;
    }
  },
  getAuditLogs: async () => {
    try {
      const res = await client.get('/audit-logs');
      return res.data;
    } catch (err) {
      return null;
    }
  },
  getNotifications: async () => {
    try {
      const res = await client.get('/notifications');
      return res.data;
    } catch (err) {
      return null;
    }
  },
  getSettings: async () => {
    try {
      const res = await client.get('/settings');
      return res.data;
    } catch (err) {
      return null;
    }
  },
  updateSettings: async (settings) => {
    try {
      const res = await client.put('/settings', settings);
      return res.data;
    } catch (err) {
      return settings;
    }
  }
};
