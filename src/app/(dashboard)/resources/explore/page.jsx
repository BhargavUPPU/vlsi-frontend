"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Download, 
  ExternalLink,
  ArrowLeft,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { bufferToDataURL } from "@/lib/utils/imageUtils";

const RESOURCE_TYPES = [
  { id: "magazines", label: "Magazines" },
  { id: "textbooks", label: "Textbooks" },
  { id: "nptelLectures", label: "NPTEL Lectures" },
  { id: "placementPrep", label: "Club Recruitment PYQs" },
  { id: "gatePyqs", label: "Gate PYQs" },
  { id: "vlsiMaterials", label: "VLSI Materials" },
  { id: "questionBanks", label: "Question Banks" }
];

const CATEGORIES = [
  "Analog design",
  "CMOS VLSI Design",
  "Digital Design",
  "Digital IC Design",
  "FPGA & ASIC Design",
  "Semiconductor Physics",
  "General"
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ResourcesExplorePage() {
  const [selectedType, setSelectedType] = useState("textbooks");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const limit = 6;

  // Fetch categorized resources
  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ["resources", selectedType, selectedCategory, searchQuery, page],
    queryFn: async () => {
      const response = await apiClient.get(`/${selectedType}`, {
        params: {
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery || undefined,
          page,
          limit
        }
      });
      return response.data;
    },
    keepPreviousData: true
  });

  const resources = resourcesData?.data || [];
  const totalItems = resourcesData?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedType, selectedCategory, searchQuery]);

  const getImageUrl = (item) => {
    if (item.image) {
      return `${API_BASE_URL}/${selectedType}/${item.id}/image`;
    }
    return "/resource_placeholder.png"; // Fallback
  };

  const getTitle = (item) => {
    return item.name || item.title || item.courseName || item.topicName || `Item ${item.year || ''}`;
  };

  const getSubtitle = (item) => {
    if (selectedType === "textbooks") return item.author;
    if (selectedType === "nptelLectures") return item.professorName;
    if (selectedType === "gatePyqs") return `Year: ${item.year}`;
    if (selectedType === "questionBanks") return item.subject;
    return item.category || "Club Resource";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs & Header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/resources" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={14} /> Resources
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-blue-600 capitalize">
              {RESOURCE_TYPES.find(t => t.id === selectedType)?.label}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
              {RESOURCE_TYPES.find(t => t.id === selectedType)?.label}
            </h1>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl shadow-lg font-bold"
          >
            <Filter size={18} /> FILTERS
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-auto lg:block
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            transition-transform duration-300 ease-in-out
            w-full lg:w-72 border-r lg:border-none
          `}>
            <div className="p-6 lg:p-0 h-full overflow-y-auto">
              <div className="flex items-center justify-between lg:hidden mb-8">
                <h2 className="text-xl font-black italic">VLSI D</h2>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border border-blue-100">
                <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <Filter className="w-5 h-5" /> Filter
                </h2>

                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Resource type</h3>
                  <div className="space-y-3">
                    {RESOURCE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`block text-left text-sm font-medium transition-colors ${
                          selectedType === type.id 
                            ? "text-blue-600 font-bold" 
                            : "text-gray-600 hover:text-blue-500"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Category type</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`block text-left text-sm font-medium transition-colors ${
                        selectedCategory === "All" 
                          ? "text-blue-600 font-bold" 
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsSidebarOpen(false);
                        }}
                        className={`block text-left text-sm font-medium transition-colors ${
                          selectedCategory === cat 
                            ? "text-blue-600 font-bold" 
                            : "text-gray-600 hover:text-blue-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-[400px]" />
                ))}
              </div>
            ) : resources.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                  <AnimatePresence mode="popLayout">
                    {resources.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group h-full"
                      >
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                          <Image
                            src={getImageUrl(item)}
                            alt={getTitle(item)}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg block">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {item.category || "General"}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {getTitle(item)}
                          </h3>
                          
                          <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                            {getSubtitle(item)}
                          </p>

                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg"
                            >
                              ACCESS RESOURCE <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                            page === i + 1 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                   Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
