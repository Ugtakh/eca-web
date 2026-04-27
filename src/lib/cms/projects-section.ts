import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  area: string;
  image: string;
  imageAlt: string;
  tags: string[];
};

export type ProjectsSectionContent = {
  projects: ProjectItem[];
};

type ProjectRow = Models.Row & {
  title?: string;
  category?: string;
  year?: string;
  area?: string;
  image?: string;
  imageAlt?: string;
  tags?: string;
};

const TABLE_ID =
  process.env.APPWRITE_PROJECTS_TABLE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_TABLE_ID ?? 'projectsItems';

export const defaultProjectsSectionContent: ProjectsSectionContent = {
  projects: [
    { id: '', title: 'Оффис цогцолбор', category: 'Галын дохиолол', year: '2023', area: '12,400 м²', image: 'https://images.unsplash.com/photo-1602917058415-d86121146559', imageAlt: 'Орчин үеийн оффис барилга', tags: ['Галын дохиолол', 'Яаралтай гаралт'] },
    { id: '', title: 'Худалдааны төв', category: 'Холбоо систем', year: '2025', area: '28,000 м²', image: 'https://images.unsplash.com/photo-1603286658321-7efc940586e8', imageAlt: 'Том худалдааны төвийн дотоод орчин', tags: ['IP камер', 'Холбоо систем', 'BMS'] },
    { id: '', title: 'Үйлдвэрийн байр', category: 'Автоматжуулалт', year: '2023', area: '45,000 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10fd2a923-1774334171785.png', imageAlt: 'Үйлдвэрийн автоматжуулалтын систем', tags: ['PLC', 'SCADA', 'Автоматжуулалт'] },
    { id: '', title: 'Эмнэлгийн галын хамгаалалт', category: 'Галын дохиолол', year: '2022', area: '8,200 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1173a1a84-1772116864140.png', imageAlt: 'Эмнэлгийн барилга', tags: ['Галын дохиолол', 'Спринклер'] },
    { id: '', title: 'Орон сууцны цогцолборын цахилгаан', category: 'Автоматжуулалт', year: '2022', area: '32,000 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cdee142b-1767354989556.png', imageAlt: 'Орон сууцны цогцолбор', tags: ['Цахилгаан', 'Гэрэлтүүлэг', 'BMS'] },
    { id: '', title: 'Зочид буудлын камерын систем', category: 'Зураг төсөл', year: '2019', area: '15,600 м²', image: 'https://images.unsplash.com/photo-1694973283525-2b3840f7c08a', imageAlt: 'Зочид буудлын лобби', tags: ['Интеграци', 'Зураг төсөл', 'Дуусгавар'] },
  ],
};

function getDbId() {
  const id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!id) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return id;
}

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

function normalizeRow(row: ProjectRow): ProjectItem {
  return {
    id: row.$id,
    title: String(row.title ?? '').trim(),
    category: String(row.category ?? '').trim(),
    year: String(row.year ?? '').trim(),
    area: String(row.area ?? '').trim(),
    image: String(row.image ?? '').trim(),
    imageAlt: String(row.imageAlt ?? '').trim(),
    tags: parseTags(row.tags),
  };
}

async function ensureTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  try { await tables.getTable({ databaseId, tableId: TABLE_ID }); return; } catch {}
  try {
    await tables.createTable({
      databaseId, tableId: TABLE_ID, name: 'Projects Items', rowSecurity: false, enabled: true,
      columns: [
        { key: 'title', type: 'string', size: 300, required: false, default: '' },
        { key: 'category', type: 'string', size: 200, required: false, default: '' },
        { key: 'year', type: 'string', size: 10, required: false, default: '' },
        { key: 'area', type: 'string', size: 50, required: false, default: '' },
        { key: 'image', type: 'string', size: 1000, required: false, default: '' },
        { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
        { key: 'tags', type: 'string', size: 1000, required: false, default: '[]' },
      ],
    });
  } catch { await tables.getTable({ databaseId, tableId: TABLE_ID }); }
}

export async function getProjectsSectionContent(): Promise<ProjectsSectionContent> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  try {
    const result = await tables.listRows<ProjectRow>({
      databaseId, tableId: TABLE_ID,
      queries: [Query.orderAsc('$createdAt'), Query.limit(50)],
    });
    const projects = result.rows.map(normalizeRow);
    return { projects: projects.length > 0 ? projects : defaultProjectsSectionContent.projects };
  } catch {
    return defaultProjectsSectionContent;
  }
}

export async function createProjectItem(data: Omit<ProjectItem, 'id'>): Promise<ProjectItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  const rowId = ID.unique();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId, data: { title: data.title, category: data.category, year: data.year, area: data.area, image: data.image, imageAlt: data.imageAlt, tags: JSON.stringify(data.tags) } });
  const row = await tables.getRow<ProjectRow>({ databaseId, tableId: TABLE_ID, rowId });
  return normalizeRow(row);
}

export async function updateProjectItem(id: string, data: Omit<ProjectItem, 'id'>): Promise<ProjectItem> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.upsertRow({ databaseId, tableId: TABLE_ID, rowId: id, data: { title: data.title, category: data.category, year: data.year, area: data.area, image: data.image, imageAlt: data.imageAlt, tags: JSON.stringify(data.tags) } });
  const row = await tables.getRow<ProjectRow>({ databaseId, tableId: TABLE_ID, rowId: id });
  return normalizeRow(row);
}

export async function deleteProjectItem(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: TABLE_ID, rowId: id });
}
