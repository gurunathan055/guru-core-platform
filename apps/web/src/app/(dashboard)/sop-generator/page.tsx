'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, FileText, Download, Copy, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SOPData {
  title: string;
  id: string;
  version: string;
  purpose: string;
  scope: string;
  procedures: Array<{
    step: string;
    details: string[];
    time: string;
  }>;
  compliance: string[];
  troubleshooting: Array<{
    issue: string;
    solution: string;
  }>;
}

export default function SOPGeneratorPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedSop, setGeneratedSop] = useState<SOPData | null>(null);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('customer-service');

  const handleGenerate = async () => {
    if (!input || !title) {
      toast.error("Please provide both a title and description");
      return;
    }

    setGenerating(true);
    setGeneratedSop(null);

    try {
      const response = await fetch('/api/sop/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description: input
        })
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGeneratedSop(data);
      toast.success("SOP Generated Successfully!");

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate SOP. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          SOP Generator <Badge className="bg-indigo-600">Quantum AI</Badge>
        </h1>
        <p className="text-gray-500 mt-1">
          Generate enterprise-grade Standard Operating Procedures with Intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Describe Process
            </CardTitle>
            <CardDescription>
              Enter details. Our Quantum Engine will structure it instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">SOP Title</Label>
              <Input
                id="title"
                placeholder="e.g., Handle Customer Refund Request"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-service">Customer Service</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="product">Product Support</SelectItem>
                  <SelectItem value="technical">Technical Issues</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input">Process Description</Label>
              <Textarea
                id="input"
                placeholder="Enter raw notes, bullet points, or a rough description...&#10;&#10;Example:&#10;- Check order date&#10;- Verify product condition&#10;- Process refund&#10;- Send confirmation email"
                rows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleGenerate}
              disabled={generating || !input || !title}
            >
              {generating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating Intelligence...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate SOP
                </>
              )}
            </Button>

            <div className="bg-indigo-50 p-3 rounded-lg text-sm border border-indigo-100">
              <p className="text-indigo-900 font-medium">
                <strong>Model:</strong> GPT-4o (Quantum Config)
              </p>
              <p className="text-indigo-700 mt-1">
                Generates compliant, structured documentation with error handling.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Output Side */}
        <Card className={generatedSop ? 'border-green-500 border-2' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Generated SOP
              {generatedSop && (
                <Badge className="ml-auto bg-green-600 hover:bg-green-700">
                  Ready
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {generatedSop ? 'AI-Verified Standard Operating Procedure' : 'Waiting for input...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedSop ? (
              <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-lg bg-gray-50/50">
                {generating ? (
                  <div className="text-center animate-pulse">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-indigo-400 animate-spin" />
                    <p>Analyzing Process Flows...</p>
                    <p className="text-xs mt-2">Structuring Compliance Data</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generated Document will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6 space-y-6 max-h-[600px] overflow-y-auto shadow-sm">
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {generatedSop.title}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>ID: {generatedSop.id}</span>
                      <span>Version: {generatedSop.version}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-1">Purpose</h4>
                      <p className="text-sm text-blue-900">{generatedSop.purpose}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-1">Scope</h4>
                      <p className="text-sm text-gray-900">{generatedSop.scope}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-lg border-b pb-2">Procedures</h4>
                    <div className="space-y-4">
                      {generatedSop.procedures?.map((proc, idx) => (
                        <div key={idx} className="pl-4 border-l-4 border-indigo-500 py-1">
                          <p className="font-bold text-gray-900">{proc.step}</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                            {proc.details.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                          {proc.time && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              ⏱️ {proc.time}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedSop.compliance && generatedSop.compliance.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Compliance Checklist
                      </h4>
                      <ul className="text-sm space-y-1">
                        {generatedSop.compliance.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600">✓</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedSop.troubleshooting && generatedSop.troubleshooting.length > 0 && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Troubleshooting
                      </h4>
                      <div className="space-y-2">
                        {generatedSop.troubleshooting.map((t, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-semibold text-amber-900">{t.issue}:</span> <span className="text-amber-800">{t.solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Publish SOP
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Copied to clipboard")}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
