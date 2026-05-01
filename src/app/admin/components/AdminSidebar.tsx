'use client';

import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const navItems: Array<{ label: string; href: string; icon: React.ReactNode; badge?: number }> = [
  {
    label: 'Хяналтын самбар',
    href: '/admin',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Нүүр хэсэг',
    href: '/admin/herosection',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3l2.7 5.47L21 9.39l-4.5 4.38 1.06 6.22L12 17.27 6.44 20l1.06-6.22L3 9.39l6.3-.92L12 3z" />
      </svg>
    ),
  },
  {
    label: 'Cтатистик баримт',
    href: '/admin/stats',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3v18h18" />
        <rect x="7" y="12" width="3" height="6" />
        <rect x="12" y="9" width="3" height="9" />
        <rect x="17" y="6" width="3" height="12" />
      </svg>
    ),
  },
  {
    label: 'Үйлчилгээ',
    href: '/admin/services',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    label: 'Төслүүд',
    href: '/admin/projects',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    label: 'Баг',
    href: '/admin/team',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Мэдээнүүд',
    href: '/admin/news',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6z" />
      </svg>
    ),
  },

  {
    label: 'Хүсэлтүүд',
    href: '/admin/requests',
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
  },
  {
    label: 'Тохиргоо',
    href: '/admin/settings',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 1.4 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
];

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background/80">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar flex-shrink-0 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2.5 justify-center rela">
          <AppLogo size={80} />
          {/* {sidebarOpen && (
            <span className="text-sm font-display font-700 text-foreground whitespace-nowrap">
              ECA<span className="text-primary">Guard</span>
            </span>
          )} */}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-secondary/10 text-white'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
                {item.badge && sidebarOpen && (
                  <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs text-white rounded-full bg-primary">
                    {item.badge}
                  </span>
                )}
                {item.badge && !sidebarOpen && (
                  <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/5"></div>

        {/* Collapse toggle */}
        {/* <div className="p-2 border-t border-white/5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {sidebarOpen && <span className="text-sm">Хураах</span>}
          </button>
        </div> */}
      </aside>
    </div>
  );
};

export default AdminSidebar;
