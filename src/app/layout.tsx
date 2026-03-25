import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ECA Engineering — Fire Alarm & Electrical Automation Specialists',
  description:
    'ECA Engineering  designs and installs fire alarm, communication alarm, and electrical automation systems for buildings across Mongolia. Certified engineers, end-to-end service.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'ECA Engineering  — Fire & Electrical Automation',
    description:
      'Certified fire alarm and electrical automation design & installation in Mongolia.',
    images: [{ url: '/assets/images/app_logo.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
