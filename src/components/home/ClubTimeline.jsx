"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api/config";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Rocket,
  Award,
  Users,
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Filter,
  X,
  Camera,
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Icon mapping
const iconMap = {
  rocket: Rocket,
  award: Award,
  users: Users,
  lightbulb: Lightbulb,
  calendar: Calendar,
};

export default function ClubTimeline() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Fetch milestones
  const {
    data: milestonesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["milestones", selectedYear, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedYear !== "all") params.append("year", selectedYear);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);

      const response = await apiClient.get(
        `${API_ENDPOINTS.MILESTONES.BASE}?${params}`,
      );
      return response.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    onError: (err) => {
      console.error("Failed to fetch milestones:", err);
    },
  });

  // Fetch available years
  const { data: yearsData } = useQuery({
    queryKey: ["milestone-years"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.MILESTONES.YEARS);
      return response.data;
    },
  });

  // Fetch available categories
  const { data: categoriesData } = useQuery({
    queryKey: ["milestone-categories"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.MILESTONES.CATEGORIES);
      return response.data;
    },
  });

  const milestones = useMemo(
    () => (Array.isArray(milestonesData) ? milestonesData : []),
    [milestonesData],
  );
  const years = useMemo(
    () => (Array.isArray(yearsData) ? yearsData : []),
    [yearsData],
  );
  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []),
    [categoriesData],
  );

  // Loading skeleton
  const SkeletonLoader = () => (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative flex items-start lg:items-center animate-pulse"
        >
          <div
            className={`w-full lg:w-5/12 ml-12 sm:ml-16 lg:ml-0 ${
              i % 2 === 0
                ? "lg:mr-auto lg:pr-6 xl:pr-8"
                : "lg:ml-auto lg:pl-6 xl:pl-8"
            }`}
          >
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-48"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="text-center py-20">
      <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Failed to load timeline
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't retrieve the milestone data.
      </p>
      <Button onClick={() => refetch()} className="gap-2">
        <RefreshCw size={16} />
        Try Again
      </Button>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-20">
      <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Milestones Found
      </h3>
      <p className="text-gray-600 mb-6">
        {selectedYear !== "all" || selectedCategory !== "all"
          ? "Try adjusting your filters to see more results."
          : "Check back soon for exciting milestones!"}
      </p>
      {(selectedYear !== "all" || selectedCategory !== "all") && (
        <Button
          onClick={() => {
            setSelectedYear("all");
            setSelectedCategory("all");
          }}
          variant="outline"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
          >
            Our Journey
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4"
          >
            Milestones that shaped our path to excellence in VLSI design and
            innovation
          </motion.p>

          {/* Filters */}
          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-wrap gap-3 justify-center items-center"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-600">
                Filters:
              </span>
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedYear === "all" ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105"
                onClick={() => setSelectedYear("all")}
              >
                All Years
              </Badge>
              {years.map((year) => (
                <Badge
                  key={year}
                  variant={
                    selectedYear === String(year) ? "default" : "outline"
                  }
                  className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105"
                  onClick={() => setSelectedYear(String(year))}
                >
                  {year}
                </Badge>
              ))}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105 capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Clear filters button */}
            {(selectedYear !== "all" || selectedCategory !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setSelectedYear("all");
                  setSelectedCategory("all");
                }}
              >
                <X size={14} />
                Clear
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Timeline Container */}
        {error ? (
          <ErrorState />
        ) : isLoading ? (
          <SkeletonLoader />
        ) : milestones.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:transform lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

            {/* Timeline Events */}
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              <AnimatePresence mode="popLayout">
                {milestones.map((milestone, index) => {
                  const Icon =
                    milestone.icon && iconMap[milestone.icon.toLowerCase()]
                      ? iconMap[milestone.icon.toLowerCase()]
                      : Calendar;
                  const isLeft = index % 2 === 0;
                  // Use hasImage flag from backend
                  const hasImage = milestone.hasImage === true;
                  const imageUrl = hasImage
                    ? `${API_BASE_URL}/milestones/${milestone.id}/image?t=${Date.now()}`
                    : null;

                  return (
                    <motion.div
                      key={milestone.id}
                      variants={staggerItem}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      layout
                      className="relative flex items-start lg:items-center"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 z-10 top-6 lg:top-auto">
                        <div
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${milestone.color || "bg-blue-500"} rounded-full border-2 sm:border-4 border-white shadow-lg`}
                        ></div>
                      </div>

                      {/* Content Card */}
                      <div
                        className={`w-full lg:w-5/12 ml-12 sm:ml-16 lg:ml-0 ${
                          isLeft
                            ? "lg:mr-auto lg:pr-6 xl:pr-8"
                            : "lg:ml-auto lg:pl-6 xl:pl-8"
                        }`}
                      >
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className={`${milestone.bgColor || "bg-blue-50"} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden`}
                        >
                          {/* Image Display if available */}
                          {hasImage &&
                            imageUrl &&
                            !failedImages.has(milestone.id) && (
                              <div className="mb-4 sm:mb-6">
                                <div
                                  className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden cursor-pointer group"
                                  // onClick={() => {
                                  //   console.log(
                                  //     "Opening lightbox for milestone:",
                                  //     milestone.id,
                                  //     imageUrl,
                                  //   );
                                  //   setLightboxImage(imageUrl);
                                  //   setImageError(false);
                                  // }}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={milestone.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={() => {
                                      console.warn(
                                        "Failed to load milestone image:",
                                        milestone.id,
                                        imageUrl,
                                      );
                                      setFailedImages(
                                        (prev) =>
                                          new Set([...prev, milestone.id]),
                                      );
                                    }}
                                    onLoad={() => {
                                      // Remove from failed images if it loads successfully
                                      setFailedImages((prev) => {
                                        const newSet = new Set(prev);
                                        newSet.delete(milestone.id);
                                        return newSet;
                                      });
                                    }}
                                  />
                                  {/* Overlay with camera icon */}
                                  {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <Camera
                                        size={20}
                                        className="text-gray-700"
                                      />
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            )}

                          {/* Icon and Date */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div
                              className={`${milestone.color || "bg-blue-500"} rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md w-fit`}
                            >
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                                {new Date(milestone.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            {milestone.category && (
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize w-fit"
                              >
                                {milestone.category}
                              </Badge>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {milestone.description}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
                onClick={() => {
                  setLightboxImage(null);
                  setImageError(false);
                }}
              >
                <X size={24} />
              </Button>
              {imageError ? (
                <div className="bg-white rounded-lg p-8 text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Image Not Available
                  </h3>
                  <p className="text-gray-600">
                    The milestone image could not be loaded. It may have been
                    removed or is temporarily unavailable.
                  </p>
                </div>
              ) : (
                <img
                  src={lightboxImage}
                  alt="Milestone"
                  className="max-w-full max-h-[90vh] rounded-lg object-contain"
                  onError={(e) => {
                    console.error(
                      "Lightbox image failed to load:",
                      lightboxImage,
                    );
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log(
                      "Lightbox image loaded successfully:",
                      lightboxImage,
                    );
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
