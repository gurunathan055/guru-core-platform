'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Plus, Phone, Plug, Settings, Play, Trash2, Copy, CheckCircle2,
  XCircle, Clock, Zap, Code, Globe, Database, Mail, MessageSquare,
  FileText, Cloud, RefreshCw, AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

const integrationTemplates = [
  { id: 'freshdesk', name: 'Freshdesk', description: 'Customer support ticketing system', icon: MessageSquare, color: 'bg-blue-500', category: 'Support' },
  { id: 'freshservice', name: 'Freshservice', description: 'IT service management platform', icon: Cloud, color: 'bg-green-500', category: 'ITSM' },
  { id: 'custom_api', name: 'Custom API', description: 'Connect any REST API', icon: Code, color: 'bg-gray-700', category: 'Custom' },
]

export default function IntegrationsPage() {
  const [showApiBuilder, setShowApiBuilder] = useState(false)
  const [activeIntegrations, setActiveIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations')
      if (res.ok) {
        const data = await res.json()
        setActiveIntegrations(data)
      }
    } catch (error) {
      console.error('Failed to load integrations', error)
      toast.error('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Integration Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect with external tools securely</p>
        </div>
        <Dialog open={showApiBuilder} onOpenChange={setShowApiBuilder}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure Integration</DialogTitle>
              <DialogDescription>Setup secure connection to external providers</DialogDescription>
            </DialogHeader>
            <ApiBuilderForm onSuccess={() => {
              setShowApiBuilder(false)
              fetchIntegrations()
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 animate-pulse">Loading secure vault...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeIntegrations.filter(i => i.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Connected services</p>
            </CardContent>
          </Card>
          {/* Other stats mock for now */}
        </div>
      )}

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="active">Active ({activeIntegrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrationTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setShowApiBuilder(true)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${template.color} bg-opacity-10`}>
                      <template.icon className={`h-6 w-6 ${template.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{template.category}</span>
                    <Button size="sm" variant="secondary">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeIntegrations.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No active integrations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                            {integration.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">Type: {integration.type}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiBuilderForm({ onSuccess }: { onSuccess: () => void }) {
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    provider: 'freshdesk',
    config: {
      domain: '',
      apiKey: '',
      url: ''
    }
  })

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setTestResult(data)
      if (data.success) toast.success("Connection Successful!")
      else toast.error("Connection Failed: " + data.message)
    } catch (e: any) {
      toast.error("Test Error: " + e.message)
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: 'support', // simplified for now
          provider: formData.provider,
          config: formData.config,
          status: testResult?.success ? 'active' : 'inactive'
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success("Integration Saved!")
      onSuccess()
    } catch (e) {
      toast.error("Save Failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Integration Name</Label>
          <Input placeholder="My Freshdesk" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={formData.provider} onValueChange={v => setFormData({ ...formData, provider: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="freshdesk">Freshdesk</SelectItem>
              <SelectItem value="freshservice">Freshservice</SelectItem>
              <SelectItem value="custom_api">Custom API</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.provider === 'freshdesk' && (
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label>Freshdesk Domain</Label>
            <Input placeholder="company.freshdesk.com" value={formData.config.domain} onChange={e => setFormData({ ...formData, config: { ...formData.config, domain: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="Key" value={formData.config.apiKey} onChange={e => setFormData({ ...formData, config: { ...formData.config, apiKey: e.target.value } })} />
          </div>
        </div>
      )}

      {formData.provider === 'custom_api' && (
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label>API URL</Label>
            <Input placeholder="https://api.example.com" value={formData.config.url} onChange={e => setFormData({ ...formData, config: { ...formData.config, url: e.target.value } })} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={handleTest} disabled={isTesting}>
          {isTesting ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          Test Connection
        </Button>

        {testResult && (
          <div className={`p-3 rounded text-sm flex items-center gap-2 ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {testResult.message}
          </div>
        )}
      </div>

      <Button className="w-full" onClick={handleSave} disabled={isSaving || !formData.name}>
        Save Integration
      </Button>
    </div>
  )
}
