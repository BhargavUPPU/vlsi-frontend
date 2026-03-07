"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Github, ExternalLink, User, Calendar } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useMemo, memo } from "react";
import ContentLoading from "@/app/content-loading";


export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Fetch project details with optimized caching
  const { data: projectData, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiClient.get(API_ENDPOINTS.PROJECTS.BY_ID(projectId)),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    cacheTime: 30 * 60 * 1000, // 30 minutes - cache persists
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  const project = projectData?.data;

  // Memoize image processing to avoid recalculation on every render
  const images = useMemo(() => {
    if (!project?.images || project.images.length <= 1) return [];
    
    return project.images
      .slice(1)
      .map((img) => bufferToDataURL(img.fileData))
      .filter(Boolean);
  }, [project?.images]);

  // Carousel controls
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // Memoize parsed JSON fields to avoid re-parsing on every render
  const { keyAchievements, methodology, members, tools, referenceLinks } = useMemo(() => {
    const safeParseJSON = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      }
      return [];
    };

    return {
      keyAchievements: safeParseJSON(project?.keyAchievements),
      methodology: Array.isArray(project?.Methodology) 
        ? project.Methodology.split('\n') 
        : (project?.Methodology ? [project.Methodology] : []),
      members: safeParseJSON(project?.Members),
      tools: safeParseJSON(project?.Tools),
      referenceLinks: safeParseJSON(project?.referenceLinks),
    };
  }, [project?.keyAchievements, project?.Methodology, project?.Members, project?.Tools, project?.referenceLinks]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ContentLoading message="Loading project details..." />
    </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist</p>
          <Link
            href="/projects"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
          <div className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                  <span>Projects</span>
                  <span className="text-gray-400 hidden sm:inline">&gt;&gt;</span>
                  <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{project.title}</span>
                </Link>
              </div>
            </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Title & Meta */}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {project.title}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                {project.category && (
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Category</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{project.category}</p>
                  </div>
                )}
                {project.academicYear && (
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Academic Year</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{project.academicYear}</p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Duration</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Status</p>
                    <p className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    project.status.toLowerCase() === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {project.status}
                  </p>
                
                </div>
              </div>

              {project.projectType && (
                <span className="inline-block bg-yellow-400 text-gray-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
                  {project.projectType}
                </span>
              )}
            </div>

            {/* Abstract */}
            {project.description && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Abstract</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}

          

          

            {/* Abstract */}
            {project.Abstract && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Abstract</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Abstract}
                </p>
              </div>
            )}

            {/* Problem Statement */}
            {project.Statement && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Problem Statement</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Statement}
                </p>
              </div>
            )}

            {/* Methodology */}
            {methodology.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Methodology</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Methodology}
                </p>
              </div>
            )}
            {
              project.Conclusion && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Conclusion</h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {project.Conclusion}
                  </p>
                </div>
              )
            }

            {/* Results */}
            {project.Results && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Results</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Results}
                </p>
              </div>
            )}

            {/* Conclusion */}
            {(project.conclusion || keyAchievements.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Conclusion</h2>
                {project.conclusion && (
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 whitespace-pre-line">
                    {project.conclusion}
                  </p>
                )}

                {keyAchievements.length > 0 && (
                  <>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Key Achievements</h3>
                    <ul className="space-y-2">
                      {keyAchievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Project Resources */}
           { project.reportPdfLink || project.githubLink || project.demoLink ? (
             <div className="bg-gray-900 text-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Project resources</h3>
              <div className="space-y-2 sm:space-y-3">
                {project.reportPdfLink && (
                  <a
                    href={project.reportPdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FileText size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Report PDF</span>
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Github size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">GitHub Link</span>
                  </a>
                )}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Demo Link</span>
                  </a>
                )}
              </div>
            </div>
           ):null
           }

            {/* Mentor/Guide */}
            {project.Mentor && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{project.Mentor}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{project.mentorDesignation || "Project Guide"}</p>
                  </div>
                </div>
                {project.mentorDepartment && (
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Department:</span> {project.mentorDepartment}
                    </p>
                  </div>
                )}
              </div>
            )}

              {/* Team Members */}
            {members.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Team Members</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 hover:shadow-md transition-shadow"
                    >
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

              {/* Tools & Technologies */}
            {tools.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-block bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-indigo-200 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Future Scope */}
            {project.futureScope && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Future Scope</h3>
               <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.futureScope}
                </p>
              </div>
            )}

            {/* Reference Links */}
            {referenceLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Reference Links</h3>
                <div className="space-y-2">
                  {referenceLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate flex-1 group-hover:text-blue-600">
                        Reference {index + 1}
                      </span>
                      <ExternalLink size={14} className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
           {
              project.date ? ( <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {project.date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{new Date(project.date).toLocaleDateString()}</span>
                </div>
              )}
            
            </div>):null
           }
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Project Highlights</h2>

            <div className="relative">
              <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl" ref={emblaRef}>
                <div className="flex gap-2 sm:gap-3 md:gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="flex-[0_0_100%] sm:flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-video overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`Project highlight ${index + 1}`}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding="async"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4">
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              Image {index + 1} of {images.length}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-6 sm:w-8 bg-blue-600"
                        : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
