'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';

const categories = ['Бүгд', 'Галын дохиолол', 'Холбоо систем', 'Автоматжуулалт', 'Зураг төсөл'];

const projects = [
  {
    id: 1,
    title: 'Оффис цогцолбор',
    category: 'Галын дохиолол',
    year: '2023',
    area: '12,400 м²',
    image: 'https://images.unsplash.com/photo-1602917058415-d86121146559',
    imageAlt: 'Орчин үеийн оффис барилгын гадаад байдал — Улаанбаатар',
    tags: ['Галын дохиолол', 'Яаралтай гаралт'],
  },
  {
    id: 2,
    title: 'Худалдааны төв',
    category: 'Холбоо систем',
    year: '2025',
    area: '28,000 м²',
    image: 'https://images.unsplash.com/photo-1603286658321-7efc940586e8',
    imageAlt: 'Том худалдааны төвийн дотоод орчин',
    tags: ['IP камер', 'Холбоо систем', 'BMS'],
  },
  {
    id: 3,
    title: 'Үйлдвэрийн байр',
    category: 'Автоматжуулалт',
    year: '2023',
    area: '45,000 м²',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10fd2a923-1774334171785.png',
    imageAlt: 'Үйлдвэрийн автоматжуулалтын систем',
    tags: ['PLC', 'SCADA', 'Автоматжуулалт'],
  },
  {
    id: 4,
    title: 'Эмнэлгийн галын хамгаалалт',
    category: 'Галын дохиолол',
    year: '2022',
    area: '8,200 м²',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1173a1a84-1772116864140.png',
    imageAlt: 'Эмнэлгийн барилгын гадаад байдал',
    tags: ['Галын дохиолол', 'Спринклер'],
  },
  {
    id: 5,
    title: 'Орон сууцны цогцолборын цахилгаан',
    category: 'Автоматжуулалт',
    year: '2022',
    area: '32,000 м²',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cdee142b-1767354989556.png',
    imageAlt: 'Орчин үеийн орон сууцны цогцолбор',
    tags: ['Цахилгаан', 'Гэрэлтүүлэг', 'BMS'],
  },
  {
    id: 6,
    title: 'Зочид буудлын камерын систем',
    category: 'Зураг төсөл',
    year: '2019',
    area: '15,600 м²',
    image: 'https://images.unsplash.com/photo-1694973283525-2b3840f7c08a',
    imageAlt: 'Зочид буудлын лоббийн орчин',
    tags: ['Интеграци', 'Зураг төсөл', 'Дуусгавар'],
  },
];

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('Бүгд');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered =
    activeCategory === 'Бүгд' ? projects : projects?.filter((p) => p?.category === activeCategory);

  return (
    <section className="section-pad" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal-up">
          <div>
            <div className="tag-badge mb-4 inline-flex">Төслүүд</div>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
              Бидний хийсэн
              <br />
              ажлууд
            </h2>
          </div>
          <a href="#contact" className="btn-secondary self-start md:self-auto">
            Бүх төслүүд
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
          </a>
        </div>

        {/* Filter tabs */}
        {/* <div className="flex flex-wrap gap-2 mb-8 reveal-up delay-100">
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent text-white'
                  : 'bg-surface-2 text-muted hover:text-foreground hover:bg-surface-3 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((project, i) => (
            <div
              key={project?.id}
              className="reveal-up group cursor-pointer"
              style={{ transitionDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredId(project?.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-white/5">
                <AppImage
                  src={project?.image}
                  alt={project?.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 project-overlay" />
                <div
                  className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${
                    hoveredId === project?.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display font-700 text-white text-lg leading-tight mb-1">
                    {project?.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>{project?.year}</span>
                    <span>·</span>
                    <span>{project?.area}</span>
                  </div>
                </div>

                {/* Arrow on hover */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-all duration-300 ${
                    hoveredId === project?.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
