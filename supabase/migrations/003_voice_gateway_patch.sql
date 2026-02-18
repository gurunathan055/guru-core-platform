-- ============================================================================
-- VOICE GATEWAY PATCH - Run this AFTER COMPLETE_SETUP.sql
-- Adds columns needed for Knowlarity SR voice bot integration
-- ============================================================================

-- Add voice-specific columns to calls table
ALTER TABLE calls ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS last_recording_url TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS last_transcript TEXT;

-- Index for per-user call lookup
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_metadata_owner ON calls USING gin(metadata);

-- ============================================================================
-- RLS: Update calls policies for per-user visibility + admin override
-- ============================================================================

-- Drop old broad policy
DROP POLICY IF EXISTS "Authenticated users can view all calls" ON calls;
DROP POLICY IF EXISTS "Authenticated users can create calls" ON calls;
DROP POLICY IF EXISTS "Authenticated users can update calls" ON calls;

-- Users see only their own calls (via user_id OR metadata->owner_user_id)
CREATE POLICY "Users can view own calls"
ON calls FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR (metadata->>'owner_user_id') = auth.uid()::text
  OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Authenticated users can create calls"
ON calls FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own calls"
ON calls FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR (metadata->>'owner_user_id') = auth.uid()::text
  OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- Integrations: ensure per-user config JSONB supports sr_api_key lookup
-- ============================================================================
-- sr_api_key is stored inside integrations.config JSONB
-- No schema changes needed; existing config JSONB column handles it

-- Index for fast provider lookup
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_created_by ON integrations(created_by);

SELECT 'Voice gateway patch applied successfully!' as status;
