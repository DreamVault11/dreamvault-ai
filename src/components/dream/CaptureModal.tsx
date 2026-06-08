"use client";

import React, { useState } from "react";
import { Mic, PenTool, Upload, Sparkles, X, ChevronRight, Save, CheckCircle2 } from "lucide-react";
import { DreamModal } from "@/components/ui/DreamModal";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamInput } from "@/components/ui/DreamInput";
import { VoiceRecorder } from "./VoiceRecorder";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type CaptureMode = "voice" | "text" | "upload";

export const CaptureModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<CaptureMode>("voice");
  const [dreamText, setDreamText] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSaveDream = async () => {
    setIsSubmitting(true);
    // Mock save delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const handleVoiceComplete = (blob: Blob) => {
    console.log("Recording complete:", blob);
    handleSaveDream();
  };

  return (
    <DreamModal isOpen={isOpen} onClose={onClose} title={isSuccess ? "" : "Capture Your Dream"}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">Dream Captured!</h3>
              <p className="text-foreground/40 max-w-[200px] mx-auto">
                Your narrative has been saved to your timeline.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="capture"
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col space-y-6"
          >
            {/* Mode Selector */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              <button
                onClick={() => setMode("voice")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-all",
                  mode === "voice" ? "bg-white/10 text-white shadow-sm" : "text-foreground/40 hover:text-white"
                )}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice
              </button>
              <button
                onClick={() => setMode("text")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-all",
                  mode === "text" ? "bg-white/10 text-white shadow-sm" : "text-foreground/40 hover:text-white"
                )}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Text
              </button>
              <button
                onClick={() => setMode("upload")}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-all",
                  mode === "upload" ? "bg-white/10 text-white shadow-sm" : "text-foreground/40 hover:text-white"
                )}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[350px] relative">
              <AnimatePresence mode="wait">
                {mode === "voice" && (
                  <motion.div
                    key="voice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VoiceRecorder onRecordingComplete={handleVoiceComplete} />
                  </motion.div>
                )}

                {mode === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Dream Title</label>
                        <DreamInput 
                          placeholder="Give your dream a name..." 
                          value={dreamTitle}
                          onChange={(e) => setDreamTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Describe what you saw</label>
                        <textarea
                          value={dreamText}
                          onChange={(e) => setDreamText(e.target.value)}
                          placeholder="I was flying over a city made of glass..."
                          className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-foreground/20 focus:outline-none focus:border-primary/50 transition-all resize-none text-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                       <DreamButton 
                         variant="gradient" 
                         className="w-full py-4" 
                         disabled={!dreamText || isSubmitting}
                         onClick={handleSaveDream}
                       >
                         {isSubmitting ? "Processing..." : "Save Dream Narrative"}
                       </DreamButton>
                       <p className="text-center text-[10px] text-foreground/40 italic">
                         AI will analyze your text to extract symbols and characters.
                       </p>
                    </div>
                  </motion.div>
                )}

                {mode === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-white/10 rounded-3xl p-8 space-y-4 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-foreground/40" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">Click or drag audio file</p>
                      <p className="text-sm text-foreground/40">MP3, WAV, or M4A (Max 20MB)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Tips */}
            {!isSubmitting && (
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  <span className="font-bold">Tip:</span> Focus on sensory details like smells, colors, and emotions. These help the AI create a more accurate cinematic reconstruction.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DreamModal>
  );
};
