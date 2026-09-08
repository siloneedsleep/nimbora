"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, Plus, Trash2, MessageCircle, Heart, Loader2 } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    username: string;
    role: string;
    isVerified: boolean;
  };
  comments: any[];
  reactions: any[];
}

export default function BlogPage() {
  const params = useParams();
  const username = params?.username as string;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTags, setNewTags] = useState("");
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs || []);
      } else {
        setError(data.error || "Lỗi tải blogs");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          tags: newTags,
          isPublic: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setNewCategory("");
        setNewTags("");
        setShowNewForm(false);
        fetchBlogs();
      } else {
        setError(data.error || "Lỗi tạo blog");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Xóa blog này?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
        setSelectedBlog(null);
      }
    } catch (err) {
      setError("Lỗi xóa blog");
    }
  };

  const handleAddComment = async (blogId: string) => {
    if (!commentContent.trim()) return;
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent }),
      });
      if (res.ok) {
        setCommentContent("");
        fetchBlogs();
      }
    } catch (err) {
      setError("Lỗi thêm comment");
    }
  };

  const handleAddReaction = async (blogId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      setError("Lỗi thêm reaction");
    }
  };

  const isOfficial = (blog: Blog) => {
    return blog.user.role === "OWNER" || blog.user.role === "OFFICIAL";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Blog 📝</h1>
          <p className="text-gray-400">Chia sẻ suy nghĩ của bạn</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
        >
          <Plus size={18} />
          Viết blog
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* New blog form */}
      {showNewForm && (
        <form onSubmit={handleCreateBlog} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Viết blog mới</h3>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <textarea
            placeholder="Nội dung (Markdown supported)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white min-h-[200px]"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Category (vd: tech, life)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            />
            <input
              type="text"
              placeholder="Tags (vd: #devlog #ai)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
          >
            Đăng blog
          </button>
        </form>
      )}

      {/* Blog list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={32} />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Chưa có blog nào.</div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className={`glass rounded-2xl p-6 hover:border-white/20 transition ${
                isOfficial(blog)
                  ? "border border-sky-300/30 bg-gradient-to-br from-sky-300/10 via-purple-300/10 to-pink-200/10"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-300 to-pink-200 flex items-center justify-center text-xs font-semibold text-[#0a0e1a]">
                    {blog.user.username[0]?.toUpperCase()}
                  </div>
                  <span>@{blog.user.username}</span>
                  {(isOfficial(blog) || blog.user.isVerified) && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                      {isOfficial(blog) ? "Official" : "Verified"}
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                {blog.user.username === username && (
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <h3 className="font-semibold text-xl mb-2">{blog.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.content}</p>

              {blog.category && (
                <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full mr-2">
                  {blog.category}
                </span>
              )}
              {blog.tags && (
                <span className="text-xs text-gray-500">{blog.tags}</span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleAddReaction(blog.id, "❤️")}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-400 transition"
                >
                  <Heart size={16} />
                  {blog.reactions?.length || 0}
                </button>
                <button
                  onClick={() => setSelectedBlog(selectedBlog?.id === blog.id ? null : blog)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-sky-300 transition"
                >
                  <MessageCircle size={16} />
                  {blog.comments?.length || 0} comments
                </button>
              </div>

              {/* Comments */}
              {selectedBlog?.id === blog.id && (
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    {blog.comments?.map((comment: any) => (
                      <div key={comment.id} className="bg-white/5 rounded-xl px-4 py-2">
                        <span className="text-sm font-medium">@{comment.user?.username}</span>
                        <p className="text-gray-400 text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Viết comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white text-sm"
                    />
                    <button
                      onClick={() => handleAddComment(blog.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold text-sm"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
