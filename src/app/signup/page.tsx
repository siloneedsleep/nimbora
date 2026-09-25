"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
      } else {
        router.push(`/${data.username}`);
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4">
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-center mb-8">Sign Up</h1>
        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold disabled:opacity-50"
          >
            {loading ? "Đang đăng ký..." : "Sign Up"}
          </button>
        </div>
        <p className="text-gray-400 text-center mt-4">
          Đã có tài khoản? <a href="/login" className="text-sky-300 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
