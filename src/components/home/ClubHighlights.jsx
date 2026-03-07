"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClubHighlights() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Fetch photo gallery items for club highlights with caching and pagination
  const { data: photoGalleryResponse, error: photoGalleriesError, isLoading: photoGalleriesLoading } = useQuery({
    queryKey: ["photo-gallery-highlights"],
    queryFn: async () => {
      // Fetch galleries with CLUB_HIGHLIGHTS or BOTH category (limit to 12 for homepage)
      const [highlights, both] = await Promise.all([
        apiClient.get(
          `${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=CLUB_HIGHLIGHTS&limit=6`,
        ),
        apiClient.get(`${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=BOTH&limit=6`),
      ]);
      // Extract data from paginated response
      const highlightsData = highlights.data?.data?.data || highlights.data?.data || [];
      const bothData = both.data?.data?.data || both.data?.data || [];
      return [...highlightsData, ...bothData];
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Process gallery images to use API endpoints
  const processGalleryImages = useMemo(() => {
    const photoGalleries = photoGalleryResponse || [];
    const images = [];
    
    console.log('ClubHighlights debug:', {
      photoGalleryResponse: photoGalleryResponse,
      count: photoGalleries.length
    });
    
    photoGalleries.forEach(gallery => {
      console.log('Processing gallery:', gallery.title, 'Images:', gallery.images?.length);
      if (gallery.images && Array.isArray(gallery.images)) {
        gallery.images.forEach((image, index) => {
          // Use thumbnail endpoint for better performance
          const thumbnailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://49.205.68.25:8080/api'}/photoGallery/${gallery.id}/thumbnail/${index}`;
          images.push({
            url: thumbnailUrl,
            title: gallery.title,
            type: 'photo gallery',
            id: gallery.id,
            priority: gallery.priority || 0,
            caption: image.caption || gallery.title,
            imageIndex: index
          });
        });
      }
    });
    
    console.log('Processed images:', images.length);
    
    // Sort by priority and shuffle
    return images.sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      return Math.random() - 0.5;
    }).slice(0, 12);
  }, [photoGalleryResponse]);

  // Memoize processed images to avoid recalculation
  const images = useMemo(() => {
    return processGalleryImages;
  }, [processGalleryImages]);

  // Check for errors
  const hasError = photoGalleriesError;

  // Carousel navigation
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <motion.h2
            variants={staggerItem}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8"
          >
            Club{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Highlights
            </span>
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4"
          >
            Glimpses from our events, projects, and achievements
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeIn}
          className="relative"
        >
          {hasError ? (
            <div className="text-center py-20 text-red-500">
              <p>Failed to load highlights. Please try again later.</p>
            </div>
          ) : photoGalleriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse aspect-video rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : images.length > 0 ? (
            <>
              {/* Carousel Viewport */}
              <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-video rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            console.warn(`Failed to load image: ${image.url}`);
                            // You could set a fallback image here if needed
                          }}
                        />
                      
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={scrollPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>

              {/* Dots Navigation */}
              <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 md:mt-10">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-6 sm:w-8 bg-blue-600"
                        : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No highlights available at the moment.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Import fadeIn animation
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
