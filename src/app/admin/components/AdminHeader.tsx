'use client';

import { signOut } from '@/lib/actions/auth';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import React, { useEffect, useRef, useState, useTransition } from 'react';

interface AdminHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const AdminHeader = ({ user }: AdminHeaderProps) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3 border-b border-white/5 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <AppLogo size={44} className="shrink-0" />
        <div>
          <h1 className="text-base font-display font-700 text-foreground">Хяналтын самбар</h1>
          <p className="text-xs text-muted-2">ECA Admin Panel</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" target="_blank" className="px-4 py-2 text-sm btn-secondary">
          Вебсайт үзэх
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="items-center hidden gap-3 px-3 py-2 transition-colors border rounded-xl border-white/5 bg-surface-2 hover:border-white/10 hover:bg-surface-2/80 md:flex"
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-secondary">
              {initials || 'AD'}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
              <p className="text-xs truncate text-muted-2">{user.email || user.id}</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-secondary md:hidden"
            aria-label="Хэрэглэгчийн цэс"
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            {initials || 'AD'}
          </button>

          {isOpen && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-64 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
              {/* <div className="px-3 py-3 border rounded-xl border-white/5 bg-surface-2">
                <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                <p className="text-xs truncate text-muted-2">{user.email || user.id}</p>
              </div> */}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  startTransition(async () => {
                    await signOut();
                  });
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPending}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>{isPending ? 'Гарч байна...' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
