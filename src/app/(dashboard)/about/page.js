"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Eye, Briefcase } from "lucide-react";

const AboutUs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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

  const developers = [
    {
      name: "UPPU BHARGAV SAI",
      role: "WEB DEVELOPER",
      roll_number: "21131A04T7",
      image: "/logo.png",
    },
    {
      name: "ANVESH",
      role: "WEB DESIGNER",
      roll_number: "21131A04Q9",
      image: "/logo.png",
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
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About VLSID Club Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
            About <span className="text-[#2563eb]">VLSID</span> Club
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* VLSID Logo */}
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="VLSID Club Logo"
                width={500}
                height={500}
                className="w-68 h-68 object-contain"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <p className="text-gray-700 text-justify leading-relaxed">
                  The VLSID (Very Large Scale Integration Design) Club is a
                  vibrant community of students passionate about semiconductor
                  technology and chip design. The VLSID Club was formed on
                  January 5, 2023, with a vision to create a collaborative
                  platform for students interested in VLSI and IC design. The
                  founding members, led by Deepank Maralwar and Trinath from the
                  2019-2023 batch, presented a paper at prestigious VLSI
                  conferences. Inspired by their efforts, our respected HOD
                  encouraged them to build a community that would continue this
                  spirit of innovation and ensure such contributions would not
                  end with a single batch.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
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
              </div>
            </div>
          </div>
        </div>

        {/* Vision and Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#2563eb] transform transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-full flex items-center justify-center mr-4 shadow-md">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify">
              To create a community of innovative and skilled individuals who
              are passionate about VLSI and semiconductor technology, empowering
              them to become future leaders in chip design and hardware
              innovation.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#2563eb] transform transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-full flex items-center justify-center mr-4 shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-justify">
              To provide hands-on learning opportunities in VLSI design,
              verification, and fabrication through workshops, projects, and
              competitions. Foster industry collaboration and prepare students
              for successful careers in semiconductor technology.
            </p>
          </div>
        </div>

        {/* Faculty Coordinator Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Our Faculty Coordinator
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
            <div className="md:flex">
              {/* Faculty Image */}
              <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-56 h-56 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 overflow-hidden shadow-lg border-4 border-white">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/faculty5.jpeg"
                      alt="Dr.J.Bhaskara Rao"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  Dr.J.Bhaskara Rao
                </h3>
                <p className="text-[#2563eb] font-semibold text-center">
                  Associate Professor
                </p>
              </div>

              {/* Faculty Details */}
              <div className="md:w-2/3 p-8 bg-white">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed text-justify">
                    Dr. Bhaskara Rao Jammu, Faculty Coordinator of the VLSID
                    Club, is an accomplished academician and researcher in the
                    field of Electronics and Communication Engineering with a
                    PhD in Approximate Computing. With 12 years of teaching, 4
                    years of research, and 3 years of industry experience, he
                    has guided students towards excellence in Electronics and
                    Communication Engineering.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify mt-4">
                    Dr. Rao has earned his M.Tech in VLSI System Design and
                    Embedded Systems from NIT Allahabad, and B.E in ECE from Sir
                    C.R. Reddy College of Engineering, Eluru. His research
                    contributions include 13 international journal papers, 6
                    international conference papers, 3 patents published, and 1
                    book chapter. He has successfully guided 6 M.Tech.
                    dissertations and is currently supervising 2 Ph.D. scholars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Objectives Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Our Objectives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#2563eb] transform hover:-translate-y-1"
              >
                <div className="flex items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mr-4 text-3xl shadow-sm">
                    {objective.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 flex-1">
                    {objective.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {objective.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/*Club Founders */}  
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          VLSI Club Founders 
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {developers.map((developer, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src={developer.image}
                    alt={developer.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {developer.name}
                </h3>
                <p className="text-gray-600 mb-4">{developer.roll_number}</p>
                <p className="text-[#2563eb] font-semibold">{developer.role}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Web Page Developers Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            WEB PAGE DEVELOPERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {developers.map((developer, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src={developer.image}
                    alt={developer.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {developer.name}
                </h3>
                <p className="text-gray-600 mb-4">{developer.roll_number}</p>
                <p className="text-[#2563eb] font-semibold">{developer.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
               

                {vlsiFaqs.slice(0, Math.ceil(vlsiFaqs.length / 2)).map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">
                        {faq.question}
                      </span>
                      <div className="ml-4 flex-shrink-0">
                        {openFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-[#2563eb]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>
                    {openFAQ === index && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {vlsiFaqs.slice(Math.ceil(vlsiFaqs.length / 2)).map((faq, index) => {
                  const actualIndex = index + Math.ceil(vlsiFaqs.length / 2);
                  return (
                    <div
                      key={actualIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <button
                        onClick={() => toggleFAQ(actualIndex)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 text-sm">
                          {faq.question}
                        </span>
                        <div className="ml-4 flex-shrink-0">
                          {openFAQ === actualIndex ? (
                            <ChevronUp className="w-4 h-4 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {openFAQ === actualIndex && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 text-sm leading-relaxed">
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
