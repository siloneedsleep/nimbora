"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-12 border border-white/10 text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Tham gia Nimbora để trải nghiệm workspace AI đầu tiên của bạn.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold shadow-lg shadow-sky-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Đăng ký <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full border border-white/15 text-gray-200 hover:bg-white/5 transition"
          >
            Đăng nhập
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
