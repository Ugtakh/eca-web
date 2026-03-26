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

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen overflow-hidden">
      <Header />
      <ScrollAnimationInit />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TeamSection />
      {/* <TestimonialsSection /> */}
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
