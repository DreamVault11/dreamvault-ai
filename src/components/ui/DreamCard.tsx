import React from "react";
import { cn } from "@/lib/utils";

interface DreamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const DreamCard = React.forwardRef<HTMLDivElement, DreamCardProps>(
  ({ className, glow = false, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden",
          glow && "shadow-[0_0_30px_rgba(155,77,255,0.1)]",
          hoverEffect && "transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {glow && (
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

DreamCard.displayName = "DreamCard";
