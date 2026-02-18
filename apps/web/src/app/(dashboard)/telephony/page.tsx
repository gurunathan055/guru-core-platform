'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Phone,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function TelephonyPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [virtualNumber, setVirtualNumber] = useState('');
  const [enabled, setEnabled] = useState(false);

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  const incomingUrl = `${baseUrl}/api/voice/incoming-call`;
  const processUrl = `${baseUrl}/api/voice/process-audio`;

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/telephony/knowlarity');
      const data = await res.json();
      if (data.exists) {
        setConfig(data);
        setVirtualNumber(data.virtual_number || '');
        setEnabled(data.status === 'active');
      }
    } catch {
      toast.error('Failed to load Knowlarity config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/telephony/knowlarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ virtual_number: virtualNumber, enabled }),
      });
      if (!res.ok) throw new Error();
      toast.success('Settings saved');
      fetchConfig();
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKey = async () => {
    if (
      !confirm(
        'Rotating the API key will break your Knowlarity SR configuration until you update it. Continue?'
      )
    )
      return;

    setRotating(true);
    setRevealedKey(null);
    try {
      const res = await fetch('/api/admin/telephony/knowlarity/rotate-key', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setRevealedKey(data.api_key);
      setShowKey(true);
      toast.success('New API key generated — copy it now, it will be masked again after refresh');
      fetchConfig();
    } catch {
      toast.error('Failed to rotate API key');
    } finally {
      setRotating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Knowlarity SR Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Configure your Knowlarity SuperReceptionist voice bot integration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Webhook URLs
          </CardTitle>
          <CardDescription>
            Paste these URLs into your Knowlarity SR "What-to-do" configuration. They auto-adapt to any domain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Incoming Call URL (What-to-do URL)</Label>
            <div className="flex gap-2">
              <Input value={incomingUrl} readOnly className="font-mono text-sm bg-muted" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(incomingUrl, 'Incoming Call URL')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Set this as the "What-to-do URL" in Knowlarity SR. Accepts GET and POST.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Process Audio URL (Action URL)</Label>
            <div className="flex gap-2">
              <Input value={processUrl} readOnly className="font-mono text-sm bg-muted" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(processUrl, 'Process Audio URL')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is the action URL used inside the XML record tag for the AI loop.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            This key authenticates Knowlarity SR requests. Add it as{' '}
            <code className="bg-muted px-1 rounded text-xs">x-api-key</code> header or{' '}
            <code className="bg-muted px-1 rounded text-xs">?api_key=</code> query param.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current API Key</Label>
            <div className="flex gap-2">
              <Input
                value={
                  revealedKey
                    ? showKey
                      ? revealedKey
                      : `${revealedKey.slice(0, 4)}${'*'.repeat(Math.max(0, revealedKey.length - 8))}${revealedKey.slice(-4)}`
                    : config?.api_key_preview || 'No key generated yet'
                }
                readOnly
                className="font-mono text-sm bg-muted"
              />
              {revealedKey && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey((v) => !v)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
              {revealedKey && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(revealedKey, 'API Key')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            {revealedKey && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Copy this key now and update your Knowlarity SR configuration. It will be masked again after you leave this page.</span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleRotateKey}
            disabled={rotating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${rotating ? 'animate-spin' : ''}`} />
            {rotating ? 'Generating...' : config?.has_api_key ? 'Rotate API Key' : 'Generate API Key'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Configure your Knowlarity SR integration settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Virtual Number</Label>
            <Input
              value={virtualNumber}
              onChange={(e) => setVirtualNumber(e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Your Knowlarity SR virtual number (for reference and logging).
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Integration Status</p>
              <p className="text-sm text-muted-foreground">
                Enable to allow Knowlarity SR to authenticate with this account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={enabled ? 'default' : 'secondary'}
                className="gap-1"
              >
                {enabled ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {enabled ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnabled((v) => !v)}
              >
                {enabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
