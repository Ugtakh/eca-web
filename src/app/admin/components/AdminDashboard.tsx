'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';

const stats = [
  { label: 'Нийт хүсэлт', value: '47', change: '+12%', color: '#E8390E', icon: '📨' },
  { label: 'Идэвхтэй төсөл', value: '8', change: '+2', color: '#F5A623', icon: '🏗️' },
  { label: 'Энэ сарын хандалт', value: '2,841', change: '+18%', color: '#4ADE80', icon: '👁️' },
  { label: 'Шийдвэрлэсэн', value: '44', change: '93%', color: '#60A5FA', icon: '✅' },
];

const recentInquiries = [
  {
    name: 'Д. Тэмүүлэн',
    company: 'Монгол Барилга ХХК',
    service: 'Галын дохиолол',
    date: '2026-03-23',
    status: 'Шинэ',
  },
  {
    name: 'Б. Сарантуяа',
    company: 'Нийслэлийн Эмнэлэг',
    service: 'Цахилгаан автоматжуулалт',
    date: '2026-03-22',
    status: 'Харилцаж байна',
  },
  {
    name: 'Н. Анхбаяр',
    company: 'ТЭД Холдинг',
    service: 'Зураг төсөл',
    date: '2026-03-21',
    status: 'Дууссан',
  },
  {
    name: 'О. Мөнхзул',
    company: 'Сансар Оффис',
    service: 'Холбоо систем',
    date: '2026-03-20',
    status: 'Харилцаж байна',
  },
];

const statusColors: Record<string, string> = {
  Шинэ: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'Харилцаж байна': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Дууссан: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const projects = [
  {
    title: 'Хан-Уул оффис цогцолбор',
    category: 'Галын дохиолол',
    progress: 78,
    image: 'https://images.unsplash.com/photo-1656646425148-9d0ebb0a778a',
    imageAlt: 'Оффис барилгын гадаад байдал',
  },
  {
    title: 'Баянзүрх худалдааны төв',
    category: 'BMS + Холбоо систем',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1603286658321-7efc940586e8',
    imageAlt: 'Худалдааны төвийн дотоод орчин',
  },
  {
    title: 'Сүхбаатар үйлдвэрийн байр',
    category: 'Автоматжуулалт',
    progress: 92,
    image: 'https://images.unsplash.com/photo-1690542373222-f071d7a97789',
    imageAlt: 'Үйлдвэрийн байрны дотоод орчин',
  },
];

type EditState = {
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  email: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'projects' | 'settings'>(
    'overview'
  );
  const [editState, setEditState] = useState<EditState>({
    heroTitle: 'Галын дохиолол & Цахилгаан Автоматжуулалт',
    heroSubtitle:
      'Галын дохиолол, холбоо дохиолол болон цахилгаан автоматжуулалтын зураг зурах болон угсралтын цогц үйлчилгээ.',
    phone: '+976 7711-2345',
    email: 'info@eca.mn',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Ерөнхий' },
    { id: 'inquiries', label: 'Хүсэлтүүд' },
    { id: 'projects', label: 'Төслүүд' },
    { id: 'settings', label: 'Контент тохиргоо' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 border rounded-xl bg-surface border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-5 border rounded-xl border-white/5 bg-surface">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                    {stat.change}
                  </span>
                </div>
                <p className="mb-1 text-3xl font-display font-800" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent inquiries preview */}
          <div className="p-5 border rounded-xl border-white/5 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-foreground">Сүүлийн хүсэлтүүд</h3>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="text-xs transition-colors text-primary hover:text-primary-light"
              >
                Бүгдийг харах →
              </button>
            </div>
            <div className="space-y-2">
              {recentInquiries.slice(0, 3).map((inq) => (
                <div
                  key={inq.name}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-surface-2 border-white/5"
                >
                  <div className="flex items-center justify-center w-8 h-8 text-sm rounded-lg bg-surface-3 font-700 text-primary">
                    {inq.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate font-600 text-foreground">{inq.name}</p>
                    <p className="text-xs truncate text-muted">
                      {inq.company} · {inq.service}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md border font-medium ${statusColors[inq.status]}`}
                  >
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active projects */}
          <div className="p-5 border rounded-xl border-white/5 bg-surface">
            <h3 className="mb-4 font-display font-700 text-foreground">Идэвхтэй төслүүд</h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.title} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg">
                    <AppImage
                      src={proj.image}
                      alt={proj.imageAlt}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm truncate font-600 text-foreground">{proj.title}</p>
                      <span className="ml-2 font-mono text-xs text-primary">{proj.progress}%</span>
                    </div>
                    <p className="text-xs text-muted mb-1.5">{proj.category}</p>
                    <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full bg-primary"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="p-5 border rounded-xl border-white/5 bg-surface">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-700 text-foreground">Бүх хүсэлтүүд</h3>
            <span className="tag-badge">47 нийт</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Нэр', 'Байгууллага', 'Үйлчилгээ', 'Огноо', 'Төлөв', 'Үйлдэл'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3 font-mono text-xs tracking-wider text-left uppercase text-muted-2"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentInquiries.map((inq) => (
                  <tr key={inq.name} className="transition-colors hover:bg-surface-2">
                    <td className="px-3 py-3 font-600 text-foreground">{inq.name}</td>
                    <td className="px-3 py-3 text-muted">{inq.company}</td>
                    <td className="px-3 py-3 text-muted">{inq.service}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted">{inq.date}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md border font-medium ${statusColors[inq.status]}`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-xs transition-colors text-primary hover:text-primary-light">
                        Харах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-700 text-foreground">Төслүүд удирдах</h3>
            <button className="py-2 text-sm btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Шинэ төсөл
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <div
                key={proj.title}
                className="p-4 border rounded-xl border-white/5 bg-surface group"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
                  <AppImage src={proj.image} alt={proj.imageAlt} fill className="object-cover" />
                </div>
                <h4 className="mb-1 text-sm font-600 text-foreground">{proj.title}</h4>
                <p className="mb-3 text-xs text-muted">{proj.category}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-primary">{proj.progress}%</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-lg bg-surface-2 border border-white/5 text-xs text-muted hover:text-foreground transition-colors">
                    Засах
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors">
                    Харах
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-5">
          <div className="p-6 border rounded-xl border-white/5 bg-surface">
            <h3 className="mb-5 font-display font-700 text-foreground">Hero хэсгийн контент</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                  Гарчиг
                </label>
                <input
                  type="text"
                  value={editState.heroTitle}
                  onChange={(e) => setEditState((p) => ({ ...p, heroTitle: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                  Дэд гарчиг
                </label>
                <textarea
                  value={editState.heroSubtitle}
                  onChange={(e) => setEditState((p) => ({ ...p, heroSubtitle: e.target.value }))}
                  rows={3}
                  className="resize-none input-field"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-xl border-white/5 bg-surface">
            <h3 className="mb-5 font-display font-700 text-foreground">Холбоо барих мэдээлэл</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                  Утас
                </label>
                <input
                  type="text"
                  value={editState.phone}
                  onChange={(e) => setEditState((p) => ({ ...p, phone: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-2 mb-1.5 font-mono uppercase tracking-wider">
                  Имэйл
                </label>
                <input
                  type="email"
                  value={editState.email}
                  onChange={(e) => setEditState((p) => ({ ...p, email: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary">
            {saved ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Хадгалагдлаа!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Хадгалах
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
