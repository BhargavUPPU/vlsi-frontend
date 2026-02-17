"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion } from "framer-motion";
import {
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  GraduationCap,

} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResourceCarousel from "@/components/resources/ResourceCarousel";
import ContentLoading from "@/app/content-loading";

export default function ResourcesPage() {
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to the element, then offset by the header height so the section title isn't hidden
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Small delay to allow the smooth scroll to occur, then adjust for fixed header
      setTimeout(() => {
        const header = document.querySelector("header") || document.querySelector("nav") || null;
        const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
        const extraOffset = 30; // small spacing
        if (headerHeight > 0) {
          window.scrollBy({ top: -(headerHeight + extraOffset), left: 0, behavior: "smooth" });
        }
      }, 200);
    }
  };

  // Fetch all resource types
  const { data: textbooksData, isLoading: loadingTextbooks } = useQuery({
    queryKey: ["textbooks"],
    queryFn: () => apiClient.get(API_ENDPOINTS.TEXTBOOKS.BASE),
  });

  const { data: nptelData, isLoading: loadingNptel } = useQuery({
    queryKey: ["nptel"],
    queryFn: () => apiClient.get(API_ENDPOINTS.NPTEL_LECTURES.BASE),
  });

  const { data: materialsData, isLoading: loadingMaterials } = useQuery({
    queryKey: ["vlsiMaterials"],
    queryFn: () => apiClient.get(API_ENDPOINTS.VLSI_MATERIALS.BASE),
  });

  const { data: questionBanksData, isLoading: loadingQuestionBanks } = useQuery(
    {
      queryKey: ["questionBanks"],
      queryFn: () => apiClient.get(API_ENDPOINTS.QUESTION_BANKS.BASE),
    },
  );

  const { data: placementPrepData, isLoading: loadingPlacementPrep } = useQuery(
    {
      queryKey: ["placementPrep"],
      queryFn: () => apiClient.get(API_ENDPOINTS.PLACEMENT_PREP.BASE),
    },
  );

  const { data: magazinesData, isLoading: loadingMagazines } = useQuery({
    queryKey: ["magazines"],
    queryFn: () => apiClient.get(API_ENDPOINTS.MAGAZINES.BASE),
  });

  const { data: gatePyqsData, isLoading: loadingGatePyqs } = useQuery({
    queryKey: ["gatePyqs"],
    queryFn: () => apiClient.get(API_ENDPOINTS.GATE_PYQS.BASE),
  });

  const textbooks = Array.isArray(textbooksData?.data?.data)
    ? textbooksData.data.data
    : Array.isArray(textbooksData?.data)
      ? textbooksData.data
      : [];
  const nptelLectures = Array.isArray(nptelData?.data?.data)
    ? nptelData.data.data
    : Array.isArray(nptelData?.data)
      ? nptelData.data
      : [];
  const vlsiMaterials = Array.isArray(materialsData?.data?.data)
    ? materialsData.data.data
    : Array.isArray(materialsData?.data)
      ? materialsData.data
      : [];
  const questionBanks = Array.isArray(questionBanksData?.data?.data)
    ? questionBanksData.data.data
    : Array.isArray(questionBanksData?.data)
      ? questionBanksData.data
      : [];
  const placementPrep = Array.isArray(placementPrepData?.data?.data)
    ? placementPrepData.data.data
    : Array.isArray(placementPrepData?.data)
      ? placementPrepData.data
      : [];
  const magazines = Array.isArray(magazinesData?.data?.data)
    ? magazinesData.data.data
    : Array.isArray(magazinesData?.data)
      ? magazinesData.data
      : [];
  const gatePyqs = Array.isArray(gatePyqsData?.data?.data)
    ? gatePyqsData.data.data
    : Array.isArray(gatePyqsData?.data)
      ? gatePyqsData.data
      : [];



  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium p-4"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      <div className="w-full">
        <Image
          src="/resourceBanner.svg"
          alt="Resources Hero Banner"
          width={1920}
          height={400}
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
        />
      </div>
      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  static md:relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-2">Access free Resources,Tools,and many more</h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Explore structured learning paths, essential tools, and curated resources to get started with confidence.
          </p>  
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/resources/roadmap"
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow block relative overflow-hidden h-28 sm:h-36 md:h-44 lg:h-52"
          >
            <Image
              src="/Resource1.jpg"
              alt="VLSI RoadMap Background"
              width={400}
              height={200}
              className="object-cover opacity-100 absolute inset-0 pointer-events-none"
            />
            <div className="absolute left-4 bottom-4">
              <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                VLSI ROADMAP
              </span>
            </div>
          </Link>

          <Link
            href="/resources/softwaretools"
            className="bg-white rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow block relative overflow-hidden h-28 sm:h-36 md:h-44 lg:h-52"
          >
            <Image
              src="/Resource2.png"
              alt="VLSI Tools Background"
              fill
              className="object-cover opacity-100 absolute inset-0 pointer-events-none"
            />
             <div className="absolute left-4 bottom-4">
              <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                VLSI TOOLS
              </span>
            </div>
          </Link>
          <Link
            href="https://drive.google.com/drive/folders/1Msf9FVMu2H0qN3IbELHT1YiYDrSlLWI_?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow block relative overflow-hidden h-28 sm:h-36 md:h-44 lg:h-52"
          >
            <Image
              src="/placement1.jpeg"
              alt="Placement Preparation Background"
              fill
              className="object-cover opacity-100 absolute inset-0 pointer-events-none"
            />
            <div className="absolute left-4 bottom-4">
              <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                PLACEMENT PREPARATION
              </span>
            </div>
          </Link>
        </div>
      </div>
      {/* Resources Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Resources</h2>
          <div className="flex flex-wrap gap-2">
            {magazines.length > 0 && (
              <button
                onClick={() => scrollToSection("magazines-section")}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer"
              >
                Magazines
              </button>
            )}
            {textbooks.length > 0 && (
              <button
                onClick={() => scrollToSection("textbooks-section")}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors cursor-pointer"
              >
                Textbooks
              </button>
            )}
            {nptelLectures.length > 0 && (
              <button
                onClick={() => scrollToSection("nptel-lectures-section")}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors cursor-pointer"
              >
                NPTEL Lectures
              </button>
            )}
            {vlsiMaterials.length > 0 && (
              <button
                onClick={() => scrollToSection("materials-section")}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm hover:bg-orange-200 transition-colors cursor-pointer"
              >
                VLSI Materials
              </button>
            )}
            {questionBanks.length > 0 && (
              <button
                onClick={() => scrollToSection("question-banks-section")}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition-colors cursor-pointer"
              >
                VLSID Club Question Banks
              </button>
            )}
            {gatePyqs.length > 0 && (
              <button
                onClick={() => scrollToSection("gate-pyqs-section")}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                ECE Gate PYQs
              </button>
            )}
            {placementPrep.length > 0 && (
              <button
                onClick={() => scrollToSection("placement-prep-section")}
                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition-colors cursor-pointer"
              >
                VLSID Club Recruitment PYQs
              </button>
            )}
          </div>
        </div>

        {/* Silicon Chronicle Magazines */}
        <div id="magazines-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Silicon Chronicle Magazines
            </h3>
            <Link
              href="/resources/explore?type=magazines"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingMagazines ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading magazines..." />
            </div>
          ) : magazines.length > 0 ? (
            <ResourceCarousel items={magazines} type="magazines" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSI Textbooks*/}
        <div id="textbooks-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">VLSI Textbooks</h3>
            <Link
              href="/resources/explore?type=textbooks"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingTextbooks ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading textbooks..." />
            </div>
          ) : textbooks.length > 0 ? (
            <ResourceCarousel items={textbooks} type="textbooks" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>
        {/* NPTEL Lectures */}
        <div id="nptel-lectures-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">NPTEL Lectures</h3>
            <Link
              href="/resources/explore?type=nptelLectures"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingNptel ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading NPTEL lectures..." />
            </div>
          ) : nptelLectures.length > 0 ? (
            <ResourceCarousel items={nptelLectures} type="nptelLectures" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSI Materials */}
        <div id="materials-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">VLSI Materials</h3>
            <Link
              href="/resources/explore?type=vlsiMaterials"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingMaterials ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading VLSI materials..." />
            </div>
          ) : vlsiMaterials.length > 0 ? (
            <ResourceCarousel items={vlsiMaterials} type="materials" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSID Club Question Banks */}
        <div id="question-banks-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              VLSID Club Question Banks
            </h3>
            <Link
              href="/resources/explore?type=questionBanks"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingQuestionBanks ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading question banks..." />
            </div>
          ) : questionBanks.length > 0 ? (
            <ResourceCarousel items={questionBanks} type="questionBanks" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSID Club Recruitment PYQs */}
        <div id="placement-prep-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              VLSID Club Recruitment PYQs
            </h3>
            <Link
              href="/resources/explore?type=placementPrep"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingPlacementPrep ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading placement preparation..." />
            </div>
          ) : placementPrep.length > 0 ? (
            <ResourceCarousel items={placementPrep} type="placement" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* ECE Gate PYQs */}
        <div id="gate-pyqs-section" className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">ECE Gate PYQs</h3>
            <Link
              href="/resources/explore?type=gatePyqs"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Explore All{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          {loadingGatePyqs ? (
            <div className="flex justify-center py-8">
              <ContentLoading message="Loading GATE PYQs..." />
            </div>
          ) : gatePyqs.length > 0 ? (
            <ResourceCarousel items={gatePyqs} type="gatePyqs" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
