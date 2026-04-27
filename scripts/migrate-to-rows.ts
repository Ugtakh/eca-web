/**
 * Migration script — payload-based tables → row-by-row tables.
 *
 * Old format: each section had one row (id='main') with a JSON `payload` field.
 * New format: each item is its own row in a dedicated table.
 *
 * Run: bun scripts/migrate-to-rows.ts
 */

import { Client, TablesDB, ID, Query } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';
const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY ?? '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('❌ .env тохиргоо дутуу байна.');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tables = new TablesDB(client);

// ─── Old table IDs ─────────────────────────────────────────────────────────
const OLD_HERO     = process.env.APPWRITE_HERO_SECTION_TABLE_ID    ?? 'heroSectionCms';
const OLD_STATS    = process.env.APPWRITE_STATS_SECTION_TABLE_ID   ?? 'statsSectionCms';
const OLD_SERVICES = process.env.APPWRITE_SERVICES_SECTION_TABLE_ID ?? 'servicesSectionCms';
const OLD_PROJECTS = process.env.APPWRITE_PROJECTS_SECTION_TABLE_ID ?? 'projectsSectionCms';

// ─── New table IDs ─────────────────────────────────────────────────────────
const NEW_HERO     = process.env.APPWRITE_HERO_SLIDES_TABLE_ID    ?? 'heroSlides';
const NEW_STATS    = process.env.APPWRITE_STATS_TABLE_ID          ?? 'statsItems';
const NEW_SERVICES = process.env.APPWRITE_SERVICES_TABLE_ID       ?? 'servicesItems';
const NEW_PROJECTS = process.env.APPWRITE_PROJECTS_TABLE_ID       ?? 'projectsItems';

// ─── Types (old payload shape) ─────────────────────────────────────────────
interface OldSlide {
  title?: string; subtitle?: string; description?: string;
  bannerText?: string; image?: { src?: string; alt?: string };
}
interface OldHero { slides?: OldSlide[]; rotationSeconds?: number }
interface OldStat { value?: number; suffix?: string; label?: string; sublabel?: string; color?: string }
interface OldService { title?: string; subtitle?: string; description?: string; features?: string[]; image?: string; imageAlt?: string; color?: string }
interface OldProject { title?: string; category?: string; year?: string; area?: string; image?: string; imageAlt?: string; tags?: string[] }

// ─── Helpers ───────────────────────────────────────────────────────────────
async function readPayload<T>(tableId: string): Promise<T | null> {
  try {
    // Try fixed row id 'main' first
    const row = await tables.getRow<{ payload?: string }>({ databaseId, tableId, rowId: 'main' });
    if (row.payload) return JSON.parse(row.payload) as T;
  } catch {}
  try {
    // Fall back to listing rows and taking first
    const result = await tables.listRows<{ payload?: string }>({
      databaseId, tableId, queries: [Query.limit(1)],
    });
    const first = result.rows[0];
    if (first?.payload) return JSON.parse(first.payload) as T;
  } catch {}
  return null;
}

async function ensureTable(tableId: string, name: string, columns: object[]) {
  try { await tables.getTable({ databaseId, tableId }); return; } catch {}
  await tables.createTable({ databaseId, tableId, name, rowSecurity: false, enabled: true, columns } as Parameters<typeof tables.createTable>[0]);
  console.log(`  Table "${tableId}" үүслээ.`);
}

async function insertRow(tableId: string, data: Record<string, string>) {
  const rowId = ID.unique();
  await tables.upsertRow({ databaseId, tableId, rowId, data });
}

// ─── Section migrators ──────────────────────────────────────────────────────
async function migrateHero() {
  console.log(`\n🖼  Hero  (${OLD_HERO} → ${NEW_HERO})`);
  const payload = await readPayload<OldHero>(OLD_HERO);
  if (!payload) { console.log('  ⚠ Хуучин өгөгдөл олдсонгүй, алгасаж байна.'); return; }

  const slides = payload.slides ?? [];
  const rotation = String(payload.rotationSeconds ?? 4);
  console.log(`  ${slides.length} слайд олдлоо.`);

  await ensureTable(NEW_HERO, 'Hero Slides', [
    { key: 'title', type: 'string', size: 500, required: false, default: '' },
    { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
    { key: 'description', type: 'string', size: 2000, required: false, default: '' },
    { key: 'bannerText', type: 'string', size: 300, required: false, default: '' },
    { key: 'imageSrc', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'rotationSeconds', type: 'string', size: 5, required: false, default: '4' },
  ]);

  for (const s of slides) {
    await insertRow(NEW_HERO, {
      title: s.title ?? '',
      subtitle: s.subtitle ?? '',
      description: s.description ?? '',
      bannerText: s.bannerText ?? '',
      imageSrc: s.image?.src ?? '',
      imageAlt: s.image?.alt ?? '',
      rotationSeconds: rotation,
    });
    console.log(`  ✓ "${s.title ?? '(гарчиггүй)'}"`);
  }
}

async function migrateStats() {
  console.log(`\n📊 Stats  (${OLD_STATS} → ${NEW_STATS})`);
  const payload = await readPayload<{ stats?: OldStat[] }>(OLD_STATS);
  if (!payload) { console.log('  ⚠ Хуучин өгөгдөл олдсонгүй, алгасаж байна.'); return; }

  const stats = payload.stats ?? [];
  console.log(`  ${stats.length} мөр олдлоо.`);

  await ensureTable(NEW_STATS, 'Stats Items', [
    { key: 'value', type: 'string', size: 20, required: false, default: '0' },
    { key: 'suffix', type: 'string', size: 20, required: false, default: '' },
    { key: 'label', type: 'string', size: 200, required: false, default: '' },
    { key: 'sublabel', type: 'string', size: 200, required: false, default: '' },
    { key: 'color', type: 'string', size: 20, required: false, default: '' },
  ]);

  for (const s of stats) {
    await insertRow(NEW_STATS, {
      value: String(s.value ?? 0),
      suffix: s.suffix ?? '',
      label: s.label ?? '',
      sublabel: s.sublabel ?? '',
      color: s.color ?? '',
    });
    console.log(`  ✓ "${s.label ?? '(гарчиггүй)'}"`);
  }
}

async function migrateServices() {
  console.log(`\n🛠  Services  (${OLD_SERVICES} → ${NEW_SERVICES})`);
  const payload = await readPayload<{ services?: OldService[] }>(OLD_SERVICES);
  if (!payload) { console.log('  ⚠ Хуучин өгөгдөл олдсонгүй, алгасаж байна.'); return; }

  const services = payload.services ?? [];
  console.log(`  ${services.length} мөр олдлоо.`);

  await ensureTable(NEW_SERVICES, 'Services Items', [
    { key: 'title', type: 'string', size: 300, required: false, default: '' },
    { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
    { key: 'description', type: 'string', size: 2000, required: false, default: '' },
    { key: 'features', type: 'string', size: 2000, required: false, default: '[]' },
    { key: 'image', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'color', type: 'string', size: 20, required: false, default: '' },
  ]);

  for (const s of services) {
    await insertRow(NEW_SERVICES, {
      title: s.title ?? '',
      subtitle: s.subtitle ?? '',
      description: s.description ?? '',
      features: JSON.stringify(s.features ?? []),
      image: s.image ?? '',
      imageAlt: s.imageAlt ?? '',
      color: s.color ?? '',
    });
    console.log(`  ✓ "${s.title ?? '(гарчиггүй)'}"`);
  }
}

async function migrateProjects() {
  console.log(`\n🏗  Projects  (${OLD_PROJECTS} → ${NEW_PROJECTS})`);
  const payload = await readPayload<{ projects?: OldProject[] }>(OLD_PROJECTS);
  if (!payload) { console.log('  ⚠ Хуучин өгөгдөл олдсонгүй, алгасаж байна.'); return; }

  const projects = payload.projects ?? [];
  console.log(`  ${projects.length} мөр олдлоо.`);

  await ensureTable(NEW_PROJECTS, 'Projects Items', [
    { key: 'title', type: 'string', size: 300, required: false, default: '' },
    { key: 'category', type: 'string', size: 200, required: false, default: '' },
    { key: 'year', type: 'string', size: 10, required: false, default: '' },
    { key: 'area', type: 'string', size: 50, required: false, default: '' },
    { key: 'image', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'tags', type: 'string', size: 1000, required: false, default: '[]' },
  ]);

  for (const p of projects) {
    await insertRow(NEW_PROJECTS, {
      title: p.title ?? '',
      category: p.category ?? '',
      year: p.year ?? '',
      area: p.area ?? '',
      image: p.image ?? '',
      imageAlt: p.imageAlt ?? '',
      tags: JSON.stringify(p.tags ?? []),
    });
    console.log(`  ✓ "${p.title ?? '(гарчиггүй)'}"`);
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔄 Migration эхлэж байна...');
  console.log(`   Endpoint : ${endpoint}`);
  console.log(`   Database : ${databaseId}`);

  await migrateHero();
  await migrateStats();
  await migrateServices();
  await migrateProjects();

  console.log('\n✅ Migration дууслаа.\n');
  console.log('💡 Хэрэв "Хуучин өгөгдөл олдсонгүй" гарвал seed-sections скрипт ашиглана уу:');
  console.log('   bun run seed:sections\n');
}

main().catch((err) => {
  console.error('❌ Алдаа:', err);
  process.exit(1);
});
