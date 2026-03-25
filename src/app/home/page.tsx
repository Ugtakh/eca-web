import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ProcessSection from './components/ProcessSection';
import TeamSection from './components/TeamSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import NewsSection from './components/NewsSection';
import ScrollAnimationInit from './components/ScrollAnimationInit';

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
