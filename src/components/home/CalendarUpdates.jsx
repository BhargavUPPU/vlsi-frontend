"use client";

import { motion } from "framer-motion";
import { Calendar, Bell, ExternalLink } from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";

const announcements = [
  {
    date: "Today",
    time: "2:30pm",
    timeColor: "bg-blue-200 text-blue-800",
    title: "New Advanced EDA Tools Available in VLSI Lab",
    description:
      "Dive into the world of silicon with the VLSI Design Challenge 2025! This hands-on technical event invites engineering students to explore their skills in Very Large Scale Integration. Participants will solve real-world design problems—from RTL coding...",
    venue: "MCA-1 LAB",
  },
  {
    date: "22-23 Oct",
    time: "10:30 Am",
    timeColor: "bg-green-200 text-green-800",
    title: "New Advanced EDA Tools Available in VLSI Lab",
    description:
      "Dive into the world of silicon with the VLSI Design Challenge 2025! This hands-on technical event invites engineering students to explore their skills in Very Large Scale Integration. Participants will solve real-world design problems—from RTL coding...",
    venue: "MCA-1 LAB",
  },
  {
    date: "Today",
    time: "2:30pm",
    timeColor: "bg-pink-200 text-pink-800",
    title: "New Advanced EDA Tools Available in VLSI Lab",
    description:
      "Dive into the world of silicon with the VLSI Design Challenge 2025! This hands-on technical event invites engineering students to explore their skills in Very Large Scale Integration. Participants will solve real-world design problems—from RTL coding...",
    venue: "MCA-1 LAB",
  },
];

export default function CalendarUpdates() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Calendar & Updates Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your central hub for events, deadlines, and important announcements.
            Stay connected with everything happening in our VLSI community.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 shadow-md flex flex-col items-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Announcements
          </h3>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {announcements.map((announcement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow min-h-27.5"
              >
                {/* Time Badge */}
                <div className="flex flex-col items-center justify-center min-w-27.5 p-3">
                  <div
                    className={`rounded-xl px-4 py-2 font-semibold text-center text-sm mb-2 ${announcement.timeColor}`}
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
      </div>
    </section>
  );
}
