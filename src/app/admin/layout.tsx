import React from 'react';
import { redirect } from 'next/navigation';

import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import { getUser } from '@/lib/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect('/auth');
  }

  const headerUser = {
    id: user.$id,
    name: user.name || 'Admin User',
    email: user.email || '',
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={headerUser} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
