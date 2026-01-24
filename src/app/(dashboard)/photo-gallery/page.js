"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { bufferToDataURL } from "@/lib/utils/imageUtils";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export default function PhotoGalleryPage() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

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
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    setAllImages([]);
    setLightboxIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    const newIndex = (lightboxIndex + 1) % allImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(allImages[newIndex]);
  }, [lightboxIndex, allImages]);

  const prevImage = useCallback(() => {
    const newIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(allImages[newIndex]);
  }, [lightboxIndex, allImages]);

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
                        onClick={() => openLightbox(gallery, image.index)}
                      >
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white text-sm font-medium">
                              {image.caption}
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

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
              <p className="text-white font-semibold text-lg">
                {lightboxImage.caption}
              </p>
              <p className="text-white/70 text-sm mt-1">
                {lightboxIndex + 1} / {allImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
