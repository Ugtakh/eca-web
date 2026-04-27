import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  readTime: string;
};

type NewsRow = Models.Row & {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: string;
  readTime?: string;
};

const NEWS_TABLE_ID =
  process.env.APPWRITE_NEWS_TABLE_ID ??
  process.env.NEXT_PUBLIC_APPWRITE_NEWS_TABLE_ID ??
  'newsCms';

function getDbId() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return databaseId;
}

function normalizeArticle(row: NewsRow): NewsArticle {
  return {
    id: row.$id,
    title: String(row.title ?? '').trim(),
    excerpt: String(row.excerpt ?? '').trim(),
    content: String(row.content ?? '').trim(),
    category: String(row.category ?? '').trim(),
    image: String(row.image ?? '').trim(),
    imageAlt: String(row.imageAlt ?? '').trim(),
    publishedAt: String(row.publishedAt ?? new Date().toISOString().slice(0, 10)).trim(),
    readTime: String(row.readTime ?? '').trim(),
  };
}

async function ensureNewsTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();

  try {
    await tables.getTable({ databaseId, tableId: NEWS_TABLE_ID });
    return;
  } catch {}

  try {
    await tables.createTable({
      databaseId,
      tableId: NEWS_TABLE_ID,
      name: 'News CMS',
      rowSecurity: false,
      enabled: true,
      columns: [
        { key: 'title', type: 'string', size: 500, required: false, default: '' },
        { key: 'excerpt', type: 'string', size: 1000, required: false, default: '' },
        { key: 'content', type: 'string', size: 32768, required: false, default: '' },
        { key: 'category', type: 'string', size: 200, required: false, default: '' },
        { key: 'image', type: 'string', size: 1000, required: false, default: '' },
        { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
        { key: 'publishedAt', type: 'string', size: 30, required: false, default: '' },
        { key: 'readTime', type: 'string', size: 50, required: false, default: '' },
      ],
    });
  } catch {
    await tables.getTable({ databaseId, tableId: NEWS_TABLE_ID });
  }
}

export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureNewsTable();

  try {
    const row = await tables.getRow<NewsRow>({ databaseId, tableId: NEWS_TABLE_ID, rowId: id });
    return normalizeArticle(row);
  } catch {
    return null;
  }
}

export async function getLatestNews(limit = 4): Promise<NewsArticle[]> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureNewsTable();

  try {
    const result = await tables.listRows<NewsRow>({
      databaseId,
      tableId: NEWS_TABLE_ID,
      queries: [Query.orderDesc('publishedAt'), Query.limit(limit)],
    });
    return result.rows.map(normalizeArticle);
  } catch {
    return [];
  }
}

export async function getAllNews(): Promise<NewsArticle[]> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureNewsTable();

  try {
    const result = await tables.listRows<NewsRow>({
      databaseId,
      tableId: NEWS_TABLE_ID,
      queries: [Query.orderDesc('publishedAt'), Query.limit(100)],
    });
    return result.rows.map(normalizeArticle);
  } catch {
    return [];
  }
}

export async function createNewsArticle(data: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureNewsTable();

  const rowId = ID.unique();
  await tables.upsertRow({
    databaseId,
    tableId: NEWS_TABLE_ID,
    rowId,
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      image: data.image,
      imageAlt: data.imageAlt,
      publishedAt: data.publishedAt,
      readTime: data.readTime,
    },
  });

  const row = await tables.getRow<NewsRow>({ databaseId, tableId: NEWS_TABLE_ID, rowId });
  return normalizeArticle(row);
}

export async function updateNewsArticle(
  id: string,
  data: Omit<NewsArticle, 'id'>
): Promise<NewsArticle> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();

  await tables.upsertRow({
    databaseId,
    tableId: NEWS_TABLE_ID,
    rowId: id,
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      image: data.image,
      imageAlt: data.imageAlt,
      publishedAt: data.publishedAt,
      readTime: data.readTime,
    },
  });

  const row = await tables.getRow<NewsRow>({ databaseId, tableId: NEWS_TABLE_ID, rowId: id });
  return normalizeArticle(row);
}

export async function deleteNewsArticle(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: NEWS_TABLE_ID, rowId: id });
}
