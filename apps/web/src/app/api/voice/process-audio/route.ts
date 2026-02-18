import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

async function processAiResponse(
  recordingUrl: string | null
): Promise<{ replyText: string; shouldHangup: boolean }> {
  return {
    replyText:
      'Thank you for your message. Our AI is processing your request. Please hold on.',
    shouldHangup: false,
  };
}

export async function POST(request: NextRequest) {
  const { valid, userId, apiKey } = await validateApiKey(request);
  if (!valid) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

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
    /* ignore */
  }

  const recordingUrl =
    payload.recording_url ||
    payload.recordingUrl ||
    payload.recording ||
    null;

  const providerCallId =
    payload.uuid || payload.call_id || payload.call_uuid || null;

  const { replyText, shouldHangup } = await processAiResponse(recordingUrl);

  const supabase = createClient();

  if (providerCallId) {
    const { data: existingCalls } = await supabase
      .from('calls')
      .select('id')
      .contains('metadata', { provider_call_id: providerCallId })
      .limit(1);

    if (existingCalls && existingCalls.length > 0) {
      await supabase
        .from('calls')
        .update({
          last_recording_url: recordingUrl,
          last_transcript: replyText,
          ...(shouldHangup
            ? {
                status: 'completed',
                ended_at: new Date().toISOString(),
              }
            : {}),
          metadata: {
            ...payload,
            provider_call_id: providerCallId,
            owner_user_id: userId,
          },
        })
        .eq('id', existingCalls[0].id);
    }
  } else {
    const { data: latestCall } = await supabase
      .from('calls')
      .select('id')
      .eq('status', 'active')
      .contains('metadata', { owner_user_id: userId })
      .order('started_at', { ascending: false })
      .limit(1);

    if (latestCall && latestCall.length > 0) {
      await supabase
        .from('calls')
        .update({
          last_recording_url: recordingUrl,
          last_transcript: replyText,
          ...(shouldHangup
            ? {
                status: 'completed',
                ended_at: new Date().toISOString(),
              }
            : {}),
        })
        .eq('id', latestCall[0].id);
    }
  }

  if (shouldHangup) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <playtext data="Thank you for calling Guru-core. Goodbye." />
  <hangup />
</response>`;
    return xmlResponse(xml);
  }

  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    'localhost:3000';
  const baseUrl = `${proto}://${host}`;
  const processUrl = `${baseUrl}/api/voice/process-audio?api_key=${apiKey}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <playtext data="${replyText.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}" />
  <record action="${processUrl}" maxlength="30" terminator="#" playbeep="true" />
</response>`;

  return xmlResponse(xml);
}
