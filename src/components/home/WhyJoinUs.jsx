"use client";

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
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h6.75a2.75 2.75 0 0 1 2.75 2.75V20a.75.75 0 0 1-1.06.67L12 19.25l-0.94.42A.75.75 0 0 1 10 20V6.75A.75.75 0 0 0 9.25 6H4.5A.5.5 0 0 0 4 6.5v11.25c0 .41.34.75.75.75h5.5a.75.75 0 0 1 0 1.5h-5.5A2.25 2.25 0 0 1 2 17.75V6.5zm20 0A2.5 2.5 0 0 0 19.5 4h-6.75A2.75 2.75 0 0 0 10 6.75V20a.75.75 0 0 0 1.06.67l0.94-.42 0.94.42A.75.75 0 0 0 14 20V6.75A.75.75 0 0 1 14.75 6h4.75a.5.5 0 0 1 .5.5v11.25c0 .41-.34.75-.75.75h-5.5a.75.75 0 0 0 0 1.5h5.5A2.25 2.25 0 0 0 22 17.75V6.5z" />
      </svg>
    ),
    title: "Hands-on learning",
    bgColor: "bg-teal-500",
    points: [
      "Master VLSI concepts through practical workshops, lab sessions, and real-world projects.",
      "Advanced Lab Exposure - Work with industry-grade EDA tools (Cadence, Synopsys, Mentor) and FPGA boards to gain practical experience in chip design.",
      "Project-Driven Modules - Build real-world mini-projects such as digital circuits, RTL design, and layout optimization.",
      "Mentorship-Based Skill Building - Learn directly from experts through guided labs, live demos, debugging assistance, and peer collaboration.",
    ],
  },
  {
    icon: (
      <>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
          <g>
            <circle cx="32" cy="36" r="14" fill="#2563eb" />
            <circle cx="14" cy="28" r="8" fill="#60a5fa" />
            <circle cx="50" cy="28" r="8" fill="#60a5fa" />
            <circle cx="32" cy="20" r="10" fill="#2563eb" />
          </g>
        </svg>
      </>
    ),
    title: "Industry Connections",
    bgColor: "bg-yellow-500",
    points: [
      "Network with professionals, attend guest lectures, and participate in tech talks and top tech companies.",
      "Expert Guest Lectures - Interact with professionals from semiconductor companies like Intel, Qualcomm, NVIDIA, and AMD who share insights for securing internships through referrals, industry-linked events, and skill-based networking.",
      "Professional Networking - Participate in tech talks, panel discussions, and meetups that help build long-term career connections.",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Competition Excellence",
    bgColor: "bg-pink-500",
    points: [
      "Participate in national VLSI design competitions and hackathons.",
      "National-Level Participation - Get opportunities to compete in recognized EDA competitions such as Intel FPGA, IISF, and IEEE contests.",
      "Team-Based Innovation - Work in teams to solve real semiconductor design challenges from RTL coding to FPGA prototype demos.",
      "Portfolio & Recognition - Develop award-winning projects that enhance your resume and gain recognition from industry experts.",
    ],
  },
];

function FeatureCard({ feature, index, isExpanded }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`${feature.bgColor} rounded-lg p-3 text-white flex-shrink-0`}
        >
          {feature.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {feature.points
          .slice(0, isExpanded ? feature.points.length : 2)
          .map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <p className="text-gray-600 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

export default function WhyJoinUs() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="why-join" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Why Join US?
          </motion.h2>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
            className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors mx-auto"
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
