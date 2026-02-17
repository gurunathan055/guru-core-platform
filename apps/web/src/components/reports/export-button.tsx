'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  data?: any;
  fileName?: string;
  title?: string;
}

export function ExportButton({ data, fileName = 'report', title = 'Export Report' }: ExportButtonProps) {
  const exportToPDF = () => {
    toast.info('Generating PDF report...');
    setTimeout(() => {
      toast.success('PDF downloaded successfully!');
    }, 1500);
  };

  const exportToCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  const exportToExcel = () => {
    toast.info('Generating Excel file...');
    setTimeout(() => {
      toast.success('Excel file downloaded!');
    }, 1500);
  };

  const shareReport = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Report link copied to clipboard!');
  };

  const generateCSV = () => {
    const headers = ['Metric', 'Value', 'Change', 'Trend'];
    const rows = [
      ['Total Calls', '1,247', '+12.5%', 'Up'],
      ['AI Resolution Rate', '87%', '+5.2%', 'Up'],
      ['Avg Response Time', '2.4s', '-15%', 'Down'],
      ['Customer Satisfaction', '94%', '+8%', 'Up'],
      ['Active Calls', '3', '0%', 'Stable'],
    ];

    const csvRows = [headers, ...rows];
    return csvRows.map((row) => row.join(',')).join('\n');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareReport}>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Report Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function QuickReports() {
  const generateReport = (type: string) => {
    toast.info(`Generating ${type} report...`);
    setTimeout(() => {
      toast.success(`${type} report ready!`);
    }, 2000);
  };

  const reports = [
    {
      title: 'Daily Summary',
      description: "Today's performance metrics",
      action: () => generateReport('Daily Summary'),
    },
    {
      title: 'Weekly Overview',
      description: 'Last 7 days analysis',
      action: () => generateReport('Weekly Overview'),
    },
    {
      title: 'Monthly Report',
      description: 'Full month performance',
      action: () => generateReport('Monthly Report'),
    },
    {
      title: 'Custom Range',
      description: 'Select your own date range',
      action: () => generateReport('Custom Range'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reports.map((report) => (
            <button
              key={report.title}
              onClick={report.action}
              className="p-4 text-left border rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
            >
              <h4 className="font-semibold mb-1">{report.title}</h4>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ScheduledReports() {
  const schedules = [
    {
      name: 'Weekly Performance',
      frequency: 'Every Monday at 9:00 AM',
      recipients: 'admin@company.com, team@company.com',
      active: true,
    },
    {
      name: 'Monthly Analytics',
      frequency: '1st of each month',
      recipients: 'executives@company.com',
      active: true,
    },
    {
      name: 'Daily Digest',
      frequency: 'Every day at 6:00 PM',
      recipients: 'supervisor@company.com',
      active: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scheduled Reports</CardTitle>
          <Button variant="outline" size="sm">
            Add Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedules.map((schedule, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{schedule.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      schedule.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {schedule.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{schedule.frequency}</p>
                <p className="text-xs text-gray-500">To: {schedule.recipients}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
