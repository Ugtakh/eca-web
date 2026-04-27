import { getAllNews } from '@/lib/cms/news';

import NewsCmsForm from './NewsCmsForm';

export default async function NewsAdminPage() {
  const articles = await getAllNews();

  return <NewsCmsForm initialArticles={articles} />;
}
