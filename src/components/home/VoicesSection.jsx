"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
function EmblaDots({ emblaApi, slidesCount, selectedIndex, setSelectedIndex }) {
  if (!emblaApi) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: slidesCount }).map((_, idx) => (
        <button
          key={idx}
          className={`w-3 h-3 rounded-full border-2 border-blue-400 transition-all duration-200 focus:outline-none ${
            selectedIndex === idx ? "bg-blue-500" : "bg-white"
          }`}
          aria-label={`Go to slide ${idx + 1}`}
          onClick={() => emblaApi && emblaApi.scrollTo(idx)}
        />
      ))}
    </div>
  );
}

// Generate image data for voice1 (1).svg to voice7 (1).svg
const voiceImages = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  src: `/voice1 (${index+1}).svg`,
  alt: `Voice ${index + 1}`,
}));

export default function VoicesSection() {
  // Use the voice images directly
  const [voices, setVoices] = useState(voiceImages);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const autoplayInterval = useRef();

  // Autoplay effect
  useEffect(() => {
    if (!emblaApi) return;
    autoplayInterval.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
    setSelectedIndex(emblaApi.selectedScrollSnap());
    return () => clearInterval(autoplayInterval.current);
  }, [emblaApi]);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Voices Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              India's Silicon Era
            </span>
          </h2>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {voices.map((voice, index) => {
              return (
                <div
                  key={voice.id}
                  className="min-w-0 w-full max-w-full flex-shrink-0 relative overflow-hidden p-4"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-96 flex items-center justify-center">
                    <Image
                      src={voice.src}
                      alt={voice.alt}
                      fill
                      className="object-contain"
                      priority={index < 3}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <EmblaDots
            emblaApi={emblaApi}
            slidesCount={voices.length}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
      </div>
    </section>
  );
}
