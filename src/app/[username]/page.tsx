"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Bot, Code2, FolderKanban, MessageCircle, Plus, Sparkles, Zap } from "lucide-react";

const modules = [
  { href: "ai-lab", icon: Bot, title: "AI Lab", desc: "Build and test intelligent workflows.", tone: "from-violet-500/20 to-fuchsia-500/5" },
  { href: "editor", icon: Code2, title: "Code Editor", desc: "Shape ideas into production-ready code.", tone: "from-sky-500/20 to-cyan-500/5" },
  { href: "projects", icon: FolderKanban, title: "Projects", desc: "Keep every project moving forward.", tone: "from-amber-500/20 to-orange-500/5" },
  { href: "knowledge", icon: BookOpen, title: "Knowledge", desc: "Your searchable second brain.", tone: "from-emerald-500/20 to-teal-500/5" },
  { href: "chat", icon: MessageCircle, title: "Team chat", desc: "Stay aligned without the noise.", tone: "from-blue-500/20 to-indigo-500/5" },
  { href: "automation", icon: Zap, title: "Automation", desc: "Turn repeatable work into momentum.", tone: "from-pink-500/20 to-rose-500/5" },
];

export default function WorkspaceHome() {
  const params = useParams();
  const username = params?.username as string;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 shadow-2xl shadow-sky-950/20 sm:p-10">
        <div className="absolute -right-20 -top-32 size-80 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-200"><Sparkles data-icon="inline-start" /> Personal workspace</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">Good to see you, {username}.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">One focused place for your code, ideas, knowledge, and intelligent workflows.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${username}/editor`} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"><Plus data-icon="inline-start" /> New workspace item</Link>
            <Link href={`/${username}/activity`} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">View activity <ArrowUpRight data-icon="inline-end" /></Link>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-sky-300">Your toolkit</p><h2 className="mt-1 font-display text-2xl font-semibold text-white">Pick up where you left off</h2></div><span className="hidden text-sm text-slate-500 sm:block">{modules.length} modules ready</span></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ href, icon: Icon, title, desc, tone }) => <Link key={href} href={`/${username}/${href}`} className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${tone} p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/20`}><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-black/20 text-sky-200"><Icon /></span><ArrowUpRight className="text-slate-500 transition group-hover:text-white" /></div><h3 className="mt-6 text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p></Link>)}
      </div>
    </div>
  );
}
