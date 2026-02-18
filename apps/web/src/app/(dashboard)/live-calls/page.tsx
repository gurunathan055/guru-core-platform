'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  UserPlus,
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
  Users,
  Search,
  RefreshCw,
} from 'lucide-react';

function getCallDuration(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getSentimentColor(sentiment: string): string {
  if (sentiment === 'positive') return 'bg-green-500';
  if (sentiment === 'negative') return 'bg-red-500';
  return 'bg-gray-400';
}

function getRiskBadge(risk: string) {
  if (risk === 'high') return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
  if (risk === 'medium') return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
  return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
}

export default function LiveCallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [tick, setTick] = useState(0);
  const supabase = createClient();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const admin = profile?.role === 'admin';
      setIsAdmin(admin);

      let query = supabase
        .from('calls')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (!admin || !viewAll) {
        query = query.or(
          `user_id.eq.${user.id},metadata->>owner_user_id.eq.${user.id}`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = data || [];

      if (admin && viewAll && userFilter.trim()) {
        result = result.filter(
          (c: any) =>
            c.caller_name?.toLowerCase().includes(userFilter.toLowerCase()) ||
            c.caller_phone?.includes(userFilter) ||
            (c.metadata?.owner_user_id || '').includes(userFilter)
        );
      }

      setCalls(result);
    } catch (err) {
      console.error('Failed to fetch live calls:', err);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, [viewAll, userFilter]);

  useEffect(() => {
    fetchCalls();

    const channel = supabase
      .channel('live-calls-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calls' },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCalls]);

  const handleEndCall = async (callId: string) => {
    if (!confirm('End this call?')) return;
    try {
      const { error } = await supabase
        .from('calls')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', callId);
      if (error) throw error;
      toast.success('Call ended');
      if (selectedCall?.id === callId) setSelectedCall(null);
    } catch {
      toast.error('Failed to end call');
    }
  };

  const handleTakeover = (call: any) => {
    setSelectedCall(call);
    toast.info('Warm handoff initiated');
  };

  const activeCalls = calls.filter((c) => c.status === 'active');
  const escalations = calls.filter((c) => c.escalation_risk === 'high');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Call Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Real-time view — updates automatically via Supabase Realtime
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="px-3 py-1.5 gap-1.5">
            <Activity className="h-4 w-4 animate-pulse" />
            {activeCalls.length} Active
          </Badge>
          <Button variant="outline" size="icon" onClick={fetchCalls}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isAdmin && (
        <div className="flex flex-wrap items-center gap-3 p-4 border rounded-lg bg-muted/40">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Admin view:</span>
          <Button
            size="sm"
            variant={viewAll ? 'default' : 'outline'}
            onClick={() => setViewAll(true)}
          >
            All Users
          </Button>
          <Button
            size="sm"
            variant={!viewAll ? 'default' : 'outline'}
            onClick={() => setViewAll(false)}
          >
            My Calls
          </Button>
          {viewAll && (
            <div className="relative ml-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 h-8 w-56"
                placeholder="Filter by caller / user ID..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalls.length}</div>
            <p className="text-xs text-muted-foreground">In progress now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Handled</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCalls.length > 0
                ? `${Math.round((activeCalls.filter((c) => c.ai_handled).length / activeCalls.length) * 100)}%`
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground">AI resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalations.length}</div>
            <p className="text-xs text-muted-foreground">High-risk calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCalls.length > 0
                ? (() => {
                    const avg =
                      activeCalls.reduce((sum, c) => {
                        const diff = Math.floor(
                          (Date.now() - new Date(c.started_at).getTime()) / 1000
                        );
                        return sum + diff;
                      }, 0) / activeCalls.length;
                    const m = Math.floor(avg / 60);
                    const s = Math.floor(avg % 60);
                    return `${m}:${s.toString().padStart(2, '0')}`;
                  })()
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground">Across active calls</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Calls</CardTitle>
              <CardDescription>
                {loading
                  ? 'Loading...'
                  : `${activeCalls.length} call${activeCalls.length !== 1 ? 's' : ''} — live updates enabled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading calls...</div>
              ) : activeCalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                  <PhoneOff className="h-10 w-10 text-gray-300" />
                  <p>No active calls at the moment</p>
                  <p className="text-xs">New calls will appear automatically</p>
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
                      <TableRow
                        key={call.id}
                        className={
                          selectedCall?.id === call.id ? 'bg-muted/50' : ''
                        }
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.caller_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{call.caller_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{call.topic || '—'}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {getCallDuration(call.started_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${getSentimentColor(call.sentiment)}`}
                            />
                            <span className="text-sm capitalize">{call.sentiment || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRiskBadge(call.escalation_risk || 'low')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTakeover(call)}
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleEndCall(call.id)}
                            >
                              <PhoneOff className="h-3.5 w-3.5" />
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
              <CardDescription>Live transcript and AI insights</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCall ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Caller</p>
                    <p className="font-medium">{selectedCall.caller_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{selectedCall.caller_phone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Topic</p>
                    <p className="font-medium">{selectedCall.topic || '—'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-mono font-medium">{getCallDuration(selectedCall.started_at)}</p>
                  </div>

                  {selectedCall.ai_confidence && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${selectedCall.ai_confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1">{(selectedCall.ai_confidence * 100).toFixed(0)}%</p>
                    </div>
                  )}

                  {selectedCall.last_transcript && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last AI Response</p>
                      <p className="text-sm p-3 bg-muted rounded-lg">{selectedCall.last_transcript}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t space-y-2">
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => handleEndCall(selectedCall.id)}
                    >
                      <PhoneOff className="mr-2 h-4 w-4" />
                      End Call
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setSelectedCall(null)}
                    >
                      Deselect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                  <Phone className="h-8 w-8 text-gray-300" />
                  <p className="text-sm">Select a call to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
