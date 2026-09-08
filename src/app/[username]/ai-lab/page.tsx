"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Send, Key, Loader2, Settings, X } from "lucide-react";

interface APIKey {
  id: string;
  provider: string;
  maskKey: string;
  status: string;
  defaultModel?: string;
  createdAt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AILabPage() {
  const params = useParams();
  const username = params?.username as string;

  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (res.ok) {
        setApiKeys(data.apiKeys || []);
      } else {
        setError(data.error || "Lỗi tải keys");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    }
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingKeys(true);
    setError("");
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setApiKeys([...apiKeys, data.apiKey]);
        setNewKey("");
        setShowKeyForm(false);
      } else {
        setError(data.error || "Lỗi thêm key");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApiKeys(apiKeys.filter((k) => k.id !== id));
      }
    } catch (err) {
      setError("Lỗi xóa key");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          provider: "openai",
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Lỗi: " + (data.error || "Không thể gọi AI") }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Lỗi kết nối" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">AI Lab 🧠</h1>
          <p className="text-gray-400">Quản lý API keys và chat với AI</p>
        </div>
        <button
          onClick={() => setShowKeyForm(!showKeyForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
        >
          <Plus size={18} />
          Add Key
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Key form */}
      {showKeyForm && (
        <form onSubmit={handleAddKey} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Thêm API Key mới</h3>
          <div className="flex gap-4">
            <input
              type="password"
              placeholder="Dán API key vào đây..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
              required
            />
            <button
              type="submit"
              disabled={loadingKeys}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold disabled:opacity-50"
            >
              {loadingKeys ? <Loader2 className="animate-spin" size={18} /> : "Thêm"}
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">Hệ thống sẽ tự động nhận diện provider.</p>
        </form>
      )}

      {/* Keys list */}
      {apiKeys.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">API Keys ({apiKeys.length})</h3>
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Key size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">{key.provider.toUpperCase()}</div>
                    <div className="text-gray-400 text-sm font-mono">{key.maskKey}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${key.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {key.status}
                  </span>
                  <button onClick={() => handleDeleteKey(key.id)} className="text-gray-400 hover:text-red-400 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Prompt */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">System Prompt</h3>
          <button onClick={() => setShowPromptEditor(!showPromptEditor)} className="text-gray-400 hover:text-white transition">
            <Settings size={18} />
          </button>
        </div>
        {showPromptEditor ? (
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Nhập system prompt..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white min-h-[100px]"
          />
        ) : (
          <p className="text-gray-400 text-sm">
            {systemPrompt || "Chưa cấu hình system prompt. Nhấn ⚙️ để chỉnh."}
          </p>
        )}
      </div>

      {/* Chat area */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Chat với AI</h3>
        <div className="flex items-center gap-3 mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3">Claude 3</option>
            <option value="gemini-pro">Gemini Pro</option>
          </select>
        </div>

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center py-8">Bắt đầu cuộc trò chuyện với AI...</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a]"
                    : "bg-white/5 text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 px-4 py-3 rounded-2xl">
                <Loader2 className="animate-spin" size={18} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
