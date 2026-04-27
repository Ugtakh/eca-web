import { getStatsSectionContent } from '@/lib/cms/stats-section';

import StatsCmsForm from './StatsCmsForm';

export default async function StatsCmsPage() {
  const content = await getStatsSectionContent();
  return <StatsCmsForm initialStats={content.stats} />;
}
