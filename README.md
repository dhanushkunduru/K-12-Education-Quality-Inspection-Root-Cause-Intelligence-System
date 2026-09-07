# K-12 Education Quality Inspection & Root-Cause Intelligence System

An enterprise-grade, full-stack AI decision-support platform designed for K-12 School Groups to digitize quality inspections, detect non-conformances, identify recurring root cause drivers, execute closed-loop Corrective & Preventive Actions (CAPA), and monitor AI model health.

---

## Key Features

- **Quality Overview Dashboard**: Real-time operational intelligence featuring 8 animated KPI cards with sparklines, 6 interactive Recharts graphs (Pareto 80/20 distribution, Quality Trends, Defect Severity, Domain Breakdown, Campus Matrix), and Gemini AI Intelligence feed with human governance actions (*Approve*, *Reject*, *Override with Reason*).
- **Digital Inspection Execution Runner**: Interactive sampling checklist runner supporting *Pass*, *Fail*, *N/A* decisions, quantitative measurement entries, evidence document/photo upload preview, and instant defect logging.
- **Defects Review & Workflow Tracker**: Dual gallery and data table views with severity badges, recurrence counters, and visual multi-stage resolution pipeline stepper.
- **AI Defect Detection Workspace**: Direct evidence analyzer powered by **Google Gemini 1.5 Pro API**, step-by-step processing state animation, empirical confidence scoring, evidence extraction, and human override audit logging.
- **Root Cause Intelligence**: Pareto category distribution, empirical contributing factor correlation ranking, and hypothesis breakdown distinguishing AI-suggested recommendations from human-approved decisions.
- **CAPA Management**: Closed-loop action tracker with containment, systemic corrective, and preventive action steps, priority grading, progress bars, and Auditor verification sign-off.
- **Model Monitoring & Health**: Real-time tracking of AI precision, recall, latency, concept drift, override rate, and model version logs.
- **Report Generator & Exporter**: Preset report templates, custom date/campus filters, raw CSV data exporter, and printable PDF document viewer.
- **Role-Based Access Control (RBAC)**: Supports Manager, Quality Engineer, Inspector, and Auditor roles with instant switcher presets and permission matrix enforcement.
- **Immutable Audit Logs**: Comprehensive event trail recording every user login, data edit, AI run, approval, and configuration override.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Enterprise Glassmorphism Design System)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with fallback simulation service layer

### Backend
- **Runtime**: Node.js + Express.js
- **AI Integration**: Google Gemini API (`@google/genai` & REST API)
- **Security & Validation**: Helmet, CORS, JWT, Zod
- **Database**: Supabase PostgreSQL (or in-memory mock state fallback)

### Database
- **Engine**: Supabase PostgreSQL
- **Schema**: 25+ relational DDL tables with UUIDs, indexes, FK constraints, and Row Level Security (RLS) policies (`supabase/migrations/0001_init.sql`).

---

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── components/ui/   # Reusable UI component suite (Button, Card, Badge, KPICard, AIInsightCard, DataTable, Modal, Drawer, CommandPalette, etc.)
│   │   ├── context/         # AuthContext & DataContext providers
│   │   ├── layouts/         # AppLayout shell with collapsible sidebar & header
│   │   ├── pages/           # Dashboard, Inspections, Defects, AI Workspace, Root Cause, CAPA, Reports, Notifications, Users, Audit Logs, Settings
│   │   ├── services/        # Axios API client with fallback service layer
│   │   ├── App.jsx          # React Router DOM routes
│   │   ├── index.css        # Tailwind design tokens & glassmorphism styles
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
│
├── backend/
│   ├── src/
│   │   ├── data/            # Realistic K-12 operational domain mock store
│   │   ├── routes/          # REST API endpoints (/api/dashboard, /api/inspections, /api/ai/analyze, /api/capa, etc.)
│   │   ├── services/        # Gemini AI integration service
│   │   └── server.js        # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── supabase/
│   └── migrations/
│       └── 0001_init.sql    # PostgreSQL DDL schema & RLS policies
│
├── README.md
└── DEPLOYMENT_GUIDE.md
```

---

## Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The Express backend will start at `http://localhost:5000` with health check available at `http://localhost:5000/api/health`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React Vite frontend will start at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_secure_jwt_secret

# Optional: Supabase Credentials
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Google Gemini AI Integration (Rule engine fallback active if unconfigured)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-pro
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
