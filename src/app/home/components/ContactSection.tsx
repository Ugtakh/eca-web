'use client';

import React, { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
};

const services = [
  'Галын дохиолол',
  'Холбоо дохиолол',
  'Цахилгаан автоматжуулалт',
  'Зураг төсөл',
  'Засвар үйлчилгээ',
  'Бусад',
];

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock submit — replace with actual API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="section-pad relative overflow-hidden h-full" id="contact">
      {/* BG glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,57,14,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal-up">
          <div className="tag-badge mb-4 inline-flex">Холбоо барих</div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
            Үнийн санал авах
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            Төслийнхөө талаар санаагаа бидэнтэй хуваалцах
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 h-full">
          {/* Info panel */}
          <div className="lg:col-span-2 reveal-left">
            <div className="h-full p-7 rounded-2xl border border-white/5 bg-surface flex flex-col gap-8">
              <div>
                <h3 className="font-display font-700 text-foreground text-xl mb-2">
                  Бидэнтэй холбоо барих
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Ажлын өдрүүдэд 09:00–18:00 цагт ажиллана.
                </p>
              </div>

              {/* Contact info */}
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                    label: 'Утас',
                    value: '+976 7711-2345',
                    sub: 'Яаралтай: +976 9911-2345',
                  },
                  {
                    icon: (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: 'Имэйл',
                    value: 'info@electroguard.mn',
                    sub: '',
                  },
                  {
                    icon: (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: 'Хаяг',
                    value: 'Улаанбаатар хот, Сүхбаатар дүүрэг',
                    sub: 'Бизнес тауэр, 8 давхар',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-2 border border-white/5 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-2 mb-0.5">{item.label}</p>
                      <p className="text-sm font-600 text-foreground">{item.value}</p>
                      {item.sub && <p className="text-xs text-muted">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Working hours */}
              <div className="p-4 rounded-xl bg-surface-2 border border-white/5">
                <p className="text-xs font-mono text-muted-2 uppercase tracking-widest mb-3">
                  Ажлын цаг
                </p>
                <div className="space-y-1.5">
                  {[
                    { day: 'Даваа — Баасан', hours: '09:00 — 18:00' },
                    { day: 'Бямба', hours: 'Амарна' },
                    { day: 'Ням', hours: 'Амарна' },
                  ].map((r) => (
                    <div key={r.day} className="flex justify-between text-sm">
                      <span className="text-muted">{r.day}</span>
                      <span className="text-foreground font-500">{r.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency CTA */}
              {/* <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent status-dot" />
                <div>
                  <p className="text-sm font-600 text-foreground">Яаралтай дуудлага</p>
                  <p className="text-xs text-muted">24/7 техникийн дэмжлэг</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 reveal-right h-full">
            <div className="p-7 rounded-2xl border border-white/5 bg-surface h-full">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display font-700 text-foreground text-xl mb-2">
                    Амжилттай илгээлээ!
                  </h3>
                  <p className="text-muted text-sm max-w-xs">
                    Таны хүсэлтийг хүлээн авлаа. Манай мэргэжилтэн иргээд таньтай холбогдох болно.
                  </p>
                  <button
                    onClick={() => {
                      // sendEmail()
                      setSubmitted(false);
                      setForm(initialForm);
                    }}
                    className="btn-secondary mt-6"
                  >
                    Дахин илгээх
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                        Нэр *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Таны нэр"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                        Утас *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+976 XXXX-XXXX"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                        Имэйл *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@company.mn"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                        Байгууллага
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Компанийн нэр"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                      Үйлчилгээний төрөл *
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Сонгох...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                      Дэлгэрэнгүй мэдээлэл *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Барилгын талбай, байршил болон шаардлагаа дэлгэрэнгүй тайлбарлана уу..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Илгээж байна...
                      </>
                    ) : (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Хүсэлт илгээх
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
