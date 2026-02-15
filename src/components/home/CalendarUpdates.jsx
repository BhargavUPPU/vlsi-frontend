"use client";

import { motion } from "framer-motion";
import { useAnnouncements } from "@/lib/hooks/useAdmin";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";

const timeBadgeColors = [
  "bg-blue-200 text-blue-800",
  "bg-green-200 text-green-800",
  "bg-pink-200 text-pink-800",
];

export default function CalendarUpdates() {
  const { data: announcements, isLoading } = useAnnouncements();
  
  // Filter for active announcements and sort by priority if not done by backend
  // The service call uses /active endpoint or basic getAll
  // Let's use the data as is for now, assuming the backend returns what we need
  const displayAnnouncements = announcements?.filter(a => a.isActive) || [];

  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-12 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Calendar & Updates Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
            Your central hub for events, deadlines, and important announcements.
            Stay connected with everything happening in our VLSI community.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 md:p-8 shadow-md flex flex-col items-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Announcements
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : displayAnnouncements.length > 0 ? (
            <div className="w-full flex flex-col gap-4 max-w-4xl">
              <div className="w-full max-h-96 overflow-y-auto pr-2 space-y-4">
                {displayAnnouncements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={defaultViewport}
                    className="flex bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow min-h-27.5 overflow-hidden"
                  >
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center min-w-27.5 p-3">
                      <div
                        className={`rounded-xl px-4 py-2 font-semibold text-center text-sm mb-2 ${
                          timeBadgeColors[index % timeBadgeColors.length]
                        }`}
                      >
                        {announcement.date}
                        <br />
                        <span className="text-lg font-bold">
                          {announcement.time}
                        </span>
                      </div>
                    </div>
                    {/* Announcement Content */}
                    <div className="flex-1 flex flex-col justify-center py-3 pr-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                          {announcement.title}
                        </h4>
                        <span className="text-xs font-semibold text-right text-gray-700 mt-1 sm:mt-0">
                          <span className="underline">Venue</span>:{" "}
                          {announcement.venue}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {announcement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 py-8 italic text-center">
              No recent announcements. Stay tuned for updates!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
