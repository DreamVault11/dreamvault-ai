"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DreamModal: React.FC<DreamModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[101] max-h-[90vh] bg-[#0A0A0A] border-t border-white/10 rounded-t-[32px] overflow-hidden",
              "md:bottom-1/2 md:left-1/2 md:right-auto md:top-auto md:-translate-x-1/2 md:translate-y-1/2 md:w-full md:max-w-lg md:rounded-[32px] md:border",
              className
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-[#0A0A0A]/80 backdrop-blur-md">
              {title && <h3 className="text-xl font-bold">{title}</h3>}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-foreground/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-8 pb-12 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
