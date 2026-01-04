import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "200x Dev | 2026 Agentic Development: Cursor Mastery",
  description: "The advanced Cursor course for mid-to-senior engineers. Learn to 10x your output with AI agentic development. Built by an OpenAI team lead managing 40+ engineers.",
  keywords: ["cursor", "ai coding", "agentic development", "cursor mastery", "ai developer", "cursor course", "2026"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
