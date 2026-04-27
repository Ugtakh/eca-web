import Link from 'next/link';

import AppImage from '@/components/ui/AppImage';
import { type NewsArticle } from '@/lib/cms/news';

const categoryColors: Record<string, string> = {
  'Компанийн мэдээ': '#4ADE80',
  Төсөл: '#E8390E',
  Технологи: '#60A5FA',
  'Хамтын ажиллагаа': '#F5A623',
};

function getColor(category: string) {
  return categoryColors[category] ?? '#4F8EF7';
}

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section className="section-pad" id="news">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal-up">
          <div>
            <div className="tag-badge mb-4 inline-flex">Мэдээ</div>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
              Сүүлийн мэдээ &amp;
              <br />
              нийтлэлүүд
            </h2>
          </div>
        </div>

        {/* Grid — first card is featured (wide) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-[480px] lg:col-span-2 reveal-left">
            <NewsCard article={featured} featured />
          </div>
          {rest.map((article, i) => (
            <div
              key={article.id}
              className={`h-[480px] reveal-up ${i === 2 ? 'lg:col-span-2' : ''}`}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <NewsCard article={article} featured={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ article, featured }: { article: NewsArticle; featured: boolean }) {
  const color = getColor(article.category);
  const dateObj = new Date(article.publishedAt);
  const formatted = dateObj.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/news/${article.id}`}
      className="card-hover h-full rounded-2xl border border-white/5 bg-surface overflow-hidden group cursor-pointer flex flex-col"
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        {article.image ? (
          <AppImage
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-3" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-600 backdrop-blur-sm"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
          >
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-2 mb-3">
          <span>{formatted}</span>
          {article.readTime && (
            <>
              <span>·</span>
              <span>{article.readTime} унших</span>
            </>
          )}
        </div>
        <h3
          className={`font-display font-700 text-foreground mb-2 leading-tight transition-colors ${featured ? 'text-xl' : 'text-base'}`}
        >
          {article.title}
        </h3>
        {featured && article.excerpt && (
          <p className="text-muted text-sm leading-relaxed mb-4">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-1 text-sm text-accent font-600">
          Дэлгэрэнгүй
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
