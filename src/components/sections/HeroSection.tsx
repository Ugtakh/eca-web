'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(232,57,14,', 'rgba(245,166,35,', 'rgba(255,87,51,'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232,57,14,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const parallaxStyle = {
    transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -10}px)`,
    transition: 'transform 0.1s ease-out',
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient noise-overlay"
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 grid-pattern pointer-events-none"
        style={{ backgroundSize: '60px 60px', zIndex: 1 }}
      />

      {/* Atmospheric blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,57,14,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 1,
          ...parallaxStyle,
        }}
      />

      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Tag */}
            {/* <div className="tag-badge mb-6 inline-flex reveal-up">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-status-pulse" />
              Монголын тэргүүлэх компани
            </div> */}

            {/* Headline */}
            <h1 className="font-display font-900 text-foreground leading-[0.92] tracking-tight mb-6 reveal-up delay-100">
              <span className="block text-5xl md:text-6xl lg:text-[70px]">Галын</span>
              <span className="block text-5xl md:text-6xl lg:text-[70px]">дохиолол &amp;</span>
              <span className="block text-5xl md:text-6xl lg:text-[70px] glow-text text-accent">
                Цахилгаан
              </span>
              <span className="block text-5xl md:text-6xl lg:text-[70px]">Автоматжуулалт</span>
            </h1>

            <p className="text-muted text-lg leading-relaxed max-w-lg mb-10 reveal-up delay-200">
              Галын дохиолол, холбоо дохиолол болон цахилгаан автоматжуулалтын зураг зурах болон
              угсралтын цогц үйлчилгээ. Баталгаажсан инженерүүд, найдвартай шийдэл.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12 reveal-up delay-300">
              <Link href="#contact" className="btn-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Үнийн санал авах
              </Link>
              <a href="#projects" className="btn-secondary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Төслүүд үзэх
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 reveal-up delay-400">
              {[
                // { icon: '🔒', text: 'ISO 9001 Сертификат' },
                { icon: '⚡', text: '10+ жилийн туршлага' },
                { icon: '🛡️', text: '50+ дууссан төсөл' },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-white/5 text-sm text-muted"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual card stack */}
          <div className="relative hidden lg:block">
            {/* Main visual card */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/8 float-anim"
              style={{ background: 'var(--surface-2)' }}
            >
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1171d4649-1772595593394.png"
                alt="Цахилгаан угсралтын ажил — инженер хяналтын самбарт ажиллаж байна"
                width={640}
                height={420}
                className="w-full object-cover"
                priority
              />

              {/* Overlay info card */}
              {/* <div
                className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-sm border border-white/10"
                style={{ background: 'rgba(10,11,15,0.85)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted mb-0.5 font-mono">ИДЭВХТЭЙ ТӨСӨЛ</p>
                    <p className="text-sm font-600 text-foreground">
                      Улаанбаатар — Оффис цогцолбор
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 status-dot" />
                    <span className="text-xs text-green-400">Явагдаж байна</span>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Floating stat cards */}
            <div
              className="absolute -top-6 -right-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
              style={{ background: 'rgba(17,19,24,0.9)', transform: 'rotate(3deg)' }}
            >
              <p className="font-display font-800 text-3xl text-accent">50+</p>
              <p className="text-xs text-muted">Дууссан төсөл</p>
            </div>
            <div
              className="absolute -bottom-6 -left-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
              style={{ background: 'rgba(17,19,24,0.9)', transform: 'rotate(-2deg)' }}
            >
              <p className="font-display font-800 text-3xl text-accent">98%</p>
              <p className="text-xs text-muted">Хэрэглэгчийн сэтгэл ханамж</p>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="flex justify-center mt-16 reveal-up delay-600">
          <div className="flex flex-col items-center gap-2 text-muted-2">
            <span className="text-xs font-mono tracking-widest uppercase">Доош гүйлгэх</span>
            <div className="w-px h-12 bg-gradient-to-b from-muted-2 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
