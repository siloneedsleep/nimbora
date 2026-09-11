"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-400 text-sm mb-8"
      >
        <Sparkles size={14} className="text-sky-300" />
        AI-Native Workspace
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 animate-pulse" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-display text-6xl md:text-8xl font-semibold mb-6 tracking-tight"
      >
        <span className="gradient-text">Nimbora</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl font-light"
      >
        The cloud that thinks with you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <Link
          href="/login"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold shadow-lg shadow-sky-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all"
        >
          Bắt đầu ngay
        </Link>
        <a
          href="#features"
          className="px-8 py-3 rounded-full border border-white/15 text-gray-200 hover:bg-white/5 transition"
        >
          Khám phá
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs opacity-70"
      >
        <ChevronDown size={20} className="animate-bounce" />
        <span>Cuộn xuống</span>
      </motion.div>
    </section>
  );
}
