'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function KnowledgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    // In a real app, this would fetch from /api/knowledge
    // For now we'll mock or just show local state + success toast
    // But since we just built the upload API, let's build the fetch too?
    // Let's stick to uploading first.
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('category', 'general');

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      toast.success("Document Embedded Successfully!");
      setFile(null);
      // Refresh docs list (mocked for now as we haven't built GET /api/knowledge)
      setDocuments(prev => [{
        id: Date.now(),
        title: file.name,
        status: 'ready',
        category: 'general',
        created_at: new Date().toISOString()
      }, ...prev]);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base <Badge variant="secondary">RAG Enabled</Badge></h1>
          <p className="text-gray-500 mt-1">Upload documents to train your Voice AI</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="upload">Upload & Train</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Knowledge</CardTitle>
              <CardDescription>
                Supports .txt and .md files. The content will be vectorized for the AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".txt,.md"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-indigo-600 mb-2" />
                    <p className="font-medium text-lg text-indigo-700">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to Select File
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Text / Markdown files only
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUpload} disabled={!file || uploading} className="w-full sm:w-auto">
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Vectorizing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Embed
                    </>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indexed Documents</CardTitle>
              <CardDescription>Documents the AI can reference during calls</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No documents indexed yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded bg-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded text-green-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-gray-500">Ready for RAG</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Indexed
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
