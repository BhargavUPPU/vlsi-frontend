'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResourceNav({ navItems, scrollToSection }) {
  const [activeSection, setActiveSection] = useState('magazines');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      // Find which section is currently in view
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = navItems[i].ref.current;
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Resources</h3>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.ref)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Explore All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Explore All
        </motion.button>
      </div>
    </div>
  );
}
