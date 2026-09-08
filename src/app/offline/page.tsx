import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e1a] text-center px-4">
      <div className="text-6xl mb-4">📡</div>
      <h1 className="font-display text-3xl font-semibold mb-2">Bạn đang offline</h1>
      <p className="text-gray-400 mb-6">Vui lòng kiểm tra kết nối internet của bạn.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
      >
        Thử lại
      </Link>
    </div>
  );
}
