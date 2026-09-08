"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function WorkspaceHome() {
  const params = useParams();
  const username = params?.username as string;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-6">Chào {username}! ☁️</h1>
      <p className="text-gray-400 mb-8">Đây là workspace của bạn trên Nimbora.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { href: `/${username}/ai-lab`, icon: "🧠", title: "AI Lab", desc: "Quản lý API keys & chat với AI" },
          { href: `/${username}/editor`, icon: "💻", title: "Code Editor", desc: "Viết code với Monaco Editor" },
          { href: `/${username}/projects`, icon: "📁", title: "Projects", desc: "Quản lý repository" },
          { href: `/${username}/blog`, icon: "📝", title: "Blog", desc: "Viết blog & chia sẻ" },
          { href: `/${username}/chat`, icon: "💬", title: "Chat", desc: "Trò chuyện real-time" },
          { href: `/${username}/automation`, icon: "⚡", title: "Automation", desc: "Tự động hóa với Agent" },
          { href: `/${username}/knowledge`, icon: "📚", title: "Knowledge", desc: "Bộ não thứ hai của bạn" },
          { href: `/${username}/activity`, icon: "📊", title: "Activity", desc: "Thống kê hoạt động" },
        ].map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="glass rounded-3xl p-6 hover:-translate-y-1 hover:border-white/20 transition"
          >
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
