# GURU-CORE COMPLETE FIX REPORT
**Date:** 2026-02-18  
**Status:** Production-Ready Fixes Required

---

## FEATURE STATUS TABLE

| Feature Name | Requirement | Current Status | Root Cause of Failure |
|-------------|-------------|----------------|----------------------|
| **Dashboard Stats** | Display real-time metrics from database | ⚠️ Mock Data | `apps/web/src/app/(dashboard)/dashboard/page.tsx:10-35` - No API fetch, hardcoded data |
| **Calls List** | Show all calls from database | ⚠️ Mock Data | `apps/web/src/app/(dashboard)/calls/page.tsx:11-30` - No API call, hardcoded array |
| **Live Calls** | Real-time monitoring with Supabase | ⚠️ Partial | `apps/web/src/app/(dashboard)/live-calls/page.tsx:60-75` - Real-time sub exists but generates mock data on error |
| **Analytics Charts** | Display actual call analytics | ❌ Mock Data | `apps/web/src/app/(dashboard)/analytics/page.tsx:15-250` - All chart data hardcoded |
| **Campaigns** | CRUD operations for campaigns | ❌ Not Implemented | No API routes, no database table `campaigns` |
| **Knowledge Base** | Upload & manage documents | ❌ UI Only | No upload handler, no `documents` table |
| **SOP Generator** | AI-powered SOP creation | ❌ UI Only | No LLM integration, no `/api/sops` endpoint |
| **Autonomous Learning** | Detect gaps & auto-generate SOPs | ❌ UI Only | No `knowledge_gaps` table, no AI detection logic |
| **Integrations** | Manage API connections | ⚠️ Partial | Database table exists but no CRUD API |
| **Reports Export** | Export analytics as PDF/CSV/Excel | ⚠️ CSV Only | PDF/Excel buttons non-functional |
| **Sandbox Voice** | Web-based call testing | ⚠️ No STT/TTS | Recording works but no speech-to-text API |
| **Admin Panel** | User management | ✅ Working | Fully functional |
| **Authentication** | Login/Signup/Logout | ✅ Working | Fully functional |
| **Knowlarity Webhook** | Receive incoming calls | ✅ Working | Fully functional |

---

## CODE CORRECTIONS

### 1. Dashboard Stats - Connect to Real API

**File:** `/apps/web/src/app/(dashboard)/dashboard/page.tsx`

**Original Code:**
```typescript
// Lines 10-35 - Hardcoded data
const recentCalls = [
  {
    id: '1',
    caller: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    // ... hardcoded data
  },
];
```

**Fixed Code:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    avgResponse: 0,
    successRate: 0,
  });
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch calls for stats
      const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const total = calls?.length || 0;
      const active = calls?.filter(c => c.status === 'active').length || 0;
      const completed = calls?.filter(c => c.status === 'completed') || [];
      
      const avgDuration = completed.length > 0
        ? completed.reduce((sum, c) => sum + (c.duration || 0), 0) / completed.length
        : 0;

      setStats({
        totalCalls: total,
        activeCalls: active,
        avgResponse: Math.round(avgDuration),
        successRate: total > 0 ? Math.round((completed.length / total) * 100) : 0,
      });

      // Recent calls (last 5)
      setRecentCalls(calls?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <p>Total Calls</p>
          </CardContent>
        </Card>
        {/* ... other cards */}
      </div>

      {/* Recent Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.caller_name}</TableCell>
                  <TableCell>{call.caller_phone}</TableCell>
                  <TableCell>
                    <Badge variant={call.status === 'completed' ? 'success' : 'default'}>
                      {call.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Verification Steps:**
1. Navigate to `/dashboard`
2. Check browser console - should see database queries
3. Add a test call via `/api/calls` POST
4. Refresh dashboard - new call should appear

---

### 2. Calls List - Fetch from Database

**File:** `/apps/web/src/app/(dashboard)/calls/page.tsx`

**Original Code:**
```typescript
// Lines 11-30 - Hardcoded array
const [calls] = useState([
  { id: '1', caller: 'Rajesh Kumar', /* ... */ },
  { id: '2', caller: 'Priya Sharma', /* ... */ },
]);
```

**Fixed Code:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    fetchCalls();
  }, [activeTab]);

  async function fetchCalls() {
    setLoading(true);
    try {
      let query = supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false });

      // Filter by tab
      if (activeTab === 'active') {
        query = query.eq('status', 'active');
      } else if (activeTab === 'completed') {
        query = query.eq('status', 'completed');
      } else if (activeTab === 'escalated') {
        query = query.eq('status', 'escalated');
      }

      const { data, error } = await query;

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : calls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No calls found</div>
          ) : (
            <Table>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.caller_name}</TableCell>
                    <TableCell>{call.caller_phone}</TableCell>
                    <TableCell>{call.topic}</TableCell>
                    <TableCell>
                      <Badge>{call.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Verification Steps:**
1. Navigate to `/calls`
2. Switch between tabs (All/Active/Completed)
3. Check network tab - should see Supabase API calls
4. Add test data via webhook or API

---

### 3. Create Campaigns Database Table & API

**File:** Create `/apps/web/src/app/api/campaigns/route.ts`

**New Code:**
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(campaigns || []);
  } catch (error: any) {
    console.error('Campaigns fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('campaigns')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Campaign creation error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
```

**Database Migration SQL:**
```sql
-- Run in Supabase SQL Editor
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  type TEXT DEFAULT 'outbound',
  script_id UUID REFERENCES sops(id),
  contacts_total INTEGER DEFAULT 0,
  contacts_completed INTEGER DEFAULT 0,
  contacts_connected INTEGER DEFAULT 0,
  schedule JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own campaigns
CREATE POLICY "Users can view their campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = created_by);

-- Policy: Users can create campaigns
CREATE POLICY "Users can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = created_by);
```

**Update Campaigns Page:**

**File:** `/apps/web/src/app/(dashboard)/campaigns/page.tsx`

**Replace mock data with:**
```typescript
useEffect(() => {
  fetch('/api/campaigns')
    .then(res => res.json())
    .then(data => setCampaigns(data));
}, []);

const handleCreateCampaign = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.get('name'),
      script_id: formData.get('script'),
      status: 'active',
    }),
  });

  if (response.ok) {
    toast.success('Campaign created');
    // Refresh list
  }
};
```

**Verification Steps:**
1. Run SQL migration in Supabase
2. Navigate to `/campaigns`
3. Click "Create Campaign"
4. Fill form and submit
5. New campaign should appear in table

---

### 4. Fix Analytics to Use Real Data

**File:** `/apps/web/src/app/api/analytics/route.ts`

**Original Code:**
```typescript
// Returns hardcoded mock data
```

**Fixed Code:**
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Fetch calls within range
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: true });

    if (error) throw error;

    // Calculate metrics
    const total = calls?.length || 0;
    const aiHandled = calls?.filter(c => c.ai_handled).length || 0;
    const avgDuration = calls?.reduce((sum, c) => sum + (c.duration || 0), 0) / total || 0;

    // Group by date for charts
    const callsByDate: Record<string, number> = {};
    calls?.forEach(call => {
      const date = new Date(call.started_at).toLocaleDateString();
      callsByDate[date] = (callsByDate[date] || 0) + 1;
    });

    // Sentiment distribution
    const sentimentCounts = {
      positive: calls?.filter(c => c.sentiment === 'positive').length || 0,
      neutral: calls?.filter(c => c.sentiment === 'neutral').length || 0,
      negative: calls?.filter(c => c.sentiment === 'negative').length || 0,
    };

    return NextResponse.json({
      summary: {
        totalCalls: total,
        aiResolutionRate: total > 0 ? Math.round((aiHandled / total) * 100) : 0,
        avgDuration: Math.round(avgDuration),
      },
      callVolumeTrend: Object.entries(callsByDate).map(([date, count]) => ({
        date,
        calls: count,
      })),
      sentimentDistribution: [
        { name: 'Positive', value: sentimentCounts.positive },
        { name: 'Neutral', value: sentimentCounts.neutral },
        { name: 'Negative', value: sentimentCounts.negative },
      ],
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
```

**Update Analytics Page:**

**File:** `/apps/web/src/app/(dashboard)/analytics/page.tsx`

```typescript
useEffect(() => {
  fetch(`/api/analytics?range=${timeRange}`)
    .then(res => res.json())
    .then(data => {
      setCallVolumeData(data.callVolumeTrend);
      setSentimentData(data.sentimentDistribution);
      // ... update other charts
    });
}, [timeRange]);
```

**Verification Steps:**
1. Add test calls with different sentiments
2. Navigate to `/analytics`
3. Charts should show real data
4. Change date range - data should update

---

### 5. Enable Real-time Updates for Live Calls

**File:** `/apps/web/src/app/(dashboard)/live-calls/page.tsx`

**Issue:** Falls back to mock data when no calls exist

**Fixed Code:**
```typescript
const fetchActiveCalls = async () => {
  try {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('status', 'active')
      .order('started_at', { ascending: false });

    if (error) throw error;
    
    // Show empty state if no calls, don't fall back to mock
    setActiveCalls(data || []);
  } catch (error: any) {
    console.error('Error fetching calls:', error);
    setActiveCalls([]); // Empty array, not mock data
  } finally {
    setLoading(false);
  }
};
```

**Verification Steps:**
1. Trigger webhook with test call
2. Go to `/live-calls`
3. Call should appear instantly via real-time subscription
4. Update call status in database - UI should update

---

## POST-FIX VERIFICATION CHECKLIST

### Manual Testing Steps:

**1. Authentication Flow**
- [ ] Sign up new user
- [ ] Log in
- [ ] Access protected route
- [ ] Log out
- [ ] Try accessing protected route (should redirect to login)

**2. Dashboard**
- [ ] Open `/dashboard`
- [ ] See real metrics (not hardcoded numbers)
- [ ] Add call via API
- [ ] Refresh dashboard - new call appears in recent calls

**3. Calls Management**
- [ ] Navigate to `/calls`
- [ ] Switch tabs (All/Active/Completed/Escalated)
- [ ] Verify API calls in Network tab
- [ ] Add test call - should appear in list

**4. Live Calls**
- [ ] Open `/live-calls`
- [ ] Trigger webhook to create active call
- [ ] Verify call appears immediately (real-time)
- [ ] Change call status in database
- [ ] UI updates without refresh

**5. Analytics**
- [ ] Open `/analytics`
- [ ] Charts show real data from database
- [ ] Change date range
- [ ] Data refreshes

**6. Campaigns**
- [ ] Run SQL migration for campaigns table
- [ ] Open `/campaigns`
- [ ] Click "Create Campaign"
- [ ] Submit form
- [ ] New campaign appears in table

**7. Admin Panel**
- [ ] Log in as admin
- [ ] Navigate to `/admin`
- [ ] View users list
- [ ] Change user role
- [ ] Delete test user

**8. Webhooks**
- [ ] Configure Knowlarity webhook URL
- [ ] Make test call
- [ ] Verify call appears in database
- [ ] Check `/live-calls` for new entry

### Automated Testing Script:

```bash
#!/bin/bash
# Run from project root

echo "Testing API Endpoints..."

# Test dashboard stats
curl http://localhost:3000/api/dashboard/stats

# Test calls list
curl http://localhost:3000/api/calls

# Test analytics
curl http://localhost:3000/api/analytics?range=7d

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/knowlarity \
  -H "Content-Type: application/json" \
  -d '{
    "caller_id": "+919876543210",
    "caller_name": "Test User",
    "event": "answered"
  }'

echo "All tests completed!"
```

---

## IMPLEMENTATION PRIORITY

**Phase 1: Critical Fixes (1-2 days)**
1. ✅ Dashboard real data
2. ✅ Calls list real data
3. ✅ Live calls real-time fix
4. ✅ Analytics real data

**Phase 2: Missing Features (3-5 days)**
5. ⬜ Campaigns database + API
6. ⬜ Knowledge Base upload + storage
7. ⬜ Reports PDF/Excel export

**Phase 3: AI Integration (5-7 days)**
8. ⬜ SOP Generator LLM integration
9. ⬜ Sandbox STT/TTS APIs
10. ⬜ Autonomous learning detection

**Total Estimated Time:** 9-14 days with 1 full-stack developer

---

## DEPLOYMENT CHECKLIST

Before deploying fixes:
- [ ] Run all database migrations
- [ ] Update environment variables
- [ ] Test all API endpoints
- [ ] Verify authentication works
- [ ] Check all pages load
- [ ] Test on mobile devices
- [ ] Run `npm run build` without errors
- [ ] Push to GitHub
- [ ] Verify Vercel deployment succeeds
- [ ] Test production URL

---

**End of Report**
