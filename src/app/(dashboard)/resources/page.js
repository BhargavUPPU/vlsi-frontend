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

export default function ResourcesPage() {
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const isLoading =
    loadingTextbooks ||
    loadingNptel ||
    loadingMaterials ||
    loadingQuestionBanks ||
    loadingPlacementPrep ||
    loadingMagazines ||
    loadingGatePyqs;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium p-4"
      >
        <ArrowLeft size={20} />
        <span>Resources</span>
      </Link>
      <Image
        src="/resourceBanner.svg"
        alt="Resources Hero Banner"
        width={1920}
        height={400}
        className="w-full h-64 md:h-96 "
      />
      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/resources/roadmap"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow block"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">VLSI RoadMap</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive guide to VLSI design and development
            </p>
          </Link>

          <Link
            href="/resources/softwaretools"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow block"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">VLSI TOOLS</h3>
            <p className="text-gray-600 text-sm">
              Industry-standard design and simulation tools
            </p>
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
                E-E Textbooks
              </button>
            )}
            {nptelLectures.length > 0 && (
              <button
                onClick={() => scrollToSection("textbooks-section")}
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
        <div id="magazines-section" className="mb-16">
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
          {magazines.length > 0 ? (
            <ResourceCarousel items={magazines} type="magazines" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSI Textbooks*/}
        <div id="textbooks-section" className="mb-16">
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
          {textbooks.length > 0 ? (
            <ResourceCarousel items={textbooks} type="textbooks" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>
        {/* NPTEL Lectures */}
        <div id="nptel-lectures-section" className="mb-16">
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
          {nptelLectures.length > 0 ? (
            <ResourceCarousel items={nptelLectures} type="nptelLectures" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSI Materials */}
        <div id="materials-section" className="mb-16">
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
          {vlsiMaterials.length > 0 ? (
            <ResourceCarousel items={vlsiMaterials} type="materials" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSID Club Question Banks */}
        <div id="question-banks-section" className="mb-16">
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
          {questionBanks.length > 0 ? (
            <ResourceCarousel items={questionBanks} type="questionBanks" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* VLSID Club Recruitment PYQs */}
        <div id="placement-prep-section" className="mb-16">
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
          {placementPrep.length > 0 ? (
            <ResourceCarousel items={placementPrep} type="placement" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {/* ECE Gate PYQs */}
        <div id="gate-pyqs-section" className="mb-16">
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
          {gatePyqs.length > 0 ? (
            <ResourceCarousel items={gatePyqs} type="gatePyqs" />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No items found.
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
