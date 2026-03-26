"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://49.205.68.25:8080/api';

// Helper function to get thumbnail URL for different resource types
const getResourceThumbnailUrl = (item, type) => {
  if (!item.id) return null;
  
  const typeEndpointMap = {
    'magazines': 'magazines',
    'textbooks': 'textbooks',
    'nptelLectures': 'nptelLectures',
    'materials': 'vlsiMaterials',
    'questionBanks': 'questionBanks',
    'placement': 'placementPrep',
    'gatePyqs': 'gatePyqs'
  };
  
  const endpoint = typeEndpointMap[type];
  return endpoint ? `${API_BASE_URL}/${endpoint}/${item.id}/thumbnail` : null;
};

// Enhanced Image Card Component with lazy loading - Production Design
const ResourceImageCard = memo(({ src, alt, onError, onClick, type, index = 0 }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
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
      { root: null, rootMargin: "50px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleError = (e) => {
    setError(true);
    onError?.(e);
  };

  return (
    <div 
      ref={imgRef}
      className="relative aspect-[5/3] overflow-hidden"
    >
      {!error && src && isInView ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width:1200px) 50vw, 33vw"
            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={handleError}
            priority={index < 3}
            quality={90}
            unoptimized
          />
        
          
        </>
      ) : null}
      
      {/* Fallback icon display */}
      <div className={`absolute inset-0 ${(!src || error) ? "flex" : "hidden"} items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`}>
        <div className="text-center p-4 sm:p-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-sm rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg">
            {(type === "magazines" || type === "magazine") && (
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            )}
            {(type === "textbooks" || type === "textbook") && (
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            )}
            {(type === "materials" ||
              type === "material" ||
              type === "questionBanks" ||
              type === "questionbank" ||
              type === "placement" ||
              type === "recruitment" ||
              type === "gatePyqs" ||
              type === "ece") && (
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
            {type === "magazines" && "Magazine"}
            {type === "textbooks" && "Textbook"}
            {type === "materials" && "Material"}
            {type === "questionBanks" && "Question Bank"}
            {type === "placement" && "Placement Prep"}
            {type === "gatePyqs" && "Gate PYQ"}
          </p>
        </div>
      </div>
      
      {/* Loading placeholder */}
      {!loaded && !error && src && isInView && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
    </div>
  );
});

// Memoized Carousel Item Component - Production Design
const ResourceCarouselItem = memo(({ item, index, type }) => {
  return (
    <div className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_33.333%] xl:flex-[0_0_33.333%] pl-4 first:pl-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
      >
        {/* Image */}
        <ResourceImageCard
          src={getResourceThumbnailUrl(item, type)}
          alt={item.title || item.name || item.topicName || item.courseName || "Resource image"}
          type={type}
          index={index}
          onError={(e) => {
            console.warn(`Failed to load thumbnail for ${type} item ${item.id}`);
          }}
        />

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Category Badge */}
          {item.category && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {item.title ||
              item.name ||
              item.topicName ||
              item.courseName ||
              "Untitled"}
          </h3>
          
          {/* Metadata */}
          {item.professorName && (
            <p className="text-sm text-gray-500 mb-1 font-bold flex items-center gap-1">
              {item.professorName}
            </p>
          )}
          {item.author && !item.professorName && (
            <p className="text-sm text-gray-500 mb-1 flex items-center font-bold gap-1">
              {item.author}
            </p>
          )}
          {item.subject && (
            <p className="text-sm text-gray-500 mb-1 font-medium">
                <span className="font-bold">Subject:</span> {item.subject}
            </p>
          )}
          {item.year && (
            <p className="text-sm text-gray-500 mb-1 font-medium">
               <span className="font-bold">Year: </span>{item.year}
            </p>
          )}
          
          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {item.description}
            </p>
          )}

          {/* Action Button */}
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <button
              onClick={() => window.open(item.link, "_blank")}
              className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg"
            >
              ACCESS RESOURCE <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default function ResourceCarousel({ items, type }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragFree: false,
      inViewThreshold: 0.5,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  if (!memoizedItems || memoizedItems.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No resources available.
      </div>
    );
  }

  return (
    <div className="relative px-2 sm:px-4 lg:px-8 pb-4">
      {/* Embla Carousel */}
      <div className="overflow-hidden rounded-lg py-4 cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex -ml-4">
          {memoizedItems.map((item, index) => (
            <ResourceCarouselItem
              key={item.id || index}
              item={item}
              index={index}
              type={type}
            />
          ))}
        </div>
      </div>

      {/* Carousel Navigation Buttons - Positioned outside the overflow container */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-10 px-2">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all pointer-events-auto border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all pointer-events-auto border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {memoizedItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
