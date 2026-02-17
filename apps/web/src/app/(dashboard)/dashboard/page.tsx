'use client';

import { MetricCard } from '@/components/molecules/metric-card';
import { ResponsiveTable } from '@/components/organisms/responsive-table';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Phone, TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstration
const recentCalls = [
  {
    id: '1',
    caller_name: 'John Distributor',
    caller_phone: '+91 98765 43210',
    status: 'completed' as const,
    duration: '5:23',
    time: '10:30 AM',
  },
  {
    id: '2',
    caller_name: 'Retailer Shop',
    caller_phone: '+91 98765 43211',
    status: 'in_progress' as const,
    duration: '2:15',
    time: '10:45 AM',
  },
  {
    id: '3',
    caller_name: 'Customer Query',
    caller_phone: '+91 98765 43212',
    status: 'queued' as const,
    duration: '-',
    time: '11:00 AM',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Calls Today"
          value="248"
          change={{ value: 12, trend: 'up' }}
          icon={<Phone className="w-4 h-4" />}
        />
        <MetricCard
          title="AI Deflection Rate"
          value="73%"
          change={{ value: 5, trend: 'up' }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Avg Resolution Time"
          value="3:45"
          change={{ value: 8, trend: 'down' }}
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          title="Active Users"
          value="1,234"
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
