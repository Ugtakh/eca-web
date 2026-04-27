import { notFound } from 'next/navigation';
import Link from 'next/link';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AppImage from '@/components/ui/AppImage';
import { getNewsArticle } from '@/lib/cms/news';

export const dynamic = 'force-dynamic';

const categoryColors: Record<string, string> = {
  'Компанийн мэдээ': '#4ADE80',
  Төсөл: '#E8390E',
  Технологи: '#60A5FA',
  'Хамтын ажиллагаа': '#F5A623',
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsArticle(id).catch(() => null);

  if (!article) notFound();

  const color = categoryColors[article.category] ?? '#4F8EF7';
  const formatted = new Date(article.publishedAt).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back */}
        <Link
          href="/#news"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Буцах
        </Link>

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-600"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
          >
            {article.category}
          </span>
          <span className="text-sm text-muted">{formatted}</span>
          {article.readTime && (
            <span className="text-sm text-muted">· {article.readTime} унших</span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-800 text-3xl md:text-4xl text-foreground leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-muted leading-relaxed mb-8 border-l-2 border-accent/40 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Cover image */}
        {article.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 border border-white/5">
            <AppImage
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        {article.content ? (
          <div
            className="prose prose-invert prose-base max-w-none
              prose-headings:font-display prose-headings:font-700 prose-headings:text-foreground
              prose-p:text-muted prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-blockquote:border-accent/40 prose-blockquote:text-muted
              prose-ul:text-muted prose-ol:text-muted
              prose-li:marker:text-accent
              prose-img:rounded-xl prose-img:border prose-img:border-white/10
              prose-hr:border-white/10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
