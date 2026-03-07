"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Filter as FilterIcon, ChevronLeft, ArrowLeft, ChevronRight, } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import EventsCarousel from "@/components/home/EventsCarousel";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" or "completed"
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    eventType: "",
    year: "",
    branch: "",
    date: "",
  });

  // pagination size (allow 0 to view all)
  const [itemsPerPageState, setItemsPerPageState] = useState(6);

  // Fetch paginated events from backend
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", activeTab, currentPage, itemsPerPageState, filters.eventType, filters.year],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('status', activeTab === 'upcoming' ? 'upcoming' : 'completed');
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.year) params.append('year', filters.year);
      if (itemsPerPageState && itemsPerPageState > 0) {
        params.append('page', String(currentPage));
        params.append('limit', String(itemsPerPageState));
      } else {
        // view all
        params.append('limit', '0');
      }
      // include files for thumbnails
      params.append('includeFiles', 'true');

      return apiClient.get(`${API_ENDPOINTS.EVENTS.GET_ALL}?${params.toString()}`);
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  // Server-side paginated response: { data: Event[], total }
  const responsePayload = eventsData?.data || { data: [], total: 0 };
  const paginatedEvents = Array.isArray(responsePayload.data) ? responsePayload.data : [];
  const totalCount = typeof responsePayload.total === "number" ? responsePayload.total : 0;

  const totalPages = itemsPerPageState && itemsPerPageState > 0 ? Math.ceil(totalCount / itemsPerPageState) : 1;

  // Get first image from event files
  const getEventImage = (event) => {
    // Backend sets initialImage for us (first file or certificate)
    if (event.initialImage) {
      return event.initialImage;
    }
    // Fallback to files array
    if (event.files && event.files.length > 0 && event.files[0].fileData) {
      return bufferToDataURL(event.files[0].fileData);
    }
    return null;
  };

  // Reset page when changing tabs or filters
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Get unique event types and years for filters - memoized
  const { eventTypes, years } = useMemo(() => {
    const types = [...new Set(paginatedEvents.map((e) => e.eventType).filter(Boolean))];
    const eventYears = [...new Set(paginatedEvents.map((e) => new Date(e.eventDate).getFullYear()))];
    return { eventTypes: types, years: eventYears };
  }, [paginatedEvents]);

  return (
    <div className="min-h-screen pb-6 sm:pb-8 md:pb-12 lg:pb-16 bg-gray-50">
      {/* Featured Events Carousel */}
      {/* {!isLoading && !error && allEvents.length > 0 && (
        <EventsCarousel events={allEvents.slice(0, 5)} />
      )} */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base transition-colors"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Home</span>
        </Link>
        
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="w-full lg:flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight tracking-tight">
              Internal Events Hub
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium leading-relaxed">
              Be part of the next big innovation at VLSI Club!
            </p>
          </div>
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <Image
              src="/eventHeader.jpg"
              alt="Event Header"
              className="hover:scale-105 transition-transform duration-300 rounded-lg shadow-md w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover"
              width={224}
              height={224}
            />
          </div>
        </header>
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => handleTabChange("upcoming")}
            className={`w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Events
          </button>
        </div>

        {/* Filters */}
          <div className="p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between sm:justify-end gap-2 sm:gap-3 md:gap-4">
              {/* Event Type */}
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange("eventType", e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
              >
                <option value="">All Event Types</option>
                {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
                ))}
              </select>

              {/* Year */}
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
              >
                <option value="">All Years</option>
                {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
                ))}
              </select>
              {/* Items per page */}
              <select
                value={itemsPerPageState}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setItemsPerPageState(val);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
              >
                <option value={6}>6 / page</option>
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
                <option value={0}>View all</option>
              </select>
              {/* Filter Button */}
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
                <FilterIcon size={18} className="sm:w-5 sm:h-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-44 sm:h-48 md:h-56 lg:h-64 bg-gray-200" />
                <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center">
            <p className="text-red-600 text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">
              Failed to load events
            </p>
            <p className="text-red-500 text-xs sm:text-sm md:text-base">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && paginatedEvents.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 md:p-12 lg:p-16 text-center shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={24} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              {activeTab === "upcoming"
                ? "There are no upcoming events at the moment"
                : "There are no completed events to show"}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && paginatedEvents.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
              >
                {paginatedEvents.map((event) => {
                  const imageUrl = getEventImage(event);
                  const eventDate = new Date(event.eventDate);

                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-full flex flex-col"
                    >
                      {/* Event Image */}
                      <div className="relative w-full h-44 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-blue-100 to-purple-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar size={40} className="sm:w-12 sm:h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
                          <span
                            className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              activeTab === "upcoming" ? "bg-red-500 text-white" : "bg-gray-700 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-2.5 md:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4 line-clamp-3 leading-relaxed flex-1">
                          {event.description}
                        </p>

                        {/* Event Meta */}
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2 mb-2 sm:mb-3 md:mb-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                            <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{eventDate.toLocaleDateString()}</span>
                          </div>
                          {event.eventType && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                              <Users size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{event.eventType}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3 mt-2">
                          <Link
                            href={`/events/${event.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm md:text-base"
                          >
                            Read more
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
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
                      className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {page}
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
