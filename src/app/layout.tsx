import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbora - The cloud that thinks with you",
  description: "AI-native workspace for individuals and small teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
