"use client";

import { motion } from "framer-motion";
import { Brain, Code2, FolderGit2, MessageCircle, Zap, BookOpen } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Lab", desc: "Quản lý API keys, chat với nhiều model, và chỉnh system prompt cho riêng bạn." },
  { icon: Code2, title: "Code Editor", desc: "Trình soạn thảo mạnh mẽ như VS Code, hỗ trợ AI pair programming." },
  { icon: FolderGit2, title: "Projects", desc: "Lưu trữ và quản lý code như GitHub, với fork, clone, và public projects." },
  { icon: MessageCircle, title: "Blog & Chat", desc: "Viết blog, tag người kia, và trò chuyện real-time trong không gian riêng tư." },
  { icon: Zap, title: "Automation", desc: "Tự động hóa workflow với AI Agent chạy ngầm 24/7." },
  { icon: BookOpen, title: "Knowledge Base", desc: "Bộ não thứ hai của bạn — lưu trữ và tìm kiếm kiến thức." },
];

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-semibold text-center mb-4"
      >
        Mọi thứ bạn cần, trong một không gian
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-gray-400 text-center max-w-2xl mx-auto mb-16"
      >
        Nimbora kết hợp AI, code, và kết nối cá nhân trong một workspace duy nhất.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="glass rounded-3xl p-6 hover:border-white/20 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-300/20 to-purple-300/20 flex items-center justify-center mb-4">
              <feature.icon size={24} className="text-sky-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
