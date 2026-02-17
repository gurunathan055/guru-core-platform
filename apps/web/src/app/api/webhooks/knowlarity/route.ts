import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Knowlarity/Telephony Webhook Handler
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Parse the form data or JSON from the provider
    // Telephony providers often send data as form-data or JSON
    const contentType = request.headers.get('content-type') || '';
    let payload: any = {};

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = value;
      });
    }

    console.log('Incoming Call Webhook:', payload);

    // Map provider-specific fields to our schema
    // Example fields based on common telephony APIs (Knowlarity, Twilio, Exotel)
    const callData = {
      caller_phone: payload.caller_id || payload.from || payload.caller_number || 'Unknown',
      caller_name: payload.caller_name || 'Unknown Caller',
      started_at: new Date().toISOString(),
      status: mapStatus(payload.event || payload.status || 'incoming'),
      topic: 'Incoming Inquiry', // Default topic
      sentiment: 'neutral',
      ai_handled: true, // Defaulting to AI handled for now
      metadata: payload, // Store full payload for debugging
    };

    // Check if call already exists to update it, or create new
    // Using call_uuid or similar unique ID from provider
    const providerId = payload.uuid || payload.call_id || payload.call_uuid;

    if (providerId) {
      // Try to find existing call
      const { data: existingCall } = await supabase
        .from('calls')
        .select('id')
        .eq('metadata->>uuid', providerId)
        .single();

      if (existingCall) {
        // Update existing call
        const { error: updateError } = await supabase
          .from('calls')
          .update({
            status: callData.status,
            updated_at: new Date().toISOString(),
            // Only update end time if status is completed
            ...(callData.status === 'completed' ? { ended_at: new Date().toISOString() } : {}),
            // Update duration if provided
            ...(payload.duration ? { duration: parseInt(payload.duration) } : {})
          })
          .eq('id', existingCall.id);

        if (updateError) throw updateError;
        return NextResponse.json({ success: true, action: 'updated', id: existingCall.id });
      }
    }

    // Insert new call
    const { data: newCall, error: insertError } = await supabase
      .from('calls')
      .insert([{
        ...callData,
        metadata: { ...callData.metadata, uuid: providerId }
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, action: 'created', id: newCall.id });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

function mapStatus(providerStatus: string): string {
  const status = providerStatus.toLowerCase();
  if (status.includes('answer') || status.includes('connect')) return 'active';
  if (status.includes('end') || status.includes('hangup') || status.includes('disconnect')) return 'completed';
  if (status.includes('ring') || status.includes('offer')) return 'ringing';
  return 'active'; // Default
}
