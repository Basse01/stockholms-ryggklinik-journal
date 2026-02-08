import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stockholms Ryggklinik | AI Journalassistent",
  description: "Effektivisera din journalföring med AI - Stockholms Ryggklinik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
