import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Судалгаа & Зөвлөгөө',
    description:
      'Барилгын онцлог, хэрэгцээ шаардлагыг нарийвчлан судалж, оновчтой шийдлийг санал болгоно.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    color: '#E8390E',
  },
  {
    number: '02',
    title: 'Инженерийн зураг',
    description:
      'Олон улсын стандартад нийцсэн техникийн зураг, тооцооны баримт бичгийг боловсруулна.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    color: '#F5A623',
  },
  {
    number: '03',
    title: 'Тоног төхөөрөмж',
    description: 'Баталгаат брэндийн өндөр чанарын тоног төхөөрөмжийг нийлүүлэх, нөөцлөх.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: '#60A5FA',
  },
  {
    number: '04',
    title: 'Угсралт & Суурилуулалт',
    description: 'Мэргэжилтэн инженерүүдийн багаар чанарын хяналттай угсралтын ажил гүйцэтгэнэ.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    color: '#4ADE80',
  },
  {
    number: '05',
    title: 'Тест & Хүлээлгэж өгөх',
    description: 'Системийн бүрэн туршилт, тохируулга, хэрэглэгчийн сургалт болон баримт бичиг.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: '#A78BFA',
  },
  {
    number: '06',
    title: 'Засвар & Дэмжлэг',
    description: 'Дуусгасны дараах 24/7 техникийн дэмжлэг, тогтмол засвар үйлчилгээ.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    color: '#E8390E',
  },
];

export default function ProcessSection() {
  return (
    <section className="section-pad relative overflow-hidden" id="process">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(232,57,14,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal-up">
          <div className="tag-badge mb-4 inline-flex">Үйл явц</div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
            Хэрхэн ажилладаг вэ
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            Зургаан алхмаас бүрдсэн системтэй үйл явц — судалгаанаас хүлээлгэж өгөх хүртэл
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps?.map((step, i) => (
            <div
              key={step?.number}
              className="relative p-6 rounded-2xl border border-white/5 bg-surface group card-hover reveal-up"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Giant number */}
              <span
                className="absolute top-4 right-4 font-display font-900 text-7xl leading-none select-none pointer-events-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity"
                style={{ color: step?.color }}
              >
                {step?.number}
              </span>

              {/* Icon */}
              <div
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `${step?.color}18`,
                  color: step?.color,
                  border: `1px solid ${step?.color}25`,
                }}
              >
                {step?.icon}
              </div>

              <h3 className="font-display font-700 text-foreground text-lg mb-2 relative z-10">
                {step?.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed relative z-10">
                {step?.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${step?.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
