import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type ServiceItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  color: string;
};

export type ServicesSectionContent = {
  services: ServiceItem[];
};

type ServiceRow = Models.Row & {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string;
  image?: string;
  imageAlt?: string;
  color?: string;
};

const TABLE_ID =
  process.env.APPWRITE_SERVICES_TABLE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_SERVICES_TABLE_ID ?? 'servicesItems';

export const defaultServicesSectionContent: ServicesSectionContent = {
  services: [
    { id: '', title: 'Галын дохиолол', subtitle: 'Fire Alarm Systems', description: 'Барилга байгууламжид зориулсан орчин үеийн галын дохиоллын системийн зураг зурах, угсрах, тохируулах, засвар үйлчилгээ.', features: ['Автомат илрүүлэгч', 'Дуут дохио', 'Удирдлагын самбар', 'Сүлжээний холболт'], image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1214c9fe1-1767106949267.png', imageAlt: 'Галын дохиоллын систем', color: '#E8390E' },
    { id: '', title: 'Холбоо дохиолол', subtitle: 'Communication Systems', description: 'Дотоод холбоо, мэдээлэл дамжуулах сүлжээний бүрэн шийдэл.', features: ['IP камер сүлжээ', 'Интерком систем', 'Өгөгдөл дамжуулалт'], image: 'https://img.rocket.new/generatedImages/rocket_gen_img_145576cb2-1774334171541.png', imageAlt: 'Холбоо дохиоллын сүлжээ', color: '#60A5FA' },
    { id: '', title: 'Цахилгаан автоматжуулалт', subtitle: 'Electrical Automation', description: 'Ухаалаг барилгын цахилгаан систем, автомат удирдлага.', features: ['BMS систем', 'PLC программчлал', 'SCADA'], image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156210e3c-1774334168862.png', imageAlt: 'Цахилгаан автоматжуулалтын хяналтын самбар', color: '#F5A623' },
    { id: '', title: 'Зураг төсөл', subtitle: 'Design & Engineering', description: 'Мэргэжлийн инженерийн зураг, техникийн тооцоо, стандарт нийцлийн баримт бичиг.', features: ['AutoCAD зураг', 'Техникийн тооцоо', 'Стандарт нийцэл', 'Тендер баримт'], image: 'https://5.imimg.com/data5/SELLER/Default/2024/4/412038295/WX/UR/LC/110083320/fire-fighting-services-500x500.jpeg', imageAlt: 'Зураг төслийн инженерийн баримт бичиг', color: '#4ADE80' },
  ],
};

function getDbId() {
  const id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!id) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return id;
}

function parseFeatures(raw?: string): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

function normalizeRow(row: ServiceRow): ServiceItem {
  return {
    id: row.$id,
    title: String(row.title ?? '').trim(),
    subtitle: String(row.subtitle ?? '').trim(),
    description: String(row.description ?? '').trim(),
    features: parseFeatures(row.features),
    image: String(row.image ?? '').trim(),
    imageAlt: String(row.imageAlt ?? '').trim(),
    color: String(row.color ?? '').trim(),
  };
}

async function ensureTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  try { await tables.getTable({ databaseId, tableId: TABLE_ID }); return; } catch {}
  try {
    await tables.createTable({
      databaseId, tableId: TABLE_ID, name: 'Services Items', rowSecurity: false, enabled: true,
      columns: [
        { key: 'title', type: 'string', size: 300, required: false, default: '' },
        { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
        { key: 'description', type: 'string', size: 2000, required: false, default: '' },
        { key: 'features', type: 'string', size: 2000, required: false, default: '[]' },
        { key: 'image', type: 'string', size: 1000, required: false, default: '' },
        { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
        { key: 'color', type: 'string', size: 20, required: false, default: '' },
      ],
    });
  } catch { await tables.getTable({ databaseId, tableId: TABLE_ID }); }
}

export async function getServicesSectionContent(): Promise<ServicesSectionContent> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  try {
    const result = await tables.listRows<ServiceRow>({
      databaseId, tableId: TABLE_ID,
      queries: [Query.orderAsc('$createdAt'), Query.limit(50)],
    });
    const services = result.rows.map(normalizeRow);
    return { services: services.length > 0 ? services : defaultServicesSectionContent.services };
  } catch {
    return defaultServicesSectionContent;
  }
}

export async function createServiceItem(data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  const rowId = ID.unique();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId, data: { title: data.title, subtitle: data.subtitle, description: data.description, features: JSON.stringify(data.features), image: data.image, imageAlt: data.imageAlt, color: data.color } });
  const row = await tables.getRow<ServiceRow>({ databaseId, tableId: TABLE_ID, rowId });
  return normalizeRow(row);
}

export async function updateServiceItem(id: string, data: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId: id, data: { title: data.title, subtitle: data.subtitle, description: data.description, features: JSON.stringify(data.features), image: data.image, imageAlt: data.imageAlt, color: data.color } });
  const row = await tables.getRow<ServiceRow>({ databaseId, tableId: TABLE_ID, rowId: id });
  return normalizeRow(row);
}

export async function deleteServiceItem(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: TABLE_ID, rowId: id });
}
