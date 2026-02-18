# 🚨 URGENT: Database Setup Required

## The Issue
Your database doesn't have any tables yet. The error shows:
```
ERROR: 42P01: relation "calls" does not exist
```

## Complete Fix - 3 Simple Steps

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com
2. Select your project: `jovacmaxufdluvdhppzy`
3. Click **SQL Editor** (left sidebar)

### Step 2: Copy & Run Complete Setup Script

**Open this file:** `supabase/COMPLETE_SETUP.sql`

**Or copy this complete script:**

👉 The file `COMPLETE_SETUP.sql` contains everything you need. It creates:
- ✅ 8 tables (profiles, calls, integrations, campaigns, documents, sops, knowledge_gaps, notifications)
- ✅ All indexes for performance
- ✅ Row Level Security policies
- ✅ Automatic triggers
- ✅ Sample data for testing
- ✅ Admin user setup

**In Supabase SQL Editor:**
1. Click "New Query"
2. Paste the ENTIRE content from `COMPLETE_SETUP.sql`
3. Click **RUN** (or press F5)
4. Wait 10-15 seconds

### Step 3: Verify Success

You should see:
```
✅ Tables created successfully!

table_name
------------
calls
campaigns
documents
integrations
knowledge_gaps
notifications
profiles
sops
```

If you see this, you're done! ✅

### Step 4: Test the App

1. **Refresh your browser** (Ctrl+Shift+R)
2. **Login:** `admin@guru.com` / `password123`
3. **Go to Dashboard** - Should show:
   - Total Calls: 3
   - Recent calls table with sample data
   - No errors!

---

## Quick Verification Commands

After running the SQL, verify in Supabase:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check calls data
SELECT COUNT(*) FROM calls;

-- Check your profile
SELECT * FROM profiles WHERE email = 'admin@guru.com';
```

---

## What If It Still Doesn't Work?

### Check 1: Is the script complete?
The SQL script should be ~400+ lines. Make sure you copied everything.

### Check 2: Check for errors
After running, look at the bottom of SQL Editor for any red error messages.

### Check 3: Try creating just the calls table
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caller_phone TEXT NOT NULL,
  caller_name TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration INTEGER,
  status TEXT DEFAULT 'active',
  topic TEXT,
  sentiment TEXT,
  ai_handled BOOLEAN DEFAULT true,
  ai_confidence FLOAT,
  escalation_risk TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view calls" ON calls FOR SELECT USING (true);
```

---

## After Setup is Complete

Your app will immediately:
- ✅ Dashboard shows real metrics
- ✅ Calls page shows data
- ✅ Campaigns can be created
- ✅ All pages work without errors
- ✅ Real-time updates work

---

**Current Status:**
- ⬜ Database tables NOT created
- ⬜ SQL script needs to be run
- ✅ Code is deployed and ready
- ✅ App will work once tables exist

**Next Action:** Run `COMPLETE_SETUP.sql` in Supabase SQL Editor NOW
