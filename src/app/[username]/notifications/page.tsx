"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, CheckCheck, Loader2, MessageCircle, Newspaper, Zap } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "chat_message":
        return <MessageCircle size={18} className="text-sky-300" />;
      case "blog_tag":
        return <Newspaper size={18} className="text-purple-300" />;
      case "agent_update":
        return <Zap size={18} className="text-pink-300" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin mx-auto" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Notifications 🔔</h1>
          <p className="text-gray-400">{unreadCount} chưa đọc</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition"
        >
          <CheckCheck size={16} />
          Đánh dấu đã đọc
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Chưa có thông báo nào.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`glass rounded-2xl p-4 flex items-start gap-3 ${
                !notif.read ? "border-sky-300/30" : ""
              }`}
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <h3 className="font-medium">{notif.title}</h3>
                <p className="text-gray-400 text-sm">{notif.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-sky-300 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
