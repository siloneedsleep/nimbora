"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FileCode, FilePlus, Trash2, Download, Loader2, Smartphone, Save } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
  updatedAt: string;
}

export default function EditorPage() {
  const params = useParams();
  const username = params?.username as string;

  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNewFileForm, setShowNewFileForm] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setShowMobileWarning(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error("Lỗi tải files", err);
    }
  };

  const handleSelectFile = async (file: FileItem) => {
    if (isMobile) {
      // Mobile: chỉ xem
      setSelectedFile(file);
      setContent(file.content);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/files/${file.id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedFile(data.file);
        setContent(data.file.content);
      }
    } catch (err) {
      console.error("Lỗi tải file", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (value: string | undefined) => {
    if (isMobile) return; // Không cho sửa trên mobile

    const newContent = value || "";
    setContent(newContent);
    setSaveStatus("unsaved");

    // Auto-save sau 1s không gõ
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(newContent);
    }, 1000);
  };

  const handleSave = async (contentToSave?: string) => {
    if (!selectedFile) return;

    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/files/${selectedFile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSave || content }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        fetchFiles();
      }
    } catch (err) {
      console.error("Lỗi lưu file", err);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName, content: "" }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewFileName("");
        setShowNewFileForm(false);
        fetchFiles();
        setSelectedFile(data.file);
        setContent("");
      }
    } catch (err) {
      console.error("Lỗi tạo file", err);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    if (!confirm(`Xóa file "${file.name}"?`)) return;

    try {
      const res = await fetch(`/api/files/${file.id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedFile?.id === file.id) {
          setSelectedFile(null);
          setContent("");
        }
        fetchFiles();
      }
    } catch (err) {
      console.error("Lỗi xóa file", err);
    }
  };

  const handleExport = async () => {
    if (!selectedFile) return;
    alert("Đã export file sang Projects (tính năng sẽ hoàn thiện ở Phase 5)");
  };

  if (isMobile && showMobileWarning) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="font-display text-2xl font-semibold mb-2">Code Editor</h1>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Trải nghiệm code editor tốt nhất trên màn hình lớn. Vui lòng truy cập bằng máy tính hoặc bật "Trang dành cho máy tính".
        </p>
        <button
          onClick={() => setShowMobileWarning(false)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
        >
          Vẫn xem ở chế độ chỉ đọc
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Code Editor 💻</h1>
          <p className="text-gray-400">Soạn thảo code với Monaco Editor</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${saveStatus === "saved" ? "text-emerald-400" : saveStatus === "saving" ? "text-yellow-400" : "text-gray-400"}`}>
            {saveStatus === "saved" ? "✓ Đã lưu" : saveStatus === "saving" ? "Đang lưu..." : "Chưa lưu"}
          </span>
          <button
            onClick={handleExport}
            disabled={!selectedFile}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition disabled:opacity-50"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowNewFileForm(!showNewFileForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
          >
            <FilePlus size={16} />
            New File
          </button>
        </div>
      </div>

      {/* New file form */}
      {showNewFileForm && (
        <form onSubmit={handleCreateFile} className="glass rounded-2xl p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Tên file (vd: index.ts)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
              required
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold">
              Tạo
            </button>
          </div>
        </form>
      )}

      {/* File explorer + Editor */}
      <div className="flex gap-6">
        {/* File list */}
        <div className="w-64 shrink-0">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Files ({files.length})</h3>
            {files.length === 0 ? (
              <p className="text-gray-400 text-sm">Chưa có file nào.</p>
            ) : (
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                      selectedFile?.id === file.id
                        ? "bg-sky-300/10 text-sky-300"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <button
                      onClick={() => handleSelectFile(file)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <FileCode size={16} />
                      <span className="text-sm truncate">{file.name}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 glass rounded-2xl overflow-hidden">
          {selectedFile ? (
            <div className="h-[600px]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-sm font-medium">{selectedFile.name}</span>
                {isMobile && <span className="text-xs text-yellow-400">Chỉ đọc</span>}
              </div>
              <Editor
                height="calc(100% - 40px)"
                language={selectedFile.name.split(".").pop() || "javascript"}
                value={content}
                onChange={handleContentChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  readOnly: isMobile,
                }}
              />
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-gray-400">
              Chọn một file để bắt đầu chỉnh sửa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
