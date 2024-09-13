import type { Metadata } from "next";
import "./globals.css";

import { Rubik } from "next/font/google";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AudioTrans - AI-Powered Audio Transcription",
  description: "Transcribe audio files with AI and create audio summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className}  antialiased`}>{children}</body>
    </html>
  );
}
