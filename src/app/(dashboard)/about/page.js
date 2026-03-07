"use client";
import React, { useState,useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AboutUs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const avatarRingVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
      delay: 0.15,
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay: 0.25 + i * 0.07,
    },
  }),
};

const shimmerVariants = {
  initial: { x: "-100%", opacity: 0 },
  hover: {
    x: "100%",
    opacity: [0, 0.6, 0],
    transition: { duration: 0.55, ease: "easeInOut" },
  },
};

// ─── Tilt Card Hook ───────────────────────────────────────────────────────────

function useTilt() {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 300, damping: 30 });
  const y = useSpring(rawY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
  
  const objectives = [
    {
      title: "Competition Excellence",
      description:
        "Prepare and guide students for participation in various VLSI design competitions, hackathons, and technical symposiums.",
      icon: "🏆",
    },
    {
      title: "Global Networking",
      description:
        "Create a network of VLSI professionals and alumni to help students to share knowledge, opportunities and collaborative ventures worldwide.",
      icon: "🌐",
    },
    {
      title: "Industry Collaboration",
      description:
        "Bridge the gap between academia and industry through partnerships, internships, and collaborative projects with semiconductor companies.",
      icon: "🤝",
    },
    {
      title: "Innovation & Research",
      description:
        "Encourage innovative thinking and cutting-edge research in semiconductor technology, digital systems, and emerging technologies like AI accelerators.",
      icon: "🔬",
    },
    {
      title: "Skill Development",
      description:
        "Provide hands-on training in industry-standard EDA tools, HDL programming, verification methodologies, and design optimization techniques.",
      icon: "⚡",
    },
    {
      title: "Promote VLSI Education",
      description:
        "Foster comprehensive understanding of VLSI design methodologies and industry best practices among students and enthusiasts.",
      icon: "📚",
    },
  ];

  const founders = [
    {
      name: "Pragada Sai Manohar",
      role: "WEB DEVELOPER",
      roll_number: "19131A04J4",
      image: "/Sai_Manohar.jpg",
    },
    {
      name: "Pujari Thrinadh Sai",
      role: "WEB DESIGNER",
      roll_number: "19131A04J5",
      image: "/Trinadh.jpg",
    },
  ];

  const developers = [
    {
      name:"Nazeer Hussain Khan",
      role:"WEB TEAM LEAD",
      roll_number:"21131A04H9",
      image:"/NAZEER.jpg"
    },
    {
      name: "Uppu Bhargav Sai",
      role: "WEB DEVELOPER",
      roll_number: "21131A04T7",
      image: "/developer.jpeg",
    },
    {
      name: "Anvesh",
      role: "WEB DESIGNER",
      roll_number: "21131A04Q9",
      image: "/desinger.jpeg",
    },
  ];
  // VLSID Club FAQ (from image)
  const vlsiFaqs = [
    {
      question: "What is the VLSID Club?",
      answer:
        "The VLSID Club is a student-driven community focused on learning, designing, and implementing VLSI (Very Large-Scale Integration) and digital electronics systems through hands-on projects, workshops, and competitions.",
    },
    {
      question: "What activities does the club conduct?",
      answer:
        "Our activities include:\n• Hands-on workshops\n• Guest lectures from industry experts\n• FPGA and RTL design\n• Project showcases\n• Magazine releases (Silicon Chronicles)",
    },
    {
      question: "Who can join the VLSID Club?",
      answer:
        "Any student interested in electronics, VLSI, chip design, FPGA programming, or digital systems—regardless of year or skill level—is welcome to join.",
    },
    {
      question: "What are the benefits of joining the VLSID Club?",
      answer:
        "Members gain:\n• Strong practical VLSI skills\n• Real-world project experience\n• Internship and networking opportunities\n• Exposure to chip design competitions\n• Resume-building achievements\n• Industry-ready confidence",
    },
    {
      question: "Do I need prior knowledge of VLSI to join?",
      answer:
        "No. We start with beginner-friendly sessions and gradually move to advanced topics. Mentors and seniors guide you throughout the learning process.",
    },
    {
      question: "How can I become an active member?",
      answer:
        "Attend our regular meetings, participate in events, contribute to projects, and engage in discussions. Active members may also take leadership roles.",
    },
    {
      question: "What skills will I learn in the club?",
      answer:
        "You will learn:\n• Digital design fundamentals\n• Verilog/VHDL Programming\n• FPGA development\n• EDA tools (Cadence, Mentor, Synopsys basics)\n• CORDIC, DCT, and DSP block design\n• Chip design workflow and RTL implementation",
    },
    {
      question: "How can I stay updated with club announcements?",
      answer:
        "You can follow:\n• WhatsApp Group\n• Notice board updates\n• Official Instagram/website\n• LinkedIn",
    },
    {
      question: "How do I apply for the VLSID Club recruitment?",
      answer:
        "Students interested in joining the VLSID Club can apply through the official Google Form. After submitting the form, applicants must attend a basic exam to assess their fundamental knowledge and interest. Candidates who qualify are called for an interview to evaluate their motivation and willingness to learn. Based on the exam and interview performance, the club finalizes the shortlist of selected members.",
    },
  ];

  function DeveloperCard({ dev, idx }) {
    const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
  
    return (
      <motion.article
        ref={ref }
        key={dev.id ?? idx}
        role="listitem"
        variants={cardVariants}
        tabIndex={0}
        aria-label={`Developer ${dev.name}, ${dev.role}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
        whileFocus={{ scale: 1.02 }}
        className="relative group bg-white rounded-2xl p-7 sm:p-9
          shadow-[0_2px_16px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.05)]
          border border-gray-100/80 text-center
          cursor-default overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2
          will-change-transform"
      >
        {/* ── Shimmer sweep on hover ─────────────────────────────────────── */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10
            bg-gradient-to-r from-transparent via-white/60 to-transparent
            skew-x-[-20deg]"
          variants={shimmerVariants}
          initial="initial"
          whileHover="hover"
        />
  
        {/* ── Subtle gradient wash ──────────────────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0
            group-hover:opacity-100 transition-opacity duration-500
            bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent rounded-2xl"
        />
  
        {/* ── Avatar ───────────────────────────────────────────────────── */}
        <motion.div
          variants={avatarRingVariants}
          className="flex items-center justify-center mb-5 sm:mb-7"
        >
          <div
            className="relative p-[3px] rounded-full
              bg-gradient-to-br from-indigo-400 via-violet-400 to-pink-400
              shadow-[0_0_0_4px_white]
              group-hover:shadow-[0_0_0_4px_white,0_4px_20px_rgba(99,102,241,0.25)]
              transition-shadow duration-300"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative rounded-full overflow-hidden bg-gray-100">
              <Image
                src={dev.image ?? "/images/avatar-placeholder.png"}
                alt={dev.alt ?? dev.name}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                priority={false}
              />
            </div>
          </div>
        </motion.div>
  
        {/* ── Name ─────────────────────────────────────────────────────── */}
        <motion.h3
          custom={0}
          variants={textRevealVariants}
          className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 mb-1"
        >
          {dev.name}
        </motion.h3>
  
        {/* ── Roll number ──────────────────────────────────────────────── */}
        {dev.roll_number ? (
          <motion.p
            custom={1}
            variants={textRevealVariants}
            className="text-sm text-gray-400 font-mono mb-2 tracking-wide"
          >
            {dev.roll_number}
          </motion.p>
        ) : null}
  
        {/* ── Role badge ───────────────────────────────────────────────── */}
        <motion.span
          custom={2}
          variants={textRevealVariants}
          className="inline-block mt-1 px-3 py-1 rounded-full
            text-xs sm:text-sm font-medium
            bg-indigo-50 text-indigo-600
            ring-1 ring-indigo-100
            group-hover:bg-indigo-100 group-hover:ring-indigo-200
            transition-colors duration-200"
        >
          {dev.role}
        </motion.span>
  
        {/* ── Bottom accent line ────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-1/2 -translate-x-1/2
            h-[2px] rounded-full
            bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400"
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: "60%", opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </motion.article>
    );
  }
  

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* About VLSID Club Section */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Home</span>
        </Link>
        <div className="mb-12 sm:mb-16 max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 md:mb-12 text-center px-2">
            About <span className="text-[#2563eb]">VLSID</span> Club
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* VLSID Logo */}
            <div className="flex justify-center order-1 lg:order-none">
              <Image
                src="/logo.png"
                alt="VLSID Club Logo"
                width={500}
                height={500}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-68 lg:h-68 object-contain"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-none">
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                  The VLSID (VLSI Design) Club is a student-driven technical
                  community committed to exploring and advancing the field of
                  VLSI and semiconductor technology. Under the guidance of
                  experienced faculty, the club aims to bridge the gap between
                  academic learning and industry expectations by providing a
                  strong foundation in both core concepts and practical
                  skills.The club promotes peer-to-peer learning and mentorship,
                  enabling effective knowledge transfer from seniors to juniors
                  through structured classes, hands-on training with
                  industry-standard EDA tools, collaborative projects, and
                  regular assessments. Through workshops, industrial talks,
                  alumni interactions, and technical conferences, members gain
                  exposure to real-world challenges, emerging technologies, and
                  career opportunities in the semiconductor domain.By
                  encouraging innovation, teamwork, and continuous learning, the
                  VLSID Club nurtures technically competent and industry-ready
                  engineers, empowering students to design and shape the future
                  of silicon technology. Think Silicon. Design the Future.
                </p>
              </div>
              {/* <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <p className="text-gray-700 text-justify leading-relaxed">
                  Along with their batchmates, they laid the foundation of what
                  became the VLSID Club. Today, the VLSID Club stands as a
                  thriving learning community of 100+ active members from
                  first-year and third-year ECE students, guided by experienced
                  Faculty Coordinator, Dr. J. Bhaskara Rao. The VLSID Club
                  continues to thrive as a hub for learning, collaboration, and
                  innovation in VLSI design, empowering students to explore new
                  technologies, share knowledge, and contribute to the
                  semiconductor industry.
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Vision and Mission Section */}
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Vision */}
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-t-4 border-[#2563eb] transform transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Vision
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
              To create a community of innovative and skilled individuals who
              are passionate about VLSI and semiconductor technology, empowering
              them to become future leaders in chip design and hardware
              innovation.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-t-4 border-[#2563eb] transform transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Mission
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
              To provide hands-on learning opportunities in VLSI design,
              verification, and fabrication through workshops, projects, and
              competitions.
            </p>
          </div>
        </div>

      
        {/* Our Objectives Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 flex items-center justify-center gap-2 px-2">
            <span role="img" aria-label="Objectives">
              📋
            </span>{" "}
            Our Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* 1 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-indigo-500 to-blue-500 shadow-md ring-1 ring-indigo-100">
                  1
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">
                  Knowledge Transfer from Seniors to Juniors
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Organizing Classes for 2nd-Year Students</li>
                  <li>Providing Training to 3rd-Year Students</li>
                  <li>Conducting Mock-Tests</li>
                </ul>
              </div>
            </div>
            {/* 2 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-green-500 to-teal-400 shadow-md ring-1 ring-teal-100">
                  2
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-teal-600">
                  Updating and Practicing Question Banks
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Collecting and Organizing Questions</li>
                  <li>Practicing Questions</li>
                </ul>
              </div>
            </div>
            {/* 3 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 shadow-md ring-1 ring-pink-100">
                  3
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-pink-600">
                  Interacting with Alumni
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Networking Opportunities</li>
                  <li>Career Advice</li>
                </ul>
              </div>
            </div>
            {/* 4 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md ring-1 ring-yellow-100">
                  4
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-orange-600">
                  Conducting Industrial Talks
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Expert Talks</li>
                  <li>Industry Insights</li>
                </ul>
              </div>
            </div>
            {/* 5 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-red-500 to-pink-600 shadow-md ring-1 ring-red-100">
                  5
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-pink-600">
                  Including Juniors in Senior's Projects
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Project Participation</li>
                  <li>Mentorship</li>
                </ul>
              </div>
            </div>
            {/* 6 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md ring-1 ring-sky-100">
                  6
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">
                  Attending or Applying for Workshops in IITs/NITs
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Workshop Participation</li>
                  <li>Application Support</li>
                </ul>
              </div>
            </div>
            {/* 7 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-lime-400 to-green-500 shadow-md ring-1 ring-lime-100">
                  7
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-green-600">
                  Conducting Conferences
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Student Presentations</li>
                  <li>Industry Insights</li>
                </ul>
              </div>
            </div>
            {/* 8 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex flex-row gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md ring-1 ring-violet-100">
                  8
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">
                  Coordinating Juniors
                </span>
              </div>
              <div className="w-full max-w-md mx-auto">
                <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1 text-left">
                  <li>Bridge Communication & Foster Engagement</li>
                  <li>Promote Participation & Talent Development</li>
                  <li>Mentorship & Onboarding Support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*Club Founders */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 px-2">
            VLSI Club Founders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {founders.map((developer, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 text-center transform transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <Image
                    src={developer.image}
                    alt={developer.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {developer.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  {developer.roll_number}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Web Page Developers Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-5 text-gray-800 px-2">
            Web Page Developers
          </h2> 
          <div className="py-5 bg-neutral-50">
  <div className="max-w-5xl mx-auto px-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {developers.map((developer, index) => (
        <div
          key={index}
          className="group bg-white rounded-3xl p-8 border border-neutral-200 
          shadow-sm transition-all duration-500 
          hover:-translate-y-2 hover:shadow-xl"
        >
          {/* Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src={developer.image}
                alt={developer.name}
                width={120}
                height={120}
                quality={90}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover 
                transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-neutral-200"></div>
            </div>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-neutral-800 text-center tracking-tight">
            {developer.name}
          </h3>

          {/* Roll Number */}
          <p className="text-sm text-neutral-500 text-center mt-2">
            {developer.roll_number}
          </p>

          {/* Divider */}
          <div className="w-10 h-[1px] bg-neutral-200 mx-auto my-4"></div>

          {/* Role */}
          <p className="text-sm text-neutral-700 text-center font-medium">
            {developer.role}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
  {/* <motion.div
      role="list"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 max-w-4xl mx-auto"
    >
      {developers.map((dev, idx) => (
        <DeveloperCard key={dev.id ?? idx} dev={dev} idx={idx} />
      ))}
    </motion.div> */}
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 px-2">
            Frequently Asked Questions
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                {vlsiFaqs
                  .slice(0, Math.ceil(vlsiFaqs.length / 2))
                  .map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 text-xs sm:text-sm pr-2">
                          {faq.question}
                        </span>
                        <div className="ml-2 sm:ml-4 flex-shrink-0">
                          {openFAQ === index ? (
                            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {openFAQ === index && (
                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Right Column */}
              <div className="space-y-3 sm:space-y-4">
                {vlsiFaqs
                  .slice(Math.ceil(vlsiFaqs.length / 2))
                  .map((faq, index) => {
                    const actualIndex = index + Math.ceil(vlsiFaqs.length / 2);
                    return (
                      <div
                        key={actualIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                      >
                        <button
                          onClick={() => toggleFAQ(actualIndex)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 text-xs sm:text-sm pr-2">
                            {faq.question}
                          </span>
                          <div className="ml-2 sm:ml-4 flex-shrink-0">
                            {openFAQ === actualIndex ? (
                              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563eb]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            )}
                          </div>
                        </button>
                        {openFAQ === actualIndex && (
                          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
