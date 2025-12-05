"use client";

import { memo } from 'react';
import { useResumeStore } from '@/hooks/use-resume';
import { Mail, Phone, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EducationItem, ExperienceItem, ProjectItem } from '@/lib/types/resume';

export const ResumeView = memo(function ResumeView() {
  const { resume } = useResumeStore();

  if (!resume) {
    return null;
  }

  return (
    <Card className="mx-auto max-w-[8.5in] min-h-[11in] p-12 bg-white dark:bg-gray-950 shadow-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {resume.header.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            {resume.header.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>{resume.header.phone}</span>
              </div>
            )}
            {resume.header.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${resume.header.email}`} className="hover:underline">
                  {resume.header.email}
                </a>
              </div>
            )}
            {resume.header.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <a href={resume.header.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {resume.header.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {resume.header.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5" />
                <a href={resume.header.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {resume.header.github && (
              <div className="flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" />
                <a href={resume.header.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Education Section */}
        {resume.education && resume.education.length > 0 && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                Education
              </h2>
              <Separator className="mt-1" />
            </div>
            <div className="space-y-4">
              {resume.education.map((edu: EducationItem) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {edu.school}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        {edu.degree}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.dates}
                      </p>
                    </div>
                  </div>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Relevant Coursework:</span>{' '}
                      {edu.coursework.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {resume.experience && resume.experience.length > 0 && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                Experience
              </h2>
              <Separator className="mt-1" />
            </div>
            <div className="space-y-4">
              {resume.experience.map((exp: ExperienceItem) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic flex items-center gap-2">
                        {exp.company}
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.dates}
                      </p>
                    </div>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {resume.projects && resume.projects.length > 0 && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                Projects
              </h2>
              <Separator className="mt-1" />
            </div>
            <div className="space-y-4">
              {resume.projects.map((project: ProjectItem) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {project.name}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline text-sm font-normal"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {project.dates}
                      </p>
                    </div>
                  </div>
                  {project.bullets && project.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {project.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {resume.skills && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                Technical Skills
              </h2>
              <Separator className="mt-1" />
            </div>
            <div className="space-y-2 text-sm">
              {resume.skills.languages && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                    Languages:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {resume.skills.languages}
                  </span>
                </div>
              )}
              {resume.skills.frameworks && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                    Frameworks:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {resume.skills.frameworks}
                  </span>
                </div>
              )}
              {resume.skills.database && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                    Database:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {resume.skills.database}
                  </span>
                </div>
              )}
              {resume.skills.developerTools && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                    Developer Tools:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {resume.skills.developerTools}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
});
