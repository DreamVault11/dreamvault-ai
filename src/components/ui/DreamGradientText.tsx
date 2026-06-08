import React from "react";
import { cn } from "@/lib/utils";

interface DreamGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const DreamGradientText: React.FC<DreamGradientTextProps> = ({ children, className }) => {
  return (
    <span className={cn("text-dream-gradient", className)}>
      {children}
    </span>
  );
};
