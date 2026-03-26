import React from 'react';
import AppImage from '@/components/ui/AppImage';

const services = [
  {
    id: 1,
    title: 'Галын дохиолол',
    subtitle: 'Fire Alarm Systems',
    description:
      'Барилга байгууламжид зориулсан орчин үеийн галын дохиоллын системийн зураг зурах, угсрах, тохируулах, засвар үйлчилгээ.',
    features: ['Автомат илрүүлэгч', 'Дуут дохио', 'Удирдлагын самбар', 'Сүлжээний холболт'],
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1214c9fe1-1767106949267.png',
    imageAlt: 'Галын дохиоллын систем — улаан дохиоллын детектор суурилуулж байна',
    color: '#E8390E',
    span: 'bento-wide bento-tall',
    big: true,
  },
  {
    id: 2,
    title: 'Холбоо дохиолол',
    subtitle: 'Communication Systems',
    description: 'Дотоод холбоо, мэдээлэл дамжуулах сүлжээний бүрэн шийдэл.',
    features: ['IP камер сүлжээ', 'Интерком систем', 'Өгөгдөл дамжуулалт'],
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_145576cb2-1774334171541.png',
    imageAlt: 'Холбоо дохиоллын сүлжээний серверийн өрөө',
    color: '#60A5FA',
    span: '',
    big: false,
  },
  {
    id: 3,
    title: 'Цахилгаан автоматжуулалт',
    subtitle: 'Electrical Automation',
    description: 'Ухаалаг барилгын цахилгаан систем, автомат удирдлага.',
    features: ['BMS систем', 'PLC программчлал', 'SCADA'],
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156210e3c-1774334168862.png',
    imageAlt: 'Цахилгаан автоматжуулалтын хяналтын самбар',
    color: '#F5A623',
    span: '',
    big: false,
  },
  {
    id: 4,
    title: 'Зураг төсөл',
    subtitle: 'Design & Engineering',
    description: 'Мэргэжлийн инженерийн зураг, техникийн тооцоо, стандарт нийцлийн баримт бичиг.',
    features: ['AutoCAD зураг', 'Техникийн тооцоо', 'Стандарт нийцэл', 'Тендер баримт'],
    image:
      'https://5.imimg.com/data5/SELLER/Default/2024/4/412038295/WX/UR/LC/110083320/fire-fighting-services-500x500.jpeg',
    imageAlt: '',
    color: '#4ADE80',
    span: '',
    big: false,
  },
  // {
  //   id: 5,
  //   title: 'Засвар үйлчилгээ',
  //   subtitle: 'Maintenance & Support',
  //   description: '24/7 техникийн дэмжлэг, урьдчилан сэргийлэх засвар, яаралтай дуудлага.',
  //   features: ['24/7 дэмжлэг', 'Урьдчилсан засвар', 'Яаралтай дуудлага'],
  //   image: '',
  //   imageAlt: '',
  //   color: '#A78BFA',
  //   span: '',
  //   big: false,
  // },
];

export default function ServicesSection() {
  return (
    <section className="section-pad" id="services">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal-up">
          <div>
            <div className="tag-badge mb-4 inline-flex">Үйлчилгээнүүд</div>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
              Бидний цогц
              <br />
              үйлчилгээ
            </h2>
          </div>
          <p className="text-muted max-w-sm text-right">
            Зураг зурахаас эхлэн угсралт, засвар хүртэл бүх шатанд мэргэжлийн үйлчилгээ
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
          {/* Big card — spans 2 cols + 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2 reveal-left">
            <ServiceCard service={services[0]} />
          </div>

          {/* Smaller cards */}
          {services.slice(1).map((service, i) => (
            <div
              key={service.id}
              className={`reveal-up ${i === 2 ? 'lg:col-span-3' : i}`}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof services)[0] }) {
  return (
    <div className="card-hover h-full rounded-2xl border border-white/5 bg-surface overflow-hidden relative group flex flex-col">
      {/* Image or color bg */}
      {service.image ? (
        <div className="absolute inset-0">
          <AppImage
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>
      ) : (
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
          style={{ background: service.color }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-between">
        <div>
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${service.color}20`, border: `1px solid ${service.color}30` }}
          >
            <div className="w-4 h-4 rounded-sm" style={{ background: service.color }} />
          </div>

          <p className="text-xs font-mono text-muted-2 mb-1">{service.subtitle}</p>
          <h3 className="font-display font-700 text-xl text-foreground mb-2">{service.title}</h3>
          <p className="text-muted text-sm leading-relaxed">{service.description}</p>
        </div>

        {/* Features */}
        <div className="mt-4 flex flex-wrap gap-2">
          {service.features.map((f) => (
            <span
              key={f}
              className="text-xs px-2.5 py-1 rounded-lg bg-surface-3 border border-white/5 text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
