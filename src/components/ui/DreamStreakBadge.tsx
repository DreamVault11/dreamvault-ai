import React from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamStreakBadgeProps {
  streak: number;
  className?: string;
}

export const DreamStreakBadge: React.FC<DreamStreakBadgeProps> = ({ streak, className }) => {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold",
      className
    )}>
      <Zap className="w-3.5 h-3.5 fill-orange-400" />
      <span>{streak} Day Streak</span>
    </div>
  );
};
