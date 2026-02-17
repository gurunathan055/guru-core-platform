'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, FileText, Download, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SOPGeneratorPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [input, setInput] = useState('');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold">SOP Generator</h1>
        <p className="text-gray-500 mt-1">
          AI-powered SOP creation from simple descriptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Describe Your Process
            </CardTitle>
            <CardDescription>
              Enter a simple description or bullet points. AI will generate a complete
              SOP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">SOP Title</Label>
              <Input
                id="title"
                placeholder="e.g., Handle Customer Refund Request"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-service">Customer Service</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="product">Product Support</SelectItem>
                  <SelectItem value="technical">Technical Issues</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input">Process Description</Label>
              <Textarea
                id="input"
                placeholder="Enter simple bullet points or description...&#10;&#10;Example:&#10;- Check order date&#10;- Verify product condition&#10;- Process refund&#10;- Send confirmation email"
                rows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={generating || !input}
            >
              {generating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating SOP...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate SOP
                </>
              )}
            </Button>

            <div className="bg-primary-50 p-3 rounded-lg text-sm">
              <p className="text-primary-900">
                <strong>AI Model:</strong> Mixtral 8x7B
              </p>
              <p className="text-primary-700 mt-1">
                Generates structured SOPs with compliance checks
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Output Side */}
        <Card className={generated ? 'border-green-500 border-2' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Generated SOP
              {generated && (
                <Badge variant="success" className="ml-auto">
                  Ready
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-generated Standard Operating Procedure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generated ? (
              <div className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Generated SOP will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  <div>
                    <h3 className="text-xl font-bold">
                      SOP: Customer Refund Request Handling
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Document ID: SOP-2024-001 • Version: 1.0
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Purpose</h4>
                    <p className="text-sm">
                      This SOP defines the standardized process for handling customer
                      refund requests to ensure consistent, compliant, and efficient
                      service delivery.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Scope</h4>
                    <p className="text-sm">
                      Applies to all customer service representatives handling refund
                      requests for FMCG products.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Procedure</h4>
                    <div className="space-y-3">
                      <div className="pl-4 border-l-2 border-primary">
                        <p className="font-medium">Step 1: Verify Order Details</p>
                        <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                          <li>Check order date and order number</li>
                          <li>Verify customer identity</li>
                          <li>
                            Confirm product matches order (SKU verification)
                          </li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-2">
                          ⏱️ Estimated time: 2-3 minutes
                        </p>
                      </div>

                      <div className="pl-4 border-l-2 border-primary">
                        <p className="font-medium">Step 2: Check Refund Eligibility</p>
                        <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                          <li>Verify purchase is within 30-day window</li>
                          <li>Check product condition requirements</li>
                          <li>Review return policy exceptions</li>
                        </ul>
                        <p className="text-xs text-yellow-600 mt-2">
                          ⚠️ Escalate if outside policy window
                        </p>
                      </div>

                      <div className="pl-4 border-l-2 border-primary">
                        <p className="font-medium">Step 3: Process Refund</p>
                        <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                          <li>Generate return authorization number</li>
                          <li>Initiate refund in payment system</li>
                          <li>Update order status to "Refunded"</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-2">
                          💳 Refund processed within 5-7 business days
                        </p>
                      </div>

                      <div className="pl-4 border-l-2 border-primary">
                        <p className="font-medium">
                          Step 4: Customer Communication
                        </p>
                        <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                          <li>Send refund confirmation email</li>
                          <li>Provide tracking information if return shipping</li>
                          <li>Log interaction in CRM</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">
                      Required Documents
                    </h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Original purchase receipt</li>
                      <li>Product condition photos (if damaged claim)</li>
                      <li>Return authorization form</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">
                      Compliance Checkpoints
                    </h4>
                    <div className="bg-blue-50 p-3 rounded space-y-1 text-sm">
                      <p>✓ Customer consent recorded for data processing</p>
                      <p>✓ PII handled per DPDP Act 2023</p>
                      <p>✓ Refund policy clearly communicated</p>
                      <p>✓ Transaction logged in audit trail</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Troubleshooting</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="font-medium">Issue: Payment gateway error</p>
                        <p className="text-gray-600">
                          Solution: Retry after 5 minutes or use manual refund
                          process
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="font-medium">Issue: Customer disputes amount</p>
                        <p className="text-gray-600">
                          Solution: Escalate to supervisor with order documentation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Publish SOP
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                  <p className="text-green-900 font-medium">
                    ✨ AI Generation Complete
                  </p>
                  <p className="text-green-700 mt-1">
                    Review the SOP and click "Publish" to make it available to your
                    team
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>SOP Templates</CardTitle>
          <CardDescription>
            Pre-built templates to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Product Return Process',
              'Order Cancellation',
              'Shipping Delay Handling',
              'Customer Complaint Resolution',
              'Bulk Order Processing',
              'Technical Support Escalation',
            ].map((template) => (
              <Card
                key={template}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-base">{template}</CardTitle>
                  <p className="text-sm text-gray-500">Click to use template</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
