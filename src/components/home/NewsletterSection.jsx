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
    <section className="py-20 gradient-cta text-white relative overflow-hidden">
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
          className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
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
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center"
        >
          {/* Icon */}
          <motion.div variants={staggerItem} className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-lg p-5 shadow-2xl">
              <Mail className="w-full h-full text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ready to{" "}
            <span className="text-yellow-300">Join The Club</span>?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={staggerItem}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
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
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <Send size={20} />
                  </>
                )}
              </motion.button>
            </div>

            {/* Success Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-yellow-300 font-medium"
              >
                {message}
              </motion.p>
            )}
          </motion.form>

          {/* Privacy Note */}
          <motion.p
            variants={staggerItem}
            className="mt-6 text-sm text-white/70"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
