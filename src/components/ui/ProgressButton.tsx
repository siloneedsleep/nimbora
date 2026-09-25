"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { Loader2, Check } from "lucide-react";

type Status = "idle" | "loading" | "done" | "error";

interface ProgressButtonProps {
  onClick: () => Promise<void> | void;
  icon?: ReactNode;
  children: ReactNode;
  doneLabel?: string;
  errorLabel?: string;
  disabled?: boolean;
  className?: string;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
}

/**
 * Nút với progress fill khi đang chạy async action, đổi icon theo state
 * idle -> loading -> done (rồi tự reset sau 2s). Vì fetch() không báo
 * progress thật theo %, progress bar chạy kiểu "anticipated": nhích dần
 * tới ~90% trong lúc chờ, nhảy 100% ngay khi promise resolve — cho cảm
 * giác đang chạy mà không giả vờ biết trước thời gian thật.
 */
export function ProgressButton({
  onClick,
  icon,
  children,
  doneLabel = "Đã xong",
  errorLabel = "Lỗi",
  disabled = false,
  className = "",
  variant = "outline",
  type = "button",
}: ProgressButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (resetTimer.current) clearTimeout(resetTimer.current);
  };

  const handleClick = useCallback(async () => {
    if (status === "loading" || disabled) return;
    clearTimers();
    setStatus("loading");
    setProgress(0);

    // Nhích dần tới 90%, chậm lại khi gần tới để không "nói dối" là sắp xong
    progressTimer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.15 : p));
    }, 120);

    try {
      await onClick();
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgress(0);
      setStatus("error");
      console.error(err);
    } finally {
      resetTimer.current = setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 2000);
    }
  }, [onClick, status, disabled]);

  const base =
    variant === "solid"
      ? "bg-gradient-to-r from-sky-300 via-purple-300 to-pink-200 text-[#0a0e1a] font-semibold"
      : "border border-white/20 text-gray-200 hover:bg-white/5";

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full transition disabled:opacity-60 ${base} ${className}`}
    >
      {status === "loading" && (
        <span
          className="absolute inset-0 bg-white/15 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      )}
      <span className="relative flex items-center gap-2">
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "done" && <Check size={16} className="text-emerald-400" />}
        {status === "idle" && icon}
        {status === "error" && icon}
        <span>
          {status === "done" ? doneLabel : status === "error" ? errorLabel : children}
        </span>
      </span>
    </button>
  );
}
