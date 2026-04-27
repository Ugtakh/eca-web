'use server';

import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { getUser } from '@/lib/actions/auth';
import { createAdminClient } from '@/lib/appwrite/client';
import { createStatItem, updateStatItem, deleteStatItem, type StatItem } from '@/lib/cms/stats-section';

async function requireAdminUser() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
}

function revalidate() {
  revalidatePath('/');
  revalidatePath('/admin/stats');
}

export async function createStatItemAction(data: Omit<StatItem, 'id'>): Promise<StatItem> {
  await requireAdminUser();
  const item = await createStatItem(data);
  revalidate();
  return item;
}

export async function updateStatItemAction(id: string, data: Omit<StatItem, 'id'>): Promise<StatItem> {
  await requireAdminUser();
  const item = await updateStatItem(id, data);
  revalidate();
  return item;
}

export async function deleteStatItemAction(id: string): Promise<void> {
  await requireAdminUser();
  await deleteStatItem(id);
  revalidate();
}
