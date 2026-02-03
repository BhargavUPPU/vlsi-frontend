"use client";

import Image from "next/image";

export default function HeaderImage() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-5xl">
            <Image
              src="/HEADER.svg"
              alt="Header Image"
              width={800}
              height={200}
              className="w-full h-auto"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 90vw, 1280px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
