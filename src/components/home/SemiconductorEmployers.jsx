"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "@/lib/animations";
import Image from "next/image";

// Placeholder logos - in production, these would be actual company logos
const employers = [
  { name: "TEXS INSTRUMENT", logo: "/TexasInstruments-01.png" },
  { name: "Samsung", logo: "/SamsungElectronics-01.png" },
  { name: "Qualcomm", logo: "/Qualcomm-Logo.png" },
  { name: "TSM", logo: "/TSM.png" },
  { name: "Capgemini", logo: "/Capgemini-Logo.png" },
  { name: "NVIDIA", logo: "/NVIDIA-Logo.png" },
  { name: "AMD", logo: "/AdvancedMicroDevices-Logo.png" },
  { name: "ASML", logo: "/ASML-Logo.png" },
  { name: "Broadcom", logo: "/Broadcom_Corporation.png" },
  {name:"MosChip", logo:"/moschip.png"},
  { name: "TATA", logo: "/tataelectronics.png" },
];

export default function SemiconductorEmployers() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Leading{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Semiconductor Employers
            </span>
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our students have opportunities with top global companies
          </motion.p>
        </motion.div>

        {/* Logos Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {employers.map((employer, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ scale: 1.1, y: -4 }}
              className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="text-center">
                {/* Company logo using Next.js Image */}
                <div className="w-30h-30 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden border border-gray-200">
                  <Image
                    src={employer.logo}
                    alt={employer.name + " logo"}
                    width={96}
                    height={96}
                    className="object-contain w-24 h-24"
                    sizes="(max-width: 768px) 40vw, 64px"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {employer.name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerItem}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            ...and many more leading companies in the semiconductor industry
          </p>
        </motion.div>
      </div>
    </section>
  );
}
