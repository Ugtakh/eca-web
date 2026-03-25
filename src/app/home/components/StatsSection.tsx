'use client';

import React, { useEffect, useRef, useState } from 'react';

const stats = [
  {
    value: 50,
    suffix: '+',
    label: 'Дууссан төсөл',
    sublabel: '2015 оноос хойш',
    color: 'var(--paccent)',
  },
  {
    value: 10,
    suffix: '+',
    label: 'Жилийн туршлага',
    sublabel: 'Салбарт ажилласан',
    color: 'var(--accent)',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Сэтгэл ханамж',
    sublabel: 'Хэрэглэгчийн үнэлгээ',
    color: '#4ADE80',
  },
  {
    value: 10,
    suffix: '+',
    label: 'Мэргэжилтэн',
    sublabel: 'Баталгаажсан инженер',
    color: '#60A5FA',
  },
  // {
  //   value: 24,
  //   suffix: '/7',
  //   label: 'Дэмжлэг үйлчилгээ',
  //   sublabel: 'Яаралтай дуудлага',
  //   color: 'var(--primary-light)',
  // },
  // {
  //   value: 12,
  //   suffix: '+',
  //   label: 'Аймаг, хот',
  //   sublabel: 'Үйл ажиллагааны хүрээ',
  //   color: 'var(--accent)',
  // },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);
  return count;
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(stat.value, 1800 + index * 100, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal-up card-hover p-6 rounded-xl border border-white/5 bg-surface"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="font-display font-900 text-4xl mb-1" style={{ color: stat.color }}>
        {count}
        {stat.suffix}
      </div>
      <div className="font-600 text-foreground text-base mb-1">{stat.label}</div>
      <div className="text-xs text-muted-2">{stat.sublabel}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="section-pad relative" id="stats">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14 reveal-up">
          <div className="tag-badge mb-4 inline-flex">Тоо баримт</div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
            Тоо баримтаар ярьдаг
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            10+ жилийн туршид хуримтлуулсан туршлага, дууссан төслүүд болон итгэлт хэрэглэгчид
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Certifications row */}
        {/* <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-surface reveal-up delay-300">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs text-muted-2 uppercase tracking-widest font-mono mb-1">
                Баталгаажилт &amp; Гэрчилгээ
              </p>
              <p className="text-foreground font-600">
                Олон улсын стандартад нийцсэн үйл ажиллагаа
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['ISO 9001:2015', 'IEC 60839', 'NFPA 72', 'EN 54', 'MNS 5900'].map((cert) => (
                <span
                  key={cert}
                  className="px-3 py-1.5 rounded-lg bg-surface-2 border border-white/5 text-sm font-mono text-muted"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
