"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Fetch event details
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => apiClient.get(API_ENDPOINTS.EVENTS.BY_ID(eventId)),
    enabled: !!eventId,
  });

  const event = eventData?.data;

  // Debug logging
  console.log('Event data loaded:', event);
  console.log('Event files array:', event?.files);
  console.log('Files count:', event?.files?.length);

  // Process images from files
  const images = event?.files
    ? event.files.map((file) => {
        console.log('Processing file:', file);
        const url = bufferToDataURL(file.fileData);
        console.log('Generated image URL:', url ? 'Success' : 'Failed', url?.substring(0, 50));
        return url;
      }).filter(Boolean)
    : [];

  console.log('Total images processed:', images.length);

  const headerImage = images[0] || null;
  const carouselImages = images.slice(1); // Remaining images for carousel

  // Carousel controls
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
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
  const keyPoints = event?.aboutEvent ? [event.aboutEvent] : [];
  const eventHighlights = Array.isArray(event?.eventHighlights) ? event.eventHighlights : [];
  const studentCoordinators = Array.isArray(event?.studentCoordinators) ? event.studentCoordinators : [];
  const facultyCoordinators = Array.isArray(event?.facultyCoordinators) ? event.facultyCoordinators : [];
  const speakerHighlights = Array.isArray(event?.speakerHighlights) ? event.speakerHighlights : [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist</p>
          <Link
            href="/events"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Events</span>
            <span className="text-gray-400">&gt;&gt;</span>
            <span className="text-gray-900">{event.title}</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Event Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {event.title}
              </h1>

              <div className="grid grid-cols-2 gap-4">
                {event.noOfParticipants && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Participants</p>
                      <p className="font-semibold">{event.noOfParticipants}+</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Date</p>
                    <p className="font-semibold">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {event.status && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-xs font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Status</p>
                      <p className="font-semibold capitalize">{event.status}</p>
                    </div>
                  </div>
                )}

                {event.eventType && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-300">Channel Type</p>
                      <p className="font-semibold">{event.eventType}</p>
                    </div>
                  </div>
                )}
              </div>

              {event.eventRegistrationLink && (
                <a
                  href={event.eventRegistrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Register
                  <ExternalLink size={18} />
                </a>
              )}
            </motion.div>

            {/* Event Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl"
            >
              {headerImage ? (
                <img
                  src={headerImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Calendar size={80} className="text-white opacity-50" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Event */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Speaker */}
            {event.speakerName && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Speaker</h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {event.speakerName}
                </h3>
                {event.speakerDescription && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {event.speakerDescription}
                  </p>
                )}
                {speakerHighlights.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {speakerHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Description / More Details */}
            {event.aboutEvent && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.aboutEvent}
                </p>
              </div>
            )}

            {/* Event Co-ordinators */}
            {facultyCoordinators.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Co-ordinators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facultyCoordinators.map((coordinator, index) => (
                    <div key={index} className="text-center">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {coordinator.name || coordinator}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {coordinator.title || coordinator.position || "Faculty Coordinator"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Co-ordinators */}
            {studentCoordinators.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Co-ordinators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studentCoordinators.map((coordinator, index) => (
                    <div key={index} className="text-center">
                      <h3 className="font-semibold text-gray-900">
                        {coordinator.name || coordinator}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {coordinator.id || coordinator.rollNo || "Student ID"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Highlights Carousel */}
            {carouselImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Highlights</h2>
                
                <div className="relative">
                  <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                    <div className="flex gap-4">
                      {carouselImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Event highlight ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    {scrollSnaps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === selectedIndex
                            ? "w-8 bg-blue-600"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Points */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key points</h3>
              <ul className="space-y-3">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
                {eventHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
              {event.eventPdfLink && (
                <a
                  href={event.eventPdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Event PDF</span>
                  <ExternalLink size={16} className="text-gray-400" />
                </a>
              )}
              {event.eventVideoLink && (
                <a
                  href={event.eventVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Event Video</span>
                  <ExternalLink size={16} className="text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
