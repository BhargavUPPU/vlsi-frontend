"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Filter as FilterIcon,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
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

  const itemsPerPage = 6;

  // Fetch all events with optimized caching
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL),
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  // Process and filter events
  const allEvents = Array.isArray(eventsData?.data) ? eventsData.data : [];

  // Separate upcoming and completed events - memoized
  const { upcomingEvents, completedEvents } = useMemo(() => {
    return {
      upcomingEvents: allEvents.filter(
        (event) => event.status?.toLowerCase() === "upcoming",
      ),
      completedEvents: allEvents.filter(
        (event) => event.status?.toLowerCase() === "completed",
      ),
    };
  }, [allEvents]);

  // Get current tab events
  const currentEvents =
    activeTab === "upcoming" ? upcomingEvents : completedEvents;

  // Apply filters - memoized
  const filteredEvents = useMemo(() => {
    return currentEvents.filter((event) => {
      if (filters.eventType && event.eventType !== filters.eventType)
        return false;
      if (filters.year) {
        const eventYear = new Date(event.eventDate).getFullYear().toString();
        if (eventYear !== filters.year) return false;
      }
      return true;
    });
  }, [currentEvents, filters]);

  // Pagination - memoized
  const { totalPages, paginatedEvents } = useMemo(() => {
    const pages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginated = filteredEvents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    return { totalPages: pages, paginatedEvents: paginated };
  }, [filteredEvents, currentPage]);

  // Get first image from event files
  const getEventImage = (event) => {
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
    const types = [
      ...new Set(currentEvents.map((e) => e.eventType).filter(Boolean)),
    ];
    const eventYears = [
      ...new Set(currentEvents.map((e) => new Date(e.eventDate).getFullYear())),
    ];
    return { eventTypes: types, years: eventYears };
  }, [currentEvents]);

  return (
    <div className="min-h-screen pb-8 sm:pb-12 md:pb-16 bg-gray-50">
      {/* Featured Events Carousel */}
      {/* {!isLoading && !error && allEvents.length > 0 && (
        <EventsCarousel events={allEvents.slice(0, 5)} />
      )} */}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base transition-colors"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Home</span>
        </Link>
        
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="w-full lg:flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight tracking-tight">
              Internal Events Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
              Be part of the next big innovation at VLSI Club!
            </p>
          </div>
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <Image
              src="/eventHeader.jpg"
              alt="Event Header"
              className="rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:scale-105 transition-transform duration-300 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover"
              width={256}
              height={256}
            />
          </div>
        </header>
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
          <button
            onClick={() => handleTabChange("upcoming")}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Events
          </button>
        </div>

        {/* Filters */}
          <div className=" p-4 sm:p-5 md:p-5  mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between sm:justify-end gap-3 sm:gap-4">
              {/* Event Type */}
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange("eventType", e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
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
                className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              >
                <option value="">All Years</option>
                {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
                ))}
              </select>
              {/* Filter Button */}
              <button className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium">
                <FilterIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200" />
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <p className="text-red-600 text-base sm:text-lg font-semibold mb-2">
              Failed to load events
            </p>
            <p className="text-red-500 text-sm sm:text-base">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-10 sm:p-12 md:p-16 text-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                {paginatedEvents.map((event) => {
                  const imageUrl = getEventImage(event);
                  const eventDate = new Date(event.eventDate);

                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-lg"
                    >
                      {/* Event Image */}
                                  <div className="relative h-68 sm:h-66 md:h-110 bg-gradient-to-br from-blue-100 to-purple-100 w-full">
                                  {imageUrl ? (
                                    <img
                                    src={imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-fit group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                    <Calendar size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300" />
                                    </div>
                                  )}

                                  {/* Status Badge */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                              activeTab === "upcoming"
                                ? "bg-red-500 text-white"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Event Meta */}
                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                            <Calendar size={14} className="sm:w-4 sm:h-4" />
                            <span>{eventDate.toLocaleDateString()}</span>
                          </div>
                          {event.eventType && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                              <Users size={14} className="sm:w-4 sm:h-4" />
                              <span>{event.eventType}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
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
              <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10 md:mt-12 px-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
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
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
