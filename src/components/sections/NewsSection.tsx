import React from 'react';
import AppImage from '@/components/ui/AppImage';

const news = [
  {
    id: 1,
    title: 'И СИ ЭЙ Инженеринг сертификатаа шинэчиллээ',
    excerpt:
      'Манай компани стандартын менежментийн шаардлагыг бүрэн хангасан баталгааг дахин авлаа.',
    date: '2026-03-15',
    category: 'Компанийн мэдээ',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f02de8dd-1766471593137.png',
    imageAlt: 'Чанарын стандартын',
    readTime: '3 мин',
  },
  {
    id: 2,
    title: 'Шинэ оффис цогцолборын галын систем',
    excerpt:
      'Бид 1,000 м² талбай бүхий орчин үеийн оффис цогцолборт зориулсан интеграцчилсан галын хамгаалалтын системийг амжилттай угсарлаа.',
    date: '2025-02-28',
    category: 'Төсөл',
    image: 'https://images.unsplash.com/photo-1500565468401-c273cdd7a5ef',
    imageAlt: 'архитектур',
    readTime: '5 мин',
  },
  {
    id: 3,
    title: 'Цахилгаан автоматжуулалтын шинэ технологи',
    excerpt:
      'Бид шинэ үеийн PLC болон SCADA системийн сургалтыг амжилттай дуусгасан мэргэжилтнүүдийн талаар.',
    date: '2026-02-10',
    category: 'Технологи',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_148181f81-1774334173085.png',
    imageAlt: 'Цахилгаан хяналтын самбар — орчин үеийн технологи',
    readTime: '4 мин',
  },
  {
    id: 4,
    title: 'БНХАУ-ын компанитай хамтын ажиллагааны гэрээ зурлаа',
    excerpt:
      'Ухаалаг барилгын шийдлүүдийг Монголд нэвтрүүлэх чиглэлээр хятадын компанитай стратегийн хамтын ажиллагааны гэрээ байгуулав.',
    date: '2026-01-20',
    category: 'Хамтын ажиллагаа',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f289f655-1773189185175.png',
    imageAlt: 'хамтын ажиллагааны гэрээ',
    readTime: '3 мин',
  },
];

const categoryColors: Record<string, string> = {
  'Компанийн мэдээ': '#4ADE80',
  Төсөл: '#E8390E',
  Технологи: '#60A5FA',
  'Хамтын ажиллагаа': '#F5A623',
};

export default function NewsSection() {
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
          <button className="btn-secondary self-start md:self-auto">
            Бүх мэдээ
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid — first card is featured (wide) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured */}
          <div className="h-[480px] lg:col-span-2 reveal-left">
            <NewsCard article={news[0]} featured />
          </div>
          {/* Regular cards */}
          {news.slice(1).map((article, i) => (
            <div
              key={article.id}
              className={`h-[480px] reveal-up ${i == 2 ? 'lg:col-span-2' : ''}`}
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

function NewsCard({ article, featured }: { article: (typeof news)[0]; featured: boolean }) {
  const color = categoryColors[article.category] || '#E8390E';
  const dateObj = new Date(article.date);
  const formatted = dateObj.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card-hover h-full rounded-2xl border border-white/5 bg-surface overflow-hidden group cursor-pointer flex flex-col">
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        <AppImage
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

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

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-2 mb-3">
          <span>{formatted}</span>
          <span>·</span>
          <span>{article.readTime} унших</span>
        </div>
        <h3
          className={`font-display font-700 text-foreground mb-2 leading-tight  transition-colors ${featured ? 'text-xl' : 'text-base'}`}
        >
          {article.title}
        </h3>
        {featured && <p className="text-muted text-sm leading-relaxed mb-4">{article.excerpt}</p>}
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
    </div>
  );
}
