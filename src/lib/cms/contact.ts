import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  description: string;
  type: 'quote' | 'inquiry';
  submittedAt: string;
};

type ContactRow = Models.Row & {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  description?: string;
  type?: 'quote' | 'inquiry';
  submittedAt?: string;
};

const CONTACT_TABLE_ID =
  process.env.APPWRITE_CONTACT_TABLE_ID ??
  process.env.NEXT_PUBLIC_APPWRITE_CONTACT_TABLE_ID ??
  'contactSubmissions';

function getDbId() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return databaseId;
}

function normalizeSubmission(row: ContactRow): ContactSubmission {
  return {
    id: row.$id,
    name: String(row.name ?? '').trim(),
    email: String(row.email ?? '').trim(),
    phone: String(row.phone ?? '').trim(),
    company: String(row.company ?? '').trim(),
    description: String(row.description ?? '').trim(),
    type: (row.type as 'quote' | 'inquiry') ?? 'quote',
    submittedAt: String(row.submittedAt ?? new Date().toISOString()),
  };
}

async function ensureContactTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();

  try {
    await tables.getTable({ databaseId, tableId: CONTACT_TABLE_ID });
    return;
  } catch {}

  try {
    await tables.createTable({
      databaseId,
      tableId: CONTACT_TABLE_ID,
      name: 'Contact Submissions',
      rowSecurity: false,
      enabled: true,
      columns: [
        { key: 'name', type: 'string', size: 200, required: false, default: '' },
        { key: 'email', type: 'string', size: 300, required: false, default: '' },
        { key: 'phone', type: 'string', size: 50, required: false, default: '' },
        { key: 'company', type: 'string', size: 300, required: false, default: '' },
        { key: 'description', type: 'string', size: 32768, required: false, default: '' },
        { key: 'type', type: 'string', size: 20, required: false, default: 'quote' },
        { key: 'submittedAt', type: 'string', size: 100, required: false, default: '' },
      ],
    });
  } catch {
    await tables.getTable({ databaseId, tableId: CONTACT_TABLE_ID });
  }
}

export async function getContactSubmissions(limit = 50): Promise<ContactSubmission[]> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureContactTable();

  try {
    const result = await tables.listRows<ContactRow>({
      databaseId,
      tableId: CONTACT_TABLE_ID,
      queries: [Query.orderDesc('submittedAt'), Query.limit(limit)],
    });
    return result.rows.map(normalizeSubmission);
  } catch {
    return [];
  }
}

export async function createContactSubmission(
  data: Omit<ContactSubmission, 'id' | 'submittedAt'> & { submittedAt?: string }
): Promise<ContactSubmission> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureContactTable();

  const rowId = ID.unique();
  await tables.upsertRow({
    databaseId,
    tableId: CONTACT_TABLE_ID,
    rowId,
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      description: data.description,
      type: data.type,
      submittedAt: data.submittedAt || new Date().toISOString(),
    },
  });

  const row = await tables.getRow<ContactRow>({ databaseId, tableId: CONTACT_TABLE_ID, rowId });
  return normalizeSubmission(row);
}
