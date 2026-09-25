"use client";

import { createContext, useCallback, useContext, useRef, useState, ReactNode } from "react";
import { Undo2, Trash2 } from "lucide-react";

const UNDO_WINDOW_MS = 5000;

interface ScheduleDeleteOptions {
  /** Key duy nhất cho item đang xóa (vd: project.id) */
  id: string;
  /** Tên hiển thị trong toast, vd: `Đã xóa "${project.name}"` */
  label: string;
  /** Gọi sau UNDO_WINDOW_MS nếu user không bấm Undo — nơi gọi DELETE thật */
  onCommit: () => Promise<void> | void;
  /** Gọi nếu user bấm Undo — nơi khôi phục lại item trong state của trang */
  onUndo?: () => void;
}

interface PendingDelete extends ScheduleDeleteOptions {
  startedAt: number;
}

interface UndoContextValue {
  scheduleDelete: (opts: ScheduleDeleteOptions) => void;
}

const UndoContext = createContext<UndoContextValue | null>(null);

export function useUndoDelete() {
  const ctx = useContext(UndoContext);
  if (!ctx) {
    throw new Error("useUndoDelete phải dùng bên trong <UndoToastProvider>");
  }
  return ctx;
}

export function UndoToastProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingDelete[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleDelete = useCallback((opts: ScheduleDeleteOptions) => {
    // Nếu đang có 1 pending delete khác cùng id (hiếm), commit ngay cái cũ trước
    const existingTimer = timers.current.get(opts.id);
    if (existingTimer) clearTimeout(existingTimer);

    setPending((prev) => [...prev.filter((p) => p.id !== opts.id), { ...opts, startedAt: Date.now() }]);

    const timer = setTimeout(async () => {
      timers.current.delete(opts.id);
      setPending((prev) => prev.filter((p) => p.id !== opts.id));
      try {
        await opts.onCommit();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }, UNDO_WINDOW_MS);

    timers.current.set(opts.id, timer);
  }, []);

  const handleUndo = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      item?.onUndo?.();
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return (
    <UndoContext.Provider value={{ scheduleDelete }}>
      {children}
      {pending.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
          {pending.map((item) => (
            <div key={item.id} className="glass rounded-2xl px-4 py-3 flex items-center gap-3 overflow-hidden relative">
              <span
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 animate-[undo-countdown_5s_linear_forwards]"
              />
              <Trash2 size={16} className="text-gray-400 shrink-0" />
              <span className="flex-1 text-sm text-gray-200 truncate">
                Đã xóa "{item.label}"
              </span>
              <button
                onClick={() => handleUndo(item.id)}
                className="flex items-center gap-1 text-sm font-medium text-sky-300 hover:text-sky-200 transition shrink-0"
              >
                <Undo2 size={14} />
                Hoàn tác
              </button>
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`
        @keyframes undo-countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </UndoContext.Provider>
  );
}
