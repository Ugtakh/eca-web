'use server';

import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { getUser } from '@/lib/actions/auth';
import { createAdminClient } from '@/lib/appwrite/client';
import { createServiceItem, updateServiceItem, deleteServiceItem, type ServiceItem } from '@/lib/cms/services-section';

type UploadResult = { fileId: string; src: string; alt: string };

async function requireAdminUser() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
}

function revalidate() {
  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function createServiceItemAction(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  await requireAdminUser();
  const item = await createServiceItem(data);
  revalidate();
  return item;
}

export async function updateServiceItemAction(id: string, data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  await requireAdminUser();
  const item = await updateServiceItem(id, data);
  revalidate();
  return item;
}

export async function deleteServiceItemAction(id: string): Promise<void> {
  await requireAdminUser();
  await deleteServiceItem(id);
  revalidate();
}

export async function uploadServiceImagesAction(formData: FormData): Promise<UploadResult[]> {
  await requireAdminUser();
  const files = formData.getAll('files').filter((f): f is File => f instanceof File);
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (files.length === 0) throw new Error('At least one file is required');
  if (!bucketId || !endpoint || !projectId) throw new Error('Appwrite storage config is missing');
  const { storage } = await createAdminClient();
  return Promise.all(files.map(async (file) => {
    const buf = Buffer.from(await file.arrayBuffer());
    const uploaded = await storage.createFile({ bucketId, fileId: ID.unique(), file: InputFile.fromBuffer(buf, file.name) });
    return { fileId: uploaded.$id, src: `${endpoint}/storage/buckets/${bucketId}/files/${uploaded.$id}/view?project=${projectId}`, alt: file.name };
  }));
}
