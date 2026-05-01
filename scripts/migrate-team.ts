/**
 * Migration — teamSectionCms (payload) → teamMembers (row-by-row)
 * Run: bun scripts/migrate-team.ts
 */

import { Client, TablesDB, ID } from 'node-appwrite';

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

const OLD_TABLE = process.env.APPWRITE_TEAM_SECTION_TABLE_ID ?? 'teamSectionCms';
const NEW_TABLE = process.env.APPWRITE_TEAM_TABLE_ID ?? 'teamMembers';

interface OldTeamMember {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  certifications?: string[];
  linkedin?: string;
}

async function main() {
  console.log('\n🔄 Team migration эхлэж байна...\n');

  // Read from old table
  let payload: { team?: OldTeamMember[] } | null = null;
  try {
    const row = await tables.getRow<{ payload?: string }>({
      databaseId,
      tableId: OLD_TABLE,
      rowId: 'homeTeam',
    });
    if (row.payload) payload = JSON.parse(row.payload);
    console.log(`✓ Хуучин таблиас уншилаа`);
  } catch {
    try {
      const result = await tables.listRows<{ payload?: string }>({
        databaseId,
        tableId: OLD_TABLE,
        queries: [],
      });
      if (result.rows[0]?.payload) payload = JSON.parse(result.rows[0].payload);
    } catch {}
  }

  if (!payload?.team?.length) {
    console.log('⚠ Гишүүн олдсонгүй, алгасаж байна.');
    process.exit(0);
  }

  console.log(`📊 ${payload.team.length} гишүүн олдлоо.\n`);

  // Ensure new table
  try {
    await tables.getTable({ databaseId, tableId: NEW_TABLE });
  } catch {
    await tables.createTable({
      databaseId,
      tableId: NEW_TABLE,
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
    console.log(`✓ Table "${NEW_TABLE}" үүслээ.`);
  }

  // Migrate members
  for (const m of payload.team) {
    const rowId = ID.unique();
    await tables.upsertRow({
      databaseId,
      tableId: NEW_TABLE,
      rowId,
      data: {
        name: m.name ?? '',
        role: m.role ?? '',
        bio: m.bio ?? '',
        image: m.image ?? '',
        imageAlt: m.imageAlt ?? '',
        certifications: JSON.stringify(m.certifications ?? []),
        linkedin: m.linkedin ?? '',
      },
    });
    console.log(`  ✓ "${m.name ?? '(гарчиггүй)'}"`);
  }

  console.log('\n✅ Migration дууслаа.\n');
}

main().catch((err) => {
  console.error('❌ Алдаа:', err);
  process.exit(1);
});
