"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, ChevronDown, ChevronLeft, ChevronRight, Mail, Linkedin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const TEAM_DESCRIPTIONS = {
  "Executive Team": "The strategic core of VLSID, responsible for vision, leadership, and overall club governance.",
  "Events Organising Team": "The creative minds behind our workshops, webinars, and signature events, ensuring seamless execution.",
  "Knowledge Transfer Team": "Dedicated to bridging the gap between theory and practice through peer-to-peer learning and mentorship.",
  "Question Bank & Resource Collection Team": "Curating high-quality study materials, past papers, and technical resources for the community.",
  "Alumni Interaction With Junior Team": "Building strong bonds between current students and our successful alumni network for guidance and opportunities.",
  "Juniors Recruitment Team": "Finding and onboarding the next generation of passionate VLSI enthusiasts to join our journey.",
  "Juniors Coordinator Team": "Mentoring and guiding our junior members as they transition into core roles within the club.",
  "Designing Team": "The visual architects who craft our brand identity, social media graphics, and event aesthetics.",
  "Promotion & Insta Handling Team": "Amplifying our voice across digital platforms and managing our vibrant social media presence.",
  "Documentation Team": "The record-keepers who preserve our legacy through detailed reports, blogs, and archival management.",
  "Web Handling Team": "The technical wizards maintaining and enhancing our digital home and web-based tools.",
  "Central Coordinating Team": "The operational backbone that synchronizes different departments for unified progress.",
  "Outreach Team": "Expanding our horizons through collaborations and industry connect programs.",
  "Translation & Data Handling Team": "Specialized in multilingual content and efficient data management for club operations."
};

export default function TeamPage() {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fetch core members
  const { data: coreMembersData, isLoading: loadingCoreMembers } = useQuery({
    queryKey: ["coreMembers"],
    queryFn: () => apiClient.get(API_ENDPOINTS.CORE_MEMBERS.BASE),
  });

  // Fetch team photos
  const { data: teamPhotosData, isLoading: loadingTeamPhotos } = useQuery({
    queryKey: ["teamPhotos"],
    queryFn: () => apiClient.get(API_ENDPOINTS.TEAM_PHOTOS.BASE),
  });

  // Backend returns array directly
  const allCoreMembers = Array.isArray(coreMembersData?.data)
    ? coreMembersData.data
    : Array.isArray(coreMembersData?.data?.data)
      ? coreMembersData.data.data
      : [];

  // Backend returns array directly
  const teamPhotos = Array.isArray(teamPhotosData?.data)
    ? teamPhotosData.data
    : Array.isArray(teamPhotosData?.data?.data)
      ? teamPhotosData.data.data
      : [];

  // Filter members by selected year
  const filteredMembers = allCoreMembers.filter(
    (member) => member.academicYear === selectedYear
  );

  // Get unique academic years for dropdown
  const academicYears = [...new Set(allCoreMembers.map((m) => m.academicYear))]
    .sort()
    .reverse();

  // Handle year selection change
  useEffect(() => {
    if (academicYears.length > 0 && !academicYears.includes(selectedYear)) {
      setSelectedYear(academicYears[0]);
    }
  }, [academicYears, selectedYear]);

  // Define hierarchy order
  const hierarchyOrder = Object.keys(TEAM_DESCRIPTIONS);

  // Group members by portfolio
  const groupedByPortfolio = filteredMembers.reduce((acc, member) => {
    const portfolio = member.portfolio || "Other";
    if (!acc[portfolio]) {
      acc[portfolio] = [];
    }
    acc[portfolio].push(member);
    return acc;
  }, {});

  // Sort portfolios by hierarchy
  const sortedPortfolios = Object.keys(groupedByPortfolio).sort((a, b) => {
    const indexA = hierarchyOrder.indexOf(a);
    const indexB = hierarchyOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Get member image
  const getMemberImage = (member) => {
    if (member.image && Object.keys(member.image).length > 0) {
      return bufferToDataURL(member.image);
    }
    return null;
  };

  // Get team photos for current year
  const getTeamPhotosByYear = () => {
    const photoRecord = teamPhotos.find((p) => p.academicYear === selectedYear);
    if (photoRecord && photoRecord.images && Array.isArray(photoRecord.images)) {
      return photoRecord.images.map(img => bufferToDataURL(img.imageData)).filter(Boolean);
    }
    // Fallback if images is not an array yet (old data)
    if (photoRecord && photoRecord.imageData) {
       return [bufferToDataURL(photoRecord.imageData)].filter(Boolean);
    }
    return [];
  };

  const currentYearPhotos = getTeamPhotosByYear();

  // Photo Navigation
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % currentYearPhotos.length);
  };
  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + currentYearPhotos.length) % currentYearPhotos.length);
  };

  const isLoading = loadingCoreMembers || loadingTeamPhotos;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span>Home</span>
          </Link>

          <Button variant="outline" size="sm" asChild className="hidden sm:flex border-blue-200 text-blue-700 hover:bg-blue-50">
            <Link href="/club-members">Join Club Members</Link>
          </Button>
        </div>
      </div>

      {/* Hero Carousel Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        {currentYearPhotos.length > 0 ? (
          <div className="relative h-[400px] md:h-[600px] w-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
                src={currentYearPhotos[currentPhotoIndex]}
                alt={`Team ${selectedYear}`}
                className="w-full h-full object-cover opacity-80"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Carousel Controls */}
            {currentYearPhotos.length > 1 && (
              <>
                <button 
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                  {currentYearPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-blue-500 w-6' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute bottom-20 left-0 right-0 text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
              >
                Meet our team <span className="text-blue-500 italic font-medium">members</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-300 max-w-2xl mx-auto font-light"
              >
                At VLSI:ID, we are powered by a community of innovators, leaders, and dreamers dedicated to building the future of semiconductors.
              </motion.p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 py-32 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white">Meet our team members</h1>
          </div>
        )}
      </section>

      {/* Year & Navigation Section */}
      <section className="bg-white border-b sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    VLSI:ID CLUB Core Members
                </h2>
                <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Academic Year: {selectedYear}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 font-semibold text-slate-700 hover:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer"
                    >
                        {academicYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
                        size={18}
                    />
                </div>
                
                <Link href="/club-members">
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20">
                        View Club Members
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* Team Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Assembling the team...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-20 text-center shadow-xl border border-slate-100"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Users size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Core Members Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any team records for {selectedYear}. Please check another academic year or contact support.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-32">
            {sortedPortfolios.map((portfolio) => {
              const members = groupedByPortfolio[portfolio];
              const desc = TEAM_DESCRIPTIONS[portfolio] || "Passionate contributors working together to drive excellence and innovation.";

              return (
                <motion.div
                  key={portfolio}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
                >
                  {/* Category Header */}
                  <div className="text-center max-w-3xl mx-auto">
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        {portfolio}
                    </h3>
                    <p className="text-slate-500 text-lg font-light leading-relaxed">
                        {desc}
                    </p>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mt-8 shadow-sm" />
                  </div>

                  {/* Members Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 justify-items-center">
                    {members.map((member, idx) => {
                      const imageUrl = getMemberImage(member);

                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -10 }}
                          className="group relative flex flex-col items-center w-full max-w-[320px]"
                        >
                          {/* Profile Image Container */}
                          <div className="relative w-56 h-56 md:w-64 md:h-64 mb-8">
                             {/* Decorative Rings */}
                             <div className="absolute inset-0 rounded-full border-2 border-slate-100 group-hover:border-blue-200 transition-colors duration-500" />
                             <div className="absolute -inset-2 rounded-full border border-dashed border-slate-200 group-hover:border-blue-400 group-hover:rotate-45 transition-all duration-1000" />
                             <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 rounded-full bg-blue-500/5 blur-xl transition-opacity" />

                             <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black">
                                    {member.name.charAt(0)}
                                </div>
                                )}
                             </div>
                             
                             {/* Portfolio Tag */}
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-slate-100 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <span className="text-xs font-bold text-blue-600 whitespace-nowrap uppercase tracking-wider">
                                    {member.category}
                                </span>
                             </div>
                          </div>

                          {/* Member Info */}
                          <div className="text-center space-y-2">
                             <h4 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                                {member.name}
                             </h4>
                             <p className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                                {member.portfolio}
                             </p>
                             
                             <div className="pt-2 text-slate-500 text-sm font-medium space-y-1">
                                {member.rollNumber && (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className="opacity-60">Roll No:</span>
                                        <span className="text-slate-700">{member.rollNumber}</span>
                                    </div>
                                )}
                                {member.sectionBranch && (
                                    <p className="text-slate-400 italic font-normal">{member.sectionBranch}</p>
                                )}
                             </div>
                             
                             {/* Social Links (Mockup for now) */}
                             <div className="flex items-center justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-md">
                                    <Mail size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-all shadow-md">
                                    <Linkedin size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all shadow-md">
                                    <ExternalLink size={16} />
                                </a>
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Join the Vision Footer */}
      <section className="bg-slate-900 py-32 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                Want to be part of our <span className="text-blue-500">legacy?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 font-light leading-relaxed">
                Join our club members list to stay updated with club activities and contribute to our mission.
            </p>
            <Link href="/club-members">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                    Explore Club Members
                </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}
