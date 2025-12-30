"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Megaphone } from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";
import useEmblaCarousel from "embla-carousel-react";
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

const voicesData = [
  {
    title: "VLSI Club Building India's Silicon Era",
    description:
      "Our students are at the forefront of India's semiconductor revolution, working on cutting-edge projects that will shape the future of chip design and manufacturing.",
    icon: Megaphone,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "From Classroom to Cleanroom",
    description:
      "We provide unparalleled hands-on experience with state-of-the-art tools and technologies, bridging the gap between theoretical knowledge and industry practice.",
    icon: Quote,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Innovation in Every Chip",
    description:
      "Our club fosters creativity and technical excellence, empowering students to design innovative solutions for tomorrow's technology challenges.",
    icon: Megaphone,
    gradient: "from-green-500 to-blue-500",
  },
  {
    title: "Collaboration Drives Success",
    description:
      "Teamwork and mentorship are at the heart of our achievements, helping students grow into industry-ready professionals.",
    icon: Quote,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Bridging Academia and Industry",
    description:
      "We connect students with industry leaders, providing exposure to real-world VLSI challenges and career opportunities.",
    icon: Megaphone,
    gradient: "from-pink-500 to-red-500",
  },
];

export default function VoicesSection() {
  // Shuffle voices for random order
  const [voices, setVoices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    const shuffled = [...voicesData].sort(() => Math.random() - 0.5);
    setVoices(shuffled);
  }, []);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              const Icon = voice.icon;
              return (
                <div
                  key={index}
                  className="min-w-0 w-full max-w-xl flex-shrink-0 relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${voice.gradient} opacity-10 blur-3xl`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${voice.gradient} p-3 mb-6 shadow-lg`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {voice.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {voice.description}
                    </p>
                  </div>

                  {/* Decorative Quote Mark */}
                  <div className="absolute bottom-4 right-4 opacity-5">
                    <Quote className="w-32 h-32 text-gray-900" />
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
