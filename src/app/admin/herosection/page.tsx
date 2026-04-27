import { getHeroSectionContent } from '@/lib/cms/hero-section';

import HeroSectionCmsForm from './HeroSectionCmsForm';

export default async function HeroSectionCmsPage() {
  const content = await getHeroSectionContent();

  return <HeroSectionCmsForm initialContent={content} />;
}
