'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { type ProjectItem } from '@/lib/cms/projects-section';

const categories = ['Бүгд', 'Галын дохиолол', 'Холбоо систем', 'Автоматжуулалт', 'Зураг төсөл'];

interface ProjectsSectionClientProps {
  projects: ProjectItem[];
}

export default function ProjectsSectionClient({ projects }: ProjectsSectionClientProps) {
  const [activeCategory, setActiveCategory] = useState('Бүгд');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered =
    projects && projects.length > 0
      ? activeCategory === 'Бүгд'
        ? projects
        : projects.filter((p) => p?.category === activeCategory)
      : [];

  return (
    <section className="section-pad" id="projects">
      <div className="px-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 mb-10 md:flex-row md:items-end reveal-up">
          <div>
            <div className="inline-flex mb-4 tag-badge">Төслүүд</div>
            <h2 className="text-4xl tracking-tight font-display font-800 md:text-5xl text-foreground">
              Бидний хийсэн
              <br />
              ажлууд
            </h2>
          </div>
          <a href="#contact" className="self-start btn-secondary md:self-auto">
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
        {/* <div className="flex flex-wrap gap-2 mb-8 delay-100 reveal-up">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((project, i) => (
            <div
              key={project?.title || `project-${i}`}
              className="cursor-pointer reveal-up group"
              style={{ transitionDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredId(i)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-white/5">
                <AppImage
                  src={project?.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={project?.imageAlt || 'Project image'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 project-overlay" />
                <div
                  className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${
                    hoveredId === i ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project?.tags?.map((tag, tagIndex) => (
                      <span
                        key={`${tag}-${tagIndex}`}
                        className="text-xs px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-1 text-lg leading-tight text-white font-display font-700">
                    {project?.title || 'Untitled Project'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>{project?.year || 'N/A'}</span>
                    <span>·</span>
                    <span>{project?.area || 'N/A'}</span>
                  </div>
                </div>

                {/* Arrow on hover */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-all duration-300 ${
                    hoveredId === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
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
