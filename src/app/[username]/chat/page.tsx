"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Send, Image, FileText, FolderGit2, Loader2, Users, Plus, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  sender: { username: string };
}

interface Group {
  id: string;
  name: string;
  owner: { username: string };
  members: any[];
  messages: Message[];
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function ChatPage() {
  const params = useParams();
  const username = params?.username as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<"1-1" | "group">("1-1");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [receiverUsername, setReceiverUsername] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchGroups();
    fetchUsers();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages");
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/chat/groups");
      const data = await res.json();
      if (res.ok) {
        setGroups(data.groups || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    // TODO: Tạo API để lấy danh sách users
    // Tạm thời mock
    setUsers([
      { id: "1", username: "siloneedsleep", role: "OWNER" },
      { id: "2", username: "mioo", role: "OFFICIAL" },
      { id: "3", username: "minhvy", role: "VERIFIED" },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: "2", // TODO: Lấy từ selected user
          content: input,
          type: "text",
        }),
      });
      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const res = await fetch("/api/chat/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          memberIds: selectedMembers,
        }),
      });
      if (res.ok) {
        setNewGroupName("");
        setSelectedMembers([]);
        setShowGroupForm(false);
        fetchGroups();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Chat 💬</h1>
          <p className="text-gray-400">Trò chuyện real-time</p>
        </div>
        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
        >
          <Plus size={18} />
          Tạo Group
        </button>
      </div>

      {/* Group form */}
      {showGroupForm && (
        <form onSubmit={handleCreateGroup} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Tạo Group Chat</h3>
          <input
            type="text"
            placeholder="Tên group"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <div>
            <p className="text-sm text-gray-400 mb-2">Chọn members:</p>
            <div className="flex flex-wrap gap-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    if (selectedMembers.includes(user.id)) {
                      setSelectedMembers(selectedMembers.filter((id) => id !== user.id));
                    } else {
                      setSelectedMembers([...selectedMembers, user.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedMembers.includes(user.id)
                      ? "bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  @{user.username}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
          >
            Tạo group
          </button>
        </form>
      )}

      {/* Groups list */}
      {groups.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users size={18} /> Groups ({groups.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setActiveGroup(group);
                  setActiveChat("group");
                }}
                className={`px-4 py-2 rounded-xl transition ${
                  activeGroup?.id === group.id
                    ? "bg-sky-300/20 text-sky-300"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {activeChat === "group" && activeGroup ? `Group: ${activeGroup.name}` : "Chat 1-1"}
          </h3>
          <span className="text-xs text-emerald-400">● Online</span>
        </div>

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Chưa có tin nhắn nào.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.username === username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.sender.username === username
                      ? "bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a]"
                      : "bg-white/5 text-gray-200"
                  }`}
                >
                  {msg.type === "text" && msg.content}
                  {msg.type === "image" && <span>📷 Ảnh</span>}
                  {msg.type === "repo" && <span>📁 Repo</span>}
                  {msg.type === "file" && <span>📄 File</span>}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-3">
          <button type="button" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition">
            <Image size={18} />
          </button>
          <button type="button" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition">
            <FileText size={18} />
          </button>
          <button type="button" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition">
            <FolderGit2 size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
