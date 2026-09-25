import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PublicBlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { username: true, role: true, isVerified: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Blog</h1>
        
        {blogs.length === 0 ? (
          <p className="text-gray-400">Chưa có blog nào.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="block glass p-6 rounded-2xl hover:border-white/20 transition"
              >
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                  <span>@{blog.user.username}</span>
                  {(blog.user.role === "OWNER" || blog.user.role === "OFFICIAL") && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                      Official
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-400 line-clamp-2">{blog.content}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
