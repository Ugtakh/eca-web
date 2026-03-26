import React from 'react';
import AppImage from '@/components/ui/AppImage';

const team = [
  {
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
    name: 'С. Бат-Эрдэнэ',
    role: 'Ахлах инженер',
    bio: 'Галын дохиоллын системийн зураг зурах, угсралтад 20+ жилийн туршлагатай.',
    image: '/assets/avatars/no-user-male.jpg',
    imageAlt: 'Ахлах инженер',
    certifications: ['Автокад', 'Галын систем', 'Үйлдвэрлэл'],
    linkedin: '#',
  },
  {
    name: 'Д. Энхбаяр',
    role: 'Автоматжуулалтын инженер',
    bio: 'Үйлдвэрийн автомажуулалт, PLC, SCADA систем 10+ жилийн туршлагатай',
    image: '/assets/avatars/no-user-male.jpg',
    imageAlt: 'Автоматжуулалтын инженер',
    certifications: ['Автокад', 'Автомажуулалт', 'ПЛС', 'Скада'],
    linkedin: '#',
  },
  // {
  //   name: 'Н. Солонго',
  //   role: 'Холбоо системийн мэргэжилтэн',
  //   bio: 'IP сүлжээ, камерын систем болон интерком шийдлийн туршлагатай инженер.',
  //   image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c5dd9845-1773975980350.png',
  //   imageAlt: 'Холбоо системийн мэргэжилтэн Н. Солонго — эмэгтэй инженер',
  //   certifications: ['AutoCAD'],
  //   linkedin: '#',
  // },
  // {
  //   name: 'Т. Мөнхбаяр',
  //   role: 'Зураг төслийн инженер',
  //   bio: 'AutoCAD, Revit MEP ашиглан инженерийн зураг боловсруулах чиглэлийн мэргэжилтэн.',
  //   image: 'https://img.rocket.new/generatedImages/rocket_gen_img_134ae899f-1763299270214.png',
  //   imageAlt: 'Зураг төслийн инженер Т. Мөнхбаяр — залуу эрэгтэй',
  //   certifications: ['AutoCAD'],
  //   linkedin: '#',
  // },
  // {
  //   name: 'Х. Анхтуяа',
  //   role: 'Төслийн менежер',
  //   bio: 'Олон томоохон төслийг амжилттай удирдсан туршлагатай. PMP сертификат эзэмшигч.',
  //   image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ee492086-1772204294242.png',
  //   imageAlt: 'Төслийн менежер Х. Анхтуяа — мэргэжлийн хувцастай эмэгтэй',
  //   certifications: ['AutoCAD'],
  //   linkedin: '#',
  // },
];

export default function TeamSection() {
  return (
    <section className="section-pad" id="team">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14 reveal-up">
          <div className="tag-badge mb-4 inline-flex">Баг</div>
          <h2 className="font-display font-800 text-4xl md:text-5xl text-foreground tracking-tight">
            Мэргэжлийн баг
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            Олон улсын сертификаттай, туршлагатай инженерүүдийн баг таны төслийг хариуцна
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team?.map((member, i) => (
            <div
              key={member?.name}
              className="reveal-up group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="card-hover p-5 rounded-2xl border border-white/5 bg-surface flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <AppImage
                      src={member?.image}
                      alt={member?.imageAlt}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Name & role */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-700 text-foreground text-base leading-tight">
                      {member?.name}
                    </h3>
                    <p className="text-accent text-xs mt-0.5 leading-tight">{member?.role}</p>
                  </div>

                  {/* LinkedIn */}
                  <a
                    href={member?.linkedin}
                    className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`${member?.name} LinkedIn`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>

                {/* Bio */}
                <p className="text-muted text-sm leading-relaxed">{member?.bio}</p>

                {/* Certs */}
                <div className="flex flex-wrap gap-1.5">
                  {member?.certifications?.map((cert) => (
                    <span
                      key={cert}
                      className="text-xs px-2 py-0.5 rounded-md font-mono bg-surface-3 border border-white/5 text-muted-2"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
