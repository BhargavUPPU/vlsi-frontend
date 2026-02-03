"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function RoadMap() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium p-2 sm:p-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm sm:text-base">RoadMap</span>
        </Link>
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <span className="text-2xl sm:text-4xl" role="img" aria-label="roadmap">
              🗺️
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              VLSI Roadmap
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
            A beginner-friendly roadmap for VLSI engineers introducing frontend
            (design, Verilog, simulation) and backend (synthesis, placement,
            routing) concepts to build strong fundamentals in chip design and
            physical implementation workflows.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
            How to prepare for a VLSI profile from scratch?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            If you are a fresher and want to start your career in VLSI and don't
            know where to start, follow this roadmap to understand the VLSI
            domain.
          </p>
        </header>
        {/* Types of Semiconductor Companies */}
        <section className="mb-12 sm:mb-16 items-center">
          <h3 className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
            First, you should know the types of Semiconductors companies
          </h3>
          <div className="flex justify-center overflow-x-auto">
              <Image
              src="/roadmapflow.png"
              alt="Road Map Flow"
              className="rounded-lg w-full h-auto max-w-xs sm:max-w-md md:max-w-2xl"
              width={700}
              height={700}
              priority
            />
          </div>
        </section>
        {/* VLSI Division */}
        <section className="mb-12 sm:mb-16">
          <h3 className="text-lg sm:text-2xl font-bold mb-4 text-gray-800">
            VLSI is mainly divided into two parts
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-lg">
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 mt-1 flex-shrink-0">•</span>
                <span>
                  There are specific job roles in front-end design and backend
                  design listed below.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 flex-shrink-0">•</span>
                <span>
                  All stages from logic synthesis to GDS2 are considered as
                  backend design.
                </span>
              </li>
            </ul>
          </div>
        </section>
        {/* Front End Roadmap */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 sm:p-8 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Front End Roadmap</h2>
            <p className="text-sm sm:text-base opacity-90">
              Focuses on designing and verifying digital circuits using HDL
              (Hardware Description Languages).
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 shadow-md overflow-x-auto">
            <svg className="w-full h-auto min-h-96" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
              <line
                x1="60"
                y1="80"
                x2="750"
                y2="80"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <path
                d="M 750 80 Q 800 80 800 120 Q 800 160 750 160"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
              />
              <line
                x1="750"
                y1="160"
                x2="650"
                y2="160"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              {[
                { x: 60, label: "RTL Design\nEngineer", active: true },
                { x: 180, label: "RTL Integration\nEngineer" },
                { x: 290, label: "ASIC/IP/SOC\nVerification Engineer" },
                { x: 420, label: "Pre Silicon\nValidation Engineer" },
                { x: 540, label: "FPGA Design\nEngineer" },
                { x: 660, label: "Emulation\nEngineer" },
              ].map((node, index) => (
                <g key={index}>
                  <circle
                    cx={node.x}
                    cy="80"
                    r="12"
                    fill={node.active ? "#2563eb" : "#e2e8f0"}
                    stroke={node.active ? "#1d4ed8" : "#94a3b8"}
                    strokeWidth="3"
                  />
                  <text
                    x={node.x}
                    y="50"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#1e293b"
                    fontWeight="600"
                  >
                    {node.label.split("\n").map((line, lineIndex) => (
                      <tspan
                        key={lineIndex}
                        x={node.x}
                        dy={lineIndex === 0 ? 0 : "14"}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              ))}
              <circle
                cx="750"
                cy="160"
                r="12"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="3"
              />
              <text
                x="750"
                y="190"
                textAnchor="middle"
                fontSize="13"
                fill="#1e293b"
                fontWeight="600"
              >
                <tspan x="750" dy="0">
                  Formal Verification
                </tspan>
                <tspan x="750" dy="14">
                  Engineer
                </tspan>
              </text>
              <circle
                cx="650"
                cy="160"
                r="12"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="3"
              />
              <text
                x="650"
                y="190"
                textAnchor="middle"
                fontSize="13"
                fill="#1e293b"
                fontWeight="600"
              >
                <tspan x="650" dy="0">
                  Post Silicon
                </tspan>
                <tspan x="650" dy="14">
                  Validation Engineer
                </tspan>
              </text>
            </svg>
          </div>
        </section>
        {/* Back End Roadmap */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-4 sm:p-8 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Back End Roadmap</h2>
            <p className="text-sm sm:text-base opacity-90">
              Focuses on physical implementation, verification, and layout of
              digital/analog circuits.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 shadow-md overflow-x-auto">
            <svg className="w-full h-auto min-h-48" viewBox="0 0 900 120" preserveAspectRatio="xMidYMid meet">
              <line
                x1="60"
                y1="60"
                x2="820"
                y2="60"
                stroke="#a855f7"
                strokeWidth="3"
              />
              {[
                { x: 60, label: "Physical Design\nEngineer", active: true },
                { x: 240, label: "Synthesis and\nSTA Engineer" },
                { x: 420, label: "Physical\nVerification Engineer" },
                { x: 600, label: "Layout Design\nEngineer" },
                { x: 820, label: "Analog and Mixed\nSignal Circuit Designer" },
              ].map((node, idx) => (
                <g key={idx}>
                  <circle
                    cx={node.x}
                    cy="60"
                    r="12"
                    fill={node.active ? "#a855f7" : "#e2e8f0"}
                    stroke={node.active ? "#9333ea" : "#94a3b8"}
                    strokeWidth="3"
                  />
                  <text
                    x={node.x}
                    y="95"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#1e293b"
                    fontWeight="600"
                  >
                    {node.label.split("\n").map((line, lineIdx) => (
                      <tspan
                        key={lineIdx}
                        x={node.x}
                        dy={lineIdx === 0 ? 0 : "14"}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </section>
       { /* Fundamentals */}
          <section className="mb-12 sm:mb-16">
            <h3 className="text-lg sm:text-2xl font-bold mb-6 sm:mb-10 text-gray-800">
              Fundamental topics which is essential for every{" "}
              <a
                href="https://en.wikipedia.org/wiki/VLSI"
                className="text-blue-600 underline hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                VLSI
              </a>{" "}
              profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
              {[
                {
            title: "Theory",
            icon: "/BooksStreamline.svg",
            color: "from-blue-400 to-blue-600",
            items: [
              "Digital Electronics",
              "Analog Electronics",
              "Semiconductor devices physics and technology",
              "Aptitude",
              "CMOS VLSI DESIGN",
              "CMOS Fabrication",
              "RC circuits and Network theory",
            ],
                },
                {
            title: "VERILOG",
            icon: "/CodingBooksStreamline.svg",
            color: "from-purple-400 to-purple-600",
            items: [
              "Verilog/VHDL",
              "SystemVerilog",
              "Basic C/C++ programming",
              "Scripting (Perl, TCL, Python)",
            ],
                },
                {
            title: "Projects",
            icon: "/CodingFlagStreamline.svg",
            color: "from-pink-400 to-pink-600",
            items: [
              "RTL Projects",
              "FPGA Implementation",
              "Digital Design Projects",
              "Tool-specific Projects",
            ],
                },
              ].map((category, i) => (
                <div
            key={i}
            className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 pt-14 sm:pt-16 hover:shadow-2xl transition-shadow"
                >
            <div
              className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br ${category.color} rounded-full shadow-lg flex items-center justify-center`}
            >
              <Image
                src={category.icon}
                alt={category.title + " icon"}
                width={48}
                height={48}
                className="sm:w-14 sm:h-14"
              />
            </div>
            <h5 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center text-gray-800">
              {category.title}
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              {category.items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-blue-600 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
                </div>
              ))}
            </div>
          </section>
              {/* Job Roles */}
      <section className="mb-12 sm:mb-16">
        <h3 className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
          All present VLSI Domain Job roles
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {[
            {
              title: "For RTL Design and Verification Profile",
              subTitle: "Key Requirements For This Job Role",
              items: [
                "Good understanding of digital design along with advanced topics like metastability, CDC basics and STA",
                "Knowledge of ASIC design flow and FPGA flow",
                "Good knowledge of Verilog/VHDL/SystemVerilog",
                "Good knowledge of computer architecture",
                "Understanding of SystemVerilog basics",
              ],
            },
            {
              title: "For DFT Profile",
              subTitle: "Key Requirements For This Job Role",
              items: [
                "Good understanding of digital design along with advanced topics like metastability, CDC basics and STA",
                "Knowledge of ASIC design flow",
                "Good knowledge of Verilog/VHDL",
                "Knowledge of scripting language such as TCL and Perl",
                "Good understanding of CMOS design",
                "Knowledge of scan DFT, BIST related topic: Fault models, Fault coverage, Scan chain insertion, ATPG tool, MBIST and boundary scan",
              ],
            },
            {
              title: "For PD/STA/PV profile",
              subTitle: "Key Requirements For This Job Role",
              items: [
                "Good understanding of digital design along with advanced topics like metastability, CDC basics",
                "Knowledge of ASIC design flow",
                "Good knowledge of Verilog/VHDL",
                "Knowledge of scripting language such as TCL and Perl",
                "Good understanding of CMOS design",
                "Good understanding of DRC, ESD, MOSFET, OpAmp, comparators, Oscillators/VCO, PLL",
                "Basic knowledge of timing analysis (STA)",
                "Knowledge of floor planning, Placement, CTS, routing, signal integrity, IR drop, EM analysis",
              ],
            },
            {
              title: "For Analog design and layout profile",
              subTitle: "Key Requirements For This Job Role",
              items: [
                "Good understanding of digital design and analog design",
                "Knowledge of ASIC design flow",
                "Good knowledge of Verilog/VHDL",
                "Knowledge of scripting language such as TCL and Perl",
                "Good understanding of CMOS design",
                "Good understanding of DRC, ESD, MOSFET, OpAmp, comparators, Oscillators/VCO, PLL",
                "Knowledge of layout design and voltage and current reference circuits",
                "Knowledge of analog IC design, DRC checks, antenna checks, parasitic extraction and IR drop",
              ],
            },
            {
              title: "For Memory Design profile",
              subTitle: "Key Requirements For This Job Role",
              items: [
                "Good understanding of digital design along with advanced topics like metastability, CDC basics",
                "Knowledge of ASIC design flow",
                "Good knowledge of Verilog/VHDL",
                "Knowledge of scripting language such as TCL and Perl",
                "Good understanding of CMOS design",
                "Good understanding of SRAM and DRAM memory read/write operation and FIFO depth",
                "Basic knowledge of DRC checks, LVS checks, parasitic extraction",
              ],
            },
          ].map((role, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-blue-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_4px_rgba(37,99,235,0.5)] flex-shrink-0"></div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base sm:text-lg text-blue-700 break-words">
                    {role.title}
                  </h4>
                  <h6 className="font-semibold text-xs sm:text-sm text-gray-600">
                    {role.subTitle}
                  </h6>
                </div>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {role.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full text-white text-xs font-bold">
                      {/* Tick SVG */}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* Semicore Value Chain */}
        <section className="mb-12 sm:mb-16">
          <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
            Semicore Value Chain
          </h3>
          <div className="flex flex-col justify-center items-center bg-gray-100 rounded-2xl p-4 sm:p-8 overflow-x-auto">
            <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 px-2">
              Comprehensive diagram showing the semiconductor value chain from
              design to manufacturing
            </p>
            <Image
              src="/roadmap.png"
              alt="Semicore Value Chain Diagram"
              className="rounded-lg w-full h-auto max-w-xs sm:max-w-md md:max-w-2xl"
              width={600}
              height={220}
              priority
            />
          </div>
        </section>
        <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-4 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">VLSI Interview Checklist</h3>
          <p className="text-sm sm:text-lg opacity-90 mb-4">
            Quick, concise guide covering key concepts, important questions, and
            must-know topics to ace your VLSI job interview confidently.
          </p>
          <a
            href="https://whimsical.com/vlsi-interview-topics-cheatsheet-by-vlsi4freshers-CmqnfqJ7gCHAWEHmAvxAJH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors">
              Download Checklist
            </button>
          </a>
        </section>
      </div>
    </div>
  );
}
