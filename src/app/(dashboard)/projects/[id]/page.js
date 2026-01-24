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
import { useCallback, useEffect, useState } from "react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Fetch project details
  const { data: projectData, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiClient.get(API_ENDPOINTS.PROJECTS.BY_ID(projectId)),
    enabled: !!projectId,
  });

  const project = projectData?.data;

  // Debug logging
  console.log('Project data loaded:', project);
  console.log('Project images array:', project?.images);
  console.log('Images count:', project?.images?.length);

  // Process images
  const images = project?.images
    ? project.images.map((img) => {
        console.log('Processing image:', img);
        const url = bufferToDataURL(img.fileData);
        console.log('Generated image URL:', url ? 'Success' : 'Failed', url?.substring(0, 50));
        return url;
      }).filter(Boolean)
    : [];

  console.log('Total images processed:', images.length);

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

  // Parse JSON fields
  const futureScope = Array.isArray(project?.futureScope) ? project.futureScope : [];
  const keyAchievements = Array.isArray(project?.keyAchievements) ? project.keyAchievements : [];
  const methodology = Array.isArray(project?.Methodology) ? project.Methodology.split('\n') : (project?.Methodology ? [project.Methodology] : []);
  const members = Array.isArray(project?.Members) ? project.Members : (typeof project?.Members === 'string' ? JSON.parse(project.Members) : []);
  const tools = Array.isArray(project?.Tools) ? project.Tools : (typeof project?.Tools === 'string' ? JSON.parse(project.Tools) : []);
  const referenceLinks = Array.isArray(project?.referenceLinks) ? project.referenceLinks : (typeof project?.referenceLinks === 'string' ? JSON.parse(project.referenceLinks) : []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft size={20} />
                  <span>Projects</span>
                  <span className="text-gray-400">&gt;&gt;</span>
                  <span className="text-gray-900">{project.title}</span>
                </Link>
              </div>
            </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Meta */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {project.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {project.category && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-sm font-semibold text-gray-900">{project.category}</p>
                  </div>
                )}
                {project.academicYear && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                    <p className="text-sm font-semibold text-gray-900">{project.academicYear}</p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{project.status}</p>
                </div>
              </div>

              {project.projectType && (
                <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded text-xs font-semibold">
                  {project.projectType}
                </span>
              )}
            </div>

            {/* Abstract */}
            {project.description && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}

            {/* Team Members */}
            {members.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
                <div className="flex flex-wrap gap-3">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 hover:shadow-md transition-shadow"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & Technologies */}
            {tools.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-200 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Abstract */}
            {project.Abstract && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Abstract}
                </p>
              </div>
            )}

            {/* Problem Statement */}
            {project.Statement && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Statement}
                </p>
              </div>
            )}

            {/* Methodology */}
            {methodology.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Methodology}
                </p>
              </div>
            )}

            {/* Results */}
            {project.Results && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.Results}
                </p>
              </div>
            )}

            {/* Conclusion */}
            {(project.conclusion || keyAchievements.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                {project.conclusion && (
                  <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                    {project.conclusion}
                  </p>
                )}

                {keyAchievements.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Achievements</h3>
                    <ul className="space-y-2">
                      {keyAchievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
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
          <div className="space-y-6">
            {/* Project Resources */}
            <div className="bg-gray-900 text-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Project resources</h3>
              <div className="space-y-3">
                {project.reportPdfLink && (
                  <a
                    href={project.reportPdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FileText size={20} />
                    <span className="text-sm font-medium">Report PDF</span>
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Github size={20} />
                    <span className="text-sm font-medium">GitHub Link</span>
                  </a>
                )}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span className="text-sm font-medium">Demo Link</span>
                  </a>
                )}
              </div>
            </div>

            {/* Mentor/Guide */}
            {project.mentorName && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{project.mentorName}</h3>
                    <p className="text-sm text-gray-500">{project.mentorDesignation || "Project Guide"}</p>
                  </div>
                </div>
                {project.mentorDepartment && (
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Department:</span> {project.mentorDepartment}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Future Scope */}
            {futureScope.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Future Scope</h3>
                <ul className="space-y-3">
                  {futureScope.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reference Links */}
            {referenceLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Reference Links</h3>
                <div className="space-y-2">
                  {referenceLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate flex-1 group-hover:text-blue-600">
                        Reference {index + 1}
                      </span>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-3 text-sm">
              {project.date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(project.date).toLocaleDateString()}</span>
                </div>
              )}
              {project.status && (
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status.toLowerCase() === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {project.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Highlights</h2>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-video rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`Project highlight ${index + 1}`}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-semibold text-sm">
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
              <div className="flex justify-center items-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-8 bg-blue-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
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
