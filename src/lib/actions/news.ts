'use server';

import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { getUser } from '@/lib/actions/auth';
import { createAdminClient } from '@/lib/appwrite/client';
import {
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  type NewsArticle,
} from '@/lib/cms/news';

async function requireAdminUser() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

function revalidateNews() {
  revalidatePath('/');
  revalidatePath('/admin/news');
}

export async function createNewsArticleAction(
  data: Omit<NewsArticle, 'id'>
): Promise<NewsArticle> {
  await requireAdminUser();
  const article = await createNewsArticle(data);
  revalidateNews();
  return article;
}

export async function updateNewsArticleAction(
  id: string,
  data: Omit<NewsArticle, 'id'>
): Promise<NewsArticle> {
  await requireAdminUser();
  const article = await updateNewsArticle(id, data);
  revalidateNews();
  return article;
}

export async function deleteNewsArticleAction(id: string): Promise<void> {
  await requireAdminUser();
  await deleteNewsArticle(id);
  revalidateNews();
}

export async function uploadNewsImageAction(
  formData: FormData
): Promise<{ fileId: string; src: string; alt: string }[]> {
  await requireAdminUser();

  const files = formData.getAll('files').filter((file): file is File => file instanceof File);
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (files.length === 0) throw new Error('At least one file is required');
  if (!bucketId || !endpoint || !projectId) throw new Error('Appwrite storage config is missing');

  const { storage } = await createAdminClient();

  return Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const inputFile = InputFile.fromBuffer(Buffer.from(arrayBuffer), file.name);
      const uploaded = await storage.createFile({
        bucketId,
        fileId: ID.unique(),
        file: inputFile,
      });
      return {
        fileId: uploaded.$id,
        src: `${endpoint}/storage/buckets/${bucketId}/files/${uploaded.$id}/view?project=${projectId}`,
        alt: file.name,
      };
    })
  );
}
