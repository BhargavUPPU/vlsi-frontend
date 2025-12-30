"use client";

import Image from "next/image";

export default function HeaderImage() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex  items-center justify-center">
          <Image
            src="/HeaderImage.png"
            alt="Header Image"
            width={200}
            height={50}
            className="h-30 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
