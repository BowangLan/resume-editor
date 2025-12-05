\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome}
\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}

\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% default line height
\linespread{1}

% Sections formatting
\titleformat{\section}{
  \vspace{-6pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-8pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \linespread{1}
  \item\small{
    {#1 \vspace{-2pt}}
  }
  \linespread{1}
}

\newcommand{\resumeSubheading}[4]{
  \vspace{1pt}\item
  \renewcommand{\arraystretch}{0.9}
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-8pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-8pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-10pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}

%----------HEADING----------
% \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
%   \textbf{\href{http://sourabhbajaj.com/}{\Large Sourabh Bajaj}} & Email : \href{mailto:sourabh@sourabhbajaj.com}{sourabh@sourabhbajaj.com}\\
%   \href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\
% \end{tabular*}


\begin{center}
        \textbf{\Huge \scshape Jeffrey Lan} \\ \vspace{1pt}
        \small (206) 697-7826 $|$ \href{mailto:blan22020@gmail.com}{\underline{blan22020@gmail.com}} $|$
        \href{https://jeffbl.dev}
        {\underline{jeffbl.dev}} $|$
        \href{https://linkedin.com/in/jeffrey-lan}{\underline{linkedin.com/in/jeffrey-lan}} $|$
        \href{https://github.com/BowangLan}{\underline{github.com/BowangLan}}
    \end{center}

    %-----------EDUCATION-----------
    \section{Education}
    \resumeSubHeadingListStart
        \resumeSubheading
        {University of Washington}{Seattle, WA}
        {Bachelor of Science in Astronomy}{Sep 2020 -- Aug 2025}
        \resumeItemListStart
            \resumeItem{Relevant course work: Data Structures and Algorithms, Interaction Programming}
        \resumeItemListEnd
    \resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart


    \resumeSubheading
      {Lead Software Engineer (Part-Time)}{April 2025 -- Present}
      {Performance Formula}{Seattle, WA}
      \resumeItemListStart
        \resumeItem{Developed a cross-platform mobile using \textbf{React Native}, \textbf{Expo}, \textbf{Convex} for database, and \textbf{WorkOS} for authentication}
        \resumeItem{Built a custom admin dashboard using \textbf{Next.js} for managing data internally leveraging LLM, saved 10+ hours of manual labor per week}
      \resumeItemListEnd

      
      \resumeSubheading
      {Lead Software Engineer (Part-Time)}{Sep 2024 -- Aug 2025}
      {Violet}{Seattle, WA}
      \resumeItemListStart
        \resumeItem{Engineered a robust cross-platform mobile application leveraging \textbf{React Native} and \textbf{Expo}, delivering seamless user experiences across iOS and Android platforms}
        \resumeItem{Architected and deployed a high-performance backend system utilizing \textbf{Golang},\textbf{Gin}, and \textbf{PostgreSQL}, adhering to Clean Architecture principles, optimized code maintainability, ensured scalability, and fortified system reliability.}
      \resumeItemListEnd

    \resumeSubheading
      {Team Leader \& Software Engineer \href{https://test.uwclassmate.com/}{\faLink}}{Sep 2022 -- Present}
      {Organization of Hua Classmates}{Seattle, WA}
      \resumeItemListStart
        \resumeItem{Rebuilt the UWClassmate website using \textbf{Next.js}, \textbf{TailwindCSS}, \textbf{shadcn-ui} and \textbf{drizzle-orm}, resulting in a more user-friendly and responsive design, currently driving 400k requests per month.}
        \resumeItem{Led a team of around 10 individuals, ensuring successful project completion, enhancing team collaboration, and promoting professional growth}
      \resumeItemListEnd

  \resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
  \resumeSubHeadingListStart

    % \resumeProjectHeading
    %   {\textbf{WebGem - Web Application} \href{https://webgem.club/}{\faLink}}{Nov 2023 -- Present}
    %   \resumeItemListStart
    %     \resumeItem{Scraped 1000+ portfolio website data from multiple sources, stored them in a PostgreSQL database, and set up data automation pipeline using Selenium for detecting non-responding websites and taking screenshots.}
    %     \resumeItem{Developed a responsive and engaging web application using Next.js, TailwindCSS, shadcn-ui, and TypeScript, incorporating latest Next.js and React features such as React Server Components and Server Actions.}
    %     \resumeItem{Optimized image performance by setting up an AWS S3 bucket for hosting portfolio website screenshots and AWS CloudFront as a CDN, resulting in faster image loading times and reduced S3 bucket load.}
    %   \resumeItemListEnd


        \resumeProjectHeading
      {\textbf{Husky Search - Web Application} \href{https://huskysearch.fyi/}{\faLink}}{Aug 2025 -- Present}
      \resumeItemListStart
        \resumeItem{Husky Search is a course explorer \& planning tool for UW students and faculty. It integrates data from multiple UW course data sources and provides a next-level UX, decreasing student\'s course planning efficiency}
        \resumeItem{Set up cron jobs for syncing the latest course registration data from UW, removing the need for manual data ops}
        \resumeItem{Developed a course prereq map canvas using \textbf{ReactFlow}, allowing students visualize the relationships between courses with ease}
      \resumeItemListEnd



        \resumeProjectHeading
      {\textbf{Napsis - Web Application} \href{https://napsislearn.com/}{\faLink}}{Apr 2025 -- Jul 2025}
      \resumeItemListStart
        \resumeItem{Napsis is a AI-powered learning platform/companion for college students with a deep integration of Canvas LMS}
        \resumeItem{Napsis extracts course data from students' Canvas account and generates structured course information and study materials using LLMs.}
        \resumeItem{It's built with Next.js, deployed on Vercel, with a task queue implementation using a WebSocket server and worker in Node.js and Redis as the task queue.}
      \resumeItemListEnd
      
    \resumeProjectHeading
      {\textbf{Toural - Web Application} \href{https://touralsports.com/}{\faLink}}{Jun 2024 -- Sep 2024}
      \resumeItemListStart
        \resumeItem{Conceptualized, designed, and developed a sports tournament management system using \textbf{Next.js} and \textbf{Vercel}, significantly surpassing the UX of existing solutions such as tournamentsoftware.com, resulting in a smoother tournament experience for both tournament organizers and players.}
        \resumeItem{Conducted 3 interviews of nearby badminton clubs and tournament organizers as well as a dozen badminton players, gathering valuable  insights and user pain points}
      \resumeItemListEnd
    
  \resumeSubHeadingListEnd
    %
    %-----------PROGRAMMING SKILLS-----------
    \section{Skills}
    \begin{itemize}[leftmargin=0.15in, label={}]
        \small{\item{
        \textbf{Languages}{: JavaScript, TypeScript, Java, Python, Go, SQL } \\
        \textbf{Frameworks}{: React, Next.js, Fastify, Express.js, FastAPI, shadcn-ui, TailwindCSS, Celery, RabbitMQ} \\
        \textbf{Database}{: MySQL, PostgreSQL, Redis, Neo4j, Convex} \\
        \textbf{Developer Tools}{: Git, Docker, Cursor, Neovim, Claude Code, Codex, Railway, Vercel, Cloudflare, AWS, Google Cloud Platform, Vim} \\
        }}
    \end{itemize}

    
%-------------------------------------------
\end{document}

