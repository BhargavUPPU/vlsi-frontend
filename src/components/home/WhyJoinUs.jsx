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
      <img src="/INDUSTRYCONNECTIONS.svg" alt="Industry Connections" className="w-12 h-12" />
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
          <img src="/INDUSTRYCONNECTIONS.svg" alt="Industry Connections" className="w-12 h-12" />
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
          <img src="/INDUSTRYCONNECTIONS.svg" alt="Industry Connections" className="w-12 h-12" />
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
          className={` text-white flex-shrink-0`}
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
