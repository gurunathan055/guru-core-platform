'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/molecules/metric-card';
import { ResponsiveTable } from '@/components/organisms/responsive-table';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Phone, TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    aiDeflectionRate: 0,
    avgResolutionTime: '0:00',
    activeUsers: 0,
  });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch all calls
      const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // If table doesn't exist or RLS blocks, show empty state
        setStats({
          totalCalls: 0,
          aiDeflectionRate: 0,
          avgResolutionTime: '0:00',
          activeUsers: 0,
        });
        setRecentCalls([]);
        setLoading(false);
        return;
      }

      // Calculate stats
      const total = calls?.length || 0;
      const aiHandled = calls?.filter(c => c.ai_handled).length || 0;
      const completed = calls?.filter(c => c.status === 'completed') || [];
      
      const avgDuration = completed.length > 0
        ? completed.reduce((sum, c) => sum + (c.duration || 0), 0) / completed.length
        : 0;

      const mins = Math.floor(avgDuration / 60);
      const secs = Math.round(avgDuration % 60);

      setStats({
        totalCalls: total,
        aiDeflectionRate: total > 0 ? Math.round((aiHandled / total) * 100) : 0,
        avgResolutionTime: `${mins}:${secs.toString().padStart(2, '0')}`,
        activeUsers: calls?.filter(c => c.status === 'active').length || 0,
      });

      // Format recent calls
      const formatted = (calls || []).slice(0, 5).map(call => ({
        id: call.id,
        caller_name: call.caller_name || 'Unknown',
        caller_phone: call.caller_phone || 'N/A',
        status: call.status === 'active' ? 'in_progress' as const : 
                call.status === 'completed' ? 'completed' as const : 'queued' as const,
        duration: call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-',
        time: new Date(call.started_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }));

      setRecentCalls(formatted);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Show empty state on any error
      setStats({
        totalCalls: 0,
        aiDeflectionRate: 0,
        avgResolutionTime: '0:00',
        activeUsers: 0,
      });
      setRecentCalls([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Calls Today"
          value={stats.totalCalls.toString()}
          change={{ value: 12, trend: 'up' }}
          icon={<Phone className="w-4 h-4" />}
        />
        <MetricCard
          title="AI Deflection Rate"
          value={`${stats.aiDeflectionRate}%`}
          change={{ value: 5, trend: 'up' }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={stats.avgResolutionTime}
          change={{ value: 8, trend: 'down' }}
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          title="Active Calls"
          value={stats.activeUsers.toString()}
          change={{ value: 3, trend: 'up' }}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Calls over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart visualization will be here (Recharts)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Customer satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Sentiment chart will be here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest customer interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            data={recentCalls}
            columns={[
              {
                id: 'caller_name',
                label: 'Caller',
                render: (call) => (
                  <div>
                    <p className="font-medium">{call.caller_name}</p>
                    <p className="text-sm text-gray-500">{call.caller_phone}</p>
                  </div>
                ),
              },
              {
                id: 'status',
                label: 'Status',
                render: (call) => <StatusBadge status={call.status} />,
              },
              {
                id: 'duration',
                label: 'Duration',
              },
              {
                id: 'time',
                label: 'Time',
              },
            ]}
            mobileCard={(call) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{call.caller_name}</p>
                    <p className="text-sm text-gray-500">{call.caller_phone}</p>
                  </div>
                  <StatusBadge status={call.status} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{call.duration}</span>
                  <span>{call.time}</span>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
