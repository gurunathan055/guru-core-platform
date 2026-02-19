import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Upload file to Supabase Storage (Optional for now, skipping to text extraction)
        // For this MVP, we will process text directly.

        let textContent = '';

        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            textContent = await file.text();
        } else {
            return NextResponse.json({ error: 'Only .txt and .md files supported for this quantum iteration' }, { status: 400 });
            // TODO: Add PDF parsing with pdf-parse (requires careful buffer handling)
        }

        // 2. Create Document Record
        const { data: doc, error: docError } = await supabase
            .from('documents')
            .insert({
                title: title || file.name,
                category,
                file_type: 'txt',
                content: textContent, // Store full content for reference
                status: 'processing',
                created_by: session.user.id
            })
            .select()
            .single();

        if (docError) throw docError;

        // 3. Chunk Text (Simple splitting for now)
        const chunks = splitTextIntoChunks(textContent, 1000); // ~1000 chars per chunk

        // 4. Generate Embeddings & Store
        for (const chunk of chunks) {
            const embeddingResponse = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: chunk,
            });

            const embedding = embeddingResponse.data[0].embedding;

            await supabase.from('document_embeddings').insert({
                document_id: doc.id,
                content: chunk,
                embedding: embedding
            });
        }

        // 5. Update Status
        await supabase.from('documents').update({ status: 'ready' }).eq('id', doc.id);

        return NextResponse.json({ success: true, id: doc.id });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}
