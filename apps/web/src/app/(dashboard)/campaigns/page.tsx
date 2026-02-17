'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Users, Calendar, Play, Pause, BarChart, Plus, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data
const campaigns = [
  {
    id: '1',
    name: 'Diwali Promo Blast',
    status: 'active',
    type: 'outbound',
    contacts: 1250,
    completed: 450,
    connected: 380,
    script: 'Seasonal Offer v2',
    schedule: 'Mon-Fri, 10am-6pm',
  },
  {
    id: '2',
    name: 'Lead Qualification Q1',
    status: 'paused',
    type: 'outbound',
    contacts: 5000,
    completed: 2100,
    connected: 150,
    script: 'B2B Lead Gen',
    schedule: 'Mon-Fri, 9am-5pm',
  },
  {
    id: '3',
    name: 'Customer Feedback Survey',
    status: 'completed',
    type: 'survey',
    contacts: 300,
    completed: 300,
    connected: 210,
    script: 'NPS Survey',
    schedule: 'Sat-Sun, 11am-4pm',
  },
];

export default function CampaignsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setShowCreateDialog(false);
      toast.success('Campaign created successfully');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage outbound voice campaigns and broadcasts</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new outbound voice campaign. Upload contacts and select a script.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" placeholder="e.g., Q3 Sales Drive" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="script">Select Script / SOP</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a script" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Pitch v1</SelectItem>
                    <SelectItem value="survey">Customer Survey</SelectItem>
                    <SelectItem value="appointment">Appointment Reminder</SelectItem>
                    <SelectItem value="support">Support Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Contacts (CSV)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload CSV</p>
                  <p className="text-xs text-gray-400">Format: Name, Phone, Company</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Send immediately" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send immediately</SelectItem>
                    <SelectItem value="later">Schedule for later</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Creating...' : 'Create Campaign'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connect Rate</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Calls answered by humans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Call</CardTitle>
            <BarChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.20</div>
            <p className="text-xs text-muted-foreground">Includes telephony & AI costs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Monitor and manage your running campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Connect Rate</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.script}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        campaign.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-[120px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{Math.round((campaign.completed / campaign.contacts) * 100)}%</span>
                        <span>{campaign.completed}/{campaign.contacts}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500" 
                          style={{ width: `${(campaign.completed / campaign.contacts) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {Math.round((campaign.connected / campaign.completed) * 100)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {campaign.schedule}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {campaign.status === 'active' ? (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-600" title="Pause">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" title="Resume/Start">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500" title="View Report">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
