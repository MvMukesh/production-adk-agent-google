import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADK Agent Studio",
  description: "Production Google ADK agent console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
