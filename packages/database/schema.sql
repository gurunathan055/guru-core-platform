-- ============================================
-- GURU-CORE DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- AUTHENTICATION & USERS
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'supervisor', 'viewer')) DEFAULT 'viewer',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FEATURE FLAGS
-- ============================================

CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  conditions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTEGRATIONS
-- ============================================

CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('crm', 'telephony', 'messaging', 'erp', 'payment', 'analytics', 'storage', 'notification', 'custom')),
  provider TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'error')) DEFAULT 'inactive',
  config JSONB DEFAULT '{}',
  is_mock BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integrations_status ON public.integrations(status);
CREATE INDEX idx_integrations_type ON public.integrations(type);

-- ============================================
-- KNOWLEDGE BASE
-- ============================================

CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'mp4', 'mp3', 'text')),
  file_size_bytes BIGINT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  processing_status TEXT CHECK (processing_status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  processing_error TEXT,
  indexed_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES public.knowledge_base(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kb_category ON public.knowledge_base(category);
CREATE INDEX idx_kb_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX idx_kb_status ON public.knowledge_base(processing_status);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('knowledge_gap', 'self_healing', 'system_alert', 'call_escalation', 'approval_needed')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_user ON public.notifications(user_id, read);
CREATE INDEX idx_notif_created ON public.notifications(created_at DESC);

-- ============================================
-- AUDIT LOGS (DPDP Compliance)
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default feature flags
INSERT INTO public.feature_flags (name, description, enabled) VALUES
  ('voice_fingerprinting', 'Enable voice biometric recognition', false),
  ('multilingual_support', 'Support for multiple Indian languages', true),
  ('advanced_analytics', 'Advanced analytics and reporting features', false),
  ('plugin_system', 'Enable plugin marketplace and custom plugins', true),
  ('self_healing', 'Automatic system recovery and healing', true);
