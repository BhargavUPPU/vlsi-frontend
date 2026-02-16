"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Camera,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PhotoGalleryPage() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Fetch photo gallery items with optimized caching
  const { data: photoGalleries, isLoading } = useQuery({
    queryKey: ["photo-gallery-public"],
    queryFn: async () => {
      // Fetch galleries with PHOTO_GALLERY or BOTH category
      const [gallery, both] = await Promise.all([
        apiClient.get(
          `${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=PHOTO_GALLERY`,
        ),
        apiClient.get(`${API_ENDPOINTS.PHOTO_GALLERY.BASE}?category=BOTH`),
      ]);
      return [...(gallery.data || []), ...(both.data || [])];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  // Memoize sorted galleries to avoid recalculation
  const sortedGalleries = useMemo(() => {
    if (!photoGalleries) return [];
    return [...photoGalleries].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0),
    );
  }, [photoGalleries]);

  // Memoize processed galleries with images
  const processedGalleries = useMemo(() => {
    return sortedGalleries.map((gallery) => ({
      ...gallery,
      processedImages:
        gallery.images?.map((img, idx) => ({
          id: img.id,
          url: bufferToDataURL(img.imageData),
          caption: img.caption || gallery.title,
          index: idx,
        })) || [],
    }));
  }, [sortedGalleries]);

  const openLightbox = useCallback((gallery, imageIndex) => {
    const images = gallery.processedImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      title: gallery.title,
      index: img.index,
    }));
    setAllImages(images);
    setLightboxIndex(imageIndex);
    setLightboxImage(images[imageIndex]);
    setImageError(false); // Reset error state
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    setAllImages([]);
    setLightboxIndex(0);
    setImageError(false);
  }, []);

  const nextImage = useCallback(() => {
    const newIndex = (lightboxIndex + 1) % allImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(allImages[newIndex]);
    setImageError(false);
  }, [lightboxIndex, allImages]);

  const prevImage = useCallback(() => {
    const newIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(allImages[newIndex]);
    setImageError(false);
  }, [lightboxIndex, allImages]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxImage) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          if (allImages.length > 1) prevImage();
          break;
        case "ArrowRight":
          if (allImages.length > 1) nextImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lightboxImage, allImages.length, closeLightbox, nextImage, prevImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          {/* Gallery Grid Skeleton */}
          <div className="space-y-16">
            {[1, 2].map((section) => (
              <div key={section} className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-96 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Home</span>
        </Link>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Photo{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our collection of memories and moments
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {!processedGalleries || processedGalleries.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No photos yet
              </h3>
              <p className="text-gray-600">
                Check back soon for new gallery items!
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {processedGalleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {/* Gallery Header */}
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {gallery.title}
                    </h2>
                    {gallery.description && (
                      <p className="text-gray-600 text-lg">
                        {gallery.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {gallery.processedImages.length} photo
                      {gallery.processedImages.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.processedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer group relative"
                        onClick={() =>
                          !failedImages.has(image.id) &&
                          openLightbox(gallery, image.index)
                        }
                      >
                        {!failedImages.has(image.id) ? (
                          <>
                            <img
                              src={image.url}
                              alt={image.caption}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              onError={() => {
                                console.warn(
                                  "Failed to load gallery image:",
                                  image.id,
                                );
                                setFailedImages(
                                  (prev) => new Set([...prev, image.id]),
                                );
                              }}
                              onLoad={() => {
                                setFailedImages((prev) => {
                                  const newSet = new Set(prev);
                                  newSet.delete(image.id);
                                  return newSet;
                                });
                              }}
                            />
                            {/* Enhanced hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                <Camera size={24} className="text-gray-700" />
                              </div>
                            </div>
                            {image.caption && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-medium">
                                  {image.caption}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500 text-center px-2">
                              Image not available
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imageError ? (
                <div className="bg-white rounded-lg p-8 text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Image Not Available
                  </h3>
                  <p className="text-gray-600">
                    The image could not be loaded. It may have been removed or
                    is temporarily unavailable.
                  </p>
                </div>
              ) : (
                <>
                  <img
                    src={lightboxImage.url}
                    alt={lightboxImage.caption}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    onError={() => {
                      console.error(
                        "Lightbox image failed to load:",
                        lightboxImage.url,
                      );
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log(
                        "Lightbox image loaded successfully:",
                        lightboxImage.url,
                      );
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                    <p className="text-white font-semibold text-lg">
                      {lightboxImage.caption}
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      {lightboxIndex + 1} / {allImages.length}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
