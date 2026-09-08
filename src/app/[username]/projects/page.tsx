"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Trash2, Eye, EyeOff, GitFork, Download, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  files: { id: string; name: string; path: string }[];
}

export default function ProjectsPage() {
  const params = useParams();
  const username = params?.username as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      } else {
        setError(data.error || "Lỗi tải projects");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc, isPublic: newIsPublic }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewName("");
        setNewDesc("");
        setNewIsPublic(false);
        setShowNewForm(false);
        fetchProjects();
      } else {
        setError(data.error || "Lỗi tạo project");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa project này?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
        setSelectedProject(null);
      }
    } catch (err) {
      setError("Lỗi xóa project");
    }
  };

  const handleTogglePublic = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !project.isPublic }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      setError("Lỗi cập nhật");
    }
  };

  const handleFork = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/fork`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`Đã fork project thành "${data.project.name}"`);
        fetchProjects();
      } else {
        setError(data.error || "Lỗi fork");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Projects 📁</h1>
          <p className="text-gray-400">Quản lý repository của bạn</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* New project form */}
      {showNewForm && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Tạo project mới</h3>
          <input
            type="text"
            placeholder="Tên project"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <textarea
            placeholder="Mô tả (tùy chọn)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white min-h-[80px]"
          />
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={newIsPublic}
              onChange={(e) => setNewIsPublic(e.target.checked)}
              className="rounded"
            />
            Public project (hiển thị trên landing page)
          </label>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
          >
            Tạo project
          </button>
        </form>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Chưa có project nào. Tạo project đầu tiên của bạn!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-2xl p-6 hover:border-white/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FolderGit2 size={24} className="text-sky-300" />
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-gray-400 text-sm">{project.description || "Không có mô tả"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {project.isPublic ? (
                    <Eye size={16} className="text-emerald-400" />
                  ) : (
                    <EyeOff size={16} className="text-gray-500" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span>{project.files?.length || 0} files</span>
                <span>•</span>
                <span>{new Date(project.updatedAt).toLocaleDateString("vi-VN")}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${username}/projects/${project.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 transition"
                >
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => handleTogglePublic(project)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 transition"
                >
                  {project.isPublic ? "Đặt private" : "Đặt public"}
                </button>
                <button
                  onClick={() => handleFork(project)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 transition flex items-center gap-1"
                >
                  <GitFork size={14} /> Fork
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-sm text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
