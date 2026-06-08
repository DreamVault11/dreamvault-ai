"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CaptureModal } from "@/components/dream/CaptureModal";
import { Sparkles, ArrowLeft, Sun, Moon, CloudMoon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";

export default function CapturePage() {
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32 overflow-y-auto">
      <div className="max-w-md mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-white/5 text-foreground/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-white uppercase tracking-widest text-xs">Morning Ritual</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Greeting Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex p-4 rounded-full bg-dream-gradient/20 mb-4">
             <CloudMoon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Good morning.</h1>
          <p className="text-foreground/60 text-lg">
            Let's capture your dream <br /> 
            <span className="text-white font-medium">before it fades.</span>
          </p>
        </motion.div>

        {/* Habit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DreamCard className="p-8 space-y-8" glow>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">The 5-Minute Window</h2>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Memory of dreams fades by 50% within 5 minutes of waking up. Research shows that immediate recall strengthens the neural paths to your subconscious.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <DreamButton 
                 variant="gradient" 
                 size="lg" 
                 className="w-full py-6 text-xl"
                 onClick={() => setIsCaptureOpen(true)}
               >
                 Capture Dream
               </DreamButton>
               <Link href="/alarm">
                 <DreamButton variant="outline" className="w-full">
                   Adjust DreamWake™ Alarm
                 </DreamButton>
               </Link>
            </div>
          </DreamCard>
        </motion.div>

        {/* Stats / Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center space-x-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white">D7</div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/40">Current Streak</div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/40">Captured</div>
          </div>
        </motion.div>

        <CaptureModal isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} />
      </div>
    </div>
  );
}
