import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/appwrite/client';

export type ContactSectionInfo = {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  building: string;
};

type ContactInfoRow = Models.Row & {
  payload?: string;
};

const CONTACT_INFO_TABLE_ID =
  process.env.APPWRITE_CONTACT_INFO_TABLE_ID ??
  process.env.NEXT_PUBLIC_APPWRITE_CONTACT_INFO_TABLE_ID ??
  'contactInfoCms';
const CONTACT_INFO_ROW_ID = 'contact-info-main';

export const defaultContactInfo: ContactSectionInfo = {
  phone1: '9901-5338',
  phone2: '7575-1111',
  email: 'info@eca.mn',
  address: 'Улаанбаатар хот, Чингэлтэй дүүрэг',
  building: 'MN тауэр',
};

function getDbId() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return databaseId;
}

function normalizeContactInfo(data?: string): ContactSectionInfo {
  if (!data) return defaultContactInfo;
  try {
    return { ...defaultContactInfo, ...JSON.parse(data) };
  } catch {
    return defaultContactInfo;
  }
}

async function ensureContactInfoTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();

  try {
    await tables.getTable({ databaseId, tableId: CONTACT_INFO_TABLE_ID });
    return;
  } catch {}

  try {
    await tables.createTable({
      databaseId,
      tableId: CONTACT_INFO_TABLE_ID,
      name: 'Contact Section Info',
      rowSecurity: false,
      enabled: true,
      columns: [{ key: 'payload', type: 'string', size: 8192, required: false, default: '' }],
    });
  } catch {
    await tables.getTable({ databaseId, tableId: CONTACT_INFO_TABLE_ID });
  }
}

export async function getContactSectionInfo(): Promise<ContactSectionInfo> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureContactInfoTable();

  try {
    const row = await tables.getRow<ContactInfoRow>({
      databaseId,
      tableId: CONTACT_INFO_TABLE_ID,
      rowId: CONTACT_INFO_ROW_ID,
    });
    return normalizeContactInfo(row.payload);
  } catch {
    return defaultContactInfo;
  }
}

export async function saveContactSectionInfo(
  info: ContactSectionInfo
): Promise<ContactSectionInfo> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureContactInfoTable();

  await tables.upsertRow({
    databaseId,
    tableId: CONTACT_INFO_TABLE_ID,
    rowId: CONTACT_INFO_ROW_ID,
    data: {
      payload: JSON.stringify(info),
    },
  });

  const row = await tables.getRow<ContactInfoRow>({
    databaseId,
    tableId: CONTACT_INFO_TABLE_ID,
    rowId: CONTACT_INFO_ROW_ID,
  });
  return normalizeContactInfo(row.payload);
}
