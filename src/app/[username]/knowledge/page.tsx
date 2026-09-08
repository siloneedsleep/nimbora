"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, Search, FileText, Loader2, BookOpen } from "lucide-react";

interface KnowledgeItem {
  id: string;
  name: string;
  path: string;
  content: string;
  updatedAt: string;
}

export default function KnowledgePage() {
  const params = useParams();
  const username = params?.username as string;

  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      if (res.ok) {
        setKnowledge(data.knowledge || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2">
          <Brain className="text-purple-300" /> Knowledge Base
        </h1>
        <p className="text-gray-400">Bộ não thứ hai của bạn - lưu trữ và tìm kiếm kiến thức</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="glass rounded-2xl p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm kiến thức... (vd: authentication, react hooks)"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-300 to-pink-200 text-[#0a0e1a] font-semibold disabled:opacity-50"
          >
            {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>
      </form>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Kết quả tìm kiếm ({searchResults.length})</h3>
          <div className="space-y-3">
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-sky-300" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.content}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge list */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={18} /> Tài liệu ({knowledge.length})
        </h3>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto" size={24} />
          </div>
        ) : knowledge.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Chưa có tài liệu nào. Tạo file có tên chứa "readme", "doc", "note" để tự động thêm vào đây.
          </p>
        ) : (
          <div className="space-y-3">
            {knowledge.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-sky-300" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{item.path}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected item detail */}
      {selectedItem && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{selectedItem.name}</h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/30 rounded-xl p-4 max-h-[400px] overflow-auto">
            {selectedItem.content}
          </pre>
        </div>
      )}
    </div>
  );
}
