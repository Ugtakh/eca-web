import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import ServicesSection from '../components/sections/ServicesSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ProcessSection from '../components/sections/ProcessSection';
import TeamSection from '../components/sections/TeamSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';
import NewsSection from '../components/sections/NewsSection';
import ScrollAnimationInit from '../components/sections/ScrollAnimationInit';
import { getHeroSectionContent } from '@/lib/cms/hero-section';
import { getStatsSectionContent } from '@/lib/cms/stats-section';
import { getServicesSectionContent } from '@/lib/cms/services-section';
import { getProjectsSectionContent } from '@/lib/cms/projects-section';
import { getTeamSectionContent, defaultTeamSectionContent } from '@/lib/cms/team-section';
import { getLatestNews } from '@/lib/cms/news';
import { getContactSectionInfo, defaultContactInfo } from '@/lib/cms/contact-info';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    heroContent,
    statsContent,
    servicesContent,
    projectsContent,
    teamContent,
    newsArticles,
    contactInfo,
  ] = await Promise.all([
    getHeroSectionContent(),
    getStatsSectionContent(),
    getServicesSectionContent(),
    getProjectsSectionContent(),
    getTeamSectionContent().catch(() => defaultTeamSectionContent),
    getLatestNews(4).catch(() => []),
    getContactSectionInfo().catch(() => defaultContactInfo),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <Header />
      <ScrollAnimationInit />
      <HeroSection content={heroContent} />
      <StatsSection content={statsContent} />
      <ServicesSection content={servicesContent} />
      <ProjectsSection content={projectsContent} />
      <ProcessSection />
      <TeamSection content={teamContent} />
      {/* <TestimonialsSection /> */}
      <NewsSection articles={newsArticles} />
      <ContactSection info={contactInfo} />
      <Footer />
    </main>
  );
}
