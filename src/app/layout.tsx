import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pika919.github.io/Portfolio"),
  title: { default: "Ankit Das | AI & software engineer", template: "%s | Ankit Das" },
  description: "Ankit Das builds inspectable AI systems across computer vision, document AI, retrieval, and resource-aware inference.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pika919.github.io/Portfolio/",
    siteName: "Ankit Das Portfolio",
    title: "Ankit Das | AI & software engineer",
    description: "Computer vision, document AI, retrieval, and systems engineering.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0e0f14", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
