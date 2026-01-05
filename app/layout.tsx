import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "200x Dev | Courses for AI-native developers",
  description: "Learn to direct AI like a team of engineers. The exact Cursor workflow used by 40+ engineers at OpenAI. Ship production-quality software every week.",
  keywords: ["cursor", "ai coding", "agentic development", "cursor mastery", "ai developer", "cursor course"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${jetbrainsMono.variable} ${instrumentSerif.variable} ${outfit.variable} h-full antialiased`}
      >
        <ImpersonationBanner />
        {children}
      </body>
    </html>
  );
}
