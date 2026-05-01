/**
 * Cleanup — хуучин payload-based таблиудыг устгана.
 * Run: bun scripts/cleanup-old-tables.ts
 */

import { Client, TablesDB } from 'node-appwrite';

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

const OLD_TABLES = [
  process.env.APPWRITE_HERO_SECTION_TABLE_ID    ?? 'heroSectionCms',
  process.env.APPWRITE_STATS_SECTION_TABLE_ID   ?? 'statsSectionCms',
  process.env.APPWRITE_SERVICES_SECTION_TABLE_ID ?? 'servicesSectionCms',
  process.env.APPWRITE_PROJECTS_SECTION_TABLE_ID ?? 'projectsSectionCms',
  process.env.APPWRITE_TEAM_SECTION_TABLE_ID    ?? 'teamSectionCms',
];

console.log('\n🗑  Хуучин таблиудыг устгаж байна...\n');

for (const tableId of OLD_TABLES) {
  try {
    await tables.deleteTable({ databaseId, tableId });
    console.log(`✓ Устгасан: ${tableId}`);
  } catch {
    console.log(`⚠ Олдсонгүй: ${tableId}`);
  }
}

console.log('\n✅ Дууслаа.\n');
