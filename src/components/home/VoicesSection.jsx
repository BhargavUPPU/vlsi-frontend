"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
function EmblaDots({ emblaApi, slidesCount, selectedIndex, setSelectedIndex }) {
  if (!emblaApi) return null;
  return (
    <div className="flex justify-center gap-2 sm:gap-2.5 mt-6 sm:mt-8 md:mt-10">
      {Array.from({ length: slidesCount }).map((_, idx) => (
        <button
          key={idx}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-blue-400 transition-all duration-200 focus:outline-none ${
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
    <section className="py-4 sm:py-6 md:py-8 lg:py-18 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
            Voices Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              India's Silicon Era
            </span>
          </h2>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            {voices.map((voice, index) => {
                return (
                <div
                  key={voice.id}
                  className="min-w-0 w-full max-w-4xl flex-shrink-0 relative overflow-hidden p-2 sm:p-3 md:p-4"
                >
                  {/* Image Container */}
                 
                  <Image
                    src={voice.src}
                    alt={voice.alt}
                    className="w-full h-auto object-contain rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                    width={100}
                    height={50}
                    priority={index < 3} // Prioritize loading for the first few images
                  />
                </div>
              );
            }
            )}
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
