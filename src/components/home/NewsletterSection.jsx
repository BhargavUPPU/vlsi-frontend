"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 gradient-cta text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div variants={staggerItem} className="mb-6 sm:mb-8 md:mb-10">
            <div className="w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 mx-auto rounded-full bg-white/20 backdrop-blur-lg p-4 sm:p-5 md:p-5 shadow-2xl">
              <Mail className="w-full h-full text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={staggerItem}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8"
          >
            Ready to{" "}
            <span className="text-yellow-300">Join The Club</span>?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={staggerItem}
            className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto"
          >
            Stay updated with the latest events, workshops, and opportunities.
            Subscribe to our newsletter!
          </motion.p>

          {/* Form */}
          <motion.form
            variants={staggerItem}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm sm:text-base md:text-lg"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <Send size={18} className="sm:w-5 sm:h-5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Success Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-yellow-300 font-medium text-sm sm:text-base"
              >
                {message}
              </motion.p>
            )}
          </motion.form>

          {/* Privacy Note */}
          <motion.p
            variants={staggerItem}
            className="mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm text-white/70"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
