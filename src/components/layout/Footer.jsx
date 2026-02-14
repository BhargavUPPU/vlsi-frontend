"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488" />
  </svg>
);

export default function Footer() {
  const [bgStyle, setBgStyle] = useState({});
  useEffect(() => {
    setBgStyle({
      backgroundImage: 'url("/FOOTER.svg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
    });
  }, []);
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
    { name: "Our Team", href: "/team" },
    { name: "Test Portal", href: "/tests" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=v5l8ldo",
      color: "hover:bg-pink-600",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      href: "https://chat.whatsapp.com/DDrFF6wO70s2WQ0sOPq5nO",
      color: "hover:bg-green-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/vlsid-club-0b38303a7",
      color: "hover:bg-blue-600",
    },
  ];

  const contactInfo = {
    address:
      "Gayatri Vidya Parishad College of Engineering (Autonomous), Madhurawada, Visakhapatnam - 530048, Andhra Pradesh, India",
    email: "vlsidclub@gvpce.ac.in",
  };

  // Google Maps embed URL - Replace with actual college coordinates
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.3875222255047!2d83.33972007494528!3d17.820459683142488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395bedc7efb603%3A0x87c06caab54e902a!2sGayatri%20Vidya%20Parishad%20College%20of%20Engineering%20(Autonomous)%20(GVP)%20(GVPCE)!5e0!3m2!1sen!2sin!4v1769667547411!5m2!1sen!2sin";

  const year = new Date().getFullYear();
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
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
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
                  className="w-18 h-18 object-contain"
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
              <h4 className="text-lg font-semibold mb-6">
                Contact Information
              </h4>
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
              Copyright © {year}  Gayatri Vidya Parishad College of Engineering
              (Autonomous).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
