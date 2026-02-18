'use client';

import { useEffect, useState } from 'react';
import { ResponsiveTable } from '@/components/organisms/responsive-table';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
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

      // Format data for display
      const formatted = (data || []).map(call => ({
        id: call.id,
        caller_name: call.caller_name || 'Unknown',
        caller_phone: call.caller_phone || 'N/A',
        status: call.status === 'active' ? 'in_progress' as const : 
                call.status === 'completed' ? 'completed' as const : 
                call.status === 'escalated' ? 'escalated' as const : 'queued' as const,
        duration: call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-',
        time: new Date(call.started_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        resolution: call.ai_handled ? 'AI Resolved' : 'Human Required',
      }));

      setCalls(formatted);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calls</h1>
          <p className="text-gray-500 mt-1">Monitor and manage customer calls</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Calls' : 
                 activeTab === 'active' ? 'Active Calls' :
                 activeTab === 'completed' ? 'Completed Calls' : 'Escalated Calls'}
              </CardTitle>
              <CardDescription>
                {loading ? 'Loading calls...' : `${calls.length} calls found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : calls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No calls found</div>
              ) : (
                <ResponsiveTable
                data={calls}
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
                    id: 'resolution',
                    label: 'Resolution',
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
                    <p className="text-sm text-gray-600">{call.resolution}</p>
                  </div>
                )}
              />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
