"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import Link from "next/link";

export default function EventsCarousel({ events = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

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

  // Get first image from event
  const getEventImage = (event) => {
    if (event.files && event.files.length > 0 && event.files[0].fileData) {
      return bufferToDataURL(event.files[0].fileData);
    }
    return null;
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our upcoming and past events
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Carousel Viewport */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-4">
              {events.map((event, index) => {
                const imageUrl = getEventImage(event);
                const eventDate = new Date(event.eventDate);

                return (
                  <div
                    key={event.id || index}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-video rounded-xl overflow-hidden shadow-lg group cursor-pointer bg-gradient-to-br from-blue-100 to-purple-100"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar size={64} className="text-gray-300" />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {/* Status Badge */}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                              event.status?.toLowerCase() === "upcoming"
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                          <p className="text-white font-semibold text-lg mb-1">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                            <Calendar size={14} />
                            <span>{eventDate.toLocaleDateString()}</span>
                          </div>
                          <Link
                            href={`/events/${event.id}`}
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
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
        </div>
      </div>
    </section>
  );
}
