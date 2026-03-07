"use client";

import HeaderImage from "@/components/layout/HeaderImage";
import RunningNotifications from "@/components/layout/RunningNotifications";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import WhyJoinUs from "@/components/home/WhyJoinUs";
import StudentAchievements from "@/components/home/StudentAchievements";
import CalendarUpdates from "@/components/home/CalendarUpdates";
import ClubTimeline from "@/components/home/ClubTimeline";
import ClubHighlights from "@/components/home/ClubHighlights";
import VoicesSection from "@/components/home/VoicesSection";
import SemiconductorEmployers from "@/components/home/SemiconductorEmployers";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      {/* Header Image - Only on home page */}
      <HeaderImage />

      {/* Navbar - Shows on all pages, but here for home */}
      <Navbar />

      {/* Running Notifications - Only on home page */}
      <RunningNotifications />

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Why Join Us */}
        <WhyJoinUs />

        {/* Student Achievements */}
        <StudentAchievements />

        {/* Calendar & Updates */}
        <CalendarUpdates />

       

        {/* Club Timeline */}
        <ClubTimeline />

        {/* Club Highlights with Carousel */}
        <ClubHighlights />

        {/* Voices Building Silicon Era */}
        <VoicesSection />

        {/* Semiconductor Employers */}
        <SemiconductorEmployers />

        {/* Newsletter CTA
        <NewsletterSection /> */}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
