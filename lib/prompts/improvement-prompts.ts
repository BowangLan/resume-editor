import { ExperienceItem, ProjectItem, Skills } from '@/lib/types/resume';

/**
 * Base improvement guidelines shared across all prompts
 */
const BASE_GUIDELINES = `
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

## IMPROVEMENT INSTRUCTIONS

For each bullet point:
1. Identify if it follows "Built X using Y" pattern (weak)
2. Add the missing "to solve Z, resulting in [impact]" part
3. Use strong verbs
4. Remove adjectives and passive voice
5. Make technical choices explicit (e.g., "modular API" instead of just "API")
6. Explain the reason for your change clearly

IMPORTANT:
- Only improve bullets that need improvement
- If a bullet is already strong, keep it mostly the same (mark improved = original)
- Don't hallucinate technologies or impacts that aren't mentioned
- Keep improvements realistic and believable
- Always explain WHY each change improves the resume
`;

/**
 * Build prompt for improving a single experience item
 */
export function buildExperiencePrompt(experience: ExperienceItem): string {
  return `${BASE_GUIDELINES}

Now, improve the following experience entry according to the guidelines above.

## Experience Entry

**${experience.title}** at **${experience.company}**
Location: ${experience.location}
Duration: ${experience.dates}

### Current Bullets:
${experience.bullets.map((bullet, idx) => `${idx + 1}. ${bullet}`).join('\n')}

---

Return improvements for each bullet point with:
1. The original bullet point text
2. The improved version following the Problem → Action → Impact formula
3. A clear explanation of WHY the change makes the resume stronger

Focus on adding concrete impact and removing weak patterns.`;
}

/**
 * Build prompt for improving a single project item
 */
export function buildProjectPrompt(project: ProjectItem): string {
  return `${BASE_GUIDELINES}

Now, improve the following project entry according to the guidelines above.

## Project Entry

**${project.name}**
Duration: ${project.dates}${project.link ? `\nLink: ${project.link}` : ''}

### Current Bullets:
${project.bullets.map((bullet, idx) => `${idx + 1}. ${bullet}`).join('\n')}

---

Return improvements for each bullet point with:
1. The original bullet point text
2. The improved version following the Problem → Action → Impact formula
3. A clear explanation of WHY the change makes the resume stronger

For projects, emphasize:
- Technical challenges solved
- Technologies used and why they were chosen
- Scale and complexity
- Measurable outcomes or user impact`;
}

/**
 * Build prompt for improving skills section
 */
export function buildSkillsPrompt(skills: Skills): string {
  return `${BASE_GUIDELINES}

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

---

Now, improve the following skills section:

## Current Skills

${Object.entries(skills)
  .map(([category, skillList]) => `**${category}**: ${skillList.join(', ')}`)
  .join('\n')}

---

Return:
1. The original skills structure
2. An improved, reorganized skills structure with better categorization
3. A clear explanation of why the new organization is better

Focus on:
- Logical grouping by domain/purpose
- Clear, professional category names
- Removing redundancies
- Ordering from most relevant to least`;
}
