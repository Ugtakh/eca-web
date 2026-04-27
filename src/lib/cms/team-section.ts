import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
  certifications: string[];
  linkedin: string;
};

export type TeamSectionContent = {
  team: TeamMember[];
};

type TeamRow = Models.Row & {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  certifications?: string;
  linkedin?: string;
};

const TABLE_ID =
  process.env.APPWRITE_TEAM_TABLE_ID ??
  process.env.NEXT_PUBLIC_APPWRITE_TEAM_TABLE_ID ??
  'teamMembers';

export const defaultTeamSectionContent: TeamSectionContent = {
  team: [
    {
      id: '',
      name: 'C. Эрдэнэсайхан',
      role: 'Үүсгэн байгуулагч & Гүйцэтгэх захирал',
      bio: 'Цахилгааны үйлдвэрийн автоматжуулал инженерчлэлд 10+ жил.',
      image:
        'https://scontent.fuln6-3.fna.fbcdn.net/v/t39.30808-1/415258408_6984190151670369_3145474723106485049_n.jpg?stp=c683.0.1365.1365a_dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_ohc=IV_UILLnIdYQ7kNvwFxEJvP&_nc_oc=Adq-YiZCSnnifhEyfRfnDUBi0B74IJVvuL8188xQy_KOhaFeFaYNSWYxkweUDO7zqUlnDjrt-ni40i0qKtBtTKWy&_nc_zt=24&_nc_ht=scontent.fuln6-3.fna&_nc_gid=6vhpk8yB4BRg3yDGOiQJpw&_nc_ss=7a32e&oh=00_Afwrq-ISEKnPqt7hUe4MvkIgtNMAINVoxHOLayT6R7vKWg&oe=69C9E1F6',
      imageAlt: 'Гүйцэтгэх захирал',
      certifications: ['Автокад', 'Инженерчлэл', 'ҮПА'],
      linkedin: '#',
    },
    {
      id: '',
      name: 'С. Бат-Эрдэнэ',
      role: 'Ахлах инженер',
      bio: 'Галын дохиоллын системийн зураг зурах, угсралтад 20+ жилийн туршлагатай.',
      image: '/assets/avatars/no-user-male.jpg',
      imageAlt: 'Ахлах инженер',
      certifications: ['Автокад', 'Галын систем', 'Үйлдвэрлэл'],
      linkedin: '#',
    },
    {
      id: '',
      name: 'Д. Энхбаяр',
      role: 'Автоматжуулалтын инженер',
      bio: 'Үйлдвэрийн автомажуулалт, PLC, SCADA систем 10+ жилийн туршлагатай',
      image: '/assets/avatars/no-user-male.jpg',
      imageAlt: 'Автоматжуулалтын инженер',
      certifications: ['Автокад', 'Автомажуулалт', 'ПЛС', 'Скада'],
      linkedin: '#',
    },
  ],
};

function getDbId() {
  const id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!id) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return id;
}

function parseCerts(raw?: string): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function normalizeRow(row: TeamRow): TeamMember {
  return {
    id: row.$id,
    name: String(row.name ?? '').trim(),
    role: String(row.role ?? '').trim(),
    bio: String(row.bio ?? '').trim(),
    image: String(row.image ?? '').trim(),
    imageAlt: String(row.imageAlt ?? '').trim(),
    certifications: parseCerts(row.certifications),
    linkedin: String(row.linkedin ?? '').trim(),
  };
}

async function ensureTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  try {
    await tables.getTable({ databaseId, tableId: TABLE_ID });
    return;
  } catch {}
  try {
    await tables.createTable({
      databaseId,
      tableId: TABLE_ID,
      name: 'Team Members',
      rowSecurity: false,
      enabled: true,
      columns: [
        { key: 'name', type: 'string', size: 300, required: false, default: '' },
        { key: 'role', type: 'string', size: 300, required: false, default: '' },
        { key: 'bio', type: 'string', size: 2000, required: false, default: '' },
        { key: 'image', type: 'string', size: 1000, required: false, default: '' },
        { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
        { key: 'certifications', type: 'string', size: 1000, required: false, default: '[]' },
        { key: 'linkedin', type: 'string', size: 500, required: false, default: '' },
      ],
    });
  } catch {
    await tables.getTable({ databaseId, tableId: TABLE_ID });
  }
}

export async function getTeamSectionContent(): Promise<TeamSectionContent> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  try {
    const result = await tables.listRows<TeamRow>({
      databaseId,
      tableId: TABLE_ID,
      queries: [Query.orderAsc('$createdAt'), Query.limit(50)],
    });
    const team = result.rows.map(normalizeRow);
    return { team: team.length > 0 ? team : defaultTeamSectionContent.team };
  } catch {
    return defaultTeamSectionContent;
  }
}

export async function createTeamMember(data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureTable();
  const rowId = ID.unique();
  await tables.upsertRow({
    databaseId,
    tableId: TABLE_ID,
    rowId,
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio,
      image: data.image,
      imageAlt: data.imageAlt,
      certifications: JSON.stringify(data.certifications),
      linkedin: data.linkedin,
    },
  });
  const row = await tables.getRow<TeamRow>({ databaseId, tableId: TABLE_ID, rowId });
  return normalizeRow(row);
}

export async function updateTeamMember(
  id: string,
  data: Omit<TeamMember, 'id'>
): Promise<TeamMember> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.upsertRow({
    databaseId,
    tableId: TABLE_ID,
    rowId: id,
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio,
      image: data.image,
      imageAlt: data.imageAlt,
      certifications: JSON.stringify(data.certifications),
      linkedin: data.linkedin,
    },
  });
  const row = await tables.getRow<TeamRow>({ databaseId, tableId: TABLE_ID, rowId: id });
  return normalizeRow(row);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: TABLE_ID, rowId: id });
}
