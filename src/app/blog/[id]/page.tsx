import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { username: true, role: true } },
    },
  });

  if (!blog || !blog.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-gray-400 hover:text-white mb-4 inline-block">
          ← Quay lại
        </Link>
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
          <span>@{blog.user.username}</span>
          {(blog.user.role === "OWNER" || blog.user.role === "OFFICIAL") && (
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
              Official
            </span>
          )}
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
