'use client';

import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    quote:
      'ElectraGuard манай 45,000 м² үйлдвэрийн барилгад PLC болон SCADA системийг маш мэргэжлийн түвшинд угсарсан. Угсралтын дараах дэмжлэг ч маш сайн байна.',
    author: 'Д. Ганзориг',
    title: 'Техникийн захирал',
    company: 'МонгГэзэр Үйлдвэр ХХК',
    result: 'Энергийн хэмнэлт 32%',
    resultDetail: 'Автоматжуулалтын дараах',
    category: 'Автоматжуулалт',
  },
  {
    id: 2,
    quote:
      'Худалдааны төвийн галын хамгаалалтын системийг стандартад нийцүүлэн угсарсан. Зураг зурахаас хүлээлгэж өгөх хүртэл бүх шатанд хариуцлагатай ажиллалаа.',
    author: 'Н. Батсайхан',
    title: 'Барилгын менежер',
    company: 'Номин Холдинг',
    result: '100% стандарт нийцэл',
    resultDetail: 'Галын хяналтын байгууллагаас',
    category: 'Галын дохиолол',
  },
  {
    id: 3,
    quote:
      'Эмнэлгийн барилгад тавигдах өндөр шаардлагад нийцсэн галын дохиоллын систем угсарсан. Мэргэжилтнүүд нь маш туршлагатай, ажлын чанар өндөр байлаа.',
    author: 'О. Цэрэндулам',
    title: 'Ахлах менежер',
    company: 'Гэрэл Эмнэлгийн Цогцолбор',
    result: '0 алдаа',
    resultDetail: '2 жилийн ажиллагааны туршид',
    category: 'Галын дохиолол',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = testimonials?.[active];

  return (
    <section className="section-pad relative overflow-hidden" id="testimonials">
      {/* BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(232,57,14,0.03) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal-up">
          <div className="tag-badge mb-4 inline-flex">Хэрэглэгчдийн сэтгэгдэл</div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
            Хэрэглэгчид юу хэлдэг вэ
          </h2>
        </div>

        {/* Main testimonial card */}
        <div className="reveal-up delay-100">
          <div className="p-8 md:p-12 rounded-3xl border border-white/8 bg-surface relative overflow-hidden">
            {/* Quote mark */}
            <div className="absolute top-6 left-8 font-display font-900 text-[120px] leading-none text-primary opacity-[0.06] select-none">
              "
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
              {/* Quote */}
              <div className="lg:col-span-7 relative z-10">
                <p className="text-2xl md:text-3xl text-foreground font-400 leading-relaxed mb-10">
                  {t?.quote}
                </p>
                <div>
                  <p className="font-display font-700 text-foreground text-lg">{t?.author}</p>
                  <p className="text-muted text-sm">{t?.title}</p>
                  <p className="text-accent text-sm font-600 mt-0.5">{t?.company}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block lg:col-span-1 self-stretch">
                <div className="w-px h-full bg-white/5" />
              </div>

              {/* Result + Nav */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-8">
                {/* Result metric */}
                <div className="p-6 rounded-2xl bg-surface-2 border border-white/5">
                  <p className="font-display font-900 text-4xl text-accent mb-1">{t?.result}</p>
                  <p className="text-muted text-sm">{t?.resultDetail}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 font-mono">
                      {t?.category}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div>
                  <p className="text-xs text-muted-2 font-mono uppercase tracking-widest mb-4">
                    {active + 1} / {testimonials?.length}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {testimonials?.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === active ? 'bg-primary w-8' : 'bg-surface-3 w-4 hover:bg-muted-2'
                        }`}
                        aria-label={`Testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setActive((active - 1 + testimonials?.length) % testimonials?.length)
                      }
                      className="w-10 h-10 rounded-xl bg-surface-2 border border-white/5 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActive((active + 1) % testimonials?.length)}
                      className="w-10 h-10 rounded-xl bg-surface-2 border border-white/5 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
