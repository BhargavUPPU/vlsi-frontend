"use client";

import { useState } from "react";
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

  // Fetch all events
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL),
  });

  // Process and filter events
  const allEvents = Array.isArray(eventsData?.data) ? eventsData.data : [];

  // Separate upcoming and completed events
  const upcomingEvents = allEvents.filter(
    (event) => event.status?.toLowerCase() === "upcoming"
  );
  const completedEvents = allEvents.filter(
    (event) => event.status?.toLowerCase() === "completed"
  );

  // Get current tab events
  const currentEvents =
    activeTab === "upcoming" ? upcomingEvents : completedEvents;

  // Apply filters
  const filteredEvents = currentEvents.filter((event) => {
    if (filters.eventType && event.eventType !== filters.eventType)
      return false;
    if (filters.year) {
      const eventYear = new Date(event.eventDate).getFullYear().toString();
      if (eventYear !== filters.year) return false;
    }
    // Add more filter logic as needed
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Get unique event types and years for filters
  const eventTypes = [
    ...new Set(currentEvents.map((e) => e.eventType).filter(Boolean)),
  ];
  const years = [
    ...new Set(currentEvents.map((e) => new Date(e.eventDate).getFullYear())),
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Events</span>
        </Link>
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Join the Event</h1>
            <p className="text-lg text-gray-600">Welcome to VLSI Innovation!</p>
          </div>
          <div>
            <Image
              src="/eventHeader.jpg"
              alt="Event Header"
              className="rounded-lg"
              width={200}
              height={200}
            />
          </div>
        </header>
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleTabChange("upcoming")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Events
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Event Type */}
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange("eventType", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Event Type</option>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Branch */}
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Branch</option>
              <option value="ECE">ECE</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
            </select>

            {/* Date */}
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Filter Button */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
              <FilterIcon size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg font-semibold mb-2">
              Failed to load events
            </p>
            <p className="text-red-500">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg p-16 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedEvents.map((event) => {
                  const imageUrl = getEventImage(event);
                  const eventDate = new Date(event.eventDate);

                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Event Image */}
                      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar size={64} className="text-gray-300" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              activeTab === "upcoming"
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {event.description}
                        </p>

                        {/* Event Meta */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            <span>{eventDate.toLocaleDateString()}</span>
                          </div>
                          {event.eventType && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users size={16} />
                              <span>{event.eventType}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Read more
                          </Link>
                          <Link
                            href={`/events/${event.id}`}
                            className="flex-1 border-2 border-blue-600 text-blue-600 text-center py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
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
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
