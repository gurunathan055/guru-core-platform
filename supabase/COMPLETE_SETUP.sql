-- ============================================================================
-- GURU-CORE COMPLETE DATABASE SETUP - RUN THIS FIRST
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'supervisor', 'viewer')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. CALLS TABLE (main table for call records)
-- ============================================================================
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caller_phone TEXT NOT NULL,
  caller_name TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- in seconds
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'escalated', 'failed')),
  topic TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  ai_handled BOOLEAN DEFAULT true,
  ai_confidence FLOAT,
  escalation_risk TEXT CHECK (escalation_risk IN ('low', 'medium', 'high')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. INTEGRATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  config JSONB DEFAULT '{}',
  is_mock BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CAMPAIGNS TABLE
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. DOCUMENTS TABLE (Knowledge Base)
-- ============================================================================
-- ENABLE VECTOR EXTENSION FOR AI MEMORY
CREATE EXTENSION IF NOT EXISTS vector;

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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI MEMORY (Embeddings)
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT, -- Chunk of text
  embedding vector(1536), -- OpenAI text-embedding-3-small
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX FOR FAST SEARCH
CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- SEARCH FUNCTION (RPC)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.content,
    1 - (document_embeddings.embedding <=> query_embedding) as similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- 6. SOPS TABLE (Standard Operating Procedures)
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
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. KNOWLEDGE GAPS TABLE (Autonomous Learning)
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  context TEXT,
  frequency INTEGER DEFAULT 1,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'suggestion_generated', 'approved', 'rejected')),
  suggested_sop_id UUID REFERENCES sops(id),
  suggested_answer TEXT,
  ai_confidence FLOAT,
  metadata JSONB DEFAULT '{}',
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_sentiment ON calls(sentiment);
CREATE INDEX IF NOT EXISTS idx_calls_ai_handled ON calls(ai_handled);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

CREATE INDEX IF NOT EXISTS idx_sops_status ON sops(status);
CREATE INDEX IF NOT EXISTS idx_sops_category ON sops(category);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Calls RLS (allow all authenticated users to view/create/update)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view all calls" ON calls;
CREATE POLICY "Authenticated users can view all calls" 
ON calls FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create calls" ON calls;
CREATE POLICY "Authenticated users can create calls" 
ON calls FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update calls" ON calls;
CREATE POLICY "Authenticated users can update calls" 
ON calls FOR UPDATE 
TO authenticated 
USING (true);

-- Integrations RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view integrations" ON integrations;
CREATE POLICY "Authenticated users can view integrations" 
ON integrations FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can manage their integrations" ON integrations;
CREATE POLICY "Users can manage their integrations" 
ON integrations FOR ALL 
TO authenticated 
USING (created_by = auth.uid() OR created_by IS NULL);

-- Campaigns RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their campaigns" ON campaigns;
CREATE POLICY "Users can view their campaigns" 
ON campaigns FOR SELECT 
TO authenticated 
USING (created_by = auth.uid() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
CREATE POLICY "Users can create campaigns" 
ON campaigns FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their campaigns" ON campaigns;
CREATE POLICY "Users can update their campaigns" 
ON campaigns FOR UPDATE 
TO authenticated 
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their campaigns" ON campaigns;
CREATE POLICY "Users can delete their campaigns" 
ON campaigns FOR DELETE 
TO authenticated 
USING (created_by = auth.uid());

-- Documents RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their documents" ON documents;
CREATE POLICY "Users can view their documents" 
ON documents FOR SELECT 
TO authenticated 
USING (created_by = auth.uid() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create documents" ON documents;
CREATE POLICY "Users can create documents" 
ON documents FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

-- SOPs RLS
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view published SOPs" ON sops;
CREATE POLICY "Users can view published SOPs" 
ON sops FOR SELECT 
TO authenticated 
USING (status = 'published' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create SOPs" ON sops;
CREATE POLICY "Users can create SOPs" 
ON sops FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

-- Knowledge Gaps RLS
ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "All authenticated users can view knowledge gaps" ON knowledge_gaps;
CREATE POLICY "All authenticated users can view knowledge gaps" 
ON knowledge_gaps FOR SELECT 
TO authenticated 
USING (true);

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their notifications" ON notifications;
CREATE POLICY "Users can update their notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- ============================================================================
-- AUTOMATIC TRIGGERS FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calls_updated_at ON calls;
CREATE TRIGGER update_calls_updated_at 
BEFORE UPDATE ON calls 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at 
BEFORE UPDATE ON integrations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at 
BEFORE UPDATE ON campaigns 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at 
BEFORE UPDATE ON documents 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sops_updated_at ON sops;
CREATE TRIGGER update_sops_updated_at 
BEFORE UPDATE ON sops 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Create profile for admin user (if exists)
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 
       COALESCE(raw_user_meta_data->>'full_name', 'Admin User'), 
       'admin'
FROM auth.users
WHERE email = 'admin@guru.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', 
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

-- Insert sample calls (optional - comment out if not needed)
INSERT INTO calls (caller_phone, caller_name, status, topic, sentiment, ai_handled, duration)
VALUES 
  ('+91 9876543210', 'Rajesh Kumar', 'completed', 'Order Status', 'positive', true, 180),
  ('+91 9876543211', 'Priya Sharma', 'completed', 'Product Return', 'neutral', true, 240),
  ('+91 9876543212', 'Amit Patel', 'completed', 'Billing Issue', 'negative', false, 320)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (check if tables were created)
-- ============================================================================

SELECT 'Tables created successfully!' as status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'calls', 'integrations', 'campaigns', 'documents', 'sops', 'knowledge_gaps', 'notifications')
ORDER BY table_name;

-- ============================================================================
-- MIGRATION COMPLETE
-- All tables created with RLS policies
-- ============================================================================
