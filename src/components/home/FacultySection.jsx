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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10">Our Faculty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
          {faculty.map((f, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-md bg-white flex flex-col items-stretch"
            >
              <div className="relative w-full aspect-[4/4] bg-gray-200">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority={idx === 0}
                />
              </div>
              <div className="bg-blue-700 h-full text-white p-4 text-center">
                <div className="font-semibold text-base leading-tight">
                  {f.name}
                </div>
                <div className="text-xs mt-1">{f.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
