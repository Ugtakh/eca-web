import { getProjectsSectionContent } from '@/lib/cms/projects-section';

import ProjectsCmsForm from './ProjectsCmsForm';

export default async function ProjectsPage() {
  const content = await getProjectsSectionContent().catch(() => ({ projects: [] }));
  return <ProjectsCmsForm initialProjects={content.projects} />;
}
