"use client";

import { motion } from "framer-motion";
import { Calendar, Rocket, Award, Users, Lightbulb } from "lucide-react";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

const timelineEvents = [
  {
    date: "August 2023",
    title: "Club Inception",
    description: "VLSI Club officially established with 50+ founding members passionate about semiconductor technology and innovation.",
    icon: Rocket,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    date: "October 2023",
    title: "First Workshop Series",
    description: "Successfully conducted comprehensive Introduction to VLSI Design workshop series with hands-on lab sessions.",
    icon: Lightbulb,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    date: "December 2023",
    title: "Project Showcase",
    description: "Presented 15+ innovative student projects at the annual technical fest, receiving outstanding recognition.",
    icon: Award,
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    date: "March 2024",
    title: "Industry Partnerships",
    description: "Established strategic partnerships with leading semiconductor companies for internships and collaborative projects.",
    icon: Users,
    color: "bg-green-500",
    bgColor: "bg-green-50",
  },
];

export default function ClubTimeline() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
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
            Milestones that shaped our path to excellence in VLSI design and innovation
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="relative"
        >
          {/* Timeline Line - Mobile: left-aligned, Desktop: center */}
          <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:transform lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

          {/* Timeline Events */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="relative flex items-start lg:items-center"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 z-10 top-6 lg:top-auto">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 ${event.color} rounded-full border-2 sm:border-4 border-white shadow-lg`}></div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full lg:w-5/12 ml-12 sm:ml-16 lg:ml-0 ${
                    isLeft ? 'lg:mr-auto lg:pr-6 xl:pr-8' : 'lg:ml-auto lg:pl-6 xl:pl-8'
                  }`}>
                    <motion.div
                      whileHover={{ y: -2, scale: 1.01 }}
                      className={`${event.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 border border-white/50`}
                    >
                      {/* Icon and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`${event.color} rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md w-fit`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-xs sm:text-sm font-semibold text-gray-600">
                            {event.date}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
