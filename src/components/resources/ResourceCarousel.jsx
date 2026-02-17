"use client";

import React from "react";
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
import { bufferToDataURL } from "@/lib/utils/imageUtils";

export default function ResourceCarousel({ items, type }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative px-2 sm:px-4 lg:px-8 pb-4">
      {/* Embla Carousel */}
      <div className="overflow-hidden rounded-lg py-4" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6 px-1">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={bufferToDataURL(item.image)}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 ${item.image ? "hidden" : "flex"} items-center justify-center`}
                  >
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
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2 ">
                    {item.title ||
                      item.name ||
                      item.topicName ||
                      item.courseName ||
                      "Untitled"}
                  </h3>
                  {item.professorName && (
                    <p className="text-sm text-gray-500 mb-1 font-medium">
                      By {item.professorName}
                    </p>
                  )}
                  {
                    item.author && !item.professorName && (
                      <p className="text-sm text-gray-500 mb-1 font-medium">
                        By {item.author}
                      </p>
                    )
                  }
                  {
                    item.subject && (
                      <p className="text-sm text-gray-500 mb-1 font-medium">
                        Subject: {item.subject}
                      </p>
                    )
                  }
                 
                  {
                    item.year && (
                      <p className="text-sm text-gray-500 mb-1 font-medium">
                        Year: {item.year}
                      </p>
                    )
                  }
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {item.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">View More</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Navigation Buttons - Positioned outside the overflow container */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-10">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 sm:w-12 sm:h-12 -ml-5 sm:-ml-6 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all pointer-events-auto border border-gray-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 sm:w-12 sm:h-12 -mr-5 sm:-mr-6 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all pointer-events-auto border border-gray-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, index) => (
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
