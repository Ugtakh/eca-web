'use client';

import React, { useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/providers/AuthProvider';
import { getUser } from '@/lib/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user) return null;

  return (
    <AuthProvider user={user}>
      <div className="flex min-h-screen bg-background">
        {/* Main */}
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top bar */}
          <AdminHeader />

          {/* Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
