/**
 * Seed script — өмнөх статик мэдээнүүдийг database-т бичнэ.
 * Run: bun scripts/seed-news.ts
 */

import { Client, TablesDB, ID } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';
const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY ?? '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
const tableId = process.env.APPWRITE_NEWS_TABLE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_NEWS_TABLE_ID ?? 'newsCms';

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('❌ .env тохиргоо дутуу байна. NEXT_PUBLIC_APPWRITE_* хувьсагчдыг шалгана уу.');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tables = new TablesDB(client);

const SEED_ARTICLES = [
  {
    title: 'И СИ ЭЙ Инженеринг сертификатаа шинэчиллээ',
    excerpt:
      'Манай компани стандартын менежментийн шаардлагыг бүрэн хангасан баталгааг дахин авлаа.',
    content:
      '<p>Манай компани стандартын менежментийн шаардлагыг бүрэн хангасан баталгааг дахин авлаа. Энэхүү баталгаа нь бидний үйлчилгээний чанар болон найдвартай байдлыг нотолж байна.</p>',
    category: 'Компанийн мэдээ',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f02de8dd-1766471593137.png',
    imageAlt: 'Чанарын стандартын',
    publishedAt: '2026-03-15',
    readTime: '3 мин',
  },
  {
    title: 'Шинэ оффис цогцолборын галын систем',
    excerpt:
      'Бид 1,000 м² талбай бүхий орчин үеийн оффис цогцолборт зориулсан интеграцчилсан галын хамгаалалтын системийг амжилттай угсарлаа.',
    content:
      '<p>Бид 1,000 м² талбай бүхий орчин үеийн оффис цогцолборт зориулсан интеграцчилсан галын хамгаалалтын системийг амжилттай угсарлаа. Энэ төсөл нь манай инженерүүдийн мэргэжлийн ур чадварыг харуулсан томоохон амжилт байлаа.</p>',
    category: 'Төсөл',
    image: 'https://images.unsplash.com/photo-1500565468401-c273cdd7a5ef',
    imageAlt: 'архитектур',
    publishedAt: '2025-02-28',
    readTime: '5 мин',
  },
  {
    title: 'Цахилгаан автоматжуулалтын шинэ технологи',
    excerpt:
      'Бид шинэ үеийн PLC болон SCADA системийн сургалтыг амжилттай дуусгасан мэргэжилтнүүдийн талаар.',
    content:
      '<p>Бид шинэ үеийн PLC болон SCADA системийн сургалтыг амжилттай дуусгасан мэргэжилтнүүдийн талаар дэлгэрэнгүй мэдээллийг хуваалцаж байна. Эдгээр сургалт нь манай баг хамт олны техникийн мэдлэгийг ахиулсан.</p>',
    category: 'Технологи',
    image:
      'https://img.rocket.new/generatedImages/rocket_gen_img_148181f81-1774334173085.png',
    imageAlt: 'Цахилгаан хяналтын самбар — орчин үеийн технологи',
    publishedAt: '2026-02-10',
    readTime: '4 мин',
  },
  {
    title: 'БНХАУ-ын компанитай хамтын ажиллагааны гэрээ зурлаа',
    excerpt:
      'Ухаалаг барилгын шийдлүүдийг Монголд нэвтрүүлэх чиглэлээр хятадын компанитай стратегийн хамтын ажиллагааны гэрээ байгуулав.',
    content:
      '<p>Ухаалаг барилгын шийдлүүдийг Монголд нэвтрүүлэх чиглэлээр хятадын нэртэй компанитай стратегийн хамтын ажиллагааны гэрээ байгуулав. Энэ хамтын ажиллагаа нь манай үйлчилгээний хүрээг өргөжүүлэхэд чухал алхам болно.</p>',
    category: 'Хамтын ажиллагаа',
    image:
      'https://img.rocket.new/generatedImages/rocket_gen_img_1f289f655-1773189185175.png',
    imageAlt: 'хамтын ажиллагааны гэрээ',
    publishedAt: '2026-01-20',
    readTime: '3 мин',
  },
];

async function ensureTable() {
  try {
    await tables.getTable({ databaseId, tableId });
    console.log('✓ Table аль хэдийн байна.');
    return;
  } catch {}

  console.log('Table байхгүй, үүсгэж байна...');
  await tables.createTable({
    databaseId,
    tableId,
    name: 'News CMS',
    rowSecurity: false,
    enabled: true,
    columns: [
      { key: 'title', type: 'string', size: 500, required: false, default: '' },
      { key: 'excerpt', type: 'string', size: 1000, required: false, default: '' },
      { key: 'content', type: 'string', size: 32768, required: false, default: '' },
      { key: 'category', type: 'string', size: 200, required: false, default: '' },
      { key: 'image', type: 'string', size: 1000, required: false, default: '' },
      { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
      { key: 'publishedAt', type: 'string', size: 30, required: false, default: '' },
      { key: 'readTime', type: 'string', size: 50, required: false, default: '' },
    ],
  });
  console.log('✓ Table үүслээ.');
}

async function main() {
  console.log(`\n📰 Мэдээний seed эхлэж байна...`);
  console.log(`   Endpoint : ${endpoint}`);
  console.log(`   Database : ${databaseId}`);
  console.log(`   Table    : ${tableId}\n`);

  await ensureTable();

  for (const article of SEED_ARTICLES) {
    const rowId = ID.unique();
    await tables.upsertRow({
      databaseId,
      tableId,
      rowId,
      data: article,
    });
    console.log(`✓ "${article.title}" (${article.publishedAt})`);
  }

  console.log(`\n✅ ${SEED_ARTICLES.length} мэдээ амжилттай бичигдлээ.\n`);
}

main().catch((err) => {
  console.error('❌ Seed алдаа:', err);
  process.exit(1);
});
