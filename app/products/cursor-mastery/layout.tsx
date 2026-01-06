import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced Cursor Mastery | 200x.dev",
};

export default function CursorMasteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
