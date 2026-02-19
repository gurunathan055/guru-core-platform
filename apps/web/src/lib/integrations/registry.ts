export interface IntegrationProvider {
    id: string;
    name: string;
    testConnection: (config: any) => Promise<{ success: boolean; message: string; data?: any }>;
}

export const integrationRegistry: Record<string, IntegrationProvider> = {
    freshdesk: {
        id: 'freshdesk',
        name: 'Freshdesk',
        testConnection: async (config: any) => {
            // Real connectivity check for Freshdesk
            try {
                const { domain, apiKey } = config;
                if (!domain || !apiKey) throw new Error('Missing domain or API Key');

                const mk_domain = domain.includes('.') ? domain : `${domain}.freshdesk.com`;

                // Basic auth with API key
                const auth = Buffer.from(`${apiKey}:X`).toString('base64');

                const response = await fetch(`https://${mk_domain}/api/v2/tickets?per_page=1`, {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.description || err.message || `HTTP ${response.status}`);
                }

                return { success: true, message: 'Successfully connected to Freshdesk', data: { status: response.status } };
            } catch (error: any) {
                return { success: false, message: error.message };
            }
        }
    },
    freshservice: {
        id: 'freshservice',
        name: 'Freshservice',
        testConnection: async (config: any) => {
            try {
                const { domain, apiKey } = config;
                if (!domain || !apiKey) throw new Error('Missing domain or API Key');

                const mk_domain = domain.includes('.') ? domain : `${domain}.freshservice.com`;
                const auth = Buffer.from(`${apiKey}:X`).toString('base64');

                const response = await fetch(`https://${mk_domain}/api/v2/tickets?per_page=1`, {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return { success: true, message: 'Successfully connected to Freshservice' };
            } catch (error: any) {
                return { success: false, message: error.message };
            }
        }
    },
    custom_api: {
        id: 'custom_api',
        name: 'Custom REST API',
        testConnection: async (config: any) => {
            try {
                const { url, method = 'GET', headers = {}, body } = config;
                if (!url) throw new Error('Missing URL');

                const response = await fetch(url, {
                    method,
                    headers,
                    body: method !== 'GET' ? JSON.stringify(body) : undefined,
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return { success: true, message: `Connected to API (${response.status})` };
            } catch (error: any) {
                return { success: false, message: error.message };
            }
        }
    }
};
