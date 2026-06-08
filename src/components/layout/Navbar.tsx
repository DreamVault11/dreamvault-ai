"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Sparkles, User, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DreamStreakBadge } from "@/components/ui/DreamStreakBadge";
import { DreamButton } from "@/components/ui/DreamButton";

const navItems = [
  { name: "Timeline", href: "/timeline" },
  { name: "Universe", href: "/universe" },
  { name: "Recall", href: "/recall" },
  { name: "Stats", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-[0_0_15px_rgba(155,77,255,0.5)] transition-shadow">
                <Moon className="w-5 h-5 text-white fill-white/20" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                DreamScape <span className="text-dream-gradient">AI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-foreground/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <DreamStreakBadge streak={5} className="mr-2" />
            <Link
              href="/capture"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-dream-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              Capture Dream
            </Link>
            <Link
              href="/login"
              className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-foreground/60 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-foreground/60 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-white/5 space-y-1">
              <Link
                href="/capture"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-md bg-dream-gradient text-white text-base font-semibold"
              >
                <Sparkles className="w-5 h-5" />
                Capture Dream
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-md text-foreground/60 hover:text-white"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
