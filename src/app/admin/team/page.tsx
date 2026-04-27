import { getTeamSectionContent } from '@/lib/cms/team-section';

import TeamCmsForm from './TeamCmsForm';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  let content;
  try {
    content = await getTeamSectionContent();
  } catch (error) {
    console.error('Failed to load team content:', error);
    content = { team: [] };
  }

  return <TeamCmsForm initialMembers={content.team} />;
}
