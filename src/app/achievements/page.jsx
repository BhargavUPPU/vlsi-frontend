"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  Layers, 
  Eye, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Milestone,
  Star
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useActiveAchievements } from "@/lib/hooks/useAdmin";
import { useState, useEffect } from "react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl font-bold text-gray-900 mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-600 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const AchievementCard = ({ achievement }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
  >
    <div className="relative h-48 w-full bg-gray-100">
      <Image
        src={`${API_BASE_URL}/achievements/${achievement.id}/main-image`}
        alt={achievement.title || "Achievement"}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
    <div className="p-6">
      <h3 className="font-bold text-xl mb-2 text-gray-900">{achievement.title}</h3>
      <p className="text-gray-600 text-sm">{achievement.description}</p>
    </div>
  </motion.div>
);

export default function AchievementsPage() {
  const { data: heroData, isLoading: heroLoading } = useActiveAchievements('HERO_CAROUSEL');
  const { data: milestoneData, isLoading: milestoneLoading } = useActiveAchievements('CLUB_MILESTONE');
  const { data: statData, isLoading: statLoading } = useActiveAchievements('SUMMARY_STAT');
  const { data: proudData, isLoading: proudLoading } = useActiveAchievements('PROUD_MOMENT');
  const { data: awardData, isLoading: awardLoading } = useActiveAchievements('AWARD_HIGHLIGHT');
  const { data: galleryData, isLoading: galleryLoading } = useActiveAchievements('GALLERY_IMAGE');

  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    if (heroData?.length > 0) {
      const timer = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % heroData.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroData]);

  const statsIcons = {
    "Website Views": <Eye className="w-8 h-8 text-blue-500" />,
    "Core Members": <Users className="w-8 h-8 text-orange-500" />,
    "Projects Done": <Layers className="w-8 h-8 text-indigo-500" />
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-gray-900">
        {heroData?.length > 0 ? (
          <>
            {heroData.map((hero, index) => (
              <motion.div
                key={hero.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeHero === index ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                  src={`${API_BASE_URL}/achievements/${hero.id}/main-image`}
                  alt={hero.title || "Hero"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-4">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: activeHero === index ? 0 : 20, opacity: activeHero === index ? 1 : 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                  >
                    {hero.title || "Celebrating Excellence"}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: activeHero === index ? 0 : 20, opacity: activeHero === index ? 1 : 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg md:text-xl max-w-2xl"
                  >
                    {hero.description || "Innovation, research and milestone by our community"}
                  </motion.p>
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHero(i)}
                  className={`w-3 h-3 rounded-full transition-all ${activeHero === i ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Celebrating the excellence of the VLSI Club</h1>
            <p className="text-lg md:text-xl max-w-2xl">Innovation, research and milestone by our community — spanning projects, papers, competitions, and internships.</p>
          </div>
        )}
      </section>

      {/* Club Milestones */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="CLUB MILESTONES" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestoneData?.map((milestone) => (
              <motion.div
                key={milestone.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
              >
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">{milestone.title}</span>
                <span className="text-4xl font-bold text-gray-900">{milestone.value}</span>
              </motion.div>
            )) || (
              <>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-400">Add milestones in admin</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-20 bg-white border-y border-gray-100 flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {statData?.map((stat) => (
              <motion.div
                key={stat.id}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 bg-gray-50 p-4 rounded-full">
                  {statsIcons[stat.title] || <Star className="w-8 h-8 text-blue-500" />}
                </div>
                <span className="text-5xl font-extrabold text-[#3b82f6] mb-2">{stat.value}</span>
                <span className="text-gray-600 font-medium">No of {stat.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proud Moments */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="PROUD MOMENTS OF VLSID" />
          <div className="space-y-12">
            {proudData?.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-12 items-center"
              >
                <div className="w-full md:w-1/2 relative h-[300px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <Image
                    src={`${API_BASE_URL}/achievements/${moment.id}/main-image`}
                    alt={moment.title || "Proud Moment"}
                    fill
                    className="object-contain bg-white"
                    unoptimized
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">{moment.title}</h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {moment.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="border-[1.5px] border-blue-200 rounded-[2rem] p-12 relative overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
            <h2 className="text-center text-[#3B4BB9] text-3xl font-black underline underline-offset-8 decoration-gray-300 mb-16 uppercase tracking-widest">
              AWARDS & ACHIEVEMENTS
            </h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              {awardData?.map((award) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 text-[#C9302C] font-bold text-lg md:text-xl text-center justify-center leading-relaxed"
                >
                  <span className="shrink-0 text-2xl">::</span>
                  <p>{award.title}</p>
                  <span className="shrink-0 text-2xl">::</span>
                </motion.div>
              ))}
              {!awardData?.length && <p className="text-center text-gray-400">Awards list will appear here</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <Trophy className="w-10 h-10 text-gray-800" />
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">PHOTO GALLERY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {galleryData?.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={`${API_BASE_URL}/achievements/${photo.id}/main-image`}
                  alt={photo.title || "Gallery Image"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h4 className="text-white font-bold text-lg">{photo.title}</h4>
                  <p className="text-white/80 text-sm mt-1">{photo.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
