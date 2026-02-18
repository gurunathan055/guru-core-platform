'use client';

import { useState, useEffect } from 'react';
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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCampaign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          type: formData.get('type') || 'outbound',
          script_content: formData.get('script'),
          status: 'draft',
          contacts_total: 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      toast.success('Campaign created successfully');
      setShowCreateDialog(false);
      fetchCampaigns();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleStatus(campaignId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update campaign');

      toast.success(`Campaign ${newStatus === 'active' ? 'started' : 'paused'}`);
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to update campaign');
    }
  }

  // Calculate aggregate stats
  const totalCalls = campaigns.reduce((sum, c) => sum + c.contacts_completed, 0);
  const totalConnected = campaigns.reduce((sum, c) => sum + c.contacts_connected, 0);
  const connectRate = totalCalls > 0 ? Math.round((totalConnected / totalCalls) * 100) : 0;

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
                <Input id="name" name="name" placeholder="e.g., Q3 Sales Drive" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type</Label>
                <Select name="type" defaultValue="outbound">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="script">Script / Message</Label>
                <Input id="script" name="script" placeholder="Enter your call script" />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
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
            <div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connect Rate</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectRate}%</div>
            <p className="text-xs text-muted-foreground">Calls answered by humans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            {loading ? 'Loading campaigns...' : `${campaigns.length} campaigns found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No campaigns yet. Create your first campaign to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Connect Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const progress = campaign.contacts_total > 0 
                    ? Math.round((campaign.contacts_completed / campaign.contacts_total) * 100) 
                    : 0;
                  const connectRate = campaign.contacts_completed > 0
                    ? Math.round((campaign.contacts_connected / campaign.contacts_completed) * 100)
                    : 0;
                  
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-gray-500">{campaign.type}</p>
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
                            <span>{progress}%</span>
                            <span>{campaign.contacts_completed}/{campaign.contacts_total}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          {connectRate}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className={`h-8 w-8 ${campaign.status === 'active' ? 'text-yellow-600' : 'text-green-600'}`}
                            title={campaign.status === 'active' ? 'Pause' : 'Start'}
                            onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                          >
                            {campaign.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500" title="View Report">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
