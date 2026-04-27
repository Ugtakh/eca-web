import React from 'react';

import AppImage from '@/components/ui/AppImage';
import { defaultServicesSectionContent, type ServiceItem, type ServicesSectionContent } from '@/lib/cms/services-section';

interface ServicesSectionProps {
  content: ServicesSectionContent;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  const services =
    content.services.length > 0 ? content.services : defaultServicesSectionContent.services;

  const primaryService = services[0];
  const secondaryServices = services.slice(1);

  return (
    <section className="section-pad" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal-up mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="tag-badge mb-4 inline-flex">Үйлчилгээнүүд</div>
            <h2 className="font-display text-4xl font-800 tracking-tight text-foreground md:text-5xl">
              Бидний цогц
              <br />
              үйлчилгээ
            </h2>
          </div>
          <p className="max-w-sm text-right text-muted">
            Зураг зурахаас эхлэн угсралт, засвар хүртэл бүх шатанд мэргэжлийн үйлчилгээ
          </p>
        </div>

        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {primaryService && (
            <div className="reveal-left lg:col-span-2 lg:row-span-2">
              <ServiceCard service={primaryService} />
            </div>
          )}

          {secondaryServices.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className={`reveal-up ${index === 2 ? 'lg:col-span-3' : ''}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-surface card-hover">
      {service.image ? (
        <div className="absolute inset-0">
          <AppImage
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>
      ) : (
        <div
          className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-10 blur-3xl"
          style={{ background: service.color }}
        />
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div>
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${service.color}20`, border: `1px solid ${service.color}30` }}
          >
            <div className="h-4 w-4 rounded-sm" style={{ background: service.color }} />
          </div>

          <p className="mb-1 text-xs font-mono text-muted-2">{service.subtitle}</p>
          <h3 className="mb-2 font-display text-xl font-700 text-foreground">{service.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{service.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="rounded-lg border border-white/5 bg-surface-3 px-2.5 py-1 text-xs text-muted"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
