"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
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
    <main className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4 py-10">
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 w-full max-w-md" aria-describedby={error ? "login-error" : undefined}>
        <h1 className="font-display text-3xl font-semibold text-center mb-2 text-balance">Welcome back</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to continue to Nimbora.</p>
        {error && <div id="login-error" role="alert" aria-live="polite" className="text-red-300 text-sm mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center">{error}</div>}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-gray-300">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              placeholder="e.g. alex…"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-300/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-gray-300">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-300/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
        <p className="text-gray-400 text-center mt-6">
          Don&apos;t have an account? <Link href="/signup" className="text-sky-300 hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}
