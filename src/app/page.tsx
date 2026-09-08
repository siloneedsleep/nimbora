import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Nền động */}
      <div className="fixed inset-0 z-[-3] bg-[#0a0e1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,#1e293b_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,#1e1b4b_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,#1e3a8a_0%,transparent_50%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#0a0e1a]/50 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-xl">
          <span>☁️</span> Nimbora
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Ẩn links trên mobile */}
          <a href="#features" className="hidden md:block text-gray-400 hover:text-white transition">Features</a>
          <a href="#blog" className="hidden md:block text-gray-400 hover:text-white transition">Blog</a>
          <a href="#projects" className="hidden md:block text-gray-400 hover:text-white transition">Projects</a>
          <Link href="/signup" className="px-3 md:px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition text-sm">Sign Up</Link>
          <Link href="/login" className="px-3 md:px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition text-sm">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/3 border border-white/8 text-gray-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 animate-pulse"></span>
          AI-Native Workspace
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-semibold mb-6">
          <span className="gradient-text">Nimbora</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10">The cloud that thinks with you.</p>
        <div className="flex gap-4">
          <Link href="/login" className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold shadow-lg shadow-sky-500/30 hover:shadow-purple-500/30 transition">Get Started</Link>
          <Link href="/signup" className="px-8 py-3 rounded-full border border-white/15 text-gray-200 hover:bg-white/5 transition">Sign Up</Link>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-white/5 bg-white/2 py-4 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {["AI Lab", "Code Editor", "Projects", "Blog", "Chat", "Automation", "Cloud Workspace"].map((item, i) => (
            <span key={i} className="text-gray-500 flex items-center gap-3">
              {item} <span className="text-gray-700">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-4">Mọi thứ bạn cần, trong một không gian</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Nimbora kết hợp AI, code, và kết nối cá nhân trong một workspace duy nhất.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🧠", title: "AI Lab", desc: "Quản lý API keys, chat với nhiều model, và chỉnh system prompt cho riêng bạn." },
            { icon: "💻", title: "Code Editor", desc: "Trình soạn thảo mạnh mẽ như VS Code, hỗ trợ AI pair programming." },
            { icon: "📁", title: "Projects", desc: "Lưu trữ và quản lý code như GitHub, với fork, clone, và public projects." },
            { icon: "💬", title: "Blog & Chat", desc: "Viết blog, tag người kia, và trò chuyện real-time trong không gian riêng tư." },
          ].map((feature, i) => (
            <div key={i} className="glass rounded-3xl p-6 hover:-translate-y-1 hover:border-white/20 transition">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blog" className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-4">Blog mới nhất</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Những suy nghĩ được chia sẻ giữa mọi người.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-3xl p-6 hover:shadow-lg transition border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">S</div>
              <span>@siloneedsleep</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Official</span>
              <span>•</span>
              <span>2 giờ trước</span>
            </div>
            <h3 className="font-semibold mb-2">Bắt đầu hành trình xây Nimbora</h3>
            <p className="text-gray-400 text-sm">Hôm nay mình bắt đầu code những dòng đầu tiên cho Nimbora, một workspace AI thực sự cá nhân...</p>
          </div>
          <div className="glass rounded-3xl p-6 hover:shadow-lg transition border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">M</div>
              <span>@mioo</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Official</span>
              <span>•</span>
              <span>Hôm qua</span>
            </div>
            <h3 className="font-semibold mb-2">Không gian của riêng mình</h3>
            <p className="text-gray-400 text-sm">Thích cách mọi thứ được thiết kế riêng cho hai đứa, từ blog đến chat...</p>
          </div>
          <div className="glass rounded-3xl p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">V</div>
              <span>@minhvy</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">Verified</span>
              <span>•</span>
              <span>1 ngày trước</span>
            </div>
            <h3 className="font-semibold mb-2">Khám phá AI Lab</h3>
            <p className="text-gray-400 text-sm">Mình vừa được cấp quyền verify, thử viết blog đầu tiên trên Nimbora...</p>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section id="projects" className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-4">Dự án công khai</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Một vài project được chia sẻ từ workspace.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📦", name: "nimbora-web", desc: "Landing page và workspace chính của Nimbora.", lang: "TypeScript", color: "bg-sky-300", stars: 12, forks: 3 },
            { icon: "🧩", name: "ai-agent-core", desc: "Hệ thống agent có khả năng tự động hóa và chạy nền.", lang: "Python", color: "bg-purple-300", stars: 8, forks: 1 },
            { icon: "🎨", name: "nimbora-design", desc: "Bộ thiết kế UI/UX với vibe mây tối, glassmorphism.", lang: "Figma", color: "bg-pink-200", stars: 5, forks: 0 },
          ].map((project, i) => (
            <div key={i} className="glass rounded-3xl p-6 hover:-translate-y-1 hover:border-white/20 transition">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{project.icon}</span>
                <h3 className="font-semibold">{project.name}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">{project.desc}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${project.color}`}></span>{project.lang}</span>
                <span>⭐ {project.stars}</span>
                <span>⑂ {project.forks}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center">
        <div className="text-lg font-semibold mb-4">☁️ Nimbora</div>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-gray-400 hover:text-white transition">Trang chủ</a>
          <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
          <a href="#blog" className="text-gray-400 hover:text-white transition">Blog</a>
          <a href="#projects" className="text-gray-400 hover:text-white transition">Projects</a>
          <a href="/login" className="text-gray-400 hover:text-white transition">Login</a>
        </div>
        <p className="text-gray-500 text-sm">© 2025 Nimbora. The cloud that thinks with you.</p>
      </footer>
    </div>
  );
}
