"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Eye, Briefcase ,ArrowLeft} from "lucide-react";
import Link from "next/link";

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
      name: "UPPU BHARGAV SAI",
      role: "WEB DEVELOPER",
      roll_number: "21131A04T7",
      image: "/developer.jpeg",
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
                 The VLSID (VLSI Design) Club is a student-driven technical community committed to exploring and advancing the field of VLSI and semiconductor technology. Under the guidance of experienced faculty, the club aims to bridge the gap between academic learning and industry expectations by providing a strong foundation in both core concepts and practical skills.The club promotes peer-to-peer learning and mentorship, enabling effective knowledge transfer from seniors to juniors through structured classes, hands-on training with industry-standard EDA tools, collaborative projects, and regular assessments. Through workshops, industrial talks, alumni interactions, and technical conferences, members gain exposure to real-world challenges, emerging technologies, and career opportunities in the semiconductor domain.By encouraging innovation, teamwork, and continuous learning, the VLSID Club nurtures technically competent and industry-ready engineers, empowering students to design and shape the future of silicon technology.
Think Silicon. Design the Future.
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Vision</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
             To create a community of innovative and skilled individuals who are passionate about VLSI and semiconductor technology, empowering them to become future leaders in chip design and hardware innovation.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-t-4 border-[#2563eb] transform transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Mission</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
              To provide hands-on learning opportunities in VLSI design, verification, and fabrication through workshops, projects, and competitions.
            </p>
          </div>
        </div>

        {/* Faculty Coordinator Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 px-2">
            Our Faculty Coordinator
          </h2>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
            <div className="md:flex">
              {/* Faculty Image */}
              <div className="md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 overflow-hidden shadow-lg border-2 sm:border-4 border-white">
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-1 sm:mb-2">
                  Dr.J.Bhaskara Rao
                </h3>
                <p className="text-sm sm:text-base text-[#2563eb] font-semibold text-center">
                  Associate Professor
                </p>
              </div>

              {/* Faculty Details */}
              <div className="md:w-2/3 p-4 sm:p-6 bg-white">
                <div className="max-w-none">
                  <p className="text-sm sm:text-base md:text-md lg:text-lg text-gray-700 leading-relaxed text-justify">
                  Dr. Bhaskara Rao Jammu, Faculty Coordinator of the VLSID Club,  holds a Ph.D. in ECE from NIT Rourkela, M.Tech. in Digital Systems from NIT Allahabad, and B.E. in ECE from Sir C.R. Reddy College, Eluru. With 18 years of experience - including 11 years in teaching, 4 years in research, and 3 years in industry - his expertise spans VLSI Design, Hardware Accelerators, and Approximate Computing. He has 13 international journal papers, 6 conference papers, 2 patents, and a book chapter with CRC Press. He has guided 8 M.Tech dissertations and currently supervises 2 Ph.D. scholars, consistently inspiring innovation and excellence in VLSI education and research.
                  </p>
                  {/* <p className="text-gray-700 leading-relaxed text-justify mt-4">
                    Dr. Rao has earned his M.Tech in VLSI System Design and
                    Embedded Systems from NIT Allahabad, and B.E in ECE from Sir
                    C.R. Reddy College of Engineering, Eluru. His research
                    contributions include 13 international journal papers, 6
                    international conference papers, 3 patents published, and 1
                    book chapter. He has successfully guided 6 M.Tech.
                    dissertations and is currently supervising 2 Ph.D. scholars.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Objectives Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 flex items-center justify-center gap-2 px-2">
            <span role="img" aria-label="Objectives">📋</span> Our Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* 1 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-indigo-500 to-blue-500 shadow-md ring-1 ring-indigo-100">1</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">Knowledge Transfer from Seniors to Juniors</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Organizing Classes for 2nd-Year Students</li>
                <li>Providing Training to 3rd-Year Students</li>
                <li>Conducting Mock-Tests</li>
              </ul>
            </div>
            {/* 2 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-green-500 to-teal-400 shadow-md ring-1 ring-teal-100">2</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-teal-600">Updating and Practicing Question Banks</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Collecting and Organizing Questions</li>
                <li>Practicing Questions</li>
              </ul>
            </div>
            {/* 3 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start text-center mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-purple-500 to-pink-500 shadow-md ring-1 ring-pink-100">3</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight  group-hover:text-pink-600">Interacting with Alumni</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Networking Opportunities</li>
                <li>Career Advice</li>
              </ul>
            </div>
            {/* 4 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md ring-1 ring-yellow-100">4</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-orange-600">Conducting Industrial Talks</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Expert Talks</li>
                <li>Industry Insights</li>
              </ul>
            </div>
            {/* 5 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-red-500 to-pink-600 shadow-md ring-1 ring-red-100">5</span>
                <span className="text-lg sm:text-base font-bold text-gray-800 leading-tight group-hover:text-pink-600">Including Juniors in Senior's Projects</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md  mt-2 space-y-1">
                <li>Project Participation</li>
                <li>Mentorship</li>
              </ul>
            </div>
            {/* 6 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md ring-1 ring-sky-100">6</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">Attending or Applying for Workshops in IITs/NITs</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Workshop Participation</li>
                <li>Application Support</li>
              </ul>
            </div>
            {/* 7 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-lime-400 to-green-500 shadow-md ring-1 ring-lime-100">7</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-green-600">Conducting Conferences</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Student Presentations</li>
                <li>Industry Insights</li>
              </ul>
            </div>
            {/* 8 */}
            <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col shadow-sm transform transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-2">
              <div className="flex items-start mb-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm sm:text-xl font-bold flex items-center justify-center mr-2 sm:mr-3 text-white flex-shrink-0 mt-0.5 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md ring-1 ring-violet-100">8</span>
                <span className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-600">Coordinating Juniors</span>
              </div>
              <ul className="list-disc pl-6 sm:pl-8 text-gray-700 text-md mt-2 space-y-1">
                <li>Bridge Communication & Foster Engagement</li>
                <li>Promote Participation & Talent Development</li>
                <li>Mentorship & Onboarding Support</li>
              </ul>
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
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{developer.roll_number}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Web Page Developers Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 px-2">
            WEB PAGE DEVELOPERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {developers.map((developer, index) => (
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
                    quality={90}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {developer.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{developer.roll_number}</p>
                <p className="text-sm sm:text-base text-[#2563eb] font-semibold">{developer.role}</p>
              </div>
            ))}
          </div>
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
               

                {vlsiFaqs.slice(0, Math.ceil(vlsiFaqs.length / 2)).map((faq, index) => (
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
                {vlsiFaqs.slice(Math.ceil(vlsiFaqs.length / 2)).map((faq, index) => {
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
