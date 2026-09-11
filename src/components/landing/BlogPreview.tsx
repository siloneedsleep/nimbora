"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

const blogs = [
  {
    author: "siloneedsleep",
    role: "Official",
    title: "Blog Đầu Tiên & Tiến Hành Giai Đoạn Beta",
    excerpt: "Hôm nay đánh dấu một cột mốc quan trọng: bài blog đầu tiên được đăng tải trên Nimbora...",
    date: "10/09/2026",
    special: true,
  },
  {
    author: "mioo",
    role: "Official",
    title: "Không gian của riêng mình",
    excerpt: "Thích cách mọi thứ được thiết kế riêng cho hai đứa, từ blog đến chat...",
    date: "09/09/2026",
    special: true,
  },
  {
    author: "minhvy",
    role: "Verified",
    title: "Khám phá AI Lab",
    excerpt: "Mình vừa được cấp quyền verify, thử viết blog đầu tiên trên Nimbora...",
    date: "08/09/2026",
    special: false,
  },
];

export default function BlogPreview() {
  return (
    <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-semibold text-center mb-4"
      >
        Blog mới nhất
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-gray-400 text-center max-w-2xl mx-auto mb-16"
      >
        Những suy nghĩ được chia sẻ giữa mọi người.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Link
              href="/blog"
              className={`block rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 ${
                blog.special
                  ? "border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10"
                  : "glass"
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">
                  {blog.author[0].toUpperCase()}
                </div>
                <span>@{blog.author}</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                  {blog.role}
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-white">{blog.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{blog.date}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
