'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ExportButton,
  QuickReports,
  ScheduledReports,
} from '@/components/reports/export-button';
import {
  FileText,
  TrendingUp,
  Calendar,
  Filter,
  BarChart3,
  Users,
  Phone,
  Clock,
} from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const reportTemplates = [
    {
      id: 'performance',
      name: 'Performance Overview',
      description: 'Complete performance metrics and KPIs',
      icon: TrendingUp,
      color: 'text-blue-600',
      metrics: ['Call Volume', 'Resolution Rate', 'Response Time', 'Satisfaction'],
    },
    {
      id: 'call-analysis',
      name: 'Call Analysis',
      description: 'Detailed call breakdown and analytics',
      icon: Phone,
      color: 'text-green-600',
      metrics: ['Active Calls', 'Completed', 'Escalated', 'Duration'],
    },
    {
      id: 'team-performance',
      name: 'Team Performance',
      description: 'Agent and supervisor performance metrics',
      icon: Users,
      color: 'text-purple-600',
      metrics: ['Team Size', 'Calls Handled', 'Avg Rating', 'Training Hours'],
    },
    {
      id: 'time-analysis',
      name: 'Time Analysis',
      description: 'Peak hours and response time analysis',
      icon: Clock,
      color: 'text-orange-600',
      metrics: ['Peak Hours', 'Avg Wait Time', 'Handle Time', 'Idle Time'],
    },
  ];

  const recentReports = [
    {
      name: 'January 2024 Performance Report',
      date: '2024-01-31',
      type: 'Monthly',
      size: '2.4 MB',
      status: 'Ready',
    },
    {
      name: 'Weekly Call Analysis - Week 4',
      date: '2024-01-28',
      type: 'Weekly',
      size: '1.1 MB',
      status: 'Ready',
    },
    {
      name: 'Q4 2023 Executive Summary',
      date: '2024-01-05',
      type: 'Quarterly',
      size: '5.8 MB',
      status: 'Ready',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Exports</h1>
          <p className="text-gray-600 mt-1">Generate, schedule, and export your analytics</p>
        </div>
        <ExportButton title="Export Current View" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Exported</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145 GB</div>
            <p className="text-xs text-muted-foreground">Total volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Report Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="quick">Quick Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>Select template and date range to generate a report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Select Report Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {reportTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 border rounded-lg hover:border-primary hover:bg-primary-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gray-100 ${template.color}`}>
                            <template.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.metrics.map((metric) => (
                                <span
                                  key={metric}
                                  className="px-2 py-0.5 text-xs bg-gray-100 rounded-full"
                                >
                                  {metric}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-date">From Date</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="to-date">To Date</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="filters">Additional Filters (Optional)</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Team
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Call Type
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Status
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Preview Report</Button>
                  <Button>Generate & Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick">
          <QuickReports />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{report.name}</h4>
                        <p className="text-sm text-gray-600">
                          {report.type} • {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        {report.status}
                      </span>
                      <ExportButton fileName={report.name} title="Download" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
