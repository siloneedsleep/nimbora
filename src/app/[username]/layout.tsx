"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Home, Code2, Brain, FolderGit2, Newspaper, MessageCircle, Bell, Settings, Zap, LogOut } from "lucide-react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotificationCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { href: `/${username}`, icon: Home, label: "Home" },
    { href: `/${username}/editor`, icon: Code2, label: "Editor" },
    { href: `/${username}/ai-lab`, icon: Brain, label: "AI Lab" },
    { href: `/${username}/projects`, icon: FolderGit2, label: "Projects" },
    { href: `/${username}/blog`, icon: Newspaper, label: "Blog" },
    { href: `/${username}/chat`, icon: MessageCircle, label: "Chat" },
    { href: `/${username}/automation`, icon: Zap, label: "Automation" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-white/5 bg-white/3 backdrop-blur-xl z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-xl">
            <span>☁️</span> Nimbora
          </Link>
          <p className="text-gray-400 text-sm mt-2">@{username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#0a0e1a]/50 border-b border-white/5">
          <Link href={`/${username}`} className="md:hidden font-display font-semibold text-lg">
            ☁️ Nimbora
          </Link>
          <div className="hidden md:block text-sm text-gray-400">
            Workspace của @{username}
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${username}/notifications`} className="relative">
              <Bell size={20} className="text-gray-400 hover:text-white transition" />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {notificationCount}
                </span>
              )}
            </Link>
            <Link href={`/${username}/profile`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 flex items-center justify-center text-sm font-semibold text-[#0a0e1a]">
                {username[0]?.toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-[#0a0e1a]/80 backdrop-blur-xl border-t border-white/5 px-2 py-2">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition p-2"
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
