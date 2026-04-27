import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
};

export type StatsSectionContent = {
  stats: StatItem[];
};

type StatRow = Models.Row & {
  value?: string;
  suffix?: string;
  label?: string;
  sublabel?: string;
  color?: string;
};

const TABLE_ID =
  process.env.APPWRITE_STATS_TABLE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_STATS_TABLE_ID ?? 'statsItems';

export const defaultStatsSectionContent: StatsSectionContent = {
  stats: [
    { id: '', value: 50, suffix: '+', label: 'Дууссан төсөл', sublabel: '2015 оноос хойш', color: '#F97316' },
    { id: '', value: 10, suffix: '+', label: 'Жилийн туршлага', sublabel: 'Салбарт ажилласан', color: '#4F8EF7' },
    { id: '', value: 98, suffix: '%', label: 'Сэтгэл ханамж', sublabel: 'Хэрэглэгчийн үнэлгээ', color: '#4ADE80' },
    { id: '', value: 10, suffix: '+', label: 'Мэргэжилтэн', sublabel: 'Баталгаажсан инженер', color: '#60A5FA' },
  ],
};

function getDbId() {
  const id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!id) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return id;
}

function normalizeRow(row: StatRow): StatItem {
  const parsed = Number(row.value ?? '0');
  return {
    id: row.$id,
    value: Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0,
    suffix: String(row.suffix ?? '').trim(),
    label: String(row.label ?? '').trim(),
    sublabel: String(row.sublabel ?? '').trim(),
    color: String(row.color ?? '').trim(),
  };
}

async function ensureTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  try { await tables.getTable({ databaseId, tableId: TABLE_ID }); return; } catch {}
  try {
    await tables.createTable({
      databaseId, tableId: TABLE_ID, name: 'Stats Items', rowSecurity: false, enabled: true,
      columns: [
        { key: 'value', type: 'string', size: 20, required: false, default: '0' },
        { key: 'suffix', type: 'string', size: 20, required: false, default: '' },
        { key: 'label', type: 'string', size: 200, required: false, default: '' },
        { key: 'sublabel', type: 'string', size: 200, required: false, default: '' },
        { key: 'color', type: 'string', size: 20, required: false, default: '' },
      ],
    });
  } catch { await tables.getTable({ databaseId, tableId: TABLE_ID }); }
}

export async function getStatsSectionContent(): Promise<StatsSectionContent> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  try {
    const result = await tables.listRows<StatRow>({
      databaseId, tableId: TABLE_ID,
      queries: [Query.orderAsc('$createdAt'), Query.limit(50)],
    });
    const stats = result.rows.map(normalizeRow);
    return { stats: stats.length > 0 ? stats : defaultStatsSectionContent.stats };
  } catch {
    return defaultStatsSectionContent;
  }
}

export async function createStatItem(data: Omit<StatItem, 'id'>): Promise<StatItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  const rowId = ID.unique();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId, data: { value: String(data.value), suffix: data.suffix, label: data.label, sublabel: data.sublabel, color: data.color } });
  const row = await tables.getRow<StatRow>({ databaseId, tableId: TABLE_ID, rowId });
  return normalizeRow(row);
}

export async function updateStatItem(id: string, data: Omit<StatItem, 'id'>): Promise<StatItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId: id, data: { value: String(data.value), suffix: data.suffix, label: data.label, sublabel: data.sublabel, color: data.color } });
  const row = await tables.getRow<StatRow>({ databaseId, tableId: TABLE_ID, rowId: id });
  return normalizeRow(row);
}

export async function deleteStatItem(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: TABLE_ID, rowId: id });
}
