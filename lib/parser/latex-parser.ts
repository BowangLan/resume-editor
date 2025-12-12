import type { Resume, ResumeHeader, EducationItem, ExperienceItem, ProjectItem, Skills } from '@/lib/types/resume';

export class LatexParser {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Resume {
    return {
      header: this.parseHeader(),
      education: this.parseEducation(),
      experience: this.parseExperience(),
      projects: this.parseProjects(),
      skills: this.parseSkills(),
    };
  }

  private parseHeader(): ResumeHeader {
    const nameMatch = this.content.match(/\\textbf\{\\Huge\s+\\scshape\s+([^}]+)\}/);
    const phoneMatch = this.content.match(/\((\d{3})\)\s+(\d{3})-(\d{4})/);
    const emailMatch = this.content.match(/\\href\{mailto:([^}]+)\}/);
    const websiteMatch = this.content.match(/\\href\{https:\/\/([^}]+)\}\s*\{\\underline\{([^}]+)\}\}\s+\$\|\$/);
    const linkedinMatch = this.content.match(/\\href\{https:\/\/linkedin\.com\/in\/([^}]+)\}/);
    const githubMatch = this.content.match(/\\href\{https:\/\/github\.com\/([^}]+)\}/);

    return {
      name: nameMatch?.[1]?.trim() || '',
      phone: phoneMatch ? `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}` : '',
      email: emailMatch?.[1] || '',
      website: websiteMatch?.[1] || '',
      linkedin: linkedinMatch?.[1] || '',
      github: githubMatch?.[1] || '',
    };
  }

  private parseEducation(): EducationItem[] {
    const educationSection = this.extractSection('Education');
    if (!educationSection) return [];

    const items: EducationItem[] = [];
    const subheadingRegex = /\\resumeSubheading\s*\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}/g;

    let match;
    while ((match = subheadingRegex.exec(educationSection)) !== null) {
      const courseworkMatch = educationSection.slice(match.index).match(/\\resumeItem\{Relevant course work:\s*([^}]+)\}/);

      items.push({
        id: crypto.randomUUID(),
        school: match[1].trim(),
        location: match[2].trim(),
        degree: match[3].trim(),
        dates: match[4].trim(),
        coursework: courseworkMatch?.[1]?.split(',').map(c => c.trim()) || [],
      });
    }

    return items;
  }

  private parseExperience(): ExperienceItem[] {
    const experienceSection = this.extractSection('Experience');
    if (!experienceSection) return [];

    const items: ExperienceItem[] = [];
    const subheadingRegex = /\\resumeSubheading\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}([\s\S]*?)(?=\\resumeSubheading|\\resumeSubHeadingListEnd)/g;

    let match;
    while ((match = subheadingRegex.exec(experienceSection)) !== null) {
      const titlePart = match[1];
      const linkMatch = titlePart.match(/\\href\{([^}]+)\}\{\\faLink\}/);
      const title = this.latexInlineToMarkdownBold(
        titlePart.replace(/\\href\{[^}]+\}\{\\faLink\}/, '').trim(),
      );

      const bullets = this.extractBullets(match[5]);

      items.push({
        id: crypto.randomUUID(),
        title,
        dates: match[2].trim(),
        company: match[3].trim(),
        location: match[4].trim(),
        bullets,
        link: linkMatch?.[1],
      });
    }

    return items;
  }

  private parseProjects(): ProjectItem[] {
    const projectSection = this.extractSection('Projects');
    if (!projectSection) return [];

    const items: ProjectItem[] = [];
    const projectRegex = /\\resumeProjectHeading\s*\{\\textbf\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\}\{([^}]+)\}([\s\S]*?)(?=\\resumeProjectHeading|\\resumeSubHeadingListEnd)/g;

    let match;
    while ((match = projectRegex.exec(projectSection)) !== null) {
      const namePart = match[1];
      const linkMatch = namePart.match(/\\href\{([^}]+)\}\{\\faLink\}/);
      const name = this.latexInlineToMarkdownBold(
        namePart.replace(/\\href\{[^}]+\}\{\\faLink\}/, '').trim(),
      );

      const bullets = this.extractBullets(match[3]);

      items.push({
        id: crypto.randomUUID(),
        name,
        dates: match[2].trim(),
        bullets,
        link: linkMatch?.[1],
      });
    }

    return items;
  }

  private parseSkills(): Skills {
    const skillsSection = this.extractSection('Skills');
    const skills: Skills = {};

    if (!skillsSection) return skills;

    // Match all skill categories: \textbf{CategoryName}{: skills, go, here}
    const skillRegex = /\\textbf\{([^}]+)\}\{:\s*([^}]+)\}/g;
    let match;

    while ((match = skillRegex.exec(skillsSection)) !== null) {
      const category = match[1].trim();
      const skillsString = match[2].trim();

      // Split by comma and clean up each skill
      const skillsArray = skillsString
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      skills[category] = skillsArray;
    }

    return skills;
  }

  private extractSection(sectionName: string): string | null {
    const sectionRegex = new RegExp(`\\\\section\\{${sectionName}\\}([\\s\\S]*?)(?=\\\\section|\\\\end\\{document\\}|$)`);
    const match = this.content.match(sectionRegex);
    return match?.[1] || null;
  }

  private extractBullets(content: string): string[] {
    const bullets: string[] = [];
    const bulletRegex = /\\resumeItem\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;

    let match;
    while ((match = bulletRegex.exec(content)) !== null) {
      bullets.push(this.latexInlineToMarkdownBold(match[1].trim()));
    }

    return bullets;
  }

  private latexInlineToMarkdownBold(text: string): string {
    if (!text) return '';

    // Convert inline LaTeX bold to markdown bold for editing in the UI.
    // Handles nested braces within the \\textbf{...} argument.
    const textbfRegex = /\\textbf\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    return text.replace(textbfRegex, (_, inner: string) => `**${inner}**`);
  }
}

export function parseLatexResume(content: string): Resume {
  const parser = new LatexParser(content);
  return parser.parse();
}
