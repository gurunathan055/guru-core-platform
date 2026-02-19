import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { integrationRegistry } from '@/lib/integrations/registry';

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { provider, config } = body;

        const integration = integrationRegistry[provider];

        if (!integration) {
            // Fallback for unknown provider, just ping the URL if it exists in config
            if (config?.url) {
                const res = await fetch(config.url);
                return NextResponse.json({
                    success: res.ok,
                    message: res.ok ? 'URL Reachable' : `Unreachable (${res.status})`
                });
            }
            return NextResponse.json({ success: false, message: 'Unknown provider type' }, { status: 400 });
        }

        const testResult = await integration.testConnection(config);
        return NextResponse.json(testResult);

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
