'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const navLinks = [
  { label: 'Үйлчилгээ', href: '#services' },
  { label: 'Төслүүд', href: '#projects' },
  { label: 'Баг', href: '#team' },
  { label: 'Мэдээ', href: '#news' },
  { label: 'Холбоо барих', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center  group flex-col">
          <AppLogo size={60} />
          {/* <span className="font-display font-800 text-sm tracking-tight text-foreground">ECA</span>
          <span className="text-accent text-sm"> Engineering</span> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <a
              key={link?.href}
              href={link?.href}
              className="px-4 py-2  font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="#contact" className="btn-primary text-sm px-1 py-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Холбоо барих
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </div>
        </button>
      </div>
      {/* Mobile menu */}

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-960 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-surface/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {navLinks?.map((link) => (
            <Link
              key={link?.href}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
            >
              {link?.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-2 justify-center"
          >
            Холбоо барих
          </Link>
        </div>
      </div>
    </header>
  );
}
