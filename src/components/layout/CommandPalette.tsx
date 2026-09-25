"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, FileCode, FolderGit2, Newspaper, Loader2, CornerDownLeft } from "lucide-react";

interface SearchResults {
  files: { id: string; name: string; path: string }[];
  projects: { id: string; name: string; description?: string }[];
  blogs: { id: string; title: string }[];
}

type FlatResult =
  | { kind: "file"; id: string; title: string; subtitle: string }
  | { kind: "project"; id: string; title: string; subtitle: string }
  | { kind: "blog"; id: string; title: string; subtitle: string };

const EMPTY: SearchResults = { files: [], projects: [], blogs: [] };

export function CommandPalette() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toggle với Ctrl+K / Cmd+K, đóng với Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);

    // Cho phép mở từ nơi khác (vd: nút Search ở topbar) không chỉ bằng phím tắt
    const openHandler = () => setOpen(true);
    window.addEventListener("nimbora:command-palette:open", openHandler);

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("nimbora:command-palette:open", openHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(EMPTY);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.results || EMPTY);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Lỗi search", err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const flatResults: FlatResult[] = [
    ...results.files.map((f) => ({ kind: "file" as const, id: f.id, title: f.name, subtitle: f.path })),
    ...results.projects.map((p) => ({ kind: "project" as const, id: p.id, title: p.name, subtitle: p.description || "Project" })),
    ...results.blogs.map((b) => ({ kind: "blog" as const, id: b.id, title: b.title, subtitle: "Blog" })),
  ];

  const goTo = useCallback(
    (item: FlatResult) => {
      setOpen(false);
      if (item.kind === "file") router.push(`/${username}/editor`);
      else if (item.kind === "project") router.push(`/${username}/projects/${item.id}`);
      else router.push(`/blog/${item.id}`);
    },
    [router, username]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[activeIndex]) {
      e.preventDefault();
      goTo(flatResults[activeIndex]);
    }
  };

  if (!open) return null;

  const icon = (kind: FlatResult["kind"]) =>
    kind === "file" ? <FileCode size={16} /> : kind === "project" ? <FolderGit2 size={16} /> : <Newspaper size={16} />;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="glass rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          {loading ? <Loader2 size={18} className="animate-spin text-sky-300" /> : <Search size={18} className="text-gray-400" />}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm file, project, blog..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
          />
          <kbd className="text-xs text-gray-500 border border-white/10 rounded px-1.5 py-0.5">Esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.trim() && !loading && flatResults.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              Không tìm thấy kết quả cho "{query}"
            </p>
          )}
          {!query.trim() && (
            <p className="text-center text-gray-500 text-sm py-8">
              Gõ để tìm trong Files, Projects, Blog của bạn
            </p>
          )}
          {flatResults.map((item, i) => (
            <button
              key={`${item.kind}-${item.id}`}
              onClick={() => goTo(item)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="text-sky-300 shrink-0">{icon(item.kind)}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm text-white truncate">{item.title}</span>
                <span className="block text-xs text-gray-500 truncate">{item.subtitle}</span>
              </span>
              {i === activeIndex && <CornerDownLeft size={14} className="text-gray-500 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
