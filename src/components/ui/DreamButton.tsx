import React from "react";
import { cn } from "@/lib/utils";

interface DreamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const DreamButton = React.forwardRef<HTMLButtonElement, DreamButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
      ghost: "bg-transparent text-white hover:bg-white/5",
      gradient: "bg-dream-gradient text-white hover:opacity-90 shadow-[0_0_20px_rgba(155,77,255,0.3)]",
      outline: "bg-transparent text-white border border-white/10 hover:bg-white/5",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

DreamButton.displayName = "DreamButton";
