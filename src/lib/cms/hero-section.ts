import { Query, ID } from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { unstable_noStore as noStore } from 'next/cache';

import { createAdminClient } from '@/lib/appwrite/client';

export type HeroSectionImage = {
  src: string;
  alt: string;
};

export type HeroSectionSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bannerText: string;
  image: HeroSectionImage;
};

export type HeroSectionContent = {
  slides: HeroSectionSlide[];
  rotationSeconds: number;
};

type HeroSlideRow = Models.Row & {
  title?: string;
  subtitle?: string;
  description?: string;
  bannerText?: string;
  imageSrc?: string;
  imageAlt?: string;
  rotationSeconds?: string;
};

const SLIDES_TABLE_ID =
  process.env.APPWRITE_HERO_SLIDES_TABLE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_HERO_SLIDES_TABLE_ID ?? 'heroSlides';

export const defaultHeroSectionContent: HeroSectionContent = {
  rotationSeconds: 4,
  slides: [
    {
      id: '',
      title: 'Галын\nдохиолол &\nЦахилгаан\nАвтоматжуулалт',
      subtitle: 'Инженерийн цогц шийдэл',
      description: 'Галын дохиолол, холбоо дохиолол болон цахилгаан автоматжуулалтын зураг төсөл, угсралтын цогц үйлчилгээ.',
      bannerText: '10+ жилийн туршлага · 50+ дууссан төсөл',
      image: {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1171d4649-1772595593394.png',
        alt: 'Цахилгаан угсралтын ажил — инженер хяналтын самбарт ажиллаж байна',
      },
    },
  ],
};

function getDbId() {
  const id = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!id) throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set');
  return id;
}

function clampRotation(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(10, Math.max(1, Math.round(n))) : 4;
}

function normalizeRow(row: HeroSlideRow): HeroSectionSlide {
  return {
    id: row.$id,
    title: String(row.title ?? '').trim(),
    subtitle: String(row.subtitle ?? '').trim(),
    description: String(row.description ?? '').trim(),
    bannerText: String(row.bannerText ?? '').trim(),
    image: {
      src: String(row.imageSrc ?? '').trim(),
      alt: String(row.imageAlt ?? '').trim(),
    },
  };
}

async function ensureSlidesTable() {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  try { await tables.getTable({ databaseId, tableId: SLIDES_TABLE_ID }); return; } catch {}
  try {
    await tables.createTable({
      databaseId, tableId: SLIDES_TABLE_ID, name: 'Hero Slides', rowSecurity: false, enabled: true,
      columns: [
        { key: 'title', type: 'string', size: 500, required: false, default: '' },
        { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
        { key: 'description', type: 'string', size: 2000, required: false, default: '' },
        { key: 'bannerText', type: 'string', size: 300, required: false, default: '' },
        { key: 'imageSrc', type: 'string', size: 1000, required: false, default: '' },
        { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
        { key: 'rotationSeconds', type: 'string', size: 5, required: false, default: '4' },
      ],
    });
  } catch { await tables.getTable({ databaseId, tableId: SLIDES_TABLE_ID }); }
}

export async function getHeroSectionContent(): Promise<HeroSectionContent> {
  noStore();
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureSlidesTable();
  try {
    const result = await tables.listRows<HeroSlideRow>({
      databaseId, tableId: SLIDES_TABLE_ID,
      queries: [Query.orderAsc('$createdAt'), Query.limit(20)],
    });
    const slides = result.rows.map(normalizeRow);
    const rotationSeconds = clampRotation(result.rows[0]?.rotationSeconds ?? '4');
    if (slides.length === 0) return defaultHeroSectionContent;
    return { slides, rotationSeconds };
  } catch {
    return defaultHeroSectionContent;
  }
}

export async function createHeroSlide(
  data: Omit<HeroSectionSlide, 'id'>,
  rotationSeconds: number
): Promise<HeroSectionSlide> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await ensureSlidesTable();
  const rowId = ID.unique();
  await tables.upsertRow({
    databaseId, tableId: SLIDES_TABLE_ID, rowId,
    data: { title: data.title, subtitle: data.subtitle, description: data.description, bannerText: data.bannerText, imageSrc: data.image.src, imageAlt: data.image.alt, rotationSeconds: String(rotationSeconds) },
  });
  const row = await tables.getRow<HeroSlideRow>({ databaseId, tableId: SLIDES_TABLE_ID, rowId });
  return normalizeRow(row);
}

export async function updateHeroSlide(
  id: string,
  data: Omit<HeroSectionSlide, 'id'>,
  rotationSeconds: number
): Promise<HeroSectionSlide> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.upsertRow({
    databaseId, tableId: SLIDES_TABLE_ID, rowId: id,
    data: { title: data.title, subtitle: data.subtitle, description: data.description, bannerText: data.bannerText, imageSrc: data.image.src, imageAlt: data.image.alt, rotationSeconds: String(rotationSeconds) },
  });
  const row = await tables.getRow<HeroSlideRow>({ databaseId, tableId: SLIDES_TABLE_ID, rowId: id });
  return normalizeRow(row);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  await tables.deleteRow({ databaseId, tableId: SLIDES_TABLE_ID, rowId: id });
}

export async function updateAllSlidesRotation(rotationSeconds: number): Promise<void> {
  const databaseId = getDbId();
  const { tables } = await createAdminClient();
  const result = await tables.listRows<HeroSlideRow>({
    databaseId, tableId: SLIDES_TABLE_ID,
    queries: [Query.limit(20)],
  });
  await Promise.all(
    result.rows.map((row) =>
      tables.upsertRow({ databaseId, tableId: SLIDES_TABLE_ID, rowId: row.$id, data: { rotationSeconds: String(rotationSeconds) } })
    )
  );
}
