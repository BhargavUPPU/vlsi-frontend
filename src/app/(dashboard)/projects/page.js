"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ProjectsCarousel from "@/components/home/ProjectsCarousel";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselInterval = useRef(null);
  const [filters, setFilters] = useState({
    category: "",
    academicYear: "",
    month: "",
    date: "",
  });

  const itemsPerPage = 6;

  // Fetch all projects
  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const allProjects = projectsData?.data?.data || [];
  
  console.log('Projects debug:', {
    projectsData: projectsData,
    allProjects: allProjects,
    count: allProjects.length
  });

  // Separate ongoing and completed projects
  const ongoingProjects = allProjects.filter(
    (p) => p.status?.toLowerCase() === "ongoing",
  );
  const completedProjects = allProjects.filter(
    (p) => p.status?.toLowerCase() === "completed",
  );

  const currentProjects =
    activeTab === "ongoing" ? ongoingProjects : completedProjects;

  // Apply filters
  const filteredProjects = currentProjects.filter((project) => {
    if (filters.category && project.category !== filters.category) return false;
    if (filters.academicYear && project.academicYear !== filters.academicYear)
      return false;
    return true;
  });

  // Pagination
  let totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get first image from project
  const getProjectImage = (project) => {
    // For projects list, backend only returns image IDs, not full data
    // We'll use the image endpoint to get the actual image
    if (project.images && project.images.length > 0) {
      const imageId = project.images[0].id;
      return `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://49.205.68.25:8080/api'}/projects/images/${imageId}`;
    }
    return null;
  };

  // Latest 10 projects for the right section (by createdAt desc)
  const latestProjects = [...allProjects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Animated image blocks data (left grid) - use static images since 
  // project list only has image IDs, not full image data
  const projectImages = [
    "/projectIcon1.png",
    "/projectIcon2.jpg", 
    "/projectIcon3.jpg",
    "/projectIcon4.jpg",
    "/projectIcon5.jpg",
    "/projectIcon6.jpg"
  ];

  // Auto-rotate images (left grid)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % Math.max(projectImages.length, 1),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [projectImages.length]);

  // Auto-rotate right section (latest projects carousel)
  useEffect(() => {
    if (carouselInterval.current) clearInterval(carouselInterval.current);
    carouselInterval.current = setInterval(() => {
      setCarouselIndex(
        (prev) => (prev + 1) % Math.max(latestProjects.length, 1),
      );
    }, 3500);
    return () => clearInterval(carouselInterval.current);
  }, [latestProjects.length]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const projectTypes = [
    ...new Set(currentProjects.map((p) => p.category).filter(Boolean)),
  ];
  const academicYears = [
    ...new Set(currentProjects.map((p) => p.academicYear).filter(Boolean)),
  ];
  console.log("projects", projectsData);

  // Card colors
  const cardColors = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-orange-400 to-orange-600",
  ];

  return (
    <div className="min-h-screen">
      {/* Featured Projects Carousel */}
      {/* {!isLoading && !error && allProjects.length > 0 && (
        <ProjectsCarousel projects={allProjects.slice(0, 5)} />
      )} */}

      {/* Hero Section with Animated Blocks */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 relative z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium mb-3 sm:mb-4 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Home</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left: Animated '11' Symbol (two columns of 3 blocks), group floats up/down */}
            <div className="relative h-80 sm:h-96 md:h-[28rem] lg:h-112 flex items-center justify-center">
              {/* Sample SVG Bubble/Cloud Background */}
              <svg
                className="absolute inset-0 w-full h-full z-0 scale-125 sm:scale-150"
                width="1400"
                height="1400"
                viewBox="0 0 1400 1400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="1050"
                  cy="1100"
                  r="80"
                  fill="#367CFF"
                  fillOpacity="0.2"
                />
                <circle
                  cx="1280"
                  cy="950"
                  r="35"
                  fill="#367CFF"
                  fillOpacity="0.2"
                />
                <path
                  d="M730 1220C925 1150 1085 1015 1145 785C1200 585 1205 365 1105 190C1040 80 930 77 810 98C625 132 440 180 255 220C65 262 -7 420 -6 595C-5 830 45 1155 290 1255C340 1275 395 1280 450 1275C545 1265 640 1250 730 1220Z"
                  fill="#367CFF"
                  fillOpacity="0.09"
                />
                <path
                  d="M825 1230C1030 1155 1200 1015 1265 780C1320 575 1325 345 1225 163C1155 50 1040 47 910 70C715 105 520 157 325 200C120 245 45 410 45 590C45 835 95 1170 355 1270C410 1290 470 1295 530 1290C630 1280 730 1260 825 1230Z"
                  fill="#367CFF"
                  fillOpacity="0.09"
                />
                <path
                  d="M1220 164C1330 345 1325 575 1265 780L1265 780C1200 1015 1030 1155 825 1230L825 1230C730 1260 630 1280 530 1290L530 1290C470 1295 410 1290 355 1270C225 1220 150 1110 105 985C60 860 45 710 45 590C45 500 65 413 110 345C153 276 220 223 320 201L325 200C520 157 715 105 910 70L910 70C975 59 1035 54 1090 66C1145 78 1190 106 1220 161L1220 164Z"
                  stroke="black"
                  strokeOpacity="0.2"
                />
              </svg>

              {/* Animated '11' group */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -36, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="relative z-10 flex flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-[280px] sm:max-w-xs md:max-w-sm justify-center"
              >
                {/* Left '1' (lower) - 3 static images */}
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 translate-y-3 sm:translate-y-4 md:translate-y-6 lg:translate-y-8">
                  {[
                    "/projectIcon1.png",
                    "/projectIcon2.jpg",
                    "/projectIcon3.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square w-14 sm:w-16 md:w-20 lg:w-24 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/70 shadow-md sm:shadow-lg border border-blue-100 backdrop-blur-md flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt={`Static Image ${i + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {/* Right '1' (higher) - 3 static images */}
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 -translate-y-3 sm:-translate-y-4 md:-translate-y-6 lg:-translate-y-8">
                  {[
                    "/projectIcon4.jpg",
                    "/projectIcon5.jpg",
                    "/projectIcon6.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square w-14 sm:w-16 md:w-20 lg:w-24 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/70 shadow-md sm:shadow-lg border border-blue-100 backdrop-blur-md flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt={`Static Image ${i + 4}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Project Counter & Description for latest projects carousel - Redesigned */}

            <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto flex flex-col items-center justify-center h-full px-4"
              >
                {/* Large soft number in background */}
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-extrabold select-none leading-none z-0 pointer-events-none bg-gradient-to-b from-blue-400 via-blue-200 to-white text-transparent bg-clip-text opacity-90"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {latestProjects.length > 0
                    ? String(
                      (carouselIndex % latestProjects.length) + 1,
                    ).padStart(2, "0")
                    : "01"}
                </span>
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
                  {latestProjects.length > 0 ? (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 mt-6 sm:mt-8 md:mt-12 lg:mt-16 line-clamp-2 leading-tight px-2">
                        {
                          latestProjects[carouselIndex % latestProjects.length]
                            .title
                        }
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-3 sm:mb-4 md:mb-6 max-w-[280px] sm:max-w-xs md:max-w-sm mx-auto line-clamp-3 leading-relaxed px-2">
                        {
                          latestProjects[carouselIndex % latestProjects.length]
                            .Introduction ||
                          latestProjects[carouselIndex % latestProjects.length]
                            .description ||
                          'No description available.'
                        }
                      </p>
                      <Link
                        href={`/projects/${latestProjects[carouselIndex % latestProjects.length]
                            .id
                          }`}
                        className="bg-blue-600 text-white px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base md:text-lg shadow-md min-w-[120px]"
                      >
                        Know more
                      </Link>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 mt-16 sm:mt-18 md:mt-20 lg:mt-24">
                        No projects found
                      </h2>
                      <p className="text-gray-400 italic mb-4 sm:mb-6 text-sm sm:text-base">
                        No project data to display.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 text-center px-4 sm:px-6 md:px-8">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif italic text-gray-700 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
              "Silicon is the Canvas, Logic is the Art!"
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-1.5 sm:mb-2 leading-relaxed max-w-3xl mx-auto">
              Where VLSI, Embedded Systems, AI, and Communication come together
              to create innovation.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Showcase your projects, share your ideas, and inspire your
              community!
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
            >
              <option value="">All Project Types</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filters.academicYear}
              onChange={(e) =>
                handleFilterChange("academicYear", e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
            >
              <option value="">All Years</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button className="w-full sm:col-span-2 lg:col-span-1 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <Filter size={18} className="sm:w-5 sm:h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-3 sm:pb-4 md:pb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => handleTabChange("ongoing")}
            className={`w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${activeTab === "ongoing"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            Ongoing Projects
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${activeTab === "completed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            Completed Projects
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8 md:pb-12">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-44 sm:h-48 md:h-56 lg:h-64 bg-gray-200" />
                <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center">
            <p className="text-red-600 text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">
              Failed to load projects
            </p>
            <p className="text-red-500 text-xs sm:text-sm md:text-base">Please try again later</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 text-center shadow-sm">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              {activeTab === "ongoing"
                ? "There are no ongoing projects at the moment"
                : "There are no completed projects to show"}
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && paginatedProjects.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
              >
                {paginatedProjects.map((project, index) => {
                  const imageUrl = getProjectImage(project);
                  const colorClass = cardColors[index % cardColors.length];

                  return (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Colored Header with Image */}
                      <div
                        className={`relative h-44 sm:h-48 md:h-56 lg:h-64 ${colorClass} flex items-center justify-center`}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              // If image fails to load, hide it and show title instead
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`text-center text-white p-3 sm:p-4 ${imageUrl ? 'hidden' : ''}`}>
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 flex-wrap">
                          <span
                            className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${activeTab === "ongoing"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {project.status}
                          </span>
                          <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs font-semibold">
                            {project.category || "Project"}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-2.5 md:mb-3 line-clamp-2 leading-tight">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-3.5 md:mb-4 line-clamp-3 leading-relaxed">
                          {project.Introduction || project.description || 'No description available.'}
                        </p>

                        <div className="flex gap-2 sm:gap-3">
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm md:text-base"
                          >
                            Know more
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && Number.isFinite(totalPages) && (
              <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-colors ${currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                    >
                      {String(page)}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
