import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="background"></div>

      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-xl" style={{ textDecoration: 'none', color: '#e5e7eb' }}>
          <span>☁️</span> Nimbora
        </Link>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-400" style={{ textDecoration: 'none' }}>Features</a>
          <a href="#blog" className="text-gray-400" style={{ textDecoration: 'none' }}>Blog</a>
          <a href="#projects" className="text-gray-400" style={{ textDecoration: 'none' }}>Projects</a>
          <Link href="/signup" className="btn-outline">Sign Up</Link>
          <Link href="/login" className="btn-outline">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge mb-8">
          <span className="badge-dot"></span>
          AI-Native Workspace
        </div>
        <h1 className="font-display font-semibold mb-6" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
          <span className="gradient-text">Nimbora</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10">The cloud that thinks with you.</p>
        <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/login" className="btn-primary">Login</Link>
          <Link href="/signup" className="btn-outline">Sign Up</Link>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee">
          {["AI Lab", "Code Editor", "Projects", "Blog", "Chat", "Automation", "Cloud Workspace", "AI Lab", "Code Editor", "Projects", "Blog", "Chat", "Automation", "Cloud Workspace"].map((item, i) => (
            <span key={i}>{item} <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span></span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="container py-24">
        <h2 className="font-display text-4xl font-semibold text-center mb-4">Mọi thứ bạn cần, trong một không gian</h2>
        <p className="text-gray-400 text-center mb-12" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>Nimbora kết hợp AI, code, và kết nối cá nhân trong một workspace duy nhất.</p>
        <div className="grid grid-cols-4 gap-6">
          {[
            { icon: "🧠", title: "AI Lab", desc: "Quản lý API keys, chat với nhiều model, và chỉnh system prompt." },
            { icon: "💻", title: "Code Editor", desc: "Trình soạn thảo mạnh mẽ như VS Code, hỗ trợ AI pair programming." },
            { icon: "📁", title: "Projects", desc: "Lưu trữ và quản lý code như GitHub, với fork, clone." },
            { icon: "💬", title: "Blog & Chat", desc: "Viết blog, tag người kia, và trò chuyện real-time." },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="text-lg font-semibold mb-4">☁️ Nimbora</div>
        <div className="flex gap-6 mb-4" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="text-gray-400" style={{ textDecoration: 'none' }}>Trang chủ</a>
          <a href="#features" className="text-gray-400" style={{ textDecoration: 'none' }}>Features</a>
          <a href="/login" className="text-gray-400" style={{ textDecoration: 'none' }}>Login</a>
        </div>
        <p className="text-gray-500 text-sm">© 2025 Nimbora. The cloud that thinks with you.</p>
      </footer>
    </div>
  );
}
