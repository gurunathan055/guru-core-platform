import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(100);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const mockData = {
      totalCalls: 1247,
      activeCalls: 3,
      avgResponseTime: 2.4,
      successRate: 96.8,
      recentCalls: [
        {
          id: '1',
          caller_name: 'Rajesh Kumar',
          caller_phone: '+91 98765 43210',
          topic: 'Product Return',
          status: 'completed',
          started_at: new Date(Date.now() - 300000).toISOString(),
          ended_at: new Date(Date.now() - 60000).toISOString(),
          duration: 240,
          sentiment: 'positive',
          ai_handled: true,
        },
        {
          id: '2',
          caller_name: 'Priya Sharma',
          caller_phone: '+91 87654 32109',
          topic: 'Billing Issue',
          status: 'completed',
          started_at: new Date(Date.now() - 600000).toISOString(),
          ended_at: new Date(Date.now() - 300000).toISOString(),
          duration: 180,
          sentiment: 'neutral',
          ai_handled: true,
        },
        {
          id: '3',
          caller_name: 'Amit Patel',
          caller_phone: '+91 76543 21098',
          topic: 'Order Status',
          status: 'active',
          started_at: new Date(Date.now() - 120000).toISOString(),
          duration: 120,
          sentiment: 'positive',
          ai_handled: true,
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
