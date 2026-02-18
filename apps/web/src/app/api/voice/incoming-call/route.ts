import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    'localhost:3000';
  return `${proto}://${host}`;
}

async function validateApiKey(
  request: NextRequest
): Promise<{ valid: boolean; userId?: string; apiKey?: string }> {
  const key =
    request.headers.get('x-api-key') ||
    new URL(request.url).searchParams.get('api_key');

  if (!key) return { valid: false };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('integrations')
    .select('id, created_by, config, status')
    .eq('provider', 'knowlarity_sr')
    .eq('status', 'active');

  if (error || !data || data.length === 0) return { valid: false };

  const match = data.find((row: any) => {
    const cfg = row.config as Record<string, any>;
    return cfg?.sr_api_key === key;
  });

  if (!match) return { valid: false };

  return { valid: true, userId: match.created_by, apiKey: key };
}

function xmlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

async function handleIncomingCall(request: NextRequest): Promise<NextResponse> {
  const { valid, userId, apiKey } = await validateApiKey(request);
  if (!valid) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const baseUrl = getBaseUrl(request);
  const processUrl = `${baseUrl}/api/voice/process-audio?api_key=${apiKey}`;

  let payload: Record<string, any> = {};
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = value;
      });
    } else {
      const text = await request.text();
      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore parse errors */
  }

  const callerPhone =
    payload.caller_id || payload.from || payload.caller_number || 'Unknown';
  const callerName = payload.caller_name || null;
  const providerCallId =
    payload.uuid || payload.call_id || payload.call_uuid || null;

  const supabase = createClient();
  await supabase.from('calls').insert([
    {
      caller_phone: callerPhone,
      caller_name: callerName,
      status: 'active',
      started_at: new Date().toISOString(),
      ai_handled: true,
      metadata: {
        ...payload,
        provider_call_id: providerCallId,
        owner_user_id: userId,
      },
    },
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <playtext data="Hello, thank you for calling Guru-core. I am your AI assistant. How can I help you today?" />
  <record action="${processUrl}" maxlength="30" terminator="#" playbeep="true" />
</response>`;

  return xmlResponse(xml);
}

export async function GET(request: NextRequest) {
  return handleIncomingCall(request);
}

export async function POST(request: NextRequest) {
  return handleIncomingCall(request);
}
