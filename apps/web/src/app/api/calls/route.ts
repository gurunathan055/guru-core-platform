import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('started_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const mockData = [
      {
        id: '1',
        caller_name: 'Rajesh Kumar',
        caller_phone: '+91 98765 43210',
        topic: 'Product Return',
        status: 'completed',
        started_at: new Date(Date.now() - 7200000).toISOString(),
        ended_at: new Date(Date.now() - 6960000).toISOString(),
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
        started_at: new Date(Date.now() - 14400000).toISOString(),
        ended_at: new Date(Date.now() - 14220000).toISOString(),
        duration: 180,
        sentiment: 'neutral',
        ai_handled: true,
      },
      {
        id: '3',
        caller_name: 'Amit Patel',
        caller_phone: '+91 76543 21098',
        topic: 'Order Status',
        status: 'completed',
        started_at: new Date(Date.now() - 21600000).toISOString(),
        ended_at: new Date(Date.now() - 21420000).toISOString(),
        duration: 180,
        sentiment: 'positive',
        ai_handled: true,
      },
      {
        id: '4',
        caller_name: 'Sneha Reddy',
        caller_phone: '+91 65432 10987',
        topic: 'Refund Request',
        status: 'escalated',
        started_at: new Date(Date.now() - 28800000).toISOString(),
        ended_at: new Date(Date.now() - 28500000).toISOString(),
        duration: 300,
        sentiment: 'negative',
        ai_handled: false,
      },
    ];

    return NextResponse.json(calls?.length > 0 ? calls : mockData);
  } catch (error: any) {
    console.error('Calls fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('calls')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Call creation error:', error);
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 });
  }
}
