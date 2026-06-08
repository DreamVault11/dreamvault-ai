"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Compass, User, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Universe", href: "/universe", icon: Compass },
  { name: "Capture", href: "/capture", icon: Sparkles, isAction: true },
  { name: "Recall", href: "/recall", icon: Brain },
  { name: "Profile", href: "/dashboard", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-2xl border-t border-white/5 px-4 pb-6 pt-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-6 flex flex-col items-center gap-1"
              >
                <div className="w-14 h-14 rounded-full bg-dream-gradient flex items-center justify-center shadow-[0_0_20px_rgba(155,77,255,0.4)] transition-transform active:scale-90">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white mt-1 uppercase tracking-wider">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 py-2 px-4 transition-colors"
            >
              <item.icon className={cn(
                "w-6 h-6",
                isActive ? "text-primary" : "text-foreground/40"
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-white" : "text-foreground/40"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
