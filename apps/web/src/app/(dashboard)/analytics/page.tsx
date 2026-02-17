'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, TrendingDown, Users, Phone, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

const callVolumeData = [
  { date: 'Jan 1', calls: 145, resolved: 128, escalated: 17 },
  { date: 'Jan 2', calls: 178, resolved: 162, escalated: 16 },
  { date: 'Jan 3', calls: 162, resolved: 148, escalated: 14 },
  { date: 'Jan 4', calls: 195, resolved: 175, escalated: 20 },
  { date: 'Jan 5', calls: 213, resolved: 195, escalated: 18 },
  { date: 'Jan 6', calls: 189, resolved: 172, escalated: 17 },
  { date: 'Jan 7', calls: 248, resolved: 230, escalated: 18 },
]

const resolutionTimeData = [
  { category: 'Account Issues', avgTime: 2.3, aiTime: 1.8, humanTime: 4.2 },
  { category: 'Product Info', avgTime: 1.5, aiTime: 1.2, humanTime: 2.8 },
  { category: 'Order Status', avgTime: 1.8, aiTime: 1.5, humanTime: 3.1 },
  { category: 'Technical Support', avgTime: 4.2, aiTime: 3.5, humanTime: 6.8 },
  { category: 'Billing', avgTime: 3.1, aiTime: 2.5, humanTime: 5.2 },
]

const sentimentData = [
  { name: 'Positive', value: 68, color: '#10b981' },
  { name: 'Neutral', value: 22, color: '#f59e0b' },
  { name: 'Negative', value: 10, color: '#ef4444' },
]

const aiVsHumanData = [
  { month: 'Jul', aiResolved: 145, humanResolved: 89, total: 234 },
  { month: 'Aug', aiResolved: 178, humanResolved: 76, total: 254 },
  { month: 'Sep', aiResolved: 212, humanResolved: 68, total: 280 },
  { month: 'Oct', aiResolved: 245, humanResolved: 62, total: 307 },
  { month: 'Nov', aiResolved: 289, humanResolved: 55, total: 344 },
  { month: 'Dec', aiResolved: 312, humanResolved: 48, total: 360 },
  { month: 'Jan', aiResolved: 348, humanResolved: 42, total: 390 },
]

const peakHoursData = [
  { hour: '00:00', calls: 12 },
  { hour: '02:00', calls: 8 },
  { hour: '04:00', calls: 5 },
  { hour: '06:00', calls: 18 },
  { hour: '08:00', calls: 45 },
  { hour: '10:00', calls: 78 },
  { hour: '12:00', calls: 92 },
  { hour: '14:00', calls: 85 },
  { hour: '16:00', calls: 95 },
  { hour: '18:00', calls: 72 },
  { hour: '20:00', calls: 48 },
  { hour: '22:00', calls: 28 },
]

export default function AnalyticsPage() {
  const aiResolutionRate = 76.8
  const avgResolutionTime = 2.4
  const satisfactionScore = 4.6

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive insights into system performance and call metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiResolutionRate}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.2% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime} min</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingDown className="mr-1 h-3 w-3" />
              -18% faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{satisfactionScore}/5.0</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.3 points
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls (7d)</CardTitle>
            <Phone className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,330</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% volume
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume Trends</CardTitle>
                <CardDescription>Total calls vs resolved vs escalated (Last 7 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="calls" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Total Calls" />
                    <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Resolved" />
                    <Area type="monotone" dataKey="escalated" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Escalated" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI vs Human Resolution</CardTitle>
                <CardDescription>Resolution comparison over time (Last 7 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={aiVsHumanData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="aiResolved" stroke="#6366f1" strokeWidth={2} name="AI Resolved" />
                    <Line type="monotone" dataKey="humanResolved" stroke="#f59e0b" strokeWidth={2} name="Human Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Sentiment Distribution</CardTitle>
                <CardDescription>Overall sentiment analysis from customer interactions</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Call Hours</CardTitle>
                <CardDescription>Call volume distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolution Time by Category</CardTitle>
              <CardDescription>Average resolution time comparison (AI vs Human, in minutes)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={resolutionTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={140} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="aiTime" fill="#6366f1" name="AI Resolution Time" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="humanTime" fill="#f59e0b" name="Human Resolution Time" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">First Call Resolution</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84.2%</div>
                <p className="text-xs text-muted-foreground mt-1">Issues resolved on first contact</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5%</div>
                <p className="text-xs text-muted-foreground mt-1">Calls escalated to human agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Calls</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2%</div>
                <p className="text-xs text-muted-foreground mt-1">System errors or dropped calls</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Over Time</CardTitle>
                <CardDescription>Customer sentiment trends (Last 7 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={callVolumeData.map((d, i) => ({
                    ...d,
                    positive: 65 + Math.random() * 8,
                    neutral: 20 + Math.random() * 5,
                    negative: 8 + Math.random() * 4,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} name="Positive" />
                    <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} name="Neutral" />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Negative" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Positive Keywords</CardTitle>
                <CardDescription>Most mentioned positive terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { keyword: 'helpful', count: 342, sentiment: 'positive' },
                    { keyword: 'quick', count: 298, sentiment: 'positive' },
                    { keyword: 'solved', count: 267, sentiment: 'positive' },
                    { keyword: 'excellent', count: 245, sentiment: 'positive' },
                    { keyword: 'efficient', count: 223, sentiment: 'positive' },
                  ].map((item) => (
                    <div key={item.keyword} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium capitalize">{item.keyword}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count} mentions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
              <CardDescription>Key metrics growth comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={aiVsHumanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Total Calls" />
                  <Area type="monotone" dataKey="aiResolved" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="AI Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Projection</CardTitle>
                <CardDescription>Estimated savings from AI automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹12.4L</div>
                <p className="text-sm text-muted-foreground mt-1">Saved this month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Agent time saved</span>
                    <span className="font-medium">348 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Calls automated</span>
                    <span className="font-medium">1,022</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg cost per call</span>
                    <span className="font-medium">₹121</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>AI model improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">+18.5%</div>
                <p className="text-sm text-muted-foreground mt-1">Accuracy improvement (6 months)</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New SOPs learned</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Knowledge gaps filled</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Model accuracy</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
