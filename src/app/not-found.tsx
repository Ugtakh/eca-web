'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router?.push('/');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history?.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="font-bold text-white text-9xl text-opacity-5">404</h1>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-medium text-onBackground">Хуудас олдсонгүй</h2>
        <p className="mb-8 text-onBackground/70">
          Эхлэл хуудсанд буцах эсвэл өмнөх хуудсанд буцах боломжтой.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors duration-200 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Icon name="ArrowLeftIcon" size={16} />
            Өмнөх
          </button>

          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors duration-200 border rounded-lg border-border bg-background text-foreground hover:bg-background/50 hover:text-accent-foreground"
          >
            <Icon name="HomeIcon" size={16} />
            Эхлэл
          </button>
        </div>
      </div>
    </div>
  );
}
