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
    <section className="py-4 bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Faculty</span>
        </h2>
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
      <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gray-800 px-2">
            Our Faculty Coordinator
          </h2>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
            <div className="md:flex">
              {/* Faculty Image */}
              <div className="md:w-1/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/faculty5.jpeg"
                      alt="Dr.J.Bhaskara Rao"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-1 sm:mb-2">
                  Dr.J.Bhaskara Rao
                </h3>
                <p className="text-sm sm:text-base text-[#2563eb] font-semibold text-center">
                  Associate Professor
                </p>
              </div>
            
                         <div className="md:w-2/3 p-4 sm:p-6 bg-white">
                <div className="max-w-none">
                  <p className="text-sm sm:text-base md:text-md lg:text-lg text-gray-700 leading-relaxed text-justify">
                    Dr. Bhaskara Rao Jammu, Faculty Coordinator of the VLSID
                    Club, holds a Ph.D. in ECE from NIT Rourkela, M.Tech. in
                    Digital Systems from NIT Allahabad, and B.E. in ECE from Sir
                    C.R. Reddy College, Eluru. With 18 years of experience -
                    including 11 years in teaching, 4 years in research, and 3
                    years in industry - his expertise spans VLSI Design,
                    Hardware Accelerators, and Approximate Computing. He has 13
                    international journal papers, 6 conference papers, 2
                    patents, and a book chapter with CRC Press. He has guided 8
                    M.Tech dissertations and currently supervises 2 Ph.D.
                    scholars, consistently inspiring innovation and excellence
                    in VLSI education and research.
                  </p>
                   <p className="text-gray-700 leading-relaxed text-justify mt-4">
                    Dr. Rao has earned his M.Tech in VLSI System Design and
                    Embedded Systems from NIT Allahabad, and B.E in ECE from Sir
                    C.R. Reddy College of Engineering, Eluru. His research
                    contributions include 13 international journal papers, 6
                    international conference papers, 3 patents published, and 1
                    book chapter. He has successfully guided 6 M.Tech.
                    dissertations and is currently supervising 2 Ph.D. scholars.
                  </p> 
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
