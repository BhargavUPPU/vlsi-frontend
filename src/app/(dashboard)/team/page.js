"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function TeamPage() {
  const [selectedYear, setSelectedYear] = useState("2025");

  // Fetch core members
  const { data: coreMembersData, isLoading: loadingCoreMembers } = useQuery({
    queryKey: ["coreMembers"],
    queryFn: () => apiClient.get(API_ENDPOINTS.CORE_MEMBERS.BASE),
  });


  // Fetch team photos
  const { data: teamPhotosData, isLoading: loadingTeamPhotos } = useQuery({
    queryKey: ["teamPhotos"],
    queryFn: () => apiClient.get(API_ENDPOINTS.TEAM_PHOTOS.BASE),
  });
  

  // Backend returns array directly
  const allCoreMembers = Array.isArray(coreMembersData?.data) ? coreMembersData.data : [];

  // Backend returns array directly
  const teamPhotos = Array.isArray(teamPhotosData?.data) ? teamPhotosData.data : [];
  // Filter members by selected year
  const filteredMembers = allCoreMembers.filter(
    (member) => member.academicYear === selectedYear
  );

  // Get unique academic years for dropdown
  const academicYears = [...new Set(allCoreMembers.map((m) => m.academicYear))].sort().reverse();

  // Define hierarchy order
  const hierarchyOrder = [
    "Executive Team",
    "Central Coordinating Team",
    "Knowledge Transfer Team",
    "Alumni Managing & Hero Team",
    "Oracthon Exec & Research Outreach Team",
    "Juniors Recruitment Team",
    "Juniors Coordinator Team",
    "Outreach Team",
    "Translation & Data Handling Team",
    "Documentation Team",
    "Web Handling Team"
  ];

  // Group members by portfolio (team category)
  const groupedByPortfolio = filteredMembers.reduce((acc, member) => {
    const portfolio = member.portfolio || "Other";
    if (!acc[portfolio]) {
      acc[portfolio] = [];
    }
    acc[portfolio].push(member);
    return acc;
  }, {});

  // Sort portfolios by hierarchy
  const sortedPortfolios = Object.keys(groupedByPortfolio).sort((a, b) => {
    const indexA = hierarchyOrder.indexOf(a);
    const indexB = hierarchyOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Get member image
  const getMemberImage = (member) => {
    // Backend returns image as member.image (buffer or base64)
    if (member.image && Object.keys(member.image).length > 0) {
      return bufferToDataURL(member.image);
    }
    return null;
  };

  // Get team photo
  const getTeamPhotoByYear = () => {
    const photo = teamPhotos.find((p) => p.academicYear === selectedYear);
    if (photo && photo.imageData) {
      return bufferToDataURL(photo.imageData);
    }
    return null;
  };

  const teamPhotoUrl = getTeamPhotoByYear();

  const isLoading = loadingCoreMembers || loadingTeamPhotos;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Team Photo */}
      {teamPhotoUrl && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={teamPhotoUrl}
            alt={`Team ${selectedYear}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70" />
          <div className="absolute bottom-8 left-0 right-0 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-2"
            >
              Meet our team members
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-200"
            >
              The dedicated individuals driving our vision forward
            </motion.p>
          </div>
        </div>
      )}

      {/* Year Selector */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              VLSD CLUB Core Members for Year {selectedYear}
            </h2>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-300 rounded-lg px-6 py-3 pr-12 font-semibold text-gray-700 hover:border-blue-600 focus:outline-none focus:border-blue-600 transition-colors"
              >
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMembers.length === 0 && (
          <div className="bg-white rounded-lg p-16 text-center shadow-sm">
            <Users size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Team Members Found</h3>
            <p className="text-gray-600">
              There are no team members for the selected academic year
            </p>
          </div>
        )}

        {/* Team Sections */}
        {!isLoading && filteredMembers.length > 0 && (
          <div className="space-y-16">
            {sortedPortfolios.map((portfolio) => {
              const members = groupedByPortfolio[portfolio];
              
              return (
                <motion.div
                  key={portfolio}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Section Title */}
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {portfolio}
                    </h3>
                    <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                  </div>

                  {/* Members Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member) => {
                      const imageUrl = getMemberImage(member);

                      return (
                        <motion.div
                          key={member.id}
                          whileHover={{ y: -8 }}
                          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          {/* Member Image */}
                          <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                  {member.name.charAt(0)}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Member Info */}
                          <div className="p-6 text-center">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                              {member.name}
                            </h4>
                            <p className="text-sm text-blue-600 font-semibold mb-3">
                              {member.category || member.portfolio}
                            </p>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              {member.rollNumber && (
                                <p>Roll No: {member.rollNumber}</p>
                              )}
                              {member.sectionBranch && (
                                <p>{member.sectionBranch}</p>
                              )}
                              {member.memberShipId && (
                                <p className="text-xs text-gray-500">
                                  ID: {member.memberShipId}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
