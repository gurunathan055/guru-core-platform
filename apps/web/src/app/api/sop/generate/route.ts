import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

// System prompt to enforce structured JSON output for SOPs
const systemPrompt = `
You are an expert Standard Operating Procedure (SOP) generator for enterprise businesses.
Your goal is to generate detailed, professional, and actionable SOPs based on user input.

You MUST output strictly in VALID JSON format with the following structure:
{
  "title": "String",
  "id": "String (e.g. SOP-2024-XXX)",
  "version": "String",
  "purpose": "String",
  "scope": "String",
  "procedures": [
    {
      "step": "Step 1: Step Name",
      "details": ["Detail 1", "Detail 2"],
      "time": "String (e.g. 5 mins)"
    }
  ],
  "compliance": ["Compliance Point 1", "Compliance Point 2"],
  "troubleshooting": [
    { "issue": "Issue Name", "solution": "Solution Description" }
  ]
}

Ensure the content is professional, comprehensive, and directly addresses the user's request.
`;

export async function POST(req: Request) {
    try {
        const { title, category, description } = await req.json();

        if (!description) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            // Fallback for demo/build environments without keys
            console.warn("OPENAI_API_KEY missing, returning mock data");
            return NextResponse.json(mockSOP(title || "Generated SOP"));
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Create an SOP for a "${category}" process titled "${title}". Description: ${description}`
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const sopData = JSON.parse(content);

        return NextResponse.json(sopData);

    } catch (error) {
        console.error('SOP Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate SOP', details: (error as Error).message },
            { status: 500 }
        );
    }
}

function mockSOP(title: string) {
    return {
        title: title,
        id: "SOP-DEMO-001",
        version: "1.0",
        purpose: "Demonstration of SOP structure (API Key Missing)",
        scope: "Demo Environment",
        procedures: [
            {
                step: "Step 1: Configure API Key",
                details: ["Go to Vercel Settings", "Add OPENAI_API_KEY"],
                time: "2 mins"
            }
        ],
        compliance: ["System Check"],
        troubleshooting: []
    };
}
