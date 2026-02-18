import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newKey = `sr_${randomBytes(24).toString('hex')}`;

  const { data: existing } = await supabase
    .from('integrations')
    .select('id, config')
    .eq('provider', 'knowlarity_sr')
    .eq('created_by', user.id)
    .single();

  const currentConfig = (existing?.config as Record<string, any>) || {};
  const updatedConfig = { ...currentConfig, sr_api_key: newKey };

  if (existing) {
    const { error } = await supabase
      .from('integrations')
      .update({
        config: updatedConfig,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to rotate key' }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from('integrations').insert([
      {
        name: 'Knowlarity SR',
        type: 'telephony',
        provider: 'knowlarity_sr',
        status: 'inactive',
        config: updatedConfig,
        created_by: user.id,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: 'Failed to create integration with new key' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    api_key: newKey,
    api_key_preview: `${newKey.slice(0, 4)}${'*'.repeat(Math.max(0, newKey.length - 8))}${newKey.slice(-4)}`,
  });
}
