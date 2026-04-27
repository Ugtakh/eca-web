'use client';

import React from 'react';

import {
  defaultProjectsSectionContent,
  type ProjectsSectionContent,
} from '@/lib/cms/projects-section';
import ProjectsSectionClient from './ProjectsSectionClient';

interface ProjectsSectionProps {
  content: ProjectsSectionContent;
}

export default function ProjectsSection({ content }: ProjectsSectionProps) {
  const projects =
    content.projects.length > 0 ? content.projects : defaultProjectsSectionContent.projects;

  return <ProjectsSectionClient projects={projects} />;
}
