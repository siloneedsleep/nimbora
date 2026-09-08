"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileCode, GitFork, Download, FolderGit2 } from "lucide-react";

interface ProjectDetail {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  files: { id: string; name: string; path: string; content: string }[];
  user: { username: string };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const username = params?.username as string;
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (res.ok) {
        setProject(data.project);
        if (data.project.files?.length > 0) {
          setSelectedFile(data.project.files[0]);
        }
      } else {
        setError(data.error || "Lỗi tải project");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleClone = () => {
    alert("Clone URL (demo): https://nimbora.example.com/clone/" + projectId);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Đang tải...</div>;
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || "Không tìm thấy project"}</p>
        <Link href={`/${username}/projects`} className="text-sky-300 hover:underline">Quay lại projects</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/${username}/projects`} className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
          ← Quay lại projects
        </Link>
        <div className="flex items-center gap-3">
          <FolderGit2 size={28} className="text-sky-300" />
          <div>
            <h1 className="font-display text-2xl font-semibold">{project.name}</h1>
            <p className="text-gray-400 text-sm">{project.description || "Không có mô tả"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClone}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
        >
          <Download size={16} /> Clone
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition">
          <GitFork size={16} /> Fork
        </button>
      </div>

      {/* Files */}
      <div className="flex gap-4">
        <div className="w-64 shrink-0">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Files ({project.files?.length || 0})</h3>
            {project.files?.length === 0 ? (
              <p className="text-gray-400 text-sm">Chưa có file nào.</p>
            ) : (
              <div className="space-y-1">
                {project.files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition ${
                      selectedFile?.id === file.id
                        ? "bg-sky-300/10 text-sky-300"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <FileCode size={16} />
                    <span className="text-sm truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File content */}
        <div className="flex-1 glass rounded-2xl p-4">
          {selectedFile ? (
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">{selectedFile.content?.length || 0} chars</span>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/30 rounded-xl p-4 min-h-[400px] max-h-[600px] overflow-auto">
                {selectedFile.content || "// File trống"}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Chọn file để xem nội dung</div>
          )}
        </div>
      </div>
    </div>
  );
}
