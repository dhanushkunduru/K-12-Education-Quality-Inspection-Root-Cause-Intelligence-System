-- ==============================================================================
-- K-12 EDUCATION QUALITY INSPECTION & ROOT-CAUSE INTELLIGENCE SYSTEM
-- SUPABASE POSTGRESQL SCHEMA MIGRATION (0001_init.sql)
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Schools
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    campus VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    student_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User & Roles Management
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO roles (name, description) VALUES
('Manager', 'Full executive quality control and decision approval permissions'),
('Quality Engineer', 'Configures AI thresholds, conducts root cause analysis & CAPA tracking'),
('Inspector', 'Executes digital quality inspections, logs evidence & findings'),
('Auditor', 'Independent audit log verification and CAPA effectiveness review')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL REFERENCES roles(name),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Digital Inspection Management
CREATE TABLE IF NOT EXISTS inspection_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'Monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    severity VARCHAR(20) DEFAULT 'Medium',
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    quality_score NUMERIC(5,2) DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending', -- Pass, Fail, N/A, Pending
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL, -- Image, Document, Text
    url TEXT NOT NULL,
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Defect Detection & AI Classification
CREATE TABLE IF NOT EXISTS defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_number VARCHAR(50) UNIQUE NOT NULL,
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'AI Classified',
    recurrence_count INT DEFAULT 1,
    stage VARCHAR(50) DEFAULT 'AI Detection',
    description TEXT NOT NULL,
    ai_confidence NUMERIC(4,3),
    ai_model_version VARCHAR(100),
    ai_explanation TEXT,
    ai_status VARCHAR(50) DEFAULT 'Pending Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL, -- Approve, Reject, Override
    original_category VARCHAR(100),
    overridden_category VARCHAR(100),
    original_severity VARCHAR(20),
    overridden_severity VARCHAR(20),
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Root Cause Intelligence & CAPA
CREATE TABLE IF NOT EXISTS root_cause_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    confidence NUMERIC(4,3),
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS root_cause_hypotheses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES root_cause_analyses(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    weight NUMERIC(4,3) NOT NULL,
    evidence TEXT,
    is_approved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS capas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capa_number VARCHAR(50) UNIQUE NOT NULL,
    defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
    root_cause_analysis_id UUID REFERENCES root_cause_analyses(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'High',
    status VARCHAR(50) DEFAULT 'Open',
    due_date DATE NOT NULL,
    containment_action TEXT NOT NULL,
    corrective_action TEXT NOT NULL,
    preventive_action TEXT NOT NULL,
    effectiveness_score INT DEFAULT 0,
    verification_status VARCHAR(50) DEFAULT 'Pending Verification',
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications & Audit Trails
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    target_route VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    outcome VARCHAR(20) DEFAULT 'SUCCESS',
    details TEXT
);

-- Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_inspections_school ON inspections(school_id);
CREATE INDEX IF NOT EXISTS idx_defects_school ON defects(school_id);
CREATE INDEX IF NOT EXISTS idx_defects_category ON defects(category);
CREATE INDEX IF NOT EXISTS idx_capas_status ON capas(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE capas ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view data
CREATE POLICY "Allow authenticated read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access on inspections" ON inspections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access on defects" ON defects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access on capas" ON capas FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read access on audit_logs" ON audit_logs FOR SELECT USING (true);
