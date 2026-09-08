"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { User, MapPin, Link2, Loader2 } from "lucide-react";

interface ProfileData {
  username: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Tạo API riêng cho profile
      // Tạm dùng data từ username
      setProfile({
        username,
        role: "OFFICIAL",
        isVerified: true,
        createdAt: "2025-01-01",
        profile: {
          bio: "Cloud workspace builder ☁️",
          location: "Vietnam",
          website: "https://nimbora.example.com",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 flex items-center justify-center text-4xl font-semibold text-[#0a0e1a] mx-auto mb-4">
          {username[0]?.toUpperCase()}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="font-display text-2xl font-semibold">@{username}</h1>
          {profile?.isVerified && (
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
              {profile.role === "OWNER" || profile.role === "OFFICIAL" ? "Official" : "Verified"}
            </span>
          )}
        </div>
        <p className="text-gray-400 mb-4">{profile?.profile?.bio}</p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          {profile?.profile?.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {profile.profile.location}
            </span>
          )}
          {profile?.profile?.website && (
            <a
              href={profile.profile.website}
              target="_blank"
              className="flex items-center gap-1 hover:text-sky-300 transition"
            >
              <Link2 size={14} /> Website
            </a>
          )}
          <span>Tham gia: {new Date(profile?.createdAt || "").toLocaleDateString("vi-VN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-semibold mb-2">0</div>
          <div className="text-gray-400 text-sm">Blogs</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-semibold mb-2">0</div>
          <div className="text-gray-400 text-sm">Projects</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-semibold mb-2">0</div>
          <div className="text-gray-400 text-sm">Followers</div>
        </div>
      </div>
    </div>
  );
}
