import { OpenAI } from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { message, voice = 'alloy', gender = 'male', identified = false } = await req.json();

        // 1. RAG: Retrieve Context (if message is long enough to be a query)
        let contextText = '';
        if (message && message.length > 5) {
            try {
                const supabase = createRouteHandlerClient({ cookies });

                // Generate embedding for query
                const embeddingResponse = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: message,
                });
                const queryEmbedding = embeddingResponse.data[0].embedding;

                // Search in vector DB
                const { data: documents, error } = await supabase.rpc('match_documents', {
                    query_embedding: queryEmbedding,
                    match_threshold: 0.5, // Similarity threshold
                    match_count: 3        // Top 3 chunks
                });

                if (documents && documents.length > 0) {
                    contextText = documents.map((d: any) => d.content).join('\n---\n');
                    console.log("RAG Context Found:", documents.length, "docs");
                }
            } catch (err) {
                console.warn("RAG Retrieval Failed (Non-critical):", err);
            }
        }

        // 2. Generate AI Response
        const systemPrompt = `
    You are Guru, an advanced AI voice assistant for a high-tech call center platform.
    Your voice should be professional, warm, and concise (optimized for speech).
    
    User Profile:
    - Status: ${identified ? 'Identified Customer (VIP)' : 'Guest'}
    
    ${contextText ? `
    KNOWLEDGE BASE CONTEXT (Use this to answer):
    ---
    ${contextText}
    ---
    ` : ''}
    
    Instructions:
    - If context is provided and relevant, use it to answer accurately.
    - If no context is found, rely on your general knowledge but be helpful.
    - Keep responses short (under 2-3 sentences) for natural voice interaction.
    - Do not mention "context" or "database" explicitly, just answer naturally.
    `;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message || "Hello" },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        const aiResponseText = chatCompletion.choices[0].message.content || "I'm listening.";

        // 3. Generate Audio (TTS)
        const audioResponse = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice,
            input: aiResponseText,
        });

        const buffer = Buffer.from(await audioResponse.arrayBuffer());
        const base64Audio = buffer.toString('base64');

        return NextResponse.json({
            text: aiResponseText,
            audio: `data:audio/mp3;base64,${base64Audio}`,
            rag_used: !!contextText
        });

    } catch (error: any) {
        console.error('Voice API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process voice request', details: error.message },
            { status: 500 }
        );
    }
}
