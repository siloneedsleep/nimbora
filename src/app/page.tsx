import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import Features from "@/components/landing/Features";
import BlogPreview from "@/components/landing/BlogPreview";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="aurora-bg"></div>
      <div className="fixed inset-0 z-[-3] bg-[#0a0e1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,#1e293b_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,#1e1b4b_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,#0f172a_0%,transparent_50%)]"></div>
      </div>

      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <BlogPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
