"use client";

const items = [
  "AI Lab",
  "Code Editor",
  "Projects",
  "Blog",
  "Chat",
  "Automation",
  "Cloud Workspace",
];

export default function Marquee() {
  return (
    <div className="border-y border-white/5 bg-white/[0.02] py-6 overflow-hidden relative z-10">
      <div className="marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-gray-500 flex items-center gap-3 text-lg whitespace-nowrap">
            {item} <span className="text-gray-700">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
