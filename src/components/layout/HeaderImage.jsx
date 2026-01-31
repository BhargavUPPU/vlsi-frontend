"use client";

import Image from "next/image";

export default function HeaderImage() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
            <Image
              src="/HEADER.svg"
              alt="Header Image"
              width={800}
              height={200}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
