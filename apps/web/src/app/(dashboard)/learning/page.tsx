'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveTable } from '@/components/organisms/responsive-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

// Mock knowledge gaps data
const knowledgeGaps = [
  {
    id: '1',
    query: 'What is the return policy for bulk orders?',
    frequency: 12,
    status: 'suggestion_generated',
    detectedAt: '2024-02-15',
    suggestedAction: 'Create SOP: Bulk Order Returns',
  },
  {
    id: '2',
    query: 'How to handle damaged products in transit?',
    frequency: 8,
    status: 'detected',
    detectedAt: '2024-02-16',
    suggestedAction: 'Pending AI analysis',
  },
  {
    id: '3',
    query: 'International shipping procedures',
    frequency: 5,
    status: 'approved',
    detectedAt: '2024-02-14',
    suggestedAction: 'SOP Created: INTL-SHIP-001',
  },
];

const statusIcons = {
  detected: <Clock className="w-4 h-4 text-yellow-600" />,
  suggestion_generated: <AlertCircle className="w-4 h-4 text-blue-600" />,
  approved: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  rejected: <XCircle className="w-4 h-4 text-red-600" />,
};

export default function AutonomousLearningPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold">Autonomous Learning</h1>
        <p className="text-gray-500 mt-1">
          AI-detected knowledge gaps and auto-generated solutions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Gaps Detected</CardDescription>
            <CardTitle className="text-3xl">25</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">↑ 8 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Auto-Generated SOPs</CardDescription>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">72% approval rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Approval</CardDescription>
            <CardTitle className="text-3xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-600">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Gaps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Knowledge Gaps</CardTitle>
          <CardDescription>
            AI has identified these queries that couldn't be answered confidently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            data={knowledgeGaps}
            columns={[
              {
                id: 'query',
                label: 'Query',
                render: (gap) => (
                  <div>
                    <p className="font-medium">{gap.query}</p>
                    <p className="text-sm text-gray-500">
                      Detected: {gap.detectedAt}
                    </p>
                  </div>
                ),
              },
              {
                id: 'frequency',
                label: 'Frequency',
                render: (gap) => (
                  <Badge variant="secondary">{gap.frequency} times</Badge>
                ),
              },
              {
                id: 'status',
                label: 'Status',
                render: (gap) => (
                  <div className="flex items-center gap-2">
                    {statusIcons[gap.status as keyof typeof statusIcons]}
                    <span className="text-sm capitalize">
                      {gap.status.replace('_', ' ')}
                    </span>
                  </div>
                ),
              },
              {
                id: 'action',
                label: 'Action',
                render: (gap) => (
                  <div className="flex gap-2">
                    {gap.status === 'suggestion_generated' && (
                      <>
                        <Button size="sm" variant="default">
                          Review & Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </>
                    )}
                    {gap.status === 'detected' && (
                      <Button size="sm" variant="outline">
                        Generate SOP
                      </Button>
                    )}
                    {gap.status === 'approved' && (
                      <Button size="sm" variant="ghost">
                        View SOP
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
            mobileCard={(gap) => (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">{gap.query}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Detected: {gap.detectedAt}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{gap.frequency} times</Badge>
                  <div className="flex items-center gap-2">
                    {statusIcons[gap.status as keyof typeof statusIcons]}
                    <span className="text-sm capitalize">
                      {gap.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  {gap.status === 'suggestion_generated' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Example: AI-Generated SOP Preview */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <CardTitle>AI-Generated SOP Preview</CardTitle>
          </div>
          <CardDescription>
            Review this auto-generated solution for: "What is the return policy for
            bulk orders?"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-lg mb-2">
                SOP: Bulk Order Return Policy
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Purpose:</strong> Handle return requests for bulk orders (50+
                units)
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">Procedure:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Verify order quantity exceeds 50 units</li>
                <li>Check if return is within 30-day window</li>
                <li>Inspect product condition (unopened packaging required)</li>
                <li>Generate return authorization number</li>
                <li>Coordinate with logistics for pickup</li>
                <li>Process refund within 7 business days</li>
              </ol>
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
              <Button className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve & Publish
              </Button>
              <Button variant="outline" className="flex-1">
                Edit SOP
              </Button>
              <Button variant="destructive">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
            <p className="text-blue-900">
              <strong>AI Confidence:</strong> 92% • Generated using Llama 3.1 70B
            </p>
            <p className="text-blue-700 mt-1">
              Based on 12 similar queries and existing policies
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
