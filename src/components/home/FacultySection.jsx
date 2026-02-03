"use client";

import Image from "next/image";

export default function FacultySection() {
  // Static faculty data for now; replace image src with actual images later
  const faculty = [
    {
      name: "Prof. Dr. A.B. Koteswara Rao",
      title: "Principal, GVPC(A)",
      image: "/faculty1.png", // placeholder, replace with actual
    },
    {
      name: "Dr. N.Deepika Rani",
      title: "Professor & HOD OF ECE",
      image: "/faculty2.png",
    },
    {
      name: "Dr. M. Phani Krishna Kishore",
      title: "Professor & Dean, (Software Development and Networking)",
      image: "/faculty3.png",
    },
    {
      name: "Dr. MANCHIKANTI  SRINIVAS",
      title: "Professor & Dean (Alumni & Professional Bodies)",
      image: "/faculty4.png",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">Our Faculty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-center">
          {faculty.map((f, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-md bg-white flex flex-col items-stretch hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-[4/4] bg-gray-200">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={idx === 0}
                />
              </div>
              <div className="bg-blue-700 h-full text-white p-3 sm:p-4 md:p-5 text-center flex flex-col justify-center">
                <div className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
                  {f.name}
                </div>
                <div className="text-xs sm:text-xs md:text-sm mt-1 sm:mt-2">{f.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
