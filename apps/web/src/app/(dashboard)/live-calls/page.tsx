'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Phone,
  PhoneOff,
  Volume2,
  UserPlus,
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
} from 'lucide-react';

export default function LiveCallsPage() {
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchActiveCalls();
    const interval = setInterval(fetchActiveCalls, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setActiveCalls(data || generateMockCalls());
    } catch (error: any) {
      setActiveCalls(generateMockCalls());
    } finally {
      setLoading(false);
    }
  };

  const generateMockCalls = () => [
    {
      id: '1',
      caller_phone: '+91 98765 43210',
      caller_name: 'Rajesh Kumar',
      started_at: new Date(Date.now() - 120000).toISOString(),
      ai_confidence: 0.92,
      topic: 'Product Return',
      sentiment: 'neutral',
      escalation_risk: 'low',
    },
    {
      id: '2',
      caller_phone: '+91 87654 32109',
      caller_name: 'Priya Sharma',
      started_at: new Date(Date.now() - 45000).toISOString(),
      ai_confidence: 0.78,
      topic: 'Billing Issue',
      sentiment: 'negative',
      escalation_risk: 'high',
    },
    {
      id: '3',
      caller_phone: '+91 76543 21098',
      caller_name: 'Amit Patel',
      started_at: new Date(Date.now() - 300000).toISOString(),
      ai_confidence: 0.95,
      topic: 'Order Status',
      sentiment: 'positive',
      escalation_risk: 'low',
    },
  ];

  const handleTakeover = (callId: string) => {
    toast.info('Warm handoff initiated. Connecting to call...');
    setSelectedCall(activeCalls.find((c) => c.id === callId));
  };

  const handleListen = (callId: string) => {
    toast.info('Listening to call in silent mode...');
    setSelectedCall(activeCalls.find((c) => c.id === callId));
  };

  const handleEndCall = async (callId: string) => {
    if (!confirm('Are you sure you want to end this call?')) return;

    try {
      await supabase
        .from('calls')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', callId);

      toast.success('Call ended');
      fetchActiveCalls();
    } catch (error: any) {
      toast.error('Failed to end call');
    }
  };

  const getCallDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Call Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor and manage active calls in real-time</p>
        </div>
        <Badge variant="default" className="px-4 py-2 text-lg">
          <Activity className="mr-2 h-5 w-5 animate-pulse" />
          {activeCalls.length} Active Calls
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalls.length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:23</div>
            <p className="text-xs text-muted-foreground">Minutes per call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Resolution</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Handled by AI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Calls</CardTitle>
              <CardDescription>Real-time call monitoring and management</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading calls...</div>
              ) : activeCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PhoneOff className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  No active calls at the moment
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caller</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.caller_name}</p>
                            <p className="text-sm text-gray-500">{call.caller_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{call.topic}</TableCell>
                        <TableCell className="font-mono">
                          {getCallDuration(call.started_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getSentimentColor(call.sentiment)}`} />
                            <span className="capitalize">{call.sentiment}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(call.escalation_risk)}>
                            {call.escalation_risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleListen(call.id)}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleTakeover(call.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Call Details</CardTitle>
              <CardDescription>Live transcript and insights</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCall ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Caller</p>
                    <p className="font-medium">{selectedCall.caller_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Topic</p>
                    <p className="font-medium">{selectedCall.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">AI Confidence</p>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${selectedCall.ai_confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-sm mt-1">{(selectedCall.ai_confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full" variant="default">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Take Over Call
                    </Button>
                    <Button className="w-full" variant="destructive">
                      <PhoneOff className="mr-2 h-4 w-4" />
                      End Call
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a call to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
