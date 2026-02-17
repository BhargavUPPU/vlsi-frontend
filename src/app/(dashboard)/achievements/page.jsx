"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import {
  Trophy,
  Users,
  Layers,
  Eye,
  Award,
  ChevronLeft,
  ChevronRight,
  Milestone,
  ArrowLeft,
  Star,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useActiveAchievements } from "@/lib/hooks/useAdmin";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const awardColors = [
  "text-[#C9302C]",
  "text-[#0EA5E9]",
];

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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto mt-2 h-1 w-20 bg-[#3B4BB9] rounded-full"
    />
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

function VerticalProudCarousel({ proudData, proudImageErrors, setProudImageErrors }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", containScroll: "keepSnaps", align: "start" });

  useEffect(() => {
    if (!emblaApi || !proudData || proudData.length === 0) return;
    if (proudData.length <= 3) return; // auto-scroll only when > 3
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi, proudData]);

  if (!proudData || proudData.length === 0) return null;

  return (
    <div className="embla-viewport overflow-hidden rounded-2xl" ref={emblaRef}>
      <div className="flex flex-col">
        {proudData.map((moment) => (
          <div key={moment.id} className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 sm:gap-12 items-center"
              aria-live="polite"
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
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight underline decoration-gray-300 underline-offset-4">
                  {moment.title}
                </h3>
                <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {moment.description}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalAwardsCarousel({ awardData }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", containScroll: "keepSnaps", align: "center" });

  useEffect(() => {
    if (!emblaApi || !awardData || awardData.length === 0) return;
    if (awardData.length <= 3) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [emblaApi, awardData]);

  if (!awardData || awardData.length === 0) return null;

  return (
    <div className="embla-viewport overflow-hidden min-h-[220px] ]" ref={emblaRef}>
      <div className="flex flex-col items-center">
        {awardData.map((award, i) => (
          <div key={award.id} className="flex-shrink-0 w-full  flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 flex flex-col items-center text-center max-w-3xl mx-auto w-full"
            >
              <h3 className={`text-lg sm:text-xl md:text-2xl font-extrabold mb-2  decoration-gray-300 underline-offset-4 ${awardColors[i % awardColors.length]}`}>
                {award.title}
              </h3>
             
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}



// Production-ready count-up using Framer Motion and intersection observer
function CountUp({ value, duration: userDuration, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  // Normalize numeric value
  const target = Number(value) || 0;

  // Duration heuristic - keeps animation quick for small numbers and bounded
  const duration = typeof userDuration === "number"
    ? userDuration
    : Math.min(2.2, Math.max(0.8, Math.log10(Math.abs(target) + 1) * 0.6 + 0.6));

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(mv, target, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        // Round to integer for display; use Intl for grouping
        const rounded = Math.round(v);
        try {
          setDisplay(new Intl.NumberFormat().format(rounded));
        } catch {
          setDisplay(String(rounded));
        }
      },
    });

    return () => controls.stop();
  }, [isInView, target, mv, duration]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {display}+
    </span>
  );
}

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
  console.log("Hero Data:", heroData);
  console.log("Milestone Data:", milestoneData);
  console.log("Stat Data:", statData);
  console.log("Proud Data:", proudData);
  console.log("Award Data:", awardData);
  console.log("Gallery Data:", galleryData);
  console.log("Gallery Error:", galleryError);
  console.log("API_BASE_URL:", API_BASE_URL);

  const [activeHero, setActiveHero] = useState(0);

  // Normalize API responses which may be wrapped (e.g., { data: [...] })
  const _heroData = Array.isArray(heroData) ? heroData : heroData?.data || [];
  const _milestoneData = Array.isArray(milestoneData)
    ? milestoneData
    : milestoneData?.data || [];
  const _statData = Array.isArray(statData) ? statData : statData?.data || [];
  const _proudData = Array.isArray(proudData) ? proudData : proudData?.data || [];
  const _awardData = Array.isArray(awardData) ? awardData : awardData?.data || [];
  const _galleryData = Array.isArray(galleryData) ? galleryData : galleryData?.data || [];
  const [heroImageErrors, setHeroImageErrors] = useState({});
  const [proudImageErrors, setProudImageErrors] = useState({});
  const [awardImageErrors, setAwardImageErrors] = useState({});
  const [galleryImageErrors, setGalleryImageErrors] = useState({});
function ImageCard({ src, alt, title, onError }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -6 }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-100"
    >
      {!loaded && !err && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
      )}

      {!err ? (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${loaded ? "" : "opacity-0"}`}
          unoptimized
          onLoadingComplete={() => setLoaded(true)}
          onError={(e) => {
            setErr(true);
            onError?.(e);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <Layers className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
        <h4 className="text-white font-bold text-lg sm:text-xl md:text-2xl truncate">
          {title}
        </h4>
        {alt && (
          <p className="text-white/80 text-sm sm:text-base mt-1 line-clamp-2">{alt}</p>
        )}
      </div>
    </motion.div>
  );
}

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
    if (_heroData.length > 0) {
      const timer = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % _heroData.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [_heroData]);

  const statsIcons = {
    "Website Views": <Eye className="w-8 h-8 text-blue-500" />,
    "Core Members": <Users className="w-8 h-8 text-orange-500" />,
    "Projects Done": <Layers className="w-8 h-8 text-indigo-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Link
                href="/"
                className="group flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base m-4 sm:m-6"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span>Home &gt;&gt; Our Achievements</span>
              </Link>
      {/* Hero Section (title above carousel) */}
      {(heroLoading || _heroData.length > 0) && (
        <section role="region" aria-label="Hero" className="w-full bg-gray-50 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                Celebrating the excellence of the VLSI Club
              </h1>
              <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Innovation, research, and milestones from our community — spanning projects, papers, competitions, and internships.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl">
                {heroLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-300 border-t-transparent" />
                  </div>
                ) : (
                  <div className="relative">
                    {_heroData.map((hero, index) => (
                      <motion.div
                        key={hero.id ?? index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: activeHero === index ? 1 : 0, y: activeHero === index ? 0 : 10 }}
                        transition={{ duration: 0.6 }}
                        className={`rounded-xl overflow-hidden ${activeHero === index ? "block" : "hidden"}`}
                      >
                        <div className="w-full h-56 sm:h-72 md:h-96 bg-gray-200 relative rounded-xl">
                          {!heroImageErrors[hero.id] && hero.images?.[0]?.id ? (
                            <Image
                              src={`${API_BASE_URL}/achievements/image/${hero.images[0].id}`}
                              alt={hero.title || "Hero image"}
                              fill
                              className="object-cover rounded-xl"
                              unoptimized
                              onError={() => setHeroImageErrors((prev) => ({ ...prev, [hero.id]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                              <Trophy className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    <div className="flex items-center justify-center gap-3 mt-4">
                      {_heroData.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveHero(i)}
                          aria-label={`Show hero ${i + 1}`}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${activeHero === i ? "bg-blue-600 scale-110" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* End Hero Section */}
      {(milestoneLoading || _milestoneData.length > 0) && (
        <section className="py-6 px-3 sm:px-4 md:px-6">
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {_milestoneData.map((milestone) => (
                  <motion.div
                    key={milestone.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow"
                  >
                    <span className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                      {milestone.title}
                    </span>
                    <CountUp
                      value={milestone.value}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 transition-colors group-hover:text-[#3b82f6]"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Summary Stats */}
      {(statLoading || _statData.length > 0) && (
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
            ) : (
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
                {_statData.map((stat) => (
                  <motion.div
                    key={stat.id}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-3 sm:mb-4 bg-gray-50 p-3 sm:p-4 rounded-full">
                      {statsIcons[stat.title] || (
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                      )}
                    </div>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3b82f6] mb-1 sm:mb-2">
                      {stat.title}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                      {stat.value}+
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Proud Moments */}
      {(proudLoading || _proudData.length > 0) && (
        <section className="py-6 px-3 sm:px-4 md:px-6 bg-gray-50">
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
            ) : (
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
            )}
          </div>
        </section>
      )}

      {/* Awards & Achievements */}
      {(awardLoading || (awardData && awardData.length > 0)) && (
        <section className="py-6 px-3 sm:px-4 md:px-6 bg-white">
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
              ) : (
                <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
                  <VerticalAwardsCarousel awardData={_awardData} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
            ) : (
            _galleryData && _galleryData.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {_galleryData.flatMap((gallery) =>
                    gallery.images?.map((image, index) => (
                      <ImageCard
                        key={`${gallery.id}-${image.id}`}
                        src={`${API_BASE_URL}/achievements/image/${image.id}`}
                        alt={gallery.description || gallery.title || "Gallery Image"}
                        title={gallery.title || "Gallery"}
                        onError={() =>
                          setGalleryImageErrors((prev) => ({
                            ...prev,
                            [image.id]: true,
                          }))
                        }
                      />
                    )) || [],
                )}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
