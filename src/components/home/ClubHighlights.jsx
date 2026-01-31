"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { combineHighlightImages } from "@/lib/utils/imageUtils";
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

  // Fetch photo gallery items for club highlights with caching
  const { data: photoGalleries, error: photoGalleriesError } = useQuery({
    queryKey: ["photo-gallery-highlights"],
    queryFn: async () => {
      // Fetch galleries with CLUB_HIGHLIGHTS or BOTH category
      const [highlights, both] = await Promise.all([
        apiClient.get(
          `${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=CLUB_HIGHLIGHTS`,
        ),
        apiClient.get(`${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=BOTH`),
      ]);
      return [...(highlights.data || []), ...(both.data || [])];
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Memoize processed images to avoid recalculation
  const images = useMemo(() => {
    return combineHighlightImages(
      [],
      [],
      photoGalleries || [],
      12,
    );
  }, [photoGalleries]);

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Club{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Highlights
            </span>
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
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
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-semibold text-lg">
                              {image.title}
                            </p>
                            <p className="text-white/80 text-sm capitalize">
                              {image.type}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 z-10"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Dots Navigation */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-8 bg-blue-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
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
