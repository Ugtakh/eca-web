import { getServicesSectionContent } from '@/lib/cms/services-section';

import ServicesCmsForm from './ServicesCmsForm';

export default async function ServicesPage() {
  const content = await getServicesSectionContent();
  return <ServicesCmsForm initialServices={content.services} />;
}
