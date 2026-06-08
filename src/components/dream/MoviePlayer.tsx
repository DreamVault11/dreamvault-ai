"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ChevronRight, 
  Sparkles,
  Info,
  Layers,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieStyle, StoryboardFrame } from "@/types/dream";
import { cn } from "@/lib/utils";
import { DreamButton } from "@/components/ui/DreamButton";

interface MoviePlayerProps {
  videoUrl?: string;
  style: MovieStyle;
  storyboard: StoryboardFrame[];
  dreamTitle: string;
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({ 
  videoUrl, 
  style, 
  storyboard, 
  dreamTitle 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentage = (current / duration) * 100;
      setProgress(percentage);

      // Determine current scene based on cumulative duration
      let cumulativeTime = 0;
      for (let i = 0; i < storyboard.length; i++) {
        cumulativeTime += storyboard[i].duration_seconds;
        if (current <= cumulativeTime) {
          setCurrentSceneIndex(i);
          break;
        }
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const currentScene = storyboard[currentSceneIndex];

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-[40px] overflow-hidden group cursor-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls ? 'auto' : 'none' }}
    >
      {/* Video Element (Placeholder) */}
      <video
        ref={videoRef}
        src={videoUrl || "/placeholder-dream-movie.mp4"}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Cinematic Overlay - Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Scene Overlay - Text */}
      <AnimatePresence mode="wait">
        {currentScene && isPlaying && (
          <motion.div
            key={currentScene.scene_number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-32 left-12 right-12 pointer-events-none"
          >
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">
                Scene {currentScene.scene_number}: {currentScene.mood || style}
              </span>
              <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed italic">
                "{currentScene.description}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-8 z-10"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">{dreamTitle}</h3>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{style} Mode</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors text-white"
                >
                  <Info className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle - Play Button Big */}
            {!isPlaying && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="self-center w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center text-white shadow-[0_0_40px_rgba(155,77,255,0.3)]"
              >
                <Play className="w-8 h-8 fill-white" />
              </motion.button>
            )}

            {/* Bottom Controls */}
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden group/progress cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                  </button>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 group/volume">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                      <div className="w-20 h-1 bg-white/20 rounded-full">
                        <div className="w-2/3 h-full bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                    <Layers className="w-4 h-4 text-white/40" />
                    <span className="text-[10px] font-mono text-white/60">
                      {currentSceneIndex + 1} / {storyboard.length}
                    </span>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Side Drawer */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-black/40 backdrop-blur-3xl border-l border-white/10 z-20 p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Storyboard</h4>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {storyboard.map((scene, idx) => (
                <div 
                  key={scene.scene_number}
                  className={cn(
                    "p-4 rounded-2xl transition-all border",
                    currentSceneIndex === idx 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-white/5 border-transparent opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary">SCENE {scene.scene_number}</span>
                    <span className="text-[10px] text-white/40">{scene.duration_seconds}s</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed line-clamp-2 mb-2">
                    {scene.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {scene.camera_angle && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/60 uppercase">
                        {scene.camera_angle}
                      </span>
                    )}
                    {scene.mood && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/60 uppercase">
                        {scene.mood}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
