import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import pdf from 'pdf-parse-fork';

const resumeSchema = z.object({
  header: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    website: z.string(),
    linkedin: z.string(),
    github: z.string(),
  }),
  education: z.array(
    z.object({
      id: z.string(),
      school: z.string(),
      location: z.string(),
      degree: z.string(),
      dates: z.string(),
      coursework: z.array(z.string()),
    })
  ),
  experience: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      location: z.string(),
      dates: z.string(),
      bullets: z.array(z.string()),
      link: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      dates: z.string(),
      bullets: z.array(z.string()),
      link: z.string().optional(),
    })
  ),
  skills: z.object({
    languages: z.string(),
    frameworks: z.string(),
    database: z.string(),
    developerTools: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    // Use AI to parse the resume into structured data
    const { object } = await generateObject({
      model: openai("gpt-5-mini-2025-08-07"),
      schema: resumeSchema,
      prompt: `Parse the following resume text into a structured format. Extract all relevant information accurately.

For each education, experience, and project entry, generate a unique ID using crypto.randomUUID() format.

If any field is not found in the resume, use an empty string or empty array as appropriate.

For LinkedIn and GitHub, extract just the username (e.g., "john-doe" from "linkedin.com/in/john-doe").
For website, extract just the domain (e.g., "example.com" from "https://example.com").

Resume text:
${resumeText}`,
    });

    // Add UUIDs to items that might not have them
    const resume = {
      ...object,
      education: object.education.map((item) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
      })),
      experience: object.experience.map((item) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
      })),
      projects: object.projects.map((item) => ({
        ...item,
        id: item.id || crypto.randomUUID(),
      })),
    };

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again.' },
      { status: 500 }
    );
  }
}
