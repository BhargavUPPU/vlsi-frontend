"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";

const features = [
  {
    icon: (
      // Open book SVG icon
      <img src="/AboutUs2.svg" alt="Industry Connections" className="w-12 h-12" />
    ),
    title: "Hands-on learning",
    bgColor: "bg-teal-500",
    subtitle:       "Master VLSI concepts through practical workshops, lab sessions, and real-world projects.",
    points: [
      <>
        <strong>Advanced Lab Exposure -</strong> Work with industry-grade EDA tools (Cadence, Synopsys, Mentor) and FPGA boards to gain practical experience in chip design.
      </>,
      <>
        <strong>Project-Driven Modules -</strong> Build real-world mini-projects such as digital circuits, RTL design, and layout optimization.
      </>,
      <>
        <strong>Mentorship - Based Skill Building -</strong> Learn directly from experts through guided labs, live demos, debugging assistance, and peer collaboration.
      </>,
    ],
  },
  {
    icon: (
          <img src="/AboutUs3.svg" alt="Industry Connections" className="w-12 h-12" />
    ),
    title: "Industry Connections",
    bgColor: "bg-yellow-500",
    subtitle:    "Network with professionals, attend guest lectures, and participate in tech talks and top tech companies.",
    points: [
      <>
        <strong>Expert Guest Lectures -</strong> Interact with professionals from semiconductor companies like Intel, Qualcomm, NVIDIA, and AMD who share insights for securing internships through referrals, industry-linked events, and skill-based networking.
      </>,
      <>
        <strong>Internship Pathways -</strong> Get support for securing internships through referrals, industry linked events, and skill-based selection programs.
      </>,
      <>
        <strong>Professional Networking -</strong> Participate in tech talks, panel discussions, and meetups that help build long-term career connections.
      </>,
    ],
  },
  {
    icon: (
          <img src="/AboutUs1.svg" alt="Industry Connections" className="w-12 h-12" />
    ),
    title: "Competition Excellence",
    subtitle:"Participate in national VLSI design competitions and hackathons.",
    bgColor: "bg-pink-500",
    points: [
      <>
        <strong>National-Level Participation -</strong> Get opportunities to compete in recognized EDA competitions such as Intel FPGA, IISF, and IEEE contests.
      </>,
      <>
        <strong>Team-Based Innovation -</strong> Work in teams to solve real semiconductor design challenges from RTL coding to FPGA prototype demos.
      </>,
      <>
        <strong>Portfolio & Recognition -</strong> Develop award-winning projects that enhance your resume and gain recognition from industry experts.
      </>,
    ],
  },
];

function FeatureCard({ feature, index, isExpanded }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
        <div
          className={` text-white flex-shrink-0`}
        >
          {feature.icon}
        </div>
        <div>
           <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{feature.title}</h3>
        <p className="text-sm text-gray-500 ml-auto">{feature.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {feature.points
          .slice(0, isExpanded ? feature.points.length : 2)
          .map((point, idx) => {
            const isElement = React.isValidElement(point);
            if (isElement) {
              return (
                <div key={idx} className="flex items-start gap-2 sm:gap-3">
                  <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                  <div className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{point}</div>
                </div>
              );
            }

            const str = String(point);
            const hyphenIndex = str.indexOf("-");
            if (hyphenIndex !== -1) {
              const prefix = str.slice(0, hyphenIndex + 1); // include hyphen
              const rest = str.slice(hyphenIndex + 1);
              return (
                <div key={idx} className="flex items-start gap-2 sm:gap-3">
                  <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    <strong>{prefix}</strong>
                    {rest}
                  </p>
                </div>
              );
            }

            return (
              <div key={idx} className="flex items-start gap-2 sm:gap-3">
                <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{str}</p>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
}

export default function WhyJoinUs() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="why-join" className="py-4 sm:py-6 md:py-8 lg:py-12 bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.h2
              variants={staggerItem}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 "
            >
              Why {""}
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ">
                Join Us?
              </span>
              
            </motion.h2>
          </motion.div>

          {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isExpanded={isExpanded}
            />
          ))}
        </motion.div>

        {/* Common Read More/Less Button */}
        <div className="text-center mt-8">
          <button
            className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors mx-auto border border-blue-600 hover:border-blue-700 rounded-lg px-4 py-2 text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Read Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Read more <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
