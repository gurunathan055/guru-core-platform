import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('integrations')
    .select('id, config, status, updated_at')
    .eq('provider', 'knowlarity_sr')
    .eq('created_by', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ exists: false, config: null });
  }

  const config = data.config as Record<string, any>;

  return NextResponse.json({
    exists: true,
    id: data.id,
    status: data.status,
    virtual_number: config?.virtual_number || '',
    has_api_key: !!config?.sr_api_key,
    api_key_preview: config?.sr_api_key
      ? `${config.sr_api_key.slice(0, 4)}${'*'.repeat(Math.max(0, config.sr_api_key.length - 8))}${config.sr_api_key.slice(-4)}`
      : null,
    updated_at: data.updated_at,
  });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { virtual_number, enabled } = body;

  const { data: existing } = await supabase
    .from('integrations')
    .select('id, config')
    .eq('provider', 'knowlarity_sr')
    .eq('created_by', user.id)
    .single();

  const currentConfig = (existing?.config as Record<string, any>) || {};

  const updatedConfig = {
    ...currentConfig,
    virtual_number: virtual_number ?? currentConfig.virtual_number ?? '',
  };

  const status = enabled === true ? 'active' : enabled === false ? 'inactive' : undefined;

  if (existing) {
    const { error } = await supabase
      .from('integrations')
      .update({
        config: updatedConfig,
        ...(status ? { status } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from('integrations').insert([
      {
        name: 'Knowlarity SR',
        type: 'telephony',
        provider: 'knowlarity_sr',
        status: status || 'inactive',
        config: updatedConfig,
        created_by: user.id,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: 'Failed to create config' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
