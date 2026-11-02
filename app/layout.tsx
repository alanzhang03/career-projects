import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { isAdmin } from "@/lib/auth";
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
  title: "Project Log",
  description: "Projects I've worked on, by company.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="site-title">
            Alan Zhang · Project Log
          </Link>
          {(await isAdmin()) ? (
            <Link href="/admin" className="edit-link">
              Admin
            </Link>
          ) : null}
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
