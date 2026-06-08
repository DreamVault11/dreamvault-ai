import React from "react";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

interface DreamInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onMicClick?: () => void;
  isListening?: boolean;
}

export const DreamInput = React.forwardRef<HTMLInputElement, DreamInputProps>(
  ({ className, onMicClick, isListening, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <input
          ref={ref}
          className={cn(
            "w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all",
            onMicClick && "pr-14",
            className
          )}
          {...props}
        />
        {onMicClick && (
          <button
            type="button"
            onClick={onMicClick}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
              isListening 
                ? "bg-secondary text-white animate-pulse" 
                : "text-foreground/40 hover:text-white hover:bg-white/5"
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

DreamInput.displayName = "DreamInput";
