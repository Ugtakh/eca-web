'use client';

import Link from 'next/link';
import React from 'react';

const AdminHeader = () => {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-white/5 bg-background/80 backdrop-blur-sm">
      <div>
        <h1 className="text-base font-display font-700 text-foreground">Хяналтын самбар</h1>
        <p className="text-xs text-muted-2">ECA Admin Panel</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/home" className="px-4 py-2 text-sm btn-secondary">
          Вебсайт үзэх
        </Link>
        <button
          onClick={() => {}}
          className="flex items-center justify-center transition-colors border rounded-lg w-9 h-9 bg-surface-2 border-white/5 text-muted hover:text-foreground"
          aria-label="Гарах"
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
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
