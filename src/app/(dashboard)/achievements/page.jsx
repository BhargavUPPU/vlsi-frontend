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
  Star,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useActiveAchievements } from "@/lib/hooks/useAdmin";
import { useState, useEffect } from "react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-8 sm:mb-12 px-2">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const AchievementCard = ({ achievement }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="relative h-32 sm:h-40 md:h-48 w-full bg-gray-100">
        {!imageError && achievement.images?.[0]?.id ? (
          <Image
            src={`${API_BASE_URL}/achievements/image/${achievement.images[0].id}`}
            alt={achievement.title || "Achievement"}
            fill
            className="object-contain bg-white"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Award className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900 leading-tight">
          {achievement.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{achievement.description}</p>
      </div>
    </motion.div>
  );
};

export default function AchievementsPage() {
  const {
    data: heroData,
    isLoading: heroLoading,
    error: heroError,
  } = useActiveAchievements("HERO_CAROUSEL");
  const {
    data: milestoneData,
    isLoading: milestoneLoading,
    error: milestoneError,
  } = useActiveAchievements("CLUB_MILESTONE");
  const {
    data: statData,
    isLoading: statLoading,
    error: statError,
  } = useActiveAchievements("SUMMARY_STAT");
  const {
    data: proudData,
    isLoading: proudLoading,
    error: proudError,
  } = useActiveAchievements("PROUD_MOMENT");
  const {
    data: awardData,
    isLoading: awardLoading,
    error: awardError,
  } = useActiveAchievements("AWARD_HIGHLIGHT");
  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useActiveAchievements("GALLERY_IMAGE");
  console.log("Gallery Data:", galleryData);
  console.log("Gallery Error:", galleryError);
  console.log("API_BASE_URL:", API_BASE_URL);

  const [activeHero, setActiveHero] = useState(0);
  const [heroImageErrors, setHeroImageErrors] = useState({});
  const [proudImageErrors, setProudImageErrors] = useState({});
  const [awardImageErrors, setAwardImageErrors] = useState({});
  const [galleryImageErrors, setGalleryImageErrors] = useState({});

  // Log errors for debugging
  useEffect(() => {
    const errors = {
      heroError,
      milestoneError,
      statError,
      proudError,
      awardError,
      galleryError,
    };
    Object.entries(errors).forEach(([key, error]) => {
      if (error) {
        console.error(
          `Achievement fetch error (${key}):`,
          error?.response?.data || error?.message || error,
        );
      }
    });
  }, [
    heroError,
    milestoneError,
    statError,
    proudError,
    awardError,
    galleryError,
  ]);

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
    "Projects Done": <Layers className="w-8 h-8 text-indigo-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] overflow-hidden bg-gray-900">
        {heroLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-white border-t-transparent"></div>
          </div>
        ) : heroData?.length > 0 ? (
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
                {!heroImageErrors[hero.id] && hero.images?.[0]?.id ? (
                  <Image
                    src={`${API_BASE_URL}/achievements/image/${hero.images[0].id}`}
                    alt={hero.title || "Hero"}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    unoptimized
                    onError={() =>
                      setHeroImageErrors((prev) => ({
                        ...prev,
                        [hero.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-3 sm:px-4 md:px-6">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: activeHero === index ? 0 : 20,
                      opacity: activeHero === index ? 1 : 0,
                    }}
                    transition={{ delay: 0.5 }}
                    className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
                  >
                    {hero.title || "Celebrating Excellence"}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: activeHero === index ? 0 : 20,
                      opacity: activeHero === index ? 1 : 0,
                    }}
                    transition={{ delay: 0.7 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-lg md:max-w-2xl leading-relaxed"
                  >
                    {hero.description ||
                      "Innovation, research and milestone by our community"}
                  </motion.p>
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 sm:gap-2">
              {heroData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHero(i)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all ${activeHero === i ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white text-center px-3 sm:px-4 md:px-6">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              Celebrating the excellence of the VLSI Club
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-lg md:max-w-2xl leading-relaxed">
              Innovation, research and milestone by our community — spanning
              projects, papers, competitions, and internships.
            </p>
          </div>
        )}
      </section>

      {/* Club Milestones */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="CLUB MILESTONES" />
          {milestoneLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 h-24 sm:h-32 animate-pulse"
                ></div>
              ))}
            </div>
          ) : milestoneData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {milestoneData.map((milestone) => (
                <motion.div
                  key={milestone.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
                >
                  <span className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                    {milestone.title}
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {milestone.value}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {milestoneError
                ? "Failed to load milestones"
                : "No milestones available yet"}
            </div>
          )}
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-gray-100 flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full">
          {statLoading ? (
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 animate-pulse"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4"></div>
                  <div className="w-20 h-6 sm:w-24 sm:h-8 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                  <div className="w-16 h-3 sm:w-20 sm:h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : statData?.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
              {statData.map((stat) => (
                <motion.div
                  key={stat.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 sm:mb-4 bg-gray-50 p-3 sm:p-4 rounded-full">
                    {statsIcons[stat.title] || (
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                    )}
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3b82f6] mb-1 sm:mb-2">
                    {stat.title}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                    No of {stat.value}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {statError
                ? "Failed to load statistics"
                : "No statistics available yet"}
            </div>
          )}
        </div>
      </section>

      {/* Proud Moments */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="PROUD MOMENTS OF VLSID" />
          {proudLoading ? (
            <div className="space-y-8 sm:space-y-12">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 sm:gap-12 items-center animate-pulse"
                >
                  <div className="w-full md:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                  <div className="w-full md:w-1/2 space-y-3 sm:space-y-4">
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : proudData?.length > 0 ? (
            <div className="space-y-8 sm:space-y-12">
              {proudData.map((moment, index) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 sm:gap-12 items-center"
                >
                  <div className="w-full md:w-1/2 relative h-[200px] sm:h-[250px] md:h-[300px] rounded-xl sm:rounded-2xl overflow-hidden">
                    {!proudImageErrors[moment.id] && moment.images?.[0]?.id ? (
                      <Image
                        src={`${API_BASE_URL}/achievements/image/${moment.images[0].id}`}
                        alt={moment.title || "Proud Moment"}
                        fill
                        className="object-contain"
                        unoptimized
                        onError={() =>
                          setProudImageErrors((prev) => ({
                            ...prev,
                            [moment.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                      {moment.title}
                    </h3>
                    <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                      {moment.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {proudError
                ? "Failed to load proud moments"
                : "No proud moments available yet"}
            </div>
          )}
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 bg-white">
        <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl mx-auto">
          <div className="border-[1.5px] border-blue-200 rounded-2xl sm:rounded-3xl md:rounded-[2rem] p-6 sm:p-8 md:p-12 relative overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
            <h2 className="text-center text-[#3B4BB9] text-lg sm:text-xl md:text-2xl lg:text-3xl font-black underline underline-offset-4 sm:underline-offset-6 md:underline-offset-8 decoration-gray-300 mb-8 sm:mb-12 md:mb-16 uppercase tracking-wide sm:tracking-wider md:tracking-widest px-2">
              AWARDS & ACHIEVEMENTS
            </h2>
            {awardLoading ? (
              <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : awardData?.length > 0 ? (
              <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
                {awardData.map((award) => (
                  <motion.div
                    key={award.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 sm:gap-4 text-[#C9302C] font-bold text-sm sm:text-base md:text-lg lg:text-xl text-center justify-center leading-relaxed px-2"
                  >
                    <span className="shrink-0 text-lg sm:text-xl md:text-2xl">::</span>
                    <p className="break-words">{award.title}</p>
                    <span className="shrink-0 text-lg sm:text-xl md:text-2xl">::</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                {awardError
                  ? "Failed to load awards"
                  : "Awards list will appear here"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16 justify-center sm:justify-start">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-800" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              PHOTO GALLERY
            </h2>
          </div>
          {galleryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 sm:h-56 md:h-64 bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : galleryData?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {galleryData.flatMap(
                (gallery) =>
                  gallery.images?.map((image, index) => (
                    <motion.div
                      key={`${gallery.id}-${image.id}`}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group relative h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
                    >
                      {!galleryImageErrors[image.id] ? (
                        <Image
                          src={`${API_BASE_URL}/achievements/image/${image.id}`}
                          alt={
                            `${gallery.title} - Image ${index + 1}` ||
                            "Gallery Image"
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                          onError={() =>
                            setGalleryImageErrors((prev) => ({
                              ...prev,
                              [image.id]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Layers className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                        <h4 className="text-white font-bold text-sm sm:text-base md:text-lg">
                          {gallery.title}
                        </h4>
                        <p className="text-white/80 text-xs sm:text-sm mt-1">
                          {gallery.description}
                        </p>
                      </div>
                    </motion.div>
                  )) || [],
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {galleryError
                ? "Failed to load gallery images"
                : "No gallery images available yet"}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
