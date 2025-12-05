# LaTeX Resume Editor

A modern, professional resume editor for LaTeX files built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Edit your LaTeX resumes with a beautiful, intuitive UI.

## Features

- **AI-Powered PDF Parsing**: Upload any PDF resume and let AI extract structured data
- **Split-View Interface**: Edit on the left, see generated LaTeX code on the right
- **Live LaTeX Preview**: Real-time syntax-highlighted LaTeX code updates as you edit
- **Resizable Panels**: Adjust the editor/preview split to your preference
- **Visual LaTeX Editing**: Edit resume content through an intuitive form-based UI
- **Full Section Support**: Header, Education, Experience, Projects, and Skills
- **Export to LaTeX**: Download your edited resume as a ready-to-compile .lex file
- **Code Splitting**: Optimized performance with lazy-loaded section components
- **State Management**: Zustand for efficient, type-safe state management
- **Dark Mode**: Full dark mode support via next-themes
- **Toast Notifications**: User-friendly feedback with Sonner
- **Responsive Design**: Desktop split-view, mobile tabbed interface

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (New York variant)
- **State Management**: Zustand
- **AI Integration**: Vercel AI SDK with OpenAI GPT-4o-mini
- **PDF Processing**: pdf-parse-fork
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file with your OpenAI API key
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Upload Resume

Click the "Upload PDF Resume" button and select any PDF resume file. The AI will automatically parse and structure your resume data.

### 2. Edit & Preview

**Desktop View:**
- Left panel: Visual form editor with all resume sections
- Right panel: Live LaTeX code preview with syntax highlighting
- Drag the resize handle between panels to adjust the layout

**Mobile/Tablet View:**
- Toggle between "Editor" and "LaTeX Code" tabs

The editor is organized into sections:
- **Contact Information**: Name, phone, email, website, LinkedIn, GitHub
- **Education**: School, degree, location, dates, coursework
- **Experience**: Job title, company, location, dates, achievements
- **Projects**: Project name, dates, description, links
- **Skills**: Languages, frameworks, databases, developer tools

### 3. Add/Remove Items

Use the "Add" buttons to create new entries. Each entry can be deleted (trash icon).

### 4. Copy or Download

- **Copy**: Click "Copy Code" in the LaTeX preview to copy to clipboard
- **Download**: Click "Download LaTeX" to export as a `.lex` file ready for compilation

## Project Structure

```
/app
  /page.tsx              # Main application page
  /globals.css           # Global styles and Tailwind theme
  /layout.tsx            # Root layout with fonts

/components
  /resume
    /sections            # Section-specific editors (lazy loaded)
      /header-section.tsx
      /education-section.tsx
      /experience-section.tsx
      /projects-section.tsx
      /skills-section.tsx
    /action-bar.tsx      # Top navigation with upload/download
    /resume-editor.tsx   # Main editor component with code splitting
    /empty-state.tsx     # Display when no resume loaded
    /file-uploader.tsx   # File upload component
    /form-field.tsx      # Reusable form input component
    /bullet-list-editor.tsx  # Dynamic bullet point editor
    /tag-input.tsx       # Tag/chip input component
  /ui                    # shadcn/ui components

/hooks
  /use-resume.ts         # Zustand store for resume state
  /use-file-handler.ts   # File upload/download logic
  /use-mobile.ts         # Mobile detection hook

/lib
  /types
    /resume.ts           # TypeScript type definitions
  /parser
    /latex-parser.ts     # LaTeX to JSON parser
  /generator
    /latex-generator.ts  # JSON to LaTeX generator
  /utils.ts              # Utility functions
```

## Architecture Highlights

### React Best Practices

- **Memoization**: All components use `React.memo` to prevent unnecessary re-renders
- **Code Splitting**: Section components are lazy-loaded with `React.lazy`
- **Custom Hooks**: Logic abstracted into reusable hooks
- **Type Safety**: Full TypeScript coverage with strict mode
- **Separation of Concerns**: Clear separation between UI, logic, and data

### State Management

Uses Zustand for lightweight, performant state management:

```typescript
const { resume, updateHeader, updateEducation } = useResumeStore();
```

### Parser Architecture

The LaTeX parser (`latex-parser.ts`) uses regex patterns to extract:
- Resume header (name, contact info)
- Education entries with coursework
- Experience entries with bullet points
- Projects with links
- Skills categories

The generator (`latex-generator.ts`) rebuilds valid LaTeX from the parsed data.

## Supported LaTeX Format

The editor expects LaTeX resumes with the following structure:

```latex
\documentclass[letterpaper,11pt]{article}
% ... packages and configuration ...

\begin{document}

% Contact header
\begin{center}
    \textbf{\Huge \scshape Name}
    % contact details
\end{center}

% Education section
\section{Education}
\resumeSubHeadingListStart
    \resumeSubheading{School}{Location}{Degree}{Dates}
\resumeSubHeadingListEnd

% Experience section
\section{Experience}
% ... experience entries ...

% Projects section
\section{Projects}
% ... project entries ...

% Skills section
\section{Skills}
% ... skills categories ...

\end{document}
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Customization

### Adding New Sections

1. Create a new section component in `/components/resume/sections/`
2. Add the section to the resume type in `/lib/types/resume.ts`
3. Update the parser in `/lib/parser/latex-parser.ts`
4. Update the generator in `/lib/generator/latex-generator.ts`
5. Add the section to `/components/resume/resume-editor.tsx`

### Styling

Tailwind CSS 4 uses the new `@theme` directive. Customize colors and design tokens in `/app/globals.css`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
