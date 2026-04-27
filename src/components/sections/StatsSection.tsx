'use client';

import React, { useEffect, useRef, useState } from 'react';

import { defaultStatsSectionContent, type StatItem, type StatsSectionContent } from '@/lib/cms/stats-section';

interface StatsSectionProps {
  content: StatsSectionContent;
}

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [target, duration, started]);

  return count;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(stat.value, 1800 + index * 100, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal-up card-hover rounded-xl border border-white/5 bg-surface p-6"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-1 font-display text-4xl font-900" style={{ color: stat.color }}>
        {count}
        {stat.suffix}
      </div>
      <div className="mb-1 text-base font-600 text-foreground">{stat.label}</div>
      <div className="text-xs text-muted-2">{stat.sublabel}</div>
    </div>
  );
}

export default function StatsSection({ content }: StatsSectionProps) {
  const stats = content.stats.length > 0 ? content.stats : defaultStatsSectionContent.stats;

  return (
    <section className="section-pad relative" id="stats">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal-up mb-14 text-center">
          <div className="tag-badge mb-4 inline-flex">Тоо баримт</div>
          <h2 className="font-display text-4xl font-800 tracking-tight text-foreground md:text-5xl">
            Тоо баримтаар ярьдаг
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            10+ жилийн туршид хуримтлуулсан туршлага, дууссан төслүүд болон итгэлт хэрэглэгчид
          </p>
        </div>

        <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
