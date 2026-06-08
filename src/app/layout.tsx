import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { Moon, Zap } from "lucide-react";
import Link from "next/link";
import { DreamStreakBadge } from "@/components/ui/DreamStreakBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DreamScape AI | Watch your dreams after you wake up",
  description: "Transform your forgotten dreams into cinematic AI movies and explore your personal dream universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-dream-mesh text-foreground selection:bg-primary/30 grainy-overlay">
        {/* Top Status Bar (Mobile) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Recall Active</span>
          </div>
          <DreamStreakBadge streak={5} />
        </div>

        <Navbar />
        <main className="flex-1 pt-12 md:pt-16 pb-24 md:pb-0">{children}</main>
        <MobileNav />
        <footer className="border-t border-white/5 py-12 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-secondary">
                   <Moon className="w-5 h-5 text-white fill-white/20" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  DreamScape <span className="text-dream-gradient">AI</span>
                </span>
              </div>
              <div className="flex gap-8 text-sm text-foreground/40">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <p className="text-sm text-foreground/20">
                © 2026 DreamScape AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
