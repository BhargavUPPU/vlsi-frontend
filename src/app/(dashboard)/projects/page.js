"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL),
  });

  const allProjects = Array.isArray(projectsData?.data) ? projectsData.data : [];

  // Separate ongoing and completed projects
  const ongoingProjects = allProjects.filter((p) => p.status?.toLowerCase() === "ongoing");
  const completedProjects = allProjects.filter((p) => p.status?.toLowerCase() === "completed");

  const currentProjects = activeTab === "ongoing" ? ongoingProjects : completedProjects;
  console.log("Current Projects:", currentProjects);

  // Apply filters
  const filteredProjects = currentProjects.filter((project) => {
    if (filters.category && project.category !== filters.category) return false;
    if (filters.academicYear && project.academicYear !== filters.academicYear) return false;
    return true;
  });

  // Pagination
  let totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get first image from project
  const getProjectImage = (project) => {
    if (project.images && project.images.length > 0 && project.images[0].fileData) {
      return bufferToDataURL(project.images[0].fileData);
    }
    return null;
  };

  // Latest 10 projects for the right section (by createdAt desc)
  const latestProjects = [...allProjects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Animated image blocks data (left grid) still uses allProjects
  const projectImages = allProjects
    .map((p) => getProjectImage(p))
    .filter(Boolean)
    .slice(0, 6);

  // Auto-rotate images (left grid)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % Math.max(projectImages.length, 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [projectImages.length]);

  // Auto-rotate right section (latest projects carousel)
  useEffect(() => {
    if (carouselInterval.current) clearInterval(carouselInterval.current);
    carouselInterval.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.max(latestProjects.length, 1));
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

  const projectTypes = [...new Set(currentProjects.map((p) => p.category).filter(Boolean))];
  const academicYears = [...new Set(currentProjects.map((p) => p.academicYear).filter(Boolean))];

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
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Animated Blocks */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Animated '11' Symbol (two columns of 3 blocks), group floats up/down */}
            <div className="relative h-96 flex items-center justify-center">
              {/* Sample SVG Bubble/Cloud Background */}
              <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="250" cy="270" rx="230" ry="180" fill="#E0ECFF" fillOpacity="0.7" />
                <ellipse cx="400" cy="420" rx="60" ry="40" fill="#B6D0FF" fillOpacity="0.5" />
              </svg>
              {/* Animated '11' group */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
                className="relative z-10 flex flex-row gap-8 w-full max-w-xs justify-center"
              >
                {/* Left '1' (lower) */}
                <div className="flex flex-col gap-4 translate-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square w-16 md:w-20 rounded-2xl bg-white/70 shadow-xl border border-blue-100 backdrop-blur-md flex items-center justify-center text-3xl font-bold text-blue-400 select-none"
                    />
                  ))}
                </div>
                {/* Right '1' (higher) */}
                <div className="flex flex-col gap-4 -translate-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square w-16 md:w-20 rounded-2xl bg-white/70 shadow-xl border border-blue-100 backdrop-blur-md flex items-center justify-center text-3xl font-bold text-blue-400 select-none"
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Project Counter & Description for latest projects carousel - Redesigned */}
            <div className="flex items-center justify-center h-96">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center h-full"
              >
                {/* Large soft number in background */}
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-[8rem] md:text-[10rem] font-extrabold select-none leading-none z-0 pointer-events-none bg-gradient-to-b from-blue-400 via-blue-200 to-white text-transparent bg-clip-text opacity-90"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {latestProjects.length > 0 ? String((carouselIndex % latestProjects.length) + 1).padStart(2, "0") : "01"}
                </span>
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-2">
                  {latestProjects.length > 0 ? (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-20 md:mt-24">
                        {latestProjects[carouselIndex % latestProjects.length].title}
                      </h2>
                      <p className="text-gray-600 text-base md:text-lg font-medium mb-6 max-w-md mx-auto">
                        {latestProjects[carouselIndex % latestProjects.length].description}
                      </p>
                      <Link
                        href={`/projects/${latestProjects[carouselIndex % latestProjects.length].id}`}
                        className="bg-blue-600 text-white px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base md:text-lg shadow-md"
                      >
                        Know more
                      </Link>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-20 md:mt-24">
                        No projects found
                      </h2>
                      <p className="text-gray-400 italic mb-6">No project data to display.</p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-16 text-center">
            <p className="text-2xl md:text-3xl font-serif italic text-gray-700 mb-4">
              "Silicon is the Canvas, Logic is the Art!"
            </p>
            <p className="text-lg text-gray-600 mb-2">
              Where VLSI, Embedded Systems, AI, and Communication come together to create innovation.
            </p>
            <p className="text-sm text-gray-500">
              Showcase your projects, share your ideas, and inspire your community!
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filters.academicYear}
              onChange={(e) => handleFilterChange("academicYear", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Year</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabChange("ongoing")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "ongoing"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ongoing Projects
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed Projects
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg font-semibold mb-2">Failed to load projects</p>
            <p className="text-red-500">Please try again later</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg p-16 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedProjects.map((project, index) => {
                  const imageUrl = getProjectImage(project);
                  const colorClass = cardColors[index % cardColors.length];

                  return (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Colored Header with Image */}
                      <div className={`relative h-48 ${colorClass} p-6 flex items-center justify-center`}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-white">
                            <h3 className="text-2xl font-bold">{project.title}</h3>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <ExternalLink className="text-white w-6 h-6" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            activeTab === "ongoing"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {project.status}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {project.projectType || "Projects"}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex gap-3">
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            Know more
                          </Link>
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex-1 border-2 border-blue-600 text-blue-600 text-center py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                          >
                            View More
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
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {String(page)}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
