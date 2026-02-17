'use client'

import { useState } from 'react'
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
  Plus, 
  Plug, 
  Settings, 
  Play, 
  Trash2, 
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Code,
  Globe,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Cloud,
} from 'lucide-react'

const integrationTemplates = [
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    description: 'Customer support ticketing system',
    icon: MessageSquare,
    color: 'bg-blue-500',
    status: 'active',
    category: 'Support',
  },
  {
    id: 'freshservice',
    name: 'Freshservice',
    description: 'IT service management platform',
    icon: Cloud,
    color: 'bg-green-500',
    status: 'active',
    category: 'ITSM',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM and customer data platform',
    icon: Database,
    color: 'bg-indigo-500',
    status: 'inactive',
    category: 'CRM',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and collaboration',
    icon: MessageSquare,
    color: 'bg-purple-500',
    status: 'inactive',
    category: 'Communication',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery service',
    icon: Mail,
    color: 'bg-blue-600',
    status: 'inactive',
    category: 'Email',
  },
  {
    id: 'custom-api',
    name: 'Custom API',
    description: 'Connect any REST API',
    icon: Code,
    color: 'bg-gray-700',
    status: 'configured',
    category: 'Custom',
  },
]

const activeIntegrations = [
  {
    id: '1',
    name: 'Freshdesk - Production',
    type: 'freshdesk',
    endpoint: 'https://company.freshdesk.com/api/v2',
    lastSync: '2 minutes ago',
    requestCount: 1248,
    status: 'active',
  },
  {
    id: '2',
    name: 'Freshservice - IT Desk',
    type: 'freshservice',
    endpoint: 'https://company.freshservice.com/api/v2',
    lastSync: '5 minutes ago',
    requestCount: 892,
    status: 'active',
  },
  {
    id: '3',
    name: 'Custom ERP API',
    type: 'custom-api',
    endpoint: 'https://erp.company.com/api/v1',
    lastSync: '1 hour ago',
    requestCount: 345,
    status: 'configured',
  },
]

export default function IntegrationsPage() {
  const [showApiBuilder, setShowApiBuilder] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Integration Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with any tool or API without writing code
          </p>
        </div>
        <Dialog open={showApiBuilder} onOpenChange={setShowApiBuilder}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom API Integration</DialogTitle>
              <DialogDescription>
                Build a new integration by configuring the API endpoint and authentication
              </DialogDescription>
            </DialogHeader>
            <ApiBuilderForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeIntegrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Connected and syncing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests (24h)</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,485</div>
            <p className="text-xs text-muted-foreground mt-1">API calls made today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground mt-1">No failed requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142ms</div>
            <p className="text-xs text-muted-foreground mt-1">Fast API responses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrationTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${template.color} bg-opacity-10`}>
                      <template.icon className={`h-6 w-6 ${template.color.replace('bg-', 'text-')}`} />
                    </div>
                    <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                      {template.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{template.category}</span>
                    <Button 
                      size="sm" 
                      variant={template.status === 'active' ? 'outline' : 'default'}
                    >
                      {template.status === 'active' ? (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
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
                      <CardDescription className="mt-1">
                        {integration.endpoint}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Last Sync</p>
                      <p className="text-sm font-medium">{integration.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Requests (24h)</p>
                      <p className="text-sm font-medium">{integration.requestCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Health</p>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-sm font-medium">Healthy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 50 integration requests and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 mins ago', integration: 'Freshdesk', action: 'Ticket Created', status: 'success', responseTime: '124ms' },
                  { time: '5 mins ago', integration: 'Freshservice', action: 'Incident Updated', status: 'success', responseTime: '156ms' },
                  { time: '8 mins ago', integration: 'Freshdesk', action: 'Get Customer Info', status: 'success', responseTime: '98ms' },
                  { time: '12 mins ago', integration: 'Custom ERP', action: 'Query Order Status', status: 'success', responseTime: '234ms' },
                  { time: '15 mins ago', integration: 'Freshdesk', action: 'Update Ticket', status: 'success', responseTime: '143ms' },
                  { time: '18 mins ago', integration: 'Freshservice', action: 'Create Request', status: 'success', responseTime: '167ms' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.integration} • {log.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{log.responseTime}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiBuilderForm() {
  const [testResponse, setTestResponse] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = () => {
    setIsTesting(true)
    setTimeout(() => {
      setTestResponse(JSON.stringify({ status: 'success', message: 'Connection successful', data: { version: '1.0', authenticated: true } }, null, 2))
      setIsTesting(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Integration Name</Label>
          <Input placeholder="My Custom API" />
        </div>

        <div className="space-y-2">
          <Label>Base URL</Label>
          <Input placeholder="https://api.example.com/v1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Method</Label>
            <Select defaultValue="GET">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Authentication</Label>
            <Select defaultValue="bearer">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="apikey">API Key</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>API Key / Token</Label>
          <Input type="password" placeholder="Enter your API key or token" />
        </div>

        <div className="space-y-2">
          <Label>Headers (JSON)</Label>
          <Textarea 
            placeholder={'{\n  "Content-Type": "application/json",\n  "X-Custom-Header": "value"\n}'} 
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Request Body Template (Optional)</Label>
          <Textarea 
            placeholder={'{\n  "query": "{{userInput}}",\n  "context": "{{conversationContext}}"\n}'} 
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handleTestConnection} 
          disabled={isTesting}
          variant="outline" 
          className="w-full gap-2"
        >
          <Play className="h-4 w-4" />
          {isTesting ? 'Testing Connection...' : 'Test Connection'}
        </Button>

        {testResponse && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-xs font-medium mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Test Response
            </p>
            <pre className="text-xs overflow-x-auto">{testResponse}</pre>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button className="flex-1">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Save Integration
        </Button>
        <Button variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Save as Template
        </Button>
      </div>
    </div>
  )
}
