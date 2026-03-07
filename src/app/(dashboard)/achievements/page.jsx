"use client";

import { motion, useInView, useMotionValue, animate, AnimatePresence } from "framer-motion";
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
  X,
  ZoomIn,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useActiveAchievements } from "@/lib/hooks/useAdmin";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api/config";

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

function VerticalProudCarousel({ proudData, proudImageErrors, setProudImageErrors, proudImageFallback, setProudImageFallback }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: "x", 
    containScroll: "keepSnaps", 
    align: "start",
    loop: true 
  });
  const [selectedSlide, setSelectedSlide] = useState(0);
  const intervalRef = useRef(null);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setSelectedSlide(index);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !proudData || proudData.length <= 1) return;

    const onSelect = () => {
      setSelectedSlide(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, proudData?.length]);

  useEffect(() => {
    if (!emblaApi || !proudData || proudData.length <= 1) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(scrollNext, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [emblaApi, proudData?.length, scrollNext]);

  if (!proudData || proudData.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="embla-viewport overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {proudData.map((moment, index) => (
            <div key={moment.id} className="flex-shrink-0 w-full px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 sm:gap-12 items-center"
              >
                <div className="w-full md:w-1/2 relative h-[200px] sm:h-[250px] md:h-[300px] rounded-xl sm:rounded-2xl overflow-hidden">
                  {!proudImageErrors[moment.id] && moment.images?.[0]?.id ? (
                    <>
                      <Image
                        src={proudImageFallback[moment.id]
                          ? `${API_BASE_URL}/achievements/image/${moment.images[0].id}`
                          : `${API_BASE_URL}/achievements/thumbnail/${moment.images[0].id}`
                        }
                        alt={moment.title || "Proud Moment"}
                        fill
                        className="object-contain"
                        unoptimized
                        onError={() => {
                          const isFallback = proudImageFallback[moment.id];
                          
                          if (!isFallback) {
                            // First attempt failed (thumbnail), try full image silently
                            setProudImageFallback((prev) => ({ ...prev, [moment.id]: true }));
                          } else {
                            // Both attempts failed, log and show error
                            console.warn(`Image unavailable for proud moment "${moment.title}" (ID: ${moment.images[0].id})`);
                            setProudImageErrors((prev) => ({
                              ...prev,
                              [moment.id]: true,
                            }));
                          }
                        }}
                      />
                      {proudImageFallback[moment.id] && !proudImageErrors[moment.id] && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                          Loading...
                        </div>
                      )}
                    </>
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
      
      {/* Carousel indicators */}
      {proudData.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {proudData.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                selectedSlide === index ? "bg-blue-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Production-level Vertical Marquee for Awards
function VerticalAwardsMarquee({ awardData }) {
  const [isPaused, setIsPaused] = useState(false);
  
  if (!awardData || awardData.length === 0) return null;

  // Duplicate items for seamless loop
  const duplicatedAwards = [...awardData, ...awardData, ...awardData];
  
  // Calculate animation duration based on content length (slower for better readability)
  const animationDuration = awardData.length * 8; // 8 seconds per item

  return (
    <div 
      className="relative overflow-hidden max-h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top fade/clip gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling content */}
      <motion.div
        className="space-y-4"
        animate={{
          y: isPaused ? undefined : [0, -(awardData.length * 180)], // Adjust based on item height
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: animationDuration,
            ease: "linear",
          },
        }}
      >
        {duplicatedAwards.map((award, i) => (
          <motion.div
            key={`${award.id}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % awardData.length) * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 sm:p-8 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Award className={`w-8 h-8 ${awardColors[i % awardColors.length]}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 ${awardColors[i % awardColors.length]} line-clamp-2`}>
                  {award.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {award.description}
                </p>
                {award.year && (
                  <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {award.year}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Bottom fade/clip gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />
      
      {/* Pause indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg z-20"
        >
          Paused
        </motion.div>
      )}
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

// Enhanced Image Card with lazy loading and preview functionality (based on photo gallery pattern)
function ImageCard({ src, alt, title, onError, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasSrc = src && src !== '';

  return (
    <motion.div
      ref={imgRef}
      whileHover={hasSrc && !err ? { scale: 1.03, y: -6 } : {}}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-100 ${
        hasSrc && !err ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={hasSrc && !err ? onClick : undefined}
    >
      {/* Show error state if no src or error occurred */}
      {!hasSrc || err ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="text-center p-4">
            <Layers className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">
              {!hasSrc ? 'No image available' : 'Image unavailable'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Skeleton loader */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
          )}

          {/* Actual image */}
          {isInView && (
            <Image
              src={src}
              alt={alt || 'Achievement image'}
              fill
              loading="lazy"
              sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              unoptimized
              onLoadingComplete={() => setLoaded(true)}
              onError={(e) => {
                setErr(true);
                onError?.(e);
              }}
            />
          )}

          {/* Zoom overlay - only show if loaded successfully */}
          {loaded && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          )}

          {/* Info overlay - only show if loaded successfully */}
          {loaded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
              <h4 className="text-white font-bold text-lg sm:text-xl md:text-2xl truncate">
                {title}
              </h4>
              {alt && (
                <p className="text-white/80 text-sm sm:text-base mt-1 line-clamp-2">{alt}</p>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// Enhanced Photo Preview Modal
function PhotoPreviewModal({ isOpen, onClose, images, currentIndex, setCurrentIndex }) {
  const [loading, setLoading] = useState(false);

  const handlePrevious = useCallback(() => {
    if (images && images.length > 0) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      setLoading(true);
    }
  }, [images, setCurrentIndex]);

  const handleNext = useCallback(() => {
    if (images && images.length > 0) {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      setLoading(true);
    }
  }, [images, setCurrentIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  
  // Safety check for current image
  if (!currentImage || !currentImage.src) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
              </div>
            )}
            <Image
              src={currentImage.src || ''}
              alt={currentImage.alt || 'Achievement image'}
              fill
              className="object-contain"
              unoptimized
              onLoadingComplete={() => setLoading(false)}
              onError={() => {
                console.error('Failed to load preview image:', currentImage.src);
                setLoading(false);
              }}
            />
          </motion.div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
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
  const [heroImageFallback, setHeroImageFallback] = useState({}); // Track which images are using fallback
  const [proudImageErrors, setProudImageErrors] = useState({});
  const [proudImageFallback, setProudImageFallback] = useState({});
  const [awardImageErrors, setAwardImageErrors] = useState({});
  const [galleryImageErrors, setGalleryImageErrors] = useState({});
  const [galleryImageFallback, setGalleryImageFallback] = useState({});
  const [failedImages, setFailedImages] = useState(new Set()); // Track permanently failed images
  
  // Photo preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Handle photo preview
  const openPhotoPreview = useCallback((images, clickedIndex) => {
    // Transform images to have proper src and alt properties for the modal
    const transformedImages = images.map(item => {
      if (!item?.image?.id) {
        return {
          src: null,
          alt: 'Image unavailable'
        };
      }
      
      return {
        src: `${API_BASE_URL}/achievements/image/${item.image.id}`,
        alt: item.gallery?.description || item.gallery?.title || 'Achievement Image'
      };
    }).filter(img => img.src); // Filter out images without valid src
    
    console.log('Opening photo preview with', transformedImages.length, 'valid images');
    setPreviewImages(transformedImages);
    setCurrentPreviewIndex(clickedIndex);
    setIsPreviewOpen(true);
  }, []);



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
  }, [_heroData.length]);

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
                            <>
                              <Image
                                src={heroImageFallback[hero.id] 
                                  ? `${API_BASE_URL}/achievements/image/${hero.images[0].id}`
                                  : `${API_BASE_URL}/achievements/thumbnail/${hero.images[0].id}`
                                }
                                alt={hero.title || "Hero image"}
                                fill
                                className="object-cover rounded-xl"
                                unoptimized
                                onError={() => {
                                  const isFallback = heroImageFallback[hero.id];
                                  
                                  if (!isFallback) {
                                    // First attempt failed (thumbnail), try full image silently
                                    setHeroImageFallback((prev) => ({ ...prev, [hero.id]: true }));
                                  } else {
                                    // Both attempts failed, log and show error
                                    console.warn(`Hero image unavailable for "${hero.title}" (ID: ${hero.images[0].id})`);
                                    setHeroImageErrors((prev) => ({ ...prev, [hero.id]: true }));
                                  }
                                }}
                              />
                              {heroImageFallback[hero.id] && !heroImageErrors[hero.id] && (
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded z-10">
                                  Loading...
                                </div>
                              )}
                            </>
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
              <VerticalProudCarousel
                proudData={_proudData}
                proudImageErrors={proudImageErrors}
                setProudImageErrors={setProudImageErrors}
                proudImageFallback={proudImageFallback}
                setProudImageFallback={setProudImageFallback}
              />
            )}
          </div>
        </section>
      )}

      {/* Awards & Achievements */}
      {(awardLoading || _awardData.length > 0) && (
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
                      className="h-20 sm:h-24 bg-gray-200 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <VerticalAwardsMarquee awardData={_awardData} />
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
          ) : _galleryData && _galleryData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {_galleryData.flatMap((gallery) => {
                const galleryImages = gallery.images?.map((image) => ({
                  image,
                  gallery
                })) || [];
                
                return galleryImages.map((item, index) => {
                  const globalIndex = _galleryData.reduce((acc, g, gIndex) => {
                    if (gIndex < _galleryData.indexOf(gallery)) {
                      return acc + (g.images?.length || 0);
                    }
                    return acc;
                  }, 0) + index;
                  
                  const allImages = _galleryData.flatMap(g => 
                    g.images?.map(img => ({ image: img, gallery: g })) || []
                  );

                  // Skip if no image ID
                  if (!item.image.id) return null;

                  // Use thumbnail endpoint for better performance, with fallback to full image
                  const imageKey = `${gallery.id}-${item.image.id}`;
                  const isFailed = failedImages.has(imageKey);
                  const imageUrl = galleryImageFallback[imageKey]
                    ? `${API_BASE_URL}/achievements/image/${item.image.id}`
                    : `${API_BASE_URL}/achievements/thumbnail/${item.image.id}`;
                  
                  return (
                    <ImageCard
                        key={imageKey}
                        src={isFailed ? null : imageUrl}
                        alt={gallery.description || gallery.title || "Gallery Image"}
                        title={gallery.title || "Gallery"}
                        onClick={() => !isFailed && openPhotoPreview(allImages, globalIndex)}
                        onError={() => {
                          const isFallback = galleryImageFallback[imageKey];
                          
                          if (!isFallback) {
                            // First attempt failed (thumbnail), try full image silently
                            setGalleryImageFallback((prev) => ({ ...prev, [imageKey]: true }));
                          } else {
                            // Both attempts failed, mark as permanently failed
                            console.warn(`Gallery image unavailable (ID: ${item.image.id})`);
                            setFailedImages((prev) => new Set([...prev, imageKey]));
                            setGalleryImageErrors((prev) => ({
                              ...prev,
                              [item.image.id]: true,
                            }));
                          }
                        }}
                      />
                    );
                  }).filter(Boolean);
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No gallery images available</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Photo Preview Modal */}
      <PhotoPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        images={previewImages}
        currentIndex={currentPreviewIndex}
        setCurrentIndex={setCurrentPreviewIndex}
      />
    </div>
  );
}
