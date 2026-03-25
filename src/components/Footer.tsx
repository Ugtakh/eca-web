import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Linear Single-Row Pattern */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + links */}
          <div className="flex items-center gap-8 flex-wrap justify-center sm:justify-start">
            <Link href="/" className="flex items-center gap-2">
              <AppLogo size={70} />
              {/* <span className="font-display font-700 text-sm text-foreground">
                Electra<span className="text-primary">Guard</span>
              </span> */}
            </Link>
            <nav className="flex items-center gap-5">
              {[
                { label: 'Үйлчилгээ', href: '#services' },
                { label: 'Төслүүд', href: '#projects' },
                { label: 'Баг', href: '#team' },
                { label: 'Мэдээ', href: '#news' },
                { label: 'Холбоо барих', href: '#contact' },
              ]?.map((link) => (
                <a
                  key={link?.href}
                  href={link?.href}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  {link?.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">
            {/* Social icons */}
            {[
              {
                label: 'Facebook',
                icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
              },
              // {
              //   label: 'LinkedIn',
              //   icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
              // },
            ]?.map((social) => (
              <a
                key={social?.label}
                href="https://facebook.com"
                target="_blank"
                aria-label={social?.label}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-surface-3 text-muted hover:text-foreground transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={social?.icon} />
                </svg>
              </a>
            ))}
            <span className="text-sm text-muted-2">
              © 2026 ECA Engineering ·{' '}
              <a href="#" className="hover:text-foreground transition-colors">
                Бүх эрх хуулиар хамгаалагдсан
              </a>
              {/* {' · '} */}
              {/* <span href="#" className="hover:text-foreground transition-colors">
                Нөхцөл
              </span> */}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
