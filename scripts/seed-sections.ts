/**
 * Seed script — stats, services, projects, hero slide өгөгдлийг database-т бичнэ.
 * Run: bun scripts/seed-sections.ts
 */

import { Client, TablesDB, ID } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';
const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY ?? '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('❌ .env тохиргоо дутуу байна. NEXT_PUBLIC_APPWRITE_* хувьсагчдыг шалгана уу.');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tables = new TablesDB(client);

// ─── Table IDs ────────────────────────────────────────────────────────────────
const STATS_TABLE = process.env.APPWRITE_STATS_TABLE_ID ?? 'statsItems';
const SERVICES_TABLE = process.env.APPWRITE_SERVICES_TABLE_ID ?? 'servicesItems';
const PROJECTS_TABLE = process.env.APPWRITE_PROJECTS_TABLE_ID ?? 'projectsItems';
const HERO_TABLE = process.env.APPWRITE_HERO_SLIDES_TABLE_ID ?? 'heroSlides';

// ─── Seed data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '50', suffix: '+', label: 'Дууссан төсөл', sublabel: '2015 оноос хойш', color: '#F97316' },
  { value: '10', suffix: '+', label: 'Жилийн туршлага', sublabel: 'Салбарт ажилласан', color: '#4F8EF7' },
  { value: '98', suffix: '%', label: 'Сэтгэл ханамж', sublabel: 'Хэрэглэгчийн үнэлгээ', color: '#4ADE80' },
  { value: '10', suffix: '+', label: 'Мэргэжилтэн', sublabel: 'Баталгаажсан инженер', color: '#60A5FA' },
];

const SERVICES = [
  {
    title: 'Галын дохиолол',
    subtitle: 'Fire Alarm Systems',
    description: 'Барилга байгууламжид зориулсан орчин үеийн галын дохиоллын системийн зураг зурах, угсрах, тохируулах, засвар үйлчилгээ.',
    features: JSON.stringify(['Автомат илрүүлэгч', 'Дуут дохио', 'Удирдлагын самбар', 'Сүлжээний холболт']),
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1214c9fe1-1767106949267.png',
    imageAlt: 'Галын дохиоллын систем',
    color: '#E8390E',
  },
  {
    title: 'Холбоо дохиолол',
    subtitle: 'Communication Systems',
    description: 'Дотоод холбоо, мэдээлэл дамжуулах сүлжээний бүрэн шийдэл.',
    features: JSON.stringify(['IP камер сүлжээ', 'Интерком систем', 'Өгөгдөл дамжуулалт']),
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_145576cb2-1774334171541.png',
    imageAlt: 'Холбоо дохиоллын сүлжээ',
    color: '#60A5FA',
  },
  {
    title: 'Цахилгаан автоматжуулалт',
    subtitle: 'Electrical Automation',
    description: 'Ухаалаг барилгын цахилгаан систем, автомат удирдлага.',
    features: JSON.stringify(['BMS систем', 'PLC программчлал', 'SCADA']),
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156210e3c-1774334168862.png',
    imageAlt: 'Цахилгаан автоматжуулалтын хяналтын самбар',
    color: '#F5A623',
  },
  {
    title: 'Зураг төсөл',
    subtitle: 'Design & Engineering',
    description: 'Мэргэжлийн инженерийн зураг, техникийн тооцоо, стандарт нийцлийн баримт бичиг.',
    features: JSON.stringify(['AutoCAD зураг', 'Техникийн тооцоо', 'Стандарт нийцэл', 'Тендер баримт']),
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/4/412038295/WX/UR/LC/110083320/fire-fighting-services-500x500.jpeg',
    imageAlt: 'Зураг төслийн инженерийн баримт бичиг',
    color: '#4ADE80',
  },
];

const PROJECTS = [
  { title: 'Оффис цогцолбор', category: 'Галын дохиолол', year: '2023', area: '12,400 м²', image: 'https://images.unsplash.com/photo-1602917058415-d86121146559', imageAlt: 'Орчин үеийн оффис барилга', tags: JSON.stringify(['Галын дохиолол', 'Яаралтай гаралт']) },
  { title: 'Худалдааны төв', category: 'Холбоо систем', year: '2025', area: '28,000 м²', image: 'https://images.unsplash.com/photo-1603286658321-7efc940586e8', imageAlt: 'Том худалдааны төвийн дотоод орчин', tags: JSON.stringify(['IP камер', 'Холбоо систем', 'BMS']) },
  { title: 'Үйлдвэрийн байр', category: 'Автоматжуулалт', year: '2023', area: '45,000 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10fd2a923-1774334171785.png', imageAlt: 'Үйлдвэрийн автоматжуулалтын систем', tags: JSON.stringify(['PLC', 'SCADA', 'Автоматжуулалт']) },
  { title: 'Эмнэлгийн галын хамгаалалт', category: 'Галын дохиолол', year: '2022', area: '8,200 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1173a1a84-1772116864140.png', imageAlt: 'Эмнэлгийн барилга', tags: JSON.stringify(['Галын дохиолол', 'Спринклер']) },
  { title: 'Орон сууцны цогцолборын цахилгаан', category: 'Автоматжуулалт', year: '2022', area: '32,000 м²', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cdee142b-1767354989556.png', imageAlt: 'Орон сууцны цогцолбор', tags: JSON.stringify(['Цахилгаан', 'Гэрэлтүүлэг', 'BMS']) },
  { title: 'Зочид буудлын камерын систем', category: 'Зураг төсөл', year: '2019', area: '15,600 м²', image: 'https://images.unsplash.com/photo-1694973283525-2b3840f7c08a', imageAlt: 'Зочид буудлын лобби', tags: JSON.stringify(['Интеграци', 'Зураг төсөл', 'Дуусгавар']) },
];

const HERO_SLIDES = [
  {
    title: 'Галын\nдохиолол &\nЦахилгаан\nАвтоматжуулалт',
    subtitle: 'Инженерийн цогц шийдэл',
    description: 'Галын дохиолол, холбоо дохиолол болон цахилгаан автоматжуулалтын зураг төсөл, угсралтын цогц үйлчилгээ.',
    bannerText: '10+ жилийн туршлага · 50+ дууссан төсөл',
    imageSrc: 'https://img.rocket.new/generatedImages/rocket_gen_img_1171d4649-1772595593394.png',
    imageAlt: 'Цахилгаан угсралтын ажил — инженер хяналтын самбарт ажиллаж байна',
    rotationSeconds: '4',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function ensureTable(tableId: string, name: string, columns: object[]) {
  try {
    await tables.getTable({ databaseId, tableId });
    console.log(`  ✓ Table "${tableId}" аль хэдийн байна.`);
    return;
  } catch {}
  console.log(`  Table "${tableId}" байхгүй, үүсгэж байна...`);
  await tables.createTable({ databaseId, tableId, name, rowSecurity: false, enabled: true, columns } as Parameters<typeof tables.createTable>[0]);
  console.log(`  ✓ Table "${tableId}" үүслээ.`);
}

async function seedRows(tableId: string, rows: object[]) {
  for (const data of rows) {
    const rowId = ID.unique();
    await tables.upsertRow({ databaseId, tableId, rowId, data });
    const label = (data as Record<string, string>).title ?? (data as Record<string, string>).label ?? rowId;
    console.log(`    ✓ "${label}"`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Seed эхлэж байна...');
  console.log(`   Endpoint : ${endpoint}`);
  console.log(`   Database : ${databaseId}\n`);

  // Stats
  console.log('📊 Stats:');
  await ensureTable(STATS_TABLE, 'Stats Items', [
    { key: 'value', type: 'string', size: 20, required: false, default: '0' },
    { key: 'suffix', type: 'string', size: 20, required: false, default: '' },
    { key: 'label', type: 'string', size: 200, required: false, default: '' },
    { key: 'sublabel', type: 'string', size: 200, required: false, default: '' },
    { key: 'color', type: 'string', size: 20, required: false, default: '' },
  ]);
  await seedRows(STATS_TABLE, STATS);

  // Services
  console.log('\n🛠 Services:');
  await ensureTable(SERVICES_TABLE, 'Services Items', [
    { key: 'title', type: 'string', size: 300, required: false, default: '' },
    { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
    { key: 'description', type: 'string', size: 2000, required: false, default: '' },
    { key: 'features', type: 'string', size: 2000, required: false, default: '[]' },
    { key: 'image', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'color', type: 'string', size: 20, required: false, default: '' },
  ]);
  await seedRows(SERVICES_TABLE, SERVICES);

  // Projects
  console.log('\n🏗 Projects:');
  await ensureTable(PROJECTS_TABLE, 'Projects Items', [
    { key: 'title', type: 'string', size: 300, required: false, default: '' },
    { key: 'category', type: 'string', size: 200, required: false, default: '' },
    { key: 'year', type: 'string', size: 10, required: false, default: '' },
    { key: 'area', type: 'string', size: 50, required: false, default: '' },
    { key: 'image', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'tags', type: 'string', size: 1000, required: false, default: '[]' },
  ]);
  await seedRows(PROJECTS_TABLE, PROJECTS);

  // Hero slides
  console.log('\n🖼 Hero slides:');
  await ensureTable(HERO_TABLE, 'Hero Slides', [
    { key: 'title', type: 'string', size: 500, required: false, default: '' },
    { key: 'subtitle', type: 'string', size: 300, required: false, default: '' },
    { key: 'description', type: 'string', size: 2000, required: false, default: '' },
    { key: 'bannerText', type: 'string', size: 300, required: false, default: '' },
    { key: 'imageSrc', type: 'string', size: 1000, required: false, default: '' },
    { key: 'imageAlt', type: 'string', size: 500, required: false, default: '' },
    { key: 'rotationSeconds', type: 'string', size: 5, required: false, default: '4' },
  ]);
  await seedRows(HERO_TABLE, HERO_SLIDES);

  console.log('\n✅ Бүх өгөгдөл амжилттай бичигдлээ.\n');
}

main().catch((err) => {
  console.error('❌ Seed алдаа:', err);
  process.exit(1);
});
