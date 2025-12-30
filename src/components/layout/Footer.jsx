"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Youtube, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";

export default function Footer() {
        const [bgStyle, setBgStyle] = useState({});
        useEffect(() => {
          setBgStyle({
            backgroundImage: 'url("/footer-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          });
        }, []);
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
    { name: "Team", href: "/team" },
    { name: "Test Portal", href: "/tests" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-600" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", color: "hover:bg-blue-600" },
  ];

  const contactInfo = {
    address: "Gayatri Vidya Parishad College of Engineering (Autonomous), Madhurawada, Visakhapatnam - 530048, Andhra Pradesh, India",
    email: "vlsidclub@gvpce.ac.in",
  };

  // Google Maps embed URL - Replace with actual college coordinates
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.8384!2d83.3778!3d17.7826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6b0ff%3A0x8c5e0f8b0b0b0b0b!2sGayatri%20Vidya%20Parishad%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1234567890";

  return (

    
        <footer className="relative  text-white overflow-hidden " style={bgStyle}>
      {/* Background Pattern - User can replace this with actual background image */}
      <div className="absolute inset-0 opacity-10">
        {/* <div className="absolute inset-0" style={{
          backgroundImage: 'url("/footer-bg-pattern.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        Network/Circuit Pattern Overlay */}
        {/* <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
        }} /> */}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & Social Media */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-6"
            >
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="VLSID Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="text-2xl font-bold">VLSID</h3>
                  <p className="text-sm text-blue-200">VLSI Innovation Hub</p>
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 border border-white/20`}
                        aria-label={social.name}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium mb-1">Address:</p>
                    <p className="text-sm text-blue-200 leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium mb-1">Email:</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-blue-200 hover:text-white transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location - Google Map */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="text-lg font-semibold mb-6">Location</h4>
              <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[30%] hover:grayscale-0 transition-all duration-300"
                  title="GVPCE Location"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-blue-200">
              Copy Rights © VLSID Gayatri Vidya Parishad College of Engineering (Autonomous).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
