-- ============================================================================
-- GURU-CORE COMPLETE DATABASE SCHEMA - PRODUCTION READY
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  type TEXT DEFAULT 'outbound' CHECK (type IN ('outbound', 'inbound', 'survey', 'reminder')),
  script_id UUID,
  script_content TEXT,
  contacts_total INTEGER DEFAULT 0,
  contacts_completed INTEGER DEFAULT 0,
  contacts_connected INTEGER DEFAULT 0,
  schedule JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);

-- ============================================================================
-- 2. DOCUMENTS TABLE (Knowledge Base)
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'txt', 'mp4', 'mp3', 'json')),
  file_url TEXT,
  file_size INTEGER,
  content TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- ============================================================================
-- 3. SOPS TABLE (Standard Operating Procedures)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  ai_generated BOOLEAN DEFAULT false,
  ai_confidence FLOAT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sops_status ON sops(status);
CREATE INDEX IF NOT EXISTS idx_sops_category ON sops(category);

-- ============================================================================
-- 4. KNOWLEDGE GAPS TABLE (Autonomous Learning)
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  context TEXT,
  frequency INTEGER DEFAULT 1,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'suggestion_generated', 'approved', 'rejected')),
  suggested_sop_id UUID REFERENCES sops(id) ON DELETE SET NULL,
  suggested_answer TEXT,
  ai_confidence FLOAT,
  metadata JSONB DEFAULT '{}',
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_status ON knowledge_gaps(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_frequency ON knowledge_gaps(frequency DESC);

-- ============================================================================
-- 5. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Users can view their campaigns" ON campaigns FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can create campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can update their campaigns" ON campaigns FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY IF NOT EXISTS "Users can view their documents" ON documents FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can create documents" ON documents FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY IF NOT EXISTS "Users can view published SOPs" ON sops FOR SELECT USING (status = 'published' OR auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can create SOPs" ON sops FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY IF NOT EXISTS "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
