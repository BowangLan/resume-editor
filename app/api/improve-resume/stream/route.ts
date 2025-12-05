import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import {
  buildExperiencePrompt,
  buildProjectPrompt,
  buildSkillsPrompt,
} from '@/lib/prompts/improvement-prompts';
import { Resume, ExperienceItem, ProjectItem } from '@/lib/types/resume';
import { ProgressEvent } from '@/lib/types/streaming';

// Concurrent processing limit
const CONCURRENT_LIMIT = 2;

// Zod schemas for structured output
const bulletImprovementSchema = z.object({
  original: z.string().describe('The original bullet point'),
  improved: z.string().describe('The improved bullet point'),
  reason: z.string().describe('The reason for the improvement'),
});

const experienceBulletsSchema = z.object({
  bullets: z.array(bulletImprovementSchema),
});

const projectBulletsSchema = z.object({
  bullets: z.array(bulletImprovementSchema),
});

const skillsImprovementSchema = z.object({
  original: z.record(z.string(), z.array(z.string())),
  improved: z.record(z.string(), z.array(z.string())),
  reason: z.string(),
});

/**
 * Process a single experience item
 */
async function processExperience(
  experience: ExperienceItem,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController
): Promise<void> {
  try {
    // Send processing event
    const processingEvent: ProgressEvent = {
      type: 'experience',
      id: experience.id,
      status: 'processing',
      title: experience.title,
      company: experience.company,
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(processingEvent)}\n\n`));

    // Generate improvements
    const prompt = buildExperiencePrompt(experience);
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: experienceBulletsSchema,
      prompt,
    });

    // Send completed event
    const completedEvent: ProgressEvent = {
      type: 'experience',
      id: experience.id,
      status: 'completed',
      title: experience.title,
      company: experience.company,
      bullets: object.bullets,
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completedEvent)}\n\n`));
  } catch (error) {
    // Send error event
    const errorEvent: ProgressEvent = {
      type: 'experience',
      id: experience.id,
      status: 'error',
      title: experience.title,
      company: experience.company,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
  }
}

/**
 * Process a single project item
 */
async function processProject(
  project: ProjectItem,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController
): Promise<void> {
  try {
    // Send processing event
    const processingEvent: ProgressEvent = {
      type: 'project',
      id: project.id,
      status: 'processing',
      name: project.name,
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(processingEvent)}\n\n`));

    // Generate improvements
    const prompt = buildProjectPrompt(project);
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: projectBulletsSchema,
      prompt,
    });

    // Send completed event
    const completedEvent: ProgressEvent = {
      type: 'project',
      id: project.id,
      status: 'completed',
      name: project.name,
      bullets: object.bullets,
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completedEvent)}\n\n`));
  } catch (error) {
    // Send error event
    const errorEvent: ProgressEvent = {
      type: 'project',
      id: project.id,
      status: 'error',
      name: project.name,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
  }
}

/**
 * Process skills section
 */
async function processSkills(
  skills: Record<string, string[]>,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController
): Promise<void> {
  try {
    // Send processing event
    const processingEvent: ProgressEvent = {
      type: 'skills',
      status: 'processing',
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(processingEvent)}\n\n`));

    // Generate improvements
    const prompt = buildSkillsPrompt(skills);
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: skillsImprovementSchema,
      prompt,
    });

    // Send completed event
    const completedEvent: ProgressEvent = {
      type: 'skills',
      status: 'completed',
      original: object.original,
      improved: object.improved,
      reason: object.reason,
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(completedEvent)}\n\n`));
  } catch (error) {
    // Send error event
    const errorEvent: ProgressEvent = {
      type: 'skills',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
  }
}

/**
 * Process items with concurrent limit
 */
async function processWithConcurrency<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  limit: number
): Promise<void> {
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = processor(item).then(() => {
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume }: { resume: Resume } = body;

    if (!resume) {
      return new Response(JSON.stringify({ error: 'No resume provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if resume has content to improve
    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasProjects = resume.projects && resume.projects.length > 0;

    if (!hasExperience && !hasProjects) {
      return new Response(
        JSON.stringify({
          error: 'Resume must have at least one experience or project entry',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send pending events for all items
          for (const exp of resume.experience) {
            const event: ProgressEvent = {
              type: 'experience',
              id: exp.id,
              status: 'pending',
              title: exp.title,
              company: exp.company,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }

          for (const proj of resume.projects) {
            const event: ProgressEvent = {
              type: 'project',
              id: proj.id,
              status: 'pending',
              name: proj.name,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }

          if (resume.skills && Object.keys(resume.skills).length > 0) {
            const event: ProgressEvent = {
              type: 'skills',
              status: 'pending',
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }

          // Process all items with concurrency limit
          const allTasks = [
            ...resume.experience.map((exp) => ({
              type: 'experience' as const,
              item: exp,
            })),
            ...resume.projects.map((proj) => ({
              type: 'project' as const,
              item: proj,
            })),
            ...(resume.skills && Object.keys(resume.skills).length > 0
              ? [{ type: 'skills' as const, item: resume.skills }]
              : []),
          ];

          await processWithConcurrency(
            allTasks,
            async (task) => {
              if (task.type === 'experience') {
                await processExperience(task.item as ExperienceItem, encoder, controller);
              } else if (task.type === 'project') {
                await processProject(task.item as ProjectItem, encoder, controller);
              } else if (task.type === 'skills') {
                await processSkills(
                  task.item as Record<string, string[]>,
                  encoder,
                  controller
                );
              }
            },
            CONCURRENT_LIMIT
          );

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in improve-resume stream:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to improve resume. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
