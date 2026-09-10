import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg"></div>
      <div className="fixed inset-0 z-[-3] bg-[#0a0e1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,#1e293b_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,#1e1b4b_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,#0f172a_0%,transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#0a0e1a]/50 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-xl text-white">
          <span>☁️</span> Nimbora
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
          <a href="#blog" className="text-gray-400 hover:text-white transition">Blog</a>
          <a href="#projects" className="text-gray-400 hover:text-white transition">Projects</a>
          <Link href="/signup" className="px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition">Sign Up</Link>
          <Link href="/login" className="px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition">Login</Link>
        </div>
        <div className="md:hidden flex items-center gap-3">
          <Link href="/signup" className="px-3 py-1.5 rounded-full border border-white/20 text-sm text-gray-200">Sign Up</Link>
          <Link href="/login" className="px-3 py-1.5 rounded-full border border-white/20 text-sm text-gray-200">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 animate-pulse"></span>
          AI-Native Workspace
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-semibold mb-6 tracking-tight">
          <span className="gradient-text">Nimbora</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl font-light">
          The cloud that thinks with you.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login" className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold shadow-lg shadow-sky-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all">
            Bắt đầu ngay
          </Link>
          <a href="#features" className="px-8 py-3 rounded-full border border-white/15 text-gray-200 hover:bg-white/5 transition">
            Khám phá
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 text-xs opacity-70">
          <div className="w-6 h-9 border border-white/30 rounded-full relative">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span>Cuộn xuống</span>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-white/5 bg-white/[0.02] py-6 overflow-hidden relative z-10">
        <div className="marquee">
          {["AI Lab", "Code Editor", "Projects", "Blog", "Chat", "Automation", "Cloud Workspace", "AI Lab", "Code Editor", "Projects", "Blog", "Chat", "Automation", "Cloud Workspace"].map((item, i) => (
            <span key={i} className="text-gray-500 flex items-center gap-3 text-lg">
              {item} <span className="text-gray-700">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-4">
          Mọi thứ bạn cần, trong một không gian
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
          Nimbora kết hợp AI, code, và kết nối cá nhân trong một workspace duy nhất.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🧠", title: "AI Lab", desc: "Quản lý API keys, chat với nhiều model, và chỉnh system prompt cho riêng bạn." },
            { icon: "💻", title: "Code Editor", desc: "Trình soạn thảo mạnh mẽ như VS Code, hỗ trợ AI pair programming." },
            { icon: "📁", title: "Projects", desc: "Lưu trữ và quản lý code như GitHub, với fork, clone, và public projects." },
            { icon: "💬", title: "Blog & Chat", desc: "Viết blog, tag người kia, và trò chuyện real-time trong không gian riêng tư." },
          ].map((feature, i) => (
            <div key={i} className="glass rounded-3xl p-6 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blog" className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-4">Blog mới nhất</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Những suy nghĩ được chia sẻ giữa mọi người.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/blog" className="glass rounded-3xl p-6 hover:-translate-y-2 transition-all border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">S</div>
              <span>@siloneedsleep</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Official</span>
            </div>
            <h3 className="font-semibold mb-2 text-white">Bắt đầu hành trình xây Nimbora</h3>
            <p className="text-gray-400 text-sm line-clamp-2">Hôm nay mình bắt đầu code những dòng đầu tiên cho Nimbora...</p>
          </Link>

          <Link href="/blog" className="glass rounded-3xl p-6 hover:-translate-y-2 transition-all border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">M</div>
              <span>@mioo</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Official</span>
            </div>
            <h3 className="font-semibold mb-2 text-white">Không gian của riêng mình</h3>
            <p className="text-gray-400 text-sm line-clamp-2">Thích cách mọi thứ được thiết kế riêng cho hai đứa...</p>
          </Link>

          <Link href="/blog" className="glass rounded-3xl p-6 hover:-translate-y-2 transition-all">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">V</div>
              <span>@minhvy</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Verified</span>
            </div>
            <h3 className="font-semibold mb-2 text-white">Khám phá AI Lab</h3>
            <p className="text-gray-400 text-sm line-clamp-2">Mình vừa được cấp quyền verify...</p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center relative z-10">
        <div className="glass rounded-3xl p-12 border border-white/10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Tham gia Nimbora để trải nghiệm workspace AI đầu tiên của bạn.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold shadow-lg shadow-sky-500/30 hover:shadow-purple-500/50 transition-all">
              Đăng ký
            </Link>
            <Link href="/login" className="px-8 py-3 rounded-full border border-white/15 text-gray-200 hover:bg-white/5 transition">
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center relative z-10">
        <div className="text-lg font-semibold mb-4 font-display">☁️ Nimbora</div>
        <div className="flex justify-center gap-6 mb-4 flex-wrap text-sm">
          <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
          <a href="#blog" className="text-gray-400 hover:text-white transition">Blog</a>
          <Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link>
          <a href="/signup" className="text-gray-400 hover:text-white transition">Sign Up</a>
        </div>
        <p className="text-gray-500 text-sm">© 2025 Nimbora. The cloud that thinks with you.</p>
      </footer>
    </div>
  );
}
