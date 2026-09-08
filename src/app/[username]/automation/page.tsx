"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Zap, Plus, Trash2, Play, Loader2, CheckCircle2, Clock, XCircle, Settings, FileText, Link2, Activity } from "lucide-react";

interface AgentTask {
  id: string;
  name: string;
  status: string;
  steps?: string;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
}

export default function AutomationPage() {
  const params = useParams();
  const username = params?.username as string;

  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillType, setNewSkillType] = useState<"markdown" | "url">("markdown");
  const [newSkillUrl, setNewSkillUrl] = useState("");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [error, setError] = useState("");
  const [activityLog, setActivityLog] = useState<string[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchSkills();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/tasks");
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
      } else {
        setError(data.error || "Lỗi tải tasks");
      }
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/agent/skills");
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const res = await fetch("/api/agent/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTaskName }),
      });
      if (res.ok) {
        setNewTaskName("");
        setShowTaskForm(false);
        fetchTasks();
        addLog(`Tạo task mới: ${newTaskName}`);
      }
    } catch (err) {
      setError("Lỗi tạo task");
    }
  };

  const handleRunTask = async (taskId: string, taskName: string) => {
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, action: "run" }),
      });
      if (res.ok) {
        fetchTasks();
        addLog(`Chạy task: ${taskName}`);
      }
    } catch (err) {
      setError("Lỗi chạy task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Xóa task này?")) return;
    try {
      const res = await fetch(`/api/agent/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        fetchTasks();
        addLog("Xóa task");
      }
    } catch (err) {
      setError("Lỗi xóa task");
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch("/api/agent/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSkillName,
          type: newSkillType,
          url: newSkillUrl,
          description: newSkillDesc,
        }),
      });
      if (res.ok) {
        setNewSkillName("");
        setNewSkillUrl("");
        setNewSkillDesc("");
        setShowSkillForm(false);
        fetchSkills();
        addLog(`Thêm skill: ${newSkillName}`);
      }
    } catch (err) {
      setError("Lỗi thêm skill");
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("vi-VN");
    setActivityLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={18} className="text-emerald-400" />;
      case "running":
        return <Loader2 size={18} className="text-yellow-400 animate-spin" />;
      case "pending":
        return <Clock size={18} className="text-gray-400" />;
      case "failed":
        return <XCircle size={18} className="text-red-400" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Automation ⚡</h1>
          <p className="text-gray-400">System Agent & Workflow tự động</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white/5 transition"
          >
            <Settings size={16} />
            Skills
          </button>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Task form */}
      {showTaskForm && (
        <form onSubmit={handleCreateTask} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Tạo task mới</h3>
          <input
            type="text"
            placeholder="Tên task (vd: Review code project X)"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
          >
            Tạo task
          </button>
        </form>
      )}

      {/* Skill form */}
      {showSkillForm && (
        <form onSubmit={handleCreateSkill} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Thêm Skill cho Agent</h3>
          <input
            type="text"
            placeholder="Tên skill"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            required
          />
          <select
            value={newSkillType}
            onChange={(e) => setNewSkillType(e.target.value as "markdown" | "url")}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          >
            <option value="markdown">Markdown</option>
            <option value="url">URL</option>
          </select>
          {newSkillType === "url" && (
            <input
              type="url"
              placeholder="URL"
              value={newSkillUrl}
              onChange={(e) => setNewSkillUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
            />
          )}
          <input
            type="text"
            placeholder="Mô tả"
            value={newSkillDesc}
            onChange={(e) => setNewSkillDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-sky-300/50 outline-none text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-300 to-purple-300 text-[#0a0e1a] font-semibold"
          >
            Thêm skill
          </button>
        </form>
      )}

      {/* Skills list */}
      {skills.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Skills ({skills.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {skill.type === "markdown" ? (
                    <FileText size={16} className="text-sky-300" />
                  ) : (
                    <Link2 size={16} className="text-purple-300" />
                  )}
                  <span className="font-medium text-sm">{skill.name}</span>
                </div>
                <p className="text-gray-400 text-xs">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks list */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Tasks ({tasks.length})</h3>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin mx-auto" size={24} />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Chưa có task nào.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <div className="text-sm font-medium">{task.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.result && (
                    <span className="text-xs text-gray-500 max-w-[200px] truncate">{task.result}</span>
                  )}
                  <button
                    onClick={() => handleRunTask(task.id, task.name)}
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity log */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Activity size={18} /> Activity Log
        </h3>
        {activityLog.length === 0 ? (
          <p className="text-gray-400 text-sm">Chưa có hoạt động nào.</p>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {activityLog.map((log, i) => (
              <div key={i} className="text-sm text-gray-400 font-mono">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
