'use client';

import { ResponsiveTable } from '@/components/organisms/responsive-table';
import { StatusBadge } from '@/components/molecules/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';

// Mock data
const calls = [
  {
    id: '1',
    caller_name: 'John Distributor',
    caller_phone: '+91 98765 43210',
    status: 'completed' as const,
    duration: '5:23',
    time: '10:30 AM',
    resolution: 'AI Resolved',
  },
  {
    id: '2',
    caller_name: 'Retailer Shop',
    caller_phone: '+91 98765 43211',
    status: 'in_progress' as const,
    duration: '2:15',
    time: '10:45 AM',
    resolution: 'In Progress',
  },
];

export default function CallsPage() {
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Calls</CardTitle>
              <CardDescription>Complete call history and live calls</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No active calls at the moment
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Completed calls will appear here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalated">
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No escalated calls
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
