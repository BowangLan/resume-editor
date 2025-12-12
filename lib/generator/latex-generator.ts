import type { Resume, EducationItem, ExperienceItem, ProjectItem } from '@/lib/types/resume';

const LATEX_TEMPLATE_HEADER = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\linespread{1}

\\titleformat{\\section}{
  \\vspace{-6pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-8pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\linespread{1}
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
  \\linespread{1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{1pt}\\item
  \\renewcommand{\\arraystretch}{0.9}
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-8pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-8pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-10pt}}

\\begin{document}
`;

export class LatexGenerator {
  private resume: Resume;

  constructor(resume: Resume) {
    this.resume = resume;
  }

  generate(): string {
    const sections = [
      LATEX_TEMPLATE_HEADER,
      this.generateHeader(),
      this.generateEducation(),
      this.generateExperience(),
      this.generateProjects(),
      this.generateSkills(),
      '\\end{document}',
    ];

    return sections.join('\n');
  }

  private generateHeader(): string {
    const { name, phone, email, website, linkedin, github } = this.resume.header;

    const contactParts: string[] = [];

    if (phone) contactParts.push(this.escape(phone));
    if (email) contactParts.push(`\\href{mailto:${email}}{\\underline{${email}}}`);
    if (website) contactParts.push(`\\href{https://${website}}{\\underline{${website}}}`);
    if (linkedin) contactParts.push(`\\href{https://linkedin.com/in/${linkedin}}{\\underline{linkedin.com/in/${linkedin}}}`);
    if (github) contactParts.push(`\\href{https://github.com/${github}}{\\underline{github.com/${github}}}`);

    const contactLine = contactParts.length > 0
      ? `    \\small ${contactParts.join(' $|$ ')}`
      : '';

    return `
\\begin{center}
    \\textbf{\\Huge \\scshape ${this.escape(name)}} ${contactLine ? '\\\\ \\vspace{1pt}' : ''}
${contactLine}
\\end{center}
`;
  }

  private generateEducation(): string {
    if (this.resume.education.length === 0) return '';

    const items = this.resume.education.map(item => this.generateEducationItem(item)).join('\n');

    return `
%-----------EDUCATION-----------
\\section{Education}
\\resumeSubHeadingListStart
${items}
\\resumeSubHeadingListEnd
`;
  }

  private generateEducationItem(item: EducationItem): string {
    const courseworkSection = item.coursework.length > 0
      ? `    \\resumeItemListStart
        \\resumeItem{Relevant course work: ${item.coursework.map(c => this.formatInlineBold(c)).join(', ')}}
    \\resumeItemListEnd`
      : '';

    return `    \\resumeSubheading
    {${this.escape(item.school)}}{${this.escape(item.location)}}
    {${this.escape(item.degree)}}{${this.escape(item.dates)}}
${courseworkSection}`;
  }

  private generateExperience(): string {
    if (this.resume.experience.length === 0) return '';

    const items = this.resume.experience.map(item => this.generateExperienceItem(item)).join('\n\n');

    return `
%-----------EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart

${items}

\\resumeSubHeadingListEnd
`;
  }

  private generateExperienceItem(item: ExperienceItem): string {
    const titleWithLink = item.link
      ? `${this.escape(item.title)} \\href{${item.link}}{\\faLink}`
      : this.escape(item.title);

    const bullets = item.bullets
      .filter(b => b.trim().length > 0)
      .map(bullet => `        \\resumeItem{${this.formatInlineBold(bullet)}}`)
      .join('\n');

    if (!bullets) return '';

    return `    \\resumeSubheading
      {${titleWithLink}}{${this.escape(item.dates)}}
      {${this.escape(item.company)}}{${this.escape(item.location)}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
  }

  private generateProjects(): string {
    if (this.resume.projects.length === 0) return '';

    const items = this.resume.projects.map(item => this.generateProjectItem(item)).join('\n\n');

    return `
%-----------PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingListStart

${items}

\\resumeSubHeadingListEnd
`;
  }

  private generateProjectItem(item: ProjectItem): string {
    const nameWithLink = item.link
      ? `\\textbf{${this.escape(item.name)}} \\href{${item.link}}{\\faLink}`
      : `\\textbf{${this.escape(item.name)}}`;

    const bullets = item.bullets
      .filter(b => b.trim().length > 0)
      .map(bullet => `        \\resumeItem{${this.formatInlineBold(bullet)}}`)
      .join('\n');

    if (!bullets) return '';

    return `    \\resumeProjectHeading
      {${nameWithLink}}{${this.escape(item.dates)}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
  }

  private generateSkills(): string {
    const skillCategories = Object.entries(this.resume.skills)
      .map(([category, skills]) => {
        const skillsString = Array.isArray(skills) ? skills.join(', ') : skills;
        return `    \\textbf{${this.escape(category)}}{: ${this.formatInlineBold(skillsString)} } \\\\`;
      })
      .join('\n');

    return `
%-----------PROGRAMMING SKILLS-----------
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillCategories}
    }}
\\end{itemize}
`;
  }

  private escape(text: string): string {
    if (!text) return '';

    // Escape special LaTeX characters while preserving intentional LaTeX commands
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')
      // Fix textbackslash if it was in a LaTeX command
      .replace(/\\textbackslash\{\}textbf/g, '\\textbf')
      .replace(/\\textbackslash\{\}textit/g, '\\textit')
      .replace(/\\textbackslash\{\}href/g, '\\href');
  }

  /**
   * Supports markdown-style inline bold (**text** or __text__) and converts to LaTeX \\textbf{text}.
   * All other content is escaped for LaTeX safety.
   */
  private formatInlineBold(text: string): string {
    if (!text) return '';

    const out: string[] = [];
    let i = 0;

    const escapeSegment = (s: string) => this.escape(s);

    while (i < text.length) {
      const nextDoubleStar = text.indexOf('**', i);
      const nextDoubleUnderscore = text.indexOf('__', i);

      const next =
        nextDoubleStar === -1
          ? nextDoubleUnderscore
          : nextDoubleUnderscore === -1
            ? nextDoubleStar
            : Math.min(nextDoubleStar, nextDoubleUnderscore);

      if (next === -1) {
        out.push(escapeSegment(text.slice(i)));
        break;
      }

      // Emit preceding plain text
      out.push(escapeSegment(text.slice(i, next)));

      const marker = text.startsWith('**', next) ? '**' : '__';
      const start = next + marker.length;
      const end = text.indexOf(marker, start);

      // No closing marker -> treat the marker literally
      if (end === -1) {
        out.push(escapeSegment(marker));
        i = start;
        continue;
      }

      const boldContent = text.slice(start, end);
      out.push(`\\textbf{${escapeSegment(boldContent)}}`);
      i = end + marker.length;
    }

    return out.join('');
  }
}

export function generateLatex(resume: Resume): string {
  const generator = new LatexGenerator(resume);
  return generator.generate();
}
