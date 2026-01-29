"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, FileQuestion, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TestsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch all tests
  const {
    data: testsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: () => apiClient.get(API_ENDPOINTS.TESTS.BASE),
  });

  const allTests = Array.isArray(testsData?.data) ? testsData.data : [];

  // Filter tests by type
  const filteredTests = allTests.filter((test) => {
    if (activeFilter === "all") return true;
    return test.type?.toLowerCase() === activeFilter.toLowerCase();
  });

  // Get unique test types
  const testTypes = [
    "all",
    ...new Set(allTests.map((t) => t.type).filter(Boolean)),
  ];

  // Status color mapping
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "live")
      return { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-600" };
    if (statusLower === "completed")
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        dot: "bg-green-600",
      };
    if (statusLower === "upcoming")
      return {
        bg: "bg-orange-100",
        text: "text-orange-600",
        dot: "bg-orange-600",
      };
    return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-600" };
  };

  return (
    <div className="min-h-screen mt-5">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto bg-gray-100 p-8 rounded-lg flex flex-col md:flex-row items-center">
        <div className="flex-grow mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800 text-center md:text-left sm:align-text-top">
            Unleash Your Circuit <br />
            Mastery: Dive into the <br />
            Future of VLSI Design!
          </h2>
        </div>
        <Image
          src="/TestPortal.svg"
          alt="student image"
          height={500}
          width={600}
          className="mx-auto"
          priority
        />
      </section>

      {/* Skill Assessment Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Skill Assessment
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {testTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeFilter === type
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
              }`}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-2 bg-gray-200 rounded w-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1" />
                  <div className="h-10 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg font-semibold mb-2">
              Failed to load tests
            </p>
            <p className="text-red-500">Please try again later</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTests.length === 0 && (
          <div className="bg-gray-100 rounded-lg p-16 text-center shadow-sm">
            <FileQuestion size={64} className=" mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Tests Available
            </h3>
            <p className="text-gray-600">
              {activeFilter === "all"
                ? "There are no tests available at the moment"
                : `No ${activeFilter} tests found`}
            </p>
          </div>
        )}

        {/* Test Cards Grid */}
        {!isLoading && !error && filteredTests.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTests.map((test, index) => {
                const statusColors = getStatusColor(test.status);
                const isCompleted = test.status?.toLowerCase() === "completed";
                const isLive = test.status?.toLowerCase() === "live";
                const isUpcoming = test.status?.toLowerCase() === "upcoming";

                // Mock progress for completed tests (you can replace with actual data)
                const progress = isCompleted ? 100 : 0;

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColors.dot}`}
                      />
                      <span
                        className={`text-sm font-semibold ${statusColors.text}`}
                      >
                        {test.status}
                      </span>
                    </div>

                    {/* Test Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {test.title}
                    </h3>

                    {/* Test Info */}
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>Subject: {test.subject}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FileQuestion size={16} />
                        <span>
                          {test.duration} Marks · Total Questions:{" "}
                          {test.noOfQuestions}
                        </span>
                      </p>
                      {test.date && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {new Date(test.date).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Progress Bar (for completed tests) */}
                    {isCompleted && (
                      <div className="mb-4">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-auto w-full flex justify-between items-center">
                      <Link
                        href={test.examLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm ${
                          isUpcoming ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isCompleted ? "REVIEW" : "START"}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
