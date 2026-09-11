import Link from "next/link";
import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg text-white">
            <Cloud size={20} className="text-sky-300" />
            Nimbora
          </Link>
          <div className="flex justify-center gap-6 flex-wrap text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#blog" className="text-gray-400 hover:text-white transition">Blog</a>
            <Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link>
            <Link href="/signup" className="text-gray-400 hover:text-white transition">Sign Up</Link>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 Nimbora. The cloud that thinks with you.
          </p>
        </div>
      </div>
    </footer>
  );
}
