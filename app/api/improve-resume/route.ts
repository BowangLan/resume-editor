import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Zod schema for the improvement response
const bulletImprovementSchema = z.object({
  original: z.string().describe("The original bullet point"),
  improved: z.string().describe("The improved bullet point"),
  reason: z.string().describe("The reason for the improvement"),
});

const experienceImprovementSchema = z.object({
  id: z.string().describe("The unique identifier for the experience item"),
  bullets: z.array(bulletImprovementSchema),
});

const projectImprovementSchema = z.object({
  id: z.string().describe("The unique identifier for the project item"),
  bullets: z.array(bulletImprovementSchema),
});

const skillsImprovementSchema = z.object({
  original: z.record(z.string(), z.array(z.string())).describe(
    "Original skills organized by category. Example: { 'Languages': ['JavaScript', 'Python'], 'Frontend': ['React', 'Next.js'] }"
  ),
  improved: z.record(z.string(), z.array(z.string())).describe(
    "Improved skills organized by category. Example: { 'Languages': ['JavaScript', 'TypeScript', 'Python'], 'Frontend': ['React', 'Next.js', 'Tailwind'] }"
  ),
  reason: z.string().describe("Explanation for the skill reorganization"),
});

const improvementSchema = z.object({
  experience: z.array(experienceImprovementSchema),
  projects: z.array(projectImprovementSchema),
  skills: skillsImprovementSchema,
});

const IMPROVEMENT_GUIDELINES = `
THE COMPREHENSIVE GUIDE TO A HIGH-IMPACT TECH RÉSUMÉ

You are an expert tech resume advisor. Your goal is to transform weak resume content into high-impact, signal-dense content that communicates:
1. Can you build? (projects, systems, architecture, code)
2. Can you deliver? (impact, problem-solving, automation, reliability)
3. Can you work with others? (leadership, collaboration, communication)

## BULLET POINT IMPROVEMENT RULES

### The Formula: Problem → Action → Impact

Weak bullets say: "Built X using Y"
Strong bullets say: "Built X using Y to solve Z, resulting in [impact]"

### Impact Keywords to Add (when applicable):
- automated
- eliminated manual steps
- improved maintainability
- increased reliability
- reduced system complexity
- enabled parallel development
- improved developer velocity
- removed data inconsistencies
- simplified workflows
- added observability
- supported future scaling
- validated through research/interviews
- replaced brittle machinery
- reduced cold-start time
- unified data sources
- improved reliability through [specific approach]

### What to Remove:
- Soft skills ("great communicator," "team player")
- Adjectives ("robust," "seamless," "state-of-the-art")
- Passive voice ("responsible for," "was tasked with")
- Obvious details that don't show value

### Strong Verbs to Use:
built, designed, automated, architected, shipped, implemented, created, developed, established, introduced, refactored, optimized, integrated, deployed

### Types of Impact (use when numbers aren't available):
- Technical impact: "Reduced cold-start time by 40%", "Improved query performance"
- Operational impact: "Automated workflow saving ~5 hours/week"
- Architecture impact: "Introduced typed API layers reducing integration bugs"
- Product impact: "Unified three data sources into one planning tool"
- Research impact: "Interviewed users to uncover bottlenecks"

## SKILLS SECTION IMPROVEMENT RULES

Skills should be organized by category with clear, logical groupings. Each category should contain an array of related skills.

### Bad (flat or poorly organized):
\`\`\`
Skills: JavaScript, Python, React, Node.js, Git, AWS, Docker, MongoDB, Express, TypeScript
\`\`\`

### Good (well-categorized):
\`\`\`json
{
  "Languages": ["JavaScript", "TypeScript", "Python", "SQL"],
  "Frontend": ["React", "Next.js", "Tailwind CSS"],
  "Backend": ["Node.js", "Express", "FastAPI"],
  "Databases": ["PostgreSQL", "MongoDB", "Redis"],
  "DevOps & Tools": ["Docker", "AWS", "Git", "Vercel"]
}
\`\`\`

### Category Examples:
- **Languages**: Programming languages (JavaScript, Python, Go, Java, C++, SQL, etc.)
- **Frontend**: UI frameworks and libraries (React, Vue, Angular, Next.js, Tailwind, etc.)
- **Backend**: Server frameworks (Node.js, Express, Django, Flask, Spring, etc.)
- **Databases**: Database systems (PostgreSQL, MongoDB, MySQL, Redis, etc.)
- **Cloud & DevOps**: Cloud platforms and DevOps tools (AWS, GCP, Docker, Kubernetes, etc.)
- **Tools**: Development tools (Git, VS Code, Postman, Figma, etc.)
- **Mobile**: Mobile development (React Native, Swift, Kotlin, Flutter, etc.)
- **Testing**: Testing frameworks (Jest, Pytest, Cypress, etc.)

Group skills by logical categories that reflect how engineers think. Use clear, descriptive category names.

## IMPROVEMENT INSTRUCTIONS

For each bullet point:
1. Identify if it follows "Built X using Y" pattern (weak)
2. Add the missing "to solve Z, resulting in [impact]" part
3. Use strong verbs
4. Remove adjectives and passive voice
5. Make technical choices explicit (e.g., "modular API" instead of just "API")
6. Explain the reason for your change clearly

For skills:
1. Reorganize into categories
2. Remove redundant or outdated items
3. Group related technologies together
4. Explain why the new organization is better

IMPORTANT:
- Only improve bullets that need improvement
- If a bullet is already strong, keep it mostly the same (mark improved = original)
- Don't hallucinate technologies or impacts that aren't mentioned
- Keep improvements realistic and believable
- Always explain WHY each change improves the resume
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume } = body;

    if (!resume) {
      return NextResponse.json({ error: 'No resume provided' }, { status: 400 });
    }

    // Check if resume has content to improve
    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasProjects = resume.projects && resume.projects.length > 0;

    if (!hasExperience && !hasProjects) {
      return NextResponse.json(
        { error: 'Resume must have at least one experience or project entry' },
        { status: 400 }
      );
    }

    // Build the prompt with resume data
    const prompt = `${IMPROVEMENT_GUIDELINES}

Now, improve the following resume according to the guidelines above.

RESUME DATA:

## Experience
${resume.experience.map((exp: any) => `
### ${exp.title} at ${exp.company}
${exp.bullets.map((bullet: string) => `- ${bullet}`).join('\n')}
`).join('\n')}

## Projects
${resume.projects.map((proj: any) => `
### ${proj.name}
${proj.bullets.map((bullet: string) => `- ${bullet}`).join('\n')}
`).join('\n')}

## Skills
${Object.entries(resume.skills).map(([category, skills]) =>
      `${category}: ${Array.isArray(skills) ? skills.join(', ') : skills}`
    ).join('\n')}

---

Return improvements for:
1. Each experience item with improved bullets and reasons
2. Each project item with improved bullets and reasons
3. Skills section with improved organization and reason

For each improvement, explain WHY the change makes the resume stronger using the guideline principles.`;

    // Use AI to generate improvements
    const { object } = await generateObject({
      model: openai("gpt-5.1"),
      schema: improvementSchema,
      prompt,
    });

    return NextResponse.json({ improvements: object });
  } catch (error) {
    console.error('Error improving resume:', error);
    return NextResponse.json(
      { error: 'Failed to improve resume. Please try again.' },
      { status: 500 }
    );
  }
}
