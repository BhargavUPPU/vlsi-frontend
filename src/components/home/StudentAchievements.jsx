"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const achievements = [
  {
    title: "Projects",
    description:
      "A student-driven VLSI club fostering innovation through hands-on chip design and electronics projects.",
    image: "/rocket.svg", // Placeholder for rocket image
    href:"/projects"
  },
  {
    title: "Achievements",
    description:
      "A hub of excellence where students showcase talent, earning VLSI badges, alumni top-tech placements, and recognition for outstanding projects and innovative papers.",
    image: "/medal.svg", // Placeholder for trophy image
    href:"/achievements"
  },
  {
    title: "Photo Gallery",
    description:
      "Moments from the VLSI Club, capturing innovation, collaboration, and hands-on excellence in chip design and electronics",
    image: "/file (2).svg", // Placeholder for magazine image
    href:"/photogallery"
  },
];

export default function StudentAchievements() {
  const router=useRouter();
  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-12 bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.div
            variants={staggerItem}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
          >
            <div className="w-7 sm:w-8 md:w-9 h-7 sm:h-8 md:h-9 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">🏆</span>
            </div>
            <span className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">
              Student Excellence
            </span>
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6"
          >
            Student Achievements
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg"
          >
            Celebrating the remarkable accomplishments of our talented students
            in VLSI design, research, and innovation across various competitions
            and industry collaborations.
          </motion.p>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Image Placeholder */}
              <div
                className={`rounded-xl p-4 sm:p-6 mb-5 sm:mb-6 flex items-center justify-center h-28 sm:h-32 md:h-36`}
              >
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  width={80}
                  height={80}
                  className="object-contain w-25 h-25 sm:w-24 sm:h-24 md:w-35 md:h-35"
                  sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
                  priority={index === 0}
                />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                {achievement.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-center">
                {achievement.description}
              </p>

              {/* Know More Button */}
              <div className="mt-auto text-center">
                <button className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm sm:text-base hover:cursor-pointer"  onClick={()=>{router.push(achievement.href)}}>
                  Know more
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
