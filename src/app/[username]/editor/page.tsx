"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function EditorPage() {
  const params = useParams();
  const username = params?.username as string;

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">💻</div>
      <h1 className="font-display text-2xl font-semibold mb-2">Code Editor</h1>
      <p className="text-gray-400 mb-4">Tính năng đang được xây dựng.</p>
      <Link href={`/${username}`} className="text-sky-300 hover:underline">Quay lại workspace</Link>
    </div>
  );
}
