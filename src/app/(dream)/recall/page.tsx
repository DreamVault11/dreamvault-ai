"use client";

import React from "react";
import { RecallChat } from "@/components/dream/RecallChat";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RecallPage() {
  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-20 pb-32 overflow-hidden flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full flex-1 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between shrink-0"
        >
          <Link href="/capture" className="p-2 rounded-full hover:bg-white/5 text-foreground/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-white uppercase tracking-[0.3em] text-[10px]">Deep Recall Session</span>
          </div>
          <div className="w-10" />
        </motion.div>

        {/* Chat Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-h-0"
        >
          <RecallChat />
        </motion.div>
      </div>
    </div>
  );
}
