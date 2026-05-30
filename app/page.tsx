"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import GroupsSection from '@/components/landing/GroupsSection';
import MatchesSection from '@/components/landing/MatchesSection';
import TeamsSection from '@/components/landing/TeamsSection';
import VenuesSection from '@/components/landing/VenuesSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="bg-wc-dark min-h-screen selection:bg-wc-sky selection:text-wc-dark">
      <Navbar />
      <main>
        <Hero />
        <GroupsSection />
        <MatchesSection />
        <TeamsSection />
        <VenuesSection />
      </main>
      <Footer />
    </div>
  );
}
